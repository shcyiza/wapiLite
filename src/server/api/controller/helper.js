/* eslint-disable no-restricted-syntax */
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

const getImgVars = (img, regex = /%{+\w+}/g, cleanUpExp = /[%{} ]/g) => {
    const matches = img.match(regex);

    const raw_vars = matches ? matches.map((_var) => _var.replace(cleanUpExp, "")) : [];

    const clean_vars = Array.from(new Set(raw_vars));

    return clean_vars;
};

const parseVars = (img, payload, catchCb) => {
    let work_copy = img;
    const img_vars = getImgVars(img);

    for (const key of img_vars) {
        const value = payload[key];
        if (!value) return catchCb(Error(`Variable '${key}' not specified in vars body`));

        const reg = new RegExp(`%{${key}}`, "gi");

        work_copy = work_copy.replace(reg, value);
    }

    return work_copy;
};

const parseIterator = (img, payload, catchCb) => {
    let work_copy = img;
    const img_iterators = getImgVars(img, /<\s*iterate_+\s+\w+/g, "<iterate_ ");

    for (const iterator_key of img_iterators) {
        const iterator = payload[iterator_key];
        if (!iterator) return catchCb(Error(`Iterator '${iterator_key}' not specified in vars body`));

        const img_exp = new RegExp(`<\\s*iterate_+\\s+\\b${iterator_key}+>([^$]+?)<\\/iterate_>`, "gi");
        const iterator_raw_contents = img.match(img_exp);

        for (const raw_content of iterator_raw_contents) {
            let processed_content = "";
            const iterator_attrs = getImgVars(raw_content, /%{i\.+\w+}/g, /i+\.|[%{} ]/g);

            for (let i = 0; i < iterator.length; i += 1) {
                const iteration = iterator[i];
                let local_work_copy = raw_content;

                for (const attr of iterator_attrs) {
                    const value = iteration[attr];
                    if (!value) {
                        return catchCb(
                            Error(`attribute '${attr}' not specified in element at [${i}] of iterator '${iterator_key}'`),
                        );
                    }

                    const var_exp = new RegExp(`%{i.${attr}}`, "gi");

                    local_work_copy = local_work_copy.replace(var_exp, value);
                }

                processed_content = processed_content.concat(local_work_copy);
            }
            work_copy = work_copy.replace(raw_content, processed_content);
        }
    }

    return work_copy.replace(/<\s*iterate_+\s+\w+>|<\/iterate_>/gi, "");
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
    parseIterator,
};
