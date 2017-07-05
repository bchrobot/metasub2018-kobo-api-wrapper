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
  const getD3Json = id => {
    return d3.json(`https://kc.kobotoolbox.org/api/v1/data/${id}?format=json`)
      .user(username)
      .password(password);
    };

  fs.readFile("./data/cities.csv", "utf8", (err,data) => {
    loadKoboData(d3.csvParse(data));
  });

  function loadKoboData(cityList){
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
      loadMetadata(cityListWithFeatures);
      //res.send(cityListWithFeatures);
    });
  }

  function loadMetadata(cityListWithFeatures){
    fs.readFile("./data/metadata.csv", "utf8", (err,data) => {
      res.send({citiesData: cityListWithFeatures, metadata: d3.csvParse(data)});
    });
  }
});

module.exports = router;