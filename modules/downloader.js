const defaultGot = require('got');
const defaultBasePath = 'https://api.pwnedpasswords.com/range';

async function getSinglePrefix(prefix, {got=defaultGot, basePath=defaultBasePath} = {}){
    const response = await got(`${basePath}/${prefix}`, {resolveBodyOnly: true});
    return response;
}

async function getPrefixRange(range, {got=defaultGot, basePath=defaultBasePath} = {}){
    return await Promise.all(range.map(v => getSinglePrefix(v, {got, basePath})));
}

module.exports = {getSinglePrefix, getPrefixRange};
