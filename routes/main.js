const router = require("express").Router();
const iplocation = require("iplocation");
const geocoder = require("../helpers/geocoder");

const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
router.get("/", async (req, res) => {
  try {
    const search = req.query.search;
    const location = req.query.location;
    const today = new Date();
    if (search !== "" && search !== undefined) {
      let query = {
        title: new RegExp(search, "i"),
        location: {
          city: "global",
          country: "global",
          countryCode: "global",
          address: "global"
        },
        date: { $gte: today }
      };
      if (location !== "" && location !== undefined) {
        let loc = await geocoder.geocode({ address: location });
        query = {
          title: new RegExp(search, "i"),
          $or: [
            {
              location: {
                city: "global",
                country: "global",
                countryCode: "global",
                address: "global"
              }
            },
            {
              "location.city": loc[0].city
                ? loc[0].city
                : loc[0].extra.neighborhood
            },
            {
              "location.country": loc[0].country
            },
            {
              "location.countryCode": loc[0].countryCode
            },
            { "location.address": loc[0].formattedAddress }
          ],
          date: { $gte: today }
        };
      }
      const products = await Product.find(query).sort({ date: "desc" });
      const categories = await Category.find();
      return res.render("home", { products, categories });
    } else {
      let query = {
        location: {
          city: "global",
          country: "global",
          countryCode: "global",
          address: "global"
        },
        date: { $gte: today }
      };
      if (location !== "" && location !== undefined) {
        let loc = await geocoder.geocode({ address: location });
        query = {
          title: new RegExp(search, "i"),
          $or: [
            {
              location: {
                city: "global",
                country: "global",
                countryCode: "global",
                address: "global"
              }
            },
            {
              location: {
                city: "global",
                country: "global",
                countryCode: "global",
                address: "global"
              }
            },
            {
              "location.city": loc[0].city
                ? loc[0].city
                : loc[0].extra.neighborhood
            },
            {
              "location.country": loc[0].country
            },
            {
              "location.countryCode": loc[0].countryCode
            },
            { "location.address": loc[0].formattedAddress }
          ],
          date: { $gte: today }
        };
      } else {
        const ip = req.headers["x-forwarded-for"];
        const iploc = await iplocation(ip);
        if (iploc) {
          query = {
            $or: [
              {
                location: {
                  city: "global",
                  country: "global",
                  countryCode: "global",
                  address: "global"
                }
              },
              {
                "location.city": iploc.city
              },
              {
                "location.city": iploc.region
              },
              {
                "location.country": iploc.country_name
              },
              {
                "location.countryCode": iploc.country
              }
            ],
            date: { $gte: today }
          };
        }
      }

      const products = await Product.find(query).sort({ date: "desc" });
      const categories = await Category.find();
      return res.render("home", { products, categories });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/profile", async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({
      date: "desc"
    });
    const userProducts = await Product.find({
      _id: { $in: req.user.participating }
    });
    res.render("profile", { products, userProducts });
  } catch (error) {
    console.log(error);
  }
});

router.post("/profile", async (req, res) => {
  req.user.description = req.body.description;
  await req.user.save();
  res.json({ success: true });
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const profile = await User.findById(id);
  const products = await Product.find({ user: profile._id }).sort({
    date: "desc"
  });
  const userProducts = await Product.find({
    _id: { $in: profile.participating }
  });
  if (profile) {
    res.render("user", { profile, products, userProducts });
  }
});

module.exports = router;
