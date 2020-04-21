const fs = require('fs')

module.exports = base_dir => (req, res) => {
  try {
    const templates = [];

    const raw_data = fs.readdirSync(base_dir, { withFileTypes: true, withFileStats: true});

    for (const dirent of raw_data) {
      if(dirent.isDirectory()) {
        const {name} = dirent
        console.log(dirent)
        const {birthtime, mtime, atime} = fs.statSync(base_dir + name, {}, ()=>{})

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
