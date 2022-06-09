const GET_BALANCES_QUERY = (walletAddress) => {
    
  return (
    `
      SELECT agg.address,
            agg.token_address,
            SUM(agg.value) value
      FROM (
        SELECT 
            t.token_address AS token_address,
            t.from_address AS address,
            (t.value * -(1)) AS value,
            t.transaction_hash AS transaction_hash,
            t.log_index AS log_index,
            t.block_timestamp AS block_timestamp,
            t.block_hash AS block_hash,
            t.block_number AS block_number
        FROM
            token_transfers t 
        WHERE t.from_address IN ('${walletAddress}')
        
        UNION
        
        SELECT 
            t.token_address AS token_address,
            t.to_address AS address,
            t.value AS value,
            t.transaction_hash AS transaction_hash,
            t.log_index AS log_index,
            t.block_timestamp AS block_timestamp,
            t.block_hash AS block_hash,
            t.block_number AS block_number
        FROM
            token_transfers t
        WHERE t.to_address IN ('${walletAddress}')
      ) agg
      GROUP BY agg.address, agg.token_address

      UNION 

      SELECT address,
        'hurr durr eth' token_address,
        eth_balance value
      FROM ethereum.balances
      WHERE address IN ('${walletAddress}')
    `
  )
}

module.exports = {
  GET_BALANCES_QUERY
}