var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
    console.log(request.headers.cookie);
    var cookies = {};
    // parse는 cookie가 없으면 에러가 남 따라서 if문으로 확인
    if(request.headers.cookie !== undefined){
        var cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies);
    response.writeHead(200, {
        'Set-Cookie':['yummy_cookie=choco', 'tasty_cookie=strawberry']
    });
    response.end('Cookie')
}).listen(3000);

// 쿠키의 읽기