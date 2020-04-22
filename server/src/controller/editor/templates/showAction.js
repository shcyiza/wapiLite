const fs = require('fs')
const asyncFs = fs.promises

const {CONTENT_URI, STYLING_URI} = require('./helper')

module.exports = base_dir => async (req, res) => {
  let template_dir;
  const { template_name } = req.params
  const claim_dir = `${base_dir}${template_name}/`

  try {
    template_dir = await asyncFs.stat(claim_dir, {})
  } catch(err) {
    return res.apiBadRequest(Error(`Template '${template_name}' does not exists`))
  }

  try {
    const {birthtime, mtime, atime} = template_dir

    const content_img = await asyncFs.readFile(claim_dir + CONTENT_URI, 'utf8')
    const styling_img = await asyncFs.readFile(claim_dir + STYLING_URI, 'utf8')

    return res.apiResponse({
      name: template_name,
      meta_data: {
        birthtime,
        mtime,
        atime
      },
      content_img,
      styling_img
    })
  } catch (err) {
    return res.apiFatal(err)
  }
}
