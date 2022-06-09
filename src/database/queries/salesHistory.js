const GET_SALES_HISTORY_QUERY = (tokenId, contractAddress) => {
  return (
      `
      SELECT
        block_timestamp,
        transaction_hash,
        to_address,
        from_address,
        token_id,
        price
      FROM 
        ${contractAddress}_trades
      WHERE
        token_id = '${tokenId}'
    `
  )
}

module.exports = {
  GET_SALES_HISTORY_QUERY
}