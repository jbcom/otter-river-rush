import { usePlayer } from '../../hooks/useEntityQuery';

export function PowerUpTimers() {
  const player = usePlayer();

  if (!player) return null;

  const now = Date.now();
  const powerUps = [];

  if (player.invincible && (player as any).powerUpEndTime) {
    const timeLeft = Math.max(0, (player as any).powerUpEndTime - now) / 1000;
    powerUps.push({
      name: 'Shield',
      icon: '🛡️',
      timeLeft,
      color: 'bg-blue-500',
    });
  }

  if (player.ghost && (player as any).powerUpEndTime) {
    const timeLeft = Math.max(0, (player as any).powerUpEndTime - now) / 1000;
    powerUps.push({
      name: 'Ghost',
      icon: '👻',
      timeLeft,
      color: 'bg-purple-500',
    });
  }

  if ((player as any).magnetActive && (player as any).magnetEndTime) {
    const timeLeft = Math.max(0, (player as any).magnetEndTime - now) / 1000;
    powerUps.push({
      name: 'Magnet',
      icon: '🧲',
      timeLeft,
      color: 'bg-yellow-500',
    });
  }

  if (powerUps.length === 0) return null;

  return (
    <div className="absolute top-24 right-4 space-y-2">
      {powerUps.map((powerUp) => (
        <div
          key={powerUp.name}
          className={`${powerUp.color} rounded-lg px-4 py-2 text-white flex items-center gap-3`}
        >
          <span className="text-2xl">{powerUp.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-bold">{powerUp.name}</div>
            <div className="text-xs">{powerUp.timeLeft.toFixed(1)}s</div>
            <div className="w-full h-1 bg-white/30 rounded mt-1">
              <div
                className="h-full bg-white rounded transition-all"
                style={{ width: `${(powerUp.timeLeft / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
