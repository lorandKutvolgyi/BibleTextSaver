var pg = require('pg');

var postgresConnectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
var bibleConnectionString = 'postgres://postgres:postgres@localhost:5432/bible';

var create_verses = 'CREATE TABLE verses(book varchar(50) not null, chapter integer not null, vers integer not null, content varchar(1000) not null, refs varchar(200), notes varchar(4000));';
var create_parts_of_chapters = 'CREATE TABLE parts_of_chapters(book varchar(50) not null, chapter integer not null, start_vers integer not null, end_vers integer not null, title varchar(100) not null, notes varchar(4000));';
var create_chapters = 'CREATE TABLE chapters(book varchar(50) not null, chapter integer not null, title varchar(100) not null, notes varchar(4000));';
var create_parts_of_books = 'CREATE TABLE parts_of_books(book varchar(50) not null, start_chapter integer not null, end_chapter integer not null, title varchar(100) not null, notes varchar(4000));';
var create_books = 'CREATE TABLE books(book varchar(50) not null, notes varchar(4000));';

var db = (function () {

  var connectToBible = function(callback) {
    pg.connect(bibleConnectionString, function(err, bibleclient, done) {
        if (err) {
          console.log(err);
        } else {
          bibleclient.query(create_verses+create_parts_of_chapters+create_chapters+create_parts_of_books+create_books, function(err, result) {//create_verses+create_parts_of_chapters+create_chapters+create_parts_of_books+create_books
                console.log('tables are ready');
                callback();
          });
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
  }
}());


module.exports.db = db;
