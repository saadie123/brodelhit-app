const router = require("express").Router();
const bcrypt = require("bcrypt");
const geoip = require("geoip-lite");
const NodeGeoCoder = require("node-geocoder");
const config = require("../config/config");
const geocoder = NodeGeoCoder({
  provider: "google",
  apiKey: config.googleApiKey
});
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    return res.send(req.connection.remoteAddress);
    const search = req.query.search;
    const location = req.query.location;
    if (search !== "" && search !== undefined) {
      let query = { title: new RegExp(search, "i"), location: "Todo el mundo" };
      if (location !== "" && location !== undefined) {
        let loc = await geocoder.geocode(location);
        query = {
          title: new RegExp(search, "i"),
          $or: [
            { location: "Todo el mundo" },
            { location: { $regex: loc[0].countryCode, $options: "i" } },
            { location: { $regex: loc[0].city, $options: "i" } }
          ]
        };
      }
      const products = await Product.find(query);
      return res.render("home", { products });
    } else {
      let query = { location: "Todo el mundo" };
      if (location !== "" && location !== undefined) {
        let loc = await geocoder.geocode(location);
        query = {
          title: new RegExp(search, "i"),
          $or: [
            { location: "Todo el mundo" },
            { location: { $regex: loc[0].countryCode, $options: "i" } },
            { location: { $regex: loc[0].city, $options: "i" } }
          ]
        };
      }
      const products = await Product.find(query);
      return res.render("home", { products });
    }
    const ip = req.connection.remoteAddress;
    const iploc = geoip.lookup(ip);
    let query = {
      location: "Todo el mundo"
    };
    if (iploc) {
      query = {
        $or: [
          { location: "Todo el mundo" },
          { location: { $regex: iploc.country, $options: "i" } },
          { location: { $regex: iploc.city, $options: "i" } },
          { location: { $regex: iploc.region, $options: "i" } }
        ]
      };
    }
    const products = await Product.find(query);
    res.render("home", { products });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
