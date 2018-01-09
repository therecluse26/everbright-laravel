var ErrorLayer = Class.create(Layer, {

    initialize: function($super, heading, showTransparentOnShow, hideTransparentOnHide, hideTransparentOnAbort) {

        this.heading = (heading == null) ? '' : heading;
        this.content = '';
        this.command = null;
        this.formName = null;
        this.module = null;
        this.modcmd = null;
        this.errorButtonListener = null;
        this.cBel = null;
        this.aBel = null;
        this.closeBel = null;
        this.hideTransparentOnAbort = (hideTransparentOnAbort == null) ? true : hideTransparentOnAbort;
        this.width = 350;
        this.height = 200;
        this.styles = {
            position: 'absolute',
            width: this.width + 'px',
            height: this.height + 'px',
            display: 'none',
            backgroundColor: '#EEEEEE',
            border: '1px solid #808080',
            zIndex: '500'
        };

        $super('errorLayer', showTransparentOnShow, hideTransparentOnHide);

        if ($(this.layerId) == null) {
            this.container = new Element('div', { id: this.layerId });
            document.body.appendChild(this.container);
            this.container.setStyle(this.styles);

            this.container.update('' + '<div id="' + this.layerId +
                'Heading" style="position:relative; top:0px; left:0px; padding-top:8px; width:100%; height:22px; background-color:#666; font-weight:bold; color:#fff; text-align:center"></div>' +
                '<div style="position:absolute; top:10px; right:10px; width:10px; height:10px"><a id="' + this.layerId +
                'CloseLayerButton" href="#"><img src="./images/icons/small/action_close.png" alt="' +
                $JR_JS_CONSTANTS.CONST_CLOSE + '" border="0"></a></div>' + '<div id="' + this.layerId +
                'Text" style="position:absolute; top:40px; left:10px; width:' + (this.width - 44) +
                'px; height:100px; padding:10px; overflow:auto; border:1px solid #808080; background-color:#fff"></div>' +
                '<div style="position:absolute; text-align:center; top:170px; left:10px; width:280px; height:30px">' +
                '<div style="text-align:center; width:100%; height:30px"><button id="' + this.layerId +
                'ErrorButton" type="button" name="error" value="bestätigen">' + $JR_JS_CONSTANTS.CONST_OK +
                '</button>' + '</div>' + '</div>');

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

    setErrorButtonListener: function(func) {
        this.errorButtonListener = func;
    },

    errorClickHandler: function(event) {
        if (this.errorButtonListener != null) {
            this.errorButtonListener();
        }
        if (this.cBel != null) {
            $(this.layerId + 'ErrorButton').stopObserving('click', this.cBel);
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
            $(this.layerId + 'ErrorButton').stopObserving('click', this.cBel);
        }
        if (this.closeBel != null) {
            $(this.layerId + 'CloseLayerButton').stopObserving('click', this.closeBel);
        }
        this.hideOnAbort();
    },

    closeClickHandler: function(event) {
        if (this.cBel != null) {
            $(this.layerId + 'ErrorButton').stopObserving('click', this.cBel);
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

            new Ajax.Updater(this.layerId + 'Text', 'index.php?cmd=popup_' + this.command, {
                onCreate: function() {
                    // Daten�bertragungslayer einblenden
                    (new LoadingLayer('', true, false)).show();

                },
                onSuccess: function(transport) {

                    (new LoadingLayer(null, false, false)).hide();
                    layer.setButtons("genericFormLayerFormControls", buttons);

                    layer.show();
                },
                parameters: {
                    ajax: true,
                    formName: this.formName,
                    "elements[]": elements,
                    module: this.module,
                    modcmd: this.modcmd
                },
                asynchronous: false,
                evalScripts: true
            });
        } else {
            $(this.layerId + 'Text').update(this.content);
        }

        this.cBel = this.errorClickHandler.bindAsEventListener(this);
        this.closeBel = this.closeClickHandler.bindAsEventListener(this);
        $(this.layerId + 'ErrorButton').observe('click', this.cBel);
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
