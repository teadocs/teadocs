$(function () {

    var fastHide = function(ele) {
        ele.slideUp(0);
    }

    var fastShow = function(ele) {
        ele.slideDown(0);
    }

    var slowShow = function(ele) {
        ele.slideDown(500);
    }

    //generate a random string
    var randStr = function() {
        return Math.random().toString(36).substr(2);
    }

    //search component
    var showSearchApp = function (keywords) {
        var initVue = function () {
            var searchApp = new Vue({
                el: '#' + eleId,
                data: {
                    keywords: keywords,
                    dataLoaded: false,
                    results: []
                },
                created: function () {
                    let that = this;
                    $.getScript("/data.js", function() {  
                        that.dataLoaded = true;
                        that.search(keywords);
                    });
                },
                watch: {
                    keywords: function (newVal) {
                        if ( this.dataLoaded ) {
                            this.search(newVal);
                        }
                    }
                },
                methods: {
                    liHandle: function ($event) {
                        if ( $event.target.nodeName === "A" || $event.target.className === "content" ) {
                            this.closePopup();
                        }
                    },

                    closePopup: function() {
                        $("#" + eleId).removeClass('show');
                        setTimeout(function () {
                            $('.mask').remove();
                            searchApp = undefined;
                        }, 700);
                    },

                    getPageLink: function (context) { 
                        if ( context.length ) {
                            return context[context.length - 1].link;
                        } else {
                            return ''
                        }
                    },

                    search: function(keywords) {
                        //console.log(keywords);
                        this.results = searchData(keywords);
                        console.log(this.results);
                    }
                }
            });
        }

        var eleId = 'search_' + randStr();
        var htmlCode = "<div id='"+ eleId +"' class='mask'>\
                            <div class='search-popup'> \
                                <div class='search-popup-header clearfix'> \
                                    <span class='search-icon'> \
                                        <i class='fa fa-search'></i> \
                                    </span> \
                                    <span class='popup-btn-close' @click='closePopup()'> \
                                        <i class='fa fa-times-circle'></i> \
                                    </span> \
                                    <div class='local-search-input-wrapper'> \
                                        <input placeholder='请输入搜索关键字...' type='text' v-model='keywords'> \
                                    </div> \
                                </div> \
                                <div class='search-popup-body'>\
                                    <div class='search-loding' v-show='!dataLoaded'> \
                                        <section> \
                                            <div class='sk-cube-grid'> \
                                                <div class='sk-cube sk-cube-1'></div> \
                                                <div class='sk-cube sk-cube-2'></div> \
                                                <div class='sk-cube sk-cube-3'></div> \
                                                <div class='sk-cube sk-cube-4'></div> \
                                                <div class='sk-cube sk-cube-5'></div> \
                                                <div class='sk-cube sk-cube-6'></div> \
                                                <div class='sk-cube sk-cube-7'></div> \
                                                <div class='sk-cube sk-cube-8'></div> \
                                                <div class='sk-cube sk-cube-9'></div> \
                                            </div> \
                                        </section> \
                                    </div> \
                                    <div class='search-result' v-show='dataLoaded'> \
                                        <div class='no-result' v-show='results.length === 0'> \
                                            <i class='fa fa-frown-o fa-5x'></i> \
                                        </div> \
                                        <ul v-show='results.length > 0'> \
                                            <li v-for='r in results' @click='liHandle($event)'> \
                                                <div class='title'> \
                                                    <span v-for= '(t,index) in r.context'> \
                                                        <a :href='t.link'>{{t.title}}</a> \
                                                        <span> \
                                                            <i v-show='index !== r.context.length - 1 || (index === r.context.length - 1 && r.title) ' class='fa fa-angle-double-right'></i> \
                                                        </span> \
                                                    </span> \
                                                    <span v-show='r.title'><a :href='getPageLink(r.context) + \"#\" + r.hid'>{{r.title}}</a></span> \
                                                </div> \
                                                <a :href='getPageLink(r.context) + \"#\" + r.hid'> \
                                                    <div class='content' v-html='r.findContent'> \
                                                    </div> \
                                                </a> \
                                            </li> \
                                        </ul> \
                                    </div> \
                                </div> \
                            </div> \
                        </div>";

        var searchEle = $(htmlCode);
        $("body").append(searchEle);
        setTimeout(function () {
            $("#" + eleId).addClass('show');
        }, 100);
        initVue();
    }

    $(".tea-menu-list li a").click(function (event) {
        var ulEle = null;
        if ( event.target.className.indexOf("fa fa-angle-down") !== -1 ) {
            ulEle = $(event.target).parent().next();
        } else if ( event.target.nodeName === "A" && !event.target.href ) {
            ulEle = $(event.target).next();
        }
        if ( ulEle ) {
            var ulStyle = ulEle.attr("style");
            if ( ulStyle === "display: none;" ) {
                $(ulEle).prev().find("i").addClass("unfold");
                ulEle.slideDown(220);
            } else if ( ulStyle === "" || ulStyle === undefined ) {
                $(ulEle).prev().find("i").removeClass("unfold");
                ulEle.slideUp(220);
            }
        }
    });
    
    //hide all
    var ulEles = $(".tea-menu-list ul");
    for(var i = 0; i <= ulEles.length; i++) {
        fastHide(ulEles.eq(i));
    }

    //show for attr as 1 
    ulEles = $(".tea-menu ul[data-show='1']");
    for(var i = 0; i <= ulEles.length; i++) {
        ulEles.eq(i).prev().find("i").addClass("unfold");
        fastShow(ulEles.eq(i));
    }
    
    //show activated elements
    ulEles =  $(".tea-menu a.active");
    for(var i = 0; i <= ulEles.length; i++) {
        ulEles.eq(i).find("i").addClass("unfold");
        fastShow(ulEles.eq(i).next());
    }

    setTimeout(function () {
        $(".loading-warp").remove();
    }, 500);

    //numbering for pre>code blocks 
    $('pre code').each(function(){
        var lines = $(this).text().split('\n').length;
        var $numbering = $('<ul/>').addClass('pre-numbering');
        $(this)
            .addClass('has-numbering')
            .parent()
            .append($numbering);
        for(i=1;i<=lines;i++){
            $numbering.append($('<li/>').text(i));
        }
    });

    //Bind return key
    $(".tea-menu-search-warp input").on("keydown", function (e) {
        if (e.keyCode === 13) {
            showSearchApp(this.value);
        }
    });


});
