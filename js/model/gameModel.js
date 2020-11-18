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
     * 
     */
    init(){
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
        let temp = this.recognized;
        this.init();
        return temp;
    }
}

class GestureHammerLeapMotion extends Gesture {

    constructor(gestureId, durationInSec, illustrationUrl, gestureParts) {
        super(gestureId, durationInSec, illustrationUrl, gestureParts);
    }

    /**
     * @override
     */
    init(){
        this.gestureParts = [
            [ new GestureHammerPart(1,0), new GestureHammerPart(2,1) ],
            [ new GestureHammerPart(3,0), new GestureHammerPart(4,1) ],
            [ new GestureHammerPart(5,0), new GestureHammerPart(6,1) ],
        ]
        this.gestureCount = this.gestureParts.length;
        this.hand1Index = 0;
        this.hand2Index = 0;
        this.recognized = false;
    }
    
    /**
     * @override
     */
    check(frame){
        if(frame.hands.length != 2) return;
        if(this.hand1Index < this.gestureCount
        && this.gestureParts[this.hand1Index][0].isRecognized(frame)){
            this.hand1Index++;
            log.debug("hand1 "+this.hand1Index + "/"+ this.gestureCount);
        }
        if(this.hand2Index < this.gestureCount
        && this.gestureParts[this.hand2Index][1].isRecognized(frame)){
            this.hand2Index++;
            log.debug("hand2 "+this.hand2Index + "/"+ this.gestureCount);
        }
        this.recognized = this.hand1Index + this.hand2Index == this.gestureCount*2;
        //if(this.recognized) console.log("yep");
    }
}

class GestureRotationLeapMotion extends Gesture {

    constructor(gestureId, durationInSec, illustrationUrl, gestureParts) {
        super(gestureId, durationInSec, illustrationUrl, gestureParts);
    }

    /**
     * @override
     */
    init(){
        this.gestureParts = [
            new GestureRotationPartStart(),
            new GestureRotationPart()
        ];
        this.gestureIndex = 0;
        this.gestureCount = this.gestureParts.length;
        this.recognized = false;
    }
    
    /**
     * @override
     */
    check(frame){
        if(this.gestureIndex < this.gestureCount && this.gestureParts[this.gestureIndex].isRecognized(frame)) this.gestureIndex++;
        this.recognized = this.gestureIndex == this.gestureCount;
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

class GestureHammerPart extends GesturePart {
    constructor(gesturePartId, handIndex) {
        super(gesturePartId);
        
        this.posPeak = null;
        this.posPrev = null;
        this.etape = 0;
        this.handIndex = handIndex;
    }

    /**
     * @override
     */
    isRecognized(frame) {
        var hand = frame.hands[this.handIndex];
        var pos = hand.indexFinger.tipPosition;

        switch(this.etape){
            case 0: // check if initial position
                if(this._isCheckFistWithIndexFinger(hand)
                && this.posPrev
                && this._isHandGoingDown(this.posPrev, pos)){
                    this.posPeak = this.posPrev;
                    this.etape++;
                }
                break;

            case 1: // check if finger went down
                if(this._isCheckFistWithIndexFinger(hand)
                && this._hasHandTraveledDown(this.posPeak, pos)
                && this._isHandGoingUp(this.posPrev, pos)){
                    this.posPeak = this.posPrev;
                    this.etape++;
                }
                break;

            case 2: // check if finger/hand went back to initial position
                if(this._isCheckFistWithIndexFinger(hand)
                && this._hasHandTraveledUp(this.posPeak, pos)
                && this._isHandGoingDown(this.posPrev, pos)){
                    this.posPeak = this.posPrev;
                    this.etape++;
                }
                break;

            default: // state = 3, previous state was successful -> gesture recognized
                return true;
        }

        this.posPrev = pos;
        
        return false;
    }

    _isCheckFistWithIndexFinger(hand){
        if(hand.indexFinger.extended
        && !hand.thumb.extended
        && !hand.middleFinger.extended
        && !hand.ringFinger.extended
        && !hand.pinky.extended){
            return true;
        }
        else{
            return true;
        }
    }

    _hasHandTraveledDown(before, after){
        var diff = before[1]-after[1];
        return diff > 30;
    }

    _hasHandTraveledUp(before, after){
        var diff = after[1]-before[1];
        return diff > 30;
    }

    _isHandGoingUp(before, after){
        return before[1] < after[1];
    }

    _isHandGoingDown(before, after){
        return before[1] > after[1];
    }
}

class GestureRotationPartStart extends GesturePart {

    /**
     * @override
     */
    constructor(gesturePartId) {
        super(gesturePartId);
    }

    /**
     * @override
     */
    isRecognized(frame) {
        if (frame.hands.length !== 2) {
            return false;
        }

        return this.isRecognizedStart(frame);
    }

    isRecognizedStart(frame) {
        for (const [i, hand] of frame.hands.entries()) {
            const normal = hand.palmNormal[1];
            if (normal > -0.9) {
                return false;
            }
        }

        log.debug("gameModel.GestureRotationPartStart :  recognized");
        return true;
    }
}

class GestureRotationPart extends GesturePart {

    /**
     * @override
     */
    constructor(gesturePartId) {
        super(gesturePartId);
        this.previousNormals = [-1, -1];
    }

    /**
     * @override
     */
    isRecognized(frame) {
        if (frame.hands.length !== 2) {
            return false;
        }

        return this.isRecognizedFrame(frame);
    }

    isRecognizedFrame(frame) {
        for (const [i, hand] of frame.hands.entries()) {
            const [_, normalY, normalZ] = hand.palmNormal;

            // Normal
            if (normalY < this.previousNormals[i] - 0.1) {
                return false;
            }

            this.previousNormals[i] = Math.max(normalY, this.previousNormals[i]);
            
            if (normalZ < -0.3 || normalZ > 0.3) {
                return false;
            }

            // Grab
            if (hand.grabStrength !== 0) {
                return false;
            }
            
            // Direction
            const [x, y, z] = hand.direction;
            if (hand.type === 'left') {
                if (x < -0.2 || x > 0.5) {
                    return false;
                }
            } else {
                if (x < -0.5 || x > 0.2) {
                    return false;
                }
            }

            if (y < -0.3 || y > 0.3 || z > -0.8) {
                return false;
            }
        }

        return this.isRecognizedEnd(frame);
    }

    isRecognizedEnd(frame) {
        for (const hand of frame.hands) {
            if (hand.palmNormal[1] < 0.9) {
                return false;
            }
        }

        log.debug("gameModel.GestureRotationPart.isRecognizedEnd : OK");
        return true;
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