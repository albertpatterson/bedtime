const mainConf = require("../webpack.main.conf");
const path = require("path");

module.exports = {
    entry: './src/background/index.js',
    mode: 'development',
    output: {
      filename: 'background.js',
      path: path.resolve(__dirname, '../../dist/unpacked/background')
    }
  };