/**
 * @overview This file contains the functions to ensure the intermediate between the view and the game logic.
 */

let game = undefined; // Global game instance (model)
let gestureRecognizer = undefined; // Global instance of the gesture recognizer service.
let gameBuilderService = undefined; // Global instance of the game builder service.
// ------------------------------------------------------------------------------------------------------------------------------ VIEW -> MODEL

/**
 * Initializes the game logic (model) and the game rendering (view)
 */
function initializeGame() {

    // Building the game and sending it to the view.
    gameBuilderService = new JSONGameBuilder();

    // Setting up the gesture recognizer.
    gestureRecognizer = new GestureRecognizerLeapMotion();

    // Builds the game
    _buildGame((game) => {
        refreshGameView();
    });

}

/**
 * Builds the game from a representation file.
 */
function _buildGame(callback) {
    gameBuilderService.buildFrom("/assets/data/levels.json", (builtGame => {
        game = builtGame;
        callback(game);
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
 * @return {string} The current level id.
 */
function getCurrentLevelId() {
    return game.getCurrentLevel() !== undefined ? game.getCurrentLevel().getLevelId() : undefined;
}

/**
 * @return {Object} A JavaScript object representing the current level.
 */
function getCurrentLevel() {
    return game.getCurrentLevel() !== undefined ? game.toJsonObject().currentLevel : undefined;
}

/**
 * @return {[Object]} A list of objects representing the levels.
 */
function getLevels() {
    return game.getLevels() !== undefined ? game.toJsonObject().levels : [];
}

/**
 * @param levelId The level id to find.
 * @return {Object} A JavaScript object representing the level.
 */
function getLevelById(levelId) {
    return game.getLevelById(levelId) !== undefined ? game.getLevelById(levelId).toJsonObject() : undefined;
}

/**
 * Checks a gesture now.
 * @param gestureId {string} The id of the gesture to recognize.
 * @param callback {function} The callback to call on end of the recognition.
 */
function checkGestureNow(gestureId, callback) {
    gestureRecognizer.recognize(gestureId, callback);
}

/**
 * @param levelId {string} The level id.
 * @return {number} The amount of remaining lives to the level.
 */
function getLevelLive(levelId) {
    return game.getLevelById(levelId) !== undefined ? game.getLevelById(levelId).getLevelLives() : undefined;
}

/**
 * Decreases the amount of remaining lives.
 * @param levelId {string} The level id.
 * @param step {number} The step of the decreasing.
 */
function decreaseLevelLive(levelId, step = 1) {
    let level = game.getLevelById(levelId);
    if (level !== undefined) {
        level.decreaseLives(step);
        updateLevelLive(level.getLevelLives());
    }
}

/**
 * Resumes the amount of lives.
 * @param levelId {string} The level id.
 */
function resetLevelLives(levelId) {
    let level = game.getLevelById(levelId);
    if (level !== undefined) {
        level.setLevelLives(LEVEL_LIVES_AMOUNT);
    }
}

/**
 * Set to the next level.
 */
function setNextLevel() {
    game.setToNextLevel();
}

/**
 * Resets the game.
 */
function resetGame() {
    _buildGame(() => {
        // Do nothing
    });
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