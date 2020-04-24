const fs = require("fs");

const asyncFs = fs.promises;

const { CONTENT_URI, STYLING_URI, forEachFile } = require("../../helper");

module.exports = (base_dir) => async (req, res) => {
    const { template_name } = req.params;
    const claim_dir = `${base_dir}${template_name}/`;

    try {
        if (fs.existsSync(claim_dir)) {
            forEachFile(async (file_name) => {
                await asyncFs.unlink(claim_dir + file_name, {});
            });

            await asyncFs.rmdir(claim_dir, {});

            return res.apiResponse({ success: true });
        }

        return res.apiBadRequest(new Error(`Template '${template_name}' does not exist`));
    } catch (err) {
        return res.apiFatal(err);
    }
};
