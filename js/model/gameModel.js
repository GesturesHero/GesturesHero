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
            // this.currentLevel = levels[0]; // TODO : To uncomment
            this.currentLevel = levels[levels.length - 1]; // Unlock all the levels. For testing purpose only !
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
        return this.currentLevel === undefined;
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
        if (this.levelLives > 0) {
            this.levelLives -= step;
        }
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
     * @param songAuthor {string} The song author.
     * @param songTitle {string} The song title.
     * @param songUrl {string} The song URL.
     *
     */
    constructor(songAuthor, songTitle, songUrl) {
        this.songAuthor = songAuthor;
        this.songTitle = songTitle;
        this.songUrl = songUrl;
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
     * @param gestureId {string} The gesture id related to the milestone.
     * @param levelMilestoneTimestampStart {number} A timestamp representing the position of the milestone in the song.
     */
    constructor(gestureId, levelMilestoneTimestampStart) {
        this.gestureId = gestureId;
        this.levelMilestoneTimestampStart = levelMilestoneTimestampStart;
    }

    /**
     * @return {string} The gesture id.
     */
    getGestureId() {
        return this.gestureId;
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
            "gestureId": this.getGestureId(),
            "levelMilestoneTimestampStart": this.getLevelMilestoneTimestampStart()
        };
    }
}

// --------------------------------------------------------------------------------------------------------------GESTURE

const handSide = {
    LEFT: 'left',
    RIGHT: 'right',
    ANY: 'any'
};

/**
 * @overview Represents an abstract gesture.
 */
class Gesture {

    /**
     * Instantiates a gesture.
     * @param gestureId {string} The gesture id.
     * @param durationInSec {number} The gesture duration within the one the gesture must be recognized.
     * @param illustrationUrl {string} An URL to an illustration of the gesture (PNG, GIF, etc.).
     * @param gestureParts {[[GesturePart]]} The gesture parts that compose the gesture. Each element (from list) represents a gesture part. Each of them is split into sub-element (from sub-list) that represents the sub-part of a gesture part performed by only one hand.
     */
    constructor(gestureId, durationInSec, illustrationUrl, gestureParts = [[]]) {
        this.gestureId = gestureId;
        this.durationInSec = durationInSec;
        this.illustrationUrl = illustrationUrl;
        this.gestureParts = gestureParts;
        this.recognized = false; // Informs of the whole gesture recognition.
        this.expectedHandNumber = -1; // Informs the number of hands that are expected for the gesture.
        this.gesturePartTotalCount = -1; // Informs the total of gestures part that composes the gesture.
        this.gesturePartCurrentCount = -1; // Informs the progression of the recognition of the gesture through the gesture parts' recognition.
        this.init();
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
     * (Re-)Initializes the gesture.
     */
    init() {
        // Gesture part initialization.
        this.gestureParts.forEach(gesturePart => gesturePart.forEach(gesturePartForHand => gesturePartForHand.init()));
        this.gesturePartTotalCount = this.gestureParts.length;

        // Expected hand counting.
        if (this.gesturePartTotalCount > 0) {
            this.expectedHandNumber = this.gestureParts[0].length;
        }

        // Initialization of the gesture parts recognition progression.
        this.gesturePartCurrentCount = 0;

        // Initialization of the gesture recognition state.
        this.recognized = false;
    }

    /**
     * Returns the number of effective tracked hand.
     * @param gestureRepresentation {Object} A gesture representation to check with.
     */
    getNumberOfEffectiveTrackedHand(gestureRepresentation) {
    }

    /**
     * Initiates the gesture recognition.
     * @param gestureRepresentation {Object} A gesture representation (e.g. a frame for the LeapMotion) to check with.
     * @return nothing.
     */
    check(gestureRepresentation) {

        // Checking if the required hand(s) is/are tracked.
        if (this.expectedHandNumber < 1 || this.getNumberOfEffectiveTrackedHand(gestureRepresentation) !== this.expectedHandNumber) {
            return;
        }

        // Checking if the gesture has not been already recognized.
        if (this.gesturePartCurrentCount >= this.gesturePartTotalCount || this.recognized){
            return;
        }

        let isGesturePartRecognized = true;

        // Checking the gesture part's recognition for each hand.
        for (let handIndex = 0; handIndex < this.expectedHandNumber; handIndex++) {

            if(!this.gestureParts[this.gesturePartCurrentCount][handIndex].isRecognized(gestureRepresentation)){
                isGesturePartRecognized = false;
                // Once one hand's gesture part is not recognized, the global gesture part for the both hands cannot be recognized neither.
                // Indeed, a gesture part requires a simultaneous hands recognition.
                // So that, the recognition blocks on the same gesture part until the next gesture representation arrives.
            }
        }

        // Checking the gesture part recognition.
        if(isGesturePartRecognized){
            this.gesturePartCurrentCount++;
            // If the both hands are recognized simultaneously, the gesture part is considered as recognized.
            // So that, the next gesture part could be recognized in turn.
        }


        // Checking if all the gestures parts have been recognized.
        this.recognized = this.gesturePartCurrentCount === this.gesturePartTotalCount;
    }

    /**
     * @return {boolean} True if the gesture is recognized within the duration ; false otherwise.
     */
    isRecognized() {
        let recognition = this.recognized;
        this.init();
        return recognition;
    }
}

class GestureLeapMotion extends Gesture {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
    }

    /**
     * @override
     */
    getNumberOfEffectiveTrackedHand(frame) {
        return frame.hands.length;
    }
}

class Pinch1GestureLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsOpenedLeapMotion(handSide.LEFT), new PalmIsOpenedLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchingLeapMotion(handSide.LEFT), new PalmIsPinchingLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchedLeapMotion(handSide.LEFT), new PalmIsPinchedLeapMotion(handSide.RIGHT)]
        ];
        this.init();
    }
}

class Pinch3GestureLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsOpenedLeapMotion(handSide.LEFT), new PalmIsOpenedLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchingLeapMotion(handSide.LEFT), new PalmIsPinchingLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchedLeapMotion(handSide.LEFT), new PalmIsPinchedLeapMotion(handSide.RIGHT)],

            [new PalmIsOpenedLeapMotion(handSide.LEFT), new PalmIsOpenedLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchingLeapMotion(handSide.LEFT), new PalmIsPinchingLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchedLeapMotion(handSide.LEFT), new PalmIsPinchedLeapMotion(handSide.RIGHT)],

            [new PalmIsOpenedLeapMotion(handSide.LEFT), new PalmIsOpenedLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchingLeapMotion(handSide.LEFT), new PalmIsPinchingLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchedLeapMotion(handSide.LEFT), new PalmIsPinchedLeapMotion(handSide.RIGHT)]
        ];
        this.init();
    }
}

class RotationGestureLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsFlatLeapMotion("left", "down"), new PalmIsFlatLeapMotion("right", "down")],
            [new PalmIsRotatingLeapMotion("left", "down"), new PalmIsRotatingLeapMotion("right", "down")]
        ];
        this.init();
    }
}

class ReversedRotationGestureLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsFlatLeapMotion("left", "up"), new PalmIsFlatLeapMotion("right", "up")],
            [new PalmIsRotatingLeapMotion("left", "up"), new PalmIsRotatingLeapMotion("right", "up")]
        ];
        this.init();
    }
}

class GrabGestureLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsOpenedLeapMotion("any")],
            [new HandIsGrabbingLeapMotion("any")]
        ];
        this.init();
    }
}

class ReleaseGestureLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsPinchedLeapMotion("any")],
            [new HandIsGrabbingLeapMotion("any", true)]
        ];
        this.init();
    }
}

class GestureHammer1LeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmMoveDownUpLeapMotion(handSide.LEFT), new PalmMoveDownUpLeapMotion(handSide.RIGHT)]
        ];
        this.init();
    }
}

class GestureHammer3LeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmMoveDownUpLeapMotion(handSide.LEFT), new PalmMoveDownUpLeapMotion(handSide.RIGHT)],
            [new PalmMoveDownUpLeapMotion(handSide.LEFT), new PalmMoveDownUpLeapMotion(handSide.RIGHT)],
            [new PalmMoveDownUpLeapMotion(handSide.LEFT), new PalmMoveDownUpLeapMotion(handSide.RIGHT)],
        ];
        this.init();
    }
}

class GestureScratchLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmMoveRightLeftLeapMotion()],
            [new PalmMoveRightLeftLeapMotion()],
            [new PalmMoveRightLeftLeapMotion()],
        ];
        this.init();
    }
}

class GestureStairsLeapMotion extends GestureLeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new HandIsStillLeapMotion(handSide.LEFT), new HandMoveUpLeapMotion(handSide.RIGHT)],
            [new HandHasStartMovingUpLeapMotion(handSide.LEFT)],

            [new HandIsStillLeapMotion(handSide.RIGHT), new HandMoveUpLeapMotion(handSide.LEFT)],
            [new HandHasStartMovingUpLeapMotion(handSide.RIGHT)],

            [new HandIsStillLeapMotion(handSide.LEFT), new HandMoveUpLeapMotion(handSide.RIGHT)],
            [new HandHasStartMovingUpLeapMotion(handSide.LEFT)],

            [new HandIsStillLeapMotion(handSide.RIGHT), new HandMoveUpLeapMotion(handSide.LEFT)],
        ];
        this.init();
    }
}

// ---------------------------------------------------------------------------------------------------------GESTURE PART

/**
 * @overview Represents an abstract gesture part (a static position or a dynamic movement).
 */
class GesturePart {

    /**
     * Instantiates a gesture part.
     */
    constructor() {
    }

    /**
     * (Re-)Initializes the gesture part.
     */
    init() {
    }

    /**
     * @param gestureRepresentation {Object} A gesture representation to check with.
     * @return {boolean} A boolean representing the recognition of the gesture part.
     */
    isRecognized(gestureRepresentation) {
    }
}

class PalmIsOpenedLeapMotion extends GesturePart {

    /**
     * @override
     */
    constructor(handSide) {
        super();
        this.openHandToleranceMax = 0.2; // 0 = opened ; 1 = closed.
    }

    /**
     * @override
     */
    init() {
        // Nothing
    }

    /**
     * @override
     */
    isRecognized(frame) {
        let isRecognized = false;
        let hand = this.handSide === handSide.ANY ? frame.hands[0] : frame.hands.find(hand => hand.type === handSide);  // NOTE: If any hand, take the first one.

        if (hand !== undefined && hand.pinchStrength <= this.openHandToleranceMax) {
            isRecognized = true;
            log.debug("gameModel.PalmIsOpenedLeapMotion.isRecognized : OK");
        } else {
            log.debug("gameModel.PalmIsOpenedLeapMotion.isRecognized : OK");
        }

        return isRecognized;
    }
}

class PalmIsPinchingLeapMotion extends GesturePart {

    /**
     * @override
     */
    constructor(handSide) {
        super();
        this.nearHandClosed = 0.8; // 0 = opened ; 1 = closed.
        this.init();
    }

    /**
     * @override
     */
    init() {
        this.previousPinchStrength = 0;
        this.hasOpenedAgain = false;
    }

    /**
     * @override
     */
    isRecognized(frame) {
        let isRecognized = false;
        let hand = this.handSide === handSide.ANY ? frame.hands[0] : frame.hands.find(hand => hand.type === handSide);  // NOTE: If any hand, take the first one.

        if (this.hasOpenedAgain !== true) { // While the hand has not opened again, the gesture recognition goes on.

            let currentPinchStrength = hand.pinchStrength;

            if (currentPinchStrength < this.previousPinchStrength) { // Hand has opened again.
                this.hasOpenedAgain = true;
                log.debug("gameModel.PalmIsPinchingLeapMotion.isRecognized : KO");

            } else if (currentPinchStrength >= this.previousPinchStrength && currentPinchStrength < this.nearHandClosed) { // Hand progress towards the closed hand.
                this.previousPinchStrength = currentPinchStrength;

            } else { // Hand has reached the step before the total closed-hand step.
                isRecognized = true;
                log.debug("gameModel.PalmIsPinchingLeapMotion.isRecognized : OK");
            }
        }
        return isRecognized;
    }
}

class PalmIsPinchedLeapMotion extends GesturePart {

    /**
     * @override
     */
    constructor(handSide) {
        super();
        this.nearHandClosed = 0.8; // 0 = opened ; 1 = closed.
        this.init();
    }

    /**
     * @override
     */
    init() {
        // Nothing
    }

    /**
     * @override
     */
    isRecognized(frame) {
        let isRecognized = false;
        let hand = this.handSide === handSide.ANY ? frame.hands[0] : frame.hands.find(hand => hand.type === handSide);  // NOTE: If any hand, take the first one.

        if (hand.pinchStrength >= this.nearHandClosed) {
            isRecognized = true;
            log.debug("gameModel.PalmIsPinchedLeapMotion.isRecognized : OK");
        } else {
            log.debug("gameModel.PalmIsPinchedLeapMotion.isRecognized : KO");
        }
        return isRecognized;
    }
}

class PalmIsFlatLeapMotion extends GesturePart {

    /**
     * @param {"left" | "right"} handSide 
     * @param {"up" | "down"} direction 
     */
    constructor(handSide, direction) {
        super();
        this.handSide = handSide;
        this.rotation = direction === "down" ? 1 : -1;
    }

    /**
     * @override
     */
    init() {
        // Nothing
    }

    /**
     * @override
     */
    isRecognized(frame) {
        const hand = frame.hands.find(hand => hand.type === handSide);
        const normal = hand.palmNormal[1] * this.rotation;
        const success = normal < -0.8;
        log.debug(`gameModel.PalmIsFlatLeapMotion.isRecognized : ${success}`);
        return success
    }
}

class PalmIsRotatingLeapMotion extends GesturePart {

    /**
     * @param {"left" | "right"} handSide
     * @param {"up" | "down"} startDirection
     */
    constructor(handSide, startDirection) {
        super();
        this.handSide = handSide;
        this.rotation = startDirection === "down" ? 1 : -1;
        this.previousNormals = [-1, -1];
    }

    /**
     * @override
     */
    init() {
        this.previousNormals = [-1, -1];
    }

    /**
     * @override
     */
    isRecognized(frame) {
        const hand = frame.hands.find(hand => hand.type === handSide);
        console.assert(hand !== undefined);

        // Normal
        const normal = hand.palmNormal[1] * this.rotation;
        if (normal < this.previousNormals[i] - 0.1) {
            log.debug("gameModel.PalmIsRotatingLeapMotion.isRecognized : Miss gesturing: Hands turning backwards");
            return false;
        } else {
            this.previousNormals[i] = Math.max(normal, this.previousNormals[i]);
        }

        if (normal < 0.8) {
            log.debug("gameModel.PalmIsRotatingLeapMotion.isRecognized : Unfinished gesture");
            return false;
        }

        // Grab
        if (hand.grabStrength === 1) {
            log.debug("gameModel.PalmIsRotatingLeapMotion.isRecognized : Miss gesturing: Hands not open enough");
            return false;
        }

        log.debug("gameModel.PalmIsRotatingLeapMotion.isRecognized : OK");
        return true;
    }
}

class HandIsGrabbingLeapMotion extends GesturePart {

    /**
     * @override
     */
    constructor(handSide, reversed = false) {
        super();
        this.handSide = handSide;
        this.reversed = reversed;
        this.previousStrength = 0;
    }

    /**
     * @override
     */
    init() {
        this.previousStrength = 0;
    }

    /**
     * @override
     */
    isRecognized(frame) {
        const hand = this.handSide === handSide.ANY
            ? frame.hands[0]
            : frame.hands.find(hand => hand.type === handSide);

        console.assert(hand !== undefined);

        const strength = this.reversed ? hand.grabStrength : 1 - hand.grabStrength;
        if (strength < this.previousStrength - 0.05) {
            log.debug("gameModel.HandIsGrabbingLeapMotion.isRecognized : Miss gesturing: decreasing grabStrength");
            return false;
        } else {
            this.previousStrength = Math.max(strength, this.previousStrength);
        }

        if (strength < 0.95) {
            log.debug("gameModel.HandIsGrabbingLeapMotion.isRecognized : unfinished gesture");
            return false;
        }

        log.debug("gameModel.HandIsGrabbingLeapMotion.isRecognized : OK");
        return true;
    }
}

class HandIsStillLeapMotion extends GesturePart {
    /**
     * @override
     */
    constructor(handType) {
        super();
        this.handType = handType;
        this.lowestPositions = null;
        this.isFailed = false;
    }

    /**
     * @override
     */
    init() {
        this.lowestPositions = null;
        this.isFailed = false;
    }

    /**
     * @override
     */
    isRecognized(frame) {
        let hand = frame.hands.find(h => h.type === this.handType); // "this.handType" works here ?

        /*for (const h of frame.hands) {
            if (h.type === this.handType) {
                hand = h;
            }
        }*/

        let positions = hand.palmPosition;

        if (!this.lowestPositions) { // Initializes positions.
            this.lowestPositions = positions;

        } else if (!this._hasHandNotMoveVerically(this.lowestPositions, positions)) {
            this.isFailed = true;
            log.debug(`gameModel.HandIsStillLeapMotion.isRecognized : ${this.handType} has moved : KO`);
        }

        return !this.isFailed;
    }

    _hasHandNotMoveVerically(before, after) {
        let difference = Math.abs(after[1] - before[1]);
        return difference < 10;
    }
}

class HandMoveUpLeapMotion extends GesturePart {
    /**
     * @override
     */
    constructor(handType) {
        super();
        this.handType = handType;
        this.lowestPositions = null;
        this.isFailed = false;
    }

    /**
     * @override
     */
    init() {
        this.lowestPositions = null;
        this.isFailed = false;
    }

    /**
     * @override
     */
    isRecognized(frame) {
        let hand = frame.hands.find(h => h.type === this.handType); // "this.handType" works here ?

        /*for (const h of frame.hands) {
            if (h.type === this.handType) {
                hand = h;
            }
        }*/

        let positions = hand.palmPosition;

        if (!this.lowestPositions) { // Initializes positions.
            this.lowestPositions = positions;

        } else if (this._hasHandTraveledUp(this.lowestPositions, positions)) {
            log.debug(`gameModel.HandMoveUpLeapMotion.isRecognized : ${this.handMustMove} : OK`);
            return true;
        }

        return false;
    }

    _hasHandTraveledUp(before, after) {
        let difference = after[1] - before[1];
        return difference > 50;
    }
}

class HandHasStartMovingUpLeapMotion extends GesturePart {
    /**
     * @override
     */
    constructor(handType) {
        super();
        this.handType = handType;
        this.lowestPositions = null;
    }

    /**
     * @override
     */
    init() {
        this.lowestPositions = null;
    }

    /**
     * @override
     */
    isRecognized(frame) {
        let hand = frame.hands.find(h => h.type === this.handType); // "this.handType" works here ?

        /*for (const h of frame.hands) {
            if (h.type === this.handType) {
                hand = h;
            }
        }*/

        let positions = hand.palmPosition;

        if (!this.lowestPositions) { // Initializes positions.
            this.lowestPositions = positions;

        } else if (!this._hasHandNotMove(this.lowestPositions, positions)) {
            log.debug(`gameModel.HandHasStartMovingUpLeapMotion.isRecognized : ${this.handType} has start moving moved : OK`);
            return true;

        }

        return false;
    }

    _hasHandNotMove(before, after) {
        let difference = Math.abs(after[1] - before[1]);
        return difference < 10;
    }
}

class PalmMoveDownUpLeapMotion extends GesturePart {
    constructor(handType) {
        super();
        this.handType = handType;
        this.previousHandPeak = null;
        this.previousHandPosition = null;
        this.gesturePartStep = 0;
    }

    /**
     * @override
     */
    init() {
        this.previousHandPeak = null;
        this.previousHandPosition = null;
        this.gesturePartStep = 0;
    }

    /**
     * @override
     */
    isRecognized(frame) {
        let hand;
        for (const h of frame.hands) {
            if (h.type === this.handType) {
                hand = h;
            }
        }
        let handPosition = hand.indexFinger.tipPosition;

        switch (this.gesturePartStep) {
            case 0: // Check the initial position.
                if (this.previousHandPosition
                    && this._isHandGoingDown(this.previousHandPosition, handPosition)) {
                    this.previousHandPeak = this.previousHandPosition;
                    this.gesturePartStep++;
                } else if (this.previousHandPosition && this._isHandGoingUp(this.previousHandPosition, handPosition)) {
                    this.previousHandPosition = handPosition;
                }
                break;

            case 1: // Check if the finger went down.
                if (this._hasHandTraveledDown(this.previousHandPeak, handPosition)
                    && this._isHandGoingUp(this.previousHandPosition, handPosition)) {
                    this.previousHandPeak = this.previousHandPosition;
                    this.gesturePartStep++;
                }
                break;

            case 2: // Check if finger/hand went back to the initial position.
                if (this._hasHandTraveledUp(this.previousHandPeak, handPosition)) {
                    this.previousHandPeak = this.previousHandPosition;
                    this.gesturePartStep++;
                }
                break;

            default: // State = 3 ; The previous state was successful, ti means that the gesture has been recognized.
                log.debug("gameModel.GestureHammerPart.isRecognized : OK");
                return true;
        }

        this.previousHandPosition = handPosition;

        return false;
    }

    _hasHandTraveledDown(before, after) {
        let difference = before[1] - after[1];
        return difference > 30;
    }

    _hasHandTraveledUp(before, after) {
        let difference = after[1] - before[1];
        return difference > 30;
    }

    _isHandGoingUp(before, after) {
        return before[1] < after[1];
    }

    _isHandGoingDown(before, after) {
        return before[1] > after[1];
    }
}

class PalmMoveRightLeftLeapMotion extends GesturePart {

    /**
     * @override
     */
    constructor() {
        super();
        this.gesturePartStep = 0;
        this.previousPalmPosition = null;
        this.positionPalmPeak = null;
    }

    /**
     * @override
     */
    init() {
        this.gesturePartStep = 0;
        this.previousPalmPosition = null;
        this.positionPalmPeak = null;
    }

    /**
     * @override
     */
    isRecognized(frame) {

        let hand = frame.hands[0];
        let palmPosition = hand.palmPosition;

        switch (this.gesturePartStep) {
            case 0: // Check the initial position.
                if (this.previousPalmPosition && this._isHandGoingRight(this.previousPalmPosition, palmPosition)) {
                    this.positionPalmPeak = this.previousPalmPosition;
                    this.gesturePartStep++;
                } else if (this.previousPalmPosition && this._isHandGoingLeft(this.previousPalmPosition, palmPosition)) {
                    this.previousPalmPosition = palmPosition;
                }
                break;

            case 1: // Check if the hand went right.
                if (this._hasHandTraveledRight(this.positionPalmPeak, palmPosition) && this._isHandGoingLeft(this.previousPalmPosition, palmPosition)) {
                    this.positionPalmPeak = this.previousPalmPosition;
                    this.gesturePartStep++;
                }
                break;

            case 2: // Check if hand went back to the initial position.
                if (this._hasHandTraveledLeft(this.positionPalmPeak, palmPosition)) {
                    this.positionPalmPeak = this.previousPalmPosition;
                    this.gesturePartStep++;
                }
                break;

            default: // State = 3 ; The previous state was successful, it means that the gesture has been recognized.
                log.debug(`gameModel.GestureScratchPart.isRecognized : OK`);
                return true;
        }

        this.previousPalmPosition = palmPosition;

        return false;
    }

    _hasHandTraveledRight(before, after) {
        let difference = before[0] - after[0];
        return difference > 30;
    }

    _hasHandTraveledLeft(before, after) {
        let difference = after[0] - before[0];
        return difference > 30;
    }

    _isHandGoingLeft(before, after) {
        return before[0] < after[0];
    }

    _isHandGoingRight(before, after) {
        return before[0] > after[0];
    }
}