const express = require("express");
const router = express.Router();
const axios = require("axios");

router.all("/:apiName", (req, res) => {
  console.log("apiName:", req.params.apiName);
  axios.get(`http://localhost:5001/${req.params.apiName}`).then((response) => {
    res.send(response.data);
  });
});

module.exports = router;
