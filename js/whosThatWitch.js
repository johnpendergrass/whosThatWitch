/**
 * Who's That Witch? - Game Logic
 * Fully configurable via JSON files
 */

let gameConfig = null;
let tileData = null;
let imageList = null;

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
    const response = await fetch("json/gameConfig.json");
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
    const response = await fetch(gameConfig.gridConfigFile);
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
    const response = await fetch(gameConfig.imageListFile);
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
  const folder = gameConfig.folderPattern.replace("{size}", size);
  const filename = gameConfig.filePattern
    .replace("{basename}", baseName)
    .replace("{size}", size);
  return `${gameConfig.assetFolder}/${folder}/${filename}`;
}

/**
 * Get random images for the grid (matching pairs with bomb tiles)
 * Creates pairs of witch images plus bomb tiles, then shuffles them
 * @param {number} count - Total number of tiles needed
 * @param {number} size - Tile size
 * @param {object} difficultyConfig - Difficulty configuration with bombTiles count
 * @returns {Array} Array of shuffled image paths
 */
function getRandomImages(count, size, difficultyConfig) {
  if (!imageList) {
    console.error("Image list not loaded yet");
    return [];
  }

  // Step 1: Calculate how many unique character images we need
  // Formula: (totalTiles - bombTiles) / 2 = pairs needed
  const bombTiles = difficultyConfig.bombTiles || 0;
  const uniqueImagesNeeded = (count - bombTiles) / 2;

  console.log(`Total tiles: ${count}, Bombs: ${bombTiles}, Unique images needed: ${uniqueImagesNeeded}`);

  // Step 2: Get all character names from the imageList object
  const characterNames = Object.keys(imageList);

  // Step 3: Shuffle character names randomly
  const shuffledCharacters = [...characterNames].sort(() => Math.random() - 0.5);

  // Step 4: Select the needed number of random characters
  const selectedCharacters = shuffledCharacters.slice(0, uniqueImagesNeeded);

  // Step 5: For each selected character, pick ONE random image from their array
  const selectedImages = selectedCharacters.map((characterName) => {
    const characterImages = imageList[characterName];
    const randomIndex = Math.floor(Math.random() * characterImages.length);
    const imageData = characterImages[randomIndex];
    return buildImagePath(imageData.filename, size);
  });

  // Step 6: Create pairs by duplicating the selected images
  const pairedImages = [...selectedImages, ...selectedImages];

  // Step 7: Add bomb tiles to the array
  const allTiles = [...pairedImages];
  for (let i = 0; i < bombTiles; i++) {
    allTiles.push(buildImagePath("_bombTile", size));
  }

  // Step 8: Shuffle all tiles randomly
  const shuffledTiles = allTiles.sort(() => Math.random() - 0.5);

  console.log(`Created ${uniqueImagesNeeded} pairs (${pairedImages.length} tiles) + ${bombTiles} bombs = ${shuffledTiles.length} total`);
  return shuffledTiles;
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

  // Find difficulty configuration to get bomb/bonus tile counts
  const difficultyConfig = gameConfig.difficulties.find(d => d.id === difficultyId);

  // Select random images for this grid (includes pairs and bombs)
  const randomImages = getRandomImages(positions.length, tileSize, difficultyConfig);

  // Draw grid lines
  drawGridLines(gridSize, tileSize, lineSize, lineColor);

  // Draw tiles
  drawTiles(positions, tileSize, randomImages);

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
    const img = document.createElement("img");
    img.className = "tile-image";
    img.src = imagePaths[index];
    img.alt = `Tile ${pos.square}`;
    img.style.left = `${pos.x}px`;
    img.style.top = `${pos.y}px`;
    img.style.width = `${tileSize}px`;
    img.style.height = `${tileSize}px`;
    board.appendChild(img);
  });
}
