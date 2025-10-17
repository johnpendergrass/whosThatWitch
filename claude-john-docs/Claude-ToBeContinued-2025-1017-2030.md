# Who's That Witch? - Session Notes
**Date:** October 17, 2025 - 20:30
**Session:** Phase 3 Complete - Character Selection Implementation
**Version:** v0.10

## Current State

The "Who's That Witch?" game now has fully functional character selection mechanics! Players can match tiles, then click character names to identify witches. The three-click game mechanic is complete with success/error tooltips and smart decoy system.

### What Was Done This Session

#### 1. **Grid Lines Color Change**
   - Changed grid lines from white to black for better contrast
   - Updated `json/tileSizes.json` for all three difficulty levels
   - File: `json/tileSizes.json` (lineColor: "white" → "black")

#### 2. **Scoring System Removal**
   - Removed all scoring displays except basic character list
   - Eliminated +10 points display
   - Removed "Clicks:" and "TOTAL SCORE:" rows
   - Files Modified:
     - `js/whosThatWitch.js` - Removed scoring elements from updateCharacterList()
     - `css/style.css` - Removed .character-points and scoring CSS

#### 3. **Character List Clickable System**
   - **CSS Changes:**
     - Character names now have pointer cursor
     - Hover changes color from orange (#ff8c42) → medium white (#cccccc)
     - Completed characters turn yellow (#ffff00) with help cursor
     - Conditional tooltips only show for completed characters

   - **JavaScript Changes:**
     - Added `data-completed="false"` and `data-character-name` attributes
     - Added click event listeners to each character item
     - Implemented `handleCharacterClick()` validation function
     - Only allows clicks during `WAITING_FOR_WITCH_SELECTION` state

#### 4. **Success/Error Tooltip System**
   - **Success Tooltip (Correct Match):**
     - Green background (#006400) with bright green border (#00ff00)
     - Message: "Yes! I am witch **[name]**!"
     - Character name turns yellow with checkmark: "✓ Elphaba"
     - Tiles stay face-up with golden glow
     - Both tiles marked as permanently matched

   - **Error Tooltip (Incorrect Match):**
     - Dark red background (#8B0000) with red border (#ff0000)
     - Message: "Nope! **[name]** is not my name!"
     - Tiles flip back after tooltip disappears
     - No changes to character list

#### 5. **Smart Tooltip Timing**
   - Tooltips stay visible for **minimum 2 seconds**
   - Tooltips also stay visible **until mouse leaves character name**
   - Tracks hover state with mouseenter/mouseleave listeners
   - `tryRemoveTooltip()` only removes when BOTH conditions met
   - Automatically cleans up event listeners after removal

#### 6. **Decoy Witch System**
   - Adds 2 random witches to character list that are NOT in game
   - Selected from unused witches (17-21 available depending on difficulty)
   - Decoys mixed randomly with real witches (list is shuffled)
   - If player clicks decoy: error tooltip shows, tiles flip back
   - Decoys stay orange forever (can never be completed)
   - Makes game harder - prevents process of elimination

### Current Project Files

```
whosThatWitch/
├── index.html                              # HTML structure
├── css/
│   └── style.css                           # UPDATED: Removed scoring styles, added clickable character styles
├── js/
│   └── whosThatWitch.js                    # UPDATED: Character click system, tooltips, decoys
├── assets/
│   ├── witches/                            # 106+ original images
│   ├── 99sized/                            # 108 images (106 + bomb + bonus)
│   ├── 124sized/                           # 108 images (106 + bomb + bonus)
│   ├── 166sized/                           # 108 images (106 + bomb + bonus)
│   └── other/                              # Button images, tile backs, special tiles
├── json/
│   ├── gameConfig.json                     # Game configuration
│   ├── tileSizes.json                      # UPDATED: Grid lines now black
│   └── witches.json                        # 25 characters with numeric groups (1-25)
├── python/
│   ├── resize_witch_images.py              # Image resizing utility
│   └── verify_images.py                    # Image verification script
├── validate_all.py                         # Comprehensive validation
└── claude-john-docs/
    ├── BEGINNING SPECS.txt                 # Original specifications
    ├── specifications.md                   # UPDATED: v0.10 status
    ├── specifications-technical.md         # Technical specifications
    └── Claude-ToBeContinued-2025-1017-2030.md  # This file
```

## Current Testing Status

**What Works:**
- ✅ Three difficulty levels (Easy 3×3, Medium 4×4, Hard 5×5)
- ✅ Black grid lines between tiles
- ✅ Random character selection from 25 groups
- ✅ Matching pairs with pairId tracking
- ✅ Bomb and bonus tiles with dedicated images
- ✅ Adjacency constraint algorithm (special tiles, matching pairs)
- ✅ Character list displays (no scoring elements)
- ✅ Tile flipping (face-down ↔ face-up)
- ✅ Match detection (compare pairIds)
- ✅ Special tiles (bomb/bonus) handle correctly
- ✅ Game state machine prevents invalid clicks
- ✅ Golden glow on selected tiles
- ✅ **NEW v0.10: Character names clickable (only during WAITING_FOR_WITCH_SELECTION)**
- ✅ **NEW v0.10: Character validation (correct vs incorrect)**
- ✅ **NEW v0.10: Success tooltip (green) with smart timing**
- ✅ **NEW v0.10: Error tooltip (red) with smart timing**
- ✅ **NEW v0.10: Completed characters turn yellow with checkmark**
- ✅ **NEW v0.10: Hover tooltips only for completed witches**
- ✅ **NEW v0.10: Character hover color change (orange → white)**
- ✅ **NEW v0.10: 2 decoy witches added to list**

**What Needs Work:**
- ❌ Completed witch tiles should be visually muted on grid (remove golden glow, mute images)
- ❌ Hovering completed character name should highlight both tiles on grid
- ❌ Strikethrough decoy names when all real witches are found
- ❌ "WHO AM I?" banner at top of character list
- ❌ Click counter (maybe)
- ❌ Game win/completion detection
- ❌ Victory screen
- ❌ Bomb tile effects/penalties not defined
- ❌ Bonus tile effects/rewards not defined

## Next Steps

### Immediate Priority: Polish & Visual Feedback

**1. Visual Muting of Completed Witch Tiles**
   - Remove golden glow from completed tiles
   - Mute/fade the witch images (like special tiles use --tile-muted-opacity)
   - Keep tiles face-up but visually distinct from active tiles

**2. Hover on Completed Character Name → Highlight Tiles**
   - When hovering over completed (yellow) character name
   - Temporarily highlight both matching tiles on grid
   - Perhaps restore golden glow while hovering?
   - Remove highlight when mouse leaves character name

**3. Strikethrough Decoy Names When Game Complete**
   - Detect when all real witches have been identified
   - Apply CSS strikethrough to decoy names
   - Visual indication that these witches weren't in the game

**4. "WHO AM I?" Banner**
   - Add banner/header at top of character list
   - Starts muted/dim
   - Highlights when two matching tiles are selected
   - Returns to muted when witch is identified or tiles flip back

**5. Click Counter (Maybe)**
   - Simple counter at bottom of character list
   - Tracks total tile clicks
   - No scoring, just count
   - Decision: Do we want this?

## Technical Notes

### Character Selection Flow (v0.10)

**Three-Click Workflow:**
1. **Click 1:** Player clicks face-down tile → flips face-up, golden glow
2. **Click 2:** Player clicks another face-down tile → flips face-up, golden glow
3. **Match Check:**
   - If pairIds match → `gameState = 'WAITING_FOR_WITCH_SELECTION'`
   - If no match → tiles flip back after 1 second
4. **Click 3:** Player clicks character name in list
5. **Validation:**
   - Compare clicked name with `selectedTiles[0].dataset.nameText`
   - Show success (green) or error (red) tooltip
   - Tooltip stays 2+ seconds and until mouse leaves

**Tooltip Smart Timing Logic:**
```javascript
let isHovering = true;  // User just clicked
let minTimeElapsed = false;

const tryRemoveTooltip = () => {
  if (minTimeElapsed && !isHovering) {
    tooltip.remove();
    // Clean up listeners
  }
};

// After 2 seconds
setTimeout(() => {
  minTimeElapsed = true;
  tryRemoveTooltip();
}, 2000);

// On mouse leave
const handleMouseLeave = () => {
  isHovering = false;
  tryRemoveTooltip();
};
```

### Decoy Witch Selection Algorithm

```javascript
// After extracting real witches from tiles
const allWitchNames = Object.keys(imageList);  // 25 total
const availableDecoys = allWitchNames.filter(name => !seenNames.has(name));

// Randomly select 2 decoys
for (let i = 0; i < 2; i++) {
  const decoyName = getRandomFromArray(availableDecoys);
  availableDecoys.splice(availableDecoys.indexOf(decoyName), 1);

  // Add decoy with metadata from imageList
  uniqueCharacters.push({
    name_text: imageList[decoyName][0].name_text,
    description_text: imageList[decoyName][0].description_text,
    type: 'decoy'
  });
}

// Shuffle entire list so decoys are mixed in
shuffleArray(uniqueCharacters);
```

### Game State Machine (v0.10)

**States:**
1. `WAITING_FOR_FIRST_TILE` - No tiles selected
2. `WAITING_FOR_SECOND_TILE` - One tile selected
3. `WAITING_FOR_WITCH_SELECTION` - Two matching tiles revealed, waiting for character name click
4. `CHECKING_MATCH` - Validating match, blocks other clicks

**Transitions:**
- `WAITING_FOR_FIRST_TILE` → (click gameTile) → `WAITING_FOR_SECOND_TILE`
- `WAITING_FOR_SECOND_TILE` → (click gameTile) → `CHECKING_MATCH` → checkForMatch()
- In checkForMatch():
  - If match: → `WAITING_FOR_WITCH_SELECTION`
  - If no match: → (after delay) → `WAITING_FOR_FIRST_TILE`
- `WAITING_FOR_WITCH_SELECTION` → (click character) → handleCharacterClick()
  - If correct: → `WAITING_FOR_FIRST_TILE` (tiles stay up, marked complete)
  - If incorrect: → `WAITING_FOR_FIRST_TILE` (tiles flip back)
- Special tiles: Any state → (click bomb/bonus) → `CHECKING_MATCH` → handleSpecialTile() → `WAITING_FOR_FIRST_TILE`

## Development Philosophy

Following John's preferences:
- **Simple, incremental approach:** Build one feature at a time
- **Easy to understand:** Clear code over clever optimizations
- **Well-documented:** Explain "why" not just "what"
- **Functional patterns:** Prefer pure functions where possible
- **Wait for approval:** Don't implement major features without discussion
- **Accept good enough:** Perfect is enemy of done

## Git Commit Information

**Version:** v0.10
**Commit Message Suggestion:**
```
v0.10 - Complete Phase 3: Character Selection Working

Core Features:
- Character names clickable (only during WAITING_FOR_WITCH_SELECTION)
- Character identification validation
- Success/error tooltip system with smart hover-aware timing
- Completed characters turn yellow with checkmark
- Conditional hover tooltips (only show for completed)
- Character hover color effect (orange → white)
- 2 decoy witches added to list for difficulty

Additional Changes:
- Grid lines changed from white to black
- Removed all scoring displays (kept simple character list)

Files changed:
- js/whosThatWitch.js (character click system, tooltips, decoys)
- css/style.css (clickable styles, removed scoring)
- json/tileSizes.json (grid line color)
- claude-john-docs/specifications.md (updated to v0.10)
- claude-john-docs/Claude-ToBeContinued-2025-1017-2030.md (this file)
```

---

**Next Session Start:**
1. Read this file to understand current state
2. Discuss next 5 tasks:
   - Visual muting of completed tiles
   - Hover highlight for completed character names
   - Strikethrough decoys when game complete
   - "WHO AM I?" banner
   - Click counter (decide if wanted)
3. Begin implementation

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1017-2030.md (this file)
- specifications.md (for updated v0.10 documentation)
- js/whosThatWitch.js (review character selection implementation)
