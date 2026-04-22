const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    img_name: {
      type: String,
      required: true,
      trim: true,
    },
    img_alt: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["PlayStation", "Xbox", "PC"],
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      enum: ["RPG", "Shooter", "Action", "Sports", "Adventure", "Sandbox"],
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    price_display: {
      type: String,
      required: true,
      trim: true,
    },
    detail_link: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);