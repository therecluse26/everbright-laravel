var ConfirmLayer = Class.create(Layer, {

    initialize: function($super, heading, showTransparentOnShow, hideTransparentOnHide, hideTransparentOnAbort) {

        this.heading = (heading == null) ? '' : heading;
        this.content = '';
        this.command = null;
        this.formName = null;
        this.module = null;
        this.modcmd = null;
        this.connection = null;
        this.parameters = {};
        this.confirmButtonListener = null;
        this.abortButtonListener = null;
        this.cBel = null;
        this.aBel = null;
        this.closeBel = null;
        this.hideTransparentOnAbort = (hideTransparentOnAbort == null) ? true : hideTransparentOnAbort;
        this.width = 350;
        this.height = 200;
        this.styles = {
            width: this.width + 'px',
            height: this.height + 'px',
            display: 'none'
        };

        $super('confirmLayer', showTransparentOnShow, hideTransparentOnHide);

        if ($(this.layerId) == null) {
            this.container = new Element('div', { id: this.layerId });
            document.body.appendChild(this.container);
            this.container.setStyle(this.styles);
            this.container.addClassName('jr-prototype-layer');

            this.container.update(
                '' + '<div id="' + this.layerId + 'Heading" class="jr-prototype-layer-heading"></div>' +
                '<div class="jr-prototype-layer-heading-close">' + '<a id="' + this.layerId +
                'CloseLayerButton" href="#" title="' + $JR_JS_CONSTANTS.CONST_CLOSE + '" >' +
                $JR_JS_CONSTANTS.CONST_CLOSE + '</a>' + '</div>' + '<div id="' + this.layerId +
                'Text" class="jr-prototype-layer-content" style="height:100px;"></div>' +
                '<div class="jr-prototype-layer-button-group">' + '<button class="jr-btn jr-btn-alert" id="' +
                this.layerId + 'ConfirmButton" type="button" name="confirm" value="' + $JR_JS_CONSTANTS.CONST_DELETE +
                '">' + $JR_JS_CONSTANTS.CONST_DELETE + '</button> ' + '<button class="jr-btn" id="' + this.layerId +
                'AbortButton" type="button" name="abort" value="' + $JR_JS_CONSTANTS.CONST_CANCEL + '">' +
                $JR_JS_CONSTANTS.CONST_CANCEL + '</button>' + '</div>');

            document.observe('keypress', this.hideByEscKey.bindAsEventListener(this));
        }
    },

    hideTransparentOnAbort: function(bool) {

        hideTransparentOnAbort = bool;
    },

    setHeading: function(heading) {

        this.heading = heading;
    },

    setCommand: function(command) {
        this.command = command;
    },

    setConnection: function(connection) {
        this.connection = connection;
    },

    setParameters: function(parameters) {
        this.parameters = parameters;
    },

    setFormName: function(formName) {
        this.formName = formName;
    },

    setModule: function(module) {
        this.module = module;
    },

    setModCmd: function(modcmd) {
        this.modcmd = modcmd;
    },

    setContent: function(content) {
        this.content = content;
    },

    setConfirmButtonListener: function(func) {
        this.confirmButtonListener = func;
    },

    setAbortButtonListener: function(func) {

        this.abortButtonListener = func;
    },

    confirmClickHandler: function(event) {
        if (this.confirmButtonListener != null) {
            this.confirmButtonListener();
        }
        if (this.cBel != null) {
            $(this.layerId + 'ConfirmButton').stopObserving('click', this.cBel);
        }
        if (this.aBel != null) {
            $(this.layerId + 'AbortButton').stopObserving('click', this.aBel);
        }
        if (this.closeBel != null) {
            $(this.layerId + 'CloseLayerButton').stopObserving('click', this.closeBel);
        }
        this.hide();
    },

    abortClickHandler: function(event) {
        if (this.abortButtonListener != null) {
            this.abortButtonListener();
        }
        if (this.cBel != null) {
            $(this.layerId + 'ConfirmButton').stopObserving('click', this.cBel);
        }
        if (this.aBel != null) {
            $(this.layerId + 'AbortButton').stopObserving('click', this.aBel);
        }
        if (this.closeBel != null) {
            $(this.layerId + 'CloseLayerButton').stopObserving('click', this.closeBel);
        }
        this.hideOnAbort();
    },

    closeClickHandler: function(event) {
        if (this.cBel != null) {
            $(this.layerId + 'ConfirmButton').stopObserving('click', this.cBel);
        }
        if (this.aBel != null) {
            $(this.layerId + 'AbortButton').stopObserving('click', this.aBel);
        }
        if (this.closeBel != null) {
            $(this.layerId + 'CloseLayerButton').stopObserving('click', this.closeBel);
        }
        this.hideOnAbort();
    },

    show: function($super) {

        $(this.layerId + 'Heading').update(this.heading);

        if (this.command != null) {

            var elements = [];
            var j = 0;
            for (var i = 0; i < document.getElementsByName('cb[]').length; i++) {
                if (document.getElementsByName('cb[]')[i].checked) {
                    elements[j] = document.getElementsByName('cb[]')[i].value;
                    ++j;
                }
            }

            this.parameters.formName = this.formName;
            this.parameters["elements[]"] = elements;
            this.parameters.module = this.module;
            this.parameters.modcmd = this.modcmd;
            this.parameters.connection = this.connection;
            this.parameters.jrmode = $JR.JRFORM.getJRMode();

            new Ajax.Updater(this.layerId + 'Text', 'index.php?cmd=popup_' + this.command, {
                onCreate: function() {
                    // Datenübertragungslayer einblenden
                    (new LoadingLayer('', true, false)).show();

                },
                onSuccess: function(transport) {

                    (new LoadingLayer(null, false, false)).hide();
                    layer.setButtons("genericFormLayerFormControls", buttons);

                    layer.show();
                },
                parameters: this.parameters,
                asynchronous: false,
                evalScripts: true
            });
        } else {
            $(this.layerId + 'Text').update(this.content);
        }

        this.cBel = this.confirmClickHandler.bindAsEventListener(this);
        this.aBel = this.abortClickHandler.bindAsEventListener(this);
        this.closeBel = this.closeClickHandler.bindAsEventListener(this);
        $(this.layerId + 'ConfirmButton').observe('click', this.cBel);
        $(this.layerId + 'AbortButton').observe('click', this.aBel);
        $(this.layerId + 'CloseLayerButton').observe('click', this.closeBel);

        if (this.showTransparentOnShow) {
            $JR.LAYERS.getTransparencyLayer().show();
        }

        $super();
    },

    hide: function($super) {

        $super();
    },

    hideOnAbort: function() {

        if ($(this.layerId).visible()) {
            $(this.layerId).hide();
        }

        if (this.hideTransparentOnAbort) {
            $JR.LAYERS.getTransparencyLayer().hide();
        }
    },

    hideByEscKey: function(event) {

        if (event.keyCode == Event.KEY_ESC) {
            this.hideOnAbort();
        }
    }
});
