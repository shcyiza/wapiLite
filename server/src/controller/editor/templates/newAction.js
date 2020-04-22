const fs = require('fs')
const asyncFs = fs.promises

const {CONTENT_URI, STYLING_FILE} = require('./helper')

module.exports = base_dir => async (req, res) => {
  try {
    // check if name exist in body
    if(!req.body.name) return res.apiBadRequest(Error("Body of the request must contain an name!"))

    // convert user given file name to snake case
    const template_name = req.body.name && req.body.name
      .toLowerCase()
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .join('_')


    const claim_dir = `${base_dir}/${template_name}/`
    const DEFAULT_CONTENT = "<!--inky html supported></!-->"
    const DEFAULT_STYLE = "//Css here"


    if (!fs.existsSync(claim_dir)) {
      await asyncFs.mkdir(claim_dir);

      await asyncFs.appendFile(claim_dir + CONTENT_URI, DEFAULT_CONTENT)

      await asyncFs.appendFile(claim_dir + STYLING_FILE, DEFAULT_STYLE)

      const {birthtime, mtime, atime} = await asyncFs.stat(claim_dir, {})

      return res.send({
        name: template_name,
        meta_data: {
          birthtime,
          mtime,
          atime
        },
        content_img: DEFAULT_CONTENT,
        styling_img: DEFAULT_STYLE
      })
    }

    return res.apiBadRequest(new Error(`Template ${template_name} already exist`))
  } catch (err) {
    return res.apiFatal(err)
  }
}
