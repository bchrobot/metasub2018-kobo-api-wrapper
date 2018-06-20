const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require('compression');
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(compression());
const env = process.env.NODE_ENV || "development";

if (env === "development"){
  dotenv.load();
}

//app.use(express.static("data"));

app.use(routes);

app.use((err, req, res, next) => {
  console.log("ERROR");
  res.status(422).send({error: err.message});
});

app.listen(process.env.PORT || 3000, function(){
  console.log("EXAMPLE APP");
});