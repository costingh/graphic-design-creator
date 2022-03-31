const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      max: 500,
    },
    json: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    unit: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Design", DesignSchema);
