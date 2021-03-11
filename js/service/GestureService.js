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
class GestureServiceLeapMotion extends GestureService {

    /**
     * Instantiates a gesture recognizer.
     */
    constructor() {
        super();
        this.CLICK_COOLDOWN = 500;
        this.lastClickTime = 0;
        this.bugMsgSent = false;

        this.controller = null;
        this._setupController();

        this.light = null;
        this._setup3DScene();

        this.recognizableGestures = null;
        this._setupGestureMap();
    }

    /**
     * Setup the controller
     */
    _setupController() {
        this.controller = new Leap.Controller();
        this.controller.use('riggedHand').connect();
        this.controller.on('frame', (frame) => {
            /* Sometimes, window.getComputedStyle(...) as below return an CSS style string with empty values.
            Therefore, the method handMesh.screenPosition(...) return an error, and there is no hands visualization.
            No solution as been found at this moment to solve this problem except reloading the page. 
            The line below is there to empeach the software to freeze. */
            if(window.getComputedStyle(this.controller.plugins.riggedHand.renderer.domElement).width == ""){
                // Sent debug message only once to not spam the console
                if(!this.bugMsgSent){
                    log.debug("Visualization bugging");
                    this.bugMsgSent = true;
                }
                return;
            }

            if(Date.now()- this.lastClickTime < this.CLICK_COOLDOWN) return;
            
            for (const hand of frame.hands) {
                let handMesh = hand.data('riggedHand.mesh');

                // Get the position of the element that is the most close to the limit. The closest of the screen.
                let furthestPos = handMesh.screenPosition(hand.palmPosition);
                let fingerPos;

                for(const finger of hand.fingers){
                    fingerPos = handMesh.screenPosition(finger.tipPosition);
                    if(fingerPos.z > furthestPos.z) {
                        furthestPos = fingerPos;
                    }
                }

                if(furthestPos.z > 1){
                    log.debug("handSide click detected");
                    let elementPointed = document.elementFromPoint(furthestPos.x,  window.innerHeight-furthestPos.y);
                    if(elementPointed){
                        elementPointed.click();
                        this.lastClickTime = Date.now();
                    }
                }
            }
        });
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
     * Setup the gesture map
     */
    _setupGestureMap() {
        this.recognizableGestures = new Map();
        this.recognizableGestures.set("HAMMER1", new GestureHammer1LeapMotion("HAMMER1", 0.7, "/assets/data/gestures-illustrations/hammer.gif"));
        this.recognizableGestures.set("HAMMER3", new GestureHammer3LeapMotion("HAMMER3", 1.5, "/assets/data/gestures-illustrations/hammer3.gif"));
        this.recognizableGestures.set("GRAB", new GrabGestureLeapMotion("GRAB", 0.7, "/assets/data/gestures-illustrations/grab.gif"));
        this.recognizableGestures.set("UNGRAB", new ReleaseGestureLeapMotion("UNGRAB", 0.7, "/assets/data/gestures-illustrations/ungrab.gif"));
        this.recognizableGestures.set("ROTATION", new RotationGestureLeapMotion("ROTATION", 1.5, "/assets/data/gestures-illustrations/rotation.gif"));
        this.recognizableGestures.set("REVERSED_ROTATION", new ReversedRotationGestureLeapMotion("REVERSED_ROTATION", 1.5, "/assets/data/gestures-illustrations/reversed-rotation.gif"));
        this.recognizableGestures.set("STAIRS", new GestureStairsLeapMotion("STAIRS", 2.8, "/assets/data/gestures-illustrations/stairs.gif"));
        this.recognizableGestures.set("SCRATCH", new GestureScratchLeapMotion("SCRATCH", 1.5, "/assets/data/gestures-illustrations/scratch.gif"));
        this.recognizableGestures.set("PINCH1", new Pinch1GestureLeapMotion("PINCH1", 1, "/assets/data/gestures-illustrations/pinch1.gif"));
        this.recognizableGestures.set("PINCH3", new Pinch3GestureLeapMotion("PINCH3", 2.5, "/assets/data/gestures-illustrations/pinch3.gif"));
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

