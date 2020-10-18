const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['_site'] },
      ghostMode: false,
      notify: false,
      watch: true,
      open: false, // won't automatically launch in default browser when started
    }),
    new BundleAnalyzerPlugin({
      analyzerHost: "0.0.0.0",
      openAnalyzer: false
    })

  ],
  watch: true,
  watchOptions: {
    ignored: [
      '_site/**/*.js', 
      'node_modules/**',
      '**/.(png|jpg|jpeg|svg)'
    ]
  },
  devtool: 'inline-source-map'
})