var GenericFormLayer = Class.create(Layer, {

    initialize: function($super, heading, showTransparentOnShow, hideTransparentOnHide, layerId) {
        this.heading = (heading == null) ? '' : heading;
        this.content = '';
        this.buttons = '';
        this.closeButtonId = '';
        this.styles = {
            width: '700px',
            height: '500px',
            overflow: 'hidden',
            display: 'none'
        };

        if (layerId == null) {
            layerId = 'genericFormLayer';
        }

        $super(layerId, showTransparentOnShow, hideTransparentOnHide);

        if ($(this.layerId) == null) {

            this.genericContainer = new Element('div', { id: this.layerId });

            document.observe('dom:loaded', this.buildForm.bindAsEventListener(this));
            document.observe('GenericFormLayer:update', this.buildForm.bindAsEventListener(this));
            document.observe('GenericFormLayer:close', this.hide.bindAsEventListener(this));
        }
    },

    buildForm: function() {

        if (!this.genericContainer) {
            this.genericContainer = new Element('div', { id: this.layerId });
        }

        $$('body')[0].insert(this.genericContainer);
        this.genericContainer.setStyle(this.styles);
        this.genericContainer.addClassName('jr-prototype-layer');
        this.genericContainer.update('<div id="' + this.layerId + 'Heading" class="jr-prototype-layer-heading"></div>' +
            '<div class="jr-prototype-layer-heading-close">' + '<a id="' + this.layerId +
            'CloseLayerButton" href="#" title="' + $JR_JS_CONSTANTS.CONST_CLOSE + '" >' + $JR_JS_CONSTANTS.CONST_CLOSE +
            '</a>' + '</div>' + '<div id="' + this.layerId + 'Form" class="jr-prototype-layer-content"></div>' +
            '<div id="' + this.layerId +
            'FormControlsLayer" class="jr-prototype-layer-button-group" style="display:none"></div>');
        $(this.layerId + 'CloseLayerButton').observe('click', this.hide.bindAsEventListener(this));
        document.observe('keypress', this.hideByEscKey.bindAsEventListener(this));
    },

    setHeading: function(heading) {

        this.heading = heading;
    },

    getHeading: function() {

        return this.heading;
    },

    setContent: function(content) {

        this.content = content;
    },

    getContent: function() {

        return this.content;
    },

    setButtons: function(buttons, elements) {
        if (elements != null) {

            if ($(buttons) == null) {
                var body = $$('body')[0];
                var formControls = document.createElement("div");
                formControls.setAttribute('id', buttons);

                body.appendChild(formControls);
            }

            $(buttons).innerHTML = '';
            (elements).each(function(button) {
                var buttonElement = document.createElement("button");
                buttonElement.setAttribute('value', button.name);
                buttonElement.addClassName('jr-btn');
                buttonElement.appendChild(document.createTextNode(button.label));

                if (button.onclick != null) {
                    if (Object.isFunction(button.onclick)) {
                        buttonElement.onclick = button.onclick;
                    } else {
                        buttonElement.onclick = function() {
                            eval('' + button.onclick + '()');
                        };
                    }
                }
                $(buttons).appendChild(buttonElement);
            });
        }

        this.buttons = buttons;
    },

    getButtons: function() {

        return this.buttons;
    },

    getContentId: function() {
        return this.layerId + 'Form';
    },

    registerCloseButton: function(buttonId) {
        this.closeButtonId = buttonId;
    },

    show: function($super) {

        $(this.layerId + 'Heading').update(this.heading);
        $(this.layerId + 'Form').update(this.content);

        if ($(this.buttons)) {
            $(this.layerId + 'FormControlsLayer').update($(this.buttons)).show();
        } else {
            $(this.layerId + 'FormControlsLayer').update(this.buttons).show();
        }

        if (this.closeButtonId != null && this.closeButtonId != '') {
            $(this.closeButtonId).observe('click', this.hide.bindAsEventListener(this));
        }

        if (this.showTransparentOnShow) {
            $JR.LAYERS.getTransparencyLayer().show();
        }

        $super();
    },

    hide: function($super) {
        $super();

        if (typeof resizeContent === 'function') {
            resizeContent();
        }
    },

    hideByEscKey: function(event) {

        if (event.keyCode == Event.KEY_ESC) {
            this.hide();
        }
    }
});