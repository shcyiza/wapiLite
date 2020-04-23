const routes = require("express").Router();

// base url, dependencies of actions
const BASE_DIR = "server/transaction_templates/";

// controller actions
const newAction = require("./newAction");
const indexAction = require("./indexAction");
const showAction = require("./showAction");
const destroyAction = require("./destroyAction");

// controller routes
routes.post("/new", newAction(BASE_DIR));

routes.get("", indexAction(BASE_DIR));

routes.get("/:template_name", showAction(BASE_DIR));

routes.post("/:template_name/save", (req, res) => res.apiResponse({ ok: req.params.template_name }));

routes.delete("/:template_name", destroyAction((BASE_DIR)));

module.exports = routes;
