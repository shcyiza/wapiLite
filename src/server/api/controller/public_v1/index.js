const mailer = require("nodemailer");
const consola = require("consola");

const sendAction = require("./sendAction");

module.exports = (app, BASE_URI) => {
    const CONTROLLER_PATH = `${BASE_URI}/v1`;

    const transport = mailer.createTransport({
        pool: true,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PWD,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true,
        },
    });

    transport.verify((error) => {
        if (error) {
            consola.error(error);
        } else {
            consola.ready({
                message: `${process.env.SMTP_HOST} SMTP host connected!`,
                badge: true,
            });
        }
    });

    // send endpoints
    app.post(`${CONTROLLER_PATH}/send/:template_name`, sendAction(transport));

    // default route
    app.all(`${CONTROLLER_PATH}*`, (req, res) => {
        res.apiNotFound(new Error("Route not found in public V1 api"));
    });
};
