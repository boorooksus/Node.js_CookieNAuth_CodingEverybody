var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
    console.log(request.headers.cookie);
    var cookies = {};
    if(request.headers.cookie !== undefined){
        var cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies);
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco', 
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24}`,
            // secure
            'Secure_name = Secure_value; Secure',
            // httpOnly
            'HttpOnly_name=HttpOnly_value; HttpOnly'
        ]
    });
    response.end('Cookie')
}).listen(3000);

// Secure & HttpOnly
// secure: https일 때만 쿠키 사용 가능
// httpOnly: http일 때만 쿠키 사용 가능 -> 자바스크립트에서 접근 못함