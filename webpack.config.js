const path = require('path');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  entry: './server.js',
  mode: 'production',
  target: 'node',
  plugins: [
    new CaseSensitivePathsPlugin()
    // other plugins ...
  ],
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'server.bundle.js'
  },
};