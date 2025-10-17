# Who's That Witch? - Session Notes
**Date:** October 16, 2025 - 16:00
**Session:** UI Polish & Scoring Display
**Version:** v0.07

## Current State

The "Who's That Witch?" game now has a complete, polished UI with title, subtitle, character list, integrated scoring mockup, and custom difficulty buttons. The game displays tiles, character list, and scoring in a cohesive Halloween-themed interface.

### What Was Done This Session

1. **Renamed "Witch" Terminology to "Character"**
   - Updated HTML: `witch-list` → `character-list`
   - Updated CSS: All `.witch-*` classes → `.character-*` classes
   - Updated JavaScript: `updateWitchList()` → `updateCharacterList()`
   - More generic terminology for potential future themes
   - Completed naming consistency across all three files (HTML, CSS, JS)

2. **Added STATUS Box Container**
   - Created `#status-box` container to right of grid
   - Position: left: 570px, bottom: 10px
   - Size: 350px × 542px
   - Black background with 2px gray border (#999)
   - Contains character-list as child element
   - Aligned top and bottom with grid board

3. **Moved Difficulty Buttons**
   - Relocated from top center to bottom of status box
   - Position: bottom: 20px, centered within status box
   - Changed from "test-buttons" to "difficulty-buttons" (better naming)
   - Reordered in gameConfig.json: EASY, MEDIUM, HARD (left to right)

4. **Replaced Text Buttons with Image Buttons**
   - Created custom button images at 80×30 pixels:
     - `_easyButton_80x30.png`
     - `_mediumButton_80x30.png`
     - `_hardButton_80x30.png`
   - JavaScript creates `<img>` elements instead of `<button>` elements
   - Hover effect: opacity drops to 0.8
   - Cleaner, more professional look

5. **Added Game Title**
   - "Who's That Witch?" in Creepster font (spooky horror font from Google Fonts)
   - Size: 62px, bright orange (#ff8c42)
   - Purple glow effect via text-shadow (0 0 20px and 0 0 40px #7b2d8e)
   - Letter-spacing: 0.12em for horizontal stretch
   - Positioned at top: 25px, centered
   - Single line (white-space: nowrap)

6. **Added Game Subtitle**
   - Text: "First match the witch images, and then identify **Who's That Witch?** Don't get burned!"
   - Position: top: 110px, centered
   - Font: Arial 20px, orange (#ff8c42)
   - Provides clear game instructions

7. **Added Character Points Display**
   - Each character in list shows "+10" in yellow (#ffff00) on right side
   - Character names left-aligned, points right-aligned
   - Used flexbox: `.character-item` with `justify-content: space-between`
   - Same font/size as character list for consistency

8. **Integrated Scoring Summary into Character List**
   - Used "virtual entries" approach for perfect alignment
   - Added after real characters:
     1. Spacer (2px height)
     2. Separator line (1px solid #999)
     3. Clicks row: "Clicks:" label (right-aligned) | "-13" value (yellow)
     4. Separator line
     5. Total Score row: "TOTAL SCORE:" label | "+87" value (bold, 20px)
   - All scoring uses same flexbox layout as character items
   - Perfect alignment without separate CSS section

### Current Project Files

```
whosThatWitch/
├── index.html                              # UPDATED: Title, subtitle, status-box structure
├── css/
│   └── style.css                           # UPDATED: Title/subtitle, character→naming, scoring
├── js/
│   └── whosThatWitch.js                    # UPDATED: Character naming, virtual scoring entries
├── assets/
│   ├── witches/                            # 106 original images
│   ├── 99sized/                            # 106 + 1 bomb + 1 bonus (99×99 images)
│   ├── 124sized/                           # 106 + 1 bomb + 1 bonus (124×124 images)
│   ├── 166sized/                           # 106 + 1 bomb + 1 bonus (166×166 images)
│   └── other/                              # NEW: Button images and tile back images
│       ├── _easyButton_80x30.png
│       ├── _mediumButton_80x30.png
│       ├── _hardButton_80x30.png
│       ├── _back_wBroom_99.png
│       ├── _back_wBroom_124.png
│       └── _back_wBroom_166.png
├── json/
│   ├── gameConfig.json                     # UPDATED: Difficulty order (EASY, MEDIUM, HARD)
│   ├── tileSizes.json                      # Grid configurations
│   └── witches.json                        # Numeric groups (1-25)
├── python/
│   ├── resize_witch_images.py              # Image resizing utility
│   └── verify_images.py                    # Image verification script
├── validate_all.py                         # Comprehensive validation
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Original specifications
│   ├── specifications.md                   # UPDATED: v0.07 UI documentation
│   ├── specifications-technical.md         # Technical specifications
│   ├── Claude-ToBeContinued-2025-1015-2000.md
│   ├── Claude-ToBeContinued-2025-1016-0930.md
│   └── Claude-ToBeContinued-2025-1016-1600.md  # This file
```

### UI Layout Summary

**Screen (950×714px):**
- Top (15-110px): Title and subtitle
- Bottom-left (532×532px): Game board with tiles
- Bottom-right (350×542px): Status box containing:
  - Character list with points
  - Scoring summary (integrated)
  - Difficulty buttons (80×30px each)

**Visual Hierarchy:**
1. Title (spooky Creepster font, glowing orange/purple)
2. Subtitle (clear instructions)
3. Game board (tiles with images)
4. Character list (who's in the game)
5. Scoring (current game stats)
6. Buttons (switch difficulty)

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons work (custom images)
- ✅ Grid lines draw correctly
- ✅ Random character selection from groups with pairId tracking
- ✅ Matching pairs created correctly
- ✅ Bomb and bonus tiles use dedicated images
- ✅ Special tiles never adjacent to each other (including diagonals)
- ✅ GameTile pairs avoid adjacency (up to 100 retry attempts)
- ✅ Fallback placement works correctly after 100 attempts
- ✅ Character list displays with individual +10 points
- ✅ Integrated scoring summary (Clicks, Total Score)
- ✅ Hover tooltips show descriptions
- ✅ Config files load correctly
- ✅ All metadata preserved on tiles
- ✅ Code constants are single source of truth for positions
- ✅ Title and subtitle display properly
- ✅ Status box layout and spacing correct

**What Needs Work:**
- ❌ Tiles face-up initially (need face-down state)
- ❌ Tiles not clickable yet
- ❌ Tile flip interaction not implemented
- ❌ Face-down tile back design exists but not integrated
- ❌ Match detection not implemented
- ❌ Bomb tile click handling not implemented
- ❌ Bonus tile functionality not implemented
- ❌ Character identification UI not implemented
- ❌ Scoring system not implemented (currently showing mockup values)
- ❌ Game win/completion detection not implemented

## Next Steps

### Immediate Priority: Tile Flip & Three-Click Game Mechanic

**Goal:** Implement core gameplay loop

**Three-Click Workflow:**
1. **Click 1:** Player clicks a face-down tile → flips to face-up, reveals image
2. **Click 2:** Player clicks another face-down tile → flips to face-up, reveals image
3. **Click 3:** Player clicks character name in list → identifies the character

**After Third Click:**
- If tiles match AND name is correct:
  - Mark tiles as "completed" (keep face-up, maybe add visual indicator)
  - Mark character in list as "completed" (change color? strikethrough?)
  - Update character's "+10" to show it was earned
  - Update Clicks counter (penalty for number of attempts)
  - Update TOTAL SCORE
  - Allow player to continue with remaining tiles
- If tiles DON'T match OR name is wrong:
  - Flip both tiles back to face-down
  - No points earned
  - Increment Clicks counter
  - Allow player to try again

**Tasks:**
1. Create face-down tile state system
2. Add click event listeners to tiles
3. Implement flip animation/transition
4. Track game state (firstTile, secondTile, selectedCharacter)
5. Add click event listeners to character names
6. Implement match validation logic
7. Implement character identification validation
8. Visual feedback for completed matches
9. Score calculation and updates
10. Click counter tracking

### Medium-Term Tasks

**2. Design Face-Down Tile Appearance**
- Tile back images already created (`_back_wBroom_99/124/166.png`)
- Integrate into tile rendering
- Initially show face-down, flip to face-up on click

**3. Implement Match Detection**
- Compare `pairId` values for both selected tiles
- Handle match success (keep face-up, mark complete)
- Handle match failure (flip both back face-down)

**4. Implement Character Identification**
- Character names in list become clickable
- Validate selected name matches the revealed tiles
- Bonus points for correct identification
- Visual feedback for correct/incorrect

**5. Scoring System Implementation**
- Character points: +10 per correct identification
- Clicks penalty: -1 per click attempt
- Update scoring display in real-time
- Calculate and display TOTAL SCORE

### Long-Term Tasks

**Bomb & Bonus Tile Functionality:**
- Bomb: Penalty (points deduction? extra clicks penalty?)
- Bonus: Reward (extra points? reduce click penalty?)

**Game Completion:**
- Detect when all pairs matched and identified
- Victory screen
- Display final score
- Reset/new game button

**Polish & Enhancements:**
- Animations for tile flip
- Sound effects (optional)
- Particle effects for matches (optional)
- Timer mode (optional)
- High score tracking (optional)

## Technical Notes

### Virtual Entries Approach for Scoring

**Why This Works Well:**
- Uses existing `.character-item` flexbox layout
- Perfect alignment between character names/points and scoring labels/values
- No separate CSS section needed
- All spacing and sizing consistent
- Easy to update scoring values dynamically

**Structure:**
```javascript
// Real characters
characterItem: [characterName] [+10]

// Spacer (2px)
characterSpacer

// Separator line
characterSeparator

// Scoring entry
characterItem: [Clicks:] [-13]

// Separator line
characterSeparator

// Total entry (bold, larger)
characterItem.score-total-row: [TOTAL SCORE:] [+87]
```

### Face-Down Tile Images Available

Already created and ready to integrate:
- `assets/other/_back_wBroom_99.png` (99×99) for HARD
- `assets/other/_back_wBroom_124.png` (124×124) for MEDIUM
- `assets/other/_back_wBroom_166.png` (166×166) for EASY

### Three-Click State Machine

**Game States:**
1. `WAITING_FIRST_TILE` - No tiles selected, waiting for first click
2. `WAITING_SECOND_TILE` - First tile flipped, waiting for second click
3. `WAITING_CHARACTER_ID` - Two tiles flipped, waiting for character name click
4. `VALIDATING` - Checking if tiles match and character ID is correct
5. Back to `WAITING_FIRST_TILE`

**State Tracking Variables Needed:**
```javascript
let gameState = 'WAITING_FIRST_TILE';
let firstTile = null;        // First clicked tile element
let secondTile = null;       // Second clicked tile element
let selectedCharacter = null; // Character name clicked
let completedPairs = [];     // Array of pairIds already completed
let clickCount = 0;          // Total clicks made
let characterPoints = 0;     // Points from character IDs
```

### Tile Face States

Each tile needs to track:
- `isFaceUp`: boolean
- `isCompleted`: boolean
- `pairId`: number (from tile data)
- `characterName`: string (from tile data)

Can use data attributes or maintain separate state object.

## Development Philosophy

Following John's preferences:
- **Simple, incremental approach:** Build one feature at a time
- **Easy to understand:** Clear code over clever optimizations
- **Well-documented:** Explain "why" not just "what"
- **Functional patterns:** Prefer pure functions where possible
- **Wait for approval:** Don't implement major features without discussion
- **Accept good enough:** Perfect is enemy of done

## Git Commit Information

**Version:** v0.07
**Commit Message Suggestion:**
```
v0.07 - UI polish and scoring display

- Rename all "witch" terminology to "character" throughout codebase
- Add STATUS box container to right of grid
- Move difficulty buttons to bottom of status box
- Replace text buttons with custom 80×30px image buttons
- Add spooky title "Who's That Witch?" in Creepster font with purple glow
- Add subtitle with game instructions
- Add "+10" points display next to each character name
- Integrate scoring summary into character list using virtual entries
  - Clicks counter
  - Total Score display
- Reorder difficulty buttons: EASY, MEDIUM, HARD
- Add 2px spacer between character list and scoring

Files changed:
- index.html (title, subtitle, status-box structure)
- css/style.css (all UI styling, character→ renaming)
- js/whosThatWitch.js (character→ renaming, virtual scoring entries)
- json/gameConfig.json (difficulty order)
- assets/other/ (new button images)
- claude-john-docs/specifications.md (updated)
- claude-john-docs/Claude-ToBeContinued-2025-1016-1600.md (this file)
```

---

**Next Session Start:**
1. Read this file to understand current UI state
2. Discuss three-click game mechanic implementation approach
3. Plan tile flip animation and state management
4. Implement click handlers for tiles and character names
5. Build match validation and scoring logic

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1016-1600.md (this file)
- specifications.md (for updated v0.07 documentation)
- js/whosThatWitch.js (review current implementation)
