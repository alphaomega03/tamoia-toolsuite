const express = require("express");
const axios = require("axios"); 
const SUPPORTED_FIAT = require('./consts.js').SUPPORTED_FIAT
const COIN_API_KEY = require('./consts.js').COIN_API_KEY
const COIN_API_BASE_URL = require('./consts.js').COIN_API_BASE_URL
const AXIOS_CONFIG = {
  headers: {
    'X-CoinAPI-Key': COIN_API_KEY
  }
}

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 8080;
// node.js doc (https://cloud.google.com/run/docs/reference/container-contract#port) set port to 8080 instead of 3000 like in express.js doc (https://expressjs.com/en/starter/hello-world.html), cloud run doc (https://cloud.google.com/run/docs/reference/container-contract#port) also say port must be 8080
// also calling this file server.js as per node.js doc (https://nodejs.org/en/docs/guides/nodejs-docker-webapp/), express doc calls it app.js, changed this in the package.json as well
// "The environment variables defined in the container runtime contract are reserved and cannot be set. In particular, the PORT environment variable is injected inside your container by Cloud Run. You should not set it yourself." - https://cloud.google.com/run/docs/configuring/environment-variables - got port declaration and initialization line from https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nodejs
// process.env.<?> references an environment variable and can be configured in tf code for the cloud run resource (search for env block in doc) - https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_service

const app = express();
// https://www.npmjs.com/package/uuid

app.get("/hello", (req, res) => {
  res.send('Hello Dan!')
});

app.get("/fiatExchangeRates/ETH", async (req, res) => {

  const ans = await axios.get(`${COIN_API_BASE_URL}/exchangerate/ETH?invert=false&filter_asset_id=${SUPPORTED_FIAT.toString()}`, AXIOS_CONFIG)
  console.log(ans, ans.data)  
  res.send(ans.data);
});

app.get("/exchangeRate", async (req, res) => {
  const response = await axios.get(`${COIN_API_BASE_URL}/exchangerate/${req.query.base}/${req.query.quote}`, AXIOS_CONFIG)
  const { src_side_base, src_side_quote, ...restObject } = response.data

  res.send(restObject);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);