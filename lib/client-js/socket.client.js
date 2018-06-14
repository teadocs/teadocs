(function () {
    var htmlReplace = function (data) {
        console.log(data);
        var path = data.path.replace("\\", "/");
        var container = document.querySelector(".markdown-body");
        var pathName = window.location.pathname;
        if ( pathName === "/" ) {
            if ( path === "/index.html" ) { 
                container.innerHTML = data.content;
            }
        } else if ( pathName === path ) {
            container.innerHTML = data.content;
        }
    }
    if ("WebSocket" in window) {
        var socket = io.connect(window.location.host);
        socket.on('news', function (data) {
            if ( data.action === "hot-replace" ) {
                htmlReplace(data);
            } else if (data.action === "hot-refresh") {
                window.location.reload();
            }
        });
    }
})();