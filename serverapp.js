var http = require('http');
var url = require('url');
var database = require('./database');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  var q = url.parse(req.url, true).query;
  database.db.get_chapter(q.translation, q.book, q.chapter, res);
}).listen(8080);
