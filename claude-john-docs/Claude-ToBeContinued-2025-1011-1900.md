# Who's That Witch? - Session Notes
**Date:** October 11, 2025 - 19:00
**Session:** Layout Design, Position Editor, and Image Integration

## Current State

The "Who's That Witch?" game has progressed from asset preparation to active layout design and testing. We now have a working position editor that allows manual tile placement with saved positions, and we've integrated actual witch images into the tiles.

### What Was Done This Session

1. **Initial Project Setup** (morning)
   - Created basic HTML structure with game and board containers
   - Established CSS styling with Halloween theme
   - Set up JavaScript initialization and game loading

2. **Layout Design and Positioning** (midday)
   - Sized game container to 950×714 pixels (fits parent Halloween minigames project)
   - Created 540×540 board container with orange border
   - Positioned board 40px from right edge and 40px from bottom
   - Designed scattered tile layout on left side of board

3. **Tile Positioning System** (afternoon)
   - Created 16 test squares (70×70 pixels)
   - Implemented random positioning with -45° to +45° rotation range
   - Built drag-and-drop position editor for manual tile placement
   - Added save function that exports positions to JSON file
   - Implemented position loading from saved JSON file

4. **Image Processing** (late afternoon)
   - Modified Python resize script to add 70×70 pixel size
   - Processed all 76 witch images to new 70×70 size
   - Integrated 16 random witch images into tiles
   - Replaced colored squares with actual witch character images
   - Tiles now show witch images and are draggable for testing

5. **Documentation** (now)
   - Updated specifications.md with current design decisions
   - Updating specifications-technical.md (in progress)
   - Creating this ToBeContinued file

### Current Project Files

```
whosThatWitch/
├── index.html                              # Main HTML structure
├── css/
│   └── style.css                           # Game styling (Halloween theme)
├── js/
│   └── game.js                             # Main game logic with position editor
├── assets/
│   ├── witches/                            # Original images (76 PNGs)
│   ├── 70sized/                            # 70×70 resized images (76 PNGs) ← NEW
│   ├── 132sized/                           # 132×132 resized images (76 PNGs)
│   └── 176sized/                           # 176×176 resized images (76 PNGs)
├── squarePositions/
│   └── squarePositions01.json              # Saved tile positions
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Initial specifications
│   ├── specifications.md                   # Design specs (UPDATED)
│   ├── specifications-technical.md         # Technical specs (updating)
│   └── Claude-ToBeContinued-*.md           # Session notes (3 files)
└── resize_witch_images.py                  # Image processing script (UPDATED)
```

### Key Technical Implementations

#### Drag-and-Drop Position Editor
- Click and hold any tile to drag it
- Position updates in real-time
- Rotation is preserved during dragging
- Constrained to game area boundaries
- Save button exports all 16 positions to JSON
- Positions automatically load from JSON on page refresh

#### Tile Positioning Data Structure
```javascript
// Example of saved position data:
{
  "id": 0,
  "x": 254,
  "y": 322,
  "rotation": 8
}
```

#### Image Integration
- 16 witch images loaded from assets/70sized folder
- Images displayed in 70×70 divs with rotation
- Each tile shows a different witch character
- Current selection includes: Samantha, Elphaba, Glinda, Salem, Kiki, Willow, Jadis, and others

### Current Testing Phase

We are now in the **Layout Verification Phase** where we need to confirm:

1. **Board Dimensions:** Is 540×540 the correct size for gameplay?
2. **Board Position:** Is 40px from right/bottom optimal?
3. **Tile Size:** Is 70×70 the right size for visibility and gameplay?
4. **Tile Design:** Should tiles look like ivory dominos when face-down?
5. **Interaction Method:** Should players:
   - Click to flip tiles?
   - Drag tiles onto the board?
   - Both methods?

### What the Game Looks Like Now

- **Game area:** 950×714 dark brown background
- **Board:** 540×540 square in lower-right with orange border
- **16 Tiles:** Scattered on left side and around board
  - Each shows a different witch character
  - Rotated between -45° and +45°
  - Positioned at saved coordinates
  - Fully draggable for testing/adjustment

## Next Steps

### Immediate ToDo Items

1. **Confirm Layout** ← **NEXT SESSION STARTS HERE**
   - Review board size (540×540) - is this correct?
   - Review board position (40px from edges) - is this optimal?
   - Review tile size (70×70) - is this the right size?
   - Decide if current layout works for gameplay

2. **Design Tile Back**
   - Create ivory domino appearance for face-down tiles
   - Design may include:
     - Cream/ivory color
     - Subtle texture or pattern
     - Small Halloween accent?
     - Beveled edges for 3D effect?

3. **Implement Tile States**
   - Face-down state (domino back)
   - Face-up state (witch image - already implemented)
   - Flip animation between states
   - Matched state (if tiles stay matched)

4. **Add Click/Flip Interaction**
   - Click tile to flip it over
   - Reveal witch image underneath
   - Disable drag during actual gameplay (only for editor mode)

### Medium-Term ToDo Items

5. **Implement Matching Logic**
   - Define matching rules (2 or 3 tiles? identical images? same character?)
   - Detect when tiles are matched
   - Handle matched tiles (remove? move to board? keep in place?)
   - Track number of matches

6. **Add Witch Identification**
   - UI for player to enter witch name after match
   - Character name database/metadata
   - Validation of correct answers
   - Hints or multiple choice options?

7. **Implement Scoring System**
   - Points for matches
   - Bonus for correct witch identification
   - Penalties for wrong guesses?
   - Time bonus if timed mode?

8. **Polish and UI**
   - Add score display
   - Add instructions panel
   - Add reset/new game button
   - Add match counter
   - Consider timer
   - Win/completion screen

### Long-Term ToDo Items

- Multiple difficulty levels (different tile counts, similar witches)
- Sound effects
- Animations and transitions
- High score tracking
- Different witch sets/themes
- Integration with parent Halloween games collection
- Mobile/touch support

## Technical Notes

### Position Editor Mode
The current game.js file is in "position editor mode" - it's a development tool, not the final game. Features:
- Drag-and-drop tile positioning
- Save button to export positions
- Console logging for debugging

**Note:** For production game, this editor mode will be removed or moved to a separate file.

### Image Loading System
Images are loaded via:
1. Array of 16 image paths defined in JavaScript
2. Each tile creates an `<img>` element with source from array
3. Images are 70×70 pixels, matching container size
4. Images have `pointer-events: none` so clicks pass through to parent div

### Rotation System
- Rotations stored as integers (-45 to +45 degrees)
- Applied via CSS `transform: rotate(${rotation}deg)`
- Rotation is preserved during dragging
- Saved to JSON for consistency

## Questions for Next Session

1. **Board Size Confirmation:**
   - Is 540×540 appropriate for the number of tiles we'll have?
   - Should it be larger or smaller?

2. **Tile Size Confirmation:**
   - Are 70×70 tiles the right size?
   - Can players see the witch images clearly enough?
   - Should we try 80×80 or stay with 70×70?

3. **Game Mechanics Decision:**
   - How many tiles should match? 2 or 3?
   - Should tiles match exactly, or can different images of same witch match?
   - Where do matched tiles go? (removed, moved to board, stay in place?)

4. **Interaction Method:**
   - Click to flip and match?
   - Drag tiles to board to match?
   - Combination of both?

5. **Tile Back Design:**
   - Simple ivory color?
   - Pattern or texture?
   - Halloween-themed back?

## Development Approach

Following John's preferences:
- **Incremental development:** Build one feature at a time, test, get approval
- **Simple, understandable code:** Prioritize readability over optimization
- **Well-documented:** Clear comments and logical structure
- **Wait for confirmation:** Don't implement major features without approval

## Resources Available

- 76 unique witch characters
- Images in 4 sizes: original, 70×70, 132×132, 176×176
- Working position editor with save/load
- Drag-and-drop system
- Halloween-themed visual design
- Parent project architecture for reference

---

**Next Session Start:**
1. Read this file
2. Review specifications.md and specifications-technical.md
3. Confirm board size, position, and tile size
4. Discuss tile back design
5. Begin implementing game mechanics

**Files to Read:**
- Claude-ToBeContinued-2025-1011-1900.md (this file)
- specifications.md
- specifications-technical.md
