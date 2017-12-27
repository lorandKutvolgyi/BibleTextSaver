var http = require('http');
var database = require('./database');

var books = ["GENESIS", "EXODUS", "LEVITICUS", "NUMBERS", "DEUTERONOMY", "JOSHUA", "JUDGES", "RUTH", "I_SAMUEL","II_SAMUEL", "I_KINGS",
            "II_KINGS", "I_CHRONICLES", "II_CHRONICLES", "EZRA", "NEHEMIAH", "ESTHER", "JOB", "PSALMS", "PROVERBS", "ECCLESIASTES",
            "SONG_OF_SOLOMON", "ISAIAH", "JEREMIAH", "LAMENTATIONS", "EZEKIEL", "DANIEL", "HOSEA", "JOEL", "AMOS", "OBADIAH", "JONAH",
            "MICAH", "NAHUM", "HABAKKUK", "ZEPHANIAH","HAGGAI", "ZECHARIAH", "MALACHI", "MATTHEW", "MARK", "LUKE", "JOHN", "ACTS", "ROMANS",
            "I_CORINTHIANS", "II_CORINTHIANS", "GALATIANS","EPHESIANS", "PHILIPPIANS", "COLOSSIANS", "I_THESSALONIANS", "II_THESSALONIANS",
            "I_TIMOTHY", "II_TIMOTHY", "TITUS", "PHILEMON", "HEBREWS", "JAMES", "I_PETER", "II_PETER", "I_JOHN", "II_JOHN", "III_JOHN",
            "JUDE", "REVELATION"];
var books_abbrev = ["1Moz", "2Moz", "3Moz", "4Moz", "5Moz", "Jozs", "Bir", "Rut", "1Sam","2Sam", "1Kir",
            "2Kir", "1Krón", "2Krón", "Ezsd", "Neh", "Eszt", "Jób", "Zsolt", "Péld", "Préd",
            "En", "Ézs", "Jer", "Jsir", "Ez", "Dán", "Hós", "Joel", "Ám", "Abd", "Jón",
            "Mik", "Náh", "Hab", "Zof","Hag", "Zak", "Mal", "Mat", "Mar", "Luk", "Jan", "ApCsel", "Rom",
            "1Kor", "2Kor", "Gal","Ef", "Fil", "Kol", "1Tesz", "2Tesz",
            "1Tim", "2Tim", "Tit", "Filem", "Zsid", "Jak", "1Pét", "2Pét", "1Jan", "2Jan", "3Ján",
            "Jud", "Jel"];
var translations = ['KG', 'RUF'];

var i = 0;
var j = 1;
var m = 0;
var translation = translations[m];
var uri_fragment = books_abbrev[i]+j;
var rows = [];

var escape = function(text) {
  var escaped = text.replace(';' , '\;').replace("'" , "\'").replace('"' , '\"');
  return escaped;
}

var is_notexisting_chapter = function(data) {
  return JSON.parse(data).valasz.versek.length === 0;
}

var is_there_more_book = function(i) {
  return i + 1 < books_abbrev.length;
};

var is_there_more_translation = function(m) {
  return m + 1 < translations.length;
};

var process_data = function(data) {

  var k = 0;
  var num_of_verses = JSON.parse(data).valasz.versek.length;
  while (k < num_of_verses){
    var row = [books[i], j, k, escape(JSON.parse(data).valasz.versek[k].szoveg), translation];
    rows.push(row);
    console.log(k);
    k = k + 1;
  }
};

var getBibleText = function(){
      http.get({
        hostname: 'szentiras.hu',
        port: 80,
        path: '/api/idezet/'+ encodeURIComponent(uri_fragment) + '/' + translation,
        agent: false
      }, function(resp) {
          var data='';

          resp.on('data', function(chunk)  {
            data += chunk;
          });
          resp.on('end', function() {
            if(is_notexisting_chapter(data)){
              if (is_there_more_book(i)){
                i = i + 1;
                j = 1;
                uri_fragment = books_abbrev[i]+j;
                setTimeout ( function() {
                  getBibleText();
                }, 0);
              }else {
                if (is_there_more_translation(m)) {
                  translation = translations[++m];
                  i = 0;
                  j = 1;
                  setTimeout ( function() {
                    getBibleText();
                  }, 60000);
                } else {
                  database.db.update_db(rows);
                }
              }
            } else {
              process_data(data);
              console.log(translation);
              console.log(books[i]);
              console.log(j);
              j = j + 1;
              uri_fragment = books_abbrev[i]+j;
              setTimeout ( function() {
                getBibleText();
              }, 0);
            }
          });
    }).on("error", function(err)  {
      console.log("Error: " + err.message);
    });
}

module.exports.getBibleText = getBibleText;
