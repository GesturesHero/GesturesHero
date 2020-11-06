/**
 * @overview This file contains the functions to ensure the intermediate between the view and the game logic.
 */

let game = undefined; // Global game instance (model)
let gestureRecognizer = undefined; // Global instance of the gesture recognizer.

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

    // Setting up the gesture recognizer.
    gestureRecognizer = new GestureRecognizerLeapMotion();
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
    return game.getCurrentLevel().getLevelId();
}

/**
 * @return {Object} A JavaScript object representing the current level.
 */
function getCurrentLevel() {
    return game.toJsonObject().currentLevel;
}

/**
 * @return {[Object]} A list of objects representing the levels.
 */
function getLevels() {
    return game.toJsonObject().levels;
}

/**
 * @param levelId The level id to find.
 * @return {Object} A JavaScript object representing the level.
 */
function getLevelById(levelId) {
    return game.getLevelById(levelId).toJsonObject();
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
    return game.getLevelById(levelId).getLevelLives();
}

/**
 * Decreases the amount of remaining lives.
 * @param levelId {string} The level id.
 * @param step {number} The step of the decreasing.
 */
function decreaseLevelLive(levelId, step = 1) {
    game.getLevelById(levelId).decreaseLives(step);
    updateLevelLive(game.getLevelById(levelId).getLevelLives());
}

/**
 * Resumes the amount of lives.
 * @param levelId {string} The level id.
 */
function resetLevelLives(levelId) {
    game.getLevelById(levelId).setLevelLives(LEVEL_LIVES_AMOUNT);
}

/**
 * Set to the next level.
 */
function setNextLevel() {
    game.setToNextLevel();
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