(function($) {
    $JR.widget.dialog = function(elementId, options) {
        var dialogElement = $('#' + elementId);
        var defaultOptions = {
            autoOpen: false,
            modal: true,
            closeText: $JR_JS_CONSTANTS.CONST_CLOSE
        };

        var createDialogWithDefaultOptions = function() {
            options = $.extend(defaultOptions, options);
            $('<div id="' + elementId + '" class="jr-widget-dialog"></div>').dialog(options);
            dialogElement = $('#' + elementId);

            var resizeAndScrollHandler = function() {
                // do not remove, workaround for event handlers on closed dialogs
                if (!dialogElement.hasClass("ui-dialog-content")) {
                    return;
                }
                dialogElement.dialog('option', 'position', {
                    my: 'center',
                    at: 'center',
                    of: window
                });
            };

            dialogElement.on('dialogopen', function(/*event, ui*/) {
                $(window).on('resize', resizeAndScrollHandler).on('scroll', resizeAndScrollHandler);
            });
            dialogElement.on('dialogclose', function(/*event, ui*/) {
                $(window).off('resize', resizeAndScrollHandler).off('scroll', resizeAndScrollHandler);
            });
            dialogElement.on('dialogdrag', function(/*event, ui*/) {
                $(window).off('resize', resizeAndScrollHandler).off('scroll', resizeAndScrollHandler);
            });
        };

        // public
        var setOptions = function(options) {
            return dialogElement.dialog('option', options);
        };

        var open = function() {
            var openedDialogElement = dialogElement.dialog('open');

            // Do not remove! Fix for IE <= 11:
            // integration with pdf document rendered from browser overlays popup,
            // so a dummy iframe is needed to prevent this (see Bug 6550, 6756).
            var dummyFrame = jQuery("<iframe>").css({
                width: '100%',
                height: '100%'
            });
            dummyFrame.appendTo(jQuery('div.ui-widget-overlay.ui-front'));

            return openedDialogElement;
        };

        var close = function() {
            return dialogElement.dialog('close');
        };

        var destroy = function() {
            return dialogElement.dialog('destroy');
        };

        var setTitle = function(title) {
            return dialogElement.dialog('option', 'title', title);
        };

        var setContent = function(html) {
            return dialogElement.html(html);
        };

        var setBackground = function(background) {
            return dialogElement.css('background', background);
        };

        var center = function() {
            dialogElement.dialog('option', 'position', {
                my: 'center',
                at: 'center',
                of: window
            });
        };

        // public jquery-ui universal wrapper, can be used for most settings
        // (including events)
        var dialog = function() {
            return dialogElement.dialog.apply(dialogElement, arguments);
        };

        // pseudo constructor
        if (dialogElement.length == 0) {
            createDialogWithDefaultOptions();
        }

        if (!dialogElement.hasClass('jr-widget-dialog')) {
            alert('selected element is not a jr-widget-dialog');
            return;
        }

        return {
            show: open,
            hide: close,
            open: open,
            close: close,
            destroy: destroy,
            center: center,
            setTitle: setTitle,
            setContent: setContent,
            setOptions: setOptions,
            setBackground: setBackground,
            dialog: dialog
        };
    };
})(jQuery);