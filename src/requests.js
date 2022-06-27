const { COIN_API_BASE_URL, SUPPORTED_FIAT, COIN_API_KEY, OPEN_SEA_API_KEY, OPEN_SEA_API_BASE_URL, RARITY_SNIFFER_BASE_URL, CLOUD_FUNCTIONS_BASE_URL } = require('./consts') 
const axios = require('axios')
const moment = require('moment')
const { GoogleAuth } = require('google-auth-library')
const auth = new GoogleAuth()

const COIN_API_AXIOS_CONFIG = {
  headers: {
    'X-CoinAPI-Key': COIN_API_KEY
  }
}

const getExchangeRate = (baseCurrency, quoteCurrency) => {
  return axios.get(`${COIN_API_BASE_URL}/exchangerate/${baseCurrency}/${req.query.quote}`, COIN_API_AXIOS_CONFIG)
}

const getFiatExchangeRate = () => {
  return axios.get(`${COIN_API_BASE_URL}/exchangerate/ETH?invert=false&filter_asset_id=${SUPPORTED_FIAT.toString()}`, COIN_API_AXIOS_CONFIG)
}

const getEthToUsdAtTime = (ethValue, timestamp) => {
  return axios.get(`${COIN_API_BASE_URL}/exchangerate/ETH/USD?time=${moment(timestamp).toISOString()}`, COIN_API_AXIOS_CONFIG)
}

const getEthToUsd = () => {
  return axios.get(`${COIN_API_BASE_URL}/exchangerate/ETH/USD`, COIN_API_AXIOS_CONFIG)
} 

const OPEN_SEA_API_AXIOS_CONFIG = {
  headers: {
    'X-API-Key': OPEN_SEA_API_KEY
  }
}

const getBaseCollectionInfo = (contractAddress) => {
  return axios.get(`${OPEN_SEA_API_BASE_URL}/v1/asset_contract/${contractAddress}`, OPEN_SEA_API_AXIOS_CONFIG)
}

const getTokenInfo = (contractAddress, tokenId) => {
  return axios.get(`${OPEN_SEA_API_BASE_URL}/v1/asset/${contractAddress}/${tokenId}`, OPEN_SEA_API_AXIOS_CONFIG)
}

const getSalesHistory = (contractAddress, tokenId) => {
  return axios.get(`${OPEN_SEA_API_BASE_URL}/v1/events?asset_contract_address=${contractAddress}&token_id=${tokenId}&event_type=successful`, OPEN_SEA_API_AXIOS_CONFIG)
}

const getCollectionSalesStats = (collectionSlug) => {
  return axios.get(`${OPEN_SEA_API_BASE_URL}/v1/collection//${collectionSlug}/stats`, OPEN_SEA_API_AXIOS_CONFIG)
}

const getRarityScoreStats = (contractAddress) => {
  return axios.get(`${RARITY_SNIFFER_BASE_URL}?collection=${contractAddress}&taskId=any&norm=true&partial=false&traitCount=true`)
}

const triggerTradesMigration = async (contractAddress) => {
  console.log('auth', auth)
  const url = `${CLOUD_FUNCTIONS_BASE_URL}/migrate-tables-copy`
  const client = await auth.getIdTokenClient(url)
  return client.request({
    method: 'POST',
    data: {
      table_to_cache: 'trades',
      contract_address: contractAddress
    },
    url
  })
}

module.exports = {
  getExchangeRate,
  getFiatExchangeRate, 
  getEthToUsdAtTime,
  getEthToUsd,
  getBaseCollectionInfo,
  getTokenInfo,
  getCollectionSalesStats,
  getRarityScoreStats,
  triggerTradesMigration,
  getSalesHistory
}