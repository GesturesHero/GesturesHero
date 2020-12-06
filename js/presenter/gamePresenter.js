/**
 * @overview This file contains the functions to ensure the intermediate between the view, the game logic and the services.
 */

let game = undefined; // Global game instance (model)
let gestureService = undefined; // Global instance of the gesture recognizer service.
let gameBuilderService = undefined; // Global instance of the game builder service.

// ---------------------------------------------------------------------------------------------------------------- GAME

/**
 * Refreshes the game logic (model) and the game rendering (view).
 * @returns Nothing.
 */
function refreshGameView() {
    refreshView(game.toJsonObject());
}

/**
 * Initializes the game logic (model) and the game rendering (view)
 */
function initializeGame() {

    // Building the game and sending it to the view.
    gameBuilderService = new JSONGameBuilder();

    // Setting up the gesture recognizer.
    gestureService = new LeapMotionGestureService();

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
 * Resets the game.
 */
function resetGame() {
    _buildGame(() => {
        // Do nothing
    });
}

function isGameFinished() {
    return game.isFinished();
}

// --------------------------------------------------------------------------------------------------------------- LEVEL

/**
 * @return {string} The current level id.
 */
function getCurrentLevelId() {
    return game.getCurrentLevel() !== undefined ? game.getCurrentLevel().getLevelId() : undefined;
}

/**
 * @return {Object} An object representing the current level.
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
 * @param levelId {string} The level id to find.
 * @return {Object} An object representing the level.
 */
function getLevelById(levelId) {
    return game.getLevelById(levelId) !== undefined ? game.getLevelById(levelId).toJsonObject() : undefined;
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
        log.info("gamePresenter.decreaseLevelLive : Live decreased");
        _updateLevelLives(level.getLevelLives());
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

// ------------------------------------------------------------------------------------------------------------- GESTURE

/**
 * Gets the gesture illustration URL.
 * @param gestureId {string} The gesture id.
 */
function getGestureIllustrationUrl(gestureId) {
    return gestureService.getGestureIllustrationUrl(gestureId);
}

/**
 * Gets the gesture duration.
 * @param gestureId {string} The gesture id.
 */
function getGestureDuration(gestureId) {
    return gestureService.getGestureDuration(gestureId);
}

/**
 * Checks a gesture now.
 * @param gestureId {string} The id of the gesture to recognize.
 * @param callback {function} The callback to call on end of the recognition.
 */
function checkGestureNow(gestureId, callback) {
    gestureService.recognize(gestureId, callback);
}

// --------------------------------------------------------------------------------- 3D SCENE (HANDS REAL TIME FEEDBACK)

/**
 * Sets the color of the hands that are shown in real time.
 * @param color {String} A hexadecimal color code.
 */
function setHandsColor(color) {
    gestureService.setHandsColor(color);
}

// --------------------------------------------------------------------------------------------------------------- UTILS

/**
 * Alerts the user of a message.
 * @param {string} message A custom message.
 */
function alertUser(message) {
    alertUserView(message);
}