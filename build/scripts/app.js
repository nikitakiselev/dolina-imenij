;(function($) {

    /**
     * =====================================================================================
     * Smooth scroll To Element
     * =====================================================================================
     */
    function scrollTo(element, speed)
    {
        speed = speed || 300;

        $(window).scrollTo(element, 300, {
            offset: {
                top: -150
            }
        });
    }

    /**
     * =====================================================================================
     */

    /**
     * =====================================================================================
     * Menu scroller
     * =====================================================================================
     */
    ;(function() {
        var $menu = $('#main-menu');
        
        $menu.on('click', '.main-menu__link[href^="#"]', function(event) {
            scrollTo($(this).attr('href'));
            event.preventDefault();
        });
    })();

    /**
     * Link scroller
     */
    ;(function() {
        $('#app').on('click', '[data-scrollto]', function(event) {
            scrollTo($(this).data('scrollto'));
            event.preventDefault();
        });
    })();

    /**
     * Scroll to selected village
     */
    $('#app').on('click', '[data-village]', function(event) {
        var $this = $(this),
            $scrollTo = $($this.attr('href'));

        if ($scrollTo.hasClass('active')) {
            scrollTo($this.attr('href'));
        } else {
            $scrollTo.trigger('click');
        }

        event.preventDefault();
    });
    /**
     * =====================================================================================
     */

    /**
     * =====================================================================================
     * Calculator
     * =====================================================================================
     * @author Nikita Kiselev <kiselev2008@gmail.com>
     * =====================================================================================
     */
    var $calculator = $('#calculator');
    $calculator.on('change', '.switcher', function() {
        var $switcher = $(this);

        $switcher
            .closest('.calculator-item')
            .toggleClass('checked', $switcher.prop('checked'));
    });

    $calculator.find('.switcher').each(function(index, element) {
        var $switcher = $(element);

        if ($switcher.prop('checked')) {
            $switcher
                .closest('.calculator-item')
                .addClass('checked');
        }
    });
    /**
     * =====================================================================================
     */

    /**
     * =====================================================================================
     * Village switcher
     * =====================================================================================
     * @author Nikita Kiselev <kiselev2008@gmail.com>
     * =====================================================================================
     */
    ;(function() {
        var $villages = $('#villages'),
            openVillageHeight = 586,
            oldIndex = null;

        $villages.on('click', '.village:not(.active)', function(event) {
            var $village = $(this),
                newIndex = $village.index(),
                selectNextVillage = newIndex > oldIndex,
                scrollPosition = null;

            $village.siblings().animate({'height': '130px'}, 300);

            if (oldIndex !== null && selectNextVillage) {
                var position = $village.position();
                scrollTo(position.top - openVillageHeight);
            } else {
                scrollTo($village);
            }

            // if (newIndex === 0)
            //
            // scrollTo();

            $village.animate({
                height: '566px'
            }, 300, 'swing', function() {
                $village.siblings().removeClass('active');
                $village.addClass('active');
                $.recalculateSrollSpy();
            });

            oldIndex = newIndex;
        });

        $villages.on('click', '.close', function(event) {
            var $village = $(this).closest('.village');

            $village.animate({
                height: '130px'
            }, 300, 'swing', function() {
                $village.removeClass('active');
                $.recalculateSrollSpy();
                oldIndex = null;
            });

            event.preventDefault();
        });
    })();
    /**
     * =====================================================================================
     */

    /**
     * =====================================================================================
     * Yandex maps
     * =====================================================================================
     */
    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 11
            });

        // Выключение масштабирования колесом мыши
        myMap.behaviors.disable(['scrollZoom']);

        var BalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover">' +
            '<div class="popover__close" title="Скрыть">' +
            '<span class="icon icon-popup-close"></span>' +
            '</div>' +
            '$[[options.contentLayout observeSize minWidth=235 maxWidth=335 maxHeight=350]]' +
            '</div>',
            {
                /**
                 * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                 * @function
                 * @name build
                 */
                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.popover', this.getParentElement());
                    this._$element.find('.popover__close')
                        .on('click', $.proxy(this.onCloseClick, this));

                    this.applyElementOffset();
                },

                /**
                 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name applyElementOffset
                 */
                applyElementOffset: function () {
                    this._$element.css({
                        left: 85,
                        top: -(this._$element[0].offsetHeight / 2 + 50)
                    });
                },

                /**
                 * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onCloseClick
                 */
                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                }
            }
        );

        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover__header">$[properties.header]</div>' +
            '<div class="popover__content">$[properties.content]</div>'
        );

        var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            header: 'Наш адрес',
            content: '&laquo;Румянцево&raquo;, подъезд 9, <br>' +
                     'офис 718-а. 142784 <br>' +
                     'г. Москва, поселение Московский, д. Румянцево стр.1, оф.718 А <br>' +
                     '(Киевское ш., 500м от МКАД)'
        }, {
            balloonShadow: false,
            balloonLayout: BalloonLayout,
            balloonContentLayout: BalloonContentLayout,
            iconLayout: 'default#image',
            iconImageHref: 'images/marker.png',
            iconImageSize: [39, 64],
            iconImageOffset: [-16, -64],
            hideIconOnBalloonOpen: false
            // balloonOffset: [90, -192]
        });

        myMap.geoObjects.add(myPlacemark);

        // open balloon by default
        myPlacemark.balloon.open();
    });
    /**
     * =====================================================================================
     */

    /**
     * =====================================================================================
     * Fancybox popup
     * =====================================================================================
     */
    ;(function() {
        $('.fancybox-popup').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            }
        });
    })();

})(jQuery);