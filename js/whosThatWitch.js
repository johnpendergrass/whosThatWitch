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
 * Select images for a difficulty level
 * @param {Object} difficultyConfig - Difficulty configuration from gameConfig
 * @param {number} tileSize - Size of tiles for this difficulty
 * @returns {Array} Array of tile objects with imagePath and metadata, shuffled and ready to display
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
      type: 'witch'
    };
    selectedImages.push(tileData);

    console.log(`Group ${groupNum}: selected ${selectedCharacter} - ${selectedImage.filename}`);
  }

  // Create pairs (each image twice)
  for (const tileData of selectedImages) {
    tiles.push(tileData);
    tiles.push(tileData);  // Same object reference for matching
  }

  // Add bomb tiles
  const bombPath = buildImagePath("_bombTile", tileSize);
  for (let i = 0; i < bombTiles; i++) {
    tiles.push({
      imagePath: bombPath,
      type: 'bomb'
    });
  }

  // Add bonus tiles
  const bonusPath = buildImagePath("_bonusTile", tileSize);
  for (let i = 0; i < bonusTiles; i++) {
    tiles.push({
      imagePath: bonusPath,
      type: 'bonus'
    });
  }

  // Shuffle all tiles
  shuffleArray(tiles);

  console.log(`Created ${tiles.length} tiles: ${imageTiles} image tiles (${uniqueImagesNeeded} pairs) + ${bombTiles} bombs + ${bonusTiles} bonus`);

  return tiles;
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

  const witchList = document.getElementById("witch-list");
  witchList.innerHTML = "";
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
  const positions = config.squarePositions;

  // Get images for this difficulty (witch pairs + bombs + bonus)
  const tileImages = getTileImages(difficultyId, tileSize);

  // Draw grid lines
  drawGridLines(gridSize, tileSize, lineSize, lineColor);

  // Draw tiles
  drawTiles(positions, tileSize, tileImages);

  // Update witch list
  updateWitchList(tileImages);

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
function drawTiles(positions, tileSize, tileDataArray) {
  const board = document.getElementById("board");

  positions.forEach((pos, index) => {
    const tileData = tileDataArray[index];

    const img = document.createElement("img");
    img.className = "tile-image";
    img.src = tileData.imagePath;
    img.alt = `Tile ${pos.square}`;
    img.style.left = `${pos.x}px`;
    img.style.top = `${pos.y}px`;
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
 * Update the witch list display
 * Shows unique witches in the current game
 */
function updateWitchList(tileDataArray) {
  const witchListDiv = document.getElementById("witch-list");
  witchListDiv.innerHTML = "";

  // Extract unique witches (filter out bombs/bonus and duplicates)
  const uniqueWitches = [];
  const seenNames = new Set();

  for (const tileData of tileDataArray) {
    if (tileData.type === 'witch' && tileData.name_text && !seenNames.has(tileData.name_text)) {
      uniqueWitches.push(tileData);
      seenNames.add(tileData.name_text);
    }
  }

  // Create list items for each unique witch
  uniqueWitches.forEach(witch => {
    const witchItem = document.createElement("div");
    witchItem.className = "witch-item";

    const witchName = document.createElement("div");
    witchName.className = "witch-name";
    witchName.textContent = witch.name_text;

    const witchDesc = document.createElement("div");
    witchDesc.className = "witch-description";
    witchDesc.textContent = witch.description_text;

    witchItem.appendChild(witchName);
    witchItem.appendChild(witchDesc);
    witchListDiv.appendChild(witchItem);
  });

  console.log(`Witch list updated: ${uniqueWitches.length} unique witches`);
}
