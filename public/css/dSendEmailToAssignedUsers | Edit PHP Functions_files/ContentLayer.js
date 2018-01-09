var ContentLayer = Class.create(Layer, {
    initialize: function($super, heading, showTransparentOnShow, hideTransparentOnHide, hideTransparentOnAbort) {
        this.heading = (heading == null) ? '' : heading;
        this.content = '';
        this.command = null;
        this.formName = null;
        this.module = null;
        this.modcmd = null;
        this.confirmButtonListener = null;
        this.abortButtonListener = null;
        this.cBel = null;
        this.aBel = null;
        this.closeBel = null;
        this.hideTransparentOnAbort = (hideTransparentOnAbort == null) ? true : hideTransparentOnAbort;
        this.width = 800;
        this.height = 200;
        this.confirmText = null;
        this.abortText = null;
        this.display = null;
        this.input = null;
        this.showAbortButton = true;
        this.showConfirmButton = true;
        this.onConfirm = null;
        this.onAbort = null;
        this.onClose = null;
        this.params = null;

        $super('contentLayer', showTransparentOnShow, hideTransparentOnHide);
    },

    hideTransparentOnAbort: function(bool) {

        hideTransparentOnAbort = bool;
    },

    setHeading: function(heading) {
        this.heading = heading;
    },

    setWidth: function(width) {
        this.width = width;
    },

    setHeight: function(height) {
        this.height = height;
    },

    setConfirmText: function(confirmText) {
        this.confirmText = confirmText;
    },

    setAbortText: function(abortText) {
        this.abortText = abortText;
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

        if (this.onConfirm != null) {
            this.onConfirm();
        }
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
        if (this.onAbort != null) {
            this.onAbort();
        }
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
        if (this.onClose != null) {
            this.onClose();
        }
    },

    buildForm: function() {
        this.styles = {
            width: this.width + 'px',
            height: this.height + 'px',
            display: 'none',
            zIndex: 600
        };

        this.container = new Element('div', { id: this.layerId });
        document.body.appendChild(this.container);
        this.container.setStyle(this.styles);
        this.container.addClassName('jr-prototype-layer');

        var updateContent = '' + '<div id="' + this.layerId + 'Heading" class="jr-prototype-layer-heading"></div>' +
            '<div class="jr-prototype-layer-heading-close">' + '<a id="' + this.layerId +
            'CloseLayerButton" href="#" title="' + $JR_JS_CONSTANTS.CONST_CLOSE + '" >' + $JR_JS_CONSTANTS.CONST_CLOSE +
            '</a>' + '</div>' + '<div id="' + this.layerId + 'Text" class="jr-prototype-layer-content" style="height:' +
            (this.height - 100) + 'px;"></div>' + '<div class="jr-prototype-layer-button-group">';

        if (this.showConfirmButton) {
            updateContent += '<button class="jr-btn jr-btn-success" id="' + this.layerId +
                'ConfirmButton" type="button" name="confirm" value="confirm">' + this.confirmText + '</button>&nbsp;';
        }

        if (this.showAbortButton) {
            updateContent += '<button class="jr-btn" id="' + this.layerId +
                'AbortButton" type="button" name="abort" value="abort">' + this.abortText + '</button>';
        }

        updateContent += '</div>';
        this.container.update(updateContent);

        document.observe('keypress', this.hideByEscKey.bindAsEventListener(this));
    },

    show: function($super) {
        this.styles = {
            width: this.width + 'px',
            height: this.height + 'px',
            display: 'none',
            zIndex: 600
        };

        this.container = new Element('div', { id: this.layerId });
        document.body.appendChild(this.container);
        this.container.setStyle(this.styles);
        this.container.addClassName('jr-prototype-layer');

        var updateContent = '' + '<div id="' + this.layerId + 'Heading" class="jr-prototype-layer-heading"></div>' +
            '<div class="jr-prototype-layer-heading-close">' + '<a id="' + this.layerId +
            'CloseLayerButton" href="#" title="' + $JR_JS_CONSTANTS.CONST_CLOSE + '" >' + $JR_JS_CONSTANTS.CONST_CLOSE +
            '</a>' + '</div>' + '<div id="' + this.layerId + 'Text" class="jr-prototype-layer-content" style="height:' +
            (this.height - 100) + 'px;"></div>' + '<div class="jr-prototype-layer-button-group">';

        if (this.showConfirmButton) {
            updateContent += '<button class="jr-btn jr-btn-success" id="' + this.layerId +
                'ConfirmButton" type="button" name="confirm" value="confirmation">' + this.confirmText +
                '</button>&nbsp;';
        } else {
            updateContent += '<button class="jr-btn jr-btn-success" id="' + this.layerId +
                'ConfirmButton" type="button" name="confirm" value="confirmation" style="display:none">' +
                this.confirmText + '</button>&nbsp;';
        }
        if (this.showAbortButton) {
            updateContent += '<button class="jr-btn" id="' + this.layerId +
                'AbortButton" type="button" name="abort" value="abbrechen">' + this.abortText + '</button>';
        } else {
            updateContent += '<button class="jr-btn" id="' + this.layerId +
                'AbortButton" type="button" name="abort" value="abbrechen" style="display:none">' + this.abortText +
                '</button>';
        }
        updateContent += '</div>';

        this.container.update(updateContent);

        document.observe('keypress', this.hideByEscKey.bindAsEventListener(this));
        $(this.layerId + 'Heading').update(this.heading);

        if (this.command != null && this.command != '') {

            var elements = [];
            var j = 0;
            for (var i = 0; i < document.getElementsByName('cb[]').length; i++) {
                if (document.getElementsByName('cb[]')[i].checked) {
                    elements[j] = document.getElementsByName('cb[]')[i].value;
                    ++j;
                }
            }

            if (this.params == null) {
                this.params = {};
            }

            this.params.ajax = true;
            this.params.formName = this.formName;
            this.params["elements[]"] = elements;
            this.params.module = this.module;
            this.params.modcmd = this.modcmd;

            var self = this;
            new Ajax.Updater(this.layerId + 'Text', 'index.php?cmd=popup_' + this.command, {
                method: 'GET',
                onCreate: function() {
                    // Datenübertragungslayer einblenden
                    (new LoadingLayer('', true, false)).show();

                },
                onSuccess: function(transport) {

                    (new LoadingLayer(null, false, false)).hide();
                    /* layer.setButtons("genericFormLayerFormControls", buttons);*/
                    /* layer.show(); */

                },
                onComplete: function(transport) {
                    if ($('searchButton')) {
                        $('searchButton').observe('click', function(event) {
                            eval('' + self.command + '(self.params)');
                        });
                    }
                },
                parameters: this.params,
                asynchronous: false,
                evalScripts: true
            });
        } else {
            $(this.layerId + 'Text').update(this.content);
        }

        this.cBel = this.confirmClickHandler.bindAsEventListener(this);
        this.aBel = this.abortClickHandler.bindAsEventListener(this);
        this.closeBel = this.closeClickHandler.bindAsEventListener(this);
        if ($(this.layerId + 'ConfirmButton')) {
            $(this.layerId + 'ConfirmButton').observe('click', this.cBel);
        }
        if ($(this.layerId + 'AbortButton')) {
            $(this.layerId + 'AbortButton').observe('click', this.aBel);
        }
        if ($(this.layerId + 'CloseLayerButton')) {
            $(this.layerId + 'CloseLayerButton').observe('click', this.closeBel);
        }

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
