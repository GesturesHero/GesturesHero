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
    refreshGame();
}

/**
 * Refreshes the view in terms of the game.
 * @param game {game} The game.
 */
function refreshView(game) {
    switch (_currentView) {
        case view.MENU:
            drawMenuPage(game.getLevels());
            break;
        case view.LEVEL:
            let level = game.getLevelById(_currentLevelViewId);
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
 * Draws the (main) menu page.
 * @param levels {[Level]} The list of levels.
 */
function drawMenuPage(levels) {
    $(".general").load("html/menu.html", function () {
        levels.forEach(level => {
            _drawLevel(level);
        })
    });
}

/**
 * Draws a level.
 * @param level {Level} The level to draw.
 */
function _drawLevel(level) {
    $('.menu').append("" +
        "<div class=\"level-access\"" +
        "id=\"" + level.getLevelId() + "\"" +
        "style=\"background-color: " + level.getLevelColor() + "\"" +
        "onclick=\"switchView(view.LEVEL, '" + level.getLevelId() + "')\">\n" +
        level.getLevelName() +
        "</div>");
}

/**
 * Draws a level page.
 * @param {Level} level The level to draw.
 */
function drawLevelPage(level) {
    $(".general").load("html/level.html", function () {
        _drawCustomAudioPlayer(level.getLevelSong().getSongUrl(), level.getLevelMilestones());
        $('.level-name').text(level.getLevelName());
        $('.song-author').text(level.getLevelSong().getSongAuthor());
        $('.song-title').text(level.getLevelSong().getSongTitle());
        $('.level-header').css("background-color", level.getLevelColor());
        $('.level-song-information').css("background-color", level.getLevelColor());
        $('.audio-player-custom').css("background-color", level.getLevelColor());
    });
}

/**
 * Draws a custom flat audio player with milestones.
 * @param sourcePath {string} The source path to the audio file.
 * @param milestones {[LevelMilestone]} A list of level milestones.
 */
function _drawCustomAudioPlayer(sourcePath, milestones) {
    // Get the audio player.
    let audioPlayerOriginal = $('.audio-player-original');
    let audioPlayerCustomPlayControl = $('.audio-player-custom-play-control-disabled');

    // Set the source file.
    audioPlayerOriginal.attr('src', sourcePath);

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
        milestones.forEach(milestone => {
            var milestoneAppended = $("<div class=\"audio-player-song-milestone\"></div>").appendTo('.audio-player-custom');
            milestoneAppended.css("margin-left", milestone.getLevelMilestoneTimestampStart() / songDuration * 100 + '%');
        });

        // Update the progress bar at each time update.
        audioPlayerOriginal[0].ontimeupdate = function () {
            $('.audio-player-custom-progress-bar').css('width', audioPlayerOriginal[0].currentTime / songDuration * 100 + '%');
            $('.audio-player-custom-progress-bar-now').css('left', audioPlayerOriginal[0].currentTime / songDuration * 100 + '%');
        };
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
