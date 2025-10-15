/**
 * Who's That Witch? - Game Logic
 * Fully configurable via JSON files
 */

let gameConfig = null;
let tileData = null;
let imageList = null;
let groupMap = null; // Maps group IDs to character names

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

    // Build group map for efficient group-based selection
    buildGroupMap();
  } catch (error) {
    console.error("Error loading image list:", error);
  }
}

/**
 * Build a map of group IDs to character names
 * This enables efficient group-based selection where selecting one
 * character from a group automatically selects all characters in that group
 *
 * Example output: {"a": ["Elphaba", "Galinda"], "b": ["Endora", "Samantha", "Tabitha"], ...}
 */
function buildGroupMap() {
  groupMap = {};

  for (const [characterName, imagesArray] of Object.entries(imageList)) {
    // All images in a character have the same group, so read from first image
    const groupId = imagesArray[0].group;

    if (!groupMap[groupId]) {
      groupMap[groupId] = [];
    }
    groupMap[groupId].push(characterName);
  }

  // Log group map for debugging
  console.log("Group map built:");
  for (const [groupId, characters] of Object.entries(groupMap)) {
    console.log(`  Group ${groupId}: ${characters.join(", ")} (${characters.length} characters)`);
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
 * Get random images for the grid using GROUP-BASED selection
 * When a character is selected from a group, ALL characters in that group are selected
 * Creates pairs of witch images plus bomb tiles, then shuffles them
 * Ensures adjacent matching tiles meet difficulty constraints
 *
 * @param {number} count - Total number of tiles needed
 * @param {number} size - Tile size
 * @param {object} difficultyConfig - Difficulty configuration with bombTiles count
 * @returns {Array} Array of shuffled image paths
 */
function getRandomImages(count, size, difficultyConfig) {
  if (!imageList || !groupMap) {
    console.error("Image list or group map not loaded yet");
    return [];
  }

  // Step 1: Calculate how many unique character images we need
  // Formula: (totalTiles - bombTiles) / 2 = pairs needed
  const bombTiles = difficultyConfig.bombTiles || 0;
  const uniqueImagesNeeded = (count - bombTiles) / 2;

  console.log(`Total tiles: ${count}, Bombs: ${bombTiles}, Unique images needed: ${uniqueImagesNeeded}`);

  // Step 2: Select characters by group
  const selectedCharacters = selectCharactersByGroup(uniqueImagesNeeded);

  console.log(`Selected characters (${selectedCharacters.length}): ${selectedCharacters.join(", ")}`);

  // Step 3: For each selected character, pick ONE random image from their array
  const selectedImages = selectedCharacters.map((characterName) => {
    // Error checking
    if (!imageList[characterName]) {
      console.error(`ERROR: Character "${characterName}" not found in imageList!`);
      console.error(`Available characters:`, Object.keys(imageList));
      return undefined;
    }

    const characterImages = imageList[characterName];

    if (!characterImages || characterImages.length === 0) {
      console.error(`ERROR: No images found for character "${characterName}"`);
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * characterImages.length);
    const imageData = characterImages[randomIndex];

    if (!imageData || !imageData.filename) {
      console.error(`ERROR: Invalid image data for "${characterName}" at index ${randomIndex}`, imageData);
      return undefined;
    }

    const imagePath = buildImagePath(imageData.filename, size);
    console.log(`  Selected: ${characterName} → ${imageData.filename} → ${imagePath}`);
    return imagePath;
  });

  // Step 4: Create pairs by duplicating the selected images
  const pairedImages = [...selectedImages, ...selectedImages];

  // Step 5: Add bomb tiles to the array
  const allTiles = [...pairedImages];
  for (let i = 0; i < bombTiles; i++) {
    const bombPath = buildImagePath("_bombTile", size);
    console.log(`  Adding bomb tile ${i + 1}/${bombTiles}: ${bombPath}`);
    if (!bombPath) {
      console.error(`ERROR: Bomb tile path is undefined! size=${size}`);
    }
    allTiles.push(bombPath);
  }

  // Step 6: Shuffle all tiles randomly, respecting adjacency constraints
  const gridSize = tileData[difficultyConfig.id].gridSize;
  const shuffledTiles = shuffleUntilValidAdjacency(allTiles, gridSize, difficultyConfig.id);

  // Final validation - check for undefined values
  const undefinedCount = shuffledTiles.filter(tile => !tile).length;
  if (undefinedCount > 0) {
    console.error(`ERROR: ${undefinedCount} tiles have undefined paths!`);
    console.error("All tiles:", shuffledTiles);
  }

  console.log(`Created ${selectedCharacters.length} pairs (${pairedImages.length} tiles) + ${bombTiles} bombs = ${shuffledTiles.length} total`);
  return shuffledTiles;
}

/**
 * Check how many adjacent matching tiles exist in the grid
 * Counts pairs of matching tiles that are directly adjacent (up/down/left/right)
 *
 * @param {Array} tiles - 1D array of tile paths
 * @param {number} gridSize - Size of grid (3, 4, or 5)
 * @returns {number} Count of adjacent matching pairs
 */
function checkAdjacentMatches(tiles, gridSize) {
  // Convert 1D array to 2D grid for easier adjacency checking
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    grid.push(tiles.slice(i * gridSize, (i + 1) * gridSize));
  }

  let adjacentCount = 0;

  // Check horizontal adjacents (left-right)
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize - 1; col++) {
      if (grid[row][col] === grid[row][col + 1]) {
        adjacentCount++;
      }
    }
  }

  // Check vertical adjacents (up-down)
  for (let row = 0; row < gridSize - 1; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === grid[row + 1][col]) {
        adjacentCount++;
      }
    }
  }

  return adjacentCount;
}

/**
 * Shuffle tiles until adjacency constraints are met
 * EASY/MEDIUM: Max 1 adjacent matching pair
 * HARD: 0 adjacent matching pairs
 *
 * @param {Array} tiles - Array of tile paths to shuffle
 * @param {number} gridSize - Size of grid (3, 4, or 5)
 * @param {string} difficultyId - Difficulty identifier (easyTiles, mediumTiles, hardTiles)
 * @returns {Array} Shuffled tiles that meet adjacency constraints
 */
function shuffleUntilValidAdjacency(tiles, gridSize, difficultyId) {
  // Determine max allowed adjacent pairs based on difficulty
  let maxAdjacent = 0;
  if (difficultyId === 'easyTiles' || difficultyId === 'mediumTiles') {
    maxAdjacent = 1; // Allow 1 adjacent pair for easy/medium
  } else {
    maxAdjacent = 0; // Allow 0 adjacent pairs for hard
  }

  // Initial shuffle
  let shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);
  let adjacentCount = checkAdjacentMatches(shuffledTiles, gridSize);
  let attempts = 0;
  const maxAttempts = 1000; // Safety limit to prevent infinite loop

  // Keep reshuffling until constraint is met
  while (adjacentCount > maxAdjacent && attempts < maxAttempts) {
    shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);
    adjacentCount = checkAdjacentMatches(shuffledTiles, gridSize);
    attempts++;
  }

  if (attempts > 0) {
    console.log(`  Reshuffled ${attempts} times to meet adjacency constraint (${adjacentCount} adjacent pairs, max ${maxAdjacent})`);
  }

  if (attempts >= maxAttempts) {
    console.warn(`  Warning: Reached max shuffle attempts (${maxAttempts}). Final adjacency count: ${adjacentCount}`);
  }

  return shuffledTiles;
}

/**
 * Select characters by group, ensuring all characters from selected groups are included
 * This implements the group pairing logic: if Elphaba is selected, Galinda comes too
 *
 * Strategy:
 * 1. Group Z is the "singles pool" - we can pick any number from it
 * 2. All other groups (A, B, C, D, E) are "paired groups" - must be selected completely
 * 3. Select complete paired groups first
 * 4. Fill remaining slots with singles from Group Z
 *
 * @param {number} uniqueImagesNeeded - How many unique character images we need
 * @returns {Array} Array of selected character names
 */
function selectCharactersByGroup(uniqueImagesNeeded) {
  const selectedCharacters = [];

  // Group Z is the singles pool, all others are paired groups
  const SINGLES_GROUP = 'z';
  const pairedGroups = [];
  const singleCharacters = [];

  for (const [groupId, characters] of Object.entries(groupMap)) {
    if (groupId.toLowerCase() === SINGLES_GROUP) {
      // Group Z: treat each character as independent
      singleCharacters.push(...characters);
    } else {
      // Groups A, B, C, D, E: must stay together
      pairedGroups.push({ groupId, characters });
    }
  }

  console.log(`Selecting from ${pairedGroups.length} paired groups and ${singleCharacters.length} singles...`);

  // Shuffle paired groups randomly
  const shuffledPairedGroups = [...pairedGroups].sort(() => Math.random() - 0.5);

  // Add complete paired groups (NEVER break them up)
  for (const group of shuffledPairedGroups) {
    // Only add if the ENTIRE group fits
    if (selectedCharacters.length + group.characters.length <= uniqueImagesNeeded) {
      console.log(`  Adding paired group ${group.groupId}: ${group.characters.join(", ")} (${group.characters.length} chars)`);
      selectedCharacters.push(...group.characters);
    } else {
      console.log(`  Skipping paired group ${group.groupId} (would exceed limit)`);
    }
  }

  // If we still need more characters, fill with singles from Group Z
  const remainingNeeded = uniqueImagesNeeded - selectedCharacters.length;
  if (remainingNeeded > 0) {
    const shuffledSingles = [...singleCharacters].sort(() => Math.random() - 0.5);
    const selectedSingles = shuffledSingles.slice(0, remainingNeeded);
    console.log(`  Adding ${remainingNeeded} singles: ${selectedSingles.join(", ")}`);
    selectedCharacters.push(...selectedSingles);
  }

  console.log(`  Final selection: ${selectedCharacters.length} characters total`);
  return selectedCharacters;
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

  console.log(`\nDrawing ${positions.length} tiles...`);

  positions.forEach((pos, index) => {
    const imagePath = imagePaths[index];

    // Log each tile
    console.log(`  Tile ${index + 1}/${positions.length} (position ${pos.square}): ${imagePath || 'UNDEFINED!'}`);

    if (!imagePath || imagePath === 'undefined') {
      console.error(`    ✗ ERROR: Tile ${index} has invalid path!`);
    }

    const img = document.createElement("img");
    img.className = "tile-image";
    img.src = imagePath;
    img.alt = `Tile ${pos.square}`;
    img.style.left = `${pos.x}px`;
    img.style.top = `${pos.y}px`;
    img.style.width = `${tileSize}px`;
    img.style.height = `${tileSize}px`;

    // Add load/error handlers to track success
    img.addEventListener('load', () => {
      console.log(`    ✓ Loaded: Tile ${index + 1}`);
    });

    img.addEventListener('error', () => {
      console.error(`    ✗ FAILED to load: Tile ${index + 1} - ${imagePath}`);
    });

    board.appendChild(img);
  });
}
