const express = require("express");
const helmet = require("helmet");
const app = express();
const registry = require("./config/registry.json");
const routes = require("./routes");
const PORT = 5000;

app.use(express.json());
app.use(helmet());

const auth = (req, res, next) => {
  const {
    protocol,
    hostname,
    path,
    headers: { authorization },
  } = req;
  const url = `${protocol}://${hostname}${PORT}${path}`;
  const authString = Buffer.from(authorization, "base64").toString("utf-8");
  const authParts = authString.split(":");
  const [username, password] = authParts;
  console.log(`${username} | ${password}`);
  const user = registry.auth.users[username];
  if (user) {
    if (user.username === username && user.password === password) {
      next();
    } else {
      res.send({
        authenticated: false,
        path: url,
        message: "Authentication Unsuccessful: Incorrect password.",
      });
    }
  } else {
    res.send({
      authenticated: false,
      path: url,
      message: `Authentication Unsuccessful: User ${username} doesn't exist.`,
    });
  }
};

app.use(auth);
app.use("/", routes);

app.listen(PORT, () => console.log(`Gateway started on port ${PORT}`));
