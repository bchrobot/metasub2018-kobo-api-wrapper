const express = require("express");
const d3 = require("d3");



const router = express.Router();
const request = require("request");

router.get("/city/:id", (req,res,next) => {
  const username = "bwellington";
  const password = process.env.pw;
  const url = `https://kc.kobotoolbox.org/api/v1/data/${req.params.id}?format=json`;
  console.log(req.params.id);
  request({
    url,
    auth:{
      user:username,
      pass:password
    }
  }, (err, response, body) => {
    if (err) throw err;
    console.log("response");
    res.send(body);
  });
});

const addPathsToCityList = rawData => {
  const cityListWithPaths = rawData.map(rawCity => {
    const cityWithPath = Object.assign({}, rawCity);
    if (cityWithPath.id !== ""){
      cityWithPath.path = `https://kc.kobotoolbox.org/api/v1/data/${cityWithPath.id}?format=json`;
      cityWithPath.live = true;
    }else{
      cityWithPath.live = false;
    }
    return cityWithPath;
  });
  return cityListWithPaths;
};

const username = "bwellington";
const testId = "106051";



router.get("/", (req,res,next) => {
  const password = process.env.pw;
  const cityListPath = "https://s3-us-west-2.amazonaws.com/metasub2017/data/cities.csv";

  const getD3Json = id => {
    return d3.json(`https://kc.kobotoolbox.org/api/v1/data/${id}?format=json`)
      .user(username)
      .password(password);
    };


  const loadKoboData = cityList => {
    const q = d3.queue();
    const cityListWithPaths = addPathsToCityList(cityList);
    cityListWithPaths.filter(d => d.live)
      //.slice(0,3)
      .map(d => getD3Json(d.id))
      .forEach(d => {
        q.defer(d.get);
      });

    q.awaitAll((...data) => {
      if (data[0]) throw data[0];
      const samples = data[1];
      console.log(samples.length);
      res.send(data);
    });
    
  };

  d3.csv(cityListPath, (error, cityList) => {
    if (error) throw error;
    console.log("city list loaded");
    //console.log(cityList);
    loadKoboData(cityList);
  });



  
});

module.exports = router;