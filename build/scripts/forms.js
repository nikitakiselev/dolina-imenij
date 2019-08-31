;(function($) {
    /**
     * Default AjaxForm config
     * @type {{autoHelpBlock: boolean}}
     */
    var ajaxFormConfig = {
        autoHelpBlock: true
    };

    /**
     * Default Ajax Form Submited Handler
     * @param response
     */
    var ajaxFormSubmited = function(response) {
        if (response.status === 'success') {
            this.reset();
            sweetAlert("Выполнено", response.message, "success");
        } else {
            sweetAlert("Ошибка...", response.message, "error");
        }
    };

    /**
     * CallmeForm
     * @type {AjaxForm}
     */
    var callmeForm = new AjaxForm('#callme-form', ajaxFormConfig);
    callmeForm.onSubmited = ajaxFormSubmited;

    /**
     * CallbackForm
     * @type {AjaxForm}
     */
    var callbackForm = new AjaxForm('#callback-form', ajaxFormConfig);
    callbackForm.onSubmited = ajaxFormSubmited;

    /**
     * Подбор посёлков
     */
    ;(function() {
        var calculatorForm = new AjaxForm('#calculator-form');

        calculatorForm.onSubmited = function(response) {
            $.fancybox({
                content: response,
                helpers: {
                    overlay: {
                        locked: false
                    }
                }
            });
        };
    })();


    $('[data-type="phone"]').mask("+7 (999) 999-99-99");

})(jQuery);