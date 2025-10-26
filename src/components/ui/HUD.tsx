import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { VirtualJoystick } from './VirtualJoystick';

/**
 * HUD Component - Heads-up display during gameplay
 * Shows score, distance, coins, gems, combo, and virtual joystick
 */

export function HUD(): React.JSX.Element {
  const { score, distance, coins, gems, combo, lives } = useGameStore();

  // Simple lane switching via joystick
  const handleJoystickMove = (direction: 'left' | 'right'): void => {
    // Dispatch custom event for the Otter component to listen to
    const event = new CustomEvent('joystick-move', { detail: { direction } });
    window.dispatchEvent(event);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Score and stats - Top Left */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="otter-hud-panel pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="otter-stat-label">⭐</span>
            <span className="otter-stat">{score.toLocaleString()}</span>
          </div>
        </div>
        <div className="otter-hud-panel pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="otter-stat-label">🏃</span>
            <span className="otter-stat">{Math.floor(distance)}m</span>
          </div>
        </div>
        <div className="otter-hud-panel pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="otter-stat">💰 {coins}</span>
            <span className="otter-stat">💎 {gems}</span>
          </div>
        </div>
      </div>

      {/* Combo indicator */}
      {combo > 0 && (
        <div className="absolute top-4 right-4">
          <div className="otter-hud-panel bg-gradient-to-r from-orange-500/50 to-yellow-500/50 border-orange-400 pointer-events-auto animate-pulse">
            <span className="text-2xl font-extrabold text-yellow-200 drop-shadow-lg">
              {combo}x COMBO!
            </span>
          </div>
        </div>
      )}

      {/* Lives - Top Right (below combo) */}
      <div className="absolute top-20 right-4 otter-hud-panel pointer-events-auto">
        <div className="flex gap-1">
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} className="text-2xl drop-shadow-lg">
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Virtual Joystick for mobile */}
      <VirtualJoystick onMove={handleJoystickMove} enabled={true} />
    </div>
  );
}
