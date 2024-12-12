const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
        enum: ["noel", "tết"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categoriesSchema);
