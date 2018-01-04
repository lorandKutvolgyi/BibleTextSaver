var http = require('http');
var url = require('url');
var database = require('./database');
var translation = "KG";

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*'});
  var q = url.parse(req.url, true).query;
  console.log(q.translation+" "+q.book+ " " + q.chapter);
  if(q.translation != undefined) {
    translation = q.translation;
  }
  if(q.chapter == undefined) {
    database.db.getChaptersNumber(translation, q.book, res);
  } else {
    database.db.get_chapter(translation, q.book, q.chapter, res);
  }

}).listen(8080);
