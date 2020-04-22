const fs = require('fs')
const asyncFs = fs.promises

module.exports = base_dir => async (req, res) => {
  try {
    const templates = [];

    const raw_data = await asyncFs.readdir(base_dir, { withFileTypes: true, withFileStats: true});

    for (const dirent of raw_data) {
      if(dirent.isDirectory()) {
        const {name} = dirent
        const {birthtime, mtime, atime} = await asyncFs.stat(base_dir + name, {})

        templates.push({
          name,
          meta_data: {
            birthtime,
            mtime,
            atime
          }
        })
      }
    }

    return res.send({ templates })

  } catch (err) {

    return res.apiFatal(err)

  }
}
