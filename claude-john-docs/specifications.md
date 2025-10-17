# Who's That Witch? - Specifications

## Project Overview

**Project Name:** Who's That Witch?
**Project Type:** Halloween-themed matching/memory tile game
**Location:** `/games/whosThatWitch/`
**Status:** Game Mechanics Phase 1 & 2 Complete (v0.09), Next: Character Selection (Phase 3)
**Date Started:** October 11, 2025
**Last Updated:** October 16, 2025 - 18:30

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

**Grouped Characters (Groups 1-5):**
1. Elphaba (9 images) - Wicked, Wizard of Oz [Group 1]
2. Galinda (9 images) - Wicked, Wizard of Oz [Group 1]
3. Endora (3 images) - Bewitched [Group 2]
4. Samantha (6 images) - Bewitched [Group 2]
5. Tabitha (3 images) - Bewitched [Group 2]
6. Grandmama (3 images) - The Addams Family [Group 3]
7. Morticia (3 images) - The Addams Family [Group 3]
8. Wednesday (5 images) - The Addams Family [Group 3]
9. Sabrina (4 images) - Sabrina the Teenage Witch [Group 4]
10. Salem (3 images) - Sabrina the Teenage Witch [Group 4]
11. Kiki (3 images) - Kiki's Delivery Service [Group 5]
12. Jiji (3 images) - Kiki's Delivery Service [Group 5]

**Single Characters (Groups 6-25):**
13. Hermione (3 images) - Harry Potter [Group 6]
14. Jadis (3 images) - Chronicles of Narnia [Group 7]
15. Lafayette (3 images) - True Blood [Group 8]
16. Melisandre (3 images) - Game of Thrones [Group 9]
17. Mildred (3 images) - The Worst Witch [Group 10]
18. McGonagall (3 images) - Harry Potter [Group 11]
19. Wendy (3 images) - Harvey Comics [Group 12]
20. Willow (3 images) - Buffy the Vampire Slayer [Group 13]
21. Witch Hazel (3 images) - Looney Tunes [Group 14]
22. Yubaba (3 images) - Spirited Away [Group 15]
23-32. (10 more single characters in groups 16-25)

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

**Current State (v0.09):**
- ✅ Grid displays with correct tile positions
- ✅ Simplified square position system (left→right, top→bottom)
- ✅ Group-based character selection with numeric groups
- ✅ Matching pairs created with pairId tracking
- ✅ Bomb and bonus tiles use dedicated images
- ✅ Full metadata preserved (name_text, description_text)
- ✅ Adjacency constraint algorithm implemented
- ✅ Special tiles never adjacent (including diagonals)
- ✅ GameTile pairs avoid adjacency (100-retry algorithm)
- ✅ Grid lines draw between tiles
- ✅ Three difficulty levels function
- ✅ Character list UI displays to the right
- ✅ Hover tooltips show character descriptions
- ✅ Code constants as single source of truth
- ✅ x/y calculated from row/col (no JSON positions)
- ✅ Clickable tiles with event listeners
- ✅ Tile flip interaction (face-down ↔ face-up with animation)
- ✅ Face-down tile back images integrated (broom design)
- ✅ Match detection (compare pairIds)
- ✅ Two-tile matching game logic
- ✅ Bomb/bonus tile click handling (immediate, no matching)
- ✅ Special tiles stay visible but muted after click
- ✅ Game state machine prevents invalid clicks
- ✅ Golden glow highlight on selected tiles
- ✅ CSS variable system for muted opacity
- ✅ **v0.09: Special tile click properly resets previous gameTile selections**

**To Be Implemented:**
- ❌ Character name clicking (Phase 3)
- ❌ Character identification validation (Phase 3)
- ❌ Mark completed pairs permanently (Phase 4)
- ❌ Scoring system (click tracking, points calculation)
- ❌ Game win/completion detection
- ❌ Victory screen
- ❌ Bomb tile scoring/penalties
- ❌ Bonus tile rewards

### Tile Selection & Placement Strategy (IMPLEMENTED v0.06)

**Selection Algorithm:**
1. Load character-grouped database (`witches.json`) with numeric group field (1-25)
2. Build `groupedWitches` organizing images by group number
3. Calculate unique images needed: `imageTiles / 2`
4. Randomly select that many group numbers
5. For each selected group: randomly pick one character
6. For that character: randomly pick one image
7. Store full tile data: `{imagePath, name_text, description_text, type: 'gameTile', pairId: groupNum}`
8. Create matching pairs (push same object twice for matching)
9. Create separate bomb tiles: `{imagePath, type: 'bomb'}`
10. Create separate bonus tiles: `{imagePath, type: 'bonus'}`
11. Return organized by type: `{gameTiles, bombs, bonus}` (NO shuffle at this stage)

**Placement Algorithm with Adjacency Constraints:**

**Phase 1: Special Tiles (Bombs & Bonus)**
- Placed first with strict adjacency checking
- Each special tile placed randomly in position NOT adjacent (including diagonals) to previously placed special tiles
- Example: If bonus at center, bombs exclude all 8 surrounding squares
- Ensures special tiles are well-separated visually

**Phase 2: GameTiles (Matching Pairs) - Retry Algorithm**
- Goal: Place matching pairs so they are NOT adjacent (including diagonals)
- Up to 100 retry attempts:
  1. Clear any gameTiles from previous failed attempt (keep special tiles)
  2. For each pairId (unique pair):
     - Place first tile randomly in any available square
     - Place second tile randomly in non-adjacent square (excludes 8 surrounding squares)
     - If no non-adjacent square available → FAIL attempt, retry from step 1
  3. If all pairs placed successfully → SUCCESS, exit loop
- After 100 failed attempts: **Fallback Placement**
  - Clear any partial gameTile placements
  - Place all gameTiles randomly (accept adjacency)
  - Ensures game always completes

**Fallback Rationale:**
- EASY (3×3) grid often impossible to satisfy constraints with 4 pairs
- MEDIUM/HARD usually succeed within 1-20 attempts
- Fallback ensures playability over perfect adherence
- Players unlikely to notice/care on EASY difficulty

**Why Group-Based Selection:**
- Groups 1-5: Multi-character thematic sets appear together
- Groups 6-25: Individual characters can be mixed freely
- System extensible (new groups = new group numbers)
- Metadata preserved for "Who's That Witch?" feature
- Each game has variety of different characters

**Why pairId:**
- Explicit identification of matching pairs (uses group number)
- Easier debugging and pair detection
- More maintainable than object reference comparison
- Can filter/find pairs: `gameTiles.filter(t => t.pairId === 5)`

**Data Source: Code Constants as Single Source of Truth**
- Position data comes from `EASY_SQUARES`, `MEDIUM_SQUARES`, `HARD_SQUARES` (in code)
- Each square: `{num: index, row: row, col: col}`
- x/y coordinates calculated from row/col: `x = col * (tileSize + lineSize)`
- JSON only used for configuration values, not positions
- Eliminates index mismatch bugs between arrays

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

**Completed (v0.09 - Game Mechanics Phase 1 & 2):**
- ✅ Screen and board layout (950×714, 502×502)
- ✅ Grid system with three difficulties
- ✅ Simplified square position arrays (left→right, top→bottom)
- ✅ Grid line rendering
- ✅ Dynamic button generation with custom 80×30px images
- ✅ Configuration system (fully theme-agnostic)
- ✅ Image processing script (166/124/99 sizes)
- ✅ Character database with full metadata and numeric groups (1-25)
- ✅ Group-based random selection with pairId tracking
- ✅ Matching pairs created (with pairId: groupNum)
- ✅ Dedicated bomb and bonus tile images
- ✅ Adjacency constraint algorithm:
  - ✅ Special tiles never adjacent (including diagonals)
  - ✅ GameTile pairs avoid adjacency (100-retry algorithm)
  - ✅ Fallback placement after 100 attempts
- ✅ Code constants as single source of truth
- ✅ x/y coordinates calculated from row/col
- ✅ Full metadata preservation on tiles
- ✅ Character list UI in status box (renamed from "witch list")
- ✅ Hover tooltips for character descriptions
- ✅ Helper functions (shuffleArray, getRandomFromArray, areAdjacent, getAvailablePositions)
- ✅ Game title ("Who's That Witch?" in Creepster font with purple glow)
- ✅ Game subtitle with instructions
- ✅ STATUS box container with character list
- ✅ Individual character points display (+10 per character)
- ✅ Integrated scoring summary (Clicks, Total Score)
- ✅ Difficulty buttons relocated to bottom of status box
- ✅ Consistent "character" naming throughout codebase
- ✅ Face-down tile back images integrated
- ✅ Two-layer tile DOM structure (face-up + face-down overlay)
- ✅ Click event handlers for tiles
- ✅ Tile reveal animation (opacity transition)
- ✅ Match detection (compare pairIds)
- ✅ Non-matching tiles flip back after delay
- ✅ Special tile handling (bomb/bonus show immediately, no matching)
- ✅ Special tiles stay visible but muted (CSS variable system)
- ✅ Game state machine (WAITING_FIRST → WAITING_SECOND → CHECKING_MATCH)
- ✅ Golden glow highlight for selected tiles
- ✅ Bug fix: Special tile click now properly hides previously selected gameTiles

**Next Priority (Phase 3 - Character Selection):**
- 🎯 Make character names in list clickable
- 🎯 Character identification validation
- 🎯 Handle correct vs incorrect character selection
- 🎯 Visual feedback for character click

**Not Started:**
- ❌ Better tile back images (current are placeholder broom designs)
- ❌ Better bomb tile imagery (needs clearer penalty visual)
- ❌ Better bonus tile imagery (needs clearer reward visual)
- ❌ Bomb tile effect/penalty mechanics (design decision needed)
- ❌ Bonus tile effect/reward mechanics (design decision needed)
- ❌ Game win/completion detection
- ❌ Victory screen

## Development Philosophy

Following John's preferences:
- **Incremental development:** One feature at a time, test thoroughly
- **Simple, understandable code:** Readability over optimization
- **Well-documented:** Clear comments explaining "why"
- **Functional approach:** Prefer functional patterns
- **Configuration over code:** Everything in JSON files
- **Wait for approval:** Don't implement major features without confirmation

## Next Major Tasks (v0.08 - Game Mechanics)

### Immediate Priority: Three-Click Game Mechanic

**Workflow:**
1. Click 1: Player clicks face-down tile → flip to face-up, reveal image
2. Click 2: Player clicks another face-down tile → flip to face-up, reveal image
3. Click 3: Player clicks character name in list → identify the character

**Validation:**
- If tiles match (same pairId) AND character name is correct:
  - Mark tiles as "completed" (keep face-up, visual indicator)
  - Mark character in list as "identified"
  - Update character points (+10 earned)
  - Update Clicks counter (-1 per attempt)
  - Update TOTAL SCORE
- If tiles DON'T match OR character name is wrong:
  - Flip both tiles back face-down
  - Increment Clicks counter
  - No points earned

### Implementation Tasks

1. **Tile State Management** - Track face-up/face-down, completed status
2. **Click Event Handlers** - Tiles and character names clickable
3. **Tile Flip Logic** - Toggle between face-down back image and face-up character image
4. **Game State Machine** - Track current click (first tile, second tile, character selection)
5. **Match Validation** - Compare pairId values of two tiles
6. **Character ID Validation** - Verify selected name matches tile character
7. **Scoring Updates** - Calculate and display real-time scores
8. **Visual Feedback** - Show completed matches differently
9. **Click Counter** - Track and display total clicks made
10. **Prevent Invalid Clicks** - Don't allow clicking completed tiles

### Future Tasks

11. **Tile flip animation** - Smooth CSS transitions
12. **Bomb tile handling** - Penalties when clicked
13. **Bonus tile functionality** - Rewards when clicked
14. **Game completion** - Detect all pairs identified
15. **Victory screen** - Display final score and stats
