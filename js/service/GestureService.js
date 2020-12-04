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
        /* The "riggedHand" plugin add a canvas covering the entire browser. 
        It creates a virtual 3D scene in which the plugin will display 3D models of hands base on the real position got by the leapMotion. */
        this.controller.use('riggedHand').connect();
        this._setup3DScene();

        this.recognizableGestures = new Map();
        this.recognizableGestures.set("HAMMER", new GestureHammerLeapMotion("HAMMER", 3, "/assets/data/gestures-illustrations/hammer.gif", []));
        this.recognizableGestures.set("HAMMER_FAST", new GestureHammerLeapMotion("HAMMER_FAST", 1.5, "/assets/data/gestures-illustrations/hammer.gif", []));
        this.recognizableGestures.set("ROTATION", new GestureRotationLeapMotion("ROTATION", 1.5, "/assets/data/gestures-illustrations/rotation.gif", [], true));
        this.recognizableGestures.set("REVERSED_ROTATION", new GestureRotationLeapMotion("REVERSED_ROTATION", 1.5, "/assets/data/gestures-illustrations/reversed-rotation.gif", [], false));
        this.recognizableGestures.set("STAIRS", new GestureStairsLeapMotion("STAIRS", 3, "/assets/data/gestures-illustrations/stairs.gif", []));
        this.recognizableGestures.set("SCRATCH", new GestureScratchLeapMotion("SCRATCH", 1, "/assets/data/gestures-illustrations/scratch.gif", []));
        
        this.light = null;
    }

    /**
     * Setup the 3D scene. Place camera and add lights.
     */
    _setup3DScene(){
        // We create the camera that will be in the 3D scene to "record" the hands
        let camera = new THREE.PerspectiveCamera(45 , window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.fromArray([0, 200, 500]); // Setup the position of the camera in the scene. Where (0, 0, 0) is the leapmotion
        camera.lookAt(new THREE.Vector3(0, 200, 0)); // Setup the point which the camera is pointing on
        // Link the camera and the 3D scene
        let scope = this.controller.plugins.riggedHand; 
        scope.camera = camera;
        
        this.light = new THREE.PointLight( 0x33cccc, 1, 10000 );
        this.light.position.set( 0, 0, 250 );
        scope.scene.add( this.light );
    }

    /**
     * Sets the color of the hands that are shown in real time.
     * @param color {String} A hexadecimal color code. 
     */
    setHandsColor(color){
        if(this.light) this.light.color = new THREE.Color(color);
    }

    /**
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
    getGestureDuration(gestureId){
        let gesture = this.recognizableGestures.get(gestureId);
        return gesture !== undefined ? gesture.getDurationInSec() : undefined;
    }
}

