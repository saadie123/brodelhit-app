const NodeGeoCoder = require("node-geocoder");
const config = require("../config/config");
const geocoder = NodeGeoCoder({
  provider: "google",
  apiKey: config.googleApiKey
});

module.exports = geocoder;
