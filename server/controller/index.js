const morgan = require('morgan')
const cors = require('cors')
const logger = require('../services/logger')

const middlewares = require('../middlewares')

module.exports = (app) => {
  const API_PATH = "/api/v1"

  app.use(API_PATH, cors({origin: '*'}))

  app.use(API_PATH, middlewares.responders)

  // Add default route
  app.get(API_PATH+'*', (req, res) => {
    res.apiNotFound(new Error("Route not found"))
  })

  /**
   * Logging
   */
  app.use(API_PATH, morgan(
    ':date[clf] - method=:method -  url=:url -'
    + ' status=:status - response-time=:response-time - content-length='
    + ':res[content-length]'
    , { stream: logger.stream }
  ))
}
