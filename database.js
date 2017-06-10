var fs = require('fs');
var pg = require('pg');

var connectionString = 'postgres://postgres:postgres@localhost:5432/bible';

var log = function(text, done, client) {
  console.log(text);
  if(done) {
    done(client);
  }
}

var connect = function(inCaseOfError, inCaseOfNoError) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      inCaseOfError();
    } else {
      inCaseOfNoError(client);
    }
  });
}

var installDb = function(done, client) {
  log('Install database ...');
  pg.connect('postgres://postgres:postgres@localhost:5432/postgres', function(err, newclient, done) {
    if (err) {
      log('something is wrong', done);
    } else {
      newclient.query('DROP DATABASE IF EXISTS bible');
      newclient.query('CREATE DATABASE bible');
      buildDatabase('bible_dumpl.sql');
      log('DB is installedb', done);
    }
  });
}

var installDbIfNecessary = function(done) {
  var inCaseOfError = function(){
    installDb(done);
  }
  var inCaseOfNoError = function(client){
    log('DB is already installed', done, client);
  }
  connect(inCaseOfError, inCaseOfNoError);
}

var saveData = function(text, client) {
  log('Save data ...');
  log(text);
  if(client) {
    client.end();
  }
}

var buildDatabase = function(fileName, client) {

  var queries = fs.readFileSync(fileName).toString()
    .replace(/(\r\n|\n|\r)/gm," ")
    .replace(/\s+/g, ' ')
    .split(";")
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function(el) {return el.length != 0});

  pg.connect(connectionString, function(err, client, done) {
    queries.forEach(function(query) {
      client.query(query, function(result) {
        log(query);
      });
    });
  });
}


module.exports.installDbIfNecessary = installDbIfNecessary;
module.exports.installDb = installDb;
module.exports.saveData = saveData;
