const express = require('express');
const server = express();
const {requestAccessToken} = require("./api/spotify/app/getAccountToken.js")


const port = process.env.PORT || 4000;

server.all(`/`, (req, res) => {
    res.send(`Result: [OK].`);
});

// spotify redirect url
server.get("/callback", (req, res) => {


    const code = req.query.code;
    const state = req.query.state;

    requestAccessToken(state, code).then(()=>{
        res.send(`
      <html lang="en">
        <body>
          <h3>Authentication complete! You can now return to the Discord app or browser.</h3>
          <p><a href="https://discord.com/channels/@me">Go to Discord</a></p>
        </body>
      </html>
    `)
    .catch((error) => {
            console.error("Error during auth:", error);
            res.send(`
      <html lang="en">
        <body>
          <h3>Unauthorized!</h3>
        </body>
      </html>
    `);
        });
})

function keepAlive() {
    server.listen(port, () => {
    });
}



module.exports = keepAlive;