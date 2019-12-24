const plaid = require("plaid");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

function handleError(errorMessage) {
  console.error(errorMessage);
}

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
  const { publicToken } = req.body;

  const { access_token } = await client
    .exchangePublicToken(publicToken)
    .catch(handleError);

  const { accounts, item } = await client
    .getAccounts(access_token)
    .catch(handleError);

  console.log({
    accounts,
    item
  });
});

app.listen(8080, () =>
  console.log("Server started. Listening at localhost:8080")
);
