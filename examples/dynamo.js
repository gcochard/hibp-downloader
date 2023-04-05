const { createRange } = require('./modules/range');
const { getPrefixRange } = require('./modules/downloader');
const { DynamoDBClient, ListTablesCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

/**
 * This writes a batch of 25 hashes to the database
 */
async function writeManyHash(table, putRequests, region){
  const ddbClient = new DynamoDBClient({region});
  // putRequests should be an array of <= 25 putRequest items
  const input = { // BatchWriteItemInput
    RequestItems: { // BatchWriteItemRequestMap // required
      [table]: putRequests // WriteRequests
    }
  };
  try {
    const data = await ddbClient.send(BatchWriteItemCommand(input));
    console.log('successful insert');
  } catch (err){
    console.error(err);
  }
}

/**
 * This gets all hashes within the range start and end
 * (inclusive on both ends), returned as an object with
 * `prefix` and `hashes` elements.
 */
async function getRange({start, end}){
  const range = createRange({start, end});
  const data = await getPrefixRange(range);
}

/**
 * This formats a prefix and hash line as a putRequest for dynamo.
 */
function makePutRequest(prefix, hash){
  const [postfix, rank] = hash.split(':');
  const sha1 = `${prefix}${postfix}`;
  return {
    PutRequest: {
      Item: {
        sha1: { S: sha1 },
        rank: { N: rank }
      }
    }
  };
}

/**
 * This creates X batches of 25 putRequests from the
 * results of a getRange call.
 */
function batchHashes(hashBuckets){
  const partitions = [[]];
  let curr = 0;
  hashBuckets.forEach(({prefix, hashes}) => {
    hashes.forEach(hash => {
      if(curr.length >= 25){
        partitions.push([]);
        curr++;
      }
      partitions[curr].push(makePutRequest(prefix, hash));
    });
  });
  return partitions;
}

/**
 * Fetches and inserts all hashes within the range
 * into the database.
 */
async function insertSome({start, end}){
  const someHashes = await getRange({start, end});
  const partitions = batchHashes(someHashes);
}
