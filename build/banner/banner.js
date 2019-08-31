;( function($, window, document, undefined) {

    "use strict";

    var pluginName = "banner",
        defaults = {
            delay: 10, // 10 seconds
            repeat: 60 * 12, // 12 hours
            showingTime: 10, // 10 seconds
            cookieName: 'banner-popup'
        };

    function Plugin (element, options) {
        this.element = element;
        this.$banner = $(this.element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            this.makeBanner();
            this.bindEvents();

            if (! this.hasCookie()) {
                this.showDelayed();
                this.setCookie();
            }
        },

        makeBanner: function () {
            this.$back = $('<div/>', {
                class: 'banner-back'
            }).appendTo('body');

            this.$bannerWrapper = $('<div/>', {
                class: 'banner-wrapper'
            }).appendTo(this.$back);

            this.$bannerWrapper.css({
                width: this.$banner.outerWidth(),
                height: this.$banner.outerHeight()
            });

            this.$bannerInner = $('<div/>', {
                class: 'banner-inner'
            }).appendTo(this.$bannerWrapper);

            this.$bannerInner.css({
                position: 'relative',
                width: this.$banner.outerWidth(),
                height: this.$banner.outerHeight()
            });

            this.$bannerClose = $('<div/>', {
                class: 'banner-close',
                text: 'X'
            }).appendTo(this.$bannerInner);

            this.$back.hide();

            $(this.element).appendTo(this.$bannerInner);
        },

        showDelayed: function () {
            setTimeout(function () {
                this.show();

                if (this.settings.showingTime > 0) {
                    this.hideDelayed();
                }
            }.bind(this), this.settings.delay * 1000);
        },

        hideDelayed: function () {
            setTimeout(function () {
                this.close();
            }.bind(this), this.settings.showingTime * 1000);
        },

        show: function () {
            this.$back.fadeIn('fast');
        },

        close: function () {
            this.$back.fadeOut('fast');
        },

        bindEvents: function () {
            var banner = this;

            this.$back.on('click', function (event) {
                if (banner.$back.is(event.target)) {
                    banner.close();
                }
            });

            this.$bannerClose.on('click', function (event) {
                banner.close();
                event.preventDefault();
            });
        },

        hasCookie: function () {
            var matches = document.cookie.match(
                new RegExp(
                    "(?:^|; )" + this.settings.cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                    )
            );

            return matches !== null;
        },

        setCookie: function () {
            var date = new Date(new Date().getTime() + this.settings.repeat * 1000);
            document.cookie = this.settings.cookieName + "=true; path=/; expires=" + date.toUTCString();
        }
    } );

    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                    pluginName, new Plugin( this, options ) );
            }
        } );
    };

} )(jQuery, window, document);