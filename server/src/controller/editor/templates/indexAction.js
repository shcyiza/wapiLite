const fs = require('fs')

module.exports = base_dir => (req, res) => {
  try {
    const templates = [];

    const raw_data = fs.readdirSync(base_dir, { withFileTypes: true });

    for (const element of raw_data) {
      if(element.isDirectory()) {
        const {name} = element
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
