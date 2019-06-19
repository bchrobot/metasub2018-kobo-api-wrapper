const express = require("express");
const router = express.Router();
const { getCitiesData, getMetadata } = require("./fetch-data");

var cache = require('memory-cache');


router.get("/:year?", async (req, res, next) => {
  const { year } = req.params;
  console.log(year);
  if (year === '2019'){
      let metadata = cache.get(year + '_metadata');
      let citiesData = cache.get(year + '_cities');
      if (metadata) {
          return res.send({ metadata, citiesData });
      }
      metadata = await getMetadata();
      citiesData = await getCitiesData(year);
      cache.put(year + '_metadata', metadata, 1000 * 60 * 5);
      cache.put(year + '_cities', citiesData, 1000 * 60 * 5);
      return res.send({ metadata, citiesData });

  } else {
      let metadata = cache.get(year + '_metadata');
      let citiesData = cache.get(year + '_cities');
      if (metadata) {
          return res.send({ metadata, citiesData });
      }
      metadata = await getMetadata();
      citiesData = await getCitiesData(year);
      cache.put(year + '_metadata', metadata, 1000 * 60 * 60 * 24);
      cache.put(year + '_cities', citiesData, 1000 * 60 * 60 * 24);
      return res.send({ metadata, citiesData });
  }

  
});

module.exports = router;
