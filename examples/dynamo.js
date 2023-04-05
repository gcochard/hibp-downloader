const util = require('util');
const { createRange } = require('../modules/range');
const { getPrefixRange } = require('../modules/downloader');
const { DynamoDBClient, ListTablesCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

/**
 * This writes a batch of 25 hashes to the database
 */
async function writeManyHashes(client, table, putRequests){
  console.log(util.inspect(putRequests, {depth: 10}));
  // putRequests should be an array of <= 25 putRequest items
  const input = new BatchWriteItemCommand({ // BatchWriteItemInput
    RequestItems: { // BatchWriteItemRequestMap // required
      [table]: putRequests // WriteRequests
    }
  });
  try {
    const data = await client.send(input);
    console.log('successful insert');
    return data;
  } catch (err){
    console.error(err);
    throw err;
  }
}

/**
 * This gets all hashes within the range start and end
 * (inclusive on both ends), returned as an object with
 * `prefix` and `hashes` elements.
 */
async function getRange({start, end}){
  const range = createRange({start, end});
  console.log({range});
  const data = await getPrefixRange(range);
  return data;
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
  let inner = 0;
  hashBuckets.forEach(({prefix, hashes}) => {
    hashes.split(/\r?\n/).forEach(hash => {
      console.log({hash});
      if(inner >= 25){
        partitions.push([]);
        inner = 0;
        curr++;
      }
      partitions[curr].push(makePutRequest(prefix, hash));
      inner++;
    });
  });
  return partitions;
}

/**
 * Fetches and inserts all hashes within the range
 * into the database.
 */
async function insertSome({start=0, end=1, table='hibp-passwords', region='us-west-1'} = {}){
  console.log({start, end, table, region});
  const ddbClient = new DynamoDBClient({region});
  const someHashes = await getRange({start, end});
  const partitions = batchHashes(someHashes);
  partitions.forEach(async partition => {
    try {
      const response = await writeManyHashes(ddbClient, table, partition);
    } catch(e){
      console.error(e);
    }
  });
}

insertSome();
