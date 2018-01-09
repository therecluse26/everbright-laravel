/*global Effect */
/*
 * Really easy field validation with Prototype
 * http://tetlaw.id.au/view/javascript/really-easy-field-validation
 * Andrew Tetlaw
 * Version 1.5.4.1 (2007-01-05)
 * 
 * Copyright (c) 2007 Andrew Tetlaw
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
var Validator = Class.create();

Validator.prototype = {
    initialize: function (className, error, test, options) {
        if (typeof test == 'function') {
            this.options = $H(options);
            this._test = test;
        } else {
            this.options = $H(test);
            this._test = function () {
                return true;
            };
        }
        this.error = error || $JR_JS_CONSTANTS.CONST_VALIDATION_FAILED;
        this.className = className;
        validationMessages = [];
    },
    test: function (v, elm) {
        return (this._test(v, elm) && this.options.all(
            function (p) {

                return Validator.methods[ p.key ] ? Validator.methods[ p.key ](v, elm, p.value) : true;
            }
        ));
    }
};

Validator.methods = {
    pattern: function (v, elm, opt) {
        return Validation.get('IsEmpty').test(v) || opt.test(v);
    },
    minLength: function (v, elm, opt) {
        return v.length >= opt;
    },
    maxLength: function (v, elm, opt) {
        return v.length <= opt;
    },
    min: function (v, elm, opt) {
        return v >= parseFloat(opt);
    },
    max: function (v, elm, opt) {
        return v <= parseFloat(opt);
    },
    notOneOf: function (v, elm, opt) {
        return $A(opt).all(
            function (value) {
                return v != value;
            }
        );
    },
    oneOf: function (v, elm, opt) {
        return $A(opt).any(
            function (value) {
                return v == value;
            }
        );
    },
    is: function (v, elm, opt) {
        return v == opt;
    },
    isNot: function (v, elm, opt) {
        return v != opt;
    },
    equalToField: function (v, elm, opt) {
        return v == $F(opt);
    },
    notEqualToField: function (v, elm, opt) {
        return v != $F(opt);
    },
    include: function (v, elm, opt) {
        return $A(opt).all(
            function (value) {
                return Validation.get(value).test(v, elm);
            }
        );
    }
};

var Validation = Class.create();

Validation.prototype = {
    initialize: function (form, options) {
        this.options = Object.extend(
            {
                onSubmit: true,
                onAjaxSubmit: true,
                stopOnFirst: false,
                immediate: false,
                focusOnError: true,
                useTitles: false,
                onFormValidate: function (result, form) {
                },
                onElementValidate: function (result, elm) {
                }
            }, options || {}
        );
        this.form = $(form);
        if (this.options.onSubmit) {
            /* Event.observe(this.form,'submit',this.onSubmit.bind(this),false); */
            Event.observe(this.form, 'form:submit', this.onSubmit.bind(this), false);
            Event.observe(this.form, 'ajax:submit', this.onAjaxSubmit.bind(this), false);
        }
        if (this.options.immediate) {
            var useTitles = this.options.useTitles;
            var callback = this.options.onElementValidate;
            Form.getElements(this.form).each(
                function (input) { // Thanks Mike!
                    Event.observe(
                        input, 'blur', function (ev) {
                            Validation.validate(
                                Event.element(ev), {
                                    useTitle: useTitles,
                                    onElementValidate: callback
                                }
                            );
                        }
                    );
                }
            );
        }
    },
    onSubmit: function (ev) {
        if (!this.validate()) {
            Event.stop(ev);
        } else {
            Event.element(ev).submit();
        }

    },
    onAjaxSubmit: function (ev) {
        if (!this.validate()) {
            Event.stop(ev);
        } else {
            Event.stop(ev);
        }
    },
    backupEventHandlers: function (elm) {
        var event;
        var events = [ 'onblur' ];
        var backup = {};
        for (var i = 0; i < events.length; i++) {
            event = events[ i ];
            if (elm[ event ]) {
                // backup existing event handlers and overwrite it with a dummy
                backup[ event ] = elm[ event ];
                elm[ event ] = function () {
                };
            }
        }
        return backup;
    },
    restoreEventHandlers: function (elm, backup) {
        var key;
        for (key in backup) {
            //noinspection JSUnfilteredForInLoop
            elm[ key ] = backup[ key ];
        }
    },
    validate: function () {
        var result = false;
        var useTitles = this.options.useTitles;
        var callback = this.options.onElementValidate;
        var _this = this;
        if (this.options.stopOnFirst) {
            result = Form.getElements(this.form).all(
                function (elm) {
                    return Validation.validate(
                        elm, {
                            useTitle: useTitles,
                            onElementValidate: callback
                        }
                    );
                }
            );
        } else {
            result = Form.getElements(this.form).collect(
                function (elm) {
                    // onblur event is falsely triggered on validation
                    var eventHandlersBackup = _this.backupEventHandlers(elm);
                    var valid = Validation.validate(
                        elm, {
                            useTitle: useTitles,
                            onElementValidate: callback
                        }
                    );
                    // restore the onblur event after validation is processed
                    _this.restoreEventHandlers(elm, eventHandlersBackup);
                    return valid;
                }
            ).all();
        }
        if (!result && this.options.focusOnError) {
            try {
                Form.getElements(this.form).findAll(
                    function (elm) {
                        return $(elm).hasClassName('validation-failed') && $(elm).visible();
                    }
                ).first().focus();
            } catch (e) {
                // Ignore this exception, which can be thrown if input
                // validation is done for an input field of type "hidden"!
            }
        }

        var returnValue = this.options.onFormValidate(result, this.form);

        if (returnValue == false) {
            return false;
        }

        return result;
    },
    reset: function () {
        Form.getElements(this.form).each(Validation.reset);
    }
};

Object.extend(
    Validation, {
        validate: function (elm, options) {
            options = Object.extend(
                {
                    useTitle: false,
                    onElementValidate: function (result, elm) {
                    }
                }, options || {}
            );
            elm = $(elm);
            var cn = $w(elm.className);
            if (cn.length > 0) {
                return result = cn.all(
                    function (value) {
                        // only test "validator class names" like validate-max-length,
                        // but not tip, sqlList, etc.
                        if (Validation.isRelevant(value)) {
                            var test = Validation.test(value, elm, options.useTitle);
                            options.onElementValidate(test, elm);
                            return test;
                        }
                        return true;

                    }
                );
            } else {
                return true;
            }
        },
        test: function (name, elm, useTitle) {
            var v = Validation.get(name);
            var prop = '__advice' + name.camelize();
            var advice;
            var tmpId;
            var errorMsg = '';
            // Apply some heuristics for getting user-friendly field label...
            var elmId = Validation.getElmID(elm);
            try {
                if (Validation.isVisible(elm, name) && !v.test($F(elm), elm)) {
                    if (!elm[ prop ]) {
                        advice = Validation.getAdvice(name, elm);
                        errorMsg = useTitle ? ((elm && elm.title) ? elm.title : v.error) : v.error;

                        if (advice == null) {
                            advice = '<div class="validation-advice" id="advice-' + name + '-' + Validation.getElmID(elm)
                                + '" style="display:none">' + errorMsg + '</div>';
                            switch (elm.type.toLowerCase()) {
                                case 'checkbox':
                                case 'radio':
                                    var p = elm.parentNode;
                                    if (p) {
                                        new Insertion.Bottom(p, advice);
                                    } else {
                                        new Insertion.After(elm, advice);
                                    }
                                    break;
                                default:
                                    new Insertion.After(elm, advice);
                            }
                            advice = Validation.getAdvice(name, elm);
                        }
                        if (typeof Effect == 'undefined') {
                            /* advice.style.display = 'block'; */
                        } else {
                            /* new Effect.Appear(advice, {duration : 1 }); */
                        }
                    }
                    // RAC / Validierung von Elementen in Dialogen wird gesondert
                    // gehandhabt!
                    if (name != 'validate-min-date' && name != 'validate-max-date' && name != 'validate-date'
                        && name != 'validate-decimal' && name != 'validate-numeric' && name != 'validate-min-value'
                        && name != 'validate-max-value' && name != 'validate-min-length'
                        && name != 'validate-max-length' && name != 'validate-special-chars-required'
                        && name != 'validate-digits-required' && name != 'validate-alphanumerics-required'
                        && name != 'validate-upperlower-required' && name != 'validate-retype-required') {
                        // Get right id for file upload elements
                        if (elmId.endsWith('_uploaded') && $(elm).retrieve('type') == 'file') {
                            elmId = elmId.substr(0, elmId.length - 9);
                        }
                        var elmName = $(elmId + '_label') ? $(elmId + '_label').textContent : '';
                        if (elmName == '' && elmId != '' && $(elmId) != null) {
                            if ($(elmId).up() != undefined && $(elmId).up().up() != undefined) {
                                var row = $(elmId).up().up();

                                if (row.down() !== undefined && row.down().nodeName.toLowerCase() === 'label') {
                                    elmName = row.down().textContent;
                                } else if (row.nodeName.toLowerCase() == 'tr') {
                                    tmpId = elmId;
                                    if (elmId.substr(0, 3) == 'id_') {
                                        tmpId = elmId.substr(3);
                                    }
                                    if (row.id == 'div_' + tmpId) {
                                        elmName = row.down().textContent;
                                    }
                                } else if (row.up() != undefined && row.nodeName.toLowerCase() == 'td') {
                                    row = row.up();
                                    tmpId = elmId;
                                    if (elmId.substr(0, 3) == 'id_') {
                                        tmpId = elmId.substr(3);
                                    }
                                    if (row.id == 'div_' + tmpId) {
                                        elmName = row.down().textContent;
                                    }
                                }
                                if ($(elmId).readAttribute('original_name')) {
                                    elmId = $(elmId).readAttribute('original_name');
                                }

                                // Get label for autocomplete elements
                                if (name == 'validate-autocomplete-valid') {
                                    var headerElement = 'div_' + elmId.substring(8, elmId.lastIndexOf('_')) + '_header';
                                    if (jQuery('#' + headerElement).length > 0) {
                                        elmName = '';
                                    } else {
                                        elmName = $(elmId).up(2).down().innerHTML.strip();
                                    }
                                }
                            }
                        }

                        if (elmName.endsWith(':')) {
                            elmName = elmName.substr(0, elmName.length - 1);
                        }

                        if (elmName == '') {
                            elmName = $JR.UTILITY.getLabelById(elmId);
                        }

                        var elmNameForWidgetTable = this.getNameForWidgetTableElement(elmId);
                        if (elmNameForWidgetTable) {
                            elmName = elmNameForWidgetTable;
                        }

                        if (elmName == '') {
                            elmName = elmId;
                        }

                        if (!errorMsg) {
                            errorMsg = v.error;
                        }
                        addValidationErrorMessage(
                            {
                                identifier: Validation.getElmID(elm),
                                name: elmName,
                                validation: name,
                                message: errorMsg
                            }
                        );
                    }
                    elm[ prop ] = true;
                    elm.removeClassName('validation-passed');
                    elm.addClassName('validation-failed');
                    return false;
                } else {
                    // RAC / Validierung von Elementen in Dialogen wird gesondert
                    // gehandhabt!
                    removeValidationErrorMessage(Validation.getElmID(elm), name);
                    advice = Validation.getAdvice(name, elm);
                    if (advice != null) {
                        advice.hide();
                    }
                    elm[ prop ] = '';
                    elm.removeClassName('validation-failed');
                    elm.addClassName('validation-passed');
                    return true;
                }
            } catch (e) {
                throw (e);
            }
        },

        isVisible: function (elm, className) {
            if (className == 'required' || className == 'one-required' || className == 'validate-selection'
                || $(elm.id).hasClassName('validate-if-visible')) {
                var isHiddenPage;
                while (elm.tagName != 'BODY') {
                    isHiddenPage = $(elm).hasClassName('jr-hidden-dialog-page');
                    if (isHiddenPage) {
                        return false;
                    }
                    if ($(elm).hasClassName('jr-step-dialog-tab-content') && !isHiddenPage) {
                        return true;
                    }

                    if (typeof elm.id == 'string' && elm.id.endsWith('_uploaded') && $(elm).retrieve('type') == 'file') {
                        elm = $(elm.id.substr(0, elm.id.length - 9) + '_showUploadForm');
                    }

                    if (!$(elm).visible()) {
                        return false;
                    }
                    elm = elm.parentNode;
                }
            }
            return true;
        },
        isRelevant: function (className) {

            var blnRelevant = false;
            $H(Validation.methods).each(
                function (item) {
                    if (item[ 0 ] == className) {
                        blnRelevant = true;
                    }
                }
            );

            return blnRelevant;
        },
        getAdvice: function (name, elm) {
            return $('advice-' + name + '-' + Validation.getElmID(elm)) || $('advice-' + Validation.getElmID(elm));
        },
        getElmID: function (elm) {
            return elm.id ? elm.id : elm.name;
        },
        reset: function (elm) {
            elm = $(elm);
            var cn = elm.classNames();
            cn.each(
                function (value) {
                    var prop = '__advice' + value.camelize();
                    if (elm[ prop ]) {
                        var advice = Validation.getAdvice(value, elm);
                        advice.hide();
                        elm[ prop ] = '';
                    }
                    elm.removeClassName('validation-failed');
                    elm.removeClassName('validation-passed');
                }
            );
        },
        add: function (className, error, test, options) {
            var nv = {};
            nv[ className ] = new Validator(className, error, test, options);
            Object.extend(Validation.methods, nv);
        },
        addAllThese: function (validators) {
            var nv = {};
            $A(validators).each(
                function (value) {
                    nv[ value[ 0 ] ] = new Validator(value[ 0 ], value[ 1 ], value[ 2 ], (value.length > 3 ? value[ 3 ] : {}));
                }
            );
            Object.extend(Validation.methods, nv);
        },
        get: function (name) {
            return Validation.methods[ name ] ? Validation.methods[ name ] : Validation.methods[ '_LikeNoIDIEverSaw_' ];
        },
        methods: {
            '_LikeNoIDIEverSaw_': new Validator('_LikeNoIDIEverSaw_', '', {})
        },
        doOnBlur: function (v, elm) {
            var _onblur = elm.retrieve('_onblur');
            if (_onblur != null && _onblur != undefined) {
                _onblur(elm);
            } else {
                if (elm.onblur != null && elm.onblur != undefined) {
                    elm.onblur();
                }
            }
        },
        getNameForWidgetTableElement: function (elementId) {
            var currentElement = jQuery('#' + elementId);
            var tableWidget = currentElement.closest('table');
            if (tableWidget.length < 1) {
                return '';
            }
            var headerElement = null;
            var row = currentElement.closest('tbody').children('[id*="_row_"]').not('[id$="_empty"]')
                .not('[id$="_template"]').index(currentElement.closest('tr'));
            if (row >= 0) {
                var col = currentElement.closest('td').index() + 1;
                headerElement = tableWidget.find('th:nth-child(' + col + ')');
            }
            if (headerElement !== null && headerElement.length == 1) {
                return headerElement.html() + ' (' + $JR_JS_CONSTANTS.CONST_LINE + ' '
                    + (row + 1) + ')';
            }
            return '';
        }
    }
);

Validation.add(
    'IsEmpty', '', function (v) {
        if (jQuery.isArray(v)) {
            return (v.length == 0);
        }
        return ((v == null) || (v.length == 0)) || v.blank(); // /^\s+$/.test(v));
    }
);

Validation.addAllThese(
    [
        [
            'required', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_REQUIRED, function (v) {
            return !Validation.get('IsEmpty').test(v);
        }
        ],
        [
            'one-required', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_ONE_REQUIRED, function (v, elm) {
            var elements = document.getElementsByName(elm.readAttribute('name'));
            return $A(elements).any(
                function (elm) {
                    return elm.checked;
                }
            );
        }
        ],
        [
            'validate-number', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_NUMBER, function (v) {
            return Validation.get('IsEmpty').test(v) || (!isNaN(v) && !/^\s+$/.test(v));
        }
        ],
        [
            'validate-numeric', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_NUMERIC, function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('numeric-error');
        }
        ],
        [
            'validate-decimal', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DECIMAL, function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('decimal-error');
        }
        ],
        [
            'validate-digits', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DIGITS, function (v) {
            return Validation.get('IsEmpty').test(v) || !/[^\d]/.test(v);
        }
        ],
        [
            'validate-digits-without-zero', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DIGITS, function (v) {
            return Validation.get('IsEmpty').test(v) || /^[1-9][0-9]*$/.test(v);
        }
        ],
        [
            'validate-alpha', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_ALPHA, function (v) {
            return Validation.get('IsEmpty').test(v) || /^[a-zA-Z]+$/.test(v);
        }
        ],
        [
            'validate-alphanum', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_ALPHANUM, function (v) {
            return Validation.get('IsEmpty').test(v) || !/\W/.test(v);
        }
        ],
        [
            'validate-date', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DATE, function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('date-format-error');
        }
        ],
        [
            'validate-min-date', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DATE, function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('min-date-error');
        }
        ],
        [
            'validate-max-date', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DATE, function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('max-date-error');
        }
        ],
        [
            'validate-min-value', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('min-value-error');
        }
        ],
        [
            'validate-max-value', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('max-value-error');
        }
        ],
        [
            'validate-min-length', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('min-length-error');
        }
        ],
        [
            'validate-max-length', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('max-length-error');
        }
        ],
        [
            'validate-special-chars-required', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('special-chars-required-error');
        }
        ],
        [
            'validate-digits-required', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('digits-required-error');
        }
        ],
        [
            'validate-alphanumerics-required', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('alphanumerics-required-error');
        }
        ],
        [
            'validate-upperlower-required', '', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('upperlower-required-error');
        }
        ],
        [
            'validate-retype-required', 'retype required', function (v, elm) {
            Validation.doOnBlur(v, elm);
            return !elm.hasClassName('retype-required-error');
        }
        ],
        [
            'validate-email', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_EMAIL, function (v) {
            return Validation.get('IsEmpty').test(v) || /\w+[@][\w\-]+([.]([\w\-]+)){1,3}$/.test(v);
        }
        ],
        [
            'validate-url', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_URL, function (v) {
            return Validation.get('IsEmpty').test(v)
                || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)*)(:(\d+))?\/?/i.test(v);
        }
        ],
        [
            'validate-selection', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_SELECTION, function (v) {
            return !Validation.get('IsEmpty').test(v);
        }
        ],
        [
            'validate-one-required', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_ONE_REQUIRED, function (v, elm) {
            var p = elm.parentNode;
            var options = p.getElementsByTagName('INPUT');
            return $A(options).any(
                function (elm) {
                    return $F(elm);
                }
            );
        }
        ],
        [
            'validate-jr-internal-name', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_INTERNAL_NAME, function (v) {
            return /^[a-zA-Z]\w+$/.test(v);
        }
        ],
        [
            'validate-time', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_TIME, function (v) {
            return Validation.get('IsEmpty').test(v) || /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-9][0-9]/.test(v);
        }
        ],
        [
            'validate-jr-email-account-name',
            new Template(
                $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_FORBIDDEN_CHARS
            )
                .evaluate(
                    {
                        forbiddenChars: '"<>|:*?\\/'
                    }
                )
            , function (v) {
            return /^([^"<>|:*?\\/])*$/.test(v);
        }
        ],
        [
            'validate-time-without-seconds', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_TIME, function (v) {
            return Validation.get('IsEmpty').test(v) || /^([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(v);
        }
        ],
        [
            'validation-selectbox-failed', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_SELECTBOX, function () {
            return false;
        }
        ],
        [
            'validate-autocomplete-valid', $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_AUTOCOMPLETE_VALID, function (v, elm) {
            return !elm.hasClassName('autocomplete-valid-error');

        }
        ]
    ]
);