const express = require('express');
const server = express();

const port = process.env.port || 4000;
console.log("binding on port ", port);

server.all(`/`, (req, res) => {
    res.send(`Result: [OK].`);
});

function keepAlive() {
    server.listen(port, () => {
        console.log(`Server is now ready! | ` + Date.now());
    });
}



module.exports = keepAlive;