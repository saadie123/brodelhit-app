const router = require("express").Router();
const Category = require("../models/Category");

router.get("/categories/create", async (req, res) => {
  try {
    const categories = [
      {
        name: "Sports & Fitness",
        icon: "sport_fitnes"
      },
      {
        name: "Fashion",
        icon: "fashion"
      },
      {
        name: "Experiences",
        icon: "experience"
      },
      {
        name: "Home Products",
        icon: "home_products"
      },
      {
        name: "Technology",
        icon: "technology"
      },
      {
        name: "Other",
        icon: "text_icon"
      }
    ];
    categories.forEach(async cat => {
      let oldCategory = await Category.findOne({ name: cat.name });
      if (!oldCategory) {
        let category = new Category({
          name: cat.name,
          icon: cat.icon
        });
        await category.save();
      }
    });
    res.send("Create category");
  } catch (error) {}
});

module.exports = router;
