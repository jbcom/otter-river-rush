import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';

/**
 * GameOver Component - Branded game over screen with otter personality
 */

export function GameOver(): React.JSX.Element {
  const {
    score,
    distance,
    coins,
    gems,
    highScore,
    returnToMenu,
    startGame,
    mode,
  } = useGameStore();

  // Determine otter's reaction based on score
  const isNewHighScore = score === highScore && highScore > 0;
  const otterMessage = isNewHighScore
    ? "Otterly Amazing! New Record!"
    : score > highScore * 0.8
    ? "What a Rush! So Close!"
    : score > highScore * 0.5
    ? "Great Splashing Out There!"
    : "Let's Dive In Again!";

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-auto game-bg-overlay z-50">
      <div className="otter-panel w-full max-w-md splash-in">
        {/* Otter Mascot Reaction */}
        <div className="text-center mb-6">
          <img
            src="/hud/splash-screen.png"
            alt="Rusty the Otter"
            className="mx-auto w-32 h-32 object-contain mb-3 otter-mascot-tired"
          />
          <div className="otter-speech-bubble inline-block">
            {otterMessage}
          </div>
        </div>

        {/* Stats Display */}
        <div className="space-y-3 mb-6">
          <div className="otter-hud-panel">
            <div className="flex justify-between items-center">
              <span className="otter-stat-label">⭐ Score</span>
              <span className="otter-stat">{score.toLocaleString()}</span>
            </div>
          </div>

          <div className="otter-hud-panel">
            <div className="flex justify-between items-center">
              <span className="otter-stat-label">🏃 Distance</span>
              <span className="otter-stat">{Math.floor(distance)}m</span>
            </div>
          </div>

          <div className="otter-hud-panel">
            <div className="flex justify-between items-center">
              <span className="otter-stat-label">Collected</span>
              <span className="otter-stat">
                {coins} 💰 {gems} 💎
              </span>
            </div>
          </div>

          {isNewHighScore && (
            <div className="otter-hud-panel bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-500">
              <div className="text-center">
                <span className="text-2xl font-bold text-yellow-300 drop-shadow-lg">
                  🎉 NEW HIGH SCORE! 🎉
                </span>
              </div>
            </div>
          )}

          <div className="otter-hud-panel">
            <div className="flex justify-between items-center">
              <span className="otter-stat-label">🏆 Best</span>
              <span className="otter-stat">{highScore.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => startGame(mode)}
            className="otter-btn otter-btn-primary flex-1"
          >
            🌊 Dive Again!
          </button>
          <button onClick={returnToMenu} className="otter-btn otter-btn-secondary flex-1">
            🏠 River Bank
          </button>
        </div>
      </div>
    </div>
  );
}
