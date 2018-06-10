$(function () {
    let doc_width = $(window).outerWidth()

    // menu button
    let menuFlag = false,
        contentHeight = $('.tea-content').height();
        
    $('.tea-content .fa-navicon').on('click', function () {
        if (menuFlag) {
            $('.main .tea-menu,#menu-mask').fadeOut(100)
            if (doc_width <= 1024) {
                $('#menu-mask').fadeOut(100)
            } else {
                $('.tea-content').css('width', '100%')
            }
            menuFlag = false
        } else {
            $('.main .tea-menu').fadeIn(100)
            if (doc_width <= 1024) {
                $('#menu-mask').fadeIn(100)
                $('.tea-content').height($('#menu-mask').height())
            } else {
                $('.tea-content').css('width', 'calc(100vw - 250px)')
            }
            menuFlag = true
        }
    })

    // mask animate
    $('.main').on('click', '#menu-mask', function () {
        $('.main .tea-menu,#menu-mask').fadeOut(100)
        $('.tea-content').css('height', contentHeight + 'px')
        menuFlag = false
    })
})
