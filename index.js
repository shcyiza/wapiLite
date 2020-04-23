
const express = require("express");
const consola = require("consola");
const serveStatic = require("serve-static");
const path = require("path");

const app = express();

const apiController = require("./src/server/api/controller");

const port = 3000;

async function start() {
    if (process.env.NODE_ENV === "edition") {
        app.use("/", serveStatic(path.join(__dirname, "./dist")));
        // this * route is to serve project on different page routes except root `/`
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "./dist/index.html"));
        });
    }

    apiController(app);

    // Listen the server
    app.listen(port);
    consola.ready({
        message: `Server listening on http://localhost:${port}`,
        badge: true,
    });
}
start();
