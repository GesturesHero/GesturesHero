/**
 * @overview This file contains the available gesture services.
 */

// ---------------------------------------------------------------------------------------------------GESTURE SERVICE

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
        this.controller = new Leap.Controller();
        this.controller.use('riggedHand').connect();
        this.CLICK_COOLDOWN = 500;
        this.lastClickTime = 0;

        const checkClick = (frame) => {
            if(Date.now()- this.lastClickTime < this.CLICK_COOLDOWN) return;
            for (const hand of frame.hands) {
                let handMesh = hand.data('riggedHand.mesh');
                let screenPosition = handMesh.screenPosition(
                    //hand.fingers[1].tipPosition
                    hand.palmPosition
                );
                if(screenPosition.z > 1){
                    log.debug("hand click detected");
                    let elementPointed = document.elementFromPoint(screenPosition.x,  window.screen.height-screenPosition.y);
                    if(elementPointed){
                        elementPointed.click();
                        this.lastClickTime = Date.now();
                    }
                }
            }
        };

        this.controller.on('frame', checkClick);

        this.light = null;
        this._setup3DScene();

        this.recognizableGestures = new Map();
        this.recognizableGestures.set("HAMMER1", new GestureHammer1LeapMotion("HAMMER1", 0.7, "/assets/data/gestures-illustrations/hammer.gif"));
        this.recognizableGestures.set("HAMMER3", new GestureHammer3LeapMotion("HAMMER3", 1.5, "/assets/data/gestures-illustrations/hammer3.gif"));
        this.recognizableGestures.set("ROTATION", new GestureRotationLeapMotion("ROTATION", 1.5, "/assets/data/gestures-illustrations/rotation.gif", true));
        this.recognizableGestures.set("REVERSED_ROTATION", new GestureRotationLeapMotion("REVERSED_ROTATION", 1.5, "/assets/data/gestures-illustrations/reversed-rotation.gif", false));
        this.recognizableGestures.set("STAIRS", new GestureStairsLeapMotion("STAIRS", 2.8, "/assets/data/gestures-illustrations/stairs.gif"));
        this.recognizableGestures.set("SCRATCH", new GestureScratchLeapMotion("SCRATCH", 1.5, "/assets/data/gestures-illustrations/scratch.gif"));
    }

    /**
     * Setup a virtual 3D scene in which a real time feedback of the player's hands, recorded by the LeapMotion, is displayed under the form of 3D models.
     * This methods instantiates the 3D scene, place the camera (for orienting the view of the hands), and the lights (for colouring the hands).
     * NOTE : The "riggedHand" plugin adds a canvas covering the entire browser.
     */
    _setup3DScene() {
        // It creates the camera.
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 600);
        camera.position.fromArray([0, 200, 500]); // Setup the position of the camera in the scene. Where (0, 0, 0) is the leapmotion
        camera.lookAt(new THREE.Vector3(0, 200, 0)); // Setup the point which the camera is pointing on

        // It links the camera with the 3D scene.
        let scope = this.controller.plugins.riggedHand;
        scope.camera = camera;

        // It colors the hands.
        this.light = new THREE.PointLight(0x33cccc, 1, 10000);
        this.light.position.set(0, 0, 250);
        scope.scene.add(this.light);
    }

    /**
     * Sets the color of the hands that are shown in real time.
     * @param color {String} A hexadecimal color code.
     */
    setHandsColor(color) {
        if (this.light) this.light.color = new THREE.Color(color);
    }

    /**
     * Initiates the gesture recognition.
     * @param gestureId {string} The id of the gesture to recognize.
     * @param callback {function} The callback to call on end of the recognition.
     */
    recognize(gestureId, callback) {
        log.info(`New gesture : ${gestureId}`);
        let gestureToRecognize = this.recognizableGestures.get(gestureId);

        const onFrame = (frame) => {
            gestureToRecognize.check(frame);
        };

        this.controller.on('frame', onFrame);
        setTimeout(() => {
            this.controller.removeListener('frame', onFrame);
            let isRecognized = gestureToRecognize.isRecognized();
            log.debug(`GestureService.recognize : ${isRecognized}`);
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
    getGestureDuration(gestureId) {
        let gesture = this.recognizableGestures.get(gestureId);
        return gesture !== undefined ? gesture.getDurationInSec() : undefined;
    }
}

