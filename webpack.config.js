const path = require('path');

module.exports = {
  entry: './server.js',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'server.bundle.js'
  },
  loader: "babel-loader", // or just "babel"
  query: {
    presets: [ <other presets />, 'stage-0']
  },
};