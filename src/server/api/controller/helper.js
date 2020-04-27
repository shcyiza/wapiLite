const CONTENT_URI = "_content_partial.html";
const STYLING_URI = "_styling_partial.css";
const DATA_URI = "data.json";
const CACHE_URI = "cache.html";

const FILES = [CONTENT_URI, STYLING_URI, CACHE_URI, DATA_URI];

const makeTemplateData = (mail_subj, TS = new Date()) => ({
    mail_subj,
    meta_data: {
        birthtime: TS,
        mtime: TS,
    },
});

const getImagesDefault = (template_data) => new Map([
    [CONTENT_URI, "<!--inky html supported></!-->"],
    [STYLING_URI, "/* css here */"],
    [CACHE_URI, ""],
    [DATA_URI, JSON.stringify(template_data)],
]);

const mapOnFiles = (operation) => FILES.map(operation);

const forEachFile = (operation) => {
    FILES.forEach(operation);
};

const getImgVars = (img) => {
    const regex = /%{+\w+}/g;

    const raw_vars = img.match(regex).map((_var) => _var.replace(/[%{} ]/g, ""));
    const clean_vars = Array.from(new Set(raw_vars));

    return clean_vars;
};

const parseVars = (img, payload, catchCb) => {
    try {
        let work_copy = img;
        const img_vars = getImgVars(img);

        img_vars.forEach((key) => {
            const reg = new RegExp(`%{${key}}`, "gi");

            work_copy = work_copy.replace(reg, payload[key]);
        });

        return work_copy;
    } catch (err) {
        return catchCb(err);
    }
};


module.exports = {
    CONTENT_URI,
    STYLING_URI,
    CACHE_URI,
    DATA_URI,
    makeTemplateData,
    getImagesDefault,
    mapOnFiles,
    forEachFile,
    parseVars,
};
