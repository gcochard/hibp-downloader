#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const basePath = 'https://api.pwnedpasswords.com/range';
const got = require('got');
const fs = require('fs');
const { getSinglePrefix } = require('../modules/downloader');
const { createRange } = require('../modules/range');
const _argv = yargs(hideBin(process.argv))
  .command('download [outfile]', 'Download the corpus',
    yargs => yargs.option('o', {alias: 'outfile', describe: 'The target output file (or stdout if not provided)'})
    .option('s', {alias: 'start', describe: 'The start of the prefix range to use', default: 0x00000})
    .option('e', {alias: 'end', describe: 'The end of the prefix range to use', default: 0xFFFFF})
  , async (argv) => {
    const range = createRange({start: argv.s, end: argv.e});
    const out = argv.outfile ? fs.createWriteStream(argv.outfile) : process.stdout;
    for(const i of range){
      const response = await getSinglePrefix(i);
      for(const line of response.split(/\r?\n/)){
        out.write(`${i}${line}\n`);
      }
    }
  })
  .demandCommand()
  .help()
  .argv;
