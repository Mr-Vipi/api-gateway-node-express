const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("../config/registry.json");
const fs = require("fs");

router.all("/:apiName/:path", (req, res) => {
  const {
    method,
    headers,
    body,
    params: { apiName, path },
  } = req;

  console.log("apiName:", apiName);
  if (registry.services[apiName]) {
    axios({
      method,
      url: registry.services[apiName].url + path,
      headers,
      data: body,
    }).then((response) => {
      res.send(response.data);
    });
  } else {
    res.send("API Name doesn't exist");
  }
});

router.post("/register", (req, res) => {
  const { apiName, protocol, host, port } = req.body;

  const url = `${protocol}://${host}:${port}/`;
  registry.services[apiName] = { ...req.body, url };
  fs.writeFile("./config/registry.json", JSON.stringify(registry), (error) => {
    if (error) {
      res.send(`Could not register ${apiName} \n ${error}`);
    } else {
      res.send(`Successfully registered ${apiName}`);
    }
  });
});

module.exports = router;
