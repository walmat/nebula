'use strict';

/**
 * Webpack config for production electron main process
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import JavaScriptObfuscator from 'webpack-obfuscator';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import baseConfig from './config.base';
import { PATHS } from '../app/utils/paths';

export default merge.smart(baseConfig, {
  devtool: false,
  mode: 'production',
  target: 'electron-main',
  entry: {
    main: ['./app/main.dev']
  },

  output: {
    path: PATHS.root,
    filename: './app/[name].prod.js'
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true
      })
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: [
        `${PATHS.app}/main.prod.js`,
        `${PATHS.app}/child.prod.js`
      ]
    }),

    new BundleAnalyzerPlugin({
      analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false
    }),

    new JavaScriptObfuscator()
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty'
  }
});
