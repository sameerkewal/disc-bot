class SpotifyTokenNotConfiguredError extends Error {
    constructor(message = "Spotify user access token not configured") {
        super(message);
        this.name = "SpotifyTokenNotConfiguredError";
    }
}

class SpotifyPermissionsMissing extends Error {
    constructor(message = "Permissions missing, please authorize user again") {
        super(message);
        this.name = "SpotifyTokenNotConfiguredError";
    }
}

class MissingMainHandlerFolderError extends Error {
    constructor(folderPath) {
        super(`Expected a 'main' folder in handler path: ${folderPath}`);
        this.name = "MissingMainHandlerFolderError";
    }
}



module.exports = {SpotifyTokenNotConfiguredError, SpotifyPermissionsMissing, MissingMainHandlerFolderError};
