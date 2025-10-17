# Who's That Witch? - Session Notes
**Date:** October 16, 2025 - 15:30
**Session:** Game Mechanics - Phase 1 & 2 Implementation
**Version:** v0.08

## Current State

The "Who's That Witch?" game now has **clickable, interactive tiles** with reveal animations, matching logic, and special tile handling. Phase 1 (Click & Reveal) and Phase 2 (Two-Tile Matching) are fully implemented and functional.

### What Was Done This Session

#### 1. **Folder Rename: `tileBack` → `other`**
   - Renamed `assets/tileBack/` to `assets/other/`
   - Updated all code references in `js/whosThatWitch.js` (3 button image paths)
   - Updated documentation references
   - **Note:** `tileBackColor` in JSON is a CSS property, not folder reference (unchanged)

#### 2. **Face-Down Tile Overlay System**
   - **Architecture Decision:** Store back image path at game level (not per-tile)
     - All tiles in a difficulty use same back image
     - Path calculated in `drawGrid()`: `assets/other/_back_wBroom_${tileSize}.png`
     - Avoids redundancy, cleaner separation of concerns

   - **Two-Layer DOM Structure:** Each tile has:
     - Container div (`.tile-container`) at grid position
     - Face-up image (`.tile-face-up`, z-index: 1) - the witch/character
     - Face-down image (`.tile-face-down`, z-index: 2, initially opacity: 1) - the back

   - **State Tracking:** Data attributes on container:
     - `data-square-num`: Position index
     - `data-type`: "gameTile", "bomb", or "bonus"
     - `data-is-face-up`: "false" initially
     - `data-is-matched`: "false" initially
     - `data-pair-id`: For matching pairs (gameTiles only)
     - `data-name-text`, `data-description-text`: Character info

#### 3. **Phase 1: Click & Reveal** (js/whosThatWitch.js:768-837)

   **Game State Variables:**
   ```javascript
   let selectedTiles = [];  // Currently selected tiles (max 2)
   let gameState = 'WAITING_FOR_FIRST_TILE';  // Track game flow
   ```

   **Click Handler:**
   - `handleTileClick(tileContainer)` - Validates clicks, calls `revealTile()`
   - Blocks clicks on face-up tiles, matched tiles, or during match checking
   - Detects special tiles (bomb/bonus) and handles immediately

   **Reveal Function:**
   - `revealTile(tileContainer)` - Animates face-down image to opacity 0
   - Updates `data-is-face-up = "true"`
   - Adds golden glow highlight (`.tile-selected` class)
   - Adds to `selectedTiles` array

   **CSS Highlight:**
   ```css
   .tile-selected {
     box-shadow: 0 0 15px 5px gold, 0 0 25px 8px rgba(255, 215, 0, 0.6);
     border-radius: 4px;
     z-index: 10;
   }
   ```

#### 4. **Phase 2: Two-Tile Matching** (js/whosThatWitch.js:872-914)

   **Match Checking:**
   - After 2nd tile revealed, waits 0.5s then calls `checkForMatch()`
   - Compares `data-pair-id` of both selected tiles
   - **If match:** Tiles stay revealed, state → `WAITING_FOR_WITCH_SELECTION` (ready for Phase 3)
   - **If no match:** Waits 1 second, calls `hideNonMatchingTiles()`

   **Hide Non-Matching Tiles:**
   - Animates face-down images back to opacity 1 (smooth 0.3s CSS transition)
   - Updates `data-is-face-up = "false"`
   - Removes golden glow
   - Clears `selectedTiles` array
   - Resets state to `WAITING_FOR_FIRST_TILE`

   **Game State Flow:**
   - `WAITING_FOR_FIRST_TILE` → Click tile 1 →
   - `WAITING_FOR_SECOND_TILE` → Click tile 2 →
   - `CHECKING_MATCH` (blocks other clicks) →
     - Match: `WAITING_FOR_WITCH_SELECTION` (Phase 3)
     - No match: back to `WAITING_FOR_FIRST_TILE`

#### 5. **Phase 2 Revision: Special Tile Handling** (js/whosThatWitch.js:843-874)

   **Design Decision:** Bombs and bonus tiles don't wait for matching
   - When clicked, special tiles are revealed with glow
   - After 1 second delay, `handleSpecialTile()` is called
   - Tile stays face-up but becomes muted (not hidden)
   - Marked as matched (can't be clicked again)

   **Muting System with CSS Variable:**
   - CSS variable defined: `--tile-muted-opacity: 0.5` (css/style.css:10)
   - JavaScript reads the variable via `getComputedStyle()`
   - Sets face-down image opacity to match CSS value
   - **Single source of truth:** Change opacity in CSS only!

   **CSS Variable System:**
   ```css
   :root {
     --tile-muted-opacity: 0.5;  /* CHANGE VALUE HERE */
   }

   .tile-muted .tile-face-down {
     opacity: var(--tile-muted-opacity);
   }
   ```

   ```javascript
   // JavaScript reads the CSS variable
   const mutedOpacity = getComputedStyle(document.documentElement)
     .getPropertyValue('--tile-muted-opacity').trim();
   faceDownImg.style.opacity = mutedOpacity;
   ```

   **Benefits:**
   - Only change opacity in one place (CSS file)
   - JavaScript automatically uses current CSS value
   - Consistent muting across CSS classes and inline styles

#### 6. **CSS Documentation Comment**
   - Added clear comment above `.tile-muted` class explaining where to change opacity
   - Prevents confusion about CSS variable usage
   - Directs users to `:root` selector at top of file

### Current Project Files

```
whosThatWitch/
├── index.html                              # Game HTML structure
├── css/
│   └── style.css                           # UPDATED: CSS variable for muted opacity, documentation comment
├── js/
│   └── whosThatWitch.js                    # UPDATED: Phase 1 & 2 game mechanics, special tile handling
├── assets/
│   ├── witches/                            # 106 original images
│   ├── 99sized/                            # 106 + 1 bomb + 1 bonus (99×99 images)
│   ├── 124sized/                           # 106 + 1 bomb + 1 bonus (124×124 images)
│   ├── 166sized/                           # 106 + 1 bomb + 1 bonus (166×166 images)
│   └── other/                              # RENAMED from tileBack: Button and back images
│       ├── _easyButton_80x30.png
│       ├── _mediumButton_80x30.png
│       ├── _hardButton_80x30.png
│       ├── _back_wBroom_99.png
│       ├── _back_wBroom_124.png
│       └── _back_wBroom_166.png
├── json/
│   ├── gameConfig.json                     # Game configuration
│   ├── tileSizes.json                      # Grid configurations
│   └── witches.json                        # Character database with numeric groups
├── python/
│   ├── resize_witch_images.py              # Image resizing utility
│   └── verify_images.py                    # Image verification script
├── validate_all.py                         # Comprehensive validation
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Original specifications
│   ├── specifications.md                   # NEEDS UPDATE: Now v0.08
│   ├── specifications-technical.md         # Technical specifications
│   ├── Claude-ToBeContinued-2025-1015-2000.md  # DELETE (keep only 3 most recent)
│   ├── Claude-ToBeContinued-2025-1016-0930.md
│   ├── Claude-ToBeContinued-2025-1016-1600.md
│   └── Claude-ToBeContinued-2025-1016-1530.md  # This file (NEW)
```

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons work (custom 80×30px images)
- ✅ Grid lines draw correctly
- ✅ Random character selection from groups with pairId tracking
- ✅ Matching pairs created correctly
- ✅ Bomb and bonus tiles use dedicated images
- ✅ Special tiles never adjacent to each other (including diagonals)
- ✅ GameTile pairs avoid adjacency (up to 100 retry attempts)
- ✅ Fallback placement works correctly after 100 attempts
- ✅ Character list displays with individual +10 points
- ✅ Integrated scoring summary (Clicks, Total Score) - mockup values
- ✅ Hover tooltips show descriptions
- ✅ Config files load correctly
- ✅ All metadata preserved on tiles
- ✅ Code constants are single source of truth for positions
- ✅ Title and subtitle display properly
- ✅ Status box layout and spacing correct
- ✅ **NEW: Tiles are clickable and reveal on click**
- ✅ **NEW: Golden glow highlight on selected tiles**
- ✅ **NEW: Face-down tiles flip to face-up with smooth animation**
- ✅ **NEW: Two-tile matching logic works correctly**
- ✅ **NEW: Matching pairs stay revealed**
- ✅ **NEW: Non-matching pairs flip back after delay**
- ✅ **NEW: Special tiles (bomb/bonus) handle immediately**
- ✅ **NEW: Special tiles stay visible but muted after click**
- ✅ **NEW: Game state prevents invalid clicks**
- ✅ **NEW: CSS variable system for muted opacity**

**What Needs Work:**
- ❌ Character identification UI not implemented (Phase 3)
- ❌ Witch name clicking not implemented
- ❌ Match validation with character name not implemented
- ❌ Scoring system not functional (showing mockup values)
- ❌ Click counter not tracking
- ❌ Completed pairs not marked visually (need permanent muting)
- ❌ Game win/completion detection not implemented
- ❌ Victory screen not implemented
- ❌ Bomb tile scoring/penalties not implemented
- ❌ Bonus tile rewards not implemented

## Next Steps

### Immediate Priority: Phase 3 - Witch Name Selection

**Goal:** After two tiles match, player clicks character name to identify witch.

**User Flow:**
1. Player clicks 2 matching tiles → both stay revealed with golden glow
2. Game state = `WAITING_FOR_WITCH_SELECTION`
3. Character names in list become clickable (add click handlers)
4. Player clicks a character name
5. Validate: Does clicked name match tiles' `data-name-text`?
   - **Correct:** Celebration effect → mark as completed (Phase 4)
   - **Wrong:** Whoosh effect → tiles flip back → reset

**Implementation Tasks:**
1. Make character names clickable
   - Add click event listeners to `.character-name` elements
   - Only enable when `gameState === 'WAITING_FOR_WITCH_SELECTION'`
2. Create `handleCharacterSelection(characterName)` function
3. Compare selected name with `selectedTiles[0].dataset.nameText`
4. Handle correct vs incorrect selection
5. Visual feedback (highlight clicked name temporarily)

### Medium-Term: Phase 4 - Mark as Completed

**Goal:** Successfully identified pairs stay visible but muted, can't be clicked again.

**Tasks:**
1. Create `markPairAsCompleted()` function
2. Apply `.tile-muted` class to both matched tiles
3. Update character in list:
   - Change color/style to show "identified"
   - Keep points visible (+10)
   - Keep hoverable for description
4. Update actual scores (not mockup)
5. Check if game is complete (all pairs found)

### Long-Term Tasks

**Phase 5: Scoring System Implementation**
- Track click count for each attempt
- Calculate penalty (-1 per click?)
- Update Clicks display in real-time
- Calculate and display TOTAL SCORE
- Character points: +10 per correct identification

**Phase 6: Game Completion**
- Detect when all gameTile pairs are matched and identified
- Victory screen or message
- Display final score
- Option to play again or change difficulty

**Phase 7: Special Tile Functionality**
- Bomb: Define penalty (score deduction? extra click penalty?)
- Bonus: Define reward (extra points? reduce click count?)
- Integrate with scoring system

**Phase 8: Polish & Enhancements**
- Add "whoosh" sound effect for non-matches
- Add "sparkles" celebration for correct matches
- Smooth celebration animations
- Particle effects (optional)
- Timer mode (optional)
- High score tracking (optional)

## Technical Notes

### Game State Machine

**States:**
- `WAITING_FOR_FIRST_TILE` - No tiles selected
- `WAITING_FOR_SECOND_TILE` - One tile selected
- `CHECKING_MATCH` - Blocks clicks while checking/animating
- `WAITING_FOR_WITCH_SELECTION` - Two matching tiles, waiting for character click

**State Transitions:**
```
WAITING_FOR_FIRST_TILE
  → click gameTile → WAITING_FOR_SECOND_TILE
  → click bomb/bonus → CHECKING_MATCH → WAITING_FOR_FIRST_TILE

WAITING_FOR_SECOND_TILE
  → click gameTile → CHECKING_MATCH
    → match → WAITING_FOR_WITCH_SELECTION
    → no match → WAITING_FOR_FIRST_TILE

WAITING_FOR_WITCH_SELECTION (Phase 3)
  → click character name
    → correct → mark completed → WAITING_FOR_FIRST_TILE
    → wrong → WAITING_FOR_FIRST_TILE
```

### CSS Variables Pattern

**Advantage:** Single source of truth for configurable values
```css
:root {
  --tile-muted-opacity: 0.5;
  /* Add more variables as needed */
}
```

**JavaScript Access:**
```javascript
const value = getComputedStyle(document.documentElement)
  .getPropertyValue('--variable-name').trim();
```

**Use Cases:**
- Muted tile opacity
- Animation durations
- Color themes
- Spacing values

### Inline Styles vs CSS Classes

**Problem:** Inline styles have higher specificity than CSS classes
**Solution:** When CSS class should change an inline-styled property, reset the inline style to match CSS

**Example:**
```javascript
// Step 1: Inline style set by revealTile()
faceDownImg.style.opacity = '0';  // Inline style

// Step 2: Adding CSS class alone won't work (inline wins)
tileContainer.classList.add('tile-muted');  // Has opacity: 0.5 but gets overridden!

// Step 3: Must also set inline style to match CSS
faceDownImg.style.opacity = mutedOpacity;  // Now works!
```

### Architecture: Two-Layer Tile System

**Why two images per tile?**
- Both images pre-loaded (no lag when flipping)
- Smooth CSS transitions for opacity
- Face-up image always there underneath
- Clean separation: face-down is just an overlay
- Easy to animate: just change opacity of top layer

**Alternative considered:** Swap `img.src` attribute
- ❌ Causes loading delay
- ❌ No smooth transition
- ❌ More complex state management

## Development Philosophy

Following John's preferences:
- **Simple, incremental approach:** Implemented Phase 1 & 2, then tested before Phase 3
- **Easy to understand:** Clear variable names, documented state machine
- **Well-documented:** Explained "why" for architecture decisions
- **Functional patterns:** Pure functions where possible
- **Wait for approval:** Presented plan before implementing
- **Accept good enough:** Muting system works, polish can come later

## Git Commit Information

**Version:** v0.08
**Commit Message Suggestion:**
```
v0.08 - Game mechanics Phase 1 & 2: Click, reveal, and matching

Phase 1: Click & Reveal
- Add game state variables (selectedTiles, gameState)
- Implement handleTileClick() with validation
- Implement revealTile() with golden glow highlight
- Add .tile-selected CSS class with box-shadow
- Tiles now clickable and reveal with animation

Phase 2: Two-Tile Matching
- Implement checkForMatch() comparing pairIds
- Implement hideNonMatchingTiles() with flip-back animation
- Game state machine (WAITING_FIRST → WAITING_SECOND → CHECKING_MATCH)
- Matching pairs stay revealed, non-matches flip back after delay

Phase 2 Revision: Special Tile Handling
- Bombs and bonus tiles handled immediately (no matching needed)
- Special tiles stay visible but muted after click
- Implement handleSpecialTile() function
- CSS variable system for muted opacity (single source of truth)
- JavaScript reads --tile-muted-opacity from CSS

Other Updates:
- Rename assets/tileBack/ to assets/other/
- Update all code and documentation references
- Add CSS documentation comment for opacity changes
- Reset game state when drawing new grid

Files changed:
- js/whosThatWitch.js (game mechanics, state machine, special tiles)
- css/style.css (CSS variables, .tile-selected, .tile-muted, documentation)
- claude-john-docs/Claude-ToBeContinued-2025-1016-1530.md (this file)
```

---

**Next Session Start:**
1. Read this file to understand Phase 1 & 2 implementation
2. Implement Phase 3: Witch name selection from list
3. Validate character identification
4. Phase 4: Mark completed pairs as muted and non-clickable
5. Begin real scoring system implementation

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1016-1530.md (this file)
- specifications.md (should be updated to v0.08)
- js/whosThatWitch.js (review game state machine)
