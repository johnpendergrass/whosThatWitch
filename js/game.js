/**
 * Who's That Witch? - Square Position Editor
 * Drag and drop squares to position them, then save positions
 */

// Global state
let squares = [];
let draggedSquare = null;
let dragOffset = { x: 0, y: 0 };

// 16 random witch images from assets/70sized folder
const witchImages = [
    'assets/70sized/Samantha(Bewitched)04_70.png',
    'assets/70sized/Jadis_The_White_Witch(Narnia)01_70.png',
    'assets/70sized/Salem(Sabrina_The_Teenage_Witch)01_70.png',
    'assets/70sized/Samantha(Bewitched)03_70.png',
    'assets/70sized/Kiki(Kiki\'s_Delivery_Service)01_70.png',
    'assets/70sized/Salem(Sabrina_The_Teenage_Witch)03_70.png',
    'assets/70sized/Elphaba(Wicked!)01_70.png',
    'assets/70sized/Samantha(Bewitched)02_70.png',
    'assets/70sized/Glinda(Wizard_of_Oz)03_70.png',
    'assets/70sized/Glinda(Broadway_Oz)03_70.png',
    'assets/70sized/Endora(Bewitched)02_70.png',
    'assets/70sized/Kiki(Kiki\'s_Delivery_Service)03_70.png',
    'assets/70sized/Willow(Buffy_the_Vampire_Slayer)02_70.png',
    'assets/70sized/Jadis_The_White_Witch(Narnia)03_70.png',
    'assets/70sized/Melisandre(Game_of_Thrones)03_70.png',
    'assets/70sized/Morticia(The_Addams_Family)01_70.png'
];

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Who\'s That Witch? - Position Editor loaded');
    initGame();
});

/**
 * Load square positions from JSON file
 */
async function loadSquarePositions() {
    try {
        const response = await fetch('squarePositions/squarePositions01.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const positions = await response.json();
        console.log('Loaded positions from file:', positions.length, 'squares');
        return positions;
    } catch (error) {
        console.error('Error loading positions:', error);
        return null;
    }
}

/**
 * Initialize the game
 */
async function initGame() {
    const gameContainer = document.getElementById('game');

    // Verify game container exists and has correct dimensions
    if (gameContainer) {
        const width = gameContainer.offsetWidth;
        const height = gameContainer.offsetHeight;
        console.log(`Game container dimensions: ${width} x ${height}`);

        if (width === 950 && height === 714) {
            console.log('Game container dimensions are correct!');
        } else {
            console.warn(`Expected 950x714, got ${width}x${height}`);
        }
    } else {
        console.error('Game container not found!');
    }

    // Load positions and create draggable squares
    const positions = await loadSquarePositions();
    createDraggableSquares(positions);

    // Setup save button
    setupSaveButton();
}

/**
 * Create 16 draggable 70x70 squares on the left side of the board
 * Board position: left=370, top=134, width=540, height=540
 * Available area: x: 0-340, y: 140-650 (below board top, left of board)
 * @param {Array} positions - Optional array of saved positions to use
 */
function createDraggableSquares(positions = null) {
    const gameContainer = document.getElementById('game');

    // Determine if we're using saved positions or generating random ones
    const useLoadedPositions = positions && positions.length === 16;

    if (useLoadedPositions) {
        console.log('Using loaded positions from file');
    } else {
        console.log('Generating random positions');
    }

    // Board is at left=370, top=134
    // Available area for squares: x: 10-330, y: 140-644
    const minX = 10;
    const maxX = 330;
    const minY = 140;
    const maxY = 644;

    // Create 16 squares
    for (let i = 0; i < 16; i++) {
        let x, y, rotation;

        if (useLoadedPositions) {
            // Use loaded position
            const pos = positions.find(p => p.id === i);
            x = pos.x;
            y = pos.y;
            rotation = pos.rotation;
        } else {
            // Random initial position
            x = Math.random() * (maxX - minX) + minX;
            y = Math.random() * (maxY - minY) + minY;
            // Random rotation (-45 to +45 degrees)
            rotation = Math.floor(Math.random() * 90 - 45);
        }

        // Create square element
        const square = document.createElement('div');
        square.className = 'random-square';
        square.dataset.id = i;
        square.dataset.rotation = rotation;

        // Create and add image element
        const img = document.createElement('img');
        img.src = witchImages[i];
        img.alt = `Witch ${i}`;
        img.style.width = '70px';
        img.style.height = '70px';
        img.style.display = 'block';
        img.style.pointerEvents = 'none'; // Let clicks pass through to parent div
        square.appendChild(img);

        square.style.left = `${x}px`;
        square.style.top = `${y}px`;
        square.style.transform = `rotate(${rotation}deg)`;

        // Add drag event listeners
        square.addEventListener('mousedown', startDrag);

        gameContainer.appendChild(square);

        // Store square data
        squares.push({
            id: i,
            element: square,
            x: x,
            y: y,
            rotation: rotation
        });

        console.log(`Square ${i}: pos (${Math.round(x)}, ${Math.round(y)}), rotation ${rotation}°`);
    }

    // Add global mouse event listeners
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    console.log('Created 16 draggable squares');
}

/**
 * Start dragging a square
 */
function startDrag(e) {
    e.preventDefault();
    // If clicking on the image, get the parent div
    draggedSquare = e.target.classList.contains('random-square') ? e.target : e.target.parentElement;
    draggedSquare.classList.add('dragging');

    // Calculate offset from mouse to square top-left
    const rect = draggedSquare.getBoundingClientRect();
    const gameRect = document.getElementById('game').getBoundingClientRect();

    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    console.log(`Started dragging square ${draggedSquare.dataset.id}`);
}

/**
 * Drag the square
 */
function drag(e) {
    if (!draggedSquare) return;

    e.preventDefault();

    const gameContainer = document.getElementById('game');
    const gameRect = gameContainer.getBoundingClientRect();

    // Calculate new position relative to game container
    let newX = e.clientX - gameRect.left - dragOffset.x;
    let newY = e.clientY - gameRect.top - dragOffset.y;

    // Constrain to game area (with some margin)
    newX = Math.max(0, Math.min(newX, 950 - 70));
    newY = Math.max(0, Math.min(newY, 714 - 70));

    draggedSquare.style.left = `${newX}px`;
    draggedSquare.style.top = `${newY}px`;

    // Update stored position
    const squareId = parseInt(draggedSquare.dataset.id);
    squares[squareId].x = newX;
    squares[squareId].y = newY;
}

/**
 * End dragging
 */
function endDrag(e) {
    if (!draggedSquare) return;

    draggedSquare.classList.remove('dragging');
    const squareId = draggedSquare.dataset.id;
    const x = Math.round(squares[squareId].x);
    const y = Math.round(squares[squareId].y);

    console.log(`Dropped square ${squareId} at (${x}, ${y})`);

    draggedSquare = null;
}

/**
 * Setup save button
 */
function setupSaveButton() {
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', savePositions);
}

/**
 * Save all square positions to console and download as JSON
 */
function savePositions() {
    const positionsData = squares.map(sq => ({
        id: sq.id,
        x: Math.round(sq.x),
        y: Math.round(sq.y),
        rotation: sq.rotation
    }));

    // Output to console
    console.log('=== SQUARE POSITIONS ===');
    console.log(JSON.stringify(positionsData, null, 2));
    console.log('========================');

    // Create downloadable JSON file
    const dataStr = JSON.stringify(positionsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'square-positions.json';
    link.click();

    console.log('Positions saved! Check console and downloaded file.');
    alert('Positions saved! Check console for data and downloaded JSON file.');
}
