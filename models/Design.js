const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      max: 500,
    },
    json: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Design", DesignSchema);
