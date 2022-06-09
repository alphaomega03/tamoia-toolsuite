const axios = require('axios');
const axiosRetry = require('axios-retry');
const token = 'ya29.A0ARrdaM-nHXTYGXX4RkCHbgpBJih-tj6SgNkEq8i5_0zOBoseY3FlWmwXPrtFaCMHKAi0jj-wa5iJv2NmWmJIc87iUPoQ8RVCTFI1uhOADe95NIK4rt5C3kT7UykHF46lqXxhdswE_8kLDWxL4zdLFTIi3lCl'
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

axiosRetry(axios, { retries: 3 })


var n = 0;

function loop() {
  setTimeout(async () => {
      var zerofilled = ('00000000000'+n).slice(-12);
      // console.log(zerofilled)
      const bodyParameters = {
        importContext: {
          fileType: "JSON",
          uri: `gs://tt-contracts-04-21-22/contracts-${zerofilled}`,
          database: "ethereum",
          csvImportOptions: {
            table: "contracts"
          }
        }
      }
    
      await axios.post( 
        'https://sqladmin.googleapis.com/v1/projects/master-plateau-347914/instances/tamoia-toolsuite-app-db/import',
        bodyParameters,
        config
      ).then(() => {
        console.log(`insert success for csv ${n}`)
      })
      .catch((e) => {
        console.log(`request failed for csv ${n}.`, e)
      });
    n++;
    if(n < 1) {
      loop()
    }
  }, 1000)
}

loop()

