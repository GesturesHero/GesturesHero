/**
 * @overview This file contains some JSON helpers.
 */

/**
 * Loads a the content of a JSON file and call the callback on content loaded.
 * @param jsonFilePath {string} The path of the JSON file.
 * @param callback {function} The function to call on content loaded.
 */
function loadJsonFile(jsonFilePath, callback) {
    let loadingRequest = new XMLHttpRequest();
    loadingRequest.overrideMimeType("application/json");
    loadingRequest.open('GET', jsonFilePath, true);
    loadingRequest.onreadystatechange = function () {
        if (loadingRequest.readyState === 4 && loadingRequest.status == "200") {
            callback(loadingRequest.responseText);
        }
    };
    loadingRequest.send(null);
}