/**
 * @overview This file contains the available gesture services.
 */

// ---------------------------------------------------------------------------------------------------GESTURE RECOGNIZER

/**
 * @overview Represents an abstract gesture service.
 */
class GestureService {

    /**
     * Instantiates a gesture recognizer.
     */
    constructor() {
    }

    /**
     * @param gestureId {string} The id of the gesture to recognize.
     * @param timeout {number} The amount of seconds between the ones the gesture must be recognized.
     * @param callback {function} The callback to call on end of the recognition.
     */
    recognize(gestureId, timeout, callback) {
    }
}


/**
 * @overview Represents gesture service for LeapMotion.
 */
class LeapMotionGestureService {

    /**
     * Instantiates a gesture recognizer.
     */
    constructor() {
        // TODO : Manage the LeapMotion connexion.
        this.recognizableGestures = new Map();
        this.recognizableGestures.set("HAMMER", new GestureHammerLeapMotion("HAMMER", 1, "/assets/data/gestures-illustrations/hammer.png", []));
        this.recognizableGestures.set("ROTATION", new GestureRotationLeapMotion("ROTATION", 1, "/assets/data/gestures-illustrations/rotation.png", []));
    }

    /**
     * @param gestureId {string} The id of the gesture to recognize.
     * @param callback {function} The callback to call on end of the recognition.
     */
    recognize(gestureId, callback) {
        let gestureToRecognize = this.recognizableGestures.get(gestureId);
        // TODO : Recognize via the LeapMotion
        setTimeout(() => {
            if (gestureToRecognize.isRecognized()) {
                callback(true);
            } else {
                callback(false);
            }
        }, gestureToRecognize.getDurationInSec() * SECOND_TO_MILLISECONDS);
    }

    /**
     * Gets the gesture illustration URL.
     * @param levelId {string} The gesture id.
     */
    getGestureIllustrationUrl(levelId) {
        let gesture = this.recognizableGestures.get(levelId);
        return gesture !== undefined ? gesture.getIllustrationUrl() : undefined;
    }
}

