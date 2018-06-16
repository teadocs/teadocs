(function () {
    var content = '';//<%- content %>

    var randStr = function () {
        return Math.random().toString(36).substr(2);
    };

    var findTitle = function (ele) {
        var findPrevs = function (ele) {
            var children = $(ele).parent().children();
            var prevs = [];
            var findIt = false;
            children = Array.prototype.slice.call(children);
            children.forEach(function (subEle) {
                if ($(subEle).is($(ele))) {
                    findIt = true;
                }
                if (findIt === false && $(subEle).text() != "") {
                    prevs.push(subEle);
                }
            });
            return prevs;
        };
        var findH = function (eles) {
            var _eles = Array.prototype.slice.call(eles);
            _eles.reverse();
            var title = "";
            var id = "";
            _eles.forEach(function (item) {
                if (!title) {
                    if (item.nodeName[0] === "H") {
                        title = $(item).text();
                        id = $(item).attr("id");
                    }
                }
            });
            return {
                text: title,
                id: id
            };
        };
        var prevs = findPrevs(ele);
        if (prevs.length) {
            return findH(prevs);
        }
    };

    window.searchData = function (keyword) {
        var searchResult = [];
        content.forEach(function (item) {
            var tempHtml = "<div id='" + randStr() + "'></div>";
            var tempEle = $(tempHtml);
            var findArray = [];
            tempEle.html(item.content);
            findArray = tempEle.find(":contains('" + keyword + "')");
            findArray = Array.prototype.slice.call(findArray);
            if (findArray.length) {
                findArray.forEach(function (ele) {
                    var findContent = $(ele).text();
                    findContent = findContent[0] === "<" ? $(findContent).text() : findContent;
                    findContent = findContent.replace(new RegExp(keyword, 'g'), "<b>" + keyword + "</b>");
                    var hObj = findTitle(ele);
                    if (hObj) {
                        searchResult.push({
                            context: item.context,
                            title: hObj.text,
                            hid: hObj.id,
                            findContent: findContent
                        });
                    }

                });
            }
        });
        return searchResult;
    };
})();