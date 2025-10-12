# Who's That Witch? - Specifications

## Project Overview

**Project Name:** Who's That Witch? (Note: Name corrected from earlier "Where's That Witch?")
**Project Type:** Halloween-themed matching/memory tile game
**Location:** `/games/whosThatWitch/`
**Status:** Layout Design & Testing Phase
**Date Started:** October 11, 2025
**Last Updated:** October 11, 2025 - 19:00+

## Project Concept

A matching tile game where players:
1. Turn over tiles to reveal witch character images
2. Match two or more tiles together
3. Identify which witch character is shown
4. Score points based on matches and correct identification

**The Twist:** Not only must players match the images, but they must also correctly identify the witch character to complete the round and earn full points.

## Asset Inventory

### Witch Character Images
- **Total Characters:** 76 unique witch characters
- **Source Material:** Movies, TV shows, books, anime, and cartoons
- **Image Formats:** PNG with transparency (RGBA)
- **Available Sizes:**
  - Original: Various sizes (approximately square, stored in `assets/witches/`)
  - Small: 70x70 pixels (stored in `assets/70sized/`) **← Currently using this size**
  - Small-Medium: 132x132 pixels (stored in `assets/132sized/`)
  - Medium: 176x176 pixels (stored in `assets/176sized/`)

### Character Roster
Characters include iconic witches such as:
- Elphaba & Glinda (Wicked, Wizard of Oz, Broadway)
- Endora, Samantha, Tabitha (Bewitched)
- Hermione, Professor McGonagall (Harry Potter)
- Sabrina & Salem (Sabrina the Teenage Witch)
- Wednesday, Morticia, Grandmama (The Addams Family)
- Willow (Buffy the Vampire Slayer)
- Kiki (Kiki's Delivery Service)
- Yababa (Spirited Away)
- Melisandre (Game of Thrones)
- And many more...

## Design Decisions

### Visual Design

#### Layout Dimensions
- **Game Container:** 950×714 pixels (exact, fixed)
  - **Rationale:** Designed to fit within parent Halloween minigames project center panel (950×720 usable space minus 6px borders)
  - **Border/Padding:** None on container - completely invisible wrapper
  - **Background:** Dark brown gradient (#2a1f1a) for Halloween theme

- **Board Container:** 540×540 pixels (square playing area)
  - **Position:** 370px from left (40px from right), 134px from top (40px from bottom)
  - **Rationale:** Positioned in lower-right to leave room for scattered tiles on left and around board
  - **Border:** 3px solid orange (#ff6600)
  - **Background:** Darker brown (#3d2817)
  - **Purpose:** Main playing field where matched tiles will be placed (TBD)
  - **Status:** Dimensions and position under review - may need adjustment for gameplay

#### Tile Dimensions
- **Current Size:** 70×70 pixels
- **Rationale:** Testing phase - verifying visibility and gameplay feel
- **Question:** Is 70×70 optimal? Could adjust to 80×80 or other size
- **Count:** 16 tiles currently
- **Design Goal:** Will resemble ivory dominos when face-down

#### Tile Positioning System
- **Layout:** Tiles scattered around the left side and below the board
- **X Range:** 10-330px (left of board)
- **Y Range:** 140-644px (below board top, no tiles above imaginary top line of board)
- **Rotation:** -45° to +45° (subtle tilts for organic, playful appearance)
- **Rationale:** Creates visually interesting, non-grid layout that feels natural and engaging
- **Method:** Positions saved to JSON file (squarePositions/squarePositions01.json) for consistency

#### Color Palette
- **Background Gradients:** Dark browns (#1a1410, #261a10, #2a1f1a, #3d2817)
- **Primary Orange:** #ff6600 (board border, button accent)
- **Secondary Orange:** #ff8c42 (hover states, lighter accent)
- **Purpose:** Halloween theme, warm and inviting while maintaining readability

### Game Mechanics (Planned)

#### Tile Interaction (Design in Progress)
1. **Initial State:** Tiles scattered around board, face-down showing domino back design
2. **Reveal Method:** Player clicks tile to flip it face-up OR drags it to board
   - **Decision needed:** Which interaction feels better?
3. **Matching:** Player finds and matches identical or related witch tiles
   - **Decision needed:** Match 2 or match 3 tiles?
4. **Identification:** After match, player must identify which witch character
5. **Scoring:** Points for matches + bonus for correct identification

#### Matching Rules (To Be Determined)
- Match identical witch images?
- Match different images of same witch character?
- Match witches from same franchise?
- Exact mechanic still being designed

### User Interface

#### Current Development Tools
- **Position Editor Mode:** Drag-and-drop editor for tile placement
  - **Purpose:** Manually position tiles for optimal visual layout
  - **Save Button:** Exports positions to JSON file
  - **Status:** Active during development, will be removed for production

#### Planned UI Elements (Not Yet Implemented)
- Score display
- Witch identification input
- Instructions panel
- Reset/new game button
- Match counter
- Timer (if timed mode)

## Rationale

### Why This Game Size?
The 950×714 dimension was chosen because this game is designed to be integrated into the parent Halloween minigames collection. The parent project has a center panel of 950×720 pixels (accounting for borders), and this game fits perfectly within that space.

### Why Board in Lower-Right?
Positioning the board in the lower-right (rather than centered) creates visual asymmetry and leaves ample space for tile scattering. This design choice makes the layout more dynamic and interesting than a centered, symmetrical design.

### Why 70×70 Tiles?
This size is currently under testing. Rationale:
- **Visibility:** Large enough to recognize witch characters clearly
- **Count:** 16 tiles at 70×70 fit comfortably in the available space
- **Alternative consideration:** Could try 80×80 or other sizes if needed
- **Question for review:** Does this size feel right for gameplay?

### Why Scatter Layout vs Grid?
The scattered, rotated tile layout creates a more organic, playful feel that matches the Halloween theme. It feels less rigid and more like scattered dominos on a table - more inviting than a strict grid. The random rotations (-45° to +45°) add to the casual, tactile feeling.

### Why Save Positions?
Rather than purely random positioning on each load (which could create overlaps or awkward spacing), we manually position tiles once using the drag-and-drop editor, then save those positions. This ensures:
- Consistent visual layout across sessions
- No overlapping tiles
- Optimal spacing and aesthetics
- Fine-tuned placement that looks intentional

## Current Testing Questions

1. **Board Size:** Is 540×540 the correct size for the playing field?
2. **Board Position:** Is 40px from right/bottom optimal, or should it be adjusted?
3. **Tile Size:** Is 70×70 the right size, or should we try a different dimension?
4. **Tile Count:** Should there be 16 tiles, or more/fewer?
5. **Tile Design:** What should the back of tiles look like? (Ivory domino appearance planned)
6. **Interaction:** Should players click to flip OR drag tiles to board OR both?
