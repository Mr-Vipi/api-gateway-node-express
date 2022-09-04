const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("../config/registry.json");
const fs = require("fs");
const loadBalancer = require("../util/loadBalancer");

router.post("/enable/:apiName", (req, res) => {
  const {
    body,
    params: { apiName },
  } = req;
  const instances = registry.services[apiName].instances;
  const index = instances.findIndex((srv) => srv.url === body.url);
  if (index === -1) {
    res.send({
      status: "error",
      message: `Couldn't find "${body.url}" for service "${apiName}"`,
    });
  } else {
    instances[index].enabled = body.enabled;
    fs.writeFile(
      "./config/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(
            `Could not enable/disable "${body.url}" for service "${apiName}": \n "${error}"`
          );
        } else {
          res.send(
            `Successfully enabled/disabled "${body.url}" for service "${apiName}" \n`
          );
        }
      }
    );
  }
});

router.all("/:apiName/:path", (req, res) => {
  const {
    method,
    headers,
    body,
    params: { apiName, path },
  } = req;
  const service = registry.services[apiName];
  if (service) {
    if (!service.loadBalanceStrategy) {
      service.loadBalanceStrategy = "ROUND_ROBIN";
      fs.writeFile(
        "./config/registry.json",
        JSON.stringify(registry),
        (error) => {
          if (error) {
            res.send(`Couldn't write load balance strategy \n ${error}`);
          }
        }
      );
    }

    const newIndex = loadBalancer[service.loadBalanceStrategy](service);
    const url = service.instances[newIndex].url;
    console.log("url:", url);
    axios({
      method,
      url: `${url}${path}`,
      headers,
      data: body,
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => res.send(""));
  } else {
    res.send("API Name doesn't exist");
  }
});

router.post("/register", (req, res) => {
  const { apiName, protocol, host, port } = req.body;
  const url = `${protocol}://${host}:${port}/`;

  if (apiAlreadyExists({ ...req.body, url })) {
    res.send(`Configuration already exists for "${apiName}" at "${url}"`);
  } else {
    registry.services[apiName].instances.push({ ...req.body, url });
    fs.writeFile(
      "./config/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(`Could not register "${apiName}" \n ${error}`);
        } else {
          res.send(`Successfully registered "${apiName}"`);
        }
      }
    );
  }
});

router.post("/unregister", (req, res) => {
  const { apiName, url } = req.body;

  if (apiAlreadyExists(req.body)) {
    const index = registry.services[apiName].instances.findIndex((instance) => {
      return url === instance.url;
    });
    registry.services[apiName].instances.splice(index, 1);
    fs.writeFile(
      "./config/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(`Could not unregister "${apiName}" \n ${error}`);
        } else {
          res.send(`Successfully unregistered "${apiName}"`);
        }
      }
    );
  } else {
    res.send(`Configuration doesn't exist for "${apiName}" at ${url}`);
  }
});

const apiAlreadyExists = (registrationInfo) => {
  let exists = false;
  const { apiName, url } = registrationInfo;

  registry.services[apiName].instances.forEach((instance) => {
    if (instance.url === url) {
      exists = true;
    }
  });

  return exists;
};

module.exports = router;
