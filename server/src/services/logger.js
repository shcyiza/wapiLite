// FIXME [IJP] 2019-08-18: leave in a conf
const winston = require("winston");
const morgan = require("morgan");

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            timestamp: true,
            level: "info",
            handleExceptions: true,
            json: false,
            colorize: true,
        }),
    ],
    exitOnError: false,
});

logger.stream = {
    write: (message) => logger.info(message.replace(/\n$/, "")),
};

const logRequest = () => morgan(
    ":date[clf] -> method=:method -  url=:url -"
    + " status=:status - response-time=:response-time - content-length="
    + ":res[content-length]",
    { stream: logger.stream },
);


module.exports = { log: logger, logRequest };
