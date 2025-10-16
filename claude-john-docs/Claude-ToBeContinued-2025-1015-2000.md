# Who's That Witch? - Session Notes
**Date:** October 15, 2025 - 20:00
**Session:** Simplified Selection System & Witch List UI
**Version:** v0.05

## Current State

The "Who's That Witch?" game now has a working basic image selection system. The grid displays random witch images (with pairs for matching), bomb tiles, and bonus tiles. A witch list appears to the right of the grid showing which witches are in the current game.

### What Was Done This Session

1. **Simplified Square Position System**
   - Removed complex ring-based position structures (EASY_RINGS, MEDIUM_RINGS, HARD_RINGS)
   - Replaced with simple flat arrays counting left→right, top→bottom
   - Each square: `{num: index, row: row, col: col}`
   - EASY_SQUARES: 9 positions (3×3)
   - MEDIUM_SQUARES: 16 positions (4×4)
   - HARD_SQUARES: 25 positions (5×5)
   - Two squares per line for easy visual scanning

2. **Implemented Basic Image Selection Algorithm**
   - Created `buildGroupedWitches()` to organize images by group number
   - Groups 1-5: Multi-character groups (Wicked, Bewitched, Addams Family, etc.)
   - Groups 6-25: Single character groups
   - `selectImagesForDifficulty()` function:
     - Randomly selects required number of groups
     - For each group: randomly picks one character
     - For that character: randomly picks one image
     - Creates matching pairs (each image appears twice)
     - Adds bomb tiles and bonus tiles
     - Shuffles everything

3. **Preserved Full Metadata**
   - Each tile stores complete data object:
     ```javascript
     {
       imagePath: "assets/99sized/Elphaba_99.png",
       name_text: "Elphaba",
       description_text: "This is Elphaba...",
       type: "witch" | "bomb" | "bonus"
     }
     ```
   - Metadata stored on img elements via data attributes:
     - `img.dataset.type`
     - `img.dataset.nameText`
     - `img.dataset.descriptionText`

4. **Added Witch List UI**
   - Positioned to the right of the grid (left: 570px)
   - Displays only witch names (compact, no scrollbar)
   - Description appears on hover as styled tooltip
   - Orange witch names with purple-themed tooltip
   - Automatically updates when difficulty changes

5. **Helper Functions**
   - `shuffleArray()` - Fisher-Yates shuffle
   - `getRandomFromArray()` - random element selection
   - `updateWitchList()` - extracts unique witches and displays them

### Current Project Files

```
whosThatWitch/
├── index.html                              # UPDATED: Added witch-list div
├── css/
│   └── style.css                           # UPDATED: Witch list styling with hover tooltip
├── js/
│   └── whosThatWitch.js                    # MAJOR UPDATE: Selection system implemented
├── assets/
│   ├── witches/                            # 106 original images (32 characters)
│   ├── 99sized/                            # 106 + 1 bomb (99×99 images)
│   ├── 124sized/                           # 106 + 1 bomb (124×124 images)
│   └── 166sized/                           # 106 + 1 bomb (166×166 images)
├── json/
│   ├── gameConfig.json                     # Master configuration
│   ├── tileSizes.json                      # Grid configurations
│   └── witches.json                        # Numeric groups (1-25)
├── python/
│   ├── resize_witch_images.py              # Image resizing utility
│   └── verify_images.py                    # Image verification script
├── validate_all.py                         # Comprehensive validation
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Original specifications
│   ├── specifications.md                   # UPDATED: Design specifications
│   ├── specifications-technical.md         # Technical specifications
│   ├── Claude-ToBeContinued-2025-1014-1800.md
│   ├── Claude-ToBeContinued-2025-1015-1830.md
│   └── Claude-ToBeContinued-2025-1015-2000.md  # This file
```

### Key Technical Implementations

**Simple Square Position Arrays:**
```javascript
const EASY_SQUARES = [
  {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1},
  {num: 2, row: 0, col: 2}, {num: 3, row: 1, col: 0},
  {num: 4, row: 1, col: 1}, {num: 5, row: 1, col: 2},
  {num: 6, row: 2, col: 0}, {num: 7, row: 2, col: 1},
  {num: 8, row: 2, col: 2}
];
```

**Grouped Witch Data Structure:**
```javascript
groupedWitches = {
  1: { "Elphaba": [...images...], "Galinda": [...images...] },
  2: { "Endora": [...], "Samantha": [...], "Tabitha": [...] },
  6: { "Hermione": [...images...] },
  ...
}
```

**Tile Selection Logic:**
```javascript
// Calculate unique images needed
const uniqueImagesNeeded = imageTiles / 2;  // Each appears twice

// Randomly select groups
// For each group: pick random character, then random image
// Create pairs
// Add bombs and bonus tiles
// Shuffle everything
```

**Witch List with Hover Tooltips:**
```css
.witch-description {
  display: none;  /* Hidden by default */
  position: absolute;
  /* Tooltip styling */
}

.witch-item:hover .witch-description {
  display: block;  /* Show on hover */
}
```

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons work
- ✅ Grid lines draw correctly
- ✅ Random witch selection from groups
- ✅ Matching pairs created correctly
- ✅ Bomb and bonus tiles added
- ✅ Images shuffle randomly
- ✅ Witch list displays to the right
- ✅ Hover tooltips show descriptions
- ✅ Config files load correctly
- ✅ All metadata preserved on tiles

**What Needs Work:**
- ⚠️ No adjacency constraints (matching tiles can be next to each other)
- ❌ Tile flip interaction not implemented
- ❌ Face-down tile design not created
- ❌ Tiles not clickable yet
- ❌ Match detection not implemented
- ❌ Bomb tile click handling not implemented
- ❌ Bonus tile functionality not implemented
- ❌ Witch identification UI not implemented
- ❌ Scoring system not implemented
- ❌ Game win/completion detection not implemented

## Character Database

**Total:** 32 unique characters, 109 individual images

**Grouped Characters - Groups 1-5 (10 characters total):**
- **Group 1 (Wicked/Oz):** Elphaba (9), Galinda (9) - 18 images
- **Group 2 (Bewitched):** Endora (3), Samantha (6), Tabitha (3) - 12 images
- **Group 3 (Addams Family):** Grandmama (3), Morticia (3), Wednesday (5) - 11 images
- **Group 4 (Sabrina):** Sabrina (4), Salem (3) - 7 images
- **Group 5 (Kiki):** Kiki (3), Jiji (3) - 6 images

**Single Characters - Groups 6-25 (22 characters):**
- Groups 6-25: Individual witches with 2-3 images each

## Next Steps

### Immediate Priority: Adjacency Constraints

**Goal:** Avoid matching pairs being placed next to each other on the grid

**Approach Options:**
1. **Post-shuffle checking:** After shuffle, check for adjacent matches, reshuffle if found
2. **Strategic placement:** Place matching tiles with minimum distance requirement
3. **Constraint-based shuffle:** Shuffle with rules (similar to old system, but simpler)

**Considerations:**
- EASY (3×3): More lenient - allow some adjacency?
- MEDIUM (4×4): Moderate - maximum 1 adjacent pair?
- HARD (5×5): Strict - no adjacent matching pairs?
- Adjacent means: left, right, top, bottom (not diagonal)
- How many reshuffle attempts before giving up?

### Medium-Term Tasks

**2. Format Description Text Display**
- Current: Plain text in tooltip
- Possible improvements:
  - Better line breaks
  - Truncation for very long descriptions
  - Icon or visual indicator for hover
  - Better positioning (avoid going off-screen)

**3. Make Grid Squares Clickable**
- Add click event listeners to tile images
- Visual feedback on click (highlight, border, etc.)
- Track which tiles have been clicked
- Prevent re-clicking already matched tiles
- This is foundation for tile flip mechanic

### Long-Term Tasks

**Tile Flip Mechanic:**
- Design face-down tile appearance
- Implement flip animation
- Toggle between face-up and face-down
- Track tile state

**Match Detection:**
- Track first and second clicked tiles
- Compare for matches (same tile data object reference)
- Handle match success (remove or mark as matched)
- Handle match failure (flip back face-down)
- Bomb tile penalties
- Bonus tile rewards

**Witch Identification:**
- "Who's That Witch?" UI after match
- Input field for witch name
- Validation using `name_text`
- Hints/feedback using `description_text`
- Bonus points for correct identification

**Scoring System:**
- Points for matches
- Bonus for witch identification
- Penalty for bombs
- Time bonus (optional)
- Completion bonus

**Game Completion:**
- Detect when all matches found
- Victory screen
- Display final score
- Reset/new game option

## Technical Notes

### Why Simplified Position System?

The ring-based system was overly complex for what we need. A simple left-to-right, top-to-bottom array:
- Easier to understand and debug
- Natural reading order
- Still maintains row/col information
- Can calculate adjacency easily: `Math.abs(row1-row2) + Math.abs(col1-col2) === 1`

### Adjacency Detection

Given two positions, check if they're adjacent:
```javascript
function areAdjacent(pos1, pos2) {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);

  // Adjacent if exactly one step away (not diagonal)
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}
```

### Finding Matching Pairs

Since we store the same object reference for matching pairs:
```javascript
// In selectImagesForDifficulty():
for (const tileData of selectedImages) {
  tiles.push(tileData);
  tiles.push(tileData);  // Same object reference!
}
```

We can check for matches by comparing positions that have identical tile data objects.

### Witch List Benefits

The witch list serves multiple purposes:
1. **Educational:** Players learn who the witches are
2. **Hint system:** Hover to see descriptions
3. **Progress tracking:** Can check off mentally which ones found
4. **Accessibility:** Names visible for screen readers

## Development Philosophy

Following John's preferences:
- **Simple, incremental approach:** Build one feature at a time
- **Easy to understand:** Clear code over clever optimizations
- **Well-documented:** Explain "why" not just "what"
- **Functional patterns:** Prefer pure functions where possible
- **Wait for approval:** Don't implement major features without discussion

## Git Commit Information

**Version:** v0.05
**Commit Message Suggestion:**
```
v0.05 - Simplified positions & implemented basic selection

- Replace ring-based positions with simple left→right, top→bottom arrays
- Implement basic image selection algorithm with group support
- Create matching pairs, add bombs and bonus tiles
- Preserve full metadata (name_text, description_text) on tiles
- Add witch list UI to the right of grid
- Display witch names with hover tooltip for descriptions
- Helper functions: shuffleArray, getRandomFromArray
- Clear witch list when grid changes

Files changed:
- js/whosThatWitch.js (major: selection system implemented)
- index.html (added witch-list div)
- css/style.css (witch list styling with tooltips)
- claude-john-docs/specifications.md (updated)
- claude-john-docs/Claude-ToBeContinued-2025-1015-2000.md (this file)
```

---

**Next Session Start:**
1. Read this file to understand current baseline
2. Discuss adjacency constraint approach
3. Implement adjacency checking (with configurable limits per difficulty)
4. Consider description_text formatting improvements
5. Begin implementing clickable tiles

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1015-2000.md (this file)
- specifications.md (for design context)
- js/whosThatWitch.js (review current implementation)
