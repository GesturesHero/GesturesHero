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
class LeapMotionGestureService extends GestureService {

    /**
     * Instantiates a gesture recognizer.
     */
    constructor() {
        super();
        // TODO : Manage the LeapMotion connexion.
        this.controller = new Leap.Controller();
        this.controller.connect();

        this.recognizableGestures = new Map();
        this.recognizableGestures.set("HAMMER", new GestureHammerLeapMotion("HAMMER", 3, "/assets/data/gestures-illustrations/hammer.png", []));
        this.recognizableGestures.set("HAMMER_FAST", new GestureHammerLeapMotion("HAMMER_FAST", 2, "/assets/data/gestures-illustrations/hammer.png", []));
        this.recognizableGestures.set("ROTATION", new GestureRotationLeapMotion("ROTATION", 1.5, "/assets/data/gestures-illustrations/rotation.png", []));
    }

    /**
     * @param gestureId {string} The id of the gesture to recognize.
     * @param callback {function} The callback to call on end of the recognition.
     */
    recognize(gestureId, callback) {
        let gestureToRecognize = this.recognizableGestures.get(gestureId);
        console.log(gestureId);
        const onFrame = (frame) => {
            gestureToRecognize.check(frame);
        };
        this.controller.on('frame', onFrame);

        setTimeout(() => {
            this.controller.removeListener('frame', onFrame);
            let isRecognized = gestureToRecognize.isRecognized();
            log(`GestureService.recognize : ${isRecognized}`);
            callback(isRecognized);
        }, gestureToRecognize.getDurationInSec() * SECOND_TO_MILLISECONDS);
    }

    /**
     * Gets the gesture illustration URL.
     * @param gestureId {string} The gesture id.
     */
    getGestureIllustrationUrl(gestureId) {
        let gesture = this.recognizableGestures.get(gestureId);
        return gesture !== undefined ? gesture.getIllustrationUrl() : undefined;
    }

    /**
     * Gets the gesture duration.
     * @param gestureId {string} The gesture id.
     */
    getGestureDuration(gestureId){
        let gesture = this.recognizableGestures.get(gestureId);
        return gesture !== undefined ? gesture.getDurationInSec() : undefined;
    }
}

