const express = require("express");
const app = express();
const axios = require("axios");
const HOST = "http://localhost";
const PORT = 5002;

app.use(express.json());
app.get("/fakeapi", (req, res, next) => {
  res.send("Hello from fake api server.");
});
app.post("/bogusapi", (req, res, next) => {
  res.send("Bogus api says hello!");
});

app.listen(PORT, () => {
  axios({
    method: "POST",
    url: "http://localhost:5000/register",
    headers: { "Content-Type": "application/json" },
    data: {
      apiName: "registrytest",
      host: HOST,
      port: PORT,
      url: `${HOST}:${PORT}/`,
    },
  }).then((response) => {
    console.log(response.data);
  });
  console.log(`Fake server started on port ${PORT}`);
});
