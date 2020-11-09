/**
 * @overview This file contains all the constants needed for the game.
 */

// Enumerations
const view = {
    MENU: 'menu',
    LEVEL: 'level',
    LEVEL_COMPLETED: 'level_completed',
    LEVEL_FAILED: 'level_failed',
    END: 'end'
};

// Constants values
const SECOND_TO_MILLISECONDS = 1000;
const LEVEL_LIVES_AMOUNT = 3;

// Constants functions
function log(message) {
    console.log("[" + moment().format('DD-MM-YYYY h:mm:ss') + "] : " + message);
}