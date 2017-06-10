#!/usr/bin/env node

var program = require('commander');
var database = require('./database');
var bibletext = require('./bibletext');

var saveBibleText = function(client) {
    database.saveData(bibletext.getBibleText(), client);
}

program.version('0.0.1').option('-o, --overwrite', '[optional] If the database exists it will be overwritten');
program.parse(process.argv);

if (program.overwrite) {
    database.installDb(saveBibleText);
} else {
    database.installDbIfNecessary(saveBibleText);
}
