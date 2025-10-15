# Who's That Witch? - Session Notes
**Date:** October 14, 2025 - 18:00
**Session:** Group-Based Selection & Adjacency Constraints
**Version:** v0.03

## Current State

The "Who's That Witch?" game now features intelligent group-based character selection and adjacency constraints to prevent matching tiles from being too close together. The game ensures that paired/grouped characters (like Elphaba & Galinda) always appear together, and tiles are distributed to make the game appropriately challenging for each difficulty level.

### What Was Done This Session

1. **Group-Based Random Selection System**
   - Restructured `witchesImages.json` to add "group" field to each image entry
   - Created 5 character groups:
     - **Group A (Wicked):** Elphaba, Galinda (2 characters)
     - **Group B (Bewitched):** Endora, Samantha, Tabitha (3 characters)
     - **Group C (Addams Family):** Grandmama, Morticia, Wednesday (3 characters)
     - **Group D (Sabrina):** Sabrina, Salem (2 characters)
     - **Group E (Kiki):** Kiki, JiJi (2 characters)
     - **Group Z (Singles):** All other 24 characters (independent selection)

   - Built `groupMap` on initialization for efficient lookups
   - Rewrote `selectCharactersByGroup()` to:
     - Identify Group Z as singles pool (can pick any number)
     - Identify Groups A-E as paired groups (must take complete group)
     - Select complete paired groups first
     - Fill remaining slots with random singles from Group Z
     - Never break up paired/grouped characters

2. **Adjacency Constraint System**
   - Created `checkAdjacentMatches()` function:
     - Converts 1D tile array to 2D grid
     - Checks horizontal neighbors (left-right)
     - Checks vertical neighbors (up-down)
     - Returns count of adjacent matching pairs

   - Created `shuffleUntilValidAdjacency()` function:
     - **EASY/MEDIUM:** Max 1 adjacent matching pair allowed
     - **HARD:** 0 adjacent matching pairs allowed
     - Reshuffles up to 1000 times to meet constraints
     - Logs number of reshuffles needed

   - Modified `getRandomImages()` to use adjacency-aware shuffling

3. **Comprehensive Error Checking & Debugging**
   - Added validation to `buildImagePath()` for undefined inputs
   - Added character validation in image selection
   - Added bomb tile path validation
   - Added final array validation before returning
   - Enhanced `drawTiles()` with:
     - Per-tile logging showing path being loaded
     - Load success/failure event handlers
     - Immediate error detection for undefined paths

4. **Bug Fixes**
   - Fixed Jiji filename case mismatch (was `Jiji`, actual files are `JiJi`)
   - Fixed Group Z logic bug where 24 singles were treated as one paired group
   - Fixed undefined tile paths caused by insufficient character selection
   - Validated all 327 image files (109 entries × 3 sizes) match JSON perfectly

### Current Project Files

```
whosThatWitch/
├── index.html                              # HTML structure
├── css/
│   └── style.css                           # Styling
├── js/
│   └── whosThatWitch.js                    # UPDATED: Group selection & adjacency
├── assets/
│   ├── witches/                            # 106 original images (32 characters)
│   ├── 99sized/                            # 106 + 1 bomb (99×99 images)
│   ├── 124sized/                           # 106 + 1 bomb (124×124 images)
│   └── 166sized/                           # 106 + 1 bomb (166×166 images)
├── json/
│   ├── gameConfig.json                     # Master configuration
│   ├── tileSizes.json                      # Grid configurations
│   └── witchesImages.json                  # UPDATED: Added "group" field
├── python/
│   ├── resize_witch_images.py              # Image resizing utility
│   └── verify_images.py                    # Image verification script
├── validate_all.py                         # NEW: Comprehensive validation
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Original specifications
│   ├── specifications.md                   # Design specifications
│   ├── specifications-technical.md         # Technical specifications
│   ├── Claude-ToBeContinued-2025-1012-1620.md
│   ├── Claude-ToBeContinued-2025-1012-1730.md
│   └── Claude-ToBeContinued-2025-1014-1800.md  # This file
```

### Key Technical Implementations

**Group-Based Selection Algorithm:**
```javascript
// Strategy:
// 1. Group Z = singles pool (pick any number individually)
// 2. Groups A-E = paired groups (must take entire group or skip)
// 3. Select complete paired groups first
// 4. Fill gaps with random singles from Group Z

function selectCharactersByGroup(uniqueImagesNeeded) {
  // Separate Group Z (singles) from paired groups
  const SINGLES_GROUP = 'z';
  const pairedGroups = [];     // A, B, C, D, E
  const singleCharacters = []; // All from Group Z

  // Add paired groups (only if entire group fits)
  for (const group of shuffledPairedGroups) {
    if (selectedCharacters.length + group.characters.length <= uniqueImagesNeeded) {
      selectedCharacters.push(...group.characters); // Add entire group
    }
  }

  // Fill remaining with singles
  const remainingNeeded = uniqueImagesNeeded - selectedCharacters.length;
  if (remainingNeeded > 0) {
    selectedCharacters.push(...shuffledSingles.slice(0, remainingNeeded));
  }

  return selectedCharacters;
}
```

**Adjacency Checking Algorithm:**
```javascript
function checkAdjacentMatches(tiles, gridSize) {
  // Convert to 2D grid
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    grid.push(tiles.slice(i * gridSize, (i + 1) * gridSize));
  }

  let adjacentCount = 0;

  // Check horizontal (left-right)
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize - 1; col++) {
      if (grid[row][col] === grid[row][col + 1]) adjacentCount++;
    }
  }

  // Check vertical (up-down)
  for (let row = 0; row < gridSize - 1; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === grid[row + 1][col]) adjacentCount++;
    }
  }

  return adjacentCount;
}

// Reshuffle until constraint met
function shuffleUntilValidAdjacency(tiles, gridSize, difficultyId) {
  const maxAdjacent = (difficultyId === 'hardTiles') ? 0 : 1;
  let attempts = 0;

  do {
    shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);
    adjacentCount = checkAdjacentMatches(shuffledTiles, gridSize);
    attempts++;
  } while (adjacentCount > maxAdjacent && attempts < 1000);

  return shuffledTiles;
}
```

**Character Database Structure:**
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
      ...
    ],
    "Galinda": [
      {
        "filename": "Glinda(Broadway_Oz)01",
        "group": "a",
        ...
      }
    ]
  }
}
```

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons display and function
- ✅ Grid lines draw correctly for all three sizes
- ✅ Group-based character selection (paired characters always together)
- ✅ Matching pairs generated correctly
- ✅ Bomb tiles appear in random positions
- ✅ Adjacency constraints enforced (0 for HARD, max 1 for EASY/MEDIUM)
- ✅ All 327 image files validated and loading correctly
- ✅ Each button click shows new random selection
- ✅ All images properly sized and positioned
- ✅ Configuration system fully functional
- ✅ Comprehensive error logging and debugging

**What Needs Implementation:**
- ❌ Tile flip interaction (face-down → face-up)
- ❌ Face-down tile design/appearance
- ❌ Match detection when two tiles flipped
- ❌ Bomb tile click handling (penalty)
- ❌ Bonus tile functionality (not yet designed)
- ❌ Witch identification UI
- ❌ Scoring system
- ❌ Game win/completion detection

## Character Database

**Total:** 32 unique characters, 109 individual images

**Grouped Characters (10 total):**
- **Group A (Wicked):** Elphaba (9 images), Galinda (9 images)
- **Group B (Bewitched):** Endora (3), Samantha (6), Tabitha (3)
- **Group C (Addams Family):** Grandmama (3), Morticia (3), Wednesday (5)
- **Group D (Sabrina):** Sabrina (4), Salem (3)
- **Group E (Kiki):** Kiki (3), JiJi (3)

**Single Characters - Group Z (24 total):**
Hermione, Jadis, Lafayette, Melisandre, Mildred, McGonagall, Wendy, Willow, WitchHazel, Yubaba, Agatha_Harkness, Bai_Suzhen, Circe, Dani_and_Dorian, Granny_Weatherwax, Morgan_le_Fay, Nie_Xiaoqian, Shuimu, The_Weird_Sisters, Xianniang (and 4 more)

## Next Steps

### Immediate Priority: Tile Flip Mechanic

**Design Decisions Needed:**
1. **Face-Down Appearance:** What should unflipped tiles look like?
   - Solid purple with pattern?
   - Halloween-themed back design?
   - Question mark icon?
   - Witch hat silhouette?

2. **Flip Animation:**
   - CSS 3D transform (flip effect)?
   - Simple fade transition?
   - Slide reveal?

**Implementation Tasks:**
1. Add tile state tracking (flipped/unflipped)
2. Create face-down tile CSS styling
3. Add click handlers to tiles
4. Implement flip animation
5. Track which tiles are currently flipped
6. Prevent flipping more than 2 tiles at once
7. Prevent re-flipping already matched tiles

### Medium-Term Tasks

**Match Detection Logic:**
1. Track first flipped tile
2. Track second flipped tile
3. Compare image paths
4. Handle match success:
   - Keep tiles face-up
   - Mark as matched
   - Prevent further clicks
   - Award points
5. Handle match failure:
   - Delay, then flip both back
   - No points
6. Handle bomb click:
   - Penalty action (lose points? lose life? time penalty?)
   - Visual/audio feedback

**Bonus Tile Design:**
- What does bonus tile do?
- Extra points?
- Reveal hint?
- Extra time?
- Free match?

**Witch Identification Feature:**
- After successful match, ask "Who's That Witch?"
- Input field or multiple choice?
- Use `name_text` for validation
- Use `description_text` for hints/feedback
- Bonus points for correct identification

**Scoring System:**
- Points for matches
- Bonus for witch identification
- Penalty for bombs
- Bonus for completing level
- Time bonus?

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

### Group Selection Edge Cases

**Example (EASY - need 4 characters):**
- Shuffle paired groups: `[B:3, E:2, A:2, C:3, D:2]`
- Add B (3 chars) → total: 3
- Add E (2 chars) → total: 5 (exceeds 4, skip)
- Add A (2 chars) → total: 5 (exceeds 4, skip)
- Remaining needed: 1
- Add 1 random single from Group Z
- **Final:** 3 Bewitched + 1 single = 4 characters ✓

**Example (HARD - need 11 characters):**
- Add complete paired groups: maybe get 10 total
- Add 1 single from Group Z to reach 11
- **Result:** All paired characters stay together ✓

### Adjacency Constraint Performance

Most grids meet constraints in 1-50 reshuffles. The 1000-attempt safety limit prevents infinite loops in edge cases. Console logs show actual reshuffle count for monitoring.

### Debugging Tools

**Console Logging Shows:**
- Group map structure on load
- Which paired groups are selected
- Which singles are added
- Number of adjacency reshuffles
- Each tile's path as it loads
- Load success/failure for each image

**Validation Script:**
```bash
python3 validate_all.py
```
Checks all 327 image files against JSON entries.

## Git Commit Information

**Version:** v0.03
**Commit Message Suggestion:**
```
v0.03 - Add group-based selection & adjacency constraints

- Implement group-based character selection system
- Add adjacency constraint checking (0 for HARD, max 1 for EASY/MEDIUM)
- Fix Group Z singles pool logic
- Fix Jiji filename case mismatch
- Add comprehensive error checking and debugging
- Validate all 327 image files

Features:
- Paired characters always appear together (Elphaba+Galinda, etc.)
- Matching tiles properly distributed across grid
- Group A-E: paired/grouped characters (10 total)
- Group Z: singles pool (24 characters)
- Adjacency-aware tile shuffling
- Detailed console logging for debugging

Next: Tile flip interaction and match detection
```

---

**Next Session Start:**
1. Read this file
2. Review specifications.md for design decisions
3. Decide on tile back design
4. Implement tile flip mechanic
5. Add match detection logic

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1014-1800.md (this file)
- specifications.md
- specifications-technical.md
- js/whosThatWitch.js (review current state)
