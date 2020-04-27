const fs = require("fs");

const asyncFs = fs.promises;

const { template_dir } = require("../sever.conf.js");
const { CACHE_URI, DATA_URI, parseVars } = require("../helper");

module.exports = (transport) => async (req, res) => {
    const { template_name } = req.params;
    const { to, vars } = req.body;
    const claim_dir = `${template_dir}${template_name}/`;

    if (!fs.existsSync(claim_dir)) return res.apiBadRequest(Error(`Template '${template_name}' does not exist`));
    // check if name exist in body
    if (!to || !vars) {
        return res.apiBadRequest(
            Error("Body of the request must contain a 'to' and a 'vars'"),
        );
    }

    try {
        const raw_html = await asyncFs.readFile(claim_dir + CACHE_URI, "utf8");
        const template_data = JSON.parse(await asyncFs.readFile(claim_dir + DATA_URI, "utf8"));
        const parser = (img) => parseVars(img, vars, res.apiBadRequest)

        const html = parser(raw_html);
        const subject = parser(template_data.mail_subj);

        console.log(vars);
        console.log(subject);

        const mail_data = {
            subject,
            from: process.env.SENDER_EMAIL,
            to,
            html,
        };

        transport.sendMail(mail_data, (err, info) => {
            if (err) {
                res.apiForbidden(err);
            } else {
                res.apiResponse({
                    success: true,
                    info,
                });
            }
        });
    } catch (err) {
        return res.apiFatal(err);
    }
};
