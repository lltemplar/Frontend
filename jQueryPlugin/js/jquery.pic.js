/*
 * jquery.pic.js 0.1
 * Copyright (c) 2014 lianglin
 * Date: 2014-08-17
 * lazyload:图片延时加载；picZoom:图片放大功能;picSlide:图片幻灯片;picShake:图片抖动
 */
(function ($) {
    /**
     * picture lazy loading
     * @param options
     */
    $.fn.lazyLoad = function (options) {
        var defaults = {
        };
        options = $.extend(defaults, options);
        this.each(function (index, item) {
            var img = $(this);
            var load = false;
            $(window).bind("scroll", function () {
                if (!load) {
                    var screenHeight = $(window).height();
                    var marginTop = img.offset().top;
                    var scrollHeight = $(window).scrollTop();
                    if (marginTop - scrollHeight <= screenHeight) {
                        img.attr("src", img.attr("_src"));
                        load = true;
                    }
                }
            });
            $(window).trigger("scroll");
        });
    };

    /**
     * picture zoom
     * @param options
     */
    $.fn.picZoom = function (options) {
        var defaults = {};
        options = $.extend(defaults, options);
        this.each(function (index, item) {
            var oSpan = $(this).find("span");
            var oImg = $(this).find("img").eq(1);
            var oImgParent = oImg.parent();
            $(this).find("div").eq(0).mouseenter(function () {
                oSpan.show();
                oImgParent.show();
                oSpan.css("cursor", "move");
            });
            $(this).find("div").eq(0).mouseleave(function () {
                oSpan.hide();
                oImgParent.hide();
                oSpan.css("cursor", "default");
            });
            $(this).find("div").eq(0).mousemove(function (event) {
                event = event || window.event;
                var x = event.pageX - $(this).offset().left - oSpan.width() / 2;
                var y = event.pageY - $(this).offset().top - oSpan.height() / 2;
                x = x < 0 ? 0 : x;
                y = y < 0 ? 0 : y;
                x = x > ($(this).width() - oSpan.width()) ? ($(this).width() - oSpan.width()) : x;
                y = y > ($(this).height() - oSpan.height()) ? ($(this).height() - oSpan.height()) : y;
                oSpan.css("left", x + "px");
                oSpan.css("top", y + "px");

                var percentX = x / ($(this).width() - oSpan.width());
                var percentY = y / ($(this).height() - oSpan.height());
                oImg.css("left", -percentX * (oImg.width() - oImgParent.width()) + "px");
                oImg.css("top", -percentY * (oImg.height() - oImgParent.height()) + "px");
            });
        });
    };

    /**
     * picture slide
     * @param options
     */
    $.fn.picSlide = function (options) {
        var defaults = {autoPlay: true, autoPlaySpeed: 3000, speed: 500};
        options = $.extend(defaults, options);
        var imgList = $(this).find("ul");
        var num = imgList.children().length;
        var width = imgList.find("li").width();
        imgList.css("width", width * (num + 1));
        imgList.append($("ul").children(0).clone());
        var curPage = 0;
        $(this).find(".navRight").click(function () {
            if (imgList.is(":animated")) {
                return;
            }
            if (curPage === num) {
                curPage = 0;
                imgList.css("left", "0px");
            }
            imgList.animate({left: "-=" + width}, options.speed, function () {
                curPage++;
                setNav(curPage);
            });
        });
        $(this).find(".navLeft").click(function () {
            if (imgList.is(":animated")) {
                return;
            }
            if (curPage === 0) {
                curPage = num;
                imgList.css("left", -1 * width * num);
            }
            imgList.animate({left: "+=" + width}, options.speed, function () {
                curPage--;
                setNav(curPage);
            });
        });
        var navBottom = $(this).find(".navBottom");
        navBottom.children().click(function () {
            curPage = navBottom.children().index($(this));
            setNav(curPage);
            setPage(curPage);
        });
        function setNav(_curPage) {
            navBottom.children(".on").removeClass("on");
            navBottom.children().eq(_curPage % num).addClass("on");
            resetTimer();
        }

        function setPage(_curPage) {
            imgList.animate({left: -1 * width * _curPage}, options.speed);
        }

        if (options.autoPlay) {
            var handler = setInterval(autoPlay, options.autoPlaySpeed);
        }
        function autoPlay() {
            if (curPage === num) {
                curPage = 0;
                imgList.css("left", "0px");
            }
            curPage++;
            setPage(curPage);
            setNav(curPage);
        }

        function resetTimer() {
            if (!options.autoPlay)
                return;
            clearInterval(handler);
            handler = setInterval(autoPlay, options.autoPlaySpeed);
        }
    };
    /**
     * picture animate
     * @param options parameter
     */
    $.fn.picShake = function (options) {
        var defaults = {
            event: 'hover',
            animate: 'animate3',
            scope: 10,
            count: 50,
            speed: 52
        };

        options = $.extend(defaults, options);
        this.each(function (index, item) {
            var rector = 10;
            var a = 1;
            var count = 0;
            var timeHandler;
            switch (options.event) {
                case 'hover':
                    $(this).hover(function () {
                        start();
                    }, function () {
                        end();
                    });
                    break;
                case 'click':
                    $(this).click(function () {
                        start();
                    })
                    break;
            }
            function start() {
                item.style.left = 0;
                item.style.top = 0;
                //invoke animate function by animate type
                switch (options.animate) {
                    case 'animate1':
                        timeHandler = setInterval(animate1, options.speed);
                        break;
                    case 'animate2':
                        timeHandler = setInterval(animate2, options.speed);
                        break;
                    case 'animate3':
                        if (!(document.all && !window.opera))
                            timeHandler = setInterval(animate3, options.speed);
                        else
                            timeHandler = setInterval(animate3_2, options.speed);
                }
            }

            function end() {
                clearInterval(timeHandler);
                count = 0;
                item.style.left = 0;
                item.style.top = 0;
                item.style.MozTransform = "rotate(0)";
                item.style.WebkitTransform = "rotate(0)";
                item.style.OTransform = "rotate(0)";
                item.style.Transform = "rotate(0)";
                item.style.filter = 'none';
            }

            function animate1() {
                if (count == options.count) {
                    clearInterval(timeHandler);
                    count = 0;
                    return;
                }
                if (a == 1) {
                    item.style.top = parseInt(item.style.top) + options.scope + "px";
                }
                else if (a == 2) {
                    item.style.left = parseInt(item.style.left) + options.scope + "px";
                }
                else if (a == 3) {
                    item.style.top = parseInt(item.style.top) - options.scope + "px";
                }
                else {
                    item.style.left = parseInt(item.style.left) - options.scope + "px";
                    count++;
                }
                a = a >= 4 ? 1 : ++a;
            }

            function animate2() {
                if (count == options.count) {
                    clearInterval(timeHandler);
                    count = 0;
                    return;
                }
                if (a == 1) {
                    $(item).stop(true, false).animate({top: '-=' + options.scope}, options.speed / 4);
                }
                else if (a == 2) {
                    $(item).stop(true, false).animate({top: '+=' + options.scope}, options.speed / 4);
                }
                else if (a == 3) {
                    $(item).stop(true, false).animate({top: '+=' + options.scope}, options.speed / 4);
                }
                else {
                    $(item).stop(true, false).animate({top: '-=' + options.scope}, options.speed / 4);
                    count++;
                }
                a = a >= 4 ? 1 : ++a;
            }

            function animate3() {
                if (count == options.count) {
                    clearInterval(timeHandler);
                    count = 0;
                    return;
                }
                var rotation;
                if (a == 1) {
                    rotation = options.scope + "deg";
                }
                else if (a == 2) {
                    rotation = 0;
                }
                else if (a == 3) {
                    rotation = -1 * options.scope + "deg";
                }
                else {
                    rotation = 0;
                    count++;
                }
                item.style.MsTransform = "rotate(" + rotation + ")";
                item.style.MozTransform = "rotate(" + rotation + ")";
                item.style.WebkitTransform = "rotate(" + rotation + ")";
                item.style.OTransform = "rotate(" + rotation + ")";
                item.style.Transform = "rotate(" + rotation + ")";
                a = a >= 4 ? 1 : ++a;
            }

            function animate3_2() {
                //item.style.padding = item.clientWidth / 2 * Math.cos( Math.PI * options.scope / 180) + "px";
                var padding = item.clientWidth/10;
                item.style.padding = padding + 'px';
                item.style.marginLeft =  item.style.marginLeft - padding + 'px';
                item.style.marginTop =  item.style.marginTop - padding + 'px';
                if (count == options.count) {
                    clearInterval(timeHandler);
                    count = 0;
                    return;
                }
                var rotation;

                if (a == 1) {
                    rotation = Math.PI * options.scope / 180;
                }
                else if (a == 2) {
                    rotation = 0;
                }
                else if (a == 3) {
                    rotation = -1 * Math.PI * options.scope / 180;
                }
                else {
                    rotation = 0;
                    count++;
                }
                var costheta = Math.round(Math.cos(rotation) * 1000) / 1000;
                var sintheta = Math.round(Math.sin(rotation) * 1000) / 1000;
                var dx = -item.clientWidth / 2 * costheta + item.clientHeight / 2 * sintheta + item.clientWidth / 2;
                var dy = -item.clientWidth / 2 * sintheta - item.clientHeight / 2 * costheta + item.clientHeight / 2;
                item.style.filter = "progid:DXImageTransform.Microsoft.Matrix(Dx=" + dx + ",Dy=" + dy + ",M11=" + costheta + ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta + ")";
                a = a >= 4 ? 1 : ++a;
            }
        });
    };

})(jQuery);