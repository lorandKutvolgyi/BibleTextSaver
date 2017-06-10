//var http = require('http');

//var options = {
  //host: 'www.random.org',
  //path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
//};

/*callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}*/

//http.request(options, callback).end();


var getBibleText = function(){
  console.log('Getting the text of the Bible ...')
  return 'this is the text';
}

module.exports.getBibleText = getBibleText;
