const cors = require("cors");
const bodyParser = require("body-parser");

const logger = require("../services/logger");
const middlewares = require("../middlewares");
const editorController = require("./editor");
const v1Controller = require("./public_v1");

module.exports = (app) => {
    const API_PATH = "/api";

    app.use(API_PATH, cors({ origin: "*" }));

    app.use(API_PATH, middlewares.responders);

    app.use(API_PATH, bodyParser.json());

    /**
   * Logging
   */
    app.use(API_PATH, logger.logRequest());

    editorController(app, API_PATH);
    v1Controller(app, API_PATH);

    app.all(`${API_PATH}*`, (req, res) => {
        res.apiNotFound(new Error("Route not found"));
    });
};
