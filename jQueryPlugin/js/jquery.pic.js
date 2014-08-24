/*
 * jquery.pic.js 0.1
 * Copyright (c) 2014 lianglin
 * Date: 2014-08-17
 * lazyload:图片延时加载；picZoom:图片放大功能
 */
(function($){
    $.fn.lazyLoad = function(options){
        var defaults = {
        };
        options = $.extend(defaults,options);
        this.each(function(index,item){
            var img = $(this);
            var load = false;
            $(window).bind("scroll",function(){
                if(!load) {
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

    $.fn.picZoom = function(options) {
        var defaults = {};
        options = $.extend(defaults, options);
        this.each(function (index, item) {
            var oSpan = $(this).find("span");
            var oImg = $(this).find("img").eq(1);
            var oImgParent = oImg.parent();
            $(this).find("div").eq(0).mouseenter(function () {
                oSpan.show();
                oImgParent.show();
                oSpan.css("cursor","move");
            });
            $(this).find("div").eq(0).mouseleave(function () {
                oSpan.hide();
                oImgParent.hide();
                oSpan.css("cursor","default");
            });
            $(this).find("div").eq(0).mousemove(function(event){
                event = event||window.event;
                var x = event.pageX - $(this).offset().left - oSpan.width()/2;
                var y = event.pageY - $(this).offset().top - oSpan.height()/2;
                x = x < 0 ? 0 : x;
                y = y < 0 ? 0 : y;
                x = x > ($(this).width() - oSpan.width()) ?($(this).width() - oSpan.width()) :x;
                y = y > ($(this).height() - oSpan.height()) ?($(this).height() - oSpan.height()) :y;
                oSpan.css("left",x +"px");
                oSpan.css("top",y + "px");

                var percentX = x/($(this).width() - oSpan.width());
                var percentY = y/($(this).height() - oSpan.height());
                oImg.css("left",-percentX*(oImg.width() - oImgParent.width()) + "px");
                oImg.css("top",-percentY*(oImg.height() - oImgParent.height()) + "px");
            });
        });
    };
})(jQuery);

//获取浏览器类型
function getBowserType() {
    window.sys = {};
    var ua = navigator.userAgent.toLowerCase();
    sys.firefox = ua.match(/firefox\/([\d\.]+)/);
    sys.ie = ua.match(/msie\s([\d\.]+)/);
    sys.chrome = ua.match(/chrome\/([\d\.]+)/);
    return sys;
}