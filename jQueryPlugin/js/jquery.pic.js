/**
 * Created by lianglin on 14-8-17.
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
                        console.log(index + "is loaded");
                        load = true;
                    }
                }
            });
            $(window).trigger("scroll");
        });
    }
})(jQuery);