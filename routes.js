const express = require("express");

const router = express.Router();
const request = require("request");

router.get("/", (req,res,next) => {
  const username = "bwellington";
  const password = process.env.pw;
  const url = "https://kc.kobotoolbox.org/api/v1/data/102154?format=json";
  //authenticationHeader also works?
  //const authenticationHeader = "Basic " + new Buffer(username + ":" + password).toString("base64");

  request({
    url,
    auth:{
      user:username,
      pass:password
    }
    //headers: {"Authorization": authenticationHeader}
  }, (err, response, body) => {
    if (err) throw err;
    res.send(body);
  });
});

module.exports = router;