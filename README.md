# Otter River Rush

An endless runner game featuring an adventurous otter navigating a river filled with obstacles!

## Features

- **3-Lane System**: Navigate between three lanes to avoid obstacles
- **Progressive Difficulty**: Game speed increases over time
- **Power-ups**: Collect shields, speed boosts, and score multipliers
- **Achievements**: Unlock achievements by reaching milestones
- **Local Storage**: High scores and progress are saved locally
- **PWA Support**: Install and play offline
- **Responsive Controls**: Play with keyboard, mouse, or touch

## Controls

- **Arrow Keys / A/D**: Move left/right
- **Mouse Click**: Click left/right side to move
- **Touch**: Swipe left/right to change lanes
- **Escape / P**: Pause game

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Technology Stack

- **TypeScript**: Type-safe game logic
- **Vite**: Fast build tool and dev server
- **Vitest**: Unit testing framework
- **Howler.js**: Audio management
- **vite-plugin-pwa**: Progressive Web App support
- **ESLint + Prettier**: Code quality and formatting

## Architecture

### Directory Structure

```
src/
├── game/           # Game logic and entities
│   ├── Game.ts
│   ├── Otter.ts
│   ├── Rock.ts
│   ├── Particle.ts
│   ├── PowerUp.ts
│   ├── ProceduralGenerator.ts
│   ├── InputHandler.ts
│   ├── AchievementSystem.ts
│   ├── AudioManager.ts
│   └── constants.ts
├── rendering/      # Rendering system
│   └── Renderer.ts
├── utils/          # Utility functions
│   ├── math.ts
│   ├── ObjectPool.ts
│   └── StorageManager.ts
└── test/           # Unit tests
```

### Key Components

- **Game Loop**: Delta-time based update loop
- **Object Pooling**: Efficient memory management for particles, rocks, and power-ups
- **Procedural Generation**: Endless obstacle spawning with increasing difficulty
- **AABB Collision**: Axis-aligned bounding box collision detection
- **Parallax Background**: Multi-layer scrolling background
- **Input Handling**: Unified input system for keyboard, mouse, and touch

## License

MIT

## Assets

- Textures: CC0 licensed from AmbientCG (public domain)
- Audio: CC0 licensed from Freesound (public domain)