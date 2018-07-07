const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    login: "./public/src/login.js",
    room: "./public/src/room.js",
    ingame: "./public/src/ingame.js"
  },
  output: {
		path: path.join(__dirname, "public/dist"),
		filename: "[name].js"
	}
};
