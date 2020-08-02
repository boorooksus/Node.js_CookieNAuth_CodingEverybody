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
            // permanent cookie
            `Permanent=cookies; Max-Age=${60*60*24}`
        ]
    });
    response.end('Cookie')
}).listen(3000);

// Session vs Permanent
// cookie에 expire 또는 Max-Age를 사용하면 permanent cookie로 설정 가능