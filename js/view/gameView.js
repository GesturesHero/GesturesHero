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
let _currentView = view.MENU;
let _currentLevelViewId = -1;

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
    if (_currentView === view.MENU) { // MENU PAGE
        drawMenuPage();

    } else if (_currentView === view.LEVEL) { // LEVEL PAGE
        drawLevelPage(_currentLevelViewId);

    } else  if (_currentView === view.END) { // END PAGE
        drawEndPage();
    }
}

/**
 * Switches from a view to another
 * @param {view} newView The new view to switch to.
 * @param {number} newId (optional) The new id of the level to go to.
 */
function switchView(newView, newId=-1) {
    if(newId !== undefined && newId !== -1){
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
