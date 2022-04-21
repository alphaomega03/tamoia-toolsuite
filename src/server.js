const express = require("express");
const axios = require("axios"); 
const SUPPORTED_FIAT = require('./consts.js').SUPPORTED_FIAT
const COIN_API_KEY = require('./consts.js').COIN_API_KEY
const COIN_API_BASE_URL = require('./consts.js').COIN_API_BASE_URL
const getUuid = require('uuid-by-string')
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
  const dayta = {
    AssetIdBase: ans.data.asset_id_base,
    Rates: ans.data.rates.map((d) => {
      return {
        ExternalId: getUuid(`${ans.data.asset_id_base}-${d.asset_id_quote}`),
        TimeStamp: d.time,
        AssetIdQuote: d.asset_id_quote,
        Rate: d.rate,
        DisplayUrl: `/exchangeRate?base=${ans.data.asset_id_base}&quote=${d.asset_id_quote}`
      }
    })
  }
  res.send(dayta);
});

app.get("/exchangeRate", async (req, res) => {
  const response = await axios.get(`${COIN_API_BASE_URL}/exchangerate/${req.query.base}/${req.query.quote}`, AXIOS_CONFIG)
  const { src_side_base, src_side_quote, ...restObject } = response.data
  
  const obj = {
    ExternalId: getUuid(`${restObject.asset_id_base}-${restObject.asset_id_quote}`),
    Timestamp: restObject.time,
    AssetIdBase: restObject.asset_id_base,
    AssetIdQuote: restObject.asset_id_quote
  }

  res.send(obj);
});


const cyrb53 = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1>>>0);
}


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);