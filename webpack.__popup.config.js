const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

/**
 * @param {any} _
 * @param {Object} argv
 * @param {'development' | 'production' | 'none'} [argv.mode]
 * @returns {import('webpack').Configuration}
 */
module.exports = (_, argv) => {
  return {
    mode: argv.mode || 'development',
    devtool:
      argv.mode === 'production' ? 'source-map' : 'eval-cheap-source-map',
    target: 'web',
    entry: {
      popup: path.join(__dirname, 'src/popup.ts')
    },
    output: {
      path: path.join(__dirname, 'out'),
      // publicPath: '../',
      filename: '[name]/bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.wasm']
    },
    devServer: {
      port: 33857
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin(
        process.env.NODE_ENV === 'production'
          ? {
              template: path.join(__dirname, 'src/index.html'),
              filename: path.join(__dirname, 'out/htmls/popup.html')
            }
          : {
              template: path.join(__dirname, 'src/index.html')
            }
      ),
      new WasmPackPlugin({
        crateDirectory: path.join(__dirname, '.'),
        outName: 'app'
      })
    ]
  }
}
