import { Otter } from '../game/Otter';
import { Rock } from '../game/Rock';
import { PowerUp } from '../game/PowerUp';
import { Particle } from '../game/Particle';
import { GAME_CONFIG, PowerUpType } from '../game/constants';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private parallaxOffset: number = 0;
  private parallaxSpeed: number = 50;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
    this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(deltaTime: number): void {
    this.parallaxOffset += this.parallaxSpeed * deltaTime;
    if (this.parallaxOffset > this.canvas.height) {
      this.parallaxOffset = 0;
    }
  }

  renderBackground(): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#2563eb');
    gradient.addColorStop(1, '#3b82f6');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderParallaxLayer('#1e40af', 0.3, 20);
    this.renderParallaxLayer('#1d4ed8', 0.6, 40);
  }

  private renderParallaxLayer(color: string, speed: number, size: number): void {
    this.ctx.fillStyle = color;
    const offset = (this.parallaxOffset * speed) % (size * 2);

    for (let y = -size * 2; y < this.canvas.height + size; y += size * 2) {
      for (let x = 0; x < this.canvas.width; x += size * 2) {
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(x, y + offset, size, size);
      }
    }
    this.ctx.globalAlpha = 1;
  }

  renderLanes(): void {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([10, 10]);

    for (let i = 1; i < GAME_CONFIG.LANE_COUNT; i++) {
      const x = GAME_CONFIG.LANE_OFFSET + i * GAME_CONFIG.LANE_WIDTH;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    this.ctx.setLineDash([]);
  }

  renderOtter(otter: Otter): void {
    this.ctx.fillStyle = '#8b4513';
    this.ctx.fillRect(otter.x, otter.y, otter.width, otter.height);

    this.ctx.fillStyle = '#d2691e';
    this.ctx.fillRect(otter.x + 10, otter.y + 10, otter.width - 20, otter.height - 20);

    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(otter.x + 15, otter.y + 15, 8, 8);
    this.ctx.fillRect(otter.x + otter.width - 23, otter.y + 15, 8, 8);

    if (otter.hasShield) {
      this.ctx.strokeStyle = '#60a5fa';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(
        otter.x + otter.width / 2,
        otter.y + otter.height / 2,
        otter.width / 2 + 5,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }
  }

  renderRock(rock: Rock): void {
    this.ctx.fillStyle = '#64748b';
    this.ctx.fillRect(rock.x, rock.y, rock.width, rock.height);

    this.ctx.fillStyle = '#475569';
    this.ctx.fillRect(rock.x + 5, rock.y + 5, rock.width - 10, rock.height - 10);
  }

  renderPowerUp(powerUp: PowerUp): void {
    const centerX = powerUp.x + powerUp.width / 2;
    const centerY = powerUp.y + powerUp.height / 2;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate((Date.now() / 1000) * Math.PI);
    this.ctx.translate(-centerX, -centerY);

    switch (powerUp.type) {
      case PowerUpType.SHIELD:
        this.ctx.fillStyle = '#60a5fa';
        break;
      case PowerUpType.SPEED_BOOST:
        this.ctx.fillStyle = '#fbbf24';
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        this.ctx.fillStyle = '#34d399';
        break;
    }

    this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.fillRect(powerUp.x + 5, powerUp.y + 5, powerUp.width - 10, powerUp.height - 10);

    this.ctx.restore();
  }

  renderParticle(particle: Particle): void {
    this.ctx.globalAlpha = particle.getAlpha();
    this.ctx.fillStyle = particle.color;
    this.ctx.fillRect(
      particle.x - particle.size / 2,
      particle.y - particle.size / 2,
      particle.size,
      particle.size
    );
    this.ctx.globalAlpha = 1;
  }

  renderRocks(rocks: Rock[]): void {
    rocks.forEach((rock) => {
      if (rock.active) {
        this.renderRock(rock);
      }
    });
  }

  renderPowerUps(powerUps: PowerUp[]): void {
    powerUps.forEach((powerUp) => {
      if (powerUp.active) {
        this.renderPowerUp(powerUp);
      }
    });
  }

  renderParticles(particles: Particle[]): void {
    particles.forEach((particle) => {
      if (particle.active) {
        this.renderParticle(particle);
      }
    });
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}
