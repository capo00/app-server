const App = require("./services/app");

if (process.env.NODE_ENV !== "production") App.init();

module.exports = {
  App
};