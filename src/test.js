// Import the Google Cloud client libraries
const {BigQuery} = require('@google-cloud/bigquery');
const {Storage} = require('@google-cloud/storage');

const bigquery = new BigQuery();
const storage = new Storage();

async function extractTableToGCS() {
  // Exports my_dataset:my_table to gcs://my-bucket/my-file as raw CSV.

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const datasetId = "bigquery-public-data:crypto-ethereum";
  const tableId = "transactions";
  const bucketName = "tt-transactions-04-21-22";
  const filename = "transactions.csv";

  // Location must match that of the source table.
  const options = {
    location: 'US',
  };

  // Export data from the table into a Google Cloud Storage file
  const [job] = await bigquery
    .dataset(datasetId, {projectId: 'bigquery-public-data'})
    .table(tableId)
    .extract(storage.bucket(bucketName).file(filename), options);

  console.log(`Job ${job.id} created.`);

  // Check the job's status for errors
  const errors = job.status.errors;
  if (errors && errors.length > 0) {
    throw errors;
  }
}

extractTableToGCS()