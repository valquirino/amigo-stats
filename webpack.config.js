const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './')
    },
    port: 3000,
    hot: true,
    watchFiles: ['*.html', 'pages/*.html', 'js/*.js', 'css/*.css', 'tailwind.config.js'],
    open: true,
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true,
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['main']
    }),
    // Tratar os arquivos HTML nas subpastas
    new HtmlWebpackPlugin({
      template: './pages/dashboard.html',
      filename: 'pages/dashboard.html',
      inject: 'body',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './pages/players.html',
      filename: 'pages/players.html',
      inject: 'body',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './pages/clubs.html',
      filename: 'pages/clubs.html',
      inject: 'body',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './pages/register-player.html',
      filename: 'pages/register-player.html',
      inject: 'body',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './pages/register-club.html',
      filename: 'pages/register-club.html',
      inject: 'body',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './pages/user-profile.html',
      filename: 'pages/user-profile.html',
      inject: 'body',
      chunks: ['main']
    }),
    // Copiar os arquivos estáticos
    new CopyWebpackPlugin({
      patterns: [
        { from: 'js', to: 'js' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css'],
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
}; 