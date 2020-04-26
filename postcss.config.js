const path = require('path')

const plugins = {
  tailwindcss: {}
}

if (process.env.NODE_ENV === 'production') {
  plugins.purgecss = {
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    content: [path.join(__dirname, 'src/popup.rs')]
  }
}

module.exports = {
  plugins
}
