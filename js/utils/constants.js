/**
 * @overview This file contains all the constants needed for the game.
 */

// Enumerations
const view = {
    MENU: 'menu',
    LEVEL: 'level',
    END: 'end'
};

// Constants values
const SECOND_TO_MILLISECONDS = 1000;

// Constants functions
function log(message) {
    console.log("[" + moment().format('DD-MM-YYYY h:mm:ss') + "] : " + message);
}