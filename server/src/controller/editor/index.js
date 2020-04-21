module.exports = (app, BASE_URI) => {
  const CONTROLLER_PATH = BASE_URI + "/editor";

  app.use(`${CONTROLLER_PATH}/templates`, require('./templates'))

  app.all(CONTROLLER_PATH+'*', (req, res) => {
    res.apiNotFound(new Error("Route not found in editor api"))
  })
}
