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

module.exports = {
  GET_IS_COLLECTION_TRACKED,
  TRACK_NEW_COLLECTION,
  CREATE_TRADES_TABLE_FOR_COLLECTION
}