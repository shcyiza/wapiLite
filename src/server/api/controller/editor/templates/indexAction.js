const fs = require("fs");

const asyncFs = fs.promises;

const { DATA_URI } = require("./helper");

module.exports = (base_dir) => async (req, res) => {
    try {
        const templates = [];

        const raw_data = await asyncFs.readdir(base_dir, {
            withFileTypes: true,
            withFileStats: true,
        });

        for (const dirent of raw_data) {
            if (dirent.isDirectory()) {
                const { name } = dirent;
                const template_data_raw = await asyncFs.readFile(`${base_dir}${name}/${DATA_URI}`, "utf8");
                const template_data = JSON.parse(template_data_raw);

                templates.push({
                    name,
                    ...template_data,
                });
            }
        }

        templates.sort(
            (t0, t1) => new Date(t1.meta_data.mtime) - new Date(t0.meta_data.mtime),
        );

        return res.send({ templates });
    } catch (err) {
        return res.apiFatal(err);
    }
};
