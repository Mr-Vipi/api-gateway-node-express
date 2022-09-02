const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("../config/registry.json");

router.all("/:apiName/:path", (req, res) => {
  console.log("apiName:", req.params.apiName);
  if (registry.services[req.params.apiName]) {
    axios({
      method: req.method,
      url: registry.services[req.params.apiName].url + req.params.path,
      headers: req.headers,
      data: req.body,
    }).then((response) => {
      res.send(response.data);
    });
  } else {
    res.send("API Name doesn't exist");
  }
});

module.exports = router;
