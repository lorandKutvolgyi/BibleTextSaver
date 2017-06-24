var pg = require('pg');

var connectionString = 'postgres://postgres:postgres@localhost:5432/bible';

var db = (function () {
  var connected = null;
  var client = null;

  var connect = pg.connect(connectionString, function(err, client, done) {
      if (err) {
        connected = false;
      } else {
        connected = true;
        this.client = client;
      }
  });

  connect();

  return {

    exist: function() {
        if (connected === null) {
          return exist();
        }
        var result = connected;
        if(!connected){
          connected = null;
        }
        return result;
    },

    createDb: function() {
      pg.connect('postgres://postgres:postgres@localhost:5432/postgres', function(err, client, done) {
          if (err) {
            console.log('Something is wrong.');
            exit(1);
          } else {
            client.query('CREATE DATABASE bible');
            done();
            connect();
          }
      });
    },

    query: function(file) {
        return client.query(file);
    }

  };

}());


module.exports.db = db;
