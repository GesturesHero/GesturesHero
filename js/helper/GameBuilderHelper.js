/**
 * @overview This file contains the available game builders helpers.
 */

// ---------------------------------------------------------------------------------------------------------GAME BUILDER

/**
 * @overview Represents an abstract game builder.
 */
class AbstractGameBuilder {

    /**
     * Instantiates a game builder.
     */
    constructor() {
    }

    /**
     * @param gameRepresentation {?} A given game representation under any format.
     * @return {Game} A game object corresponding to the given representation.
     */
    buildFrom(gameRepresentation) {
        return new Game();
    }

}

// ----------------------------------------------------------------------------------------------------JSON GAME BUILDER

/**
 * @overview Represents a JSON game builder.
 */

class JSONGameBuilder extends AbstractGameBuilder {


    /**
     * Instantiates a JSON game builder.
     */
    constructor() {
        super();
    }

    /**
     * @override AbstractGameBuilder.buildFrom
     * @param gameRepresentation {JSON} A JSON representation of the game.
     * @return {Game} A game object corresponding to the JSON representation.
     */
    buildFrom(gameRepresentation) {
        return new Game();
    }

}

