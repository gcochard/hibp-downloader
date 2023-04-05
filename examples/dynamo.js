const { createRange } = require('./modules/range');
const { getHashRange } = require('./modules/downloader');
const { DynamoDBClient, 
    ListTablesCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

async function writeManyHash(table, hashTuples, region){
    const ddbClient = new DynamoDBClient({region});
    const input = { // BatchWriteItemInput
        RequestItems: { // BatchWriteItemRequestMap // required
          table: [] // WriteRequests
        }
    };
    hashTuples.forEach(v => {
        input.RequestItems[table].push({
            PutRequest: {
                Item: {
                    sha1: {
                        S: v.sha1
                    },
                    rank: {
                        N: v.rank
                    }
                }
            }
        });
    });
    try {
        const data = await ddbClient.send(BatchWriteItemCommand(input));
        console.log('successful insert');
    } catch (err){
        console.error(err);
    }
}

async function getAndInsertAll(){
    const range = createRange();
    
}
