const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const sgMail = require("@sendgrid/mail");
const app = express();

const env = require("dotenv").config();

const SENDGRID_KEY = env.parsed["SENDGRID_KEY"];

sgMail.setApiKey(SENDGRID_KEY);

app.use(cors());
app.use(morgan("dev"));

app.use(express.static(path.resolve(__dirname, "build")));

app.use(bodyParser.json());

app.post("/api/sendemail", (req, res) => {
  const {
    customerName,
    carYear,
    carModel,
    dealerPrice,
    consignPrice,
    templateID,
    emailTo,
    emailFrom
  } = req.body;
  const msg = {
    to: emailTo,
    from: "hello@beyondcars.com",
    templateId: templateID,
    dynamic_template_data: {
      firstName: customerName,
      year: carYear,
      model: carModel,
      direct: dealerPrice,
      consign: consignPrice
    }
  };

  sgMail
    .send(msg)
    .then(response => {
      console.log("s");
      return res.json({ status: 200 });
    })
    .catch(err => {
      console.log(err);
      return res.json({ status: 400 });
    });
});
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(4000, err => {
  console.log("listening on http://0.0.0.0:4000");
});
