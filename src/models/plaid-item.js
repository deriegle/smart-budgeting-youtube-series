const { model, Schema } = require("mongoose");

module.exports = model(
  "PlaidItem",
  new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    availableProducts: Array,
    billedProducts: Array,
    institutionId: String,
    itemId: String,
    webhook: String
  })
);
