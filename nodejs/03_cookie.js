var http = require('http');
http.createServer(function(request, response){
    response.writeHead(200, {
        // 쿠키 생성. 여러 개의 쿠키를 생성할 땐 배열 사용
        'Set-Cookie':['yummy_cookie=choco', 'tasty_cookie=strawberry']
    });
    response.end('Cookie')
}).listen(3000);