# Who's That Witch? - Technical Specifications

## Project Information

**Project Name:** Who's That Witch? (Corrected from earlier "Where's That Witch?")
**Technology Stack:** HTML/CSS/JavaScript (Vanilla), Python (tooling)
**Date Started:** October 11, 2025
**Last Updated:** October 11, 2025 - 19:00+

## Technical Architecture

### File Structure
```
whosThatWitch/
├── index.html                              # Main HTML structure
├── css/
│   └── style.css                           # All game styling
├── js/
│   └── game.js                             # Main game logic (currently position editor mode)
├── assets/
│   ├── witches/                            # Original witch images (76 PNGs, various sizes)
│   ├── 70sized/                            # 70×70 resized images (76 PNGs) **NEW**
│   ├── 132sized/                           # 132×132 resized images (76 PNGs, ~2.6MB total)
│   └── 176sized/                           # 176×176 resized images (76 PNGs, ~4.2MB total)
├── squarePositions/
│   └── squarePositions01.json              # Saved tile positions
├── claude-john-docs/                       # Project documentation
│   ├── BEGINNING SPECS.txt
│   ├── specifications.md
│   ├── specifications-technical.md
│   └── Claude-ToBeContinued-*.md
└── resize_witch_images.py                  # Image resizing utility script
```

### Technology Decisions

**Framework:** Vanilla JavaScript (no framework)
- Aligns with existing Halloween games project structure
- Lightweight and easy to understand
- No build process required

**Module System:** Vanilla JavaScript with potential ES6 module export for parent project integration
- Current implementation: Self-contained vanilla JavaScript
- Integration with main Halloween games app: Planned for later (will need to export default class)
- Position editor mode: Currently active for development, will be removed/separated for production

### Integration with Main Halloween Games App

If this game is to be integrated with the main Halloween games collection:
- Must export a default class with required methods: `constructor()`, `render()`, `start()`, `stop()`, `getScore()`
- Will be dynamically imported from `js/games/` directory
- Must update `main.js` with game registration

### Development Environment

**Local Server:**
```bash
python3 -m http.server 8000
```

**Browser Testing:** Chrome/Firefox/Edge recommended

### Asset Processing

**Image Resizing Pipeline:**
- **Tool:** Python script using Pillow (PIL) library v11.3.0
- **Resampling Method:** LANCZOS (high-quality downsampling)
- **Processing:** Batch processing of all 76 images in single run
- **Naming Convention:** Original filename with size suffix (e.g., `_132` or `_176`)
- **Format Preservation:** RGBA PNG format maintained for transparency support

**Image Processing Script (`resize_witch_images.py`):**
```python
# Key features:
- Reads all PNGs from assets/witches/
- Resizes to exact square dimensions (may squash/stretch slightly)
- Outputs to both 132sized and 176sized folders simultaneously
- Progress reporting during batch processing
- Error handling for individual file failures
```

**Image Specifications:**
- Original images: Approximately square, various dimensions
- Resized images: Exact square dimensions (132x132 or 176x176)
- Quality: LANCZOS resampling ensures minimal quality loss
- File size: Compressed PNG format, ~34KB average per 132px image, ~56KB average per 176px image

### Future Considerations

*Technical decisions and implementation notes to be documented as development progresses*

**Reusability:**
- The `resize_witch_images.py` script can be reused if additional witch images are added to the collection
- Simply add new PNGs to `assets/witches/` and re-run the script

## Known Technical Constraints

- No external dependencies (vanilla JS only)
- Must be compatible with GitHub Pages
- Target game area: 1280x720 (based on main Halloween games app)
