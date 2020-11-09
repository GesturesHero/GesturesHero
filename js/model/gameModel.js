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
     * @param levels {[Level]} The levels for the game.
     */
    constructor(levels = []) {
        this.levels = levels.sort((levelA, levelB) => levelA.levelIndexOrder > levelB.levelIndexOrder ? 1 : -1);
        if (levels !== undefined && levels.length !== 0) {
            this.currentLevel = levels[0];
        } else {
            this.currentLevel = undefined;
        }
    }

    /**
     * @return {Level[]} A list of levels.
     */
    getLevels() {
        return this.levels;
    }

    /**
     * @param levelId {string} A level id.
     * @return {Level} The level corresponding to the given id.
     */
    getLevelById(levelId) {
        return this.levels.find(level => level.getLevelId() === levelId);
    }

    /**
     * @return {Level} The current game level.
     */
    getCurrentLevel() {
        return this.currentLevel;
    }

    /**
     * Sets the current level to the next level.
     */
    setToNextLevel() {
        let nextLevel = this.levels.find(level => level.getLevelIndexOrder() > this.currentLevel.getLevelIndexOrder());
        this._setCurrentLevel(nextLevel);
    }

    /**
     * Sets the current level.
     * @param newLevel {Level} The new level.
     */
    _setCurrentLevel(newLevel) {
        this.currentLevel = newLevel;
    }

    /**
     * @return {boolean} True if the game is finished (completed) ; false otherwise.
     */
    isFinished() {
        return false;
    }

    /**
     * @return {Object} A JavaScript object representing the model object (without his methods).
     * NOTE : It keeps the separation of concerns. The layers that are not allowed to set the object state will
     * receive only this data representation (without the methods to interact with).
     */
    toJsonObject() {
        let levelsToJson = [];
        if (this.getLevels() !== undefined) {
            this.getLevels().forEach(level => levelsToJson.push(level.toJsonObject()));
        }
        return {
            "currentLevel": this.getCurrentLevel() !== undefined ? this.getCurrentLevel().toJsonObject() : undefined,
            "levels": levelsToJson
        };
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
     * @param levelIndexOrder {number} The level index order.
     * @param levelDifficulty {number} The level difficulty.
     * @param levelColor {string} The level color.
     * @param levelSong {LevelSong} The level song.
     * @param levelMilestones {[LevelMilestone]} The level milestones.
     */
    constructor(levelId, levelName, levelIndexOrder, levelDifficulty, levelColor, levelSong, levelMilestones) {
        this.levelId = levelId;
        this.levelName = levelName;
        this.levelIndexOrder = levelIndexOrder;
        this.levelDifficulty = levelDifficulty;
        this.levelColor = levelColor;
        this.levelSong = levelSong;
        this.levelMilestones = levelMilestones;
        this.succeeded = false;
        this.levelLives = LEVEL_LIVES_AMOUNT; // The amount of lives remaining.
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
     * @return {number} The level index order.
     */
    getLevelIndexOrder() {
        return this.levelIndexOrder;
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
     * @return {LevelSong} The level song.
     */
    getLevelSong() {
        return this.levelSong;
    }

    /**
     * @return {[LevelMilestone]} A list of level milestones.
     */
    getLevelMilestones() {
        return this.levelMilestones;
    }

    /**
     * @return {boolean} True if the level is succeeded ; false otherwise.
     */
    isSucceeded() {
        return this.succeeded;
    }

    /**
     * @return {number} The amount of lives remaining.
     */
    getLevelLives() {
        return this.levelLives;
    }

    /**
     * Sets the amount of remaining lives.
     */
    setLevelLives(newAmountOfLives) {
        this.levelLives = newAmountOfLives;
    }

    /**
     * Decreases the amount of remaining lives.
     * @param step {number} The step of the decreasing.
     */
    decreaseLives(step = 1) {
        this.levelLives -= step;
    }

    /**
     * @return {Object} A JavaScript object representing the model object (without his methods).
     */
    toJsonObject() {
        let levelMilestonesToJson = [];
        this.getLevelMilestones().forEach(levelMilestone => levelMilestonesToJson.push(levelMilestone.toJsonObject()));
        return {
            "levelId": this.getLevelId(),
            "levelName": this.getLevelName(),
            "levelIndexOrder": this.getLevelIndexOrder(),
            "levelDifficulty": this.getLevelDifficulty(),
            "levelColor": this.getLevelColor(),
            "levelSong": this.getLevelSong() !== undefined ? this.getLevelSong().toJsonObject() : undefined,
            "levelMilestones": levelMilestonesToJson,
            "succeeded": this.isSucceeded(),
            "levelLives": this.getLevelLives()
        };
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

    /**
     * @return {Object} A JavaScript object representing the model object (without his methods).
     */
    toJsonObject() {
        return {
            "songId": this.getSongIg(),
            "songAuthor": this.getSongAuthor(),
            "songTitle": this.getSongTitle(),
            "songUrl": this.getSongUrl()
        };
    }
}


// ------------------------------------------------------------------------------------------------------LEVEL MILESTONE

/**
 * @overview Represents a level's milestone.
 */
class LevelMilestone {

    /**
     * Instantiates a level milestone .
     * @param levelMilestoneId {number} The milestone id.
     * @param gestureId {string} The milestone id.
     * @param levelMilestoneIndexOrder {number} The milestone order number.
     * @param levelMilestoneTimestampStart {number} A timestamp representing the position of the milestone in the song.
     */
    constructor(levelMilestoneId, gestureId, levelMilestoneIndexOrder, levelMilestoneTimestampStart) {
        this.levelMilestoneId = levelMilestoneId;
        this.gestureId = gestureId;
        this.levelMilestoneIndexOrder = levelMilestoneIndexOrder;
        this.levelMilestoneTimestampStart = levelMilestoneTimestampStart;
    }

    /**
     * @return {number} The level milestone id.
     */
    getLevelMilestoneId() {
        return this.levelMilestoneId;
    }

    /**
     * @return {string} The gesture id.
     */
    getGestureId() {
        return this.gestureId;
    }

    /**
     * @return {number} The level milestone index order number.
     */
    getLevelMilestoneIndexOrder() {
        return this.levelMilestoneIndexOrder;
    }

    /**
     * @return {number} A timestamp representing the position of the milestone in the song.
     */
    getLevelMilestoneTimestampStart() {
        return this.levelMilestoneTimestampStart;
    }

    /**
     * @return {Object} A JavaScript object representing the model object (without his methods).
     */
    toJsonObject() {
        return {
            "levelMilestoneId": this.getLevelMilestoneId(),
            "gestureId": this.getGestureId(),
            "levelMilestoneIndexOrder": this.getLevelMilestoneIndexOrder(),
            "levelMilestoneTimestampStart": this.getLevelMilestoneTimestampStart()
        };
    }
}


// --------------------------------------------------------------------------------------------------------------GESTURE

/**
 * @overview Represents an abstract gesture.
 */
class Gesture {

    /**
     * Instantiates a gesture.
     * @param gestureId {string} The gesture id.
     * @param durationInSec {number} The gesture duration within the one the gesture must be recognized.
     * @param illustrationUrl {string} An URL to an illustration of the gesture (PNG, GIF, etc.).
     * @param gestureParts {[GesturePart]} The gesture parts that compose the gesture.
     */
    constructor(gestureId, durationInSec, illustrationUrl, gestureParts) {
        this.gestureId = gestureId;
        this.durationInSec = durationInSec;
        this.illustrationUrl = illustrationUrl;
        this.gestureParts = gestureParts;
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
     * @return {GesturePart[]} The list of gesture parts that composed the gesture.
     */
    getGestureParts() {
        return this.gestureParts;
    }

    /**
     * @return nothing
     */
    check(){
    }

    /**
     * @return {boolean} True if the gesture is recognized within the duration ; false otherwise.
     */
    isRecognized() {
    }
}

class GestureHammerLeapMotion extends Gesture {

    /**
     * 
     */
    check(frame){
        console.log(frame);
    }

    /**
     * @override
     */
    isRecognized() {
        return true;
    }
}

class GestureRotationLeapMotion extends Gesture {

    /**
     * @override
     */
    isRecognized() {
        return true;
    }
}

// -------------------------------------------------------------------------------------------------------------MOVEMENT

/**
 * @overview Represents an abstract gesture part (a static position or a dynamic movement).
 */
class GesturePart {

    /**
     * Instantiates a gesture part.
     * @param gesturePartId {number} The gesture part id.
     */
    constructor(gesturePartId) {
        this.gesturePartId = gesturePartId;
    }

    /**
     * @return {number} The gesture part id.
     */
    getGesturePartId() {
        return this.gesturePartId;
    }

    /**
     * @param frame {Frame} A LeapMotion loop's frame.
     * @return {RecognitionState} A recognition state represent the progression in the recognition.
     *  - Failure : Incorrect gesture part or duration elapsed ;
     *  - Success : Succeeded gesture part ;
     *  - InProgress : Recognition in progress (towards a success or a failure) where the previous frames passed. ;
     */
    isRecognized(frame) {
    }
}

class GesturePartRotationLeapMotion extends GesturePart {

    /**
     * @override
     */
    constructor(gesturePartId) {
        super(gesturePartId);
        this.firstFrame = true;
        this.timeout = 0;
        this.previousNormals = [0, 0];
    }

    /**
     * @override
     */
    isRecognized(frame) {
        if (frame.hands.length !== 2) {
            return RecognitionState.FAILURE;
        }

        if (this.firstFrame) {
            this.firstFrame = false;
            if (!this.isRecognizedStart(frame)) {
                return RecognitionState.FAILURE;
            }
        }

        if (frame.timestamp < this.timeout) {
            return this.isRecognizedFrame(frame);
        } else {
            return this.isRecognizedEnd(frame);
        }
    }

    isRecognizedStart(frame) {
        this.timeout = frame.timestamp + 1000000;
        
        for (const [i, hand] of frame.hands.entries()) {
            const normal = hand.palmNormal[1];
            if (normal > -0.9) {
                return false;
            }

            this.previousNormals[i] = normal;
        }

        return true;
    }

    isRecognizedFrame(frame) {
        for (const [i, hand] of frame.hands.entries()) {
            const [_, normalY, normalZ] = hand.palmNormal;

            // Normal
            if (normalY < this.previousNormals[i] - 0.1) {
                return RecognitionState.FAILURE;
            }

            this.previousNormals[i] = Math.max(normalY, this.previousNormals[i]);
            
            if (normalZ < -0.3 || normalZ > 0.3) {
                return RecognitionState.FAILURE;
            }

            // Grab
            if (hand.grabStrength !== 0) {
                return RecognitionState.FAILURE;
            }
            
            // Direction
            const [x, y, z] = hand.direction;
            if (hand.type === 'left') {
                if (x < -0.2 || x > 0.5) {
                    return RecognitionState.FAILURE;
                }
            } else {
                if (x < -0.5 || x > 0.2) {
                    return RecognitionState.FAILURE;
                }
            }

            if (y < -0.3 || y > 0.3 || z > -0.8) {
                return RecognitionState.FAILURE;
            }
        }

        return RecognitionState.IN_PROGRESS;
    }

    isRecognizedEnd(frame) {
        for (const hand of frame.hands) {
            if (hand.palmNormal[1] < 0.9) {
                return RecognitionState.FAILURE;
            }
        }

        return RecognitionState.SUCCESS;
    }
}

// ----------------------------------------------------------------------------------------------------------------LEVEL

/**
 * @overview Enumerates the possible states while a gesture part recognition.
 */
let RecognitionState = {
    SUCCESS: 'success',
    IN_PROGRESS: 'inProgress',
    FAILURE: 'failure'
};