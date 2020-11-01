/**
 * @overview This file contains the available game builders services.
 */

// ---------------------------------------------------------------------------------------------------------GAME BUILDER

/**
 * @overview Represents an abstract game builder.
 */
class GameBuilder {

    /**
     * Instantiates a game builder.
     */
    constructor() {
    }

    /**
     * @param gameRepresentationPath {?} A given game representation file under any format.
     * @param {function} callback A callback function to call on game built.
     */
    buildFrom(gameRepresentationPath, callback) {
    }
}

// ----------------------------------------------------------------------------------------------------JSON GAME BUILDER

/**
 * @overview Represents a JSON game builder.
 */

class JSONGameBuilder extends GameBuilder {

    /**
     * Instantiates a JSON game builder.
     */
    constructor() {
        super();
    }

    /**
     * @override GameBuilder.buildFrom
     * @param gameRepresentationPath {string} A JSON file representation of the game.
     * @param {function} callback A callback function to call on game built.
     */
    buildFrom(gameRepresentationPath, callback) {
        loadJsonFile(gameRepresentationPath, (response) => {

            // Parsing text response to JSON object.
            let jsonContent = JSON.parse(response);

            // Building levels.
            let levels = [];
            jsonContent.forEach(currentLevel => {

                // Build song.
                let levelSongElement = currentLevel.levelSong;
                let newLevelSong = new LevelSong(levelSongElement.songId, levelSongElement.songAuthor, levelSongElement.songTitle, levelSongElement.songUrl);

                // Build milestones list.
                let levelSongMilestonesElement = currentLevel.levelMilestones;
                let levelSongMilestonesList = [];
                levelSongMilestonesElement.forEach(milestone => {
                    levelSongMilestonesList.push(new LevelMilestone(milestone.levelMilestoneId, milestone.gestureId, milestone.levelMilestoneIndexOrder, milestone.levelMilestoneTimestampStart));
                });

                // Build level.
                let newLevel = new Level(currentLevel.levelId, currentLevel.levelName, currentLevel.levelDifficulty, currentLevel.levelColor, newLevelSong, levelSongMilestonesList);

                // Add level to the list.
                levels.push(newLevel);
            });
            let newGame = new Game(levels);

            // Callback on levels loaded.
            callback(newGame);
        });
    }
}

