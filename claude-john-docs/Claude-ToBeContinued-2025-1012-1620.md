# Who's That Witch? - Session Notes
**Date:** October 12, 2025 - 16:20
**Session:** Configuration System and Image Database Implementation

## Current State

The "Who's That Witch?" game has been transformed from a hardcoded prototype into a fully configurable, theme-agnostic system. The game is designed to display random witch images in a grid with three difficulty levels, and can be easily adapted to other themes (baseball players, Pokemon, etc.) by simply swapping configuration and image files.

### What Was Done This Session

1. **Project Reset and Cleanup**
   - Removed all experimental tile positioning code
   - Cleaned HTML, CSS, and JavaScript to baseline
   - Changed main container from "game" to "screen" for clarity
   - Renamed JavaScript file to `whosThatWitch.js`

2. **Board Container Created**
   - Added 502×502 board in lower-left of screen
   - Positioned 35px from left, 35px from bottom
   - Added 15px purple ridge border (picture frame style)
   - Board has purple interior background (#553963)

3. **Screen Styling Updated**
   - Black background for body
   - White 3px border around screen div (inside the 950×714 container)
   - Screen background changed to black

4. **Grid System Implementation**
   - Created `json/tileSizes.json` with three difficulty levels:
     - **hardTiles:** 5×5 grid (25 tiles), 99px tiles, 2px white lines
     - **mediumTiles:** 4×4 grid (16 tiles), 124px tiles, 2px white lines
     - **easyTiles:** 3×3 grid (9 tiles), 166px tiles, 2px white lines
   - Pre-calculated and hardcoded all tile positions in JSON
   - Implemented grid line drawing between tiles
   - Images load from appropriately sized folders (99sized, 124sized, 166sized)

5. **Button System Created**
   - Three test buttons: HARD, MEDIUM, EASY (renamed from SMALL/LARGE)
   - Buttons clear and redraw grid with appropriate tile size
   - Fresh random selection each time button is clicked
   - Buttons styled with Halloween orange theme

6. **Image Processing**
   - Updated `resize_witch_images.py` to create new sizes:
     - 166×166 pixels → `assets/166sized/`
     - 124×124 pixels → `assets/124sized/`
     - 99×99 pixels → `assets/99sized/`
   - Created `json/witchImages.json` with list of 76 base names (simple array)
   - All 76 witch images available in three sizes

7. **Full Configuration System Refactor**
   - **Created `json/gameConfig.json`** - Master configuration file:
     - Theme name
     - Asset folder structure patterns
     - File naming patterns (`{basename}_{size}.png`)
     - Paths to other JSON files
     - Difficulty configurations (id, label, buttonId)
     - Default difficulty
     - Board dimensions
   - **Refactored JavaScript:**
     - Loads gameConfig.json first
     - All other data loaded based on config references
     - Buttons dynamically created from config
     - Image paths built using config patterns
     - Board dimensions from config
     - **Zero hardcoded values** - completely theme-agnostic
   - **Updated HTML:**
     - Removed hardcoded buttons (JavaScript creates them dynamically)

8. **Comprehensive Witch Database Created**
   - **Created `json/witchesImages.json`** - Complete character database:
     - 20 character groups (Elphaba, Galinda, Samantha, etc.)
     - Each character has 2-9 different images
     - Total: 76 unique images organized by character
     - Each image entry includes:
       - `filename`: Base filename
       - `name_text`: Character's actual name
       - `description_text`: Source (TV show, movie, etc.)
       - `easy_path`, `medium_path`, `hard_path`: Folder paths

### Current Project Files

```
whosThatWitch/
├── index.html                              # Clean HTML, dynamic buttons
├── css/
│   └── style.css                           # Styling with board, screen, buttons
├── js/
│   └── whosThatWitch.js                    # Fully configurable game logic
├── assets/
│   ├── witches/                            # 76 original images
│   ├── 99sized/                            # 99×99 images (HARD difficulty)
│   ├── 124sized/                           # 124×124 images (MEDIUM difficulty)
│   └── 166sized/                           # 166×166 images (EASY difficulty)
├── json/
│   ├── gameConfig.json                     # MASTER config file (theme-agnostic)
│   ├── tileSizes.json                      # Grid configurations
│   ├── witchImages.json                    # Simple array (76 base names) - LEGACY
│   └── witchesImages.json                  # NEW: Character-grouped database
├── claude-john-docs/
│   ├── BEGINNING SPECS.txt
│   ├── specifications.md                   # UPDATED
│   ├── specifications-technical.md         # Needs update
│   └── Claude-ToBeContinued-2025-1012-1620.md  # This file
└── resize_witch_images.py                  # Image processor (166/124/99)
```

### Key Technical Implementations

**Configuration-Driven Architecture:**
- `gameConfig.json` controls everything:
  - Theme, asset paths, file patterns
  - Difficulty definitions
  - Board dimensions
  - References to other JSON files
- Complete theme independence - swap to baseball by changing config only

**Character-Based Image Selection:**
- Old system: `witchImages.json` - flat array of 76 base names
- New system: `witchesImages.json` - character groups with metadata
- Structure allows: Pick random characters → pick one image per character
- Prevents duplicates of same character in one game

**Dynamic UI Generation:**
- Buttons created from `gameConfig.json` difficulties array
- Image paths built from config patterns
- Grid lines use config-specified dimensions

## Current Testing Status

**What Works:**
- ✅ Board displays correctly (502×502 with purple frame)
- ✅ Three difficulty buttons display and function
- ✅ Grid lines draw correctly for all three sizes
- ✅ Random images load from flat array (`witchImages.json`)
- ✅ Each button click shows new random selection
- ✅ All images properly sized and positioned
- ✅ Configuration system fully functional

**What Needs Implementation:**
- ❌ Use new `witchesImages.json` character database
- ❌ Select random **characters** (not just random images)
- ❌ Pick one random image per character
- ❌ Access metadata (name_text, description_text)

## Next Steps

### Immediate Priority: Update Random Image Selection

**Current System:**
```javascript
// In whosThatWitch.js - getRandomImages()
// Currently uses witchImages.json (simple array)
const shuffled = [...imageList].sort(() => Math.random() - 0.5);
const selectedImages = shuffled.slice(0, count).map(baseName => ...);
```

**Needed System:**
```javascript
// Use witchesImages.json (character-grouped)
// 1. Get array of character keys
// 2. Shuffle character keys
// 3. Select N random characters
// 4. For each character, pick one random image from their array
// 5. Build image paths using config patterns
// 6. Store character metadata for later use (witch identification)
```

**Implementation Tasks:**
1. Update `loadImageList()` to load `witchesImages.json` instead
2. Modify `getRandomImages()` to:
   - Select random character groups
   - Pick one random image per character
   - Build full paths from config patterns
   - Return both paths and metadata
3. Update tile drawing to handle metadata
4. Test with all three difficulty levels

### Medium-Term Tasks

5. **Update gameConfig.json:**
   - Point `imageListFile` to `witchesImages.json`
   - Add key name for character data structure

6. **Design Tile Flip Functionality:**
   - Face-down state (using `tileBackColor` from config)
   - Face-up state (witch image)
   - Flip animation
   - Click handler

7. **Implement Matching Logic:**
   - Track flipped tiles
   - Detect matches
   - Handle match success/failure
   - Use character data for identification

8. **Add Witch Identification UI:**
   - Input field or multiple choice
   - Validate against `name_text`
   - Use `description_text` for hints/feedback

### Long-Term Tasks

- Scoring system
- Game win/completion detection
- Instructions screen
- Reset/new game button
- Sound effects
- Animations
- Integration with parent Halloween app (ES6 module export)

## Questions/Decisions for Next Session

1. **Image selection strategy:**
   - Confirmed: Select random characters, then one image per character
   - This ensures variety and enables "who's that witch" identification

2. **Metadata storage:**
   - Should we store selected character metadata in a game state object?
   - Needed for witch identification after matching

3. **Config file consolidation:**
   - Should we deprecate old `witchImages.json`?
   - Or keep both for backward compatibility testing?

## Development Notes

**Configuration Philosophy:**
- Everything in JSON files
- Zero hardcoded values in JavaScript
- Theme-swappable by changing one config file
- Easy to extend to new themes (baseball, Pokemon, etc.)

**Character Database Benefits:**
- Prevents duplicate characters per game
- Provides metadata for identification feature
- Supports description text for educational aspect
- Flexible path system for different image sizes

## Resources Available

- 76 witch images in 3 sizes (99, 124, 166)
- 20 unique characters with 2-9 photos each
- Fully configurable grid system
- Theme-agnostic architecture
- Complete character metadata

---

**Next Session Start:**
1. Read this file
2. Review specifications.md
3. Update JavaScript to use witchesImages.json
4. Implement character-based random selection
5. Test with all three difficulties

**Files to Read at Session Start:**
- Claude-ToBeContinued-2025-1012-1620.md (this file)
- specifications.md
- json/witchesImages.json (review structure)
