/*
 * jquery.table.js 0.1
 * Copyright (c) 2014 lianglin
 * Date: 2014-08-17
 * 使用tableUI可以方便地将表格提示使用体验。先提供的功能有奇偶行颜色交替，鼠标移上高亮显示
 */
(function($){
    $.fn.tableUI = function(options){
        var defaults = {
            evenRowClass:"evenRow",
            oddRowClass:"oddRow",
            activeRowClass:"activeRow"
        };
        var options = $.extend(defaults,options);
        this.each(function(){
            var table = $(this);
            table.find("tr:even").addClass(options.evenRowClass);
            table.find("tr.odd").addClass(options.oddRowClass);

            table.find("tr").hover(function(){
                    $(this).addClass(options.activeRowClass);
            },function(){
                $(this).removeClass(options.activeRowClass);
            });
        });
    }
})(jQuery);