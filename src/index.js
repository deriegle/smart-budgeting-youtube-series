const plaid = require("plaid");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  "sandbox"
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Hello, world"
  });
});

app.listen(8080, () =>
  console.log("Server started. Listening at localhost:8080")
);
