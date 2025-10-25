import { Rock } from './Rock';
import { PowerUp } from './PowerUp';
import { GAME_CONFIG, ROCK_CONFIG, POWERUP_CONFIG, PowerUpType } from './constants';
import { randomInt, randomRange } from '../utils/math';
import { ObjectPool } from '../utils/ObjectPool';

export class ProceduralGenerator {
  private rockPool: ObjectPool<Rock>;
  private powerUpPool: ObjectPool<PowerUp>;
  private lastSpawnY: number;
  private minSpawnDistance: number;
  private maxSpawnDistance: number;

  constructor() {
    this.rockPool = new ObjectPool(
      () => new Rock(),
      (rock) => rock.reset(),
      30
    );
    this.powerUpPool = new ObjectPool(
      () => new PowerUp(),
      (powerUp) => powerUp.reset(),
      10
    );
    this.lastSpawnY = -ROCK_CONFIG.MIN_SPAWN_DISTANCE;
    this.minSpawnDistance = ROCK_CONFIG.MIN_SPAWN_DISTANCE;
    this.maxSpawnDistance = ROCK_CONFIG.MAX_SPAWN_DISTANCE;
  }

  update(scrollSpeed: number, difficulty: number, deltaTime: number): void {
    this.adjustDifficulty(difficulty);

    if (this.lastSpawnY > 0) {
      const spawnDistance = randomRange(this.minSpawnDistance, this.maxSpawnDistance);
      if (this.lastSpawnY - spawnDistance > 0) {
        this.spawnObstacle();
      }
    } else {
      this.lastSpawnY += scrollSpeed * deltaTime;
    }
  }

  private adjustDifficulty(difficulty: number): void {
    const difficultyFactor = 1 + difficulty * 0.5;
    this.minSpawnDistance = ROCK_CONFIG.MIN_SPAWN_DISTANCE / difficultyFactor;
    this.maxSpawnDistance = ROCK_CONFIG.MAX_SPAWN_DISTANCE / difficultyFactor;
  }

  private spawnObstacle(): void {
    const availableLanes = [0, 1, 2];
    const numObstacles = Math.min(randomInt(1, 2), availableLanes.length);

    for (let i = 0; i < numObstacles; i++) {
      const laneIndex = randomInt(0, availableLanes.length - 1);
      const lane = availableLanes[laneIndex];
      availableLanes.splice(laneIndex, 1);

      const laneX = this.getLaneX(lane);

      if (Math.random() < POWERUP_CONFIG.SPAWN_CHANCE) {
        this.spawnPowerUp(lane, laneX);
      } else {
        this.spawnRock(lane, laneX);
      }
    }

    this.lastSpawnY = -50;
  }

  private spawnRock(lane: number, laneX: number): void {
    const rock = this.rockPool.acquire();
    rock.init(lane, this.lastSpawnY, laneX);
  }

  private spawnPowerUp(lane: number, laneX: number): void {
    const powerUp = this.powerUpPool.acquire();
    const types = [PowerUpType.SHIELD, PowerUpType.SPEED_BOOST, PowerUpType.SCORE_MULTIPLIER];
    const type = types[randomInt(0, types.length - 1)];
    powerUp.init(lane, this.lastSpawnY, laneX, type);
  }

  private getLaneX(lane: number): number {
    return (
      GAME_CONFIG.LANE_OFFSET +
      lane * GAME_CONFIG.LANE_WIDTH +
      GAME_CONFIG.LANE_WIDTH / 2 -
      ROCK_CONFIG.WIDTH / 2
    );
  }

  getActiveRocks(): Rock[] {
    return this.rockPool.getActive();
  }

  getActivePowerUps(): PowerUp[] {
    return this.powerUpPool.getActive();
  }

  releaseRock(rock: Rock): void {
    this.rockPool.release(rock);
  }

  releasePowerUp(powerUp: PowerUp): void {
    this.powerUpPool.release(powerUp);
  }

  reset(): void {
    this.rockPool.releaseAll();
    this.powerUpPool.releaseAll();
    this.lastSpawnY = -ROCK_CONFIG.MIN_SPAWN_DISTANCE;
  }
}
