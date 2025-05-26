const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const SPOTIFY_EMAIL = process.env.SPOTIFY_EMAIL;
const SPOTIFY_PASSWORD = process.env.SPOTIFY_PW;

async function getSpotifyLyricTokens() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 75,
        defaultViewport: null
    });

    const page = await browser.newPage();

    let tokensFound = false;
    let clientToken, authorization;

    await page.setRequestInterception(true);

    page.on('request', request => {
        const url = request.url();
        if (url.startsWith('https://spclient.wg.spotify.com/ads/v2/config')) {
            const headers = request.headers();
            clientToken = headers['client-token'];
            authorization = headers['authorization'];
            tokensFound = true;
        }
        request.continue();
    });

    await page.goto('https://accounts.spotify.com/en/login', {
        waitUntil: 'networkidle2'
    });

    await page.type('#login-username', SPOTIFY_EMAIL, { delay: 50 });
    await page.type('#login-password', SPOTIFY_PASSWORD, { delay: 50 });

    await Promise.all([
        page.click('#login-button'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('✅ Logged in');

    await page.goto('https://open.spotify.com/track/1Dzi7Zs5HkDyKRpu0ZAEEW', {
        waitUntil: 'networkidle2'
    });

    await page.waitForSelector('[data-testid="play-button"]', { visible: true });
    await page.click('[data-testid="play-button"]');

    console.log('▶️ Song is now playing...');

    // Wait up to 60 seconds for tokens
    const timeoutMs = 60000;
    const pollInterval = 500;
    const start = Date.now();

    while (!tokensFound && Date.now() - start < timeoutMs) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    if (!tokensFound) {
        console.warn('⚠️ Did not find ads/v2/config request within timeout');
    }

    await browser.close();

    return {bearerToken: authorization, clientToken: clientToken};

}

module.exports = getSpotifyLyricTokens;

