const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: { type: String, required: true },
  comment: { type: String, required: false },
  imagePath: { type: String, required: true },


});

module.exports = mongoose.model("Product", ProductSchema);
