const WALLET_NFT_DATA = [
  {
    ExternalId: "4df88ef7-8f66-54d4-b198-660d631f1efb",
    BlockNumberMinted: "12292922",
    TokenId: "1",
    TokenUri: "https://ipfs.moralis.io:2053/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1",
    Metadata: `{\"image\":\"ipfs://QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi\",\"attributes\":[{\"trait_type\":\"Mouth\",\"value\":\"Grin\"},{\"trait_type\":\"Clothes\",\"value\":\"Vietnam Jacket\"},{\"trait_type\":\"Background\",\"value\":\"Orange\"},{\"trait_type\":\"Eyes\",\"value\":\"Blue Beams\"},{\"trait_type\":\"Fur\",\"value\":\"Robot\"}]}`,
    LastModified: "2022-04-25T22:18:03.398Z",
    PurchaseDate: "2022-04-27T21:01:23.495Z",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/7962",
    ContractAddress: "0x46efbaedc92067e6d60e84ed6395099723252496"
  },
  {
    ExternalId: "4df88ef7-8f66-54d4-b198-660d631f1efb",
    BlockNumberMinted: "12292922",
    TokenId: "2",
    TokenUri: "https://ipfs.moralis.io:2053/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/2",
    Metadata: `{\"image\":\"ipfs://QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi\",\"attributes\":[{\"trait_type\":\"Mouth\",\"value\":\"Grin\"},{\"trait_type\":\"Clothes\",\"value\":\"Vietnam Jacket\"},{\"trait_type\":\"Background\",\"value\":\"Orange\"},{\"trait_type\":\"Eyes\",\"value\":\"Blue Beams\"},{\"trait_type\":\"Fur\",\"value\":\"Robot\"}]}`,
    LastModified: "2022-04-25T22:18:03.398Z",
    PurchaseDate: "2022-04-27T21:01:23.495Z",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/7962",
    ContractAddress: "0x46efbaedc92067e6d60e84ed6395099723252496"
  },
  {
    ExternalId: "4df88ef7-8f66-54d4-b198-660d631f1efb",
    BlockNumberMinted: "12292922",
    TokenId: "3",
    TokenUri: "https://ipfs.moralis.io:2053/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/3",
    Metadata: `{\"image\":\"ipfs://QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi\",\"attributes\":[{\"trait_type\":\"Mouth\",\"value\":\"Grin\"},{\"trait_type\":\"Clothes\",\"value\":\"Vietnam Jacket\"},{\"trait_type\":\"Background\",\"value\":\"Orange\"},{\"trait_type\":\"Eyes\",\"value\":\"Blue Beams\"},{\"trait_type\":\"Fur\",\"value\":\"Robot\"}]}`,
    LastModified: "2022-04-25T22:18:03.398Z",
    PurchaseDate: "2022-04-27T21:01:23.495Z",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/7962",
    ContractAddress: "0x46efbaedc92067e6d60e84ed6395099723252496"
  }
]

const WALLET_TRANSACTION_REPORT = [
  {
    ExternalId: "4df88ef7-8f66-54d4-b198-660d631f1efb",
    PurchaseTransactionHash: "0x600292f8f021693b65b5a8fc991bc2de37016ee8389934e037113693a46d8aff",
    PurchaseDate: "2021-02-23T17:01:16.315Z",
    PurchasePrice: 0.7,
    PurchasePriceUSD: 2100,
    SaleTransactionHash: "0x153551fb3581410e3aaa956288f51593758c212510bfce4480950e50ea73d155",
    SaleDate: "2022-03-10T17:12:30.294Z",
    SalePriceUSD: 4320,
    SalePrice: 1.44,
    CryptoCurrency: "ETH",
    TokenId: 3,
    ContractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    ContractName: "Bored Ape Yacht Club",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/7962"
  },
  {
    ExternalId: "4df88ef7-8f66-54d4-b198-660d631f1efb",
    PurchaseTransactionHash: "0x600292f8f021693b65b5a8fc991bc2de37016ee8389934e037113693a46d8aff",
    PurchaseDate: "2021-02-24T17:01:16.315Z",
    PurchasePrice: 0.7,
    PurchasePriceUSD: 2100,
    SaleTransactionHash: "0x153551fb3581410e3aaa956288f51593758c212510bfce4480950e50ea73d155",
    SaleDate: "2022-03-10T17:12:30.294Z",
    SalePriceUSD: 10065.32,
    SalePrice: 2.33,
    CryptoCurrency: "ETH",
    TokenId: 2,
    ContractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    ContractName: "Bored Ape Yacht Club",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/7962"
  }
]

const WALLET_VALIDATE_NFT_OWNERSHIP = {
  OwnsNFT: true
}

const NFT_SEARCH = [
  {
    ContractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    ContractName: "Bored Ape Yacht Club",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
  }
]

const NFT_COLLECTION_METADATA = {
  ExternalId: "4df88ef7-8f66-54d4-b198-660d631f1efb",
  CollectionName: "Bored Ape Yacht Club",
  Description: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape   NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
  OwnerWalletAddresses: [
    "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
  ],
  CryptoCurrency: "ETH",
  FloorPrice: 120,
  NinetyDayAverageSalePrice: 132.3,
  NinetyDayVolumeTraded: 113415.3,
  TotalVolumeTraded: 512231.2,
  LastSaleDate: "2022-04-26T16:56:55.600Z",
  DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
}

const NFT_SALES_HISTORY = [
  {
    TransactionType: "Mint",
    FromAddress: "0xf5bd6484ad0cafd0cf42409d30094fbc3eb1f3e6",
    ToAddress: "0x2fba74ce7e9ad18c08fff85ad64a79544357cefa",
    TransactionHash: "0x600292f8f021693b65b5a8fc991bc2de37016ee8389934e037113693a46d8aff",
    TransactionDate: "2021-02-23T17:01:16.315Z",
    TransactionPrice: 0.7,
    TransactionPriceUSD: 2100,
    TransactionCurrency: "ETH",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/7962"
  },
  {
    TransactionType: "Sale",
    Marketplace: "OpenSea",
    FromAddress: "0x2fba74ce7e9ad18c08fff85ad64a79544357cefa",
    ToAddress: "0x033400ac31958c65d3ebb7716aa55ddabc9261f4",
    Transaction: "0x153551fb3581410e3aaa956288f51593758c212510bfce4480950e50ea73d155",
    TransactionDate: "2021-02-28T17:12:30.294Z",
    TransactionPriceUSD: 4320,
    TransactionPrice: 1.44,
    TransactionCurrency: "ETH",
    DisplayURL: "/NFT/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/7962"
  }
]

module.exports = {
  WALLET_NFT_DATA,
  WALLET_TRANSACTION_REPORT,
  WALLET_VALIDATE_NFT_OWNERSHIP,
  NFT_SEARCH,
  NFT_COLLECTION_METADATA,
  NFT_SALES_HISTORY
}