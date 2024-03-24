#!/usr/bin/env node

const { program } = require('commander'); // Import the 'commander' module
const { processFiles } = require('../fs'); // Import the 'processFiles' function from the 'fs' module

program
    .name('file-renamer') // Set the name of your CLI application
    .description('File Renamer CLI') // Set the description of your CLI application
    .version('1.0.0') // Set the version of your CLI application

// Example command to rename files in the 'files' directory
program
    .command('rename')
    .description('Rename a file in the "files" directory and move them to the "renamed" directory')
    .action(processFiles);

// Parse the command line arguments
program.parse(process.argv);

// Check if any options were provided
if (!process.argv.slice(2).length) {
    program.outputHelp(); // Display helpf if no arguments were provided
}