# Who's That Witch? - Session Notes
**Date:** October 16, 2025 - 09:30
**Session:** Adjacency Constraints & Tile Placement Algorithm
**Version:** v0.06

## Current State

The "Who's That Witch?" game now has a complete tile placement algorithm with adjacency constraints. Special tiles (bombs and bonus) are never placed adjacent to each other, and matching pairs avoid adjacency through an intelligent retry system. All tile placement now uses code constants as the single source of truth, eliminating JSON position dependencies.

### What Was Done This Session

1. **Updated Bonus Tile Images**
   - Created custom bonus tile images: `_bonusTile_99.png`, `_bonusTile_124.png`, `_bonusTile_166.png`
   - Updated code to use dedicated bonus tiles instead of reusing bomb images

2. **Changed Tile Type Naming**
   - Changed `type: 'witch'` to `type: 'gameTile'` throughout codebase
   - More generic, theme-agnostic naming
   - Three tile types: `'gameTile'`, `'bomb'`, `'bonus'`

3. **Added pairId to GameTiles**
   - Each gameTile now has `pairId: groupNum` property
   - Uses the group number as unique identifier for matching pairs
   - Makes finding matching pairs trivial: `gameTiles.filter(t => t.pairId === 5)`
   - Much clearer than comparing object references

4. **Implemented Adjacency Constraint Algorithm**

   **Phase 1: Special Tiles (Bombs & Bonus)**
   - Placed first with strict adjacency checking
   - Each special tile placed in random position that is NOT adjacent (including diagonals) to any previously placed special tiles
   - Uses `getAvailablePositions()` helper to filter out adjacent squares
   - Example: If bonus at position 2, bombs cannot be in positions 0, 1, 3, 4, 5 (all adjacent including diagonal)

   **Phase 2: GameTiles (Matching Pairs)**
   - Retry algorithm with up to 100 attempts
   - Each attempt:
     1. Clear any gameTiles from previous attempt (keep special tiles)
     2. For each pairId:
        - Place first tile randomly in any available square
        - Place second tile randomly in non-adjacent square (excludes all 8 surrounding squares)
        - If no non-adjacent square available → FAIL, retry entire attempt
     3. If all pairs placed successfully → SUCCESS, exit
   - After 100 failed attempts: fallback to random placement (accept adjacency)

   **Fallback Code Fix:**
   - Critical bug fixed: After 100th failed attempt, partial gameTile placements weren't cleared
   - Now explicitly clears all gameTiles before fallback placement
   - Uses only `filledSquares` (special tiles) to find available squares
   - Ensures all gameTiles can be placed

5. **Eliminated JSON Positions Dependency**

   **Problem Identified:**
   - Code was using two parallel data sources:
     - `EASY_SQUARES`, `MEDIUM_SQUARES`, `HARD_SQUARES` (code constants) for placement logic
     - `positions` from JSON for drawing with x/y coordinates
   - Index mismatch caused tiles to appear at wrong positions randomly
   - Especially noticeable on EASY when fallback triggered

   **Solution:**
   - Made code constants the single source of truth
   - Modified `drawGrid()` to pass `squares` instead of JSON `positions`
   - Rewrote `drawTiles()` to calculate x/y from row/col:
     ```javascript
     const x = square.col * (tileSize + lineSize);
     const y = square.row * (tileSize + lineSize);
     ```
   - Eliminated all references to JSON `positions` array

6. **Added Comprehensive Diagnostic Logging**
   - Fallback code logs:
     - Total squares, filled squares, gameTiles count
     - Null positions before/after placement
     - Available squares for placement
     - Each tile placement with pairId
   - Helped identify the partial placement bug

### New Helper Functions

```javascript
/**
 * areAdjacent(pos1, pos2, includeDiagonal)
 * Checks if two positions are adjacent
 * Supports both 4-direction (orthogonal) and 8-direction (including diagonal)
 */

/**
 * getAvailablePositions(allPositions, filledPositions, excludeAdjacentTo)
 * Returns positions that are not filled AND not adjacent to excluded positions
 * Used for placing special tiles and matching pairs
 */

/**
 * getSquaresForDifficulty(difficultyId)
 * Returns appropriate EASY/MEDIUM/HARD_SQUARES array for difficulty
 */

/**
 * assignTilesToPositions(tilesByType, squares)
 * Core placement algorithm with adjacency constraints
 * Returns position-to-tile mapping array
 */
```

### Data Structure Changes

**selectImagesForDifficulty() now returns:**
```javascript
{
  gameTiles: [
    {imagePath, name_text, description_text, type: 'gameTile', pairId: groupNum},
    {imagePath, name_text, description_text, type: 'gameTile', pairId: groupNum}, // same object ref
    ...
  ],
  bombs: [{imagePath, type: 'bomb'}, ...],
  bonus: [{imagePath, type: 'bonus'}, ...]
}
```

**assignTilesToPositions() returns:**
```javascript
[
  tileObject,  // at index 0 (square num 0)
  tileObject,  // at index 1 (square num 1)
  ...
  tileObject   // at index 8/15/24 (last square)
]
```

### Current Project Files

```
whosThatWitch/
├── index.html                              # No changes
├── css/
│   └── style.css                           # No changes
├── js/
│   └── whosThatWitch.js                    # MAJOR UPDATE: New placement algorithm
├── assets/
│   ├── witches/                            # 106 original images
│   ├── 99sized/                            # 106 + 1 bomb + 1 bonus (99×99 images)
│   ├── 124sized/                           # 106 + 1 bomb + 1 bonus (124×124 images)
│   └── 166sized/                           # 106 + 1 bomb + 1 bonus (166×166 images)
├── json/
│   ├── gameConfig.json                     # Master configuration
│   ├── tileSizes.json                      # Grid configurations (positions no longer used)
│   └── witches.json                        # Numeric groups (1-25)
├── python/
│   ├── resize_witch_images.py              # Image resizing utility
│   └── verify_images.py                    # Image verification script
├── validate_all.py                         # Comprehensive validation
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Original specifications
│   ├── specifications.md                   # UPDATED: Tile placement algorithm documented
│   ├── specifications-technical.md         # Technical specifications
│   ├── Claude-ToBeContinued-2025-1014-1800.md
│   ├── Claude-ToBeContinued-2025-1015-1830.md
│   ├── Claude-ToBeContinued-2025-1015-2000.md
│   └── Claude-ToBeContinued-2025-1016-0930.md  # This file
```

### Key Technical Implementations

**Adjacency Detection:**
```javascript
function areAdjacent(pos1, pos2, includeDiagonal = true) {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);

  if (includeDiagonal) {
    // Adjacent if within 1 step in any direction (8 surrounding squares)
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
  } else {
    // Adjacent only horizontally or vertically (4 directions)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }
}
```

**Position-Based Coordinate Calculation:**
```javascript
// In drawTiles():
const x = square.col * (tileSize + lineSize);
const y = square.row * (tileSize + lineSize);
```

**Retry Algorithm Pattern:**
```javascript
const maxAttempts = 100;
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  // Clear previous attempt
  // Try to place all pairs with constraints
  // If successful, exit loop
}
// Fallback if all attempts failed
```

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons work
- ✅ Grid lines draw correctly
- ✅ Random witch selection from groups with pairId tracking
- ✅ Matching pairs created correctly
- ✅ Bomb and bonus tiles use dedicated images
- ✅ Special tiles never adjacent to each other (including diagonals)
- ✅ GameTile pairs avoid adjacency (up to 100 retry attempts)
- ✅ Fallback placement works correctly after 100 attempts
- ✅ Witch list displays to the right
- ✅ Hover tooltips show descriptions
- ✅ Config files load correctly
- ✅ All metadata preserved on tiles
- ✅ Code constants are single source of truth for positions

**Adjacency Success Rates:**
- **EASY (3×3, 4 pairs, 1 bonus):** Usually reaches fallback (grid too small for constraints)
  - Fallback now works correctly - all tiles placed properly
- **MEDIUM (4×4, 7 pairs, 1 bonus + 1 bomb):** Success within 1-10 attempts typically
- **HARD (5×5, 11 pairs, 1 bonus + 2 bombs):** Success within 1-20 attempts typically

**What Needs Work:**
- ❌ Tile flip interaction not implemented
- ❌ Face-down tile design not created
- ❌ Tiles not clickable yet
- ❌ Match detection not implemented
- ❌ Bomb tile click handling not implemented
- ❌ Bonus tile functionality not implemented
- ❌ Witch identification UI not implemented
- ❌ Scoring system not implemented
- ❌ Game win/completion detection not implemented

## Algorithm Analysis

### Why EASY Often Hits 100 Attempts

**EASY Configuration:**
- 3×3 grid = 9 squares
- 1 bonus tile (placed first)
- 8 remaining squares for 4 pairs

**The Problem:**
When bonus tile is placed in certain positions (especially center or edges), it can create situations where:
1. First tile of a pair is randomly placed
2. ALL remaining squares are adjacent to that first tile
3. No valid position for second tile → attempt fails

**Example Scenario:**
- Bonus at position 4 (center of 3×3)
- First pair tile at position 0 (top-left)
- Positions adjacent to 0: 1, 3, 4 (already has bonus)
- Positions adjacent to 4: 0, 1, 2, 3, 5, 6, 7, 8 (all 8 surrounding)
- Combined exclusions cover almost entire grid
- Very few valid positions remain for second tile

**Why Fallback Works:**
After 100 failed attempts, fallback:
1. Clears all gameTiles
2. Places all 8 tiles randomly (accepts adjacency)
3. Ensures every square gets filled properly

### Design Decision: Accept Fallback for EASY

Given the constraints:
- EASY is meant to be quick and simple
- 3×3 grid too small for strict adjacency with 4 pairs
- Fallback ensures game always playable
- Players unlikely to notice/care about adjacent pairs on EASY

Alternative would be reducing EASY to 3 pairs instead of 4, but that reduces gameplay variety.

## Next Steps

### Immediate Priority: Make Tiles Clickable

**Goal:** Add interactivity to tiles

**Tasks:**
1. Add click event listeners to tile images
2. Visual feedback on click (highlight, border change, etc.)
3. Track which tiles have been clicked
4. Prevent re-clicking already matched/flipped tiles
5. Foundation for tile flip mechanic

### Medium-Term Tasks

**2. Design Face-Down Tile Appearance**
- Create tile back design (Halloween themed)
- Could be: witch hat, cauldron, moon, generic pattern
- Needs to work at all three sizes (166px, 124px, 99px)

**3. Implement Tile Flip Animation**
- CSS transform or JavaScript animation
- Flip from face-down to face-up on click
- Track tile state (face-up vs face-down)

**4. Implement Match Detection**
- Track first and second clicked tiles
- Compare pairId values for match
- Handle match success (keep face-up, remove from game)
- Handle match failure (flip both back face-down)

### Long-Term Tasks

**Bomb & Bonus Tile Functionality:**
- Bomb: Penalty (lose points? flip all tiles back? timer penalty?)
- Bonus: Reward (extra points? hint? extra time?)

**Witch Identification UI:**
- After successful match, ask "Who's That Witch?"
- Input field or multiple choice
- Validate using name_text
- Show description_text as hint
- Bonus points for correct identification

**Scoring System:**
- Points for matches
- Bonus for witch identification
- Penalty for bombs
- Time tracking (optional)
- High score tracking

**Game Completion:**
- Detect when all pairs matched
- Victory screen
- Display final score
- Reset/new game button

## Technical Notes

### Why pairId Instead of Object References?

**Old approach:**
```javascript
tiles.push(tileData);
tiles.push(tileData);  // Same object, can compare with ===
```

**New approach:**
```javascript
{
  imagePath: "...",
  name_text: "...",
  pairId: 5  // Group number
}
```

**Benefits:**
- Explicit identification of matching pairs
- Easier debugging (can log pairId)
- Can filter/find pairs easily
- Less reliant on JavaScript object reference behavior
- More maintainable code

### Single Source of Truth Pattern

**Before:**
- Code constants for placement logic
- JSON positions for drawing
- Mismatch between arrays caused bugs

**After:**
- Code constants (`EASY_SQUARES`, etc.) are authoritative
- x/y calculated from row/col
- JSON only used for configuration values (tileSize, lineSize, etc.)
- No index alignment issues

**Benefits:**
- Eliminates entire class of index mismatch bugs
- Code is self-contained (less dependency on JSON)
- Easier to reason about tile positions
- JSON can be in any order without breaking

### Retry Algorithm Rationale

**Why 100 attempts?**
- MEDIUM/HARD almost always succeed within 20 attempts
- EASY often impossible due to grid constraints
- 100 gives reasonable chance without hanging
- Fallback ensures game always completes

**Why retry entire placement instead of just failed pair?**
- Simpler logic
- Each retry has different random seed
- Earlier placements affect later options
- Complete restart gives fresh chance

**Why diagonal adjacency for special tiles but same for pairs?**
- Keeps special tiles well-separated visually
- Pairs just need to not be obviously next to each other
- Diagonal adjacency for pairs would make EASY impossible

## Development Philosophy

Following John's preferences:
- **Simple, incremental approach:** Build one feature at a time
- **Easy to understand:** Clear code over clever optimizations
- **Well-documented:** Explain "why" not just "what"
- **Functional patterns:** Prefer pure functions where possible
- **Wait for approval:** Don't implement major features without discussion
- **Accept good enough:** EASY fallback is fine, doesn't need to be perfect

## Git Commit Information

**Version:** v0.06
**Commit Message Suggestion:**
```
v0.06 - Implement adjacency constraints & fix tile placement

- Add custom bonus tile images (_bonusTile_99/124/166.png)
- Change tile type from 'witch' to 'gameTile' (more generic)
- Add pairId to gameTiles for easy pair identification
- Implement adjacency constraint algorithm:
  - Special tiles (bombs/bonus) never adjacent (including diagonals)
  - GameTile pairs avoid adjacency with 100-attempt retry
  - Fallback placement if constraints can't be satisfied
- Fix fallback bug: clear partial placements from failed attempt
- Eliminate JSON positions dependency:
  - Code constants (EASY_SQUARES, etc.) are single source of truth
  - Calculate x/y from row/col instead of using JSON
  - Remove index mismatch bugs
- Add helper functions: areAdjacent, getAvailablePositions, getSquaresForDifficulty
- Add comprehensive diagnostic logging for debugging

Files changed:
- js/whosThatWitch.js (major: new placement algorithm, 150+ lines added)
- assets/99sized/_bonusTile_99.png (new)
- assets/124sized/_bonusTile_124.png (new)
- assets/166sized/_bonusTile_166.png (new)
- claude-john-docs/specifications.md (updated algorithm section)
- claude-john-docs/Claude-ToBeContinued-2025-1016-0930.md (this file)
```

---

**Next Session Start:**
1. Read this file to understand current baseline
2. Discuss clickable tiles implementation approach
3. Plan tile flip mechanic and face-down design
4. Consider match detection algorithm

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1016-0930.md (this file)
- specifications.md (for updated tile placement documentation)
- js/whosThatWitch.js (review placement algorithm implementation)
