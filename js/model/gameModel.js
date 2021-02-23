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

const hand = {
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
     * @param gestureParts {[[GesturePart, GesturePart]]} The gesture parts that compose the gesture. Each element (from list) represents a gesture part. Each of them is split into sub-element (from sub-list) that represents the sub-part of a gesture part performed by only one hand.
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
     * Returns the number of tracked hand.
     * @param gestureRepresentation {Object} A gesture representation to check with.
     */
    getNumberOfTrackedHand(gestureRepresentation){}

    /**
     * Initiates the gesture recognition.
     * @param gestureRepresentation {Object} A gesture representation (e.g. a frame for the LeapMotion) to check with.
     * @return nothing.
     */
    check(gestureRepresentation) {
        if (this.expectedHandNumber === 0 && this.getNumberOfTrackedHand(gestureRepresentation) !== this.expectedHandNumber) {
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

// class GestureHammer1LeapMotion extends Gesture {
//
//     constructor(gestureId, durationInSec, illustrationUrl) {
//         super(gestureId, durationInSec, illustrationUrl);
//         this.gestureParts = [
//             [new GestureHammerPart(1, 0), new GestureHammerPart(2, 1)]
//         ];
//         this.gestureCount = this.gestureParts.length;
//         this.hand1Index = 0;
//         this.hand2Index = 0;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.gestureParts.forEach(gesturePart => gesturePart.forEach(gesturePartForHand => gesturePartForHand.init()));
//         this.hand1Index = 0;
//         this.hand2Index = 0;
//         this.recognized = false;
//     }
//
//     /**
//      * @override
//      */
//     check(frame) {
//         if (frame.hands.length !== 2) return;
//         if (this.hand1Index < this.gestureCount
//             && this.gestureParts[this.hand1Index][0].isRecognized(frame)) {
//             this.hand1Index++;
//             log.debug("Hammer Hand 1 " + this.hand1Index + "/" + this.gestureCount);
//         }
//         if (this.hand2Index < this.gestureCount
//             && this.gestureParts[this.hand2Index][1].isRecognized(frame)) {
//             this.hand2Index++;
//             log.debug("Hammer Hand 2 " + this.hand2Index + "/" + this.gestureCount);
//         }
//         this.recognized = this.hand1Index + this.hand2Index === this.gestureCount * 2;
//     }
// }
//
// class GestureHammer3LeapMotion extends GestureHammer1LeapMotion {
//
//     constructor(gestureId, durationInSec, illustrationUrl) {
//         super(gestureId, durationInSec, illustrationUrl);
//         this.gestureParts = [
//             [new GestureHammerPart(1, 0), new GestureHammerPart(2, 1)],
//             [new GestureHammerPart(3, 0), new GestureHammerPart(4, 1)],
//             [new GestureHammerPart(5, 0), new GestureHammerPart(6, 1)],
//         ];
//         this.gestureCount = this.gestureParts.length;
//     }
// }
//
// class GestureRotationLeapMotion extends Gesture {
//
//     constructor(gestureId, durationInSec, illustrationUrl, clockwise) {
//         super(gestureId, durationInSec, illustrationUrl);
//         this.gestureParts = [
//             new GestureRotationStartPart(1, clockwise),
//             new GestureRotationPart(2, clockwise)
//         ];
//         this.gestureCount = this.gestureParts.length;
//         this.gestureIndex = 0;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.gestureParts.forEach(gesturePart => gesturePart.init());
//         this.gestureIndex = 0;
//         this.recognized = false;
//     }
//
//     /**
//      * @override
//      */
//     check(frame) {
//         if (this.gestureIndex < this.gestureCount && this.gestureParts[this.gestureIndex].isRecognized(frame)) this.gestureIndex++;
//         this.recognized = this.gestureIndex === this.gestureCount;
//     }
// }
//
// class GestureGrabLeapMotion extends Gesture {
//
//     constructor(gestureId, durationInSec, illustrationUrl, grab) {
//         super(gestureId, durationInSec, illustrationUrl);
//         this.gestureParts = [
//             new GestureGrabStartPart(1, grab),
//             new GestureGrabPart(2, grab)
//         ];
//         this.gestureCount = this.gestureParts.length;
//         this.gestureIndex = 0;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.gestureParts.forEach(gesturePart => gesturePart.init());
//         this.gestureIndex = 0;
//         this.recognized = false;
//     }
//
//     /**
//      * @override
//      */
//     check(frame) {
//         if (this.gestureIndex < this.gestureCount && this.gestureParts[this.gestureIndex].isRecognized(frame)) this.gestureIndex++;
//         this.recognized = this.gestureIndex === this.gestureCount;
//     }
// }
//
// class GestureStairsLeapMotion extends Gesture {
//
//     constructor(gestureId, durationInSec, illustrationUrl) {
//         super(gestureId, durationInSec, illustrationUrl);
//         this.gestureParts = [
//             new GestureStairsPart(1, "right"),
//             new GestureStairsPart(2, "left"),
//             new GestureStairsPart(3, "right"),
//             new GestureStairsPart(4, "left"),
//         ];
//         this.gestureCount = this.gestureParts.length;
//         this.gestureIndex = 0;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.gestureParts.forEach(gesturePart => gesturePart.init());
//         this.gestureIndex = 0;
//         this.recognized = false;
//     }
//
//     /**
//      * @override
//      */
//     check(frame) {
//         if (frame.hands.length !== 2) return;
//         if (this.gestureIndex < this.gestureCount && this.gestureParts[this.gestureIndex].isRecognized(frame)) this.gestureIndex++;
//         this.recognized = this.gestureIndex === this.gestureCount;
//     }
// }
//
// class GestureScratchLeapMotion extends Gesture {
//
//     constructor(gestureId, durationInSec, illustrationUrl) {
//         super(gestureId, durationInSec, illustrationUrl);
//         this.gestureParts = [
//             new GestureScratchPart(0),
//             new GestureScratchPart(1),
//             new GestureScratchPart(2),
//         ];
//         this.gestureCount = this.gestureParts.length;
//         this.gestureIndex = 0;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.gestureParts.forEach(gesturePart => gesturePart.init());
//         this.gestureIndex = 0;
//         this.recognized = false;
//     }
//
//     /**
//      * @override
//      */
//     check(frame) {
//         if (frame.hands.length !== 1) return;
//         if (this.gestureIndex < this.gestureCount && this.gestureParts[this.gestureIndex].isRecognized(frame)) {
//             this.gestureIndex++;
//             log.debug("Scratch " + this.gestureIndex + "/" + this.gestureCount);
//         }
//         this.recognized = this.gestureIndex === this.gestureCount;
//     }
// }s

class GesturePinch1LeapMotion extends Gesture {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsOpen(hand.LEFT), new PalmIsOpen(hand.RIGHT)],
            [new PalmIsPinching(hand.LEFT), new PalmIsPinching(hand.RIGHT)],
            [new PalmIsClosed(hand.LEFT), new PalmIsClosed(hand.RIGHT)]
        ];
        this.gesturePartTotalCount = this.gestureParts.length;
        this.init();
    }

    /**
     * @override
     */
    getNumberOfTrackedHand(frame){
        return frame.hands.length;
    }
}

class GesturePinch3LeapMotion extends GesturePinch1LeapMotion {

    constructor(gestureId, durationInSec, illustrationUrl) {
        super(gestureId, durationInSec, illustrationUrl);
        this.gestureParts = [
            [new PalmIsOpen(hand.LEFT), new PalmIsOpen(hand.RIGHT)],
            [new PalmIsPinching(hand.LEFT), new PalmIsPinching(hand.RIGHT)],
            [new PalmIsClosed(hand.LEFT), new PalmIsClosed(hand.RIGHT)],

            [new PalmIsOpen(hand.LEFT), new PalmIsOpen(hand.RIGHT)],
            [new PalmIsPinching(hand.LEFT), new PalmIsPinching(hand.RIGHT)],
            [new PalmIsClosed(hand.LEFT), new PalmIsClosed(hand.RIGHT)],

            [new PalmIsOpen(hand.LEFT), new PalmIsOpen(hand.RIGHT)],
            [new PalmIsPinching(hand.LEFT), new PalmIsPinching(hand.RIGHT)],
            [new PalmIsClosed(hand.LEFT), new PalmIsClosed(hand.RIGHT)]
        ];
        this.gesturePartTotalCount = this.gestureParts.length;
        this.init();
    }

    /**
     * @override
     */
    getNumberOfTrackedHand(frame){
        return frame.hands.length;
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

// class GestureHammerPart extends GesturePart {
//     constructor(gesturePartId, handIndex) {
//         super(gesturePartId);
//         this.handIndex = handIndex;
//         this.previousHandPeak = null;
//         this.previousHandPosition = null;
//         this.gesturePartStep = 0;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.previousHandPeak = null;
//         this.previousHandPosition = null;
//         this.gesturePartStep = 0;
//     }
//
//     /**
//      * @override
//      */
//     isRecognized(frame) {
//         let hand = frame.hands[this.handIndex];
//         let handPosition = hand.indexFinger.tipPosition;
//
//         switch (this.gesturePartStep) {
//             case 0: // Check the initial position.
//                 if (this.previousHandPosition
//                     && this._isHandGoingDown(this.previousHandPosition, handPosition)) {
//                     this.previousHandPeak = this.previousHandPosition;
//                     this.gesturePartStep++;
//                 } else if (this.previousHandPosition && this._isHandGoingUp(this.previousHandPosition, handPosition)) {
//                     this.previousHandPosition = handPosition;
//                 }
//                 break;
//
//             case 1: // Check if the finger went down.
//                 if (this._hasHandTraveledDown(this.previousHandPeak, handPosition)
//                     && this._isHandGoingUp(this.previousHandPosition, handPosition)) {
//                     this.previousHandPeak = this.previousHandPosition;
//                     this.gesturePartStep++;
//                 }
//                 break;
//
//             case 2: // Check if finger/hand went back to the initial position.
//                 if (this._hasHandTraveledUp(this.previousHandPeak, handPosition)) {
//                     this.previousHandPeak = this.previousHandPosition;
//                     this.gesturePartStep++;
//                 }
//                 break;
//
//             default: // State = 3 ; The previous state was successful, ti means that the gesture has been recognized.
//                 log.debug("gameModel.GestureHammerPart.isRecognized : OK");
//                 return true;
//         }
//
//         this.previousHandPosition = handPosition;
//
//         return false;
//     }
//
//     _hasHandTraveledDown(before, after) {
//         let difference = before[1] - after[1];
//         return difference > 30;
//     }
//
//     _hasHandTraveledUp(before, after) {
//         let difference = after[1] - before[1];
//         return difference > 30;
//     }
//
//     _isHandGoingUp(before, after) {
//         return before[1] < after[1];
//     }
//
//     _isHandGoingDown(before, after) {
//         return before[1] > after[1];
//     }
// }
//
// class GestureRotationStartPart extends GesturePart {
//
//     /**
//      * @override
//      */
//     constructor(gesturePartId, clockwise) {
//         super(gesturePartId);
//         this.direction = clockwise ? 1 : -1;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         // Nothing
//     }
//
//     /**
//      * @override
//      */
//     isRecognized(frame) {
//         if (frame.hands.length !== 2) {
//             return false;
//         }
//
//         for (const hand of frame.hands) {
//             const normal = hand.palmNormal[1] * this.direction;
//             if (normal > -0.8) {
//                 log.debug("gameModel.GestureRotationPartStart.isRecognizedStart : KO");
//                 return false;
//             }
//         }
//
//         log.debug("gameModel.GestureRotationPartStart.isRecognizedStart : OK");
//         return true;
//     }
// }
//
// class GestureRotationPart extends GesturePart {
//
//     /**
//      * @override
//      */
//     constructor(gesturePartId, clockwise) {
//         super(gesturePartId);
//         this.handRotationDirection = clockwise ? 1 : -1;
//         this.previousNormals = [-1, -1];
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.previousNormals = [-1, -1];
//     }
//
//     /**
//      * @override
//      */
//     isRecognized(frame) {
//         if (frame.hands.length !== 2) {
//             return false;
//         }
//
//         for (const [i, hand] of frame.hands.entries()) {
//             // Normal
//             const normal = hand.palmNormal[1] * this.handRotationDirection;
//             if (normal < this.previousNormals[i] - 0.1) {
//                 log.debug("GestureRotationPart.isRecognized : Miss gesturing: Hands turning backward");
//                 return false;
//             } else {
//                 this.previousNormals[i] = Math.max(normal, this.previousNormals[i]);
//             }
//
//             if (normal < 0.8) {
//                 log.debug("gameModel.GestureRotationPart.isRecognized : Unfinished gesture");
//                 return false;
//             }
//
//             // Grab
//             if (hand.grabStrength === 1) {
//                 log.debug("GestureRotationPart.isRecognized : Miss gesturing: Hands not open enough");
//                 return false;
//             }
//         }
//
//         log.debug("gameModel.GestureRotationPart.isRecognized : OK");
//         return true;
//     }
// }
//
// class GestureGrabStartPart extends GesturePart {
//
//     /**
//      * @override
//      */
//     constructor(gesturePartId, grab) {
//         super(gesturePartId);
//         this.grab = grab;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         // Nothing
//     }
//
//     /**
//      * @override
//      */
//     isRecognized(frame) {
//         if (frame.hands.length !== 1) {
//             return false;
//         }
//
//         const hand = frame.hands[0];
//         const strength = this.grab ? hand.grabStrength : 1 - hand.grabStrength;
//         if (strength <= 0.05) {
//             log.debug("gameModel.GestureGrabStartPart.isRecognizedStart : OK");
//             return true;
//         } else {
//             log.debug("gameModel.GestureGrabStartPart.isRecognizedStart : KO");
//             return false;
//         }
//     }
// }
//
// class GestureGrabPart extends GesturePart {
//
//     /**
//      * @override
//      */
//     constructor(gesturePartId, grab) {
//         super(gesturePartId);
//         this.grab = grab;
//         this.previousStrength = 0;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.previousStrength = 0;
//     }
//
//     /**
//      * @override
//      */
//     isRecognized(frame) {
//         if (frame.hands.length !== 1) {
//             return false;
//         }
//
//         const hand = frame.hands[0]
//         const strength = this.grab ? hand.grabStrength : 1 - hand.grabStrength;
//         if (strength < this.previousStrength - 0.05) {
//             log.debug("GestureGrabPart.isRecognized : Miss gesturing: decreasing grabStrength");
//             return false;
//         } else {
//             this.previousStrength = Math.max(strength, this.previousStrength);
//         }
//
//         if (strength < 0.95) {
//             log.debug("gameModel.GestureRotationPart.isRecognizedEnd : unfinished gesture");
//             return false;
//         }
//
//         log.debug("gameModel.GestureRotationPart.isRecognized : OK");
//         return true;
//     }
// }
//
// class GestureStairsPart extends GesturePart {
//
//     /**
//      * @override
//      */
//     constructor(gesturePartId, handMustMove) {
//         super(gesturePartId);
//         this.handMustMove = handMustMove;
//         this.handMustStayStatic = this.handMustMove === "left" ? "right" : "left";
//         this.lowestPositions = null;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.lowestPositions = null;
//     }
//
//     /**
//      * @override
//      */
//     isRecognized(frame) {
//         let handMoving = frame.hands[this.handMustMove];
//         let handStatic = frame.hands[this.handMustStayStatic];
//
//         for (const hand of frame.hands) {
//             if (hand.type === this.handMustMove) {
//                 handMoving = hand;
//             } else {
//                 handStatic = hand;
//             }
//         }
//
//         let positions = {
//             right: null,
//             left: null
//         };
//
//         positions[this.handMustMove] = handMoving.palmPosition;
//         positions[this.handMustStayStatic] = handStatic.palmPosition;
//
//         if (!this.lowestPositions) { // Initializes positions.
//             this.lowestPositions = positions;
//
//         } else if (this._hasHandNotMove(this.lowestPositions[this.handMustMove], positions[this.handMustMove])) { // Static hand still moves but not the moving hand.
//             // If the "moving hand" has not move yet, the other "static hand" that is supposed to still static could still move (from the previous part where it was the moving hand).
//             // Therefore, we allow this movement until the "moving hand" starts its movement. To that end, we update the initial position of the "still hand" to the last known.
//             this.lowestPositions[this.handMustStayStatic] = positions[this.handMustStayStatic];
//             log.debug(`gameModel.GestureStairPart.isRecognized : ${this.handMustStayStatic} still moving from previous gesture part : OK`);
//
//         } else if (!this._hasHandNotMove(this.lowestPositions[this.handMustStayStatic], positions[this.handMustStayStatic])) { // Static hand move but it not supposed to (KO).
//             // If the "moving hand" starts to move, we force the "static hand" to stay static during the gesture part.
//             // If the static hand moves, the gestures part is not recognized.
//             log.debug(`gameModel.GestureStairPart.isRecognized : ${this.handMustStayStatic} has moved : KO`);
//
//         } else if (this._hasHandTraveledUp(this.lowestPositions[this.handMustMove], positions[this.handMustMove])) { // Static hand stay static AND the moving hand has moved (OK).
//             log.debug(`gameModel.GestureStairPart.isRecognized : ${this.handMustMove} : OK`);
//             return true;
//         }
//
//         return false;
//     }
//
//     _hasHandTraveledUp(before, after) {
//         let difference = after[1] - before[1];
//         return difference > 50;
//     }
//
//     _hasHandNotMove(before, after) {
//         let difference = Math.abs(after[1] - before[1]);
//         return difference < 10;
//     }
// }
//
// class GestureScratchPart extends GesturePart {
//
//     /**
//      * @override
//      */
//     constructor(gesturePartId) {
//         super(gesturePartId);
//         this.gesturePartStep = 0;
//         this.previousPalmPosition = null;
//         this.positionPalmPeak = null;
//     }
//
//     /**
//      * @override
//      */
//     init() {
//         this.gesturePartStep = 0;
//         this.previousPalmPosition = null;
//         this.positionPalmPeak = null;
//     }
//
//     /**
//      * @override
//      */
//     isRecognized(frame) {
//
//         let hand = frame.hands[0];
//         let palmPosition = hand.palmPosition;
//
//         switch (this.gesturePartStep) {
//             case 0: // Check the initial position.
//                 if (this.previousPalmPosition && this._isHandGoingRight(this.previousPalmPosition, palmPosition)) {
//                     this.positionPalmPeak = this.previousPalmPosition;
//                     this.gesturePartStep++;
//                 } else if (this.previousPalmPosition && this._isHandGoingLeft(this.previousPalmPosition, palmPosition)) {
//                     this.previousPalmPosition = palmPosition;
//                 }
//                 break;
//
//             case 1: // Check if the hand went right.
//                 if (this._hasHandTraveledRight(this.positionPalmPeak, palmPosition) && this._isHandGoingLeft(this.previousPalmPosition, palmPosition)) {
//                     this.positionPalmPeak = this.previousPalmPosition;
//                     this.gesturePartStep++;
//                 }
//                 break;
//
//             case 2: // Check if hand went back to the initial position.
//                 if (this._hasHandTraveledLeft(this.positionPalmPeak, palmPosition)) {
//                     this.positionPalmPeak = this.previousPalmPosition;
//                     this.gesturePartStep++;
//                 }
//                 break;
//
//             default: // State = 3 ; The previous state was successful, it means that the gesture has been recognized.
//                 log.debug(`gameModel.GestureScratchPart.isRecognized : OK`);
//                 return true;
//         }
//
//         this.previousPalmPosition = palmPosition;
//
//         return false;
//     }
//
//     _hasHandTraveledRight(before, after) {
//         let difference = before[0] - after[0];
//         return difference > 30;
//     }
//
//     _hasHandTraveledLeft(before, after) {
//         let difference = after[0] - before[0];
//         return difference > 30;
//     }
//
//     _isHandGoingLeft(before, after) {
//         return before[0] < after[0];
//     }
//
//     _isHandGoingRight(before, after) {
//         return before[0] > after[0];
//     }
// }

class PalmIsOpen extends GesturePart {

    /**
     * @override
     */
    constructor(handSide) {
        super();
        this.handSide = handSide !== hand.ANY ? handSide : 0; // If any hand, take the first one.
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
            log.debug("gameModel.PalmIsOpen.isRecognizedStart : OK");
        } else {
            log.debug("gameModel.PalmIsOpen.isRecognizedStart : OK");
        }

        return isRecognized;
    }
}

class PalmIsPinching extends GesturePart {

    /**
     * @override
     */
    constructor(handSide) {
        super();
        this.nearHandClosed = 0.8; // 0 = opened ; 1 = closed.
        this.handSide = handSide !== hand.ANY ? handSide : 0; // If any hand, take the first one.
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
        let isRecognized = true;

        if (this.hasOpenedAgain === true) { // Once the hand has opened again, the gesture is blocked to the fail state.
            isRecognized = false;
        } else {

            let currentPinchStrength = frame.hands[this.handSide].pinchStrength;

            if (currentPinchStrength < this.previousPinchStrength) { // Hand has opened again.
                this.hasOpenedAgain = true;

            } else if (currentPinchStrength >= this.previousPinchStrength && currentPinchStrength < this.nearHandClosed) { // Hand progress towards the closed hand.
                this.previousPinchStrength = currentPinchStrength;

            } else { // Hand has reached the step before the total closed-hand step.
                isRecognized = true;
            }
        }
        return isRecognized;
    }
}

class PalmIsClosed extends GesturePart {

    /**
     * @override
     */
    constructor(handSide) {
        super();
        this.nearHandClosed = 0.8; // 0 = opened ; 1 = closed.
        this.handSide = handSide !== hand.ANY ? handSide : 0; // If any hand, take the first one.
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
        let isRecognized = true;
        if (frame.hands[this.handSide].pinchStrength < this.nearHandClosed) {
            isRecognized = false;
        }
        return isRecognized;
    }
}