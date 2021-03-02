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
        this.recognized = false;
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
        this.gesturePartTotalCount = this.gestureParts.length;
        this.gestureParts.forEach(gesturePart => gesturePart.forEach(gesturePartForHand => gesturePartForHand.init()));
        this.expectedHandNumber = 0;
        if (this.gesturePartTotalCount > 0) {
            this.expectedHandNumber = this.gestureParts[0].length;
        }
        this.gesturePartCurrentCountByHand = []; // Each element represents a hand counter. The counter informs the number of gesture part recognized by this hand in regard to the total count of gesture parts. Example : gesturePartTotalCount = 2, gesturePartCurrentCountByHand = [2,2], there is two hands, each hand validated 2 gesture parts on a total of 2 gesture parts, the gesture is so recognized.
        for (let i = 0; i < this.expectedHandNumber; i++) {
            this.gesturePartCurrentCountByHand.push(0);
        }
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
        if (this.expectedHandNumber === 0 && this.getNumberOfEffectiveTrackedHand(gestureRepresentation) !== this.expectedHandNumber) {
            return;
        }
        // Checking if each hand passes its current gesture part.
        for (let handIndex = 0; handIndex < this.expectedHandNumber; handIndex++) {
            if (this.gesturePartCurrentCountByHand[handIndex] < this.gesturePartTotalCount
                && this.gestureParts[this.gesturePartCurrentCountByHand[handIndex]][handIndex].isRecognized(gestureRepresentation)) {
                this.gesturePartCurrentCountByHand[handIndex]++;
            }
        }

        // Checking if each hand has reached out all their gestures parts.
        let numberOfHandOk = 0;
        for (let handIndex = 0; handIndex < this.expectedHandNumber; handIndex++) {
            if (this.gesturePartCurrentCountByHand[handIndex] === this.gesturePartTotalCount) {
                numberOfHandOk++;
            }
        }
        this.recognized = numberOfHandOk === this.expectedHandNumber;
    }

    /**
     * @return {boolean} True if the gesture is recognized within the duration ; false otherwise.
     */
    isRecognized() {
        let temp = this.recognized;
        this.init();
        return temp;
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
            [new PalmIsClosedLeapMotion(handSide.LEFT), new PalmIsClosedLeapMotion(handSide.RIGHT)]
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
            [new PalmIsClosedLeapMotion(handSide.LEFT), new PalmIsClosedLeapMotion(handSide.RIGHT)],

            [new PalmIsOpenedLeapMotion(handSide.LEFT), new PalmIsOpenedLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchingLeapMotion(handSide.LEFT), new PalmIsPinchingLeapMotion(handSide.RIGHT)],
            [new PalmIsClosedLeapMotion(handSide.LEFT), new PalmIsClosedLeapMotion(handSide.RIGHT)],

            [new PalmIsOpenedLeapMotion(handSide.LEFT), new PalmIsOpenedLeapMotion(handSide.RIGHT)],
            [new PalmIsPinchingLeapMotion(handSide.LEFT), new PalmIsPinchingLeapMotion(handSide.RIGHT)],
            [new PalmIsClosedLeapMotion(handSide.LEFT), new PalmIsClosedLeapMotion(handSide.RIGHT)]
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
            [new PalmIsClosedLeapMotion("any")],
            [new HandIsGrabbingLeapMotion("any", true)]
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
        this.handSide = handSide !== handSide.ANY ? handSide : 0; // If any hand, take the first one.
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
        let hand = frame.hands[handSide];
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
        this.handSide = handSide !== handSide.ANY ? handSide : 0; // If any hand, take the first one.
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

        if (this.hasOpenedAgain !== true) { // While the hand has not opened again, the gesture recognition goes on.

            let currentPinchStrength = frame.hands[this.handSide].pinchStrength;

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

class PalmIsClosedLeapMotion extends GesturePart {

    /**
     * @override
     */
    constructor(handSide) {
        super();
        this.nearHandClosed = 0.8; // 0 = opened ; 1 = closed.
        this.handSide = handSide !== handSide.ANY ? handSide : 0; // If any hand, take the first one.
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
        if (frame.hands[this.handSide].pinchStrength >= this.nearHandClosed) {
            isRecognized = true;
            log.debug("gameModel.PalmIsClosedLeapMotion.isRecognized : OK");
        } else {
            log.debug("gameModel.PalmIsClosedLeapMotion.isRecognized : KO");
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
        const hand = frame.find(h => h.type = this.handSide);
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
        const hand = frame.hands.find(h => h.type === this.handSide)
        console.assert(hand !== undefined)

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
        const hand = this.handSide === "any"
            ? frame.hands[0]
            : frame.hands.find(h => h.type === handSide);

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

class PalmIsStill extends GesturePart {
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
        let hand;

        for (const h of frame.hands) {
            if (h.type === this.handType) {
                hand = h;
            }
        }

        let positions = hand.palmPosition;

        if (!this.lowestPositions) { // Initializes positions.
            this.lowestPositions = positions;

        } else if (!this._hasHandNotMove(this.lowestPositions, positions)) {
            this.isFailed = true;
            log.debug(`gameModel.PalmIsStill.isRecognized : ${this.handType} has moved : KO`);
        }

        return !this.isFailed;
    }

    _hasHandNotMove(before, after) {
        let difference = Math.abs(after[1] - before[1]);
        return difference < 10;
    }
}

class PalmWentUp extends GesturePart {
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
        let hand;

        for (const h of frame.hands) {
            if (h.type === this.handType) {
                hand = h;
            }
        }

        let positions = hand.palmPosition;

        if (!this.lowestPositions) { // Initializes positions.
            this.lowestPositions = positions;

        } else if (this._hasHandTraveledUp(this.lowestPositions, positions)) {
            log.debug(`gameModel.PalmWentUp.isRecognized : ${this.handMustMove} : OK`);
            return true;
        }

        return false;
    }

    _hasHandTraveledUp(before, after) {
        let difference = after[1] - before[1];
        return difference > 50;
    }
}

class PalmHasStartMoving extends GesturePart {
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
        let hand;

        for (const h of frame.hands) {
            if (h.type === this.handType) {
                hand = h;
            }
        }

        let positions = hand.palmPosition;

        if (!this.lowestPositions) { // Initializes positions.
            this.lowestPositions = positions;

        } else if (!this._hasHandNotMove(this.lowestPositions, positions)) {
            log.debug(`gameModel.PalmHasStartMoving.isRecognized : ${this.handType} has start moving moved : OK`);
            return true;

        }

        return false;
    }

    _hasHandNotMove(before, after) {
        let difference = Math.abs(after[1] - before[1]);
        return difference < 10;
    }
}

