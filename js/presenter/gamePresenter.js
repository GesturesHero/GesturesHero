/**
 * @overview This file contains the functions to ensure the intermediate between the view and the game logic.
 */

let game = undefined; // Global game instance (model)

// ------------------------------------------------------------------------------------------------------------------------------ VIEW -> MODEL

/**
 * Initializes the game logic (model) and the game rendering (view)
 */
function initializeGame() {

    // Building the game and sending it to the view.
    let gameBuilderService = new JSONGameBuilder();
    gameBuilderService.buildFrom("/GesturesHero/assets/data/levels.json", (builtGame => {
        game = builtGame;
        refreshGameView();
    }));
}

/**
 * Refreshes  the game logic (model) and the game rendering (view).
 * @returns Nothing.
 */
function refreshGameView() {
    refreshView(game.toJsonObject());
}

/**
 * @param levelId The level id to find.
 * @return {Object} A JavaScript object representing the level.
 */
function getLevelById(levelId) {
    return game.getLevelById(levelId).toJsonObject();
}

// ------------------------------------------------------------------------------------------------------------------------------ MODEL -> VIEW

// ------------------------------------------------------------------------------------------------------------------------------ UTILS

/**
 * Alerts the user of a message.
 * @param {string} message A custom message.
 */
function alertUser(message) {
    alertUserView(message);
}