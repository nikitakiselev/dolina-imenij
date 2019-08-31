/**
 * ScrollSpy
 *
 * @author Nikita Kiselev <kiselev2008@gmail.com>
 */



;(function($, window) {

    var $window = $(window),
        headerHeight = $('.page-header').outerHeight(true),
        $menu = $('#main-menu'),
        $menuItems = $menu.find('a[href^="#"]'),
        menuActiveClass = 'main-menu__item--active',
        oldBlockId = null,
        blocks = [];

    console.log($menuItems);

    $.recalculateSrollSpy = function() {
        blocks = $menuItems.map(function(index, item) {
            var $item = $(item),
                blockId = $item.attr('href'),
                $block = $(blockId);

            if ($block.length) {
                return {
                    id: blockId,
                    top: $block.offset().top,
                    height: $block.outerHeight(true),
                    $menuItem: $item
                };
            }
        });
    };

    $.recalculateSrollSpy();

    $window.on('scroll', function() {
        var scrollTop = $window.scrollTop() + headerHeight;

        var block = blocks.map(function(index, block) {
            if (scrollTop >= this.top && scrollTop < this.top + this.height) {
                return this;
            }
        });

        if (block.length && oldBlockId !== block[0].id) {
            oldBlockId = block[0].id
            block[0].$menuItem.parent().siblings().removeClass(menuActiveClass);
            block[0].$menuItem.parent().addClass(menuActiveClass);
        }
    });

})(jQuery, window);