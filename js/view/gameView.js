/**
 * @overview This file contains the functions for drawing the game views, catching interactions, and rendering the game progression.
 */

// ------------------------------------------------------------------------------------------------------------------------------ ENTRY POINT + INITIALIZATION

$(document).ready(function () {
    initializeGame();
});

// ------------------------------------------------------------------------------------------------------------------------------ DRAWERS
let _currentView = view.MENU;
let _currentLevelViewId = undefined;

/**
 * Switches from a view to another
 * @param {view} newView The new view to switch to.
 * @param {string} newId (optional) The new id of the level to go to.
 */
function switchView(newView, newId = undefined) {
    if (newId !== undefined) {
        _currentLevelViewId = newId;
    }
    _currentView = newView;
    refreshGameView();
}

/**
 * Refreshes the view in terms of the game.
 * @param game {Object} A JavaScript object representing the game.
 */
function refreshView(game) {
    switch (_currentView) {
        case view.MENU:
            drawMenuPage(game.levels, game.currentLevel);
            break;
        case view.LEVEL:
            let level = getLevelById(_currentLevelViewId);
            drawLevelPage(level);
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
 * Draws the (main) menu page (list of levels that are available or not).
 * @param levels {[Level]} The list of levels.
 * @param currentLevel {Level} The current level that is allowed to try.
 */
function drawMenuPage(levels, currentLevel) {
    $(".general").load("html/menu.html", function () {
        levels.forEach(level => {
            _drawLevel(level, currentLevel);
        });
    });
}

/**
 * Draws a level.
 * @param level {Level} The level to draw.
 * @param currentLevel {Level} The current level.
 */
function _drawLevel(level, currentLevel) {
    if (level.levelIndexOrder > currentLevel.levelIndexOrder) { // NON-ACCESSIBLE LEVEL
        $('.menu').append("" +
            "<div class=\"level-access non-accessible\"" +
            "id=\"" + level.levelId + "\"" +
            "style=\"background-color: " + level.levelColor + "\">" +
            level.levelName +
            "</div>");
    } else { // ACCESSIBLE LEVEL
        $('.menu').append("" +
            "<div class=\"level-access\"" +
            "id=\"" + level.levelId + "\"" +
            "style=\"background-color: " + level.levelColor + "\"" +
            "onclick=\"switchView(view.LEVEL, '" + level.levelId + "')\">\n" +
            level.levelName +
            "</div>");
    }
}

/**
 * Draws a level page.
 * @param {Level} level The level to draw.
 */
function drawLevelPage(level) {
    $(".general").load("html/level.html", function () {
        _drawCustomAudioPlayer(level);
        $('.level-name').text(level.levelName);
        $('.song-author').text(level.levelSong.songAuthor);
        $('.song-title').text(level.levelSong.songTitle);
        $('.level-header').css("background-color", level.levelColor);
        $('.level-song-information').css("background-color", level.levelColor);
        $('.audio-player-custom').css("background-color", level.levelColor);
    });
}

/**
 * Draws a custom flat audio player with milestones.
 * @param level {Level} The level's information.
 */
function _drawCustomAudioPlayer(level) {
    // Get the audio player.
    let audioPlayerOriginal = $('.audio-player-original');
    let audioPlayerCustomPlayControl = $('.audio-player-custom-play-control-disabled');

    // Set the source file.
    audioPlayerOriginal.attr('src', level.levelSong.songUrl);

    // Load the source file.
    audioPlayerOriginal[0].load();

    // Play the source file when loaded.
    // NOTE :   Some web browser such as Google Chrome or Firebox defined a policy that does not allow an audio autoplay in some conditions.
    //          Thus, it is necessary to enable a play control in this case.
    //          Source : https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    audioPlayerOriginal[0].oncanplaythrough = function () {
        let audioPlayPromise = audioPlayerOriginal[0].play();

        // When the autoplay is not allow, show a play control.
        audioPlayPromise.catch(() => {
            audioPlayerCustomPlayControl.removeClass("audio-player-custom-play-control-disabled");
            audioPlayerCustomPlayControl.addClass("audio-player-custom-play-control");
            audioPlayerCustomPlayControl.click(function () {
                audioPlayerOriginal[0].play();
                audioPlayerCustomPlayControl.addClass("audio-player-custom-play-control-disabled");
            });
        });

        // Draw milestones
        let songDuration = audioPlayerOriginal[0].duration;
        level.levelMilestones.forEach(milestone => {
            var milestoneAppended = $("<div class=\"audio-player-song-milestone\"></div>").appendTo('.audio-player-custom');
            milestoneAppended.css("margin-left", milestone.levelMilestoneTimestampStart / songDuration * 100 + '%');
        });

        // Update the progress bar at each time update.
        audioPlayerOriginal[0].ontimeupdate = function () {
            $('.audio-player-custom-progress-bar').css('width', audioPlayerOriginal[0].currentTime / songDuration * 100 + '%');
            $('.audio-player-custom-progress-bar-now').css('left', audioPlayerOriginal[0].currentTime / songDuration * 100 + '%');
            // TODO : Update gesture carousel here (related to milestones) !
            // TODO : Check gesture recognition here !
        };

        // Check on finish
        audioPlayerOriginal[0].onended = function () {

        }
    };
}

/**
 * Draws the level completed page.
 */
function drawLevelCompletedPage() {
    $(".general").load("html/level-completed.html", function () {
        // WHEN LOADED
    });
}

/**
 * Draws the level failed page.
 */
function drawLevelFailedPage() {
    $(".general").load("html/level-failed.html", function () {
        // WHEN LOADED
    });
}

/**
 * Draws the end page.
 */
function drawEndPage() {
    $(".general").load("html/end.html", function () {
        // WHEN LOADED
    });
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
