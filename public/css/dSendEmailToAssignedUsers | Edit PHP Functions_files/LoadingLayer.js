var LoadingLayer = Class.create(
    Layer, {

        initialize: function ($super, message, showTransparentOnShow, hideTransparentOnHide, showStepContentContainer) {

            this.messageId = 'loadingLayerMessage';
            this.message = (message == null) ? 'Please wait...' : message;
            this.transparencyLayerId = 'transparentLayer';
            this.styles = { display: 'none' };

            $super('loadingLayer', showTransparentOnShow, hideTransparentOnHide);

            this.showStepContentContainer = showStepContentContainer;

            if ($(this.layerId) == null) {
                this.loadingContainer = new Element('div', { id: this.layerId });
                document.body.appendChild(this.loadingContainer);
                this.loadingContainer.setStyle(this.styles);
                this.loadingContainer.addClassName('jr-loading-layer');

                this.loadingContainer.update(
                    '<div class="jr-loading-layer-header">' + $JR_JS_CONSTANTS.CONST_DATA_TRANSFER + '</div>' +
                    '<div id="loadingLayerMessage" class="jr-loading-layer-message"></div>' +
                    '<div class="jr-spinner"></div>'
                );
            }
        },

        setMessage: function (message) {
            this.message = message;
        },

        show: function ($super) {
            $(this.messageId).update(this.message);

            if (this.showTransparentOnShow) {
                $JR.LAYERS.getTransparencyLayer().show();
            }

            if (!$(this.messageId).visible()) {
                $(this.messageId).show();
            }

            $super();
        },

        hide: function ($super) {
            if ($(this.messageId).visible()) {
                $(this.messageId).hide();
            }

            $super();
        }
    }
);
