const express = require("express");
const router = express.Router();
const { getCitiesData, getMetadata } = require("./fetch-data");

router.get("/:year?", async (req, res, next) => {
  const { year } = req.params;
  const metadata = await getMetadata();
  const citiesData = await getCitiesData(year);
  return res.send({ metadata, citiesData });
});

module.exports = router;
