# Who's That Witch? - Session Notes
**Date:** October 12, 2025 - 17:30
**Session:** Matching Pairs Implementation with Bomb Tiles
**Version:** v0.02

## Current State

The "Who's That Witch?" game now features a complete matching pairs mechanic with bomb tiles. Players see pairs of witch character images randomly distributed across the grid, with bomb tiles scattered among them. The game dynamically calculates the correct number of pairs based on grid size and bomb tile count.

### What Was Done This Session

1. **Image Processing and Verification**
   - Moved 25 new witch images from `assets/` to `assets/witches/`
   - Updated Python resize script paths (now in `python/` subfolder)
   - Resized all new images to three sizes (99×99, 124×124, 166×166)
   - Created `python/verify_images.py` - comprehensive verification script
   - Verified all 318 image files (106 characters × 3 sizes each)
   - All images confirmed present with correct dimensions

2. **Character Database Updates**
   - Updated `json/witchesImages.json` with 27 new image entries:
     - Added 10 new character groups (Agatha Harkness, Bai Suzhen, Circe, etc.)
     - Added 2 new Glinda(Wicked!) images to Galinda group
   - Database now contains 31 unique characters with 106 total images
   - All entries include filename, name_text, description_text, and size paths

3. **Character-Based Random Selection**
   - Updated `json/gameConfig.json` to point to `witchesImages.json`
   - Rewrote `loadImageList()` to handle character-grouped structure
   - Rewrote `getRandomImages()` to select random characters first, then one image per character
   - Guarantees no duplicate characters in same game

4. **Matching Pairs Mechanic**
   - Added `bombTiles` and `bonusTiles` properties to difficulty configs:
     - EASY: bombTiles: 1, bonusTiles: 1
     - MEDIUM: bombTiles: 2, bonusTiles: 1
     - HARD: bombTiles: 3, bonusTiles: 1
   - Implemented pair calculation logic: `(totalTiles - bombTiles) / 2`
   - Modified `getRandomImages()` to:
     - Calculate unique images needed
     - Select random characters and images
     - Duplicate images to create pairs
     - Add bomb tiles to array
     - Shuffle all tiles randomly
   - Created bomb tile images: `_bombTile_99/124/166.png` in size folders
   - Modified `drawGrid()` to pass difficulty config to image selection

### Current Project Files

```
whosThatWitch/
├── index.html                              # HTML structure with dynamic buttons
├── css/
│   └── style.css                           # Styling with board, screen, buttons
├── js/
│   └── whosThatWitch.js                    # UPDATED: Matching pairs logic
├── assets/
│   ├── witches/                            # 106 original images (31 characters)
│   ├── 99sized/                            # 106 + 1 bomb (99×99 images)
│   ├── 124sized/                           # 106 + 1 bomb (124×124 images)
│   └── 166sized/                           # 106 + 1 bomb (166×166 images)
├── json/
│   ├── gameConfig.json                     # UPDATED: bombTiles/bonusTiles added
│   ├── tileSizes.json                      # Grid configurations
│   ├── witchImages.json                    # LEGACY: Simple array (not used)
│   └── witchesImages.json                  # UPDATED: 31 characters, 106 images
├── python/
│   ├── resize_witch_images.py              # UPDATED: Paths fixed
│   └── verify_images.py                    # NEW: Image verification script
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt                 # Original specifications
│   ├── specifications.md                   # Design specifications
│   ├── specifications-technical.md         # Technical specifications
│   ├── Claude-ToBeContinued-2025-1012-1400.md  # Previous session
│   ├── Claude-ToBeContinued-2025-1012-1620.md  # Previous session
│   └── Claude-ToBeContinued-2025-1012-1730.md  # This file
```

### Key Technical Implementations

**Matching Pairs Calculation:**
```javascript
// Formula: (totalTiles - bombTiles) / 2 = unique images needed
const uniqueImagesNeeded = (count - bombTiles) / 2;

// Results:
// EASY:   (9 - 1) / 2 = 4 unique → 8 paired tiles + 1 bomb = 9 total
// MEDIUM: (16 - 2) / 2 = 7 unique → 14 paired tiles + 2 bombs = 16 total
// HARD:   (25 - 3) / 2 = 11 unique → 22 paired tiles + 3 bombs = 25 total
```

**Image Selection Process:**
1. Calculate unique images needed from difficulty config
2. Shuffle all character names
3. Select N random characters
4. Pick one random image from each character's array
5. Duplicate selected images to create pairs
6. Add bomb tiles using `buildImagePath("_bombTile", size)`
7. Shuffle complete array randomly
8. Return shuffled tiles to fill grid

**Configuration-Driven Architecture:**
- All game parameters in JSON files
- Dynamic button creation from config
- Automatic path building from patterns
- No hardcoded values in JavaScript
- Easy theme switching by changing config

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons display and function
- ✅ Grid lines draw correctly for all three sizes
- ✅ Character-based random selection (no duplicate characters)
- ✅ Matching pairs generated correctly
- ✅ Bomb tiles appear in random positions
- ✅ Correct tile count for all difficulties
- ✅ Each button click shows new random selection
- ✅ All images properly sized and positioned
- ✅ Configuration system fully functional

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

**Total:** 31 unique character groups, 106 individual images

**Character List:**
1. Elphaba (9 images) - Wicked, Wizard of Oz
2. Galinda (9 images) - Wicked, Wizard of Oz
3. Endora (3 images) - Bewitched
4. Grandmama (3 images) - The Addams Family
5. Hermione (3 images) - Harry Potter
6. Jadis (3 images) - Chronicles of Narnia
7. Kiki (3 images) - Kiki's Delivery Service
8. Lafayette (3 images) - True Blood
9. Melisandre (3 images) - Game of Thrones
10. Mildred (3 images) - The Worst Witch
11. Morticia (3 images) - The Addams Family
12. McGonagall (3 images) - Harry Potter
13. Sabrina (4 images) - Sabrina the Teenage Witch
14. Salem (3 images) - Sabrina the Teenage Witch
15. Samantha (6 images) - Bewitched
16. Tabitha (3 images) - Bewitched
17. Wednesday (5 images) - The Addams Family
18. Wendy (3 images) - Harvey Comics
19. Willow (3 images) - Buffy the Vampire Slayer
20. WitchHazel (3 images) - Looney Tunes
21. Yubaba (3 images) - Spirited Away
22. Agatha_Harkness (3 images) - Marvel Comics
23. Bai_Suzhen (3 images) - Chinese Legend
24. Circe (3 images) - Homer's Odyssey
25. Dani_and_Dorian (3 images) - Hooky
26. Granny_Weatherwax (2 images) - Discworld
27. Morgan_le_Fay (2 images) - Arthurian Legend
28. Nie_Xiaoqian (2 images) - Strange Stories
29. Shuimu (2 images) - Chinese Folklore
30. The_Weird_Sisters (3 images) - Macbeth
31. Xianniang (2 images) - Mulan

## Next Steps

### Immediate Priority: Tile Flip Mechanic

**Design Decisions Needed:**
1. **Face-Down Appearance:** What should unflipped tiles look like?
   - Solid color with pattern?
   - Halloween-themed back design?
   - Question mark icon?
   - Purple with witch hat silhouette?

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

## Questions/Decisions for Next Session

1. **Tile Back Design:**
   - What should face-down tiles look like?
   - Need asset creation or pure CSS?

2. **Bomb Tile Behavior:**
   - What penalty when clicked?
   - Points loss? Lives? Time?
   - Can they be "matched" or always penalty?

3. **Bonus Tile Behavior:**
   - What reward when clicked?
   - How should they appear (different from regular tiles)?

4. **Game Flow:**
   - Do all tiles start face-down?
   - Or memorization phase with all visible first?
   - Time limit per game?

5. **Witch Identification:**
   - After each match or at end?
   - Required or optional for bonus points?

## Development Notes

**Code Quality:**
- Well-commented functions
- Clear variable names
- Calculation logic documented
- No hardcoded values
- Configuration-driven approach

**Testing Tools:**
- `python/verify_images.py` - Run anytime to verify image integrity
- Browser console logs show selection details
- Easy to test all three difficulties

**Performance:**
- Character database loads once on init
- Efficient random selection (no duplicate loops)
- Minimal DOM manipulation
- Images pre-sized for each difficulty

## Git Commit Information

**Version:** v0.02
**Commit Message Suggestion:**
```
v0.02 - Implement matching pairs with bomb tiles

- Add 27 new witch images (10 new characters)
- Implement character-based random selection
- Add matching pairs mechanic with configurable bomb tiles
- Create image verification script
- Update all documentation

Features:
- 31 unique witch characters, 106 total images
- Matching pairs calculated dynamically per difficulty
- Random bomb tile placement (1/2/3 for easy/medium/hard)
- Character-grouped database prevents duplicates
- Verified all 318 image files

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
- Claude-ToBeContinued-2025-1012-1730.md (this file)
- specifications.md
- js/whosThatWitch.js (review current state)
