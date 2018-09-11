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
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const search = req.query.search;
    const location = req.query.location;
    const today = new Date();
    if (search !== "" && search !== undefined) {
      let query = {
        title: new RegExp(search, "i"),
        location: "Todo el mundo",
        date: { $gte: today }
      };
      if (location !== "" && location !== undefined) {
        let loc = await geocoder.geocode(location);
        query = {
          title: new RegExp(search, "i"),
          $or: [
            { location: "Todo el mundo" },
            { location: { $regex: loc[0].countryCode, $options: "i" } },
            { location: { $regex: loc[0].city, $options: "i" } }
          ],
          date: { $gte: today }
        };
      }
      const products = await Product.find(query).sort({ date: "desc" });
      const categories = await Category.find();
      return res.render("home", { products, categories });
    } else {
      let query = { location: "Todo el mundo", date: { $gte: today } };
      if (location !== "" && location !== undefined) {
        let loc = await geocoder.geocode(location);
        query = {
          title: new RegExp(search, "i"),
          $or: [
            { location: "Todo el mundo" },
            { location: { $regex: loc[0].countryCode, $options: "i" } },
            { location: { $regex: loc[0].city, $options: "i" } }
          ],
          date: { $gte: today }
        };
      }
      const products = await Product.find(query).sort({ date: "desc" });
      const categories = await Category.find();

      return res.render("home", { products, categories });
    }
    const ip = req.headers["x-forwarded-for"];
    const iploc = geoip.lookup(ip);
    let query = {
      location: "Todo el mundo",
      date: { $gte: today }
    };
    if (iploc) {
      query = {
        $or: [
          { location: "Todo el mundo" },
          { location: { $regex: iploc.country, $options: "i" } },
          { location: { $regex: iploc.city, $options: "i" } },
          { location: { $regex: iploc.region, $options: "i" } }
        ],
        date: { $gte: today }
      };
    }
    const products = await Product.find(query).sort({ date: "desc" });
    const categories = await Category.find();

    res.render("home", { products, categories });
  } catch (error) {
    console.log(error);
  }
});

router.get("/profile", async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({
      date: "desc"
    });
    res.render("profile", { products });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
