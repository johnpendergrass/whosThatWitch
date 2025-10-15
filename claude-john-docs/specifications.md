# Who's That Witch? - Specifications

## Project Overview

**Project Name:** Who's That Witch?
**Project Type:** Halloween-themed matching/memory tile game
**Location:** `/games/whosThatWitch/`
**Status:** Group Selection & Adjacency Complete, Next: Tile Flip Mechanic
**Date Started:** October 11, 2025
**Last Updated:** October 14, 2025 - 18:00

## Project Concept

A matching tile game where players:
1. Turn over tiles to reveal witch character images
2. Match two identical tiles together
3. Identify which witch character is shown (this is the twist!)
4. Score points based on matches and correct identification

**The Core Gameplay:** Players flip tiles to find matching pairs of witch characters. Once a match is found, they must correctly identify which witch it is to score points and continue playing.

## Game Container Specifications

**Exact Dimensions:** 950×714 pixels
- **Width:** 950px (exact)
- **Height:** 714px (not 720px - see rationale below)
- **Borders:** 3px white border (inside the container)
- **Background:** Black (#000000)
- **Position:** Relative, centered in page

**Rationale for 714px Height:**
The game is designed to fit inside a parent Halloween minigames app. The parent app has a center panel of 950×720 pixels, but 3px borders on top and bottom reduce usable space to 950×714. This ensures the game fits perfectly without overflow.

## Board Specifications

**Container:** 502×502 pixels
- **Position:** Absolute, bottom-left of screen
  - 35px from left edge (20px + 15px border)
  - 35px from bottom edge (20px + 15px border)
- **Border:** 15px ridge border (#7b2d8e - witchy purple)
  - Box-sizing: content-box (border is outside the 502px)
  - Total size with border: 532×532 pixels
- **Background:** #553963 (purple interior)
- **Purpose:** Contains the grid of tiles and grid lines

## Grid System

Three difficulty levels with different grid sizes:

### Easy (3×3 Grid)
- **Tile Count:** 9 tiles
- **Tile Size:** 166×166 pixels
- **Grid Lines:** 2px white lines between tiles
- **Total Calculation:** 3×166 + 2×2 = 498 + 4 = 502px ✓
- **Characters:** 9 different witches selected

### Medium (4×4 Grid)
- **Tile Count:** 16 tiles
- **Tile Size:** 124×124 pixels
- **Grid Lines:** 2px white lines between tiles
- **Total Calculation:** 4×124 + 3×2 = 496 + 6 = 502px ✓
- **Characters:** 16 different witches selected

### Hard (5×5 Grid)
- **Tile Count:** 25 tiles
- **Tile Size:** 99×99 pixels
- **Grid Lines:** 2px white lines between tiles
- **Total Calculation:** 5×99 + 4×2 = 495 + 8 = 503px (1px hidden under border)
- **Characters:** 20 witches selected (only 20 total available)

## Asset Inventory

### Witch Character Images

**Total Characters:** 32 unique witch characters
**Total Images:** 109 individual photos (multiple photos per character)
**Source Material:** Movies, TV shows, books, anime, cartoons, mythology
**Image Formats:** PNG with transparency (RGBA)

**Available Sizes:**
- 166×166 pixels (stored in `assets/166sized/`) - For EASY difficulty
- 124×124 pixels (stored in `assets/124sized/`) - For MEDIUM difficulty
- 99×99 pixels (stored in `assets/99sized/`) - For HARD difficulty
- Original: Various sizes (stored in `assets/witches/`)

### Character Database

**Storage:** `json/witchesImages.json`

**Structure:** Character-grouped with metadata and group field
```json
{
  "witchImages": {
    "Elphaba": [
      {
        "filename": "Elphaba(Broadway_Oz)01",
        "group": "a",
        "name_text": "Elphaba",
        "description_text": "This is Elphaba, from the 2003 Broadway show Wicked!",
        "easy_path": "99sized",
        "medium_path": "124sized",
        "hard_path": "166sized"
      },
      ...more images for this character...
    ],
    "Galinda": [...],
    ...more characters...
  }
}
```

**Group System:**
- **Group A (Wicked):** Elphaba (9), Galinda (9) - always selected together
- **Group B (Bewitched):** Endora (3), Samantha (6), Tabitha (3) - always selected together
- **Group C (Addams Family):** Grandmama (3), Morticia (3), Wednesday (5) - always selected together
- **Group D (Sabrina):** Sabrina (4), Salem (3) - always selected together
- **Group E (Kiki):** Kiki (3), JiJi (3) - always selected together
- **Group Z (Singles):** 24 characters - selected independently

**Complete Character List (32 characters, 109 total images):**
1. Elphaba (9 images) - Wicked, Wizard of Oz [Group A]
2. Galinda (9 images) - Wicked, Wizard of Oz [Group A]
3. Endora (3 images) - Bewitched [Group B]
4. Grandmama (3 images) - The Addams Family
5. Hermione (3 images) - Harry Potter
6. Jadis (3 images) - Chronicles of Narnia
7. Kiki (3 images) - Kiki's Delivery Service
8. Lafayette (3 images) - True Blood
9. Melisandre (3 images) - Game of Thrones
10. Mildred (3 images) - The Worst Witch
11. Morticia (3 images) - The Addams Family
12. McGonagall (3 images) - Harry Potter
13. Sabrina (4 images) - Sabrina the Teenage Witch
14. Salem (3 images) - Sabrina the Teenage Witch
15. Samantha (6 images) - Bewitched
16. Tabitha (3 images) - Bewitched
17. Wednesday (5 images) - The Addams Family
18. Wendy (3 images) - Harvey Comics
19. Willow (3 images) - Buffy the Vampire Slayer
20. Witch Hazel (3 images) - Looney Tunes
21. Yubaba (3 images) - Spirited Away

## Configuration System

**Master Config:** `json/gameConfig.json`

The entire game is controlled by configuration files, making it theme-agnostic:

```json
{
  "theme": "witches",
  "assetFolder": "assets",
  "folderPattern": "{size}sized",
  "filePattern": "{basename}_{size}.png",
  "imageListFile": "json/witchImages.json",
  "gridConfigFile": "json/tileSizes.json",
  "boardDimensions": {
    "width": 502,
    "height": 502
  },
  "difficulties": [
    {"id": "hardTiles", "label": "HARD", "buttonId": "btn-hard"},
    {"id": "mediumTiles", "label": "MEDIUM", "buttonId": "btn-medium"},
    {"id": "easyTiles", "label": "EASY", "buttonId": "btn-easy"}
  ],
  "defaultDifficulty": "mediumTiles"
}
```

**Benefits:**
- Change theme to baseball: just swap config and images
- No code changes needed for new themes
- All paths, patterns, dimensions configurable
- Buttons generated dynamically from config

## Design Decisions

### Visual Design

**Color Palette (Halloween Theme):**
- **Screen Background:** Black (#000000)
- **Screen Border:** White (#ffffff), 3px
- **Board Background:** Purple (#553963)
- **Board Border:** Purple ridge (#7b2d8e), 15px
- **Grid Lines:** White, 2px
- **Button Primary:** Orange (#ff6600)
- **Button Hover:** Lighter orange (#ff8c42)

**Layout:**
- Board positioned in bottom-left (asymmetric, visually interesting)
- Buttons centered at top
- Plenty of negative space around board

### Game Mechanics (Partially Implemented)

**Current State:**
- ✅ Grid displays with correct tile positions
- ✅ Group-based character selection (paired characters always together)
- ✅ Matching pairs with bomb tiles
- ✅ Adjacency constraints (0 for HARD, max 1 for EASY/MEDIUM)
- ✅ Grid lines draw between tiles
- ✅ Three difficulty levels function
- ✅ All 327 image files validated and loading

**To Be Implemented:**
- ❌ Tile flip interaction (face-down → face-up)
- ❌ Face-down tile design
- ❌ Match detection
- ❌ Bomb tile click handling
- ❌ Bonus tile functionality
- ❌ Witch identification input/validation
- ❌ Scoring system

### Group-Based Selection Strategy (IMPLEMENTED)

**Algorithm:**
1. Load character-grouped database (`witchesImages.json`) with group field
2. Build group map separating paired groups (A-E) from singles (Z)
3. Shuffle paired groups randomly
4. Add complete paired groups that fit within needed count
5. Fill remaining slots with random singles from Group Z
6. For each selected character, pick one random image from their array
7. Create matching pairs and add bomb tiles
8. Shuffle with adjacency constraints

**Why Group-Based:**
- Thematic character pairs always appear together (Elphaba+Galinda)
- Prevents breaking up related characters
- Group Z provides flexible pool of singles
- Paired groups add narrative interest
- Each game has variety of different characters
- Metadata available for hints/descriptions

**Adjacency Constraints:**
- **EASY/MEDIUM:** Maximum 1 adjacent matching pair allowed
- **HARD:** 0 adjacent matching pairs allowed
- Reshuffles up to 1000 times to meet constraints
- Makes game more challenging by distributing matches

## Parent App Integration

**Parent App:** Halloween Minigames at `/halloween/index.html`

**Integration Requirements (Future):**
- Export default class from `whosThatWitch.js`
- Implement interface: `constructor()`, `render()`, `start()`, `stop()`, `getScore()`
- Parent will dynamically import and instantiate
- Game HTML injected into parent's `#game-content` div

**Current Status:** Standalone development mode

## Rationale

### Why Character-Grouped Database?
The `witchesImages.json` structure groups images by character rather than using a flat array. This allows:
- Selection of unique characters per game
- Metadata for identification feature (name, description)
- Prevents same character appearing twice
- Educational aspect (players learn character origins)

### Why Configuration-Driven?
Every aspect controlled by JSON files because:
- Easy theme switching (witches → baseball → Pokemon)
- No code changes needed for new content
- All customization in one master config file
- Buttons, paths, patterns all declarative

### Why Three Difficulty Levels?
- **Easy (3×3):** Quick games, larger tiles, easier to see/match
- **Medium (4×4):** Standard difficulty, balanced gameplay
- **Hard (5×5):** Maximum characters (all 20!), challenging memory test

### Why 502×502 Board?
Math works perfectly for all three grid sizes:
- Easy: 3×166 + 2×2 = 502 ✓
- Medium: 4×124 + 3×2 = 502 ✓
- Hard: 5×99 + 4×2 = 503 (1px under frame border) ✓

## Current Implementation Status

**Completed:**
- ✅ Screen and board layout (950×714, 502×502)
- ✅ Grid system with three difficulties
- ✅ Pre-calculated tile positions
- ✅ Grid line rendering
- ✅ Dynamic button generation
- ✅ Configuration system (fully theme-agnostic)
- ✅ Image processing script (166/124/99 sizes)
- ✅ Character database with full metadata and groups
- ✅ Group-based random selection (paired characters stay together)
- ✅ Matching pairs with bomb tiles
- ✅ Adjacency constraint system
- ✅ Comprehensive error checking and validation
- ✅ All 327 image files validated and loading

**In Progress:**
- 🔄 Tile flip functionality (next priority)

**Not Started:**
- ❌ Face-down tile design
- ❌ Match detection logic
- ❌ Bomb tile click handling
- ❌ Bonus tile functionality
- ❌ Witch identification UI
- ❌ Scoring system
- ❌ Game win/completion detection
- ❌ Instructions screen

## Development Philosophy

Following John's preferences:
- **Incremental development:** One feature at a time, test thoroughly
- **Simple, understandable code:** Readability over optimization
- **Well-documented:** Clear comments explaining "why"
- **Functional approach:** Prefer functional patterns
- **Configuration over code:** Everything in JSON files
- **Wait for approval:** Don't implement major features without confirmation

## Next Major Tasks

1. **Design tile back** appearance for face-down state (immediate)
2. **Implement tile flip** interaction and animation
3. **Add match detection** logic
4. **Implement bomb tile** click handling
5. **Create identification UI** for "Who's That Witch?"
6. **Implement scoring** system
7. **Add game completion** detection and win screen
