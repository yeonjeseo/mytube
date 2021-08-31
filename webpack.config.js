const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const JS_PATH = "./src/client/js/";

module.exports = {
  entry: {
    main: JS_PATH + "main.js",
    videoPlayer: JS_PATH + "videoPlayer.js",
    recorder: JS_PATH + "recorder.js",
    comment: JS_PATH + "commentSection.js",
  },
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
