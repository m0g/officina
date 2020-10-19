const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')

module.exports = {
  entry: [
    './src/_assets/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '_site'),
  },
  resolve: {
    fallback: {
      fs: 'empty',
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '/css/[name].css',
      chunkFilename: '[id].css',
    }),
    new ImageminWebpWebpackPlugin({
      config: [{
        test: /\.(jpe?g|png)/,
        options: {
          quality: 60,
        },
      }],
    }),
  ],
  node: {
    global: true,
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        use: 'babel-loader',
        exclude: '/node_modules'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            },
          },
          // 'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'responsive-loader',
            options: {
              adapter: require('responsive-loader/sharp'),
              // quality: 60,
              sizes: [
                20, // placeholder for lqip
                300,
                600,
                4000, // using a ridiculous width so it will process the original (won't make a bigger version)
              ],
              placeholder: false, // otherwise, bundle is too big
              name: '/_assets/img/[name]-[width].[ext]',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true,
            minimize: true,
          },
        },
      },
    ],
  },
}