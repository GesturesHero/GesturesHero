/**
 * @overview This file contains the functions for drawing the game views, catching interactions, and rendering the game progression.
 */

// ------------------------------------------------------------------------------------------------------------------------------ ENTRY POINT + INITIALIZATION

$(document).ready(function () {
    initializeGame();
});


// ------------------------------------------------------------------------------------------------------------------------------ NAVIGATION

let _currentView = view.MENU;
let _currentLevelViewId = undefined;

/**
 * Switches from a view to another
 * @param newView {view} The new view to switch to.
 * @param newId {string}(optional) The new id of the level to go to.
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
 * @param game {Object} An object representing the game.
 */
function refreshView(game) {
    switch (_currentView) {
        case view.MENU:
            drawMenuPage(getLevels(), getCurrentLevel());
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
        default:
            alertUserView("Target page not found");
    }
}

// ------------------------------------------------------------------------------------------------------------------------------ DRAWERS

/**
 * Draws the (main) menu page (list of levels that are available or not).
 * @param levels {[Object]} An object representing the list of levels.
 * @param currentLevel {Object} An object representing the current level that is allowed to try.
 */
function drawMenuPage(levels, currentLevel) {
    if (levels !== [] && levels !== undefined) {
        $(".general").load("html/menu.html", function () {
            levels.forEach(level => {
                _drawLevelAccess(level, currentLevel);
            });
        });
    } else {
        alertUserView("There is no level to display.");
    }
}

/**
 * Draws a level access on the menu page.
 * @param level {Object} An object representing the level to draw the access.
 * @param currentLevel {Object} An object representing the current level.
 */
function _drawLevelAccess(level, currentLevel) {
    if (level !== undefined && currentLevel !== undefined) {
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
    } else {
        alertUserView("An issue occurred while displaying the levels. Please try again.");
    }
}

/**
 * Draws a level page.
 * @param level {Level} The level to draw.
 */
function drawLevelPage(level) {
    if (level !== undefined) {
        $(".general").load("html/level.html", function () {
            $('.level-name').text(level.levelName);
            $('.song-author').text(level.levelSong.songAuthor);
            $('.song-title').text(level.levelSong.songTitle);
            $('.level-header').css("background-color", level.levelColor);
            $('.level-song-information').css("background-color", level.levelColor);
            let audioPlayerCustom = $('.audio-player-custom');
            audioPlayerCustom.css("background-color", level.levelColor);
            audioPlayerCustom.css("border-color", level.levelColor);
            resetLevelLives(level.levelId);
            _updateLevelLives(getLevelLive(level.levelId));
            _onAudioPlayerSetUp(level);
            _initGestures(level);
            _renderGestures();
        });
    } else {
        alertUserView("An issue occurred while displaying the level. Please try again.");
    }
}

// Gestures display
let gestureIllustrationsUrl;
let currentGestureIndex;
let previousGestureIndex;
let nextGestureIndex;

/**
 * Init the gesture displaying.
 * @param level {Object} The object representing the level.
 */
function _initGestures(level) {
    let levelGesturesId = _getLevelGesturesIds(level.levelMilestones);
    gestureIllustrationsUrl = _getGesturesIllustrationsUrl(levelGesturesId);
    currentGestureIndex = -1;
    previousGestureIndex = -2;
    nextGestureIndex = 0;
}

/**
 * Sets the gestures positions to the next ones.
 */
function _goToNextGesture() {
    currentGestureIndex++;
    previousGestureIndex++;
    nextGestureIndex++;
}

/**
 * Renders the gesture displaying.
 */
function _renderGestures() {

    const htmlIdentifierNextGesture = '.level-gestures .next-gesture';
    const htmlIdentifierCurrentGesture = '.level-gestures .current-gesture';
    const htmlIdentifierPreviousGesture = '.level-gestures .previous-gesture';

    // Next
    if(nextGestureIndex >= 0 && nextGestureIndex < gestureIllustrationsUrl.length) {
        let gestureIllustrationUrlNext = gestureIllustrationsUrl[nextGestureIndex];
        _setGestureIllustration(htmlIdentifierNextGesture, gestureIllustrationUrlNext);
    } else {
        _resetGestureIllustration(htmlIdentifierNextGesture);
    }

    // Current gesture
    if(currentGestureIndex >= 0 && currentGestureIndex < gestureIllustrationsUrl.length) {
        let gestureIllustrationUrlCurrent = gestureIllustrationsUrl[currentGestureIndex];
        _setGestureIllustration(htmlIdentifierCurrentGesture, gestureIllustrationUrlCurrent);
    } else {
        _resetGestureIllustration(htmlIdentifierCurrentGesture);
    }

    // Previous
    if(previousGestureIndex >= 0 && previousGestureIndex < gestureIllustrationsUrl.length) {
        let gestureIllustrationUrlPrevious = gestureIllustrationsUrl[previousGestureIndex];
        _setGestureIllustration(htmlIdentifierPreviousGesture, gestureIllustrationUrlPrevious);
    } else {
        _resetGestureIllustration(htmlIdentifierPreviousGesture);
    }
}

/**
 * @return {[string]}The gestures' ids of the given level.
 */
function _getLevelGesturesIds(levelMilestones) {
    return levelMilestones.map(milestone => milestone.gestureId);
}

/**
 * @retun {[string]} The gestures' illustrations URL of given level ids.
 */
function _getGesturesIllustrationsUrl(levelIds) {
    return levelIds.map(id => getGestureIllustrationUrl(id));
}

// End of gesture display

/**
 * Updates on the view the amount of level lives.
 * @param levelLives {number} The amount of level lives.
 */
function _updateLevelLives(levelLives) {
    log.debug(`gameView._updateLevelLives : ${levelLives}`);
    let levelLivesNumberHtml = "";

    // Remaining lives
    for (let i = 0; i < levelLives; i++) {
        levelLivesNumberHtml += musicNote;
    }

    // Lost lives
    for (let j = 0; j < (LEVEL_LIVES_AMOUNT - levelLives); j++) {
        levelLivesNumberHtml += musicNoteTranslucent;
    }

    $('.level-lives').html(levelLivesNumberHtml);
}

let musicNoteSVG = "<svg width=\"3em\" height=\"3em\" viewBox=\"0 0 16 16\" class=\"bi bi-music-note\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
    "  <path d=\"M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z\"/>\n" +
    "  <path fill-rule=\"evenodd\" d=\"M9 3v10H8V3h1z\"/>\n" +
    "  <path d=\"M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z\"/>\n" +
    "</svg>";

let musicNote = "<span class='music-note'>" + musicNoteSVG + "</span>";

let musicNoteTranslucent = "<span class='music-note-translucent'>" + musicNoteSVG + "</span>";

/**
 * Draws and sets up a custom audio player with timed milestones.
 * @param level {Object} An object representing the level's information.
 */
function _onAudioPlayerSetUp(level) {
    if (level !== undefined) {
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
            let audioPlayPromise = audioPlayerOriginal[0].play(); // Autoplay.

            // When the autoplay is not allow, show a play control.
            audioPlayPromise.catch(() => {
                audioPlayerCustomPlayControl.removeClass("audio-player-custom-play-control-disabled");
                audioPlayerCustomPlayControl.addClass("audio-player-custom-play-control");
                audioPlayerCustomPlayControl.click(function () {
                    audioPlayerOriginal[0].play();
                    audioPlayerCustomPlayControl.addClass("audio-player-custom-play-control-disabled");
                });
            });

            // Draw the milestones
            let songDuration = audioPlayerOriginal[0].duration;
            level.levelMilestones.forEach(milestone => {
                let gestureDuration = getGestureDuration(milestone.gestureId);
                let milestoneAppended = $("<div class=\"audio-player-song-milestone\"></div>").appendTo('.audio-player-custom');
                milestoneAppended.css("left", (milestone.levelMilestoneTimestampStart / songDuration) * 100 + '%');
                milestoneAppended.css("width", (gestureDuration / songDuration) * 100 + '%');
            });

            _onAudioPlayerUpdate(level);
            _onAudioPlayerFinish(level);
        };
    }
}

/**
 * Catches the song's updates.
 * @param level {Object} An object representing the level's information.
 */
function _onAudioPlayerUpdate(level) {
    if (level !== undefined) {
        // Get the audio player.
        let audioPlayerOriginal = $('.audio-player-original');

        // On time update.
        let lastSecondCheck = 0;
        let songDuration = audioPlayerOriginal[0].duration;

        audioPlayerOriginal[0].ontimeupdate = function () {

            let currentTime = audioPlayerOriginal[0].currentTime;

            // Updating the progress bar.
            $('.audio-player-custom-progress-bar').css('width', currentTime / songDuration * 100 + '%');
            $('.audio-player-custom-progress-bar-now').css('left', currentTime / songDuration * 100 + '%');

            // Checking and trying to recognize the gesture corresponding to the milestone (if it exists).
            if (currentTime > lastSecondCheck) {

                let milestoneToCheckWith = _getMilestoneAt(lastSecondCheck, currentTime, level.levelMilestones);
                lastSecondCheck = currentTime;

                if (milestoneToCheckWith !== undefined) {

                    // Update gesture display.
                    _goToNextGesture();
                    _renderGestures();

                    // Recognition.
                    checkGestureNow(milestoneToCheckWith.gestureId, (recognitionState) => {
                        log.debug(`gameView._onAudioPlayerUpdate : ${recognitionState}`);
                        if (recognitionState === false) {
                            decreaseLevelLive(level.levelId);
                        }
                        _updateGestureFeedback(recognitionState); // Make a timeout after ... sec with transition. TIMEOUT_FEEDBACK
                    });
                }
            }
        };
    }
}

/**
 * Catches the song's end.
 * @param level {Object} An object representing the level's information.
 */
function _onAudioPlayerFinish(level) {
    if (level !== undefined) {

        // Get the audio player.
        let audioPlayerOriginal = $('.audio-player-original');

        // On finish.
        audioPlayerOriginal[0].onended = function () {

            if (getLevelLive(level.levelId) > 0) { // Level completed.
                if (level.levelId === getCurrentLevelId()) {
                    // The next level could be set only if the current level is the highest.
                    // If an already-completed level is done again, the next level could not be set.
                    setNextLevel();
                }
                if (getCurrentLevel() === undefined) { // Game finished.
                    drawEndPage(); // In case of no more levels.
                    resetGame();
                } else {
                    drawLevelCompletedPage();
                }
            } else { // Level failed.
                resetLevelLives(level.levelId);
                drawLevelFailedPage();
            }
        };
    }
}

/**
 * @param intervalStart {number} Timestamp for interval start.
 * @param intervalEnd {number} Timestamp for interval start.
 * @param milestones {[Object]} A list of objects representing a level milestone.
 * @return {Object} An object representing the milestone found within the interval ; undefined if no milestone exists.
 */
function _getMilestoneAt(intervalStart, intervalEnd, milestones) {
    return milestones.find(milestone => milestone.levelMilestoneTimestampStart >= intervalStart && milestone.levelMilestoneTimestampStart < intervalEnd);
}

/**
 * Sets a gesture illustration.
 * @param htmlIdentifier {string} The HTML DOM identifier.
 * @param gestureIllustrationUrl The gesture illustration's URL/path.
 */
function _setGestureIllustration(htmlIdentifier, gestureIllustrationUrl) {
    $(htmlIdentifier).html(
        '<img src="' + gestureIllustrationUrl + '">'
    );
}

/**
 * Resets to blank the gesture illustration.
 * @param htmlIdentifier {string} The HTML DOM identifier.
 */
function _resetGestureIllustration(htmlIdentifier) {
    $(htmlIdentifier).html('<span></span>');
}

/**
 * Updates the feedback sent to the user regarding its gesture performance.
 * @param recognitionState {boolean} The recognition state.
 */
function _updateGestureFeedback(recognitionState) {
    $('.gesture-feedback-current').html('<span>' + (recognitionState === true ? '✔' : '❌') + '</span>');
    setTimeout(() => {
        $('.gesture-feedback-current').html('<span></span>');
    }, (FEEDBACK_TIMEOUT_IN_SEC * SECOND_TO_MILLISECONDS));
}

/**
 * Draws the level completed page.
 */
function drawLevelCompletedPage() {
    $(".general").load("html/level-completed.html", function () {
        $('.next-level').attr('onclick', 'switchView(view.LEVEL,"' + getCurrentLevelId() + '")');
    });
}

/**
 * Draws the level failed page.
 */
function drawLevelFailedPage() {
    $(".general").load("html/level-failed.html", function () {
        $('.retry').attr('onclick', 'switchView(view.LEVEL,"' + getCurrentLevelId() + '")');
    });
}

/**
 * Draws the end page.
 */
function drawEndPage() {
    $(".general").load("html/end.html", function () {
    });
}

// ------------------------------------------------------------------------------------------------------------------------------ ALERTS

let alertDisplayTimeout;

/**
 * Displays on the view an (error) alert to the user with a custom message.
 * @param {string} message The custom message.
 */
function alertUserView(message) {

    log.debug(message); // For logging.

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
