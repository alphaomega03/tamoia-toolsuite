const express = require("express");
const bodyParser = require('body-parser');
const axios = require("axios"); 
const getUuid = require('uuid-by-string')
const Moralis = require("moralis/node");
const {
  WALLET_NFT_DATA,
  WALLET_TRANSACTION_REPORT,
  WALLET_VALIDATE_NFT_OWNERSHIP,
  NFT_SEARCH,
  NFT_COLLECTION_METADATA,
  NFT_SALES_HISTORY
} = require('./mockData')
const { getExchangeRate, getFiatExchangeRate, getEthToUsdAtTime, getEthToUsd, getBaseCollectionInfo, getTokenInfo, getCollectionSalesStats, getRarityScoreStats, triggerTradesMigration } = require('./requests')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const admin = require('firebase-admin')
require('firebase/firestore')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const Web3 = require('web3')

require('dotenv').config()

const { connection } = require('./database/dao/tokenBalancesDao')
const { GET_BALANCES_QUERY } = require('./database/queries/tokenBalances')
const { GET_SALES_HISTORY_QUERY } = require('./database/queries/salesHistory')
const { TRACK_NEW_COLLECTION, GET_IS_COLLECTION_TRACKED, CREATE_TRADES_TABLE_FOR_COLLECTION,INSERT_RARITY_SCORES_FOR_COLLECTION } = require('./database/queries/trackedCollections')
// const { GET_PURCHASE_DATA_FOR_TOKEN } = require('./database/queries/purchaseHistory')
const moment = require('moment');
const { response } = require("express");
const { sortBy } = require('lodash')


const HOST = "0.0.0.0";
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
const router = express.Router()

initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

const web3 = new Web3('https://rpc.flashbots.net/')
app.get("/hello", (req, res) => {
  res.send('Hello Dan!')
})

router.get("/hello", (req, res) => {
  res.send('Hello Dan!!')
});
app.use('/v1', router)


app.get("/Wallet/:walletAddress", (req, res) => {
  const walletAddress = req.params.walletAddress
  res.send(WALLET_NFT_DATA)
})

router.get("/Wallet/:walletAddress", (req, res) => {
  const walletAddress = req.params.walletAddress

  connection.query(GET_BALANCES_QUERY(walletAddress), (err, results, fields) => {
    console.log('err', err)
    console.log('results', results)

  const response = {
      EtherBalance: 0,
      TokenBalances: [],
      NFTBalances: WALLET_NFT_DATA
    }

    res.send(response)
  })
})

app.get("/Wallet/:walletAddress/transactionReport", (req, res) => {
  const walletAddress = req.params.walletAddress
  res.send(WALLET_TRANSACTION_REPORT)
})

router.get("/Wallet/:walletAddress/transactionReport", (req, res) => {
  const walletAddress = req.params.walletAddress
  res.send(WALLET_TRANSACTION_REPORT)
})

app.get("/Wallet/:walletAddress/validateNFTOwnership", (req, res) => {
  const walletAddress = req.params.walletAddress
  const contractAddress = req.query.contractAddress
  res.send(WALLET_VALIDATE_NFT_OWNERSHIP)
})

router.get("/Wallet/:walletAddress/validateNFTOwnership", (req, res) => {
  const walletAddress = req.params.walletAddress
  const contractAddress = req.query.contractAddress
  res.send(WALLET_VALIDATE_NFT_OWNERSHIP)
})

app.get("/NFT/:contractAddress", async (req, res) => {
  const contractAddress = req.params.contractAddress
  const cursor = req.query.cursor || null
  const limit = req.query.limit && req.query.limit <= 500 ? req.query.limit : 500

  /* Moralis init code */
  const serverUrl = "https://rixvtkrckpme.usemoralis.com:2053/server"
  const appId = "IeJkMdrfKDhEFUgeVI2Gkwa7FMle5YQQ4e0wG5eC"
  const masterKey = "SQ6WO3dvVQZL8H7tFuShnLJC7Jrj2xWevwPPNbQK"
  let dayta = []

  await Moralis.start({ serverUrl, appId, masterKey });

  const options = { address: contractAddress, chain: "eth", cursor: cursor, limit, format: 'decimal'};
  NFTs = await Moralis.Web3API.token.getAllTokenIds(options)
  dayta.push(NFTs.result)
  const nextCursor = NFTs.cursor

  const filteredData = [].concat.apply([], dayta).map((data) => {
    return {
      ExternalId: getUuid(`${contractAddress}`),
      DisplayUrl: `/NFT/${contractAddress}/${data.token_id}`,
      BlockNumberMinted: data.block_number_minted,
      ContractType: data.contract_type,
      ContractName: data.name,
      ContractSymbol: data.symbol,
      TokenId: data.token_id,
      TokenUri: data.token_uri,
      LastModified: data.synced_at
    }
  })

  res.send({ Result: filteredData, Cursor: nextCursor })
})

router.get("/NFT/:contractAddress", async (req, res) => {
  const contractAddress = req.params.contractAddress
  const cursor = req.query.cursor || null
  const limit = req.query.limit && req.query.limit <= 100 ? req.query.limit : 100

  /* Moralis init code */
  const serverUrl = "https://rixvtkrckpme.usemoralis.com:2053/server"
  const appId = "IeJkMdrfKDhEFUgeVI2Gkwa7FMle5YQQ4e0wG5eC"
  const masterKey = "SQ6WO3dvVQZL8H7tFuShnLJC7Jrj2xWevwPPNbQK"
  let dayta = []

  await Moralis.start({ serverUrl, appId, masterKey });

  const options = { address: contractAddress, chain: "eth", cursor: cursor, limit, format: 'decimal'};
  NFTs = await Moralis.Web3API.token.getAllTokenIds(options)
  dayta.push(NFTs.result)
  const nextCursor = NFTs.cursor

  const filteredData = [].concat.apply([], dayta).map((data) => {
    return {
      ExternalId: getUuid(`${contractAddress}-${data.token_id}`),
      DisplayUrl: `/NFT/${contractAddress}/${data.token_id}`,
      BlockNumberMinted: data.block_number_minted,
      ContractType: data.contract_type,
      ContractName: data.name,
      ContractSymbol: data.symbol,
      ContractAddress: contractAddress,
      TokenId: data.token_id,
      TokenUri: data.token_uri,
      LastModified: data.synced_at
    }
  })

  res.send({ Result: filteredData, Cursor: nextCursor })
})

app.get('/NFT/:contractAddress/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId
  const contractAddress = req.params.contractAddress

  const serverUrl = "https://rixvtkrckpme.usemoralis.com:2053/server";
  const appId = "IeJkMdrfKDhEFUgeVI2Gkwa7FMle5YQQ4e0wG5eC";
  const masterKey = "SQ6WO3dvVQZL8H7tFuShnLJC7Jrj2xWevwPPNbQK";

  await Moralis.start({ serverUrl, appId, masterKey });

  const options = { address: contractAddress, token_id: tokenId, chain: "eth" };
  const data = await Moralis.Web3API.token.getTokenIdMetadata(options);

  const formattedTokenMetadata =  {
    ExternalId: getUuid(`${contractAddress}-${tokenId}`),
    BlockNumberMinted: data.block_number_minted,
    Owner: data.owner_of,
    TokenId: data.token_id,
    TokenUri: data.token_uri,
    Metadata: data.metadata,
    LastModified: data.synced_at
  }

  res.send(formattedTokenMetadata)
})


router.get('/NFT/:contractAddress/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId
  const contractAddress = req.params.contractAddress

  const tokenId64Bits = parseInt(req.params.tokenId).toString(16).padStart(64, 0)

  const serverUrl = "https://rixvtkrckpme.usemoralis.com:2053/server";
  const appId = "IeJkMdrfKDhEFUgeVI2Gkwa7FMle5YQQ4e0wG5eC";
  const masterKey = "SQ6WO3dvVQZL8H7tFuShnLJC7Jrj2xWevwPPNbQK";

  await Moralis.start({ serverUrl, appId, masterKey });

  const options = { address: contractAddress, token_id: tokenId, chain: "eth" };
  const data = await Moralis.Web3API.token.getTokenIdMetadata(options);

  const result = await getTokenInfo(contractAddress, tokenId)

  const rarityResponse = await getRarityScoreStats(contractAddress)
  const tokenRarity = rarityResponse.data.data.find(row => row.id === parseInt(tokenId)).score
  
  const formattedTokenMetadata =  {
    ExternalId: getUuid(`${contractAddress}-${tokenId}`),
    BlockNumberMinted: data.block_number_minted,
    Owner: data.owner_of,
    TokenId: data.token_id,
    ContractAddress: contractAddress,
    TokenUri: data.token_uri,
    Metadata: data.metadata,
    LastModified: data.synced_at,
    PurchaseDate: result.data.last_sale && result.data.last_sale.event_timestamp,
    PurchasePrice: result.data.last_sale && web3.utils.fromWei(result.data.last_sale.total_price),
    RarityScore: tokenRarity
  }

  res.send(formattedTokenMetadata)

})

router.get('/NFT/rarityScore/:contractAddress/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId
  const contractAddress = req.params.contractAddress
  const rarityResponse = await getRarityScoreStats(contractAddress)
  const tokenRarity = rarityResponse.data.data.find(row => row.id === parseInt(tokenId))
  const tokenRarityComposite = tokenRarity.score
  const tokenRarityTraits = tokenRarity.traits.map(trait => {
    return { Name: trait.n, Category: trait.c, Rarity: trait.r }
  })
  const formattedTokenMetadata =  {
    ContractAddress: contractAddress,
    TokenId: tokenId,
    RarityScore: tokenRarityComposite,
    RarityTraits: tokenRarityTraits
  }

  res.send(formattedTokenMetadata)
})

router.post('/NFTs/:contractAddress/', async (req, res) => {
  const tokenIds = req.body.TokenIds || []
  const contractAddress = req.params.contractAddress

  const serverUrl = "https://rixvtkrckpme.usemoralis.com:2053/server";
  const appId = "IeJkMdrfKDhEFUgeVI2Gkwa7FMle5YQQ4e0wG5eC";
  const masterKey = "SQ6WO3dvVQZL8H7tFuShnLJC7Jrj2xWevwPPNbQK";

  await Moralis.start({ serverUrl, appId, masterKey });

  let response = []

  for(let i = 0; i < tokenIds.length; i++) {
    const options = { address: contractAddress, token_id: tokenIds[i], chain: "eth" };
    const data = await Moralis.Web3API.token.getTokenIdMetadata(options);
  
    const formattedTokenMetadata =  {
      ExternalId: getUuid(`${contractAddress}-${tokenIds[i]}`),
      BlockNumberMinted: data.block_number_minted,
      Owner: data.owner_of,
      TokenId: data.token_id,
      ContractAddress: contractAddress,
      TokenUri: data.token_uri,
      Metadata: data.metadata,
      LastModified: data.synced_at
    }

    response.push(formattedTokenMetadata)
  }



  res.send(sortBy(response, (token) => token.TokenId))
})

app.get("/NFT/:contractAddress/:tokenId/salesHistory", (req, res) => {
  const contractAddress = req.params.contractAddress
  const tokenId = req.params.tokenId

  res.send(NFT_SALES_HISTORY)
})

const delay = ms => new Promise(res => setTimeout(res, ms))

router.get("/NFT/:contractAddress/:tokenId/salesHistory", async (req, res) => {
  const contractAddress = req.params.contractAddress
  const tokenId = parseInt(req.params.tokenId).toString(16).padStart(64, 0)

  connection.query(GET_SALES_HISTORY_QUERY(tokenId, contractAddress), async (err, results) => {
    const response = []

    const dollarValue = await getEthToUsd().then((price) => {
      return price.data.rate
    })

    console.log('results', results)
    console.log('err', err)    

    if(results) {
      for(let i = 0; i < results.length; i++) {
        const etherValue = web3.utils.fromWei(results[i].price.toString())
  
        response.push({
          FromAddress: results[i].from_address,
          ToAddress: results[i].to_address,
          TransactionHash: results[i].transaction_hash,
          TransactionDate: results[i].block_timestamp,
          TransactionPriceUSD: dollarValue,
          TransactionPrice: etherValue,
          TransactionCurrency: "ETH",
          DisplayURL: `/NFT/${contractAddress}/${req.params.tokenId}`
        })
      }
    }
    res.send(response)
  })
})


app.get("/NFTCollection/:contractAddress", (req, res) => {
  const contractAddress = req.params.contractAddress
  res.send(NFT_COLLECTION_METADATA)
})

router.get("/NFTCollection/:contractAddress", async (req, res) => {
  const contractAddress = req.params.contractAddress
  const collectionInfoRes = await getBaseCollectionInfo(contractAddress)

  const baseCollectionInfo = collectionInfoRes.data.collection
  const collectionSlug = baseCollectionInfo.slug

  const collectionStatsRes = await getCollectionSalesStats(collectionSlug)

  const collectionStats = collectionStatsRes.data.stats

  const response = {
    ExternalId: getUuid(contractAddress),
    CollectionName: baseCollectionInfo.name,
    Description: baseCollectionInfo.description,
    ContractAddress: contractAddress,
    CryptoCurrency: 'ETH',
    FloorPrice: collectionStats.floor_price,
    NinetyDayAverageSalePrice: collectionStats.thirty_day_average_price,
    NinetyDayVolumeTraded: collectionStats.thirty_day_volume,
    TotalVolumeTraded: collectionStats.total_volume,
    LastSaleDate: "2022-04-26T16:56:55.600Z",
    DisplayURL: `/NFT/${contractAddress}`
  }

  res.send(response)
})

app.get('/NFTCollection/isOwner/:contractAddress/:userAddress', async (req, res) => {
  const userAddress = req.params.userAddress
  const contractAddress = req.params.contractAddress

  const serverUrl = "https://rixvtkrckpme.usemoralis.com:2053/server";
  const appId = "IeJkMdrfKDhEFUgeVI2Gkwa7FMle5YQQ4e0wG5eC";
  const masterKey = "SQ6WO3dvVQZL8H7tFuShnLJC7Jrj2xWevwPPNbQK";

  await Moralis.start({ serverUrl, appId, masterKey });

  const options = { 
    token_address: contractAddress, 
    address: userAddress, 
    chain: "eth" 
  };

  const data = await Moralis.Web3API.account.getNFTsForContract(options);

  const isOwner = data.total > 0 ? true : false;
  const formattedTokenMetadata =  {
    User: userAddress,
    IsOwner: isOwner,
    LastModified: data.synced_at
  }

  res.send(formattedTokenMetadata)
})

router.post("/NFTCollections", async (req, res) => {
  const contractAddresses = req.body.ContractAddresses || []

  let response = []

  for(let i = 0; i < contractAddresses.length; i++) {
      const collectionInfoRes = await getBaseCollectionInfo(contractAddresses[i])

      const baseCollectionInfo = collectionInfoRes.data.collection
      const collectionSlug = baseCollectionInfo.slug

      const collectionStatsRes = await getCollectionSalesStats(collectionSlug)

      const collectionStats = collectionStatsRes.data.stats

      const data = {
          ExternalId: getUuid(contractAddresses[i]),
          CollectionName: baseCollectionInfo.name,
          Description: baseCollectionInfo.description,
          ContractAddress: contractAddresses[i],
          CryptoCurrency: 'ETH',
          FloorPrice: collectionStats.floor_price,
          NinetyDayAverageSalePrice: collectionStats.thirty_day_average_price,
          NinetyDayVolumeTraded: collectionStats.thirty_day_volume,
          TotalVolumeTraded: collectionStats.total_volume,
          LastSaleDate: "2022-04-26T16:56:55.600Z",
          DisplayURL: `/NFT/${contractAddresses[i]}`
      }

      response.push(data)

      await delay(250)
  }

  res.send(sortBy(response, (contract) => contract.CollectionName))
})

app.post("/NFTCollection/search", (req, res) => {
  const searchQuery = req.body.Query
  const limit = req.body.Limit || 500
  res.send(NFT_SEARCH)
})

router.post("/NFTCollection/search", (req, res) => {
  const searchQuery = req.body.Query
  const limit = req.body.Limit || 500
  res.send(NFT_SEARCH)
})

app.get("/fiatExchangeRates/ETH", async (req, res) => {
  const ans = await getFiatExchangeRate()
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

router.get("/fiatExchangeRates/ETH", async (req, res) => {
  const ans = await getFiatExchangeRate()
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
  const response = await getExchangeRate(req.query.base, req.query.quote)
  const { src_side_base, src_side_quote, ...restObject } = response.data
  
  const obj = {
    ExternalId: getUuid(`${restObject.asset_id_base}-${restObject.asset_id_quote}`),
    Timestamp: restObject.time,
    AssetIdBase: restObject.asset_id_base,
    AssetIdQuote: restObject.asset_id_quote
  }

  res.send(obj);
});

router.get("/exchangeRate", async (req, res) => {
  const response = await getExchangeRate(req.query.base, req.query.quote)
  const { src_side_base, src_side_quote, ...restObject } = response.data
  
  const obj = {
    ExternalId: getUuid(`${restObject.asset_id_base}-${restObject.asset_id_quote}`),
    Timestamp: restObject.time,
    AssetIdBase: restObject.asset_id_base,
    AssetIdQuote: restObject.asset_id_quote
  }

  res.send(obj);
});


const updateAppDb = async (contractAddress, userId, res) => {
  // const rarityResponse = await getRarityScoreStats(contractAddress)
  // const formattedRarities = rarityResponse.data.data.map(row =>{
  //     return "(" + `'${contractAddress}',` + row.id + ',' + row.score + ',' + `'${JSON.stringify(row.traits).replace("'", "")}'` + ")"
  // }).join(", ")

  // await connection.query(INSERT_RARITY_SCORES_FOR_COLLECTION(formattedRarities), (err) => {
  //   if(err) {
  //     res.status(400)
  //     console.log(err)
  //     res.send({
  //       error: `Error adding collection ${contractAddress} to rarity_scores table in MySQL: ${err}`
  //     })
  //   }
  // })
  await connection.query(GET_IS_COLLECTION_TRACKED(contractAddress), async (err, res) => {
    if(err) {
      res.status(400)
      res.send({
        error: `Error while checking if collection ${contractAddress} is already in tracked_collections table in MySQL:  ${err}`
      })
    }
    const isCollectionAlreadyTracked = res[0]['is_collection_tracked'] === 1 ? true : false
    console.log('isColelction', isCollectionAlreadyTracked)

    if(!isCollectionAlreadyTracked) {
      await connection.query(TRACK_NEW_COLLECTION(contractAddress, userId), (err) => {
        if(err) {
          res.status(400)
          res.send({
            error: `Error adding collection ${contractAddress} to tracked_collections table in MySQL: ${err}`
          })
        }
      })
      await connection.query(CREATE_TRADES_TABLE_FOR_COLLECTION(contractAddress), (err, res) => {
        if(err) {
          res.status(400)
          res.send({
            error: `Error creating _trades table for collection ${contractAddress} in MySQL: ${err}`
          })
        }
      })
      triggerTradesMigration(contractAddress).catch((err) => {
        res.status(400)
        res.send({
          error: `Error while triggering migrate-tables cloud function: ${err}`
        })
      })
    }
  })
}

router.post('/NFTCollection/track', async (req, res) => {
  const contractAddress = req.body.ContractAddress && req.body.ContractAddress.toLowerCase()
  const userId = req.body.UserId
  const tokenIds = req.body.TokenIds || []

  try {
    await web3.eth.getCode(contractAddress)
  } catch(e) {
    res.status(400)
    res.send({
      error: `Collection contract address ${contractAddress} is not a valid contract address`
    })
  }
  
  const docRef = db.collection('users').doc(userId);

  const docRaw = await docRef.get()

  const doc = docRaw.data()

  const existingTrackedCollections = doc && doc.collections || {}

  if(existingTrackedCollections[contractAddress]) {
    res.status(400)
    res.send({
      error: `User ${userId} is already tracking collection with contract address ${contractAddress}`
    })
  }

  const existingTokenIds = (doc && doc.collections && doc.collections[contractAddress] && doc.collections[contractAddress].tokenIds) || []

  const tokenIdsToSave = [...new Set(existingTokenIds.concat(tokenIds))]

  await docRef.update({
    userId,
    collections: {
      ...existingTrackedCollections,
      [contractAddress]: {
        tokenIds: tokenIdsToSave
      }
    },
    lastModified: moment().utc()
  }, { merge: true })

  await updateAppDb(contractAddress, userId, res)

  const response = {
    UserDisplayUrl: `/NFTCollection/user/${userId}`,
    CollectionDisplayUrl: `/NFTCollection/${contractAddress}`
  }

  res.send(response)
})

router.get('/NFTCollection/user/:userId', async (req, res) => {
  const userId = req.params.userId

  const docRef = db.collection('users').doc(userId);

  const docRaw = await docRef.get()

  const doc = docRaw.data()

  if(!doc) {
    res.status(400)
    res.send({
      error: `User ${userId} is not currently tracking a collection`
    })
  }

  const trackedCollections = Object.keys(doc.collections).map((contractAddress) => {

    const shouldIncludeTokenIds = doc.collections[contractAddress].tokenIds.length !== 0

    if(shouldIncludeTokenIds) {
      return {
        ContractAddress: contractAddress,
        DisplayUrl: `NFTCollection/${contractAddress}`,
        TokenIds: doc.collections[contractAddress].tokenIds
      }
    } else {
      return {
        ContractAddress: contractAddress,
        DisplayUrl: `NFTCollection/${contractAddress}`
      }
    }
  })
  res.send(trackedCollections)
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
