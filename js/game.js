/**
 * Who's That Witch? - Game Logic
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Who\'s That Witch? - Game loaded');
    initGame();
});

/**
 * Initialize the game
 */
function initGame() {
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

    // Game initialization will go here
}
