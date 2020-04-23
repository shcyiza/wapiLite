const fs = require("fs");

const asyncFs = fs.promises;

const { CONTENT_URI, STYLING_URI, DATA_URI } = require("./helper");

module.exports = (base_dir) => async (req, res) => {
    const { template_name } = req.params;
    const claim_dir = `${base_dir}${template_name}/`;

    try {
        const content_img = await asyncFs.readFile(claim_dir + CONTENT_URI, "utf8");
        const styling_img = await asyncFs.readFile(claim_dir + STYLING_URI, "utf8");

        const template_data_raw = await asyncFs.readFile(`${claim_dir}${DATA_URI}`, "utf8");
        const template_data = JSON.parse(template_data_raw);

        return res.apiResponse({
            name: template_name,
            ...template_data,
            content_img,
            styling_img,
        });
    } catch (err) {
        return res.apiFatal(err);
    }
};
