/**
 * Who's That Witch? - Game Logic
 * Fully configurable via JSON files
 */

let gameConfig = null;
let tileData = null;
let imageList = null;

// Configuration file paths (easy to find and change)
const gameConfigFile = "json/gameConfig.json";
const tileSizesFile = "json/tileSizes.json";
const witchesFile = "json/witches.json";

// Grid position rings (clockwise from outside to inside)
// Each position has: num (index), row, col
const EASY_RINGS = [
  [ // Ring 0 (outer perimeter - 8 squares)
    {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1}, {num: 2, row: 0, col: 2},  // top →
    {num: 3, row: 1, col: 2}, {num: 4, row: 2, col: 2},                            // right ↓
    {num: 5, row: 2, col: 1}, {num: 6, row: 2, col: 0},                            // bottom ←
    {num: 7, row: 1, col: 0}                                                        // left ↑
  ],
  [ // Ring 1 (center - 1 square)
    {num: 8, row: 1, col: 1}
  ]
];

const MEDIUM_RINGS = [
  [ // Ring 0 (outer perimeter - 12 squares)
    {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1}, {num: 2, row: 0, col: 2}, {num: 3, row: 0, col: 3},  // top →
    {num: 4, row: 1, col: 3}, {num: 5, row: 2, col: 3}, {num: 6, row: 3, col: 3},                            // right ↓
    {num: 7, row: 3, col: 2}, {num: 8, row: 3, col: 1}, {num: 9, row: 3, col: 0},                            // bottom ←
    {num: 10, row: 2, col: 0}, {num: 11, row: 1, col: 0}                                                     // left ↑
  ],
  [ // Ring 1 (inner 2×2 block - 4 squares)
    {num: 12, row: 1, col: 1}, {num: 13, row: 1, col: 2},  // top →
    {num: 14, row: 2, col: 2},                              // right ↓
    {num: 15, row: 2, col: 1}                               // bottom ←
  ]
];

const HARD_RINGS = [
  [ // Ring 0 (outer perimeter - 16 squares)
    {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1}, {num: 2, row: 0, col: 2}, {num: 3, row: 0, col: 3}, {num: 4, row: 0, col: 4},  // top →
    {num: 5, row: 1, col: 4}, {num: 6, row: 2, col: 4}, {num: 7, row: 3, col: 4}, {num: 8, row: 4, col: 4},                            // right ↓
    {num: 9, row: 4, col: 3}, {num: 10, row: 4, col: 2}, {num: 11, row: 4, col: 1}, {num: 12, row: 4, col: 0},                         // bottom ←
    {num: 13, row: 3, col: 0}, {num: 14, row: 2, col: 0}, {num: 15, row: 1, col: 0}                                                    // left ↑
  ],
  [ // Ring 1 (next layer in - 8 squares)
    {num: 16, row: 1, col: 1}, {num: 17, row: 1, col: 2}, {num: 18, row: 1, col: 3},  // top →
    {num: 19, row: 2, col: 3}, {num: 20, row: 3, col: 3},                             // right ↓
    {num: 21, row: 3, col: 2}, {num: 22, row: 3, col: 1},                             // bottom ←
    {num: 23, row: 2, col: 1}                                                         // left ↑
  ],
  [ // Ring 2 (center - 1 square)
    {num: 24, row: 2, col: 2}
  ]
];

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("Who's That Witch? - Game loaded");
  initGame();
});

/**
 * Initialize the game
 */
async function initGame() {
  const screenContainer = document.getElementById("screen");

  // Verify game container exists and has correct dimensions
  if (screenContainer) {
    const width = screenContainer.offsetWidth;
    const height = screenContainer.offsetHeight;
    console.log(`Screen container dimensions: ${width} x ${height}`);

    if (width === 950 && height === 714) {
      console.log("Screen container dimensions are correct!");
    } else {
      console.warn(`Expected 950x714, got ${width}x${height}`);
    }
  } else {
    console.error("Screen container not found!");
  }

  // Load game configuration first
  await loadGameConfig();

  // Load other data files based on config
  await loadTileData();
  await loadImageList();

  // Setup buttons dynamically from config
  setupButtons();

  // Load default grid
  drawGrid(gameConfig.defaultDifficulty);
}

/**
 * Load master game configuration
 */
async function loadGameConfig() {
  try {
    const response = await fetch(gameConfigFile);
    gameConfig = await response.json();
    console.log(`Game config loaded: ${gameConfig.theme} theme`);
  } catch (error) {
    console.error("Error loading game config:", error);
  }
}

/**
 * Load tile/grid configuration from JSON
 */
async function loadTileData() {
  try {
    const response = await fetch(tileSizesFile);
    const data = await response.json();
    tileData = data.squareParameters;
    console.log("Tile data loaded:", tileData);
  } catch (error) {
    console.error("Error loading tile data:", error);
  }
}

/**
 * Load image list from JSON (character-grouped structure)
 */
async function loadImageList() {
  try {
    const response = await fetch(witchesFile);
    const data = await response.json();
    imageList = data.witchImages; // Character-grouped object
    const characterCount = Object.keys(imageList).length;
    console.log(`Images loaded: ${characterCount} unique characters`);
  } catch (error) {
    console.error("Error loading image list:", error);
  }
}


/**
 * Setup button click handlers dynamically from config
 */
function setupButtons() {
  const buttonContainer = document.querySelector(".test-buttons");

  // Clear existing buttons
  buttonContainer.innerHTML = "";

  // Create buttons from config
  gameConfig.difficulties.forEach((difficulty) => {
    const button = document.createElement("button");
    button.id = difficulty.buttonId;
    button.textContent = difficulty.label;
    button.addEventListener("click", () => {
      drawGrid(difficulty.id);
    });
    buttonContainer.appendChild(button);
  });

  console.log(`Created ${gameConfig.difficulties.length} difficulty buttons`);
}

/**
 * Build image path from base name using config patterns
 * @param {string} baseName - Base image name
 * @param {number} size - Image size
 * @returns {string} Full path to image
 */
function buildImagePath(baseName, size) {
  // Error checking
  if (!gameConfig) {
    console.error("ERROR: gameConfig is not loaded!");
    return undefined;
  }

  if (!baseName) {
    console.error("ERROR: baseName is undefined or null!");
    return undefined;
  }

  if (!size) {
    console.error("ERROR: size is undefined or null!");
    return undefined;
  }

  const folder = gameConfig.folderPattern.replace("{size}", size);
  const filename = gameConfig.filePattern
    .replace("{basename}", baseName)
    .replace("{size}", size);

  const fullPath = `${gameConfig.assetFolder}/${folder}/${filename}`;

  return fullPath;
}

/**
 * Get tile images for the grid (simplified - all bomb tiles for now)
 * @param {number} count - Total number of tiles needed
 * @param {number} size - Tile size
 * @returns {Array} Array of image paths (all bomb tiles)
 */
function getTileImages(count, size) {
  const tiles = [];
  const bombPath = buildImagePath("_bombTile", size);

  for (let i = 0; i < count; i++) {
    tiles.push(bombPath);
  }

  console.log(`Created ${count} placeholder tiles using bomb image`);
  return tiles;
}


/**
 * Clear all content from the board
 */
function clearBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
}

/**
 * Draw grid for the selected difficulty
 * @param {string} difficultyId - Difficulty identifier (e.g., "hardTiles")
 */
function drawGrid(difficultyId) {
  console.log(`Drawing grid: ${difficultyId}`);

  if (!tileData) {
    console.error("Tile data not loaded yet");
    return;
  }

  // Clear existing content
  clearBoard();

  const config = tileData[difficultyId];
  const gridSize = config.gridSize;
  const tileSize = config.tileSize;
  const lineSize = config.lineSize;
  const lineColor = config.lineColor;
  const positions = config.squarePositions;

  // Get placeholder images (all bomb tiles for now)
  const tileImages = getTileImages(positions.length, tileSize);

  // Draw grid lines
  drawGridLines(gridSize, tileSize, lineSize, lineColor);

  // Draw tiles
  drawTiles(positions, tileSize, tileImages);

  console.log(`Grid drawn: ${positions.length} tiles`);
}

/**
 * Draw grid lines (vertical and horizontal)
 */
function drawGridLines(gridSize, tileSize, lineSize, lineColor) {
  const board = document.getElementById("board");
  const boardWidth = gameConfig.boardDimensions.width;
  const boardHeight = gameConfig.boardDimensions.height;

  // Draw vertical lines (between columns)
  for (let i = 0; i < gridSize - 1; i++) {
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(i + 1) * tileSize + i * lineSize}px`;
    line.style.top = "0px";
    line.style.width = `${lineSize}px`;
    line.style.height = `${boardHeight}px`;
    line.style.backgroundColor = lineColor;
    board.appendChild(line);
  }

  // Draw horizontal lines (between rows)
  for (let i = 0; i < gridSize - 1; i++) {
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = "0px";
    line.style.top = `${(i + 1) * tileSize + i * lineSize}px`;
    line.style.width = `${boardWidth}px`;
    line.style.height = `${lineSize}px`;
    line.style.backgroundColor = lineColor;
    board.appendChild(line);
  }
}

/**
 * Draw tiles with images
 */
function drawTiles(positions, tileSize, imagePaths) {
  const board = document.getElementById("board");

  positions.forEach((pos, index) => {
    const imagePath = imagePaths[index];

    const img = document.createElement("img");
    img.className = "tile-image";
    img.src = imagePath;
    img.alt = `Tile ${pos.square}`;
    img.style.left = `${pos.x}px`;
    img.style.top = `${pos.y}px`;
    img.style.width = `${tileSize}px`;
    img.style.height = `${tileSize}px`;

    board.appendChild(img);
  });
}
