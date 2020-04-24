const fs = require("fs");

const asyncFs = fs.promises;

const {
    makeTemplateData, getImagesDefault, forEachFile,
} = require("../../helper");

module.exports = (base_dir) => async (req, res) => {
    try {
        const { name, mail_subj } = req.body;
        // check if name exist in body
        if (!name || !mail_subj) {
            return res.apiBadRequest(
                Error("Body of the request must contain a 'name!' and a 'mail_subj'"),
            );
        }

        // convert user given file name to snake case
        const template_name = req.body.name.toLowerCase()
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .join("_");


        const claim_dir = `${base_dir}${template_name}/`;

        const images = [];
        const template_data = makeTemplateData(mail_subj);
        const default_dic = getImagesDefault(template_data);


        if (!fs.existsSync(claim_dir)) {
            await asyncFs.mkdir(claim_dir);

            forEachFile(async (file_name) => {
                const image = default_dic.get(file_name);
                images.push(image);

                await asyncFs.appendFile(claim_dir + file_name, image);
            });

            return res.send({
                name: template_name,
                ...template_data,
                content_img: images[0],
                styling_img: images[1],
            });
        }

        return res.apiBadRequest(new Error(`Template '${template_name}' already exist`));
    } catch (err) {
        return res.apiFatal(err);
    }
};
