module.exports = {
  createRange: function createRange({start=0, end=0xFFFFF} = {}){
    const range = [...Array(16**5).keys()].filter((val) => {
      if(val >= start && val <= end){
        return true;
      }
      return false;
    }).map(a => a.toString(16).toUpperCase().padStart(5, '0'));
    return range;
  }
};
