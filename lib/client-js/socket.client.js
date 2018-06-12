(function () {
    var htmlReplace = function (data) {
        var container = document.querySelector(".markdown-body");
        var pathName = window.location.pathname;
        if ( pathName === "/" ) {
            if ( data.path === "/index.html" ) { 
                container.innerHTML = data.content;
            }
        } else if ( pathName === data.path ) {
            container.innerHTML = data.content;
        }
    }
    if ("WebSocket" in window) {
        var socket = io.connect(window.location.host);
        socket.on('news', function (data) {
            htmlReplace(data);
        });
    }
})();