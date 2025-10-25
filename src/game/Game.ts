import { Otter } from './Otter';
import { Particle } from './Particle';
import { PowerUp } from './PowerUp';
import { ProceduralGenerator } from './ProceduralGenerator';
import { InputHandler } from './InputHandler';
import { Renderer } from '../rendering/Renderer';
import { UIRenderer, type PowerUpStatus } from '../rendering/UIRenderer';
// import { SpriteFactory } from '../rendering/SpriteFactory';
import { BackgroundGenerator } from '../rendering/BackgroundGenerator';
import { ObjectPool } from '../utils/ObjectPool';
import { checkAABBCollision, randomRange } from '../utils/math';
import { StorageManager, SaveData } from '../utils/StorageManager';
import { AchievementSystem } from './AchievementSystem';
import type { GameStats } from '@/types/Game.types';
import { AudioManager } from './AudioManager';
import {
  GameState,
  GAME_CONFIG,
  PARTICLE_CONFIG,
  PowerUpType,
  POWERUP_CONFIG,
} from './constants';

export class Game {
  private renderer: Renderer;
  private uiRenderer: UIRenderer;
  // TODO: Add SpriteFactory when we replace rectangle rendering with proper sprites
  private backgroundGenerator: BackgroundGenerator;
  private otter: Otter;
  private generator: ProceduralGenerator;
  private inputHandler: InputHandler;
  private particlePool: ObjectPool<Particle>;
  private audioManager: AudioManager;
  private achievementSystem: AchievementSystem;

  private state: GameState = GameState.MENU;
  private score: number = 0;
  private distance: number = 0;
  private coins: number = 0;
  private gems: number = 0;
  private combo: number = 0;
  private comboTimer: number = 0;
  private readonly COMBO_TIMEOUT = 3000; // 3 seconds to maintain combo
  private scrollSpeed: number = GAME_CONFIG.SCROLL_SPEED;
  private difficulty: number = 0;
  private lastTime: number = 0;
  private difficultyTimer: number = 0;

  private scoreMultiplier: number = 1;
  private scoreMultiplierEndTime: number = 0;
  private speedBoostEndTime: number = 0;
  private rocksAvoided: number = 0;
  private powerUpsCollected: number = 0;

  private saveData: SaveData;

  private scoreElement: HTMLElement;
  private startScreen: HTMLElement;
  private gameOverScreen: HTMLElement;
  private pauseScreen: HTMLElement;
  private startButton: HTMLElement;
  private restartButton: HTMLElement;
  private resumeButton: HTMLElement;
  private finalScoreElement: HTMLElement;
  private highScoreElement: HTMLElement;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.uiRenderer = new UIRenderer(canvas, {
      showFPS: false,
      showDebug: false,
    });
    // TODO: Initialize SpriteFactory when we replace rectangle rendering
    // this.spriteFactory = new SpriteFactory(64);
    this.backgroundGenerator = new BackgroundGenerator(canvas);
    this.otter = new Otter();
    this.generator = new ProceduralGenerator();
    this.inputHandler = new InputHandler(canvas);
    this.audioManager = new AudioManager();

    this.particlePool = new ObjectPool(
      () => new Particle(),
      (particle) => particle.reset(),
      50
    );

    this.saveData = StorageManager.load() || StorageManager.getDefaultData();
    this.achievementSystem = new AchievementSystem(this.saveData.achievements);

    this.audioManager.setSoundEnabled(this.saveData.settings.soundEnabled);
    this.audioManager.setMusicEnabled(this.saveData.settings.musicEnabled);

    this.scoreElement = document.getElementById('score')!;
    this.startScreen = document.getElementById('startScreen')!;
    this.gameOverScreen = document.getElementById('gameOverScreen')!;
    this.pauseScreen = document.getElementById('pauseScreen')!;
    this.startButton = document.getElementById('startButton')!;
    this.restartButton = document.getElementById('restartButton')!;
    this.resumeButton = document.getElementById('resumeButton')!;
    this.finalScoreElement = document.getElementById('finalScore')!;
    this.highScoreElement = document.getElementById('highScore')!;

    this.setupInputHandlers();
    this.setupUIHandlers();
    this.updateUI();
  }

  private setupInputHandlers(): void {
    this.inputHandler.onLeft(() => {
      if (this.state === GameState.PLAYING) {
        this.otter.moveLeft();
        this.audioManager.playSound('move');
      }
    });

    this.inputHandler.onRight(() => {
      if (this.state === GameState.PLAYING) {
        this.otter.moveRight();
        this.audioManager.playSound('move');
      }
    });

    this.inputHandler.onPause(() => {
      if (this.state === GameState.PLAYING) {
        this.pause();
      }
    });
  }

  private setupUIHandlers(): void {
    this.startButton.addEventListener('click', () => this.start());
    this.restartButton.addEventListener('click', () => this.restart());
    this.resumeButton.addEventListener('click', () => this.resume());
  }

  start(): void {
    this.state = GameState.PLAYING;
    this.score = 0;
    this.distance = 0;
    this.coins = 0;
    this.gems = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.scrollSpeed = GAME_CONFIG.SCROLL_SPEED;
    this.difficulty = 0;
    this.difficultyTimer = 0;
    this.scoreMultiplier = 1;
    this.scoreMultiplierEndTime = 0;
    this.speedBoostEndTime = 0;
    this.rocksAvoided = 0;
    this.powerUpsCollected = 0;

    this.otter.reset();
    this.generator.reset();
    this.particlePool.releaseAll();

    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');

    this.lastTime = performance.now();
    this.updateUI();
  }

  restart(): void {
    this.start();
  }

  pause(): void {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
      this.pauseScreen.classList.remove('hidden');
    }
  }

  resume(): void {
    if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING;
      this.pauseScreen.classList.add('hidden');
      this.lastTime = performance.now();
    }
  }

  gameOver(): void {
    this.state = GameState.GAME_OVER;
    this.gameOverScreen.classList.remove('hidden');

    if (this.score > this.saveData.highScore) {
      this.saveData.highScore = this.score;
    }
    this.saveData.totalGamesPlayed++;

    const stats: GameStats = {
      score: this.score,
      distance: this.distance,
      coins: this.coins,
      gems: this.gems,
      combo: this.combo,
      multiplier: this.scoreMultiplier,
      powerUpsCollected: this.powerUpsCollected,
      obstaclesAvoided: this.rocksAvoided,
      gamesPlayed: this.saveData.totalGamesPlayed,
      closeCallsCount: 0,
    };

    const newAchievements = this.achievementSystem.check(stats);
    if (newAchievements.length > 0) {
      this.audioManager.playSound('achievement');
      // Achievement unlocked - could show UI notification here
    }

    this.saveData.achievements = this.achievementSystem.getUnlockedIds();
    StorageManager.save(this.saveData);

    this.finalScoreElement.textContent = `Score: ${this.score}`;
    this.highScoreElement.textContent = `High Score: ${this.saveData.highScore}`;
  }

  update(currentTime: number): void {
    if (this.state !== GameState.PLAYING) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.updateDifficulty(deltaTime);
    this.updatePowerUps(currentTime);
    this.updateCombo(deltaTime);

    this.otter.update(deltaTime);
    this.generator.update(this.scrollSpeed, this.difficulty, deltaTime);
    this.renderer.update(deltaTime);

    // Update background generator with biome system
    this.backgroundGenerator.update(deltaTime, this.scrollSpeed, this.distance);

    this.updateRocks(deltaTime);
    this.updatePowerUpItems(deltaTime);
    this.updateParticles(deltaTime);

    this.checkCollisions();

    this.distance += this.scrollSpeed * deltaTime;
    this.score += Math.floor(
      this.scrollSpeed *
        deltaTime *
        this.scoreMultiplier *
        (1 + this.combo * 0.1)
    );

    this.updateUI();
  }

  private updateCombo(deltaTime: number): void {
    if (this.combo > 0) {
      this.comboTimer -= deltaTime * 1000;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }
  }

  private updateDifficulty(deltaTime: number): void {
    this.difficultyTimer += deltaTime * 1000;

    if (this.difficultyTimer >= GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL) {
      this.difficultyTimer = 0;
      this.difficulty += GAME_CONFIG.DIFFICULTY_INCREASE_RATE;

      const speedIncrease =
        (GAME_CONFIG.MAX_SCROLL_SPEED - GAME_CONFIG.MIN_SCROLL_SPEED) *
        GAME_CONFIG.DIFFICULTY_INCREASE_RATE;
      this.scrollSpeed = Math.min(
        this.scrollSpeed + speedIncrease,
        GAME_CONFIG.MAX_SCROLL_SPEED
      );
    }
  }

  private updatePowerUps(currentTime: number): void {
    if (
      this.scoreMultiplierEndTime > 0 &&
      currentTime >= this.scoreMultiplierEndTime
    ) {
      this.scoreMultiplier = 1;
      this.scoreMultiplierEndTime = 0;
    }

    if (this.speedBoostEndTime > 0 && currentTime >= this.speedBoostEndTime) {
      this.scrollSpeed = Math.min(
        GAME_CONFIG.SCROLL_SPEED + this.difficulty * 20,
        GAME_CONFIG.MAX_SCROLL_SPEED
      );
      this.speedBoostEndTime = 0;
    }
  }

  private updateRocks(deltaTime: number): void {
    const rocks = this.generator.getActiveRocks();
    rocks.forEach((rock) => {
      rock.update(deltaTime, this.scrollSpeed);

      if (rock.isOffScreen(GAME_CONFIG.CANVAS_HEIGHT)) {
        this.generator.releaseRock(rock);
        this.rocksAvoided++;
        // Increment combo for dodging rocks
        this.combo++;
        this.comboTimer = this.COMBO_TIMEOUT;
      }
    });
  }

  private updatePowerUpItems(deltaTime: number): void {
    const powerUps = this.generator.getActivePowerUps();
    powerUps.forEach((powerUp) => {
      powerUp.update(deltaTime, this.scrollSpeed);

      if (powerUp.isOffScreen(GAME_CONFIG.CANVAS_HEIGHT)) {
        this.generator.releasePowerUp(powerUp);
      }
    });
  }

  private updateParticles(deltaTime: number): void {
    const particles = this.particlePool.getActive();
    particles.forEach((particle) => {
      particle.update(deltaTime);
      if (!particle.active) {
        this.particlePool.release(particle);
      }
    });
  }

  private checkCollisions(): void {
    const otterAABB = this.otter.getAABB();

    const rocks = this.generator.getActiveRocks();
    for (const rock of rocks) {
      if (rock.active && checkAABBCollision(otterAABB, rock.getAABB())) {
        if (this.otter.hasShield) {
          this.otter.hasShield = false;
          this.generator.releaseRock(rock);
          this.createParticles(
            rock.x + rock.width / 2,
            rock.y + rock.height / 2,
            '#60a5fa'
          );
        } else {
          this.audioManager.playSound('collision');
          this.createParticles(
            this.otter.x + this.otter.width / 2,
            this.otter.y + this.otter.height / 2,
            '#d2691e'
          );
          // Reset combo on collision/death
          this.combo = 0;
          this.comboTimer = 0;
          this.gameOver();
          return;
        }
      }
    }

    const powerUps = this.generator.getActivePowerUps();
    for (const powerUp of powerUps) {
      if (powerUp.active && checkAABBCollision(otterAABB, powerUp.getAABB())) {
        this.collectPowerUp(powerUp);
        this.generator.releasePowerUp(powerUp);
      }
    }
  }

  private collectPowerUp(powerUp: PowerUp): void {
    this.audioManager.playSound('powerup');
    this.powerUpsCollected++;

    const currentTime = performance.now();

    switch (powerUp.type) {
      case PowerUpType.SHIELD:
        this.otter.hasShield = true;
        break;
      case PowerUpType.SPEED_BOOST:
        this.scrollSpeed *= 0.7;
        this.speedBoostEndTime = currentTime + POWERUP_CONFIG.DURATION;
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        this.scoreMultiplier = 2;
        this.scoreMultiplierEndTime = currentTime + POWERUP_CONFIG.DURATION;
        break;
    }

    this.createParticles(
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2,
      '#fbbf24'
    );
  }

  private createParticles(x: number, y: number, color: string): void {
    for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
      const particle = this.particlePool.acquire();
      const angle = (Math.PI * 2 * i) / PARTICLE_CONFIG.COUNT;
      const speed = PARTICLE_CONFIG.SPEED;
      particle.init(
        { x, y },
        { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        PARTICLE_CONFIG.LIFETIME,
        color,
        randomRange(3, 6)
      );
    }
  }

  render(): void {
    this.renderer.clear();

    // Show loading screen if sprites aren't loaded yet
    if (!this.renderer.areSpritesLoaded() && this.state === GameState.MENU) {
      this.renderer.renderLoadingScreen();
      return;
    }

    // Render new dynamic background with biomes
    this.backgroundGenerator.render();

    this.renderer.renderLanes();

    const rocks = this.generator.getActiveRocks();
    this.renderer.renderRocks(rocks);

    const powerUps = this.generator.getActivePowerUps();
    this.renderer.renderPowerUps(powerUps);

    this.renderer.renderOtter(this.otter);

    const particles = this.particlePool.getActive();
    this.renderer.renderParticles(particles);

    // Render HUD if playing
    if (this.state === GameState.PLAYING) {
      const gameStats: GameStats = {
        score: this.score,
        distance: this.distance,
        coins: this.coins,
        gems: this.gems,
        combo: this.combo,
        multiplier: this.scoreMultiplier,
        obstaclesAvoided: this.rocksAvoided,
        powerUpsCollected: this.powerUpsCollected,
        gamesPlayed: this.saveData.totalGamesPlayed,
        closeCallsCount: 0,
      };

      const powerUpStatuses: PowerUpStatus[] = this.getActivePowerUpStatuses();
      this.uiRenderer.renderHUD(gameStats, powerUpStatuses);

      // Show biome transition notification
      if (this.backgroundGenerator.isNewBiome()) {
        this.uiRenderer.renderBiomeTransition(
          this.backgroundGenerator.getBiomeName()
        );
      }
    }
  }

  private getActivePowerUpStatuses(): PowerUpStatus[] {
    const now = performance.now();
    const statuses: PowerUpStatus[] = [];

    if (this.otter.hasShield) {
      statuses.push({
        type: 'SHIELD',
        active: true,
        duration: 0,
        timeLeft: 0,
      });
    }

    if (this.scoreMultiplierEndTime > now) {
      statuses.push({
        type: 'SCORE_MULTIPLIER',
        active: true,
        duration: POWERUP_CONFIG.DURATION,
        timeLeft: this.scoreMultiplierEndTime - now,
      });
    }

    if (this.speedBoostEndTime > now) {
      statuses.push({
        type: 'SPEED_BOOST',
        active: true,
        duration: POWERUP_CONFIG.DURATION,
        timeLeft: this.speedBoostEndTime - now,
      });
    }

    return statuses;
  }

  private updateUI(): void {
    this.scoreElement.textContent = `Score: ${this.score}`;
  }

  loop = (currentTime: number): void => {
    this.update(currentTime);
    this.render();
    requestAnimationFrame(this.loop);
  };

  run(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  cleanup(): void {
    this.inputHandler.cleanup();
    this.audioManager.cleanup();
  }
}
