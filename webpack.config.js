const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');

module.exports = (async (_, args = {}) => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    mode: args.env || 'development',
    entry: './handler.ts',
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, '.webpack'),
      filename: 'handler.js'
    },
    devtool: 'cheap-inline-source-map',
    resolve: {
      extensions: [ '.js', '.jsx', '.json', '.ts', '.tsx' ]
    },
    target: 'node',
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
    ],
    module: {
      rules: [
        {
          include: /\.tsx?$/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
  };
})();
