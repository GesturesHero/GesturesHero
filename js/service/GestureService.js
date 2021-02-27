/**
 * @overview This file contains the available gesture services.
 */

// ----------------------------------------------------------------------------------------------------- GESTURE SERVICE

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

                // Get the position of the element that is the most close to the limit. The closest of the screen.
                let screenPosition = (() => {
                    let furthestPos = handMesh.screenPosition(hand.palmPosition);

                    for(const finger of hand.fingers){

                        let fingerPos = handMesh.screenPosition(finger.tipPosition);
                        if(fingerPos.z > furthestPos.z) {
                            furthestPos = fingerPos;
                            furthestPos.z = fingerPos.z;
                        }
                    }
                    return furthestPos;
                })();

                if(screenPosition.z > 1){
                    log.debug("handSide click detected");
                    let elementPointed = document.elementFromPoint(screenPosition.x,  window.innerHeight-screenPosition.y);
                    if(elementPointed){
                        console.log(elementPointed);
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
        // this.recognizableGestures.set("HAMMER1", new GestureHammer1LeapMotion("HAMMER1", 0.7, "/assets/data/gestures-illustrations/hammer.gif"));
        // this.recognizableGestures.set("HAMMER3", new GestureHammer3LeapMotion("HAMMER3", 1.5, "/assets/data/gestures-illustrations/hammer3.gif"));
        // this.recognizableGestures.set("GRAB", new GestureGrabLeapMotion("GRAB", 0.7, "/assets/data/gestures-illustrations/grab.gif", true));
        // this.recognizableGestures.set("UNGRAB", new GestureGrabLeapMotion("UNGRAB", 0.7, "/assets/data/gestures-illustrations/ungrab.gif", false));
        // this.recognizableGestures.set("ROTATION", new GestureRotationLeapMotion("ROTATION", 1.5, "/assets/data/gestures-illustrations/rotation.gif", true));
        // this.recognizableGestures.set("REVERSED_ROTATION", new GestureRotationLeapMotion("REVERSED_ROTATION", 1.5, "/assets/data/gestures-illustrations/reversed-rotation.gif", false));
        // this.recognizableGestures.set("STAIRS", new GestureStairsLeapMotion("STAIRS", 2.8, "/assets/data/gestures-illustrations/stairs.gif"));
        // this.recognizableGestures.set("SCRATCH", new GestureScratchLeapMotion("SCRATCH", 1.5, "/assets/data/gestures-illustrations/scratch.gif"));
        this.recognizableGestures.set("PINCH1", new Pinch1GestureLeapMotion("PINCH1", 1, "/assets/data/gestures-illustrations/pinch1.gif"));
        this.recognizableGestures.set("PINCH3", new Pinch3GestureLeapMotion("PINCH3", 2.5, "/assets/data/gestures-illustrations/pinch3.gif"));
    }

    /**
     * Setup a virtual 3D scene in which a real time feedback of the player's hands, recorded by the LeapMotion, is displayed under the form of 3D models.
     * This methods instantiates the 3D scene, place the camera (for orienting the view of the hands), and the lights (for colouring the hands).
     * NOTE : The "riggedHand" plugin adds a canvas covering the entire browser.
     */
    _setup3DScene() {
        // It creates the camera.
        let distCamera = 500;
        let heightCamera = 300;
        let ratio = 4;
        //let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, distCamera+150);
        let camera = new THREE.OrthographicCamera( 
            window.innerWidth / - ratio, // LEFT frustum plane
            window.innerWidth / ratio, // RIGHT frustum plane
            window.innerHeight / ratio, // TOP frustum plane
            window.innerHeight / - ratio, // BOTTOM frustum plane
            1, distCamera+150);
        camera.position.fromArray([0, heightCamera, distCamera]); // Setup the position of the camera in the scene. Where (0, 0, 0) is the leapmotion
        camera.lookAt(new THREE.Vector3(0, heightCamera, 0)); // Setup the point which the camera is pointing on

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

