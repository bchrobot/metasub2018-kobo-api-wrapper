const express = require("express");
const d3 = require("d3");
const router = express.Router();
const request = require("request");
const fs = require("fs");

const addPathsToCityList = rawData => {
  const cityListWithPaths = rawData.map(rawCity => {
    const cityWithPath = Object.assign({}, rawCity);
    if (cityWithPath.id !== ""){
      cityWithPath.path = `https://kc.kobotoolbox.org/api/v1/data/${cityWithPath.id}?format=json`;
      cityWithPath.live = true;
    }else{
      cityWithPath.live = false;
    }
    cityWithPath.lat = parseFloat(cityWithPath.lat);
    cityWithPath.lon = parseFloat(cityWithPath.lon);
    return cityWithPath;
  });
  return cityListWithPaths;
};





router.get("/", (req,res,next) => {
  const username = "bwellington";
  const password = process.env.pw;
  //const cityListPath = "https://s3-us-west-2.amazonaws.com/metasub2017/data/cities.csv";
  const cityListPath = "static/cities.csv";
  const getD3Json = id => {
    return d3.json(`https://kc.kobotoolbox.org/api/v1/data/${id}?format=json`)
      .user(username)
      .password(password);
    };

  fs.readFile("./data/cities.csv", "utf8", (err,data) => {
    loadAndSendKoboData(d3.csvParse(data));
  });

  // d3.csv(cityListPath, (error, cityList) => {
  //   if (error) throw error;
  //   console.log(error);
  //   console.log(cityList);
  //   loadAndSendKoboData(cityList);
  // });

  function loadAndSendKoboData(cityList){
    const q = d3.queue();
    const cityListWithPaths = addPathsToCityList(cityList);
    cityListWithPaths.filter(d => d.live)
      .map(d => getD3Json(d.id))
      .forEach(d => {
        q.defer(d.get);
      });

    q.awaitAll((...data) => {
      if (data[0]) throw data[0];
      const samples = data[1];
      let dataAdded = 0;
      const cityListWithFeatures = cityListWithPaths.map((city, i) => {
        const cityWithFeatures = Object.assign({}, city);
        if (cityWithFeatures.live){
          cityWithFeatures.features = samples[dataAdded];
          dataAdded++;
        }
        return cityWithFeatures;
      });
      res.send(cityListWithFeatures);
    });
  };
});

module.exports = router;