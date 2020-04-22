const fs = require('fs')
const asyncFs = fs.promises

const {CONTENT_URI, STYLING_URI, DEFAULT_IMG, forEachFile} = require('./helper')

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

    const images = []


    if (!fs.existsSync(claim_dir)) {
      await asyncFs.mkdir(claim_dir);

      forEachFile(async (file_name) => {
        const image = DEFAULT_IMG.get(file_name);
        images.push(image)

        await asyncFs.appendFile(claim_dir + file_name, image)
      })

      const {birthtime, mtime, atime} = await asyncFs.stat(claim_dir, {})

      return res.send({
        name: template_name,
        meta_data: {
          birthtime,
          mtime,
          atime
        },
        content_img: images[0],
        styling_img: images[1]
      })
    }

    return res.apiBadRequest(new Error(`Template '${template_name}' already exist`))
  } catch (err) {
    return res.apiFatal(err)
  }
}
