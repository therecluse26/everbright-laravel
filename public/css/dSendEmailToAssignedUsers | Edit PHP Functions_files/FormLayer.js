/*
 * Popup layer that contains a form, i.e. the elements of this popup can
 * be submitted.
 */
var FormLayer = Class.create(Layer, {

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
        this.parameter = null;
        this.params = null;
        this.importElements = null;
        this.parameters = null;
        this.initialAction = null;
        this.completeCallback = null;

        $super('formLayer', showTransparentOnShow, hideTransparentOnHide);

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

    hideAbortButton: function() {
        this.showAbortButton = false;
    },

    hideConfirmButton: function() {
        this.showConfirmButton = false;
    },

    setImportElements: function(importElements) {
        this.importElements = importElements;
    },

    setParameters: function(parameters) {
        this.parameters = parameters;
    },

    setCommand: function(command) {
        this.command = command;
    },

    setFormName: function(formName) {
        this.formName = formName;
    },

    setInitialAction: function(action) {
        this.initialAction = action;
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

    setCompleteCallback: function(func) {
        this.completeCallback = func;
    },

    confirmClickHandler: function(event) {
        if (this.confirmButtonListener != null) {
            this.confirmButtonListener();
        }
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

    closeClickHandler: function(/*event*/) {
        var form = $('form_' + this.formName);

        if (this.cBel != null) {
            $(this.layerId + 'ConfirmButton').stopObserving('click', this.cBel);
        }
        if (this.aBel != null) {
            $(this.layerId + 'AbortButton').stopObserving('click', this.aBel);
        }
        if (this.closeBel != null) {
            $(this.layerId + 'CloseLayerButton').stopObserving('click', this.closeBel);
        }
        if (form != null) {
            form.action.value = this.initialAction;
            form.submit();
        } else {
            this.hideOnAbort();
            if (this.onClose != null) {
                this.onClose();
            }
        }
    },

    show: function($super) {

        // style of the formLayer container
        this.styles = {
            width: this.width + 'px',
            height: this.height + 'px',
            display: 'none'
        };

        // create formLayerContainer
        this.container = new Element('div', { id: this.layerId });
        document.body.appendChild(this.container);
        this.container.setStyle(this.styles);
        this.container.addClassName('jr-prototype-layer');

        // position for action buttons
        var left = (this.width / 2) - 140;
        var top = (this.height) - 30;

        // content of formLayer without actual text content
        var updateContent = '' + // Heading
            '<div id="' + this.layerId + 'Heading" class="jr-prototype-layer-heading"></div>' +
            '<div class="jr-prototype-layer-heading-close">' + '<a id="' + this.layerId +
            'CloseLayerButton" href="#" title="' + $JR_JS_CONSTANTS.CONST_CLOSE + '" >' + $JR_JS_CONSTANTS.CONST_CLOSE +
            '</a>' + '</div>' + // Content
            '<div id="' + this.layerId + 'Text" class="jr-prototype-layer-content" style="height:' +
            (this.height - 100) + 'px;"></div>' + // Action Buttons
            '<div class="jr-prototype-layer-button-group">';

        if (this.showConfirmButton) {
            updateContent += '<button class="jr-btn jr-btn-success" id="' + this.layerId +
                'ConfirmButton" type="button" name="confirm" value="confirm">' + this.confirmText + '</button> ';
        } else {
            updateContent += '<button class="jr-btn jr-btn-success" id="' + this.layerId +
                'ConfirmButton" type="button" name="confirm" value="confirm" style="display:none">' + this.confirmText +
                '</button> ';
        }
        if (this.showAbortButton) {
            updateContent += '<button class="jr-btn" id="' + this.layerId +
                'AbortButton" type="button" name="abort" value="abort">' + this.abortText + '</button>';
        } else {
            updateContent += '<button class="jr-btn" id="' + this.layerId +
                'AbortButton" type="button" name="abort" value="abort" style="display:none">' + this.abortText +
                '</button>';
        }

        updateContent += '</div>';

        // update container with content
        this.container.update(updateContent);

        // ESC key closes popup
        document.observe('keypress', this.hideByEscKey.bindAsEventListener(this));

        // set heading
        $(this.layerId + 'Heading').update(this.heading);

        // command is the action from the dialog, e.g. export, import, exportToTest
        if (this.command != null && this.command != '') {

            var elements = [];
            var j = 0;

            // import elements (checkboxes) from the JobRouter view into the popup layer
            for (var i = 0; i < document.getElementsByName(this.importElements).length; i++) {
                if (document.getElementsByName(this.importElements)[i].checked) {
                    elements[j] = document.getElementsByName(this.importElements)[i].value;
                    ++j;
                }
            }

            // set popup parameters
            this.params = {};
            this.params.ajax = true;
            this.params.formName = this.formName;
            this.params["elements[]"] = elements;
            this.params["params[]"] = this.parameters;
            this.params.module = this.module;
            this.params.modcmd = this.modcmd;

            var self = this;

            var ajaxCommand = '';
            if (this.module != '' && this.module != null) {
                ajaxCommand = this.command + '&module=' + this.module + '&modcmd=popup_' + this.modcmd;
            } else {
                ajaxCommand = 'popup_' + this.command;
            }

            var layerIdElement = this.layerId + 'Text';

            // update content of popup via ajax
            new Ajax.Updater(this.layerId + 'Text', 'index.php?cmd=' + ajaxCommand, {

                parameters: this.params,
                asynchronous: true,
                evalScripts: true,

                onCreate: function() {
                    $('formLayer').hide();
                    (new LoadingLayer('', true, false)).show();
                },
                onSuccess: function(/*transport*/) {
                    $super();
                    $('formLayer').show();
                    (new LoadingLayer(null, false, false)).hide();
                },
                onComplete: function(/*transport*/) {
                    if (self.completeCallback) {
                        self.completeCallback();
                    }
                },
                onFailure: function(transport) {
                    $(layerIdElement).
                        update($JR_JS_CONSTANTS.CONST_ERROR + ': ' + transport.status + ' ' + transport.statusText);
                    $super();
                    $('formLayerConfirmButton').hide();
                    $('formLayer').show();
                    (new LoadingLayer(null, false, false)).hide();
                }
            });
        } else {
            $(this.layerId + 'Text').update(this.content);
            $super();
            $('formLayer').show();
            (new LoadingLayer(null, false, false)).hide();
        }

        // start observing action buttons
        this.cBel = this.confirmClickHandler.bindAsEventListener(this);
        this.aBel = this.abortClickHandler.bindAsEventListener(this);
        this.closeBel = this.closeClickHandler.bindAsEventListener(this);
        $(this.layerId + 'ConfirmButton').observe('click', this.cBel);
        $(this.layerId + 'AbortButton').observe('click', this.aBel);
        $(this.layerId + 'CloseLayerButton').observe('click', this.closeBel);

        // show formLayer
        if (this.showTransparentOnShow) {
            $JR.LAYERS.getTransparencyLayer().show();
        }
    },

    hide: function($super) {
        $super();
    },

    remove: function() {
        var formLayer = $(this.layerId);
        if (formLayer) {
            formLayer.remove();
        }
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
