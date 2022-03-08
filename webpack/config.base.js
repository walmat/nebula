import path from 'path';
import webpack from 'webpack';

import { PATHS } from '../app/utils/paths';

const pkg = require('../package.json');

export default {
  externals: [...Object.keys(pkg.dependencies || {})],

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.wav$|\.mp3$/,
        exclude: /node_modules/,
        loader: 'file-loader'
      }
    ]
  },

  output: {
    path: PATHS.app,
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@Log': path.resolve(__dirname, '../app/utils/log.ts')
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.DefinePlugin({
      PKG_INFO: {
        productName: JSON.stringify(pkg.productName),
        description: JSON.stringify(pkg.description),
        name: JSON.stringify(pkg.name),
        author: JSON.stringify(pkg.author),
        version: JSON.stringify(pkg.version),
        repository: JSON.stringify(pkg.repository),
        homepage: JSON.stringify(pkg.homepage),
        build: JSON.stringify(pkg.build)
      }
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new webpack.NamedModulesPlugin()
  ]
};
