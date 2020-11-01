/**
 * @overview This file contains the functions for the game logic.
 */

// -----------------------------------------------------------------------------------------------------------------GAME

/**
 * @overview Represents a game.
 */
class Game {

    /**
     * Instantiates the game.
     */
    constructor() {
        this.currentLevel = undefined;
    }

    /**
     * @return {Level} The current game level.
     */
    getCurrentLevel() {
        return this.currentLevel;
    }

    /**
     * Sets the current level.
     * @param newLevel {Level} The new level.
     */
    setCurrentLevel(newLevel) {
        this.currentLevel = newLevel;
    }

    /**
     * @return {boolean} True if the game is finished (completed) ; false otherwise.
     */
    isFinished() {
        return false;
    }
}

// ----------------------------------------------------------------------------------------------------------------LEVEL

/**
 * @overview Represents a game's level.
 */
class Level {

    /**
     * Instantiates a level.
     * @param levelId {string} The level id.
     * @param levelName {string} The level name.
     * @param levelDifficulty {number} The level difficulty.
     * @param levelColor {string} The level color
     */
    constructor(levelId, levelName, levelDifficulty, levelColor) {
        this.levelId = levelId;
        this.levelName = levelName;
        this.levelDifficulty = levelDifficulty;
        this.levelColor = levelColor;
        this.succeeded = false;
    }

    /**
     * @return {string} The level id.
     */
    getLevelId() {
        return this.levelId;
    }

    /**
     * @return {string} The level name.
     */
    getLevelName() {
        return this.levelName;
    }

    /**
     * @return {number} A number representing the level difficulty.
     */
    getLevelDifficulty() {
        return this.levelDifficulty;
    }

    /**
     * @return {string} The level color.
     */
    getLevelColor() {
        return this.levelColor;
    }

    /**
     * @return {boolean} True if the level is succeeded ; false otherwise.
     */
    isSucceeded() {
        return this.succeeded;
    }
}


// -----------------------------------------------------------------------------------------------------------LEVEL SONG

/**
 * @overview Represents the level's song.
 */
class LevelSong {

    /**
     * Instantiates a level song .
     * @param songId {string} The song id.
     * @param songAuthor {string} The song author.
     * @param songTitle {string} The song title.
     * @param songUrl {string} The song URL.
     *
     */
    constructor(songId, songAuthor, songTitle, songUrl) {
        this.songId = songId;
        this.songAuthor = songAuthor;
        this.songTitle = songTitle;
        this.songUrl = songUrl;
    }

    /**
     * @return {string} The song id.
     */
    getSongIg() {
        return this.songId;
    }

    /**
     * @return {string} The song author.
     */
    getSongAuthor() {
        return this.songAuthor;
    }

    /**
     * @return {string} The song title.
     */
    getSongTitle() {
        return this.songTitle;
    }

    /**
     * @return {string} The song URL.
     */
    getSongUrl() {
        return this.songUrl;
    }
}


// ------------------------------------------------------------------------------------------------------LEVEL MILESTONE

/**
 * @overview Represents a level's milestone.
 */
class LevelMilestone {

    /**
     * Instantiates a level milestone .
     * @param levelMilestoneId The milestone id.
     * @param levelMilestoneOrder The milestone order number.
     * @param levelMilestoneTimestampStart A timestamp representing the position of the milestone in the song.
     */
    constructor(levelMilestoneId, levelMilestoneOrder, levelMilestoneTimestampStart) {
        this.levelMilestoneId = levelMilestoneId;
        this.levelMilestoneOrder = levelMilestoneOrder;
        this.levelMilestoneTimestampStart = levelMilestoneTimestampStart;
    }

    /**
     * @return {number} The level milestone id.
     */
    getLevelMilestoneId() {
        return this.levelMilestoneId;
    }

    /**
     * @return {number} The level milestone order number.
     */
    getLevelMilestoneOrder() {
        return this.levelMilestoneOrder;
    }

    /**
     * @return {number} A timestamp representing the position of the milestone in the song.
     */
    getLevelMilestoneTimestampStart() {
        return this.levelMilestoneTimestampStart;
    }
}


// --------------------------------------------------------------------------------------------------------------GESTURE

/**
 * @overview Represents an abstract gesture.
 */
class AbstractGesture {

    /**
     * Instantiates a gesture.
     * @param gestureId {string} The gesture id.
     * @param durationInSec {number} The gesture duration within the one the gesture must be recognized.
     * @param illustrationUrl {string} An URL to an illustration of the gesture (PNG, GIF, etc.).
     */
    constructor(gestureId, durationInSec, illustrationUrl) {
        this.gestureId = gestureId;
        this.durationInSec = durationInSec;
        this.illustrationUrl = illustrationUrl;
    }

    /**
     * @return {string} The gesture id.
     */
    getGestureId() {
        return this.gestureId;
    }

    /**
     * @return {number} The gesture duration within the one the gesture must be recognized.
     */
    getDurationInSec() {
        return this.durationInSec;
    }

    /**
     * @return {string} An URL to an illustration of the gesture (PNG, GIF, etc.).
     */
    getIllustrationUrl() {
        return this.illustrationUrl;
    }

    /**
     * @return {boolean} True if the gesture is recognized within the duration ; false otherwise.
     */
    isRecognized() {
        return false;
    }
}

// -------------------------------------------------------------------------------------------------------------MOVEMENT

/**
 * @overview Represents an abstract movement.
 */
class AbstractMovement {

    /**
     * Instantiates a movement.
     * @param movementId {number} The movement id.
     */
    constructor(movementId) {
        this.movementId = movementId;
    }

    /**
     * @param frame {Frame} A LeapMotion loop's frame.
     * @return {RecognitionState} A recognition state represent the progression in the recognition.
     *  - Failure : Incorrect movement or duration elapsed ;
     *  - Success : Succeeded movement ;
     *  - InProgress : Recognition in progress (towards a success or a failure) where the previous frames passed. ;
     */
    isRecognized(frame) {
        return RecognitionState.SUCCESS;
    }
}


// ----------------------------------------------------------------------------------------------------------------LEVEL

/**
 * @overview Enumerates the possible states while a movement recognition.
 */
let RecognitionState = {
    SUCCESS: 'success',
    IN_PROGRESS: 'inProgress',
    FAILURE: 'failure'
};