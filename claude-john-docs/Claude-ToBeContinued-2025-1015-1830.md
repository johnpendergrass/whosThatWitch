# Who's That Witch? - Session Notes
**Date:** October 15, 2025 - 18:30
**Session:** Selection Logic Reset & Ring Position System
**Version:** v0.04-prep

## Current State

The "Who's That Witch?" game has been reset to a clean baseline state, ready for a complete redesign of the image selection algorithm. All tiles currently display placeholder bomb images. A new ring-based position system has been implemented for easier square traversal and manipulation.

### What Was Done This Session

1. **Reviewed New JSON Structure**
   - Confirmed `witchesImages.json` renamed to `witches.json`
   - Verified new numeric group system (groups 1-25 instead of letters a-z)
   - **Paired groups (1-5):** Characters that must appear together
     - Group 1: Elphaba + Galinda (18 images)
     - Group 2: Endora + Samantha + Tabitha (12 images)
     - Group 3: Grandmama + Morticia + Wednesday (11 images)
     - Group 4: Sabrina + Salem (7 images)
     - Group 5: Kiki + Jiji (6 images)
   - **Single groups (6-25):** Individual characters (20 total)
   - Each character has unique group number for easy expansion

2. **Stripped Out Old Selection Logic**
   - Removed `groupMap` global variable
   - Removed `buildGroupMap()` function
   - Removed `getRandomImages()` - complex group-based selection
   - Removed `checkAdjacentMatches()` - adjacency constraint checking
   - Removed `shuffleUntilValidAdjacency()` - reshuffling logic
   - Removed `selectCharactersByGroup()` - group selection algorithm
   - Removed verbose console logging in `drawTiles()`

3. **Simplified Game to Baseline**
   - Created simple `getTileImages()` function
   - All tiles now display `_bombTile` image as placeholder
   - Grid system, buttons, and infrastructure intact
   - Ready for new selection algorithm to be built from scratch

4. **Centralized Config File Paths**
   - Moved all JSON file paths to top of `whosThatWitch.js`:
     ```javascript
     const gameConfigFile = "json/gameConfig.json";
     const tileSizesFile = "json/tileSizes.json";
     const witchesFile = "json/witches.json";
     ```
   - Easy to find and change if files are renamed/moved
   - No longer buried in individual load functions

5. **Created Ring-Based Position System**
   - Implemented `EASY_RINGS`, `MEDIUM_RINGS`, `HARD_RINGS` constants
   - Positions organized in concentric rings from outside to inside
   - Clockwise traversal pattern: top → right → bottom → left
   - Each position has: `num` (index), `row`, `col`

   **EASY_RINGS (3×3 grid):**
   - Ring 0: 8 squares (outer perimeter)
   - Ring 1: 1 square (center)

   **MEDIUM_RINGS (4×4 grid):**
   - Ring 0: 12 squares (outer perimeter)
   - Ring 1: 4 squares (inner 2×2 block)

   **HARD_RINGS (5×5 grid):**
   - Ring 0: 16 squares (outer perimeter)
   - Ring 1: 8 squares (middle ring)
   - Ring 2: 1 square (center)

### Current Project Files

```
whosThatWitch/
├── index.html                              # HTML structure
├── css/
│   └── style.css                           # Styling
├── js/
│   └── whosThatWitch.js                    # UPDATED: Simplified, ring positions added
├── assets/
│   ├── witches/                            # 106 original images (32 characters)
│   ├── 99sized/                            # 106 + 1 bomb (99×99 images)
│   ├── 124sized/                           # 106 + 1 bomb (124×124 images)
│   └── 166sized/                           # 106 + 1 bomb (166×166 images)
├── json/
│   ├── gameConfig.json                     # Master configuration
│   ├── tileSizes.json                      # Grid configurations
│   └── witches.json                        # RENAMED: Now numeric groups (1-25)
├── python/
│   ├── resize_witch_images.py              # Image resizing utility
│   └── verify_images.py                    # Image verification script
├── validate_all.py                         # Comprehensive validation
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Original specifications
│   ├── specifications.md                   # Design specifications
│   ├── specifications-technical.md         # Technical specifications
│   ├── Claude-ToBeContinued-2025-1012-1730.md
│   ├── Claude-ToBeContinued-2025-1014-1800.md
│   └── Claude-ToBeContinued-2025-1015-1830.md  # This file
```

### Key Technical Implementations

**Ring Position Structure:**
```javascript
const EASY_RINGS = [
  [ // Ring 0 (outer perimeter - 8 squares)
    {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1}, {num: 2, row: 0, col: 2},  // top →
    {num: 3, row: 1, col: 2}, {num: 4, row: 2, col: 2},                            // right ↓
    {num: 5, row: 2, col: 1}, {num: 6, row: 2, col: 0},                            // bottom ←
    {num: 7, row: 1, col: 0}                                                        // left ↑
  ],
  [ // Ring 1 (center - 1 square)
    {num: 8, row: 1, col: 1}
  ]
];
```

**Simplified Tile Loading:**
```javascript
function getTileImages(count, size) {
  const tiles = [];
  const bombPath = buildImagePath("_bombTile", size);

  for (let i = 0; i < count; i++) {
    tiles.push(bombPath);
  }

  console.log(`Created ${count} placeholder tiles using bomb image`);
  return tiles;
}
```

**Centralized Config Paths:**
```javascript
// At top of whosThatWitch.js
const gameConfigFile = "json/gameConfig.json";
const tileSizesFile = "json/tileSizes.json";
const witchesFile = "json/witches.json";

// Used in load functions
await fetch(gameConfigFile);
await fetch(tileSizesFile);
await fetch(witchesFile);
```

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons display and function
- ✅ Grid lines draw correctly for all three sizes
- ✅ All tiles display bomb image placeholder
- ✅ Config files load correctly
- ✅ Button clicks redraw grid with correct tile count
- ✅ Ring position structures defined and ready to use

**What Was Removed (Ready to Rebuild):**
- ❌ Character selection algorithm (removed)
- ❌ Group-based pairing logic (removed)
- ❌ Matching pair generation (removed)
- ❌ Adjacency constraint checking (removed)
- ❌ Tile shuffling logic (removed)

**What Needs Implementation:**
- ❌ New selection algorithm (not yet designed)
- ❌ Tile flip interaction
- ❌ Face-down tile design
- ❌ Match detection
- ❌ Bomb tile click handling
- ❌ Bonus tile functionality
- ❌ Witch identification UI
- ❌ Scoring system
- ❌ Game win/completion detection

## Character Database

**Total:** 32 unique characters, 109 individual images

**Grouped Characters - Groups 1-5 (10 characters total):**
- **Group 1 (Wicked/Oz):** Elphaba (9), Galinda (9)
- **Group 2 (Bewitched):** Endora (3), Samantha (6), Tabitha (3)
- **Group 3 (Addams Family):** Grandmama (3), Morticia (3), Wednesday (5)
- **Group 4 (Sabrina):** Sabrina (4), Salem (3)
- **Group 5 (Kiki):** Kiki (3), Jiji (3)

**Single Characters - Groups 6-25 (22 characters):**
- Group 6: Hermione (3)
- Group 7: Jadis (3)
- Group 8: Lafayette (3)
- Group 9: Melisandre (3)
- Group 10: Mildred (3)
- Group 11: McGonagall (3)
- Group 12: Wendy (3)
- Group 13: Willow (3)
- Group 14: WitchHazel (3)
- Group 15: Yubaba (3)
- Group 16: Agatha_Harkness (3)
- Group 17: Bai_Suzhen (3)
- Group 18: Circe (3)
- Group 19: Dani_and_Dorian (3)
- Group 20: Granny_Weatherwax (2)
- Group 21: Morgan_le_Fay (2)
- Group 22: Nie_Xiaoqian (2)
- Group 23: Shuimu (2)
- Group 24: The_Weird_Sisters (3)
- Group 25: Xianniang (2)

## Next Steps

### Immediate Priority: Design New Selection Algorithm

**Key Considerations:**
1. **Group Handling:**
   - Groups 1-5: Must select all characters in group together
   - Groups 6-25: Can select independently
   - Group numbers are arbitrary - only matching matters
   - System extensible for future additions

2. **Ring System Usage:**
   - How to use EASY_RINGS, MEDIUM_RINGS, HARD_RINGS?
   - Should selection algorithm consider ring positions?
   - Could be useful for distributing matches across rings
   - Each position has `num`, `row`, `col` for tracking

3. **Selection Strategy Questions:**
   - How many unique characters per difficulty?
   - How to handle bomb tiles and bonus tiles?
   - Should paired characters be placed in specific rings?
   - Any adjacency constraints needed?
   - Random shuffle or strategic placement?

### Medium-Term Tasks

**Tile Flip Mechanic:**
- Design face-down tile appearance
- Implement flip interaction
- Add flip animation
- Track tile state (flipped/unflipped)

**Match Detection:**
- Track first and second flipped tiles
- Compare for matches
- Handle match success/failure
- Bomb tile penalties
- Bonus tile rewards

**Witch Identification:**
- "Who's That Witch?" UI after match
- Input validation using `name_text`
- Hints/feedback using `description_text`
- Bonus points for correct identification

**Scoring System:**
- Points for matches
- Bonus for witch identification
- Penalty for bombs
- Completion bonus

### Long-Term Tasks

- Game win/completion detection
- Instructions screen
- Reset/new game button
- Sound effects
- Animations
- Victory screen
- High score tracking
- Integration with parent Halloween app (ES6 module export)

## Technical Notes

### Ring Position Benefits

**Advantages of ring-based system:**
- Easy iteration layer by layer
- Natural for spiral animations
- Could distribute matches across rings
- Clockwise traversal pattern
- Each position tracked by `num` index

**Example Usage:**
```javascript
// Get all positions for a difficulty
const allPositions = EASY_RINGS.flat();

// Shuffle while preserving position data
const shuffled = [...allPositions].sort(() => Math.random() - 0.5);

// Each position still has num, row, col
shuffled.forEach(pos => {
  console.log(`Square ${pos.num} at row ${pos.row}, col ${pos.col}`);
});
```

### Group System Flexibility

**Current structure allows:**
- Adding new characters with new group numbers (26, 27, etc.)
- Adding characters to existing groups
- Group numbers don't need to be sequential
- Only matching numbers matters for grouping
- No code changes needed to support new groups

### Config File Organization

**All config paths centralized at top of whosThatWitch.js:**
```javascript
const gameConfigFile = "json/gameConfig.json";
const tileSizesFile = "json/tileSizes.json";
const witchesFile = "json/witches.json";
```

**Future config files can be added here:**
- Sound effects config?
- Animation timing config?
- Scoring rules config?
- UI text/labels config?

## Development Philosophy

Following John's preferences:
- **Incremental development:** Build new selection algorithm step by step
- **Simple, understandable code:** Easy to follow logic over complex optimization
- **Well-documented:** Clear comments explaining design decisions
- **Functional approach:** Prefer functional patterns where appropriate
- **Configuration over code:** Ring positions are constants, not generated
- **Wait for approval:** Don't implement new selection logic without design discussion

## Git Commit Information

**Version:** v0.04-prep
**Commit Message Suggestion:**
```
v0.04-prep - Reset selection logic & add ring position system

- Remove all old group-based selection logic
- Simplify to bomb tile placeholders (clean baseline)
- Rename witchesImages.json → witches.json
- Update to numeric group system (1-25 instead of a-z)
- Centralize config file paths at top of code
- Add EASY_RINGS, MEDIUM_RINGS, HARD_RINGS position structures
- Organize squares in clockwise rings from outside to inside
- Each position has num (index), row, col for tracking

Ready for new selection algorithm design.

Files changed:
- js/whosThatWitch.js (major simplification + ring positions)
- json/witches.json (renamed, numeric groups)
```

---

**Next Session Start:**
1. Read this file to understand clean baseline state
2. Discuss new selection algorithm design
3. Consider how to use ring position system
4. Decide group handling strategy
5. Begin implementing new selection logic

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1015-1830.md (this file)
- specifications.md (for design context)
- js/whosThatWitch.js (review simplified code)
- json/witches.json (confirm group structure)
