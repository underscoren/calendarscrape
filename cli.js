#!/usr/bin/env node
const args = process.argv.slice(2);

if(args.length != 1 || ["--h","-h","-help","--help","help"].includes(args[0])) {
    console.error(`calendarscrape
Scrapes the skills city portal website to generate an ics calendar file
    
Usage:
    calendarscrape [output file]
    
    --help -h: display this help message`);
} else {
    const scrape = require("./src/auto");
    const outputPath = args[0];
    
    const start = new Date().getTime();
    scrape
    .autoScrape(outputPath)
    .then(() => {
        console.log(`Done. Took ${((new Date().getTime() - start)/1000).toFixed(1)}s`);
    });
}