const routes = require("express").Router();
const { template_dir: BASE_DIR } = require("../../sever.conf.js");

// base url, dependencies of actions

// controller actions
const newAction = require("./newAction");
const indexAction = require("./indexAction");
const showAction = require("./showAction");
const saveAction = require("./saveAction");
const destroyAction = require("./destroyAction");

// controller routes
routes.post("/new", newAction(BASE_DIR));

routes.get("", indexAction(BASE_DIR));

routes.get("/:template_name", showAction(BASE_DIR));

routes.post("/:template_name/save", saveAction(BASE_DIR));

routes.delete("/:template_name", destroyAction((BASE_DIR)));

module.exports = routes;
