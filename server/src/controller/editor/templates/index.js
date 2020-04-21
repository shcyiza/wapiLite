const routes = require('express').Router()

// base url, dependencies of actions
const BASE_DIR = 'server/transaction_templates/';

//controller actions
const newAction = require('./newAction')
const indexAction = require('./indexAction')

// controller routes
routes.post('/new', newAction(BASE_DIR))
routes.get('', indexAction(BASE_DIR))

module.exports = routes
