/**
 * @overview This file contains the functions for drawing the game views, catching interactions, and rendering the game progression.
 */

// ------------------------------------------------------------------------------------------------------------------------------ ENTRY POINT + INITIALIZATION

$(document).ready(function () {
    initializeGame();

    // EVENT CAPTURES
    // TODO

});

// ------------------------------------------------------------------------------------------------------------------------------ DRAWERS
let _currentView = view.LEVEL;
let _currentLevelViewId = undefined;

/**
 * Draws the (main) menu page.
 */
function drawMenuPage() {
    $(".general").load("html/menu.html", function () {
        // WHEN LOADED
    });
}

/**
 * Draws a level page.
 * @param {number} id The ID of the level.
 */
function drawLevelPage(id) {
    $(".general").load("html/level.html", function () {
        _drawCustomAudioPlayer();
    });
}

/**
 * Draws a custom flat audio player without any controls.
 */
function _drawCustomAudioPlayer(){
    // Custom Audio Player
    var audioPlayerOriginal = $('audio')[0];
    audioPlayerOriginal.ontimeupdate = function () {
        $('.audio-player-custom-progress-bar').css('width', audioPlayerOriginal.currentTime / audioPlayerOriginal.duration * 100 + '%')
        $('.audio-player-custom-progress-bar-now').css('left', audioPlayerOriginal.currentTime / audioPlayerOriginal.duration * 100 + '%')
    }
}

/**
 * Draws the level completed page.
 */
function drawLevelCompletedPage(){
    $(".general").load("html/level-completed.html", function () {
        // WHEN LOADED
    });
}

/**
 * Draws the level failed page.
 */
function drawLevelFailedPage(){
    $(".general").load("html/level-failed.html", function () {
        // WHEN LOADED
    });
}

/**
 * Draws the end page.
 */
function drawEndPage(){
    $(".general").load("html/end.html", function () {
        // WHEN LOADED
    });
}

/**
 * Refreshes the view.
 */
function refreshView(){
    switch (_currentView) {
        case view.MENU:
            drawMenuPage();
            break;
        case view.LEVEL:
            drawLevelPage(_currentLevelViewId);
            break;
        case view.END:
            drawEndPage();
            break;
        case view.LEVEL_COMPLETED:
            drawLevelCompletedPage();
            break;
        case view.LEVEL_FAILED:
            drawLevelFailedPage();
            break;
    }
}

/**
 * Switches from a view to another
 * @param {view} newView The new view to switch to.
 * @param {string} newId (optional) The new id of the level to go to.
 */
function switchView(newView, newId=undefined) {
    if(newId !== undefined){
        _currentLevelViewId = newId;
    }
    _currentView = newView;
    refreshView();
}


// ------------------------------------------------------------------------------------------------------------------------------ ALERTS

let alertDisplayTimeout;

/**
 * Displays on the view an (error) alert to the user with a custom message.
 * @param {string} message The custom message.
 */
function alertUserView(message) {

    log(message); // For logging.

    $(".alert").addClass("show");
    $(".alert .message").append("<span>" + message + "</span><br/><small>" + moment().fromNow() + "</small><br/><hr/>");
    alertDisplayTimeout = setTimeout(closeAlert, 10 * SECOND_TO_MILLISECONDS);
}

/**
 * Closes the alert on the view and clears the message.
 */
function closeAlert() {
    $(".alert").removeClass("show");
    $(".alert .message").empty();
    clearTimeout(alertDisplayTimeout);
}
