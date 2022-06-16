const TRACK_NEW_COLLECTION = (contractAddress, userId) => {
  return (
    `
      INSERT INTO
        tracked_collections (contract_address, added_by)
        VALUES ('${contractAddress}', '${userId}')
    `
  )
}

const GET_IS_COLLECTION_TRACKED = (contractAddress) => {
  return (
    `
    SELECT
      EXISTS (
        SELECT
          contract_address
        FROM
          tracked_collections
        WHERE
          contract_address = '${contractAddress}'
      
      ) as is_collection_tracked
    `
  )
}

const CREATE_TRADES_TABLE_FOR_COLLECTION = (contractAddress) => {
  return (
    `
      CREATE TABLE IF NOT EXISTS
        ${contractAddress}_trades
      LIKE
        trades_template
    `
  )
}

const INSERT_RARITY_SCORES_FOR_COLLECTION = (allRarities) => {
  return (
    `
      INSERT INTO ethereum.rarity_scores(nft_contract_address, token_id, rarity_score, trait_rarity)
      VALUES ${allRarities}
    `
  )
}

module.exports = {
  GET_IS_COLLECTION_TRACKED,
  TRACK_NEW_COLLECTION,
  CREATE_TRADES_TABLE_FOR_COLLECTION,
  INSERT_RARITY_SCORES_FOR_COLLECTION
}