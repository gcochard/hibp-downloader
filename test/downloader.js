const { getSinglePrefix, getPrefixRange } = require('../modules/downloader');
const assert = require('assert');
const mockResponse = `FE0D7F7AE0D9034ECCE1FE4DFC26A1353F1:18
F4C66803EB005F2BB6C552731B509C86359:2`;
const gotMock = async function(path, opts){
  return mockResponse;
};

describe('downloader', function(){

  describe('getSinglePrefix', function(){
    it('should download a prefix', async function(){
      const resp = await getSinglePrefix('ABCDE', {got: gotMock});
      assert.equal(resp, mockResponse);
    });
  });

  describe('getPrefixRange', function(){
    it('should get more than one prefix', async function(){
      const resps = await getPrefixRange(['ABCDD', 'ABCDE'], {got: gotMock});
      assert.equal(resps.length, 2);
      assert.equal(resps[0], mockResponse);
    });
  })
});
