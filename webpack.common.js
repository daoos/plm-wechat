const path = require('path');
const vuxLoader = require('vux-loader')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  entry: {
    tasklist: './src/taskList.js',
    binduser: './src/bindUser.js',
    unbinduser: './src/unBindUser.js',
    search: './src/search.js',
    scan: './src/scan.js',
    wxtemplatenotice: './src/wxtasktemplate.js',
    wxdownload: './src/download.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        include: path.join(__dirname, 'src'),
        loader: "babel-loader"
      },
      { 
        test: /\.vue$/, 
        use: [
          {
            loader: "vue-loader",
            options: {
              loaders: {
                js: [{ loader: 'babel-loader', options: { presets: ['env', 'stage-2'] } }],
                css: 'vue-style-loader!css-loader'
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/,
        use: [ 'style-loader', 'css-loader', 'less-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  }
};

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    'vux-ui',
    {
      name: 'less-theme',
      path: 'src/styles/theme.less'
    }
  ]
})