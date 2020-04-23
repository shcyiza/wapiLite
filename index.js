
const express = require("express");
const consola = require("consola");
const path = require("path");

const app = express();

const apiController = require("./server/src/controller");

const port = 3000;

async function start() {
    app.use("/editor", (req, res) => {
        res.render("index", { title: "The index page!" });
    });

    app.get("/", (req, res) => {
        res.redirect("/editor");
    });


    apiController(app);

    // Listen the server
    app.listen(port);
    consola.ready({
        message: `Server listening on http://localhost:${port}`,
        badge: true,
    });
}
start();
