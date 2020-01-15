const plaid = require("plaid");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const PlaidItem = require("./models/plaid-item");
const PlaidAccount = require("./models/plaid-account");
const User = require("./models/user");
const app = express();

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true
});

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "plaid-link.html"));
});

app.post("/plaid_token_exchange", async (req, res) => {
  try {
    const { publicToken } = req.body;

    const { access_token } = await client
      .exchangePublicToken(publicToken)
      .catch(console.error);

    const { accounts, item } = await client
      .getAccounts(access_token)
      .catch(console.error);

    const user = await User.findOne().exec();

    const plaidItem = await new PlaidItem({
      userId: user._id,
      availableProducts: item.available_products,
      billedProducts: item.billed_products,
      institutionId: item.institution_id,
      itemId: item.item_id,
      webhook: item.webhook
    }).save();

    console.log({ user, plaidItem });

    const savedAccounts = accounts.map(
      async account =>
        await new PlaidAccount({
          plaidItemId: plaidItem._id,
          accountId: account.account_id,
          mask: account.mask,
          balances: account.balances,
          name: account.name,
          officialName: account.official_name,
          subtype: account.subtype,
          type: account.type
        }).save()
    );

    console.log({
      savedAccounts
    });
  } catch (e) {
    console.error(e);
  }
});

app.listen(8080, () =>
  console.log("Server started. Listening at localhost:8080")
);
