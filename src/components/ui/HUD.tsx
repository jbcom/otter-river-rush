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
      {/* Score and stats */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="text-3xl font-bold text-white drop-shadow-lg">
          Score: {score.toLocaleString()}
        </div>
        <div className="text-xl text-white/90 drop-shadow-lg">
          Distance: {Math.floor(distance)}m
        </div>
        <div className="flex gap-4 text-lg text-white/80 drop-shadow-lg">
          <span>💰 {coins}</span>
          <span>💎 {gems}</span>
        </div>
      </div>

      {/* Combo indicator */}
      {combo > 0 && (
        <div className="absolute top-4 right-4">
          <div className="badge badge-primary badge-lg text-xl font-bold animate-pulse">
            {combo}x Combo!
          </div>
        </div>
      )}

      {/* Lives - moved to top-right to avoid joystick overlap */}
      <div className="absolute top-4 right-4 flex gap-2 mt-12">
        {Array.from({ length: lives }).map((_, i) => (
          <span key={i} className="text-3xl drop-shadow-lg">
            ❤️
          </span>
        ))}
      </div>

      {/* Virtual Joystick for mobile */}
      <VirtualJoystick onMove={handleJoystickMove} enabled={true} />
    </div>
  );
}
