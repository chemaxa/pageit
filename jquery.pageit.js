(function($) {
    'use strict';
    var settings = {
        height: 400,
        fadeSpeed: 400,
        showPagination: true,
        nextText: 'Вперед',
        prevText: 'Назад',
        el: {},
        lastPage: 1,
    };
    var methods = {
        // initialization function
        init: function(options) {
            //Copy settings  
            $.extend(settings, options);
            settings.el = this;
            console.log(methods.getPaginationTemplate(this), methods.getPaginationEl(this));
            var fullPages = [],
                pageElements = [],
                height = 0;

            // Summ heights of all content element childs
            this.children().each(function(_) {
                //console.log(this, this.clientHeight);
                // if height greater then needed, create page
                if (height + this.clientHeight > settings.height) {
                    fullPages.push(pageElements);
                    pageElements = [];
                    height = 0;
                }

                height += this.clientHeight;
                pageElements.push(this);
            });

            // tails
            if (height > 0) {
                fullPages.push(pageElements);
            }
            // If only 1 page
            if (fullPages.length == 1) return;
            if (settings.showPagination || this.height() > $(window).height()) {
                this.append(methods.getPaginationTemplate(this));
            }

            // wrapping each full page
            $(fullPages).wrap("<div class='page'></div>");

            // hiding all wrapped pages
            this.children().hide();

            // making collection of pages for pagination
            //paginatePages = this.children();

            // draw controls
            //methods.showPagination($(paginatePages).length);

            // show first page
            methods.showPage(this.children(), settings.lastPage);
            // Click on pagination links, if Delegate target has page_num attribute, then go to page 
            // and binding 2 events - on clicking to Prev & next
            $(window).on('click.pageIt', function(el) {
                if (!el.target.dataset) return;
                if (el.target.dataset.pg == 'prev')
                    methods.showPage(settings.lastPage);

                if (el.target.dataset.pg == 'next')
                    methods.showPage(settings.lastPage + 2);

                if (el.target.dataset.pg_num)
                    methods.showPage(el.target.dataset.page_num);
            });
        },
        // update counter function
        updateCounter: function(i) {
            methods.getPaginationEl(settings.el).find('#page_number').html(i);
        },

        // show page function
        showPage: function(pageList, pageNum) {
            var i = pageNum - 1;
            if (pageList[i]) {
                // hiding old page, display new one
                $(pageList[settings.lastPage]).fadeOut(
                    settings.fadeSpeed,
                    function() {
                        settings.lastPage = i;
                        $(pageList[settings.lastPage]).fadeIn(settings.fadeSpeed);
                    }
                );

                // and updating counter
                methods.updateCounter(pageNum);

                methods.getPaginationEl(settings.el).find('.page_n').removeClass('act');
                methods.getPaginationEl(settings.el).find('.page_n').eq(pageNum - 1).addClass('act');
            }
        },

        // show pagination function (draw switching numbers)
        showPagination: function(numPages) {
            var pagins = '';
            for (var i = 1; i <= numPages; i++) {
                pagins += '<li><a href="#" class="page_n" data-pg_num=' + i + '>' + i + '</a></li>';
            }
            methods.getPaginationTemplate.find('li:first-child').after(pagins);
        },
        getPaginationTemplate: function() {
            return '<ul class="pgPagination"><li><a href = "#" data-pg = "prev" class = "pgPrev" > ' + settings.prevText + '</a></li><li><a href = "#" data-pg = "next"  class = "pgNext"> ' + settings.nextText + ' </a></li></ul>';
        },
        getPaginationEl: function(el) {
            return el.siblings('.pgPagination');
        },
    };

    $.fn.pageIt = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error(' PageIt have not method: ' + method);
        }
        return this;
    };
})(jQuery);
