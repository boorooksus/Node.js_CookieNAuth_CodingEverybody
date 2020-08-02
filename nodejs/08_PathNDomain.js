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
            'Secure_name = Secure_value; Secure',
            'HttpOnly_name=HttpOnly_value; HttpOnly',
            // path - '/cookie' 및 하위 디렉토리에서만 쿠키 사용 가능
            'Path_name=Path_value; Path=/cookie',
            // domain - 'o2.org' 뿐만 아니라 그 앞에 어떤 sub domain이 붙어도 쿠키 사용 가능
            'Domain_name=Domain_value; Domain=o2.org'
        ]
    });
    response.end('Cookie')
}).listen(3000);

// path & domain
// path: 설정된 디렉토리 및 하위 디렉토리에서만 쿠키 사용 가능
// domain: 도메인 설정