const path = require("path");

module.exports = {
    entry: './src/injected/script/index.js',
    mode: 'development',
    output: {
      filename: 'bedtimeContent.js',
      path: path.resolve(__dirname, '../../dist/unpacked/injected/script')
    }
  };