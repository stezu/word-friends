#!/usr/bin/env node
/* eslint-disable no-sync */

const path = require('path');
const fs = require('fs');

const main = require('../');

let inputStream = process.stdin;
let outputStream = process.stdout;
let inFilePath, isFile;

// An input file was provided
if (process.argv[2]) {
  inFilePath = path.resolve(process.argv[2]);
  isFile = fs.statSync(inFilePath).isFile();

  if (isFile) {
    inputStream = fs.createReadStream(inFilePath);
  } else {
    throw new Error(`'${inFilePath}' is not a file.`);
  }
}

// An output file was provided
if (process.argv[3]) {
  outputStream = fs.createWriteStream(path.resolve(process.argv[3]));
}

// Call the main function and pass results where we need to
main(inputStream).pipe(outputStream);
