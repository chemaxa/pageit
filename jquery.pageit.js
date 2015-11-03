(function($) {
    'use strict';
    $.fn.pageIt = function(method) {
        var settings = {
            height: 400,
            fadeSpeed: 400,
            nextText: 'Вперед',
            prevText: 'Назад',
            el: {},
            lastPage: 1,
            autoHeight: false,
            paginatePages: 0,
            showNumpages: false
        };
        var methods = {
            // initialization function
            init: function(options) {
                var elem = document.querySelector(this.selector);
                if (options.autoHeight) {
                    if (elem.getBoundingClientRect().bottom > window.innerHeight)
                        settings.height = window.innerHeight * 0.7;
                }
                //Copy settings  
                $.extend(settings, options);
                settings.el = this;
                var fullPages = [],
                    pageElements = [],
                    height = 0;
                // If elem height < needle height than return

                if (this.outerHeight() < settings.height) return;


                // Summ heights of all content element childs
                this.children().each(function() {
                    //console.log(this, this.clientHeight);
                    // if height greater then needed, create page
                    if (height + this.offsetHeight > settings.height) {
                        fullPages.push(pageElements);
                        pageElements = [];
                        height = 0;
                    }

                    height += this.offsetHeight;
                    pageElements.push(this);
                });

                // tails
                if (height > 0) {
                    fullPages.push(pageElements);
                }
                // If only 1 page
                console.log(fullPages);
                if (fullPages.length == 1) return;

                // Append paginator to element
                this.append(methods.getPaginationTemplate());


                // wrapping each full page
                $(fullPages).wrap("<div class='page'></div>");

                // hiding all wrapped pages
                this.children('.page').hide();

                // making collection of pages for pagination
                settings.paginatePages = this.children('.page');

                // draw controls
                if (settings.showNumpages)
                    methods.showNumpages($(settings.paginatePages).length);

                // show first page
                methods.showPage(settings.paginatePages, settings.lastPage);
                // Click on pagination links, if Delegate target has page_num attribute, then go to page 
                // and binding 2 events - on clicking to Prev & next
                $(settings.el).on('click.pageIt', function(el) {
                    if (!el.target.dataset) return;
                    if (el.target.dataset.pg == 'prev')
                        methods.showPage(settings.paginatePages, settings.lastPage);

                    if (el.target.dataset.pg == 'next')
                        methods.showPage(settings.paginatePages, settings.lastPage + 2);

                    if (el.target.dataset.pg_num)
                        methods.showPage(settings.paginatePages, el.target.dataset.page_num);
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

                    methods.getPaginationEl(settings.el).find('.page_n').removeClass('pgActive');
                    methods.getPaginationEl(settings.el).find('.page_n').eq(pageNum - 1).addClass('pgActive');
                }
            },

            // show pagination function (draw switching numbers)
            showNumpages: function(numPages) {
                var pagins = '';
                for (var i = 1; i <= numPages; i++) {
                    pagins += '<a href="#" class="page_n" data-pg_num=' + i + '>' + i + '</a>';
                }

                settings.el.find('.pgPagination a:first-child').after(pagins);
            },
            getPaginationTemplate: function() {
                return '<div class="pgPagination"><a href="#" data-pg = "prev" class = "pgPrev" > ' + settings.prevText + '</a><a href="#" data-pg = "next"  class = "pgNext"> ' + settings.nextText + ' </a></div>';
            },
            getPaginationEl: function(el) {
                return el.children('.pgPagination');
            },
        };
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
