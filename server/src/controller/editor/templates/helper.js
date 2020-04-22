const CONTENT_URI = "_content_partial.html"
const STYLING_URI = "_styling_partial.css"
const CACHE_URI = "cache.html"

const FILES = [CONTENT_URI, STYLING_URI, CACHE_URI]

const DEFAULT_IMG = new Map([
  [CONTENT_URI, "<!--inky html supported></!-->"],
  [STYLING_URI, "/* css here */"],
  [CACHE_URI, ""]
])

const mapOnFiles = (operation) => {
  return FILES.map(operation)
}

const forEachFile = (operation) => {
  FILES.forEach(operation)
}


module.exports =  {
  CONTENT_URI,
  STYLING_URI,
  CACHE_URI,
  DEFAULT_IMG,
  mapOnFiles,
  forEachFile
}

