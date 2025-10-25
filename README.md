# Otter River Rush

An endless runner game featuring an adventurous otter navigating a river filled with obstacles!

![Start Screen](https://github.com/user-attachments/assets/11becc6d-0be6-4494-9464-6eb5203bf786)

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

## Play Online

The game is automatically deployed to GitHub Pages when changes are pushed to the main branch:
https://jbcom.github.io/otter-river-rush/

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
│   ├── Game.ts                 # Main game loop and state management
│   ├── Otter.ts                # Player entity
│   ├── Rock.ts                 # Obstacle entity
│   ├── Particle.ts             # Particle effect entity
│   ├── PowerUp.ts              # Power-up entity
│   ├── ProceduralGenerator.ts  # Endless obstacle spawning
│   ├── InputHandler.ts         # Unified input system
│   ├── AchievementSystem.ts    # Achievement tracking
│   ├── AudioManager.ts         # Sound management
│   └── constants.ts            # Game configuration
├── rendering/      # Rendering system
│   └── Renderer.ts # Canvas rendering with parallax
├── utils/          # Utility functions
│   ├── math.ts                 # Math utilities and AABB collision
│   ├── ObjectPool.ts           # Memory-efficient object pooling
│   └── StorageManager.ts       # localStorage persistence
└── test/           # Unit tests
```

### Key Components

- **Game Loop**: Delta-time based update loop for consistent frame-rate independent gameplay
- **Object Pooling**: Efficient memory management for particles, rocks, and power-ups
- **Procedural Generation**: Endless obstacle spawning with increasing difficulty
- **AABB Collision**: Axis-aligned bounding box collision detection
- **Parallax Background**: Multi-layer scrolling background for depth
- **Input Handling**: Unified input system for keyboard, mouse, and touch

## Testing

The project includes comprehensive unit tests covering:
- Math utilities and collision detection
- Object pooling system
- Entity behavior (Otter movement, Rock spawning)
- Achievement system

Run tests with: `npm test`

All tests pass: **27 tests passing** ✅

## Deployment

The game is automatically deployed to GitHub Pages using GitHub Actions:

1. Push changes to the `main` branch
2. GitHub Actions workflow builds and tests the project
3. If successful, deploys to GitHub Pages
4. Game is available at: https://jbcom.github.io/otter-river-rush/

## License

MIT

## Assets

- Textures: CC0 licensed from AmbientCG (public domain)
- Audio: CC0 licensed from Freesound (public domain)

## Security Notes

The project uses development dependencies with known moderate vulnerabilities (esbuild, vite). These only affect the development server and do not impact the production build or deployed game. The production build consists of static files only.