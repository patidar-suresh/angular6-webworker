const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

module.exports = {
  'plugins': [
    new ReplaceInFileWebpackPlugin([{
      dir: 'src/assets/workers',
      files: ['main.js'],
      rules: [{
        search: '}(exports,',
        replace: '}('
      }]
    }])
  ]
};
