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

module.exports = {SpotifyTokenNotConfiguredError, SpotifyPermissionsMissing};
