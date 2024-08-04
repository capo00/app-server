const path = require("path");
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const config = require('../config/config');
const Command = require("./command");

const App = {
  init({ api = {}, publicPath = path.resolve(__dirname, "../../../../public") } = {}) {
    const app = express();

    // Middleware
    app.use(cors());

    // path to static folder, where are also assets
    app.use(express.static(publicPath));

    // Define your api here
    Command.createCommands(app, api);

    // All other GET requests not handled before will return our React app
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(publicPath, "index.html"));
    });

    // Start the server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });

    return app;
  }
}

module.exports = App;