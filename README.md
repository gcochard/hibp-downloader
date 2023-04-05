# hibp-downloader
Download all the HIBP passwords

It's like [HaveIBeenPwned/PwnedPasswordsDownloader](https://github.com/HaveIBeenPwned/PwnedPasswordsDownloader), only in node.js

CLI Usage:

```bash
# output all hashes to stdout:
npx hibp-downloader download

# output to a file:
npx hibp-downloader download -o hashes.txt

# get a subset of hashes (start and end are inclusive):
npx hibp-downloader download -s 0x00010 -e 0x00011
```

Javascript module usage:
```js
const { createRange, getPrefixRange } = require('hibp-downloader');

async function getSomeHashes({start, end}){
  const range = createRange({start, end});
  const responses = getPrefixRange(range);
  responses.forEach(({prefix, hashes}) => {
    hashes.split(/\r?\n/).forEach(hash => {
      console.log(`${prefix}${hash}`);
    });
  });
}
```
