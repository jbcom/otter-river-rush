import { Otter } from './Otter';
import { Particle } from './Particle';
import { PowerUp } from './PowerUp';
import { Coin } from './Coin';
import { Gem } from './Gem';
import { ProceduralGenerator } from './ProceduralGenerator';
import { InputHandler } from './InputHandler';
import { Renderer } from '../rendering/Renderer';
import { UIRenderer, type PowerUpStatus } from '../rendering/UIRenderer';
import { BackgroundGenerator } from '../rendering/BackgroundGenerator';
import { ObjectPool } from '../utils/ObjectPool';
import {
  checkAABBCollision,
  randomRange,
  distance as calcDistance,
} from '../utils/math';
import { StorageManager, SaveData } from '../utils/StorageManager';
import { AchievementSystem } from './AchievementSystem';
import type { GameStats } from '@/types/Game.types';
import { AudioManager } from './AudioManager';
import {
  GameState,
  GameMode,
  GAME_CONFIG,
  PARTICLE_CONFIG,
  PowerUpType,
  POWERUP_CONFIG,
  MAGNET_CONFIG,
  GHOST_CONFIG,
  SLOW_MOTION_CONFIG,
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
  private gameMode: GameMode = GameMode.CLASSIC;
  private score: number = 0;
  private distance: number = 0;
  private coins: number = 0;
  private gems: number = 0;
  private combo: number = 0;
  private comboTimer: number = 0;
  private readonly COMBO_TIMEOUT = 3000; // 3 seconds to maintain combo
  private scrollSpeed: number = GAME_CONFIG.SCROLL_SPEED;
  private baseScrollSpeed: number = GAME_CONFIG.SCROLL_SPEED;
  private difficulty: number = 0;
  private lastTime: number = 0;
  private difficultyTimer: number = 0;

  // Power-up states
  private scoreMultiplier: number = 1;
  private scoreMultiplierEndTime: number = 0;
  private speedBoostEndTime: number = 0;
  private magnetEndTime: number = 0;
  private ghostEndTime: number = 0;
  private slowMotionEndTime: number = 0;

  // Stats
  private rocksAvoided: number = 0;
  private powerUpsCollected: number = 0;

  // Time Trial mode
  private timeTrialDuration: number = 60000; // 60 seconds
  private timeTrialStartTime: number = 0;
  private timeTrialTimeLeft: number = 60000;

  // Achievement popup queue
  private achievementQueue: Array<{ id: string; name: string }> = [];
  private showingAchievement: boolean = false;

  private saveData: SaveData;

  private scoreElement: HTMLElement;
  private startScreen: HTMLElement;
  private gameOverScreen: HTMLElement;
  private pauseScreen: HTMLElement;
  private classicButton: HTMLElement;
  private timeTrialButton: HTMLElement;
  private zenButton: HTMLElement;
  private dailyButton: HTMLElement;
  private restartButton: HTMLElement;
  private resumeButton: HTMLElement;
  private menuButton: HTMLElement;
  private quitButton: HTMLElement;
  private finalScoreElement: HTMLElement;
  private finalDistanceElement: HTMLElement;
  private finalCoinsElement: HTMLElement;
  private finalGemsElement: HTMLElement;
  private highScoreElement: HTMLElement;
  private achievementPopup: HTMLElement;
  private achievementName: HTMLElement;

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
    this.classicButton = document.getElementById('classicButton')!;
    this.timeTrialButton = document.getElementById('timeTrialButton')!;
    this.zenButton = document.getElementById('zenButton')!;
    this.dailyButton = document.getElementById('dailyButton')!;
    this.restartButton = document.getElementById('restartButton')!;
    this.resumeButton = document.getElementById('resumeButton')!;
    this.menuButton = document.getElementById('menuButton')!;
    this.quitButton = document.getElementById('quitButton')!;
    this.finalScoreElement = document.getElementById('finalScore')!;
    this.finalDistanceElement = document.getElementById('finalDistance')!;
    this.finalCoinsElement = document.getElementById('finalCoins')!;
    this.finalGemsElement = document.getElementById('finalGems')!;
    this.highScoreElement = document.getElementById('highScore')!;
    this.achievementPopup = document.getElementById('achievementPopup')!;
    this.achievementName = document.getElementById('achievementName')!;

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
    this.classicButton.addEventListener('click', () =>
      this.start(GameMode.CLASSIC)
    );
    this.timeTrialButton.addEventListener('click', () =>
      this.start(GameMode.TIME_TRIAL)
    );
    this.zenButton.addEventListener('click', () => this.start(GameMode.ZEN));
    this.dailyButton.addEventListener('click', () => {
      // TODO: Implement daily challenge generation
      this.start(GameMode.DAILY_CHALLENGE);
    });
    this.restartButton.addEventListener('click', () => this.restart());
    this.resumeButton.addEventListener('click', () => this.resume());
    this.menuButton.addEventListener('click', () => this.returnToMenu());
    this.quitButton.addEventListener('click', () => this.returnToMenu());
  }

  private returnToMenu(): void {
    this.state = GameState.MENU;
    this.startScreen.classList.remove('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
  }

  start(mode: GameMode = GameMode.CLASSIC): void {
    this.state = GameState.PLAYING;
    this.gameMode = mode;
    this.score = 0;
    this.distance = 0;
    this.coins = 0;
    this.gems = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.scrollSpeed = GAME_CONFIG.SCROLL_SPEED;
    this.baseScrollSpeed = GAME_CONFIG.SCROLL_SPEED;
    this.difficulty = 0;
    this.difficultyTimer = 0;
    this.scoreMultiplier = 1;
    this.scoreMultiplierEndTime = 0;
    this.speedBoostEndTime = 0;
    this.magnetEndTime = 0;
    this.ghostEndTime = 0;
    this.slowMotionEndTime = 0;
    this.rocksAvoided = 0;
    this.powerUpsCollected = 0;

    // Set up mode-specific settings
    if (mode === GameMode.TIME_TRIAL) {
      this.timeTrialStartTime = performance.now();
      this.timeTrialTimeLeft = this.timeTrialDuration;
    } else if (mode === GameMode.ZEN) {
      // Zen mode: slower, more relaxing
      this.scrollSpeed = GAME_CONFIG.SCROLL_SPEED * 0.6;
      this.baseScrollSpeed = this.scrollSpeed;
    }

    this.generator.setGameMode(mode);
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
    this.start(this.gameMode); // Restart with same mode
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
      // Queue achievements for display
      newAchievements.forEach((ach) => {
        this.achievementQueue.push({
          id: ach.id,
          name: ach.name,
        });
      });
      this.showNextAchievement();
    }

    this.saveData.achievements = this.achievementSystem.getUnlockedIds();
    StorageManager.save(this.saveData);

    this.finalScoreElement.textContent = `Score: ${this.score}`;
    this.finalDistanceElement.textContent = `Distance: ${Math.floor(this.distance)}m`;
    this.finalCoinsElement.textContent = `Coins: ${this.coins}`;
    this.finalGemsElement.textContent = `Gems: ${this.gems}`;
    this.highScoreElement.textContent = `High Score: ${this.saveData.highScore}`;
  }

  private showNextAchievement(): void {
    if (this.showingAchievement || this.achievementQueue.length === 0) {
      return;
    }

    this.showingAchievement = true;
    const achievement = this.achievementQueue.shift()!;

    this.achievementName.textContent = achievement.name;
    this.achievementPopup.classList.remove('hidden');

    // Hide after 4 seconds
    window.setTimeout(() => {
      this.achievementPopup.classList.add('hidden');
      this.showingAchievement = false;

      // Show next achievement if any
      if (this.achievementQueue.length > 0) {
        window.setTimeout(() => this.showNextAchievement(), 500);
      }
    }, 4000);
  }

  update(currentTime: number): void {
    if (this.state !== GameState.PLAYING) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Time Trial: check if time is up
    if (this.gameMode === GameMode.TIME_TRIAL) {
      this.timeTrialTimeLeft =
        this.timeTrialDuration - (currentTime - this.timeTrialStartTime);
      if (this.timeTrialTimeLeft <= 0) {
        this.gameOver();
        return;
      }
    }

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
    this.updateCoins(deltaTime);
    this.updateGems(deltaTime);
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
    const now = currentTime;

    // Score Multiplier
    if (this.scoreMultiplierEndTime > 0 && now >= this.scoreMultiplierEndTime) {
      this.scoreMultiplier = 1;
      this.scoreMultiplierEndTime = 0;
    }

    // Speed Boost (makes game slower - easier to control)
    if (this.speedBoostEndTime > 0 && now >= this.speedBoostEndTime) {
      this.scrollSpeed = Math.min(
        this.baseScrollSpeed + this.difficulty * 20,
        GAME_CONFIG.MAX_SCROLL_SPEED
      );
      this.speedBoostEndTime = 0;
    }

    // Magnet (auto-collect nearby coins/gems)
    if (this.magnetEndTime > 0 && now >= this.magnetEndTime) {
      this.magnetEndTime = 0;
    }

    // Ghost (pass through obstacles)
    if (this.ghostEndTime > 0 && now >= this.ghostEndTime) {
      this.ghostEndTime = 0;
      this.otter.isGhost = false;
    }

    // Slow Motion
    if (this.slowMotionEndTime > 0 && now >= this.slowMotionEndTime) {
      this.scrollSpeed = this.baseScrollSpeed;
      this.slowMotionEndTime = 0;
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

  private updateCoins(deltaTime: number): void {
    const coins = this.generator.getActiveCoins();
    const otterAABB = this.otter.getAABB();
    const otterCenterX = otterAABB.x + otterAABB.width / 2;
    const otterCenterY = otterAABB.y + otterAABB.height / 2;
    const magnetActive = this.magnetEndTime > performance.now();

    coins.forEach((coin) => {
      coin.update(deltaTime, this.scrollSpeed);

      // Magnet effect - pull coins towards otter
      if (magnetActive) {
        const coinAABB = coin.getAABB();
        const coinCenterX = coinAABB.x + coinAABB.width / 2;
        const coinCenterY = coinAABB.y + coinAABB.height / 2;
        const dist = calcDistance(
          { x: otterCenterX, y: otterCenterY },
          { x: coinCenterX, y: coinCenterY }
        );

        if (dist < MAGNET_CONFIG.RADIUS) {
          // Pull coin towards otter
          const pullSpeed = 400;
          const dx = otterCenterX - coinCenterX;
          const dy = otterCenterY - coinCenterY;
          const mag = Math.sqrt(dx * dx + dy * dy);
          if (mag > 0) {
            coin.x += (dx / mag) * pullSpeed * deltaTime;
            coin.y += (dy / mag) * pullSpeed * deltaTime;
          }
        }
      }

      if (coin.isOffScreen(GAME_CONFIG.CANVAS_HEIGHT)) {
        this.generator.releaseCoin(coin);
      }
    });
  }

  private updateGems(deltaTime: number): void {
    const gems = this.generator.getActiveGems();
    const otterAABB = this.otter.getAABB();
    const otterCenterX = otterAABB.x + otterAABB.width / 2;
    const otterCenterY = otterAABB.y + otterAABB.height / 2;
    const magnetActive = this.magnetEndTime > performance.now();

    gems.forEach((gem) => {
      gem.update(deltaTime, this.scrollSpeed);

      // Magnet effect
      if (magnetActive) {
        const gemAABB = gem.getAABB();
        const gemCenterX = gemAABB.x + gemAABB.width / 2;
        const gemCenterY = gemAABB.y + gemAABB.height / 2;
        const dist = calcDistance(
          { x: otterCenterX, y: otterCenterY },
          { x: gemCenterX, y: gemCenterY }
        );

        if (dist < MAGNET_CONFIG.RADIUS) {
          const pullSpeed = 450;
          const dx = otterCenterX - gemCenterX;
          const dy = otterCenterY - gemCenterY;
          const mag = Math.sqrt(dx * dx + dy * dy);
          if (mag > 0) {
            gem.x += (dx / mag) * pullSpeed * deltaTime;
            gem.y += (dy / mag) * pullSpeed * deltaTime;
          }
        }
      }

      if (gem.isOffScreen(GAME_CONFIG.CANVAS_HEIGHT)) {
        this.generator.releaseGem(gem);
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
    const isGhost = this.ghostEndTime > performance.now();

    // Check rock collisions (skip if ghost mode)
    if (!isGhost) {
      const rocks = this.generator.getActiveRocks();
      for (const rock of rocks) {
        if (rock.active && checkAABBCollision(otterAABB, rock.getAABB())) {
          if (this.otter.hasShield) {
            this.otter.hasShield = false;
            this.generator.releaseRock(rock);
            this.audioManager.playSound('shield');
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
    }

    // Check power-up collisions
    const powerUps = this.generator.getActivePowerUps();
    for (const powerUp of powerUps) {
      if (powerUp.active && checkAABBCollision(otterAABB, powerUp.getAABB())) {
        this.collectPowerUp(powerUp);
        this.generator.releasePowerUp(powerUp);
      }
    }

    // Check coin collisions
    const coins = this.generator.getActiveCoins();
    for (const coin of coins) {
      if (coin.active && checkAABBCollision(otterAABB, coin.getAABB())) {
        this.collectCoin(coin);
        this.generator.releaseCoin(coin);
      }
    }

    // Check gem collisions
    const gems = this.generator.getActiveGems();
    for (const gem of gems) {
      if (gem.active && checkAABBCollision(otterAABB, gem.getAABB())) {
        this.collectGem(gem);
        this.generator.releaseGem(gem);
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
      case PowerUpType.MAGNET:
        this.magnetEndTime = currentTime + MAGNET_CONFIG.DURATION;
        break;
      case PowerUpType.GHOST:
        this.otter.isGhost = true;
        this.ghostEndTime = currentTime + GHOST_CONFIG.DURATION;
        break;
      case PowerUpType.SLOW_MOTION:
        this.scrollSpeed *= SLOW_MOTION_CONFIG.SPEED_MULTIPLIER;
        this.slowMotionEndTime = currentTime + SLOW_MOTION_CONFIG.DURATION;
        break;
    }

    this.createParticles(
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2,
      '#fbbf24'
    );
  }

  private collectCoin(coin: Coin): void {
    this.coins += coin.value;
    this.score += coin.value * 10; // Coins also add to score
    this.combo++;
    this.comboTimer = this.COMBO_TIMEOUT;

    this.audioManager.playSound('coin');
    this.createParticles(
      coin.x + coin.width / 2,
      coin.y + coin.height / 2,
      coin.getColor()
    );
  }

  private collectGem(gem: Gem): void {
    this.gems += gem.value;
    this.score += gem.value * 50; // Gems worth more!
    this.combo += 2; // Gems give bigger combo boost
    this.comboTimer = this.COMBO_TIMEOUT;

    this.audioManager.playSound('gem');
    this.createParticles(
      gem.x + gem.width / 2,
      gem.y + gem.height / 2,
      gem.getColor()
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

    const coins = this.generator.getActiveCoins();
    this.renderer.renderCoins(coins);

    const gems = this.generator.getActiveGems();
    this.renderer.renderGems(gems);

    const powerUps = this.generator.getActivePowerUps();
    this.renderer.renderPowerUps(powerUps);

    // Render otter with ghost effect if active
    const isGhost = this.ghostEndTime > performance.now();
    if (isGhost) {
      this.renderer['ctx'].globalAlpha = GHOST_CONFIG.ALPHA;
    }
    this.renderer.renderOtter(this.otter);
    if (isGhost) {
      this.renderer['ctx'].globalAlpha = 1;
    }

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

      // Show time remaining for Time Trial
      if (this.gameMode === GameMode.TIME_TRIAL) {
        this.renderTimeTrialTimer();
      }

      // Show biome transition notification
      if (this.backgroundGenerator.isNewBiome()) {
        this.uiRenderer.renderBiomeTransition(
          this.backgroundGenerator.getBiomeName()
        );
      }
    }
  }

  private renderTimeTrialTimer(): void {
    const ctx = this.renderer['ctx'];
    const secondsLeft = Math.ceil(this.timeTrialTimeLeft / 1000);

    ctx.save();
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = secondsLeft <= 10 ? '#ef4444' : '#fbbf24';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText(`${secondsLeft}s`, GAME_CONFIG.CANVAS_WIDTH / 2, 80);
    ctx.fillText(`${secondsLeft}s`, GAME_CONFIG.CANVAS_WIDTH / 2, 80);
    ctx.restore();
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

    if (this.magnetEndTime > now) {
      statuses.push({
        type: 'MAGNET',
        active: true,
        duration: MAGNET_CONFIG.DURATION,
        timeLeft: this.magnetEndTime - now,
      });
    }

    if (this.ghostEndTime > now) {
      statuses.push({
        type: 'GHOST',
        active: true,
        duration: GHOST_CONFIG.DURATION,
        timeLeft: this.ghostEndTime - now,
      });
    }

    if (this.slowMotionEndTime > now) {
      statuses.push({
        type: 'SLOW_MOTION',
        active: true,
        duration: SLOW_MOTION_CONFIG.DURATION,
        timeLeft: this.slowMotionEndTime - now,
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
