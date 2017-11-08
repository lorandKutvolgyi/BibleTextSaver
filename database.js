var pg = require('pg');

var postgresConnectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
var bibleConnectionString = 'postgres://postgres:postgres@localhost:5432/bible';

var db = (function () {
  var thisclient = null;

  var connectToBible = function(callback) {
    pg.connect(bibleConnectionString, function(err, bibleclient, done) {
        if (err) {
          console.log('Something is wronggg.');
          console.log(err);
        } else {
          thisclient = bibleclient;
          console.log("jóóóóóóóóóóó");
          callback();
        }
    });
  }

  return {
    connect: function(overwrite, callback) {

      pg.connect(postgresConnectionString, function(err, client, done) {
          if (!err) {
            if (overwrite){
               client.query('DROP DATABASE bible');
            }
            client.query('CREATE DATABASE bible', function(err, result) {
              done();
              connectToBible(callback);
            });
          }
      });
    },
  };

}());


module.exports.db = db;
