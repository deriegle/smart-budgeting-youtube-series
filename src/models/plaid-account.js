const { model, Schema } = require("mongoose");

module.exports = model(
  "PlaidAccount",
  new Schema({
    plaidItemId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    accountId: {
      type: String,
      required: true
    },
    mask: String,
    balances: {
      available: Number,
      current: Number,
      limit: Number,
      isoCurrencyCode: String,
      unofficialCurrencyCode: String
    },
    name: {
      type: String,
      required: true
    },
    officialName: {
      type: String
    },
    subtype: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  })
);
