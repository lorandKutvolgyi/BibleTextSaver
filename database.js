var pg = require('pg');

var postgresConnectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
var bibleConnectionString = 'postgres://postgres:postgres@localhost:5432/bible';

var create_verses = 'CREATE TABLE verses(book varchar not null, chapter integer not null, vers integer not null, content varchar not null, refs varchar, notes varchar,translation varchar);';
var create_parts_of_chapters = 'CREATE TABLE parts_of_chapters(book varchar(50) not null, chapter integer not null, start_vers integer not null, end_vers integer not null, title varchar(100) not null, notes varchar(4000));';
var create_chapters = 'CREATE TABLE chapters(book varchar(50) not null, chapter integer not null, title varchar(100) not null, notes varchar(4000));';
var create_parts_of_books = 'CREATE TABLE parts_of_books(book varchar(50) not null, start_chapter integer not null, end_chapter integer not null, title varchar(100) not null, notes varchar(4000));';
var create_books = 'CREATE TABLE books(book varchar(50) not null, notes varchar(4000));';

var db = (function () {

  var create_tables = function(callback) {
    pg.connect(bibleConnectionString, function(err, bibleclient, done) {
        if (err) {
          console.log(err);
        } else {
          bibleclient.query(create_verses+create_parts_of_chapters+create_chapters+create_parts_of_books+create_books, function(err, result) {
                if (err) {
                  console.log('Error in creating tables' + err);
                } else {
                  console.log('tables are ready');
                  callback();
              }
          });
        }
    });
  };

  return {
    create_db: function(overwrite, callback) {
      pg.connect(postgresConnectionString, function(err, client, done) {
          if (!err) {
            if (overwrite){
               client.query('DROP DATABASE bible;');
            }
            client.query('CREATE DATABASE bible;', function(err, result) {
              done();
              create_tables(callback);
            });
          }
      });
    },

    update_db: function(rows) {
      pg.connect(bibleConnectionString, function(err, bibleclient, done) {
          if (err) {
            console.log('Error in connection: '+err);
          } else {
            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              var query_string = 'INSERT INTO verses (book, chapter, vers, content, translation) VALUES(\'' + row[0] + '\', ' + row[1] + ', ' + row[2] + ', \'' + row[3] + '\', \'' + row[4] + '\')';

              bibleclient.query(query_string, function(err, result) {
                  if(err) {
                    console.log('Error in query: '+err);
                  }
              });
          }
        }
      });
    },

    get_chapter: function(translation, book, chapter, res) {
      pg.connect(bibleConnectionString, function(err, bibleclient, done) {
          if (err) {
            console.log('Error in connection: ' + err);
          } else {
            var query_string = 'SELECT string_agg(content, \'\' ORDER BY vers) as verses FROM verses WHERE translation=\'' + translation + '\' AND book=\'' + book + '\' AND chapter=' + chapter + ';';
            bibleclient.query(query_string, function(err, result) {
                if(err) {
                  console.log('Error in query: '+err);
                } else {
                  console.log(result.rows[0].verses);
                  res.end(result.rows[0].verses);
                }
            });
          }
      });
    }
  };
}());


module.exports.db = db;
