var http = require('http');
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var template = require('./lib/09_template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');

// 로그인 정보가 맞는지 판별하는 함수
function authIsOwner(request, response){
    var isOwner = false;
    var cookies = {};
    if(request.headers.cookie){
        var cookies = cookie.parse(request.headers.cookie);
    }
    if(cookies.email === 'boorooksus@gmail.com' && cookies.password === '123456'){
        isOwner = true;
    }
    return isOwner
}

// 현재 로그인 된 상태인지 알려주는 함수. template.html() 함수의 인자로 전달
function authStatusUi(request, response){
    var authStatusUi = '<a href="/login">login</a>';
    if(authIsOwner(request, response)){
        authStatusUi = '<a href="/logout_process">logout</a>';
    }
    return authStatusUi;
}

var app = http.createServer(function(request,response){
    var _url = request.url; 
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;


    if(pathname ==='/'){
        if(queryData.id === undefined){
            fs.readdir('./data', 'utf8', function(error, filelist){
                var title = 'Welcome';
                var description = 'Welcome';
                var list = template.list(filelist);
                var html = template.html(title, list, `<p><h2>${title}</h2>${description}</p>`, `<a href="/create">create</a>`, authStatusUi(request, response));
                response.writeHead(200);
                response.end(html);
            })
        }
        else{
            fs.readdir('./data', 'utf8', function(error, filelist){
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description);
                    var list = template.list(filelist);
                    var html = template.html(title, list, `<p><h2>${sanitizedTitle}</h2>${sanitizedDescription}</p>`, `<a href="/create">create</a>
                    <a href="/update?id=${sanitizedTitle}">update</a>
                    <form action=
                    "delete_process" method="post" onsubmit="return confirm('Do you want to delete?')">
                        <input type="hidden" name="id" value="${sanitizedTitle}"><input type="submit" value="delete">
                    </form>
                    `, authStatusUi(request, response));
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }
    else if(pathname === '/create'){
        // 로그인 안되있을 경우 못하도록 설정. update, delete도 이 코드 추가
        if(authIsOwner(request, response) === false){
            response.end('Login required!!');
            return false;
        }
        fs.readdir('./data', 'utf8', function(error, filelist){
            var title = 'Web create';
            var list = template.list(filelist);
            var html = template.html(title, list, `
            <form action="/create_process" method="post">
                <p></p><input type="text" name="title" placeholder="Title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `, '', authStatusUi(request, response));
            response.writeHead(200);
            response.end(html);
        })
    }
    else if(pathname === '/create_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
                response.end('success');
            })
        });
    }
    else if(pathname === '/update'){
        if(authIsOwner(request, response) === false){
            response.end('Login required!!');
            return false;
        }
        fs.readdir('./data', 'utf8', function(error, filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = template.list(filelist);
                var html = template.html(title, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" placeholder="title" value="${title}">
                        <p></p><input type="text" name="title" placeholder="Title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`, authStatusUi(request, response)
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    }
    else if (pathname ==='/update_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
                    response.end('success');
                })
            });
        });
    }
    else if (pathname ==='/delete_process'){
        if(authIsOwner(request, response) === false){
            response.end('Login required!!');
            return false;
        }
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err){
                response.writeHead(302, {Location: `/`});
                response.end('success');
            })
        });
    }
    // login 버튼 눌렀을 때
    else if(pathname ==='/login'){
        fs.readdir('./data', 'utf8', function(error, filelist){
            var title = 'login';
            var list = template.list(filelist);
            var html = template.html(title, list, `
            <form action="login_process" method="post"> 
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="text" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
            </form>`, `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        })
    }
    // login에서 submit 했을 때
    else if(pathname === '/login_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
        var post = qs.parse(body);
            // login 정보가 맞을 때
            if(post.email === 'boorooksus@gmail.com' && post.password === '123456'){
                Location: `/`
                response.writeHead(302, {
                    'Set-Cookie' : [
                        `email=${post.email}`,
                        `password=${post.password}`,
                        `nickname=egoin`
                    ],
                    Location: `/`
                });
                response.end();
            }
            // login 정보가 틀릴 때
            else{
                response.end('login failed');
            }
        });
    }
    else if(pathname === '/logout_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
        var post = qs.parse(body);

            Location: `/`
            response.writeHead(302, {
                'Set-Cookie' : [
                    `email=; Max-Age=0`,
                    `password=; Max-Age=0`,
                    `nickname=; Max-Age=0`
                ],
                Location: `/`
            });
            response.end();
        });
    }
    else{
        response.writeHead(404);
        response.end('Not found')
    }
});
app.listen(3000);


// 쿠키를 이용한 인증 기능 구현
// 실제로는 보안 문제 때문에 이 방법 사용하면 안됨. 암호화 되지 않아서 개발자 도구로 비밀번호 볼 수 있음.