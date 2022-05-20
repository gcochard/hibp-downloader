const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const basePath = 'https://api.pwnedpasswords.com/range';
const got = require('got');
const fs = require('fs');
const _argv = yargs(hideBin(process.argv))
  .command('download [outfile]', 'Download the corpus',
    yargs => yargs.option('o', {alias: 'outfile', describe: 'The target output file (or stdout if not provided)'})
  , async (argv) => {
    const range = [...Array(16**5).keys()].map(a => a.toString(16).toUpperCase().padStart(5, '0'));
    const out = argv.outfile ? fs.createWriteStream(argv.outfile) : process.stdout;
    for(const i of range){
      const response = await got(`${basePath}/${i}`, {resolveBodyOnly: true});
      for(const line of response.split('\n')){
        out.write(`${i}${line}\n`);
      }
    }
  })
  .argv;
