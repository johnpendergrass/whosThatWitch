/**
 * Who's That Witch? - Game Logic
 * Fully configurable via JSON files
 */

let gameConfig = null;
let tileData = null;
let imageList = null;
let groupedWitches = null;  // Images organized by group number

// Configuration file paths (easy to find and change)
const gameConfigFile = "json/gameConfig.json";
const tileSizesFile = "json/tileSizes.json";
const witchesFile = "json/witches.json";

// Grid square positions (left to right, top to bottom)
// Each position has: num (square index), row, col
const EASY_SQUARES = [
  {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1},
  {num: 2, row: 0, col: 2}, {num: 3, row: 1, col: 0},
  {num: 4, row: 1, col: 1}, {num: 5, row: 1, col: 2},
  {num: 6, row: 2, col: 0}, {num: 7, row: 2, col: 1},
  {num: 8, row: 2, col: 2}
];

const MEDIUM_SQUARES = [
  {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1},
  {num: 2, row: 0, col: 2}, {num: 3, row: 0, col: 3},
  {num: 4, row: 1, col: 0}, {num: 5, row: 1, col: 1},
  {num: 6, row: 1, col: 2}, {num: 7, row: 1, col: 3},
  {num: 8, row: 2, col: 0}, {num: 9, row: 2, col: 1},
  {num: 10, row: 2, col: 2}, {num: 11, row: 2, col: 3},
  {num: 12, row: 3, col: 0}, {num: 13, row: 3, col: 1},
  {num: 14, row: 3, col: 2}, {num: 15, row: 3, col: 3}
];

const HARD_SQUARES = [
  {num: 0, row: 0, col: 0}, {num: 1, row: 0, col: 1},
  {num: 2, row: 0, col: 2}, {num: 3, row: 0, col: 3},
  {num: 4, row: 0, col: 4}, {num: 5, row: 1, col: 0},
  {num: 6, row: 1, col: 1}, {num: 7, row: 1, col: 2},
  {num: 8, row: 1, col: 3}, {num: 9, row: 1, col: 4},
  {num: 10, row: 2, col: 0}, {num: 11, row: 2, col: 1},
  {num: 12, row: 2, col: 2}, {num: 13, row: 2, col: 3},
  {num: 14, row: 2, col: 4}, {num: 15, row: 3, col: 0},
  {num: 16, row: 3, col: 1}, {num: 17, row: 3, col: 2},
  {num: 18, row: 3, col: 3}, {num: 19, row: 3, col: 4},
  {num: 20, row: 4, col: 0}, {num: 21, row: 4, col: 1},
  {num: 22, row: 4, col: 2}, {num: 23, row: 4, col: 3},
  {num: 24, row: 4, col: 4}
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
function getAvailablePositions(allPositions, filledPositions, excludeAdjacentTo = []) {
  return allPositions.filter(pos => {
    // Skip if already filled
    if (filledPositions.some(fp => fp.num === pos.num)) {
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
  switch(difficultyId) {
    case 'easyTiles': return EASY_SQUARES;
    case 'mediumTiles': return MEDIUM_SQUARES;
    case 'hardTiles': return HARD_SQUARES;
    default: return MEDIUM_SQUARES;
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

  // Get all available group numbers
  const allGroups = Object.keys(groupedWitches).map(Number);

  // Randomly select groups
  const selectedGroups = [];
  const availableGroups = [...allGroups];
  for (let i = 0; i < uniqueImagesNeeded; i++) {
    if (availableGroups.length === 0) break;
    const randomIndex = Math.floor(Math.random() * availableGroups.length);
    selectedGroups.push(availableGroups[randomIndex]);
    availableGroups.splice(randomIndex, 1);
  }

  console.log(`Selected ${selectedGroups.length} groups:`, selectedGroups);

  // For each selected group, pick one character and one image
  const selectedImages = [];
  for (const groupNum of selectedGroups) {
    const charactersInGroup = groupedWitches[groupNum];
    const characterNames = Object.keys(charactersInGroup);

    // Randomly select one character from this group
    const selectedCharacter = getRandomFromArray(characterNames);
    const characterImages = charactersInGroup[selectedCharacter];

    // Randomly select one image from this character
    const selectedImage = getRandomFromArray(characterImages);

    // Build the image path
    const imagePath = buildImagePath(selectedImage.filename, tileSize);

    // Store full tile data with metadata
    const tileData = {
      imagePath: imagePath,
      name_text: selectedImage.name_text,
      description_text: selectedImage.description_text,
      type: 'gameTile',
      pairId: groupNum  // Unique identifier for matching pairs
    };
    selectedImages.push(tileData);

    console.log(`Group ${groupNum}: selected ${selectedCharacter} - ${selectedImage.filename}`);
  }

  // Create pairs (each image twice)
  for (const tileData of selectedImages) {
    tiles.push(tileData);
    tiles.push(tileData);  // Same object reference for matching
  }

  // Build separate arrays for bombs
  const bombPath = buildImagePath("_bombTile", tileSize);
  const bombArray = [];
  for (let i = 0; i < bombTiles; i++) {
    bombArray.push({
      imagePath: bombPath,
      type: 'bomb'
    });
  }

  // Build separate array for bonus tiles
  const bonusPath = buildImagePath("_bonusTile", tileSize);
  const bonusArray = [];
  for (let i = 0; i < bonusTiles; i++) {
    bonusArray.push({
      imagePath: bonusPath,
      type: 'bonus'
    });
  }

  console.log(`Created tiles organized by type: ${imageTiles} gameTiles (${uniqueImagesNeeded} pairs) + ${bombTiles} bombs + ${bonusTiles} bonus`);

  // Return organized by type (no shuffle yet - will be done during placement)
  return {
    gameTiles: tiles,
    bombs: bombArray,
    bonus: bonusArray
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
    const available = getAvailablePositions(squares, filledSquares, excludeAdjacent);

    if (available.length === 0) {
      console.warn("No available positions for special tile! Using any unfilled position.");
      const unfilled = squares.filter(s => !filledSquares.some(f => f.num === s.num));
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

    console.log(`Placed ${specialTile.type} at position ${selectedSquare.num} (row ${selectedSquare.row}, col ${selectedSquare.col})`);
  }

  // Step 2: Place gameTiles with adjacency constraints for matching pairs
  const maxAttempts = 100;
  let placementSuccessful = false;

  // Get unique pairIds
  const uniquePairIds = [...new Set(tilesByType.gameTiles.map(t => t.pairId))];
  console.log(`Attempting to place ${uniquePairIds.length} pairs with adjacency constraints...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Reset gameTile placements (keep special tiles)
    for (let i = 0; i < result.length; i++) {
      if (result[i] && result[i].type === 'gameTile') {
        result[i] = null;
      }
    }

    // Reset filled squares to only special tiles
    const gameTileFilledSquares = [];
    let attemptFailed = false;

    // Try to place each pair
    for (const pairId of uniquePairIds) {
      // Get both tiles with this pairId
      const tilesWithPairId = tilesByType.gameTiles.filter(t => t.pairId === pairId);

      if (tilesWithPairId.length !== 2) {
        console.error(`Expected 2 tiles with pairId ${pairId}, found ${tilesWithPairId.length}`);
        continue;
      }

      // Get available positions (not filled by special tiles or other gameTiles this attempt)
      const availableForFirst = squares.filter(s =>
        !filledSquares.some(f => f.num === s.num) &&
        !gameTileFilledSquares.some(f => f.num === s.num)
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
      const availableForSecond = squares.filter(s =>
        !filledSquares.some(f => f.num === s.num) &&
        !gameTileFilledSquares.some(f => f.num === s.num) &&
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
      console.log(`Successfully placed all pairs with adjacency constraints on attempt ${attempt}`);
      break;
    }
  }

  // If we failed after max attempts, place remaining pairs randomly (accept adjacency)
  if (!placementSuccessful) {
    console.warn(`Could not place all pairs non-adjacently after ${maxAttempts} attempts. Placing remaining randomly.`);

    // Clear any partially placed gameTiles from the failed 100th attempt
    for (let i = 0; i < result.length; i++) {
      if (result[i] && result[i].type === 'gameTile') {
        result[i] = null;
      }
    }

    // DIAGNOSTIC: Check state before fallback placement
    console.log(`FALLBACK DIAGNOSTICS:`);
    console.log(`  Total squares: ${squares.length}`);
    console.log(`  filledSquares (special tiles): ${filledSquares.length}`, filledSquares.map(s => s.num));
    console.log(`  gameTiles to place: ${tilesByType.gameTiles.length}`);

    // Count nulls in result after clearing (should equal gameTiles to place)
    const nullsBefore = result.filter(r => r === null).length;
    console.log(`  Null positions in result after clearing: ${nullsBefore}`);

    // Get remaining empty squares (not filled by special tiles)
    const remainingSquares = squares.filter(s =>
      !filledSquares.some(f => f.num === s.num)
    );
    console.log(`  remainingSquares: ${remainingSquares.length}`, remainingSquares.map(s => s.num));

    // Since we cleared all gameTiles at start of last failed attempt, place all of them
    const shuffledTiles = shuffleArray([...tilesByType.gameTiles]);
    const shuffledSquares = shuffleArray([...remainingSquares]);

    console.log(`  shuffledTiles: ${shuffledTiles.length}`);
    console.log(`  shuffledSquares: ${shuffledSquares.length}`, shuffledSquares.map(s => s.num));

    for (let i = 0; i < shuffledTiles.length && i < shuffledSquares.length; i++) {
      result[shuffledSquares[i].num] = shuffledTiles[i];
      console.log(`    Placed tile at square ${shuffledSquares[i].num} (pairId: ${shuffledTiles[i].pairId})`);
    }

    // Count nulls after placement
    const nullsAfter = result.filter(r => r === null).length;
    console.log(`  Null positions in result after: ${nullsAfter}`);
    console.log(`  Placed ${shuffledTiles.length} gameTiles randomly (adjacency accepted)`);
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
  const difficultyConfig = gameConfig.difficulties.find(d => d.id === difficultyId);

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

  const config = tileData[difficultyId];
  const gridSize = config.gridSize;
  const tileSize = config.tileSize;
  const lineSize = config.lineSize;
  const lineColor = config.lineColor;

  // Get tiles organized by type
  const tilesByType = getTileImages(difficultyId, tileSize);

  // Get squares for adjacency logic (single source of truth)
  const squares = getSquaresForDifficulty(difficultyId);

  // Assign tiles to positions with adjacency constraints
  const positionToTileMap = assignTilesToPositions(tilesByType, squares);

  // Draw grid lines
  drawGridLines(gridSize, tileSize, lineSize, lineColor);

  // Draw tiles using squares (calculate x/y from row/col)
  drawTiles(squares, tileSize, lineSize, positionToTileMap);

  // Update character list (extract all tiles from map)
  const allTiles = positionToTileMap.filter(t => t !== null);
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
 * Draw tiles with images
 * @param {Array} squares - Grid squares with {num, row, col}
 * @param {number} tileSize - Size of tiles
 * @param {number} lineSize - Size of grid lines
 * @param {Array} positionToTileMap - Array mapping square number to tile object
 */
function drawTiles(squares, tileSize, lineSize, positionToTileMap) {
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

    const img = document.createElement("img");
    img.className = "tile-image";
    img.src = tileData.imagePath;
    img.alt = `Tile ${square.num}`;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.width = `${tileSize}px`;
    img.style.height = `${tileSize}px`;

    // Store metadata on the img element for future use
    img.dataset.type = tileData.type;
    if (tileData.name_text) {
      img.dataset.nameText = tileData.name_text;
    }
    if (tileData.description_text) {
      img.dataset.descriptionText = tileData.description_text;
    }

    board.appendChild(img);
  });
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

  for (const tileData of tileDataArray) {
    if (tileData.type === 'gameTile' && tileData.name_text && !seenNames.has(tileData.name_text)) {
      uniqueCharacters.push(tileData);
      seenNames.add(tileData.name_text);
    }
  }

  // Create list items for each unique character
  uniqueCharacters.forEach(character => {
    const characterItem = document.createElement("div");
    characterItem.className = "character-item";

    const characterName = document.createElement("div");
    characterName.className = "character-name";
    characterName.textContent = character.name_text;

    const characterDesc = document.createElement("div");
    characterDesc.className = "character-description";
    characterDesc.textContent = character.description_text;

    characterItem.appendChild(characterName);
    characterItem.appendChild(characterDesc);
    characterListDiv.appendChild(characterItem);
  });

  console.log(`Character list updated: ${uniqueCharacters.length} unique characters`);
}
