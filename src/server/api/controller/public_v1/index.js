module.exports = (app, BASE_URI) => {
    const CONTROLLER_PATH = `${BASE_URI}/v1`;

    // Add default route
    app.all(`${CONTROLLER_PATH}*`, (req, res) => {
        res.apiNotFound(new Error("Route not found in public V1 api"));
    });
};
