/**
 * Who's That Witch? - Game Logic
 * Fully configurable via JSON files
 */

let gameConfig = null;
let tileData = null;
let imageList = null;
let groupedWitches = null; // Images organized by group number

// Game state variables for tile interaction
let selectedTiles = []; // Currently selected tiles (max 2)
let gameState = "WAITING_FOR_FIRST_TILE"; // Track game flow
let currentTileSize = null; // Track current difficulty's tile size for halftone images
let bannerActivationCount = 0; // Track how many times "WHO AM I?" banner has been activated

// Configuration file paths (easy to find and change)
const gameConfigFile = "json/gameConfig.json";
const tileSizesFile = "json/tileSizes.json";
const witchesFile = "json/witches.json";

// Grid square positions (left to right, top to bottom)
// Each position has: num (square index), row, col
const EASY_SQUARES = [
  { num: 0, row: 0, col: 0 },
  { num: 1, row: 0, col: 1 },
  { num: 2, row: 0, col: 2 },
  { num: 3, row: 1, col: 0 },
  { num: 4, row: 1, col: 1 },
  { num: 5, row: 1, col: 2 },
  { num: 6, row: 2, col: 0 },
  { num: 7, row: 2, col: 1 },
  { num: 8, row: 2, col: 2 },
];

const MEDIUM_SQUARES = [
  { num: 0, row: 0, col: 0 },
  { num: 1, row: 0, col: 1 },
  { num: 2, row: 0, col: 2 },
  { num: 3, row: 0, col: 3 },
  { num: 4, row: 1, col: 0 },
  { num: 5, row: 1, col: 1 },
  { num: 6, row: 1, col: 2 },
  { num: 7, row: 1, col: 3 },
  { num: 8, row: 2, col: 0 },
  { num: 9, row: 2, col: 1 },
  { num: 10, row: 2, col: 2 },
  { num: 11, row: 2, col: 3 },
  { num: 12, row: 3, col: 0 },
  { num: 13, row: 3, col: 1 },
  { num: 14, row: 3, col: 2 },
  { num: 15, row: 3, col: 3 },
];

const HARD_SQUARES = [
  { num: 0, row: 0, col: 0 },
  { num: 1, row: 0, col: 1 },
  { num: 2, row: 0, col: 2 },
  { num: 3, row: 0, col: 3 },
  { num: 4, row: 0, col: 4 },
  { num: 5, row: 1, col: 0 },
  { num: 6, row: 1, col: 1 },
  { num: 7, row: 1, col: 2 },
  { num: 8, row: 1, col: 3 },
  { num: 9, row: 1, col: 4 },
  { num: 10, row: 2, col: 0 },
  { num: 11, row: 2, col: 1 },
  { num: 12, row: 2, col: 2 },
  { num: 13, row: 2, col: 3 },
  { num: 14, row: 2, col: 4 },
  { num: 15, row: 3, col: 0 },
  { num: 16, row: 3, col: 1 },
  { num: 17, row: 3, col: 2 },
  { num: 18, row: 3, col: 3 },
  { num: 19, row: 3, col: 4 },
  { num: 20, row: 4, col: 0 },
  { num: 21, row: 4, col: 1 },
  { num: 22, row: 4, col: 2 },
  { num: 23, row: 4, col: 3 },
  { num: 24, row: 4, col: 4 },
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

  // Build grouped witches data structure
  buildGroupedWitches();

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
 * Build grouped witches data structure
 * Reorganizes imageList by group number for easier selection
 * Structure: { 1: { "Elphaba": [...], "Galinda": [...] }, 2: {...}, ... }
 */
function buildGroupedWitches() {
  groupedWitches = {};

  // Iterate through each character
  for (const characterName in imageList) {
    const images = imageList[characterName];

    // Get group number from first image (all images for a character have same group)
    if (images.length > 0) {
      const groupNum = images[0].group;

      // Create group if it doesn't exist
      if (!groupedWitches[groupNum]) {
        groupedWitches[groupNum] = {};
      }

      // Add character's images to this group
      groupedWitches[groupNum][characterName] = images;
    }
  }

  const groupCount = Object.keys(groupedWitches).length;
  console.log(`Grouped witches built: ${groupCount} groups`);
}

/**
 * Setup button click handlers dynamically from config
 */
function setupButtons() {
  const buttonContainer = document.querySelector(".difficulty-buttons");

  // Clear existing buttons
  buttonContainer.innerHTML = "";

  // Map difficulty IDs to button images
  const buttonImages = {
    easyTiles: "assets/other/_easyButton_80x30.png",
    mediumTiles: "assets/other/_mediumButton_80x30.png",
    hardTiles: "assets/other/_hardButton_80x30.png",
  };

  // Create image buttons from config
  gameConfig.difficulties.forEach((difficulty) => {
    const button = document.createElement("img");
    button.id = difficulty.buttonId;
    button.src = buttonImages[difficulty.id];
    button.alt = difficulty.label;
    button.className = "difficulty-button-img";
    button.width = 80;
    button.height = 30;
    button.addEventListener("click", () => {
      drawGrid(difficulty.id);
    });
    buttonContainer.appendChild(button);
  });

  console.log(`Created ${gameConfig.difficulties.length} difficulty buttons`);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle (modifies in place)
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Get random element from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
function getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Check if two positions are adjacent
 * @param {Object} pos1 - Position with {row, col}
 * @param {Object} pos2 - Position with {row, col}
 * @param {boolean} includeDiagonal - Include diagonal adjacency (default: true)
 * @returns {boolean} True if positions are adjacent
 */
function areAdjacent(pos1, pos2, includeDiagonal = true) {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);

  if (includeDiagonal) {
    // Adjacent if within 1 step in any direction (including diagonal)
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
  } else {
    // Adjacent only horizontally or vertically
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }
}

/**
 * Get positions that are available (not filled and not adjacent to excluded positions)
 * @param {Array} allPositions - All grid positions
 * @param {Array} filledPositions - Already filled positions
 * @param {Array} excludeAdjacentTo - Positions to avoid adjacency with
 * @returns {Array} Available positions
 */
function getAvailablePositions(
  allPositions,
  filledPositions,
  excludeAdjacentTo = []
) {
  return allPositions.filter((pos) => {
    // Skip if already filled
    if (filledPositions.some((fp) => fp.num === pos.num)) {
      return false;
    }

    // Skip if adjacent to any excluded position
    for (const excludePos of excludeAdjacentTo) {
      if (areAdjacent(pos, excludePos, true)) {
        return false;
      }
    }

    return true;
  });
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
 * Get the appropriate squares array for difficulty level
 * @param {string} difficultyId - Difficulty identifier
 * @returns {Array} Squares array with {num, row, col}
 */
function getSquaresForDifficulty(difficultyId) {
  switch (difficultyId) {
    case "easyTiles":
      return EASY_SQUARES;
    case "mediumTiles":
      return MEDIUM_SQUARES;
    case "hardTiles":
      return HARD_SQUARES;
    default:
      return MEDIUM_SQUARES;
  }
}

/**
 * Select images for a difficulty level
 * @param {Object} difficultyConfig - Difficulty configuration from gameConfig
 * @param {number} tileSize - Size of tiles for this difficulty
 * @returns {Object} Object with {gameTiles, bombs, bonus} arrays
 */
function selectImagesForDifficulty(difficultyConfig, tileSize) {
  const tiles = [];
  const imageTiles = difficultyConfig.imageTiles;
  const bombTiles = difficultyConfig.bombTiles;
  const bonusTiles = difficultyConfig.bonusTiles;

  // Calculate how many unique images we need (each appears twice)
  const uniqueImagesNeeded = imageTiles / 2;

  // NEW ALGORITHM: Select witch characters directly (not groups)
  // This ensures equal probability for all witches
  const allWitchNames = Object.keys(imageList); // All 25 witch character names

  // Shuffle all witch names and select the number we need
  const shuffledWitches = shuffleArray([...allWitchNames]);
  const selectedWitchNames = shuffledWitches.slice(0, uniqueImagesNeeded);

  console.log(
    `Selected ${selectedWitchNames.length} witches (need ${uniqueImagesNeeded}):`,
    selectedWitchNames
  );

  // For each selected witch, pick one random image
  const selectedImages = [];

  // Generate unique pairIds for each witch (can't use group number since multiple witches share groups)
  let nextPairId = 1;

  for (const witchName of selectedWitchNames) {
    const characterImages = imageList[witchName];

    // Randomly select one image from this character's images
    const selectedImage = getRandomFromArray(characterImages);

    // Build the image path
    const imagePath = buildImagePath(selectedImage.filename, tileSize);

    // Store full tile data with metadata
    // Use a unique pairId for each witch (NOT group number, since multiple witches can share a group)
    const tileData = {
      imagePath: imagePath,
      name_text: selectedImage.name_text,
      description_text: selectedImage.description_text,
      type: "gameTile",
      pairId: nextPairId, // Use unique pairId for this witch's pair
    };
    selectedImages.push(tileData);

    console.log(
      `Witch "${witchName}": selected ${selectedImage.filename} (${selectedImage.name_text}, group ${selectedImage.group}, pairId ${nextPairId})`
    );

    nextPairId++; // Increment for next witch
  }

  // Create pairs (each image twice)
  for (const tileData of selectedImages) {
    tiles.push(tileData);
    tiles.push(tileData); // Same object reference for matching
  }

  // Build separate arrays for bombs
  const bombPath = buildImagePath("_bombTile", tileSize);
  const bombArray = [];
  for (let i = 0; i < bombTiles; i++) {
    bombArray.push({
      imagePath: bombPath,
      type: "bomb",
    });
  }

  // Build separate array for bonus tiles
  const bonusPath = buildImagePath("_bonusTile", tileSize);
  const bonusArray = [];
  for (let i = 0; i < bonusTiles; i++) {
    bonusArray.push({
      imagePath: bonusPath,
      type: "bonus",
    });
  }

  console.log(
    `Created tiles organized by type: ${imageTiles} gameTiles (${uniqueImagesNeeded} pairs) + ${bombTiles} bombs + ${bonusTiles} bonus`
  );

  // Return organized by type (no shuffle yet - will be done during placement)
  return {
    gameTiles: tiles,
    bombs: bombArray,
    bonus: bonusArray,
  };
}

/**
 * Assign tiles to grid positions with adjacency constraints for special tiles
 * @param {Object} tilesByType - Object with {gameTiles, bombs, bonus}
 * @param {Array} squares - Grid squares with {num, row, col}
 * @returns {Array} Array where index = position number, value = tile object
 */
function assignTilesToPositions(tilesByType, squares) {
  const result = new Array(squares.length).fill(null);
  const filledSquares = [];
  const excludeAdjacent = [];

  // Step 1: Place special tiles (bombs, then bonus) with adjacency checking
  const specialTiles = [...tilesByType.bombs, ...tilesByType.bonus];

  for (const specialTile of specialTiles) {
    const available = getAvailablePositions(
      squares,
      filledSquares,
      excludeAdjacent
    );

    if (available.length === 0) {
      console.warn(
        "No available positions for special tile! Using any unfilled position."
      );
      const unfilled = squares.filter(
        (s) => !filledSquares.some((f) => f.num === s.num)
      );
      if (unfilled.length > 0) {
        const selectedSquare = getRandomFromArray(unfilled);
        result[selectedSquare.num] = specialTile;
        filledSquares.push(selectedSquare);
      }
      continue;
    }

    // Pick random available position
    const selectedSquare = getRandomFromArray(available);
    result[selectedSquare.num] = specialTile;
    filledSquares.push(selectedSquare);
    excludeAdjacent.push(selectedSquare);

    console.log(
      `Placed ${specialTile.type} at position ${selectedSquare.num} (row ${selectedSquare.row}, col ${selectedSquare.col})`
    );
  }

  // Step 2: Place gameTiles with adjacency constraints for matching pairs
  const maxAttempts = 100;
  let placementSuccessful = false;

  // Get unique pairIds
  const uniquePairIds = [
    ...new Set(tilesByType.gameTiles.map((t) => t.pairId)),
  ];
  console.log(
    `Attempting to place ${uniquePairIds.length} pairs with adjacency constraints...`
  );

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Reset gameTile placements (keep special tiles)
    for (let i = 0; i < result.length; i++) {
      if (result[i] && result[i].type === "gameTile") {
        result[i] = null;
      }
    }

    // Reset filled squares to only special tiles
    const gameTileFilledSquares = [];
    let attemptFailed = false;

    // Try to place each pair
    for (const pairId of uniquePairIds) {
      // Get both tiles with this pairId
      const tilesWithPairId = tilesByType.gameTiles.filter(
        (t) => t.pairId === pairId
      );

      if (tilesWithPairId.length !== 2) {
        console.error(
          `Expected 2 tiles with pairId ${pairId}, found ${tilesWithPairId.length}`
        );
        continue;
      }

      // Get available positions (not filled by special tiles or other gameTiles this attempt)
      const availableForFirst = squares.filter(
        (s) =>
          !filledSquares.some((f) => f.num === s.num) &&
          !gameTileFilledSquares.some((f) => f.num === s.num)
      );

      if (availableForFirst.length === 0) {
        attemptFailed = true;
        break;
      }

      // Place first tile randomly
      const firstSquare = getRandomFromArray(availableForFirst);
      result[firstSquare.num] = tilesWithPairId[0];
      gameTileFilledSquares.push(firstSquare);

      // Get available positions for second tile (not adjacent to first)
      const availableForSecond = squares.filter(
        (s) =>
          !filledSquares.some((f) => f.num === s.num) &&
          !gameTileFilledSquares.some((f) => f.num === s.num) &&
          !areAdjacent(s, firstSquare, true)
      );

      if (availableForSecond.length === 0) {
        // Can't place second tile non-adjacently, retry
        attemptFailed = true;
        break;
      }

      // Place second tile randomly in non-adjacent position
      const secondSquare = getRandomFromArray(availableForSecond);
      result[secondSquare.num] = tilesWithPairId[1];
      gameTileFilledSquares.push(secondSquare);
    }

    if (!attemptFailed) {
      placementSuccessful = true;
      console.log(
        `Successfully placed all pairs with adjacency constraints on attempt ${attempt}`
      );
      break;
    }
  }

  // If we failed after max attempts, place remaining pairs randomly (accept adjacency)
  if (!placementSuccessful) {
    console.warn(
      `Could not place all pairs non-adjacently after ${maxAttempts} attempts. Placing remaining randomly.`
    );

    // Clear any partially placed gameTiles from the failed 100th attempt
    for (let i = 0; i < result.length; i++) {
      if (result[i] && result[i].type === "gameTile") {
        result[i] = null;
      }
    }

    // DIAGNOSTIC: Check state before fallback placement
    console.log(`FALLBACK DIAGNOSTICS:`);
    console.log(`  Total squares: ${squares.length}`);
    console.log(
      `  filledSquares (special tiles): ${filledSquares.length}`,
      filledSquares.map((s) => s.num)
    );
    console.log(`  gameTiles to place: ${tilesByType.gameTiles.length}`);

    // Count nulls in result after clearing (should equal gameTiles to place)
    const nullsBefore = result.filter((r) => r === null).length;
    console.log(`  Null positions in result after clearing: ${nullsBefore}`);

    // Get remaining empty squares (not filled by special tiles)
    const remainingSquares = squares.filter(
      (s) => !filledSquares.some((f) => f.num === s.num)
    );
    console.log(
      `  remainingSquares: ${remainingSquares.length}`,
      remainingSquares.map((s) => s.num)
    );

    // Since we cleared all gameTiles at start of last failed attempt, place all of them
    const shuffledTiles = shuffleArray([...tilesByType.gameTiles]);
    const shuffledSquares = shuffleArray([...remainingSquares]);

    console.log(`  shuffledTiles: ${shuffledTiles.length}`);
    console.log(
      `  shuffledSquares: ${shuffledSquares.length}`,
      shuffledSquares.map((s) => s.num)
    );

    for (
      let i = 0;
      i < shuffledTiles.length && i < shuffledSquares.length;
      i++
    ) {
      result[shuffledSquares[i].num] = shuffledTiles[i];
      console.log(
        `    Placed tile at square ${shuffledSquares[i].num} (pairId: ${shuffledTiles[i].pairId})`
      );
    }

    // Count nulls after placement
    const nullsAfter = result.filter((r) => r === null).length;
    console.log(`  Null positions in result after: ${nullsAfter}`);
    console.log(
      `  Placed ${shuffledTiles.length} gameTiles randomly (adjacency accepted)`
    );
  }

  return result;
}

/**
 * Get tile images for the grid
 * @param {string} difficultyId - Difficulty identifier (e.g., "easyTiles")
 * @param {number} tileSize - Tile size
 * @returns {Array} Array of tile objects with imagePath and metadata
 */
function getTileImages(difficultyId, tileSize) {
  // Find the difficulty config
  const difficultyConfig = gameConfig.difficulties.find(
    (d) => d.id === difficultyId
  );

  if (!difficultyConfig) {
    console.error(`Difficulty config not found for: ${difficultyId}`);
    return [];
  }

  return selectImagesForDifficulty(difficultyConfig, tileSize);
}

/**
 * Clear all content from the board and witch list
 */
function clearBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  const characterList = document.getElementById("character-list");
  characterList.innerHTML = "";
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

  if (!groupedWitches) {
    console.error("Grouped witches not loaded yet");
    return;
  }

  // Clear existing content
  clearBoard();

  // Reset game state
  selectedTiles = [];
  gameState = "WAITING_FOR_FIRST_TILE";

  const config = tileData[difficultyId];
  const gridSize = config.gridSize;
  const tileSize = config.tileSize;
  const lineSize = config.lineSize;
  const lineColor = config.lineColor;

  // Track current tile size for halftone images
  currentTileSize = tileSize;

  // Get tiles organized by type
  const tilesByType = getTileImages(difficultyId, tileSize);

  // Get squares for adjacency logic (single source of truth)
  const squares = getSquaresForDifficulty(difficultyId);

  // Assign tiles to positions with adjacency constraints
  const positionToTileMap = assignTilesToPositions(tilesByType, squares);

  // Calculate back image path (same for all tiles at this difficulty)
  const backImagePath = `assets/other/_back_wBroom_${tileSize}.png`;

  // Draw grid lines
  drawGridLines(gridSize, tileSize, lineSize, lineColor);

  // Draw tiles using squares (calculate x/y from row/col)
  drawTiles(squares, tileSize, lineSize, positionToTileMap, backImagePath);

  // Update character list (extract all tiles from map)
  const allTiles = positionToTileMap.filter((t) => t !== null);
  updateCharacterList(allTiles);

  console.log(`Grid drawn: ${squares.length} tiles`);
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
 * Draw tiles with images (two-layer structure: face-up + face-down overlay)
 * @param {Array} squares - Grid squares with {num, row, col}
 * @param {number} tileSize - Size of tiles
 * @param {number} lineSize - Size of grid lines
 * @param {Array} positionToTileMap - Array mapping square number to tile object
 * @param {string} backImagePath - Path to back image (same for all tiles)
 */
function drawTiles(
  squares,
  tileSize,
  lineSize,
  positionToTileMap,
  backImagePath
) {
  const board = document.getElementById("board");

  squares.forEach((square) => {
    const tileData = positionToTileMap[square.num];

    // Skip if no tile data at this position
    if (!tileData) {
      console.warn(`No tile data at square ${square.num}`);
      return;
    }

    // Calculate x/y coordinates from row/col
    const x = square.col * (tileSize + lineSize);
    const y = square.row * (tileSize + lineSize);

    // Create container div for this tile position
    const tileContainer = document.createElement("div");
    tileContainer.className = "tile-container";
    tileContainer.style.left = `${x}px`;
    tileContainer.style.top = `${y}px`;
    tileContainer.style.width = `${tileSize}px`;
    tileContainer.style.height = `${tileSize}px`;

    // Store metadata and state on the container
    tileContainer.dataset.squareNum = square.num;
    tileContainer.dataset.type = tileData.type;
    tileContainer.dataset.isFaceUp = "false"; // Start face-down
    tileContainer.dataset.isMatched = "false";

    if (tileData.pairId) {
      tileContainer.dataset.pairId = tileData.pairId;
    }
    if (tileData.name_text) {
      tileContainer.dataset.nameText = tileData.name_text;
    }
    if (tileData.description_text) {
      tileContainer.dataset.descriptionText = tileData.description_text;
    }

    // Create face-up image (bottom layer - the witch/character)
    const faceUpImg = document.createElement("img");
    faceUpImg.className = "tile-face-up";
    faceUpImg.src = tileData.imagePath;
    faceUpImg.alt = `Tile ${square.num}`;
    faceUpImg.style.width = `${tileSize}px`;
    faceUpImg.style.height = `${tileSize}px`;

    // Create halftone overlay (middle layer - for completed witches)
    const halftoneImg = document.createElement("img");
    halftoneImg.className = "tile-halftone";
    halftoneImg.src = `assets/other/_halftone_blackSmall_${tileSize}.png`;
    halftoneImg.alt = "Halftone overlay";
    halftoneImg.style.width = `${tileSize}px`;
    halftoneImg.style.height = `${tileSize}px`;
    halftoneImg.style.opacity = "0"; // Initially hidden

    // Create face-down image (top layer - the back with broom)
    const faceDownImg = document.createElement("img");
    faceDownImg.className = "tile-face-down";
    faceDownImg.src = backImagePath;
    faceDownImg.alt = "Face down";
    faceDownImg.style.width = `${tileSize}px`;
    faceDownImg.style.height = `${tileSize}px`;

    // Add all three images to container (bottom to top: face-up, halftone, face-down)
    tileContainer.appendChild(faceUpImg);
    tileContainer.appendChild(halftoneImg);
    tileContainer.appendChild(faceDownImg);

    // Add click event listener
    tileContainer.addEventListener("click", () =>
      handleTileClick(tileContainer)
    );

    // Add container to board
    board.appendChild(tileContainer);
  });
}

/**
 * Handle tile click event
 * @param {HTMLElement} tileContainer - The clicked tile container
 */
function handleTileClick(tileContainer) {
  // Block clicks if we're checking a match
  if (gameState === "CHECKING_MATCH") {
    console.log("Currently checking match, ignoring click");
    return;
  }

  // Check if tile is face-down and not already matched
  const isFaceUp = tileContainer.dataset.isFaceUp === "true";
  const isMatched = tileContainer.dataset.isMatched === "true";

  if (isFaceUp || isMatched) {
    console.log("Tile already face-up or matched, ignoring click");
    return;
  }

  // Block if we already have 2 tiles selected
  if (selectedTiles.length >= 2) {
    console.log("Already have 2 tiles selected, ignoring click");
    return;
  }

  // Reveal the tile
  revealTile(tileContainer);

  // Check if this is a special tile (bomb or bonus)
  const tileType = tileContainer.dataset.type;
  if (tileType === "bomb" || tileType === "bonus") {
    // Special tiles don't need matching - handle immediately
    gameState = "CHECKING_MATCH"; // Block other clicks
    setTimeout(() => handleSpecialTile(tileContainer), 1000);
    return;
  }

  // Regular gameTile - proceed with matching logic
  if (selectedTiles.length === 1) {
    gameState = "WAITING_FOR_SECOND_TILE";
  } else if (selectedTiles.length === 2) {
    gameState = "CHECKING_MATCH";
    // Check for match after brief delay to allow animation to complete
    setTimeout(() => checkForMatch(), 500);
  }
}

/**
 * Reveal a tile by animating the face-down image to transparent
 * @param {HTMLElement} tileContainer - The tile container to reveal
 */
function revealTile(tileContainer) {
  // Get the face-down image
  const faceDownImg = tileContainer.querySelector(".tile-face-down");

  // Animate to transparent (reveal the face-up image underneath)
  faceDownImg.style.opacity = "0";

  // Update state
  tileContainer.dataset.isFaceUp = "true";

  // Add highlight effect
  tileContainer.classList.add("tile-selected");

  // Add to selected tiles array
  selectedTiles.push(tileContainer);

  console.log(
    `Tile ${tileContainer.dataset.squareNum} revealed (type: ${tileContainer.dataset.type}, pairId: ${tileContainer.dataset.pairId})`
  );
}

/**
 * Handle special tile (bomb or bonus) - keeps it visible but muted
 * @param {HTMLElement} tileContainer - The special tile container
 */
function handleSpecialTile(tileContainer) {
  const tileType = tileContainer.dataset.type;
  console.log(
    `Handling special tile: ${tileType} at position ${tileContainer.dataset.squareNum}`
  );

  // Get the face-down image
  const faceDownImg = tileContainer.querySelector(".tile-face-down");

  // Read the muted opacity value from CSS variable
  const mutedOpacity = getComputedStyle(document.documentElement)
    .getPropertyValue("--tile-muted-opacity")
    .trim();

  // Set opacity to match CSS variable (overrides the inline 0 from revealTile)
  faceDownImg.style.opacity = mutedOpacity;

  // Tile stays face-up
  tileContainer.dataset.isFaceUp = "true";

  // Remove golden highlight and add muted styling
  tileContainer.classList.remove("tile-selected");
  tileContainer.classList.add("tile-muted");

  // Mark as matched so it can't be clicked again
  tileContainer.dataset.isMatched = "true";

  // Hide any previously selected gameTiles before clearing
  selectedTiles.forEach((tile) => {
    if (tile !== tileContainer && tile.dataset.type === "gameTile") {
      const faceDownImg = tile.querySelector(".tile-face-down");
      faceDownImg.style.opacity = "1";
      tile.dataset.isFaceUp = "false";
      tile.classList.remove("tile-selected");
    }
  });

  // Clear selected tiles
  selectedTiles = [];

  // Reset game state
  gameState = "WAITING_FOR_FIRST_TILE";

  console.log(
    `${tileType} tile now muted and visible, ready for next selection`
  );
}

/**
 * Check if the two selected tiles match
 */
function checkForMatch() {
  if (selectedTiles.length !== 2) {
    console.error("checkForMatch called without 2 tiles selected");
    return;
  }

  const tile1 = selectedTiles[0];
  const tile2 = selectedTiles[1];

  // Get pairIds (only gameTiles have pairIds)
  const pairId1 = tile1.dataset.pairId;
  const pairId2 = tile2.dataset.pairId;

  console.log(
    `Checking match: tile1 pairId=${pairId1}, tile2 pairId=${pairId2}`
  );

  // Check if they match
  if (pairId1 && pairId2 && pairId1 === pairId2) {
    // MATCH!
    console.log(
      "✓ MATCH! Tiles stay revealed (Phase 3 will handle witch selection)"
    );
    // Reset state but keep tiles selected for Phase 3 (witch selection)
    gameState = "WAITING_FOR_WITCH_SELECTION";

    // Activate the "WHO AM I?" banner
    const banner = document.getElementById("witch-banner");
    if (banner) {
      // Increment activation counter
      bannerActivationCount++;
      console.log(`Banner activation #${bannerActivationCount}`);

      // Always add active class (static highlight)
      banner.classList.add("witch-banner-active");

      // Only add animation class for first 5 activations
      if (bannerActivationCount <= 1000) {
        banner.classList.add("witch-banner-animated");
      }
    }
  } else {
    // NO MATCH
    console.log("✗ NO MATCH - hiding tiles after delay");
    // Hide tiles after 1 second delay
    setTimeout(() => hideNonMatchingTiles(), 1000);
  }
}

/**
 * Hide non-matching tiles (flip them back face-down)
 */
function hideNonMatchingTiles() {
  if (selectedTiles.length !== 2) {
    console.error("hideNonMatchingTiles called without 2 tiles");
    return;
  }

  // Flip both tiles back
  selectedTiles.forEach((tileContainer) => {
    // Get face-down image
    const faceDownImg = tileContainer.querySelector(".tile-face-down");

    // Animate back to opaque (hide face-up image)
    faceDownImg.style.opacity = "1";

    // Update state
    tileContainer.dataset.isFaceUp = "false";

    // Remove highlight
    tileContainer.classList.remove("tile-selected");
  });

  // Clear selected tiles
  selectedTiles = [];

  // Reset game state
  gameState = "WAITING_FOR_FIRST_TILE";

  // Deactivate the "WHO AM I?" banner (remove both classes)
  const banner = document.getElementById("witch-banner");
  if (banner) {
    banner.classList.remove("witch-banner-active", "witch-banner-animated");
  }

  console.log("Tiles hidden, ready for next selection");
}

/**
 * Handle character name click from the list
 * @param {HTMLElement} characterItem - The clicked character list item
 */
function handleCharacterClick(characterItem) {
  // Only allow clicks when waiting for witch selection
  if (gameState !== "WAITING_FOR_WITCH_SELECTION") {
    console.log("Not in witch selection state, ignoring character click");
    return;
  }

  // Ignore clicks on already completed characters
  if (characterItem.dataset.completed === "true") {
    console.log("Character already completed, ignoring click");
    return;
  }

  // Get the clicked character name
  const clickedName = characterItem.dataset.characterName;

  // Get the expected name from the selected tiles (both have same name)
  const expectedName = selectedTiles[0].dataset.nameText;

  console.log(`Character clicked: ${clickedName}, Expected: ${expectedName}`);

  // Compare names
  if (clickedName === expectedName) {
    // CORRECT!
    console.log("✓ CORRECT! Character identified");
    setTimeout(() => handleCorrectMatch(characterItem), 500);
  } else {
    // INCORRECT
    console.log("✗ INCORRECT! Wrong character selected");
    handleIncorrectMatch(characterItem);
  }
}

/**
 * Handle correct character identification
 * @param {HTMLElement} characterItem - The character list item that was correctly identified
 */
function handleCorrectMatch(characterItem) {
  // Create success tooltip
  const successTooltip = document.createElement("div");
  successTooltip.className = "success-tooltip";
  successTooltip.innerHTML = `Yes! I am witch <strong>${characterItem.dataset.characterName}</strong>!`;

  // Position it relative to the character item
  successTooltip.style.position = "absolute";
  successTooltip.style.left = "0";
  successTooltip.style.top = "25px";
  successTooltip.style.background = "#006400";
  successTooltip.style.color = "#ffffff";
  successTooltip.style.padding = "10px";
  successTooltip.style.border = "2px solid #00ff00";
  successTooltip.style.borderRadius = "5px";
  successTooltip.style.width = "300px";
  successTooltip.style.zIndex = "1001";
  successTooltip.style.lineHeight = "1.4";
  successTooltip.style.fontSize = "14px";
  successTooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
  successTooltip.style.fontWeight = "bold";

  // Add to character item
  characterItem.appendChild(successTooltip);

  // Track hover state and time elapsed
  let isHovering = true; // User just clicked, so they're hovering
  let minTimeElapsed = false;

  // Store reference to matched tiles for later use
  const matchedTiles = [...selectedTiles];

  // Function to try removing tooltip (only if both conditions met)
  const tryRemoveTooltip = () => {
    if (minTimeElapsed && !isHovering) {
      successTooltip.remove();

      // Apply halftone effect to both matched tiles
      matchedTiles.forEach((tileContainer) => {
        // Remove golden glow
        tileContainer.classList.remove("tile-selected");

        // Hide the face-down broom image
        const faceDownImg = tileContainer.querySelector(".tile-face-down");
        faceDownImg.style.opacity = "0";

        // Show the halftone overlay
        const halftoneImg = tileContainer.querySelector(".tile-halftone");
        halftoneImg.style.opacity = "1";
      });

      // Clean up listeners
      characterItem.removeEventListener("mouseenter", handleMouseEnter);
      characterItem.removeEventListener("mouseleave", handleMouseLeave);
    }
  };

  // Mouse event handlers
  const handleMouseEnter = () => {
    isHovering = true;
  };

  const handleMouseLeave = () => {
    isHovering = false;
    tryRemoveTooltip();
  };

  // Add hover listeners
  characterItem.addEventListener("mouseenter", handleMouseEnter);
  characterItem.addEventListener("mouseleave", handleMouseLeave);

  // After 2 seconds, mark time as elapsed and try to remove
  setTimeout(() => {
    minTimeElapsed = true;
    tryRemoveTooltip();
  }, 2000);

  // Mark both tiles as matched (permanently completed)
  selectedTiles.forEach((tileContainer) => {
    tileContainer.dataset.isMatched = "true";
    // Tiles stay face-up with golden glow
  });

  // Update character item as completed
  characterItem.dataset.completed = "true";

  // Add checkmark to character name
  const characterName = characterItem.querySelector(".character-name");
  characterName.textContent = "✓ " + characterItem.dataset.characterName;

  // Add hover functionality to highlight tiles when hovering over completed character name
  const handleCompletedHoverEnter = () => {
    // Find both tiles with this character name
    const characterNameText = characterItem.dataset.characterName;
    const tilesToHighlight = document.querySelectorAll(
      `[data-name-text="${characterNameText}"][data-is-matched="true"]`
    );

    tilesToHighlight.forEach((tile) => {
      // Hide halftone overlay
      const halftoneImg = tile.querySelector(".tile-halftone");
      if (halftoneImg) {
        halftoneImg.style.opacity = "0";
      }

      // Add stronger golden glow
      tile.classList.add("tile-completed-glow");
    });
  };

  const handleCompletedHoverLeave = () => {
    // Find both tiles with this character name
    const characterNameText = characterItem.dataset.characterName;
    const tilesToHighlight = document.querySelectorAll(
      `[data-name-text="${characterNameText}"][data-is-matched="true"]`
    );

    tilesToHighlight.forEach((tile) => {
      // Show halftone overlay
      const halftoneImg = tile.querySelector(".tile-halftone");
      if (halftoneImg) {
        halftoneImg.style.opacity = "1";
      }

      // Remove golden glow
      tile.classList.remove("tile-completed-glow");
    });
  };

  // Add hover listeners for completed character
  characterItem.addEventListener("mouseenter", handleCompletedHoverEnter);
  characterItem.addEventListener("mouseleave", handleCompletedHoverLeave);

  // Check if all real witches have been found (to strikethrough decoys)
  checkGameCompletion();

  // Deactivate the "WHO AM I?" banner (remove both classes)
  const banner = document.getElementById("witch-banner");
  if (banner) {
    banner.classList.remove("witch-banner-active", "witch-banner-animated");
  }

  // Clear selected tiles array
  selectedTiles = [];

  // Reset game state
  gameState = "WAITING_FOR_FIRST_TILE";

  console.log("Match completed successfully!");
}

/**
 * Handle incorrect character identification
 * @param {HTMLElement} characterItem - The character item that was incorrectly clicked
 */
function handleIncorrectMatch(characterItem) {
  // Create temporary error tooltip
  const errorTooltip = document.createElement("div");
  errorTooltip.className = "error-tooltip";
  errorTooltip.innerHTML = `Nope! <strong>${characterItem.dataset.characterName}</strong> is not my name!`;

  // Position it relative to the character item
  errorTooltip.style.position = "absolute";
  errorTooltip.style.left = "0";
  errorTooltip.style.top = "25px";
  errorTooltip.style.background = "#8B0000";
  errorTooltip.style.color = "#ffffff";
  errorTooltip.style.padding = "10px";
  errorTooltip.style.border = "2px solid #ff0000";
  errorTooltip.style.borderRadius = "5px";
  errorTooltip.style.width = "300px";
  errorTooltip.style.zIndex = "1001";
  errorTooltip.style.lineHeight = "1.4";
  errorTooltip.style.fontSize = "14px";
  errorTooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
  errorTooltip.style.fontWeight = "bold";

  // Add to character item
  characterItem.appendChild(errorTooltip);

  // Track hover state and time elapsed
  let isHovering = true; // User just clicked, so they're hovering
  let minTimeElapsed = false;

  // Function to try removing tooltip and hiding tiles (only if both conditions met)
  const tryRemoveTooltip = () => {
    if (minTimeElapsed && !isHovering) {
      errorTooltip.remove();
      hideNonMatchingTiles();
      // Clean up listeners
      characterItem.removeEventListener("mouseenter", handleMouseEnter);
      characterItem.removeEventListener("mouseleave", handleMouseLeave);
    }
  };

  // Mouse event handlers
  const handleMouseEnter = () => {
    isHovering = true;
  };

  const handleMouseLeave = () => {
    isHovering = false;
    tryRemoveTooltip();
  };

  // Add hover listeners
  characterItem.addEventListener("mouseenter", handleMouseEnter);
  characterItem.addEventListener("mouseleave", handleMouseLeave);

  // After 2 seconds, mark time as elapsed and try to remove
  setTimeout(() => {
    minTimeElapsed = true;
    tryRemoveTooltip();
  }, 2000);
}

/**
 * Check if all real witches have been found and strikethrough decoys
 */
function checkGameCompletion() {
  // Get all character items from the list
  const allCharacterItems = document.querySelectorAll(".character-item");

  // Count total non-decoy characters
  const realCharacters = Array.from(allCharacterItems).filter(
    (item) => item.dataset.characterType === "gameTile"
  );

  // Count completed non-decoy characters
  const completedRealCharacters = realCharacters.filter(
    (item) => item.dataset.completed === "true"
  );

  console.log(
    `Game completion check: ${completedRealCharacters.length}/${realCharacters.length} real witches found`
  );

  // If all real witches have been found, apply strikethrough to decoys
  if (
    completedRealCharacters.length === realCharacters.length &&
    realCharacters.length > 0
  ) {
    console.log("🎉 All real witches found! Striking through decoys...");

    // Find all decoy character items
    const decoyItems = Array.from(allCharacterItems).filter(
      (item) => item.dataset.characterType === "decoy"
    );

    // Add strikethrough class to each decoy's name
    decoyItems.forEach((decoyItem) => {
      const decoyName = decoyItem.querySelector(".character-name");
      if (decoyName) {
        decoyName.classList.add("character-decoy-strikethrough");
      }
    });

    console.log(`Strikethrough applied to ${decoyItems.length} decoy names`);

    // Check for any unrevealed bomb/bonus tiles
    const allTiles = document.querySelectorAll(".tile-container");
    const unrevealedSpecialTiles = Array.from(allTiles).filter((tile) => {
      const tileType = tile.dataset.type;
      const isFaceUp = tile.dataset.isFaceUp === "true";
      return (tileType === "bomb" || tileType === "bonus") && !isFaceUp;
    });

    if (unrevealedSpecialTiles.length > 0) {
      console.log(
        `Found ${unrevealedSpecialTiles.length} unrevealed special tiles. Auto-revealing...`
      );

      // Reveal each special tile
      unrevealedSpecialTiles.forEach((tile) => {
        // Get the face-down image
        const faceDownImg = tile.querySelector(".tile-face-down");

        // Read the muted opacity value from CSS variable
        const mutedOpacity = getComputedStyle(document.documentElement)
          .getPropertyValue("--tile-muted-opacity")
          .trim();

        // Reveal with muted opacity
        faceDownImg.style.opacity = mutedOpacity;

        // Update state
        tile.dataset.isFaceUp = "true";
        tile.dataset.isMatched = "true";
        tile.classList.add("tile-muted");

        console.log(
          `Auto-revealed ${tile.dataset.type} at position ${tile.dataset.squareNum}`
        );
      });
    }

    // After 3 seconds, apply halftone to all special tiles (including previously revealed ones)
    // This runs regardless of whether special tiles were unrevealed or clicked earlier
    setTimeout(() => {
      const allSpecialTiles = Array.from(allTiles).filter((tile) => {
        const tileType = tile.dataset.type;
        return tileType === "bomb" || tileType === "bonus";
      });

      allSpecialTiles.forEach((tile) => {
        // Hide the face-down image completely
        const faceDownImg = tile.querySelector(".tile-face-down");
        faceDownImg.style.opacity = "0";

        // Show the halftone overlay
        const halftoneImg = tile.querySelector(".tile-halftone");
        halftoneImg.style.opacity = "1";

        console.log(
          `Applied halftone to ${tile.dataset.type} at position ${tile.dataset.squareNum}`
        );
      });

      console.log("🎮 GAME OVER - All tiles completed!");
    }, 3000);
  }
}

/**
 * Update the character list display
 * Shows unique characters in the current game
 */
function updateCharacterList(tileDataArray) {
  const characterListDiv = document.getElementById("character-list");
  characterListDiv.innerHTML = "";

  // Extract unique characters (filter out bombs/bonus and duplicates)
  const uniqueCharacters = [];
  const seenNames = new Set();
  const seenCharacterKeys = new Set(); // Track character keys (e.g., "Jadis") not name_text

  for (const tileData of tileDataArray) {
    if (
      tileData.type === "gameTile" &&
      tileData.name_text &&
      !seenNames.has(tileData.name_text)
    ) {
      uniqueCharacters.push(tileData);
      seenNames.add(tileData.name_text);

      // Find the character key that corresponds to this name_text
      for (const characterKey in imageList) {
        const characterImages = imageList[characterKey];
        if (characterImages.length > 0 && characterImages[0].name_text === tileData.name_text) {
          seenCharacterKeys.add(characterKey);
          break;
        }
      }
    }
  }

  // Add 2 decoy witches (witches not in the game)
  // Get all available witch names from imageList
  const allWitchNames = Object.keys(imageList);

  // Filter out witches already in the game (using character keys, not name_text)
  const availableDecoys = allWitchNames.filter((name) => !seenCharacterKeys.has(name));

  // Randomly select 2 decoys
  const numDecoys = Math.min(2, availableDecoys.length);
  for (let i = 0; i < numDecoys; i++) {
    const decoyName = getRandomFromArray(availableDecoys);

    // Remove from available list to avoid duplicates
    const index = availableDecoys.indexOf(decoyName);
    availableDecoys.splice(index, 1);

    // Get character data from imageList
    const decoyImages = imageList[decoyName];
    if (decoyImages && decoyImages.length > 0) {
      const decoyData = {
        name_text: decoyImages[0].name_text,
        description_text: decoyImages[0].description_text,
        type: "decoy",
      };
      uniqueCharacters.push(decoyData);
    }
  }

  // Shuffle the character list so decoys are mixed in
  shuffleArray(uniqueCharacters);

  // Create list items for each unique character
  uniqueCharacters.forEach((character) => {
    const characterItem = document.createElement("div");
    characterItem.className = "character-item";

    // Add data attributes for tracking
    characterItem.dataset.completed = "false";
    characterItem.dataset.characterName = character.name_text;
    characterItem.dataset.characterType = character.type || "gameTile"; // Store type to identify decoys

    const characterName = document.createElement("div");
    characterName.className = "character-name";
    characterName.textContent = character.name_text;

    const characterDesc = document.createElement("div");
    characterDesc.className = "character-description";
    characterDesc.textContent = character.description_text;

    // Add click handler for character selection
    characterItem.addEventListener("click", () =>
      handleCharacterClick(characterItem)
    );

    characterItem.appendChild(characterName);
    characterItem.appendChild(characterDesc);
    characterListDiv.appendChild(characterItem);
  });

  console.log(
    `Character list updated: ${uniqueCharacters.length} unique characters`
  );
}
