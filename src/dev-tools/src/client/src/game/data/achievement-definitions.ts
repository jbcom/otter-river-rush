export const ACHIEVEMENT_DEFINITIONS = [
  {
    "id": "first_steps",
    "name": "First Steps",
    "description": "Run your first 100 meters",
    "icon": "👣",
    "requirement": 100,
    "rarity": "common",
    "checkCondition": "totalDistance >= 100"
  },
  {
    "id": "marathon_runner",
    "name": "Marathon Runner",
    "description": "Cover a distance of 42,195 meters in total",
    "icon": "🏃‍♂️",
    "requirement": 42195,
    "rarity": "epic",
    "checkCondition": "totalDistance >= 42195"
  },
  {
    "id": "combo_starter",
    "name": "Combo Starter",
    "description": "Achieve a 5x combo multiplier",
    "icon": "✨",
    "requirement": 5,
    "rarity": "common",
    "checkCondition": "maxCombo >= 5"
  },
  {
    "id": "combo_master",
    "name": "Combo Master",
    "description": "Reach an incredible 50x combo multiplier",
    "icon": "🔥",
    "requirement": 50,
    "rarity": "legendary",
    "checkCondition": "maxCombo >= 50"
  },
  {
    "id": "coin_collector",
    "name": "Coin Collector",
    "description": "Collect your first 100 coins",
    "icon": "🪙",
    "requirement": 100,
    "rarity": "common",
    "checkCondition": "totalCoins >= 100"
  },
  {
    "id": "treasure_hunter",
    "name": "Treasure Hunter",
    "description": "Amass a fortune of 10,000 coins",
    "icon": "💰",
    "requirement": 10000,
    "rarity": "rare",
    "checkCondition": "totalCoins >= 10000"
  },
  {
    "id": "speed_demon",
    "name": "Speed Demon",
    "description": "Run 1000 meters in a single session",
    "icon": "⚡",
    "requirement": 1000,
    "rarity": "common",
    "checkCondition": "singleRunDistance >= 1000"
  },
  {
    "id": "endurance_elite",
    "name": "Endurance Elite",
    "description": "Run 10,000 meters in a single session",
    "icon": "🦵",
    "requirement": 10000,
    "rarity": "epic",
    "checkCondition": "singleRunDistance >= 10000"
  },
  {
    "id": "perfect_landing",
    "name": "Perfect Landing",
    "description": "Successfully land 25 jumps in a row",
    "icon": "🎯",
    "requirement": 25,
    "rarity": "rare",
    "checkCondition": "consecutiveJumps >= 25"
  },
  {
    "id": "gem_gatherer",
    "name": "Gem Gatherer",
    "description": "Collect 50 precious gems",
    "icon": "💎",
    "requirement": 50,
    "rarity": "rare",
    "checkCondition": "totalGems >= 50"
  },
  {
    "id": "power_up_pro",
    "name": "Power-Up Pro",
    "description": "Use 100 power-ups",
    "icon": "⭐",
    "requirement": 100,
    "rarity": "common",
    "checkCondition": "powerUpsUsed >= 100"
  },
  {
    "id": "obstacle_dancer",
    "name": "Obstacle Dancer",
    "description": "Dodge 200 obstacles without getting hit",
    "icon": "🕺",
    "requirement": 200,
    "rarity": "rare",
    "checkCondition": "consecutiveObstaclesDodged >= 200"
  },
  {
    "id": "daily_grind",
    "name": "Daily Grind",
    "description": "Play for 7 consecutive days",
    "icon": "📅",
    "requirement": 7,
    "rarity": "common",
    "checkCondition": "consecutiveDaysPlayed >= 7"
  },
  {
    "id": "world_traveler",
    "name": "World Traveler",
    "description": "Run a total distance equal to Earth's circumference (40,075 km)",
    "icon": "🌍",
    "requirement": 40075000,
    "rarity": "legendary",
    "checkCondition": "totalDistance >= 40075000"
  },
  {
    "id": "combo_chain",
    "name": "Combo Chain",
    "description": "Maintain a combo for 30 seconds straight",
    "icon": "⛓️",
    "requirement": 30,
    "rarity": "rare",
    "checkCondition": "longestComboTime >= 30"
  },
  {
    "id": "heart_collector",
    "name": "Heart Collector",
    "description": "Gather 25 health hearts",
    "icon": "❤️",
    "requirement": 25,
    "rarity": "common",
    "checkCondition": "totalHearts >= 25"
  },
  {
    "id": "slide_master",
    "name": "Slide Master",
    "description": "Perform 500 successful slides",
    "icon": "🛷",
    "requirement": 500,
    "rarity": "rare",
    "checkCondition": "totalSlides >= 500"
  },
  {
    "id": "century_runner",
    "name": "Century Runner",
    "description": "Complete 100 runs",
    "icon": "💯",
    "requirement": 100,
    "rarity": "rare",
    "checkCondition": "totalRuns >= 100"
  },
  {
    "id": "magnet_master",
    "name": "Magnet Master",
    "description": "Attract 1000 coins using magnetic power-ups",
    "icon": "🧲",
    "requirement": 1000,
    "rarity": "rare",
    "checkCondition": "magnetCoinsCollected >= 1000"
  },
  {
    "id": "air_time_ace",
    "name": "Air Time Ace",
    "description": "Spend 60 seconds total in the air",
    "icon": "🪂",
    "requirement": 60,
    "rarity": "rare",
    "checkCondition": "totalAirTime >= 60"
  },
  {
    "id": "score_crusher",
    "name": "Score Crusher",
    "description": "Achieve a score of 100,000 points",
    "icon": "📊",
    "requirement": 100000,
    "rarity": "epic",
    "checkCondition": "highScore >= 100000"
  },
  {
    "id": "boost_baron",
    "name": "Boost Baron",
    "description": "Use speed boost power-ups 50 times",
    "icon": "🚀",
    "requirement": 50,
    "rarity": "common",
    "checkCondition": "speedBoostsUsed >= 50"
  },
  {
    "id": "near_miss_ninja",
    "name": "Near Miss Ninja",
    "description": "Have 100 near-miss encounters with obstacles",
    "icon": "🥷",
    "requirement": 100,
    "rarity": "rare",
    "checkCondition": "nearMisses >= 100"
  },
  {
    "id": "multiplier_mogul",
    "name": "Multiplier Mogul",
    "description": "Achieve a 20x score multiplier",
    "icon": "✖️",
    "requirement": 20,
    "rarity": "epic",
    "checkCondition": "maxMultiplier >= 20"
  },
  {
    "id": "environmental_explorer",
    "name": "Environmental Explorer",
    "description": "Run through 5 different environments",
    "icon": "🗺️",
    "requirement": 5,
    "rarity": "common",
    "checkCondition": "environmentsUnlocked >= 5"
  },
  {
    "id": "shield_survivor",
    "name": "Shield Survivor",
    "description": "Block 100 obstacles using shield power-ups",
    "icon": "🛡️",
    "requirement": 100,
    "rarity": "rare",
    "checkCondition": "obstaclesBlocked >= 100"
  },
  {
    "id": "double_jump_dynamo",
    "name": "Double Jump Dynamo",
    "description": "Perform 200 double jumps",
    "icon": "⏫",
    "requirement": 200,
    "rarity": "common",
    "checkCondition": "doubleJumps >= 200"
  },
  {
    "id": "grind_master",
    "name": "Grind Master",
    "description": "Grind on rails for a total of 5000 meters",
    "icon": "🚂",
    "requirement": 5000,
    "rarity": "rare",
    "checkCondition": "totalGrindDistance >= 5000"
  },
  {
    "id": "perfectionist",
    "name": "Perfectionist",
    "description": "Complete a run collecting every coin in the path",
    "icon": "👑",
    "requirement": 1,
    "rarity": "epic",
    "checkCondition": "perfectCoinRuns >= 1"
  },
  {
    "id": "immortal_runner",
    "name": "Immortal Runner",
    "description": "Survive for 5 minutes in a single run",
    "icon": "⏰",
    "requirement": 300,
    "rarity": "legendary",
    "checkCondition": "longestSurvivalTime >= 300"
  }
];
