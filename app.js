#!/usr/bin/env node

var program = require('commander');
var database = require('./database');
var bibletext = require('./bibletext');


program.version('0.0.1').option('-o, --overwrite', '[optional] If the database exists it will be overwritten');
program.parse(process.argv);

database.db.create_db(program.overwrite, bibletext.getBibleText);
