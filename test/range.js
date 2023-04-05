var {createRange} = require('../modules/range');
var assert = require('assert');

describe('range', function(){
  it('should generate a range with no args', function(){
    const r = createRange();
    assert.equal(r.length, 16**5);
    assert.equal(r[0], '00000');
    assert.equal(r[r.length-1], 'FFFFF');
  });
  it('should generate a range with an "end" arg', function(){
    const r = createRange({end: 0x00001});
    assert.equal(r.length, 2);
    assert.equal(r[0], '00000');
    assert.equal(r[r.length-1], '00001');
  });
  it('should generate a range with a "start" arg', function(){
    const r = createRange({start: 0xFFFFE});
    assert.equal(r.length, 2);
    assert.equal(r[0], 'FFFFE');
    assert.equal(r[r.length-1], 'FFFFF');
  });
  it('should generate a range with a "start" and "end" arg', function(){
    const r = createRange({start: 0x01234, end: 0x01236});
    assert.equal(r.length, 3);
    assert.equal(r[0], '01234');
    assert.equal(r[r.length-1], '01236');
  });
});
