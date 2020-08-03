module.exports = {
    // 로그인/로그아웃 버튼 표시하는 값을 패러미터로 추가
    // authStatusUi 값이 없으면 default로 '<a href="/login">~'이 됨
    html:function(title, list, body, control, authStatusUi = '<a href="/login">login</a>'){
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <input type="button", value="hi", onclick="alert('hi')";>
            ${authStatusUi}
            <h1><a href="/" style=color:red;>WEB</a></h1>
            <div id="grid">
                ${list}
                ${control}
                ${body}
            </div>
            
        </body>
    </html>
    `;
    },
    list:function(filelist){
        var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list
    }
}

//module.exports = template;