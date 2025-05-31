class SpotifyTokenNotConfiguredError extends Error {
    constructor(message = "Spotify user access token not configured") {
        super(message);
        this.name = "SpotifyTokenNotConfiguredError";
    }
}

module.exports = {SpotifyTokenNotConfiguredError};
