/**
 * @overview This file contains the functions to ensure the intermediate between the view and the game logic.
 */

// ------------------------------------------------------------------------------------------------------------------------------ GAME

let game = undefined; // Global game instance (model)


/**
 * Initializes the game logic (model) and the game rendering (view)
 */
function initializeGame() {

    // Building the game and sending it to the view.
    let gameBuilderService = new JSONGameBuilder();
    gameBuilderService.buildFrom("/GesturesHero/assets/data/levels.json", (builtGame => {
        game = builtGame;
        refreshGame();
    }));
}

/**
 * Refreshes  the game logic (model) and the game rendering (view).
 * @returns Nothing.
 */
function refreshGame() {

    //if(!game.isFinised()){
    refreshView(game);
    //} else {
//        drawEndGamePage()
    //}
}

// ------------------------------------------------------------------------------------------------------------------------------ UTILS

/**
 * Alerts the user of a message.
 * @param {string} message A custom message.
 */
function alertUser(message) {
    alertUserView(message);
}