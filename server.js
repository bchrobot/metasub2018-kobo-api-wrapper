require("dotenv").load();

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const routes = require("./src/routes");

const app = express();
app.use(cors());
app.use(compression());

app.use(routes);

app.use((err, req, res, next) => {
  console.log("ERROR");
  res.status(422).send({ error: err.message });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("MetaSUB Kobo API Wrapper - 2018");
});
