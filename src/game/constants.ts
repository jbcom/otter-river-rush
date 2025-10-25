export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  LANE_COUNT: 3,
  LANE_WIDTH: 200,
  LANE_OFFSET: 100,
  SCROLL_SPEED: 200,
  MIN_SCROLL_SPEED: 200,
  MAX_SCROLL_SPEED: 600,
  DIFFICULTY_INCREASE_RATE: 0.05,
  DIFFICULTY_INCREASE_INTERVAL: 10000,
};

export const OTTER_CONFIG = {
  WIDTH: 60,
  HEIGHT: 60,
  MOVE_SPEED: 10,
  START_LANE: 1,
};

export const ROCK_CONFIG = {
  WIDTH: 50,
  HEIGHT: 50,
  MIN_SPAWN_DISTANCE: 400,
  MAX_SPAWN_DISTANCE: 800,
};

export const PARTICLE_CONFIG = {
  LIFETIME: 1000,
  COUNT: 10,
  SPEED: 100,
};

export const POWERUP_CONFIG = {
  WIDTH: 40,
  HEIGHT: 40,
  SPAWN_CHANCE: 0.15,
  DURATION: 5000,
};

export enum PowerUpType {
  SHIELD = 'shield',
  SPEED_BOOST = 'speed_boost',
  SCORE_MULTIPLIER = 'score_multiplier',
}

export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
}
