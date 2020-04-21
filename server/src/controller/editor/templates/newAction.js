const fs = require('fs')

module.exports = base_dir => (req, res) => {
  try {
    const claim_dir = `${base_dir}/${req.body.name}/`
    const DEFAULT_CONTENT = "<!--inky html supported></!-->"
    const DEFAULT_STYLE = "//Css here"

    if (!fs.existsSync(claim_dir)) {
      fs.mkdirSync(claim_dir);

      fs.appendFile(claim_dir + "_content_partial.html", DEFAULT_CONTENT, () => {
      })

      fs.appendFile(claim_dir + "_content_styling.css", DEFAULT_STYLE, () => {
      })

      return res.send({
        template: req.body.name,
        content_img: DEFAULT_CONTENT,
        styling_img: DEFAULT_STYLE
      })
    }

    return res.apiBadRequest(new Error(`Template ${req.body.name} already exist`))
  } catch (err) {
    return res.apiFatal(err)
  }
}
