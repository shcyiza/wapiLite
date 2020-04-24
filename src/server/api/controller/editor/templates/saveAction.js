/* eslint-disable no-control-regex */
const fs = require("fs");

const inlineCss = require("juice");
const { minify } = require("html-minifier");

const asyncFs = fs.promises;

const {
    DATA_URI, CACHE_URI, CONTENT_URI, STYLING_URI,
} = require("../../helper");

module.exports = (base_dir) => async (req, res) => {
    try {
    // check if name exist in body
        const { template_name } = req.params;
        const claim_dir = `${base_dir}${template_name}/`;

        const {
            mail_subj, content_img, styling_img, blob,
        } = req.body;
        if (!mail_subj || !content_img || !styling_img || !blob) {
            return res.apiBadRequest(
                Error("Body of the request incomplete"),
            );
        }

        if (fs.existsSync(claim_dir)) {
            await asyncFs.writeFile(claim_dir + CONTENT_URI, content_img);
            await asyncFs.writeFile(claim_dir + STYLING_URI, styling_img);

            const template_data_raw = await asyncFs.readFile(`${claim_dir}${DATA_URI}`, "utf8");
            const template_data = JSON.parse(template_data_raw);

            template_data.mail_subj = mail_subj;
            template_data.meta_data.mtime = new Date();

            const inky_css = await asyncFs.readFile("public/foundation_emails.css", "utf8");
            const inked_blob = blob.replace(
                "<link rel=\"stylesheet\" type=\"text/css\" href=\"/foundation_emails.css\" media=\"all\"><style type=\"text/css\" id=\"custom-style\">",
                `<style>${inky_css}`,
            );

            const min_blob = minify(
                inlineCss(inked_blob),
                {
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true,
                    conservativeCollapse: true,
                    minifyCSS: true,
                },
            );

            const zipped_blob = min_blob.replace(/<style>(.*?)style>/i, "")

            await asyncFs.writeFile(claim_dir + CACHE_URI, zipped_blob);
            await asyncFs.writeFile(`${claim_dir}${DATA_URI}`, JSON.stringify(template_data));

            return res.send({
                name: template_name,
                ...template_data,
                content_img,
                styling_img,
            });
        }

        return res.apiBadRequest(new Error(`Template '${template_name}' does not exit`));
    } catch (err) {
        return res.apiFatal(err);
    }
};
