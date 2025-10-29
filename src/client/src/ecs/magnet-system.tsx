import { useFrame } from '@react-three/fiber';
import { queries, world } from './world';
import { useGameStore } from '../hooks/useGameStore';

export function MagnetSystem() {
  const { status } = useGameStore();

  useFrame((_, dt) => {
    if (status !== 'playing') return;

    const [player] = queries.player.entities;
    if (!player || !(player as any).magnetActive) return;

    const magnetRadius = 3;
    const pullSpeed = 8;

    // Pull collectibles towards player
    for (const collectible of queries.collectibles) {
      const dx = player.position.x - collectible.position.x;
      const dy = player.position.y - collectible.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < magnetRadius && dist > 0) {
        // Pull towards player
        const force = pullSpeed / dist;
        if (collectible.velocity) {
          collectible.velocity.x += (dx / dist) * force * dt;
          collectible.velocity.y += (dy / dist) * force * dt;
        }
      }
    }

    // Deactivate if expired
    const now = Date.now();
    if ((player as any).magnetEndTime && now > (player as any).magnetEndTime) {
      (player as any).magnetActive = false;
      delete (player as any).magnetEndTime;
    }
  });

  return null;
}
