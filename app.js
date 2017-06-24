#!/usr/bin/env node

var program = require('commander');
var database = require('./database');
var bibletext = require('./bibletext');


program.version('0.0.1').option('-o, --overwrite', '[optional] If the database exists it will be overwritten');
program.parse(process.argv);

if (program.overwrite || !database.db.exist()) {
    database.db.createDb();
}
database.db.query('./bible_dumpl.sql');
