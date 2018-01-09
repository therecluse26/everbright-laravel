var JOBROUTER = Class.create({

    EFFECTS: Class.create({

        resizeNavigation: function(size, mode) {
            new Ajax.Request('index.php', {
                method: 'post',
                parameters: {
                    cmd: 'Ajax_ResizeNavigation',
                    size: size,
                    nav_mode: mode
                },
                onCreate: function() {
                },
                onSuccess: function(transport) {
                }
            });

        },
        togglePanel: function(id, imgId, listName) {

            var temp = $(id);
            var tempImage = $(imgId);

            if (temp.readAttribute('collapse') == 'true') {
                temp.writeAttribute('collapse', 'false');
                tempImage.src = 'images/icons/small/action_sort_up.png';
                temp.show();
                if (temp.readAttribute('loading') == 'true') {
                    if ($(id + '_loadingLayer') != null) {
                        $(id + '_loadingLayer').show();
                    }
                }
            } else {
                temp.writeAttribute('collapse', 'true');
                tempImage.src = 'images/icons/small/action_sort_down.png';
                if ($(id + '_loadingLayer') != null) {
                    $(id + '_loadingLayer').hide();
                }
                temp.hide();
            }

            new Ajax.Request('index.php', {
                method: 'post',
                parameters: {
                    cmd: 'Ajax_ToggleNavigationItem',
                    itemId: listName
                },

                onCreate: function() {
                },
                onSuccess: function(transport) {
                }
            });
        }
    }),

    JRFORM: Class.create({

        formName: 'jr_form',
        formMode: 'custom',

        setName: function(formName) {

            this.formName = formName;
        },

        getName: function() {

            return this.formName;
        },

        setJRMode: function(formMode) {

            this.formMode = formMode;
        },

        getJRMode: function() {

            return this.formMode;
        },

        doTableAction: function() {
            var fl, confirmClickHandler;
            switch ($('id_actions').value) {
                case '1':

                    var elements = [];
                    var j = 0;

                    for (var i = 0; i < document.getElementsByName('cb[]').length; i++) {
                        if (document.getElementsByName('cb[]')[i].checked) {
                            elements[j] = document.getElementsByName('cb[]')[i].value;
                            ++j;
                        }
                    }

                    var params = {};

                    params.ajax = true;
                    params.formName = $('formName').value;
                    params['elements[]'] = elements;
                    params.targetCmd = $('cmd').value;

                    $JRSTEP.doAssign = function() {

                        var assignTypes = document.getElementsByName('assign_type');

                        $A(assignTypes).each(function(el) {
                            if (el.checked) {
                                $('process_assign_type').value = el.value;
                            }
                        });

                        $('process_assign_username').value = $('user_assign').value;
                        $('process_assign_jobfunction').value = $('id_assign_jobfunction').value;
                        $('process_assign_text').value = $('jr_assign_notice').value;

                        var formName = $('formName').value;
                        $(formName).select('[name="action"]')[0].value = 'assign_steps';
                        $(formName).submit();

                    };

                    new Ajax.Request('index.php?cmd=Step_Assign', {
                        method: 'get',
                        evalScripts: true,
                        parameters: params,
                        onCreate: function() {
                            (new LoadingLayer('', true, false)).show();
                        },
                        onSuccess: function(transport) {
                            (new LoadingLayer(null, false, false)).hide();
                            var layer = $JR.LAYERS.getGenericFormLayer();
                            layer.setHeading($JR_JS_CONSTANTS.CONST_ASSIGNMENT);
                            layer.setContent(transport.responseText);
                            layer.setButtons('genericFormLayerFormControls');
                            document.fire('GenericFormLayer:update');
                            layer.show();
                        },
                        onComplete: function() {
                            $('user_assign_display').focus();
                        }
                    });

                    break;
                case '2':
                    var cl = $JR.LAYERS.getContentLayer();
                    cl.setHeading($JR_JS_CONSTANTS.CONST_CHANGE_ESCALATION);
                    cl.setWidth('900');
                    cl.setHeight('500');
                    cl.setConfirmText($JR_JS_CONSTANTS.CONST_EXECUTE);
                    cl.setAbortText($JR_JS_CONSTANTS.CONST_ABORT);
                    cl.setCommand('changeEscalation');
                    cl.params = {
                        'targetCmd': $('cmd').value
                    };

                    confirmClickHandler = function(evt) {

                        if (submitPopup != null) {
                            submitPopup();
                        }
                    };

                    cl.setConfirmButtonListener(confirmClickHandler);
                    cl.show();

                    break;
                case '3':
                    $('form_' + this.getName()).select('[name="action"]')[0].value = 'delete';
                    this.checkDelete();
                    break;
                case '4':
                    $('form_' + this.getName()).select('[name="action"]')[0].value = 'reactivate';
                    $('form_' + this.getName()).submit();
                    break;
                case '5':
                    $('form_' + this.getName()).select('[name="action"]')[0].value = 'close';
                    $('form_' + this.getName()).submit();
                    break;
                case '6':
                    $('form_' + this.getName()).select('[name="action"]')[0].value = 'abort';
                    $('form_' + this.getName()).submit();
                    break;
                case '7': // export incident
                    if ($('formLayer') != null) {
                        $('formLayer').remove();
                    }
                    fl = $JR.LAYERS.getFormLayer();
                    fl.setHeading($JR_JS_CONSTANTS.CONST_EXPORT);
                    fl.setFormName('exportIncident');
                    fl.setWidth('600');
                    fl.setHeight('400');
                    fl.setConfirmText($JR_JS_CONSTANTS.CONST_EXPORT);
                    fl.setAbortText($JR_JS_CONSTANTS.CONST_ABORT);
                    fl.setImportElements('cb[]');
                    fl.setCommand('exportIncident');

                    confirmClickHandler = function(evt) {
                        if (submitPopup != null) {
                            submitPopup();
                        } else {
                            $('popupForm_exportIncident').action.value = action;
                            $('popupForm_exportIncident').submit();
                        }
                    };
                    fl.setConfirmButtonListener(confirmClickHandler);
                    fl.show();
                    break;
                case '8': // export incident to sync
                    fl = $JR.LAYERS.getFormLayer();
                    fl.setHeading($JR_JS_CONSTANTS.CONST_EXPORT);
                    fl.setFormName('exportIncidentToSync');
                    fl.setWidth('900');
                    fl.setHeight('500');
                    fl.setImportElements('cb[]');
                    fl.setCommand('exportIncidentToSync');

                    confirmClickHandler = function(evt) {
                        if (submitPopup != null) {
                            submitPopup();
                        } else {
                            $('popupForm_exportIncidentToSync').action.value = action;
                            $('popupForm_exportIncidentToSync').submit();
                        }
                    };
                    fl.setConfirmButtonListener(confirmClickHandler);
                    fl.show();
                    break;
                case '9': // reimport incident from archive
                    if ($('formLayer') != null) {
                        $('formLayer').remove();
                    }
                    fl = $JR.LAYERS.getFormLayer();
                    fl.setHeading($JR_JS_CONSTANTS.CONST_IMPORT);
                    fl.setFormName('importIncidentFromArchive');
                    fl.setWidth('600');
                    fl.setHeight('500');
                    fl.setImportElements('cb[]');
                    fl.setCommand('importIncidentFromArchive');

                    confirmClickHandler = function(evt) {
                        if (submitPopup != null) {
                            submitPopup();
                        } else {
                            $('popupForm_importIncidentFromArchive').action.value = action;
                            $('popupForm_importIncidentFromArchive').submit();
                        }
                    };
                    fl.setConfirmButtonListener(confirmClickHandler);
                    fl.show();
                    break;
                case '10':
                    $('form_' + this.getName()).select('[name="action"]')[0].value = 'release';
                    $('form_' + this.getName()).submit();
                    break;
                case '11':
                    $('form_' + this.getName()).select('[name="action"]')[0].value = 'resend';
                    $('form_' + this.getName()).submit();
                    break;
            }
        },

        doProcessBoxAction: function() {
            $('form_' + this.getName()).select('[name="action"]')[0].value = 'boxaction';
            $('form_' + this.getName()).submit();
        },

        checkDelete: function() {
            if (confirm($JR_JS_CONSTANTS.CONST_ARE_YOU_SURE) == true) {
                $('form_' + this.getName()).submit();
            }
        }
    }),

    DIALOG: Class.create({

        COMMON_METHODS: {

            show: function(id) {
                if (!$(id)) {
                    return;
                }

                if (!$(id).visible()) {
                    $(id).show();
                }
            },

            hide: function(id) {

                if (!$(id)) {
                    return;
                }

                if ($(id).visible()) {
                    $(id).hide();
                }
            }
        },

        ELEMENT: Class.create({

            storedSqlElementsStatuses: [],

            getLabel: function(elementId, radioValue) {
                var id = this.getRadioElementIdIfExists(elementId, radioValue);

                var pageTabId = ('jr-tab-' + id).buildJQueryIdSelector();
                if (jQuery(pageTabId).length) {
                    return jQuery(pageTabId).text();
                }

                var sectionElement = jQuery(elementId.buildJQueryIdSelector());
                if (sectionElement.hasClass('section')) {
                    return sectionElement.find('.jr-section-title').html();
                }

                if (arguments.length == 1 && !$(id).retrieve('label')) {
                    throw 'No "label" attribute found for element ' + elementId + '!';
                }

                var element = this.getLabelElement(id);
                return jQuery(element).html();
            },

            setLabel: function(elementId, text, radioValue) {
                var id = this.getRadioElementIdIfExists(elementId, radioValue);

                if (text == undefined) {
                    text = '';
                }

                var pageTabId = ('jr-tab-' + id).buildJQueryIdSelector();
                if (jQuery(pageTabId).length) {
                    this.setPageLabel(pageTabId, text);
                    this.setPageLabel(('jr-tab-dropdown-' + id).buildJQueryIdSelector(), text);
                    return;
                }

                var element = jQuery(elementId.buildJQueryIdSelector());
                if (element.hasClass('section')) {
                    element.find('.jr-section-title').html(text);
                    return;
                }

                var labelElement = this.getLabelElement(id);
                jQuery(labelElement).html(text);
                id = this.getElementIdForStorage(id);
                $(id).store('label', text);
            },

            getLabelElement: function(elementId) {
                var type = this.getLabelType(elementId);
                switch (type) {
                    case 'radio':

                        if ($(elementId + '_label')) {
                            return $(elementId + '_label');
                        }
                        throw 'Element ' + elementId + ' not found or second parameter is missing.';

                        break;
                    case 'section':
                        var section = $('div_' + elementId).select('legend')[0];
                        if (!section) {
                            section = $('div_' + elementId);
                        }
                        if (!section.select('span')[0]) {
                            throw 'No label found for element ' + elementId + '!';
                        }
                        return section.select('span')[0];
                    case 'subtableview':
                        var rowElement = jQuery(elementId.buildJQueryIdSelector()).closest('tr');
                        return jQuery((rowElement.attr('id').substr(4) + '_label').buildJQueryIdSelector());
                    case 'button':
                    case 'attachment':
                        return jQuery(elementId.buildJQueryIdSelector());
                        break;
                    default:
                        if (type == 'sqllist' && $(elementId).retrieve('listType') === "2") {
                            elementId = 'display_' + elementId;
                        }
                        this.ensureElementHasLabel(elementId);
                        var labelElement = jQuery('label[for="' + elementId + '"]').first();
                        if (labelElement.length) {
                            return labelElement;
                        }
                        return $('div_' + elementId).down(1);
                }
            },

            getLabelType: function(elementId) {
                elementId = this.getElementIdForStorage(elementId);

                if ($(elementId) == null) {
                    throw 'Element ' + elementId + ' not found.';
                }

                var type = $(elementId).retrieve('type');

                if (!type) {
                    // fix for sql-Elements
                    if (!$(elementId).hasClassName('sqlElement') && !$(elementId).hasClassName('subtableView')) {
                        throw 'No "type" attribute found for element ' + elementId + '!';
                    }
                    if ($(elementId).hasClassName('subtableView')) {
                        type = 'subtableview';
                    } else {
                        type = 'textbox';
                    }
                }
                return type.toLowerCase();
            },

            ensureElementHasLabel: function(elementId) {
                if (jQuery((elementId + '_label').buildJQueryIdSelector()).length == 0) {
                    throw 'There is no "label" for element ' + elementId;
                }
            },

            getElementIdForStorage: function(id) {
                var fileId = id + '_uploaded';
                if ($(fileId) != null && $(fileId).retrieve('type') == 'file') {
                    return fileId;
                }
                var autocompleteId = 'display_' + id;
                if ($(autocompleteId) != null &&
                    jQuery(autocompleteId.buildJQueryIdSelector()).hasClass('stv_autocomplete')) {
                    return autocompleteId;
                }

                return id;
            },

            getLabel2: function(elementId, radioValue) {

                var id = this.getRadioElementIdIfExists(elementId, radioValue);
                var elementNode = $(id);
                var labelNode = $(id + '_label2');

                if (elementNode == null) {
                    throw 'Element ' + id + ' not found.';
                }

                if (elementNode.retrieve('type') && elementNode.retrieve('type').toLowerCase() == 'radio' &&
                    !radioValue && labelNode == null) {
                    throw 'Please use the second parameter to specify the member of the radio group.';
                }

                if (labelNode == null) {
                    throw 'Element ' + id + ' does not support a 2nd label.';
                }

                if (elementNode.retrieve('label2') != undefined && elementNode.retrieve('label2') != null) {
                    return labelNode.innerHTML;
                } else {
                    if (elementNode.hasClassName('sqlCheckbox') || elementNode.hasClassName('sqlList') ||
                        elementNode.hasClassName('sqlTextbox')) {
                        return labelNode.innerHTML;
                    } else {
                        throw 'Element ' + id + ' does not support a 2nd label.';
                    }
                }
            },

            setLabel2: function(elementId, text, radioValue) {

                var id = this.getRadioElementIdIfExists(elementId, radioValue);
                var elementNode = $(id);
                var labelNode = $(id + '_label2');

                if (elementNode == null) {
                    throw 'Element ' + id + ' not found.';
                }

                if (labelNode == null) {
                    throw 'Element ' + id + ' does not support a 2nd label.';
                }

                if (text == undefined) {
                    text = '';
                }

                if (elementNode.retrieve('label2') != undefined && elementNode.retrieve('label2') != null) {
                    elementNode.store('label2', text);
                    labelNode.innerHTML = text;
                } else {
                    // fix for sql-Elements
                    if (elementNode.hasClassName('sqlCheckbox') || elementNode.hasClassName('sqlList') ||
                        elementNode.hasClassName('sqlTextbox')) {
                        labelNode.innerHTML = text;
                    } else {
                        throw 'Element ' + id + ' does not support a 2nd label.';
                    }
                }
            },

            getRadioElementIdIfExists: function(id, radioValue) {
                if (radioValue) {
                    var radioId = id + '_' + normalizeDomId(radioValue);
                    if ($(radioId) != null) {
                        if ($(radioId).retrieve('type').toLowerCase() == 'radio') {
                            return radioId;
                        }
                    }
                }
                return id;
            },

            setPageLabel: function(id, text) {
                jQuery(id).html(text);
                jQuery(document).trigger('jr-rearrange-dialog-pages');
            },

            show: function(id) {
                if (!$('div_' + id)) {
                    return;
                }

                if (!Object.isUndefined($(id).retrieve('type')) && $(id).retrieve('type').toLowerCase() == 'hidden') {
                    return;
                }

                if (!$('div_' + id).visible()) {
                    $('div_' + id).show();
                }
            },

            hide: function(id) {
                if (!$('div_' + id)) {
                    return;
                }

                if ($('div_' + id).visible()) {
                    $('div_' + id).hide();
                }
            },

            visible: function(id) {

                if (!$('div_' + id)) {
                    return;
                }

                return $('div_' + id).visible();
            },

            initialize: function() {

                this.labelSuffix = '_label';
                this.label2Suffix = '_label2';
            },

            storeSqlElementStatuses: function(sqlElementId, sqlElementsStatuses) {
                this.storedSqlElementsStatuses[sqlElementId] = sqlElementsStatuses;
            },

            restoreSqlElementsStatuses: function() {
                for (var sqlElementId in this.storedSqlElementsStatuses) {
                    if (this.storedSqlElementsStatuses.hasOwnProperty(sqlElementId)) {
                        jr_set_disabled(sqlElementId, this.storedSqlElementsStatuses[sqlElementId].disabled);
                        jr_set_readonly(sqlElementId, this.storedSqlElementsStatuses[sqlElementId].readonly);
                        jr_set_required(sqlElementId, this.storedSqlElementsStatuses[sqlElementId].required);
                    }
                }
            },

            restoreSqlElementStatus: function(elementId) {
                if (!this.storedSqlElementsStatuses[elementId]) {
                    return;
                }
                jr_set_disabled(elementId, this.storedSqlElementsStatuses[elementId].disabled);
                jr_set_readonly(elementId, this.storedSqlElementsStatuses[elementId].readonly);
                jr_set_required(elementId, this.storedSqlElementsStatuses[elementId].required);
            },

            clearSqlElementsStatuses: function() {
                this.storedSqlElementsStatuses = [];
            },

            clearSqlElementStatus: function(elementId) {
                if (!this.storedSqlElementsStatuses[elementId]) {
                    return;
                }

                this.storedSqlElementsStatuses.splice(elementId, 1);
            }
        }),

        COLUMN: Class.create({

            show: function(id) {

                id = id + 'Container';

                if (!$(id)) {
                    return;
                }

                if (!$(id).visible()) {

                    $(id).show();
                }
            },

            hide: function(id) {

                id = id + 'Container';

                if (!$(id)) {
                    return;
                }

                if ($(id).visible()) {
                    $(id).hide();
                }
            }
        }),

        ROW: Class.create({

            show: function(id) {

                id = id + 'Container';

                if (!$(id)) {
                    return;
                }

                if (!$(id).visible()) {

                    $(id).show();
                }
            },

            hide: function(id) {

                id = id + 'Container';

                if (!$(id)) {
                    return;
                }

                if ($(id).visible()) {
                    $(id).hide();
                }
            }
        }),

        SECTION: Class.create({

            show: function(id) {
                if (!$('div_' + id)) {
                    return;
                }

                if (!$('div_' + id).visible()) {
                    $('div_' + id).show();
                }
            },

            hide: function(id) {

                if (!$('div_' + id)) {
                    return;
                }

                if ($('div_' + id).visible()) {
                    $('div_' + id).hide();
                }
            },

            minimize: function(id) {
                // Abschnitt minimieren
                var section = $('div_' + id).select('table.rowContainer').first();
                section.addClassName('hidden');
            },

            maximize: function(id) {
                // Abschnitt maximieren
                var section = $('div_' + id).select('table.rowContainer').first();
                section.removeClassName('hidden');
            },

            toggle: function(id) {

                // Abschnitt maximieren
                var section = $('div_' + id).select('table.rowContainer').first();
                section.toggle();
            }
        }),

        SUBTABLE: Class.create({

            initialize: function() {

                this.subtables = $H();
            },

            addSubtable: function(subtableObj) {

                this.subtables.set(subtableObj.getName(), subtableObj);
            },

            getSubtable: function(subtableName) {

                return this.subtables.get(subtableName);
            },

            getSubtables: function() {
                return this.subtables;
            },

            showColumn: function(subtable, columnId) {

                var that = this;

                if (this.subtables.get(subtable) == undefined) {
                    return $JR.NOTIFICATION.show('Subtable not found in dialog!', 'error');
                }

                // angegebene Spalte der Untertabelle
                // einblenden
                if (Object.isArray(columnId)) {
                    columnId.each(function(colId) {
                        that.subtables.get(subtable).showColumn(colId);
                    });
                } else {
                    this.subtables.get(subtable).showColumn(columnId);
                }
            },

            getHiddenColumnIds: function(subtableName) {
                var self = this;
                var subtable = self.subtables.get(subtableName);
                if (!subtable) {
                    return [];
                }

                var result = [];
                subtable.hiddenColumns.each(function(column) {
                    result.push(column.key);
                });

                return result;
            },

            hideColumn: function(subtable, columnId) {

                var that = this;

                if (this.subtables.get(subtable) == undefined) {
                    return $JR.NOTIFICATION.show('Subtable not found in dialog!', 'error');
                }

                // angegebene Spalte der Untertabelle
                // ausblenden
                if (Object.isArray(columnId)) {
                    columnId.each(function(colId) {
                        that.subtables.get(subtable).hideColumn(colId);
                    });
                } else {
                    this.subtables.get(subtable).hideColumn(columnId);
                }

            },

            addRows: function(subtableName, numberOfRows, ignoreMaxRows, finishCallback) {
                if ($(subtableName) == null) {
                    return $JR.NOTIFICATION.show('Subtable not found in dialog!', 'error');
                }

                var subtable = this.subtables.get(subtableName);

                if (ignoreMaxRows) {
                    subtable.ignoreMaxRows = ignoreMaxRows;
                }

                var rowObjects = [];

                if (jQuery.isPlainObject(numberOfRows)) {
                    rowObjects = [numberOfRows];
                    numberOfRows = 1;
                } else if (jQuery.isArray(numberOfRows)) {
                    rowObjects = numberOfRows;
                    numberOfRows = rowObjects.length;
                }

                var callbacks = {
                    afterAddRow: function() {
                        if (rowObjects.length === 0) {
                            return;
                        }
                        var rowObject = rowObjects.shift();
                        jQuery.each(rowObject, function(columnName, value) {
                            jr_set_subtable_value(subtable.getName(), subtable.getMaxRowId(), columnName, value);
                        });
                    }
                };

                if (finishCallback) {
                    callbacks.afterAddRows = finishCallback;
                }

                subtable.addRows(this, {
                    rows: numberOfRows
                }, callbacks);
            },

            deleteRows: function(subtableName, rowId, ignoreMinRows) {

                if ($(subtableName) == null) {
                    return $JR.NOTIFICATION.show('Subtable not found in dialog!', 'error');
                }

                var subtable = this.subtables.get(subtableName);
                subtable.ignoreMinRows = ignoreMinRows;

                subtable.removeRows(this, {
                    rows: rowId
                });
                subtable.ignoreMinRows = false;
            },

            copyRows: function(subtable, rows) {

                if ($(subtable) == null) {
                    return $JR.NOTIFICATION.show('Subtable not found in dialog!', 'error');
                }

                this.subtables.get(subtable).copyRows(this, {
                    rows: rows
                });
            },

            attachNavToColumn: function(subtable, columnId) {

                var subtableRows = $(subtable + "_count")[0].value;
                for (var i = 0; i < subtableRows; ++i) {
                    $(subtable + "_" + columnId + "_" + i).observe("keydown", function(e) {
                        e.memo = {
                            subtableName: subtable,
                            column: columnId,
                            rows: subtableRows
                        };
                        this.focusNextSubtableField(e);
                    });
                }
            },

            focusNextSubtableField: function(event) {

                var subtableName = event.memo.subtable;
                var fieldnamePrefix = event.memo.column;
                var rows = event.memo.rows;
                var currentFieldname = event.element().id;
                var nextFieldname = subtableName + "_" + fieldnamePrefix + "_";

                // Pfeil-nach-oben-Taste gedrückt
                if (event.keyCode == 40) {
                    nextFieldname += (new Number(currentFieldname.substring(currentFieldname.lastIndexOf("_") + 1)) +
                    1);
                    if ($(nextFieldname) != null) {
                        $(nextFieldname).activate();
                    } else {
                        $(subtableName + "_" + fieldnamePrefix + "_" + "0").activate();
                    }
                    event.stop();
                }

                // Pfeil-nach-unten-Taste gedrückt
                if (event.keyCode == 38) {
                    nextFieldname += (new Number(currentFieldname.substring(currentFieldname.lastIndexOf("_") + 1)) -
                    1);
                    if ($(nextFieldname) != null) {
                        $(nextFieldname).activate();
                    } else {
                        $(subtableName + "_" + fieldnamePrefix + "_" + (rows - 1)).activate();
                    }
                    event.stop();
                }
            }
        }),

        SQL: Class.create({

            refresh: function(sqlElementId, customEventName) {

                // SQL-Element per AJAX aktualisieren

                if (customEventName != null) {
                    $(sqlElementId).fire(customEventName);
                }
            }
        }),

        VALIDATION: Class.create({

            trim: function(elementId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {
                    elem.value = elem.value.strip();
                }
            },

            trimToMaxLength: function(elementId, maxLength) {

                var elem = $(elementId);
                var elemValue = elem.value;

                if (elem == null) {
                    return;
                }

                if (elemValue === undefined) {
                    return;
                }

                elemValue = elemValue.replace(/(\r\n|\n|\r)/gm, "\r\n");
                var trimmedValue = this._trimToMaxLength(elemValue, maxLength);
                if (trimmedValue != elemValue) {
                    elem.value = trimmedValue;
                }
            },

            _trimToMaxLength: function(value, maxLength) {
                return value.substr(0, maxLength);
            },

            checkMinLength: function(elementId, minLength, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'min-length');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('min-length-error');
                    } else {
                        if (elem.value.length < minLength) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('min-length-error');
                            var minLengthMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_MIN_LENGTH);
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'min-length',
                                message: minLengthMessageTpl.evaluate({
                                    minLength: minLength
                                })
                            });
                        } else {
                            elem.removeClassName('min-length-error');
                        }
                    }
                }
            },

            checkMaxLength: function(elementId, maxLength, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'max-length');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('max-length-error');
                    } else {
                        if (elem.value.length > maxLength) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('max-length-error');
                            var maxLengthMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_MAX_LENGTH);
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'max-length',
                                message: maxLengthMessageTpl.evaluate({
                                    maxLength: maxLength
                                })
                            });
                        } else {
                            elem.removeClassName('max-length-error');
                        }
                    }
                }
            },

            checkNumeric: function(elementId, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'numeric');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('numeric-error');
                    } else {
                        if (elem.value.search(/^(-[1-9])?[0-9]*$/g) === -1) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('numeric-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'numeric',
                                message: $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_NUMERIC
                            });
                        } else {
                            elem.removeClassName('numeric-error');
                        }
                    }
                }
            },

            checkDecimal: function(elementId, thousandsSeparator, decimalSeparator, precision, subtableViewId) {

                var elem = $(elementId);

                if (elem == null || elem.value === undefined) {
                    return;
                }

                removeValidationErrorMessage(elementId, 'decimal');

                if (elem.value.strip() == '') {
                    elem.removeClassName('decimal-error');
                    return;
                }

                if (!$JR.DIALOG.VALIDATION.checkDecimalSyntax(elem, thousandsSeparator, decimalSeparator, precision)) {
                    var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                    elem.addClassName('decimal-error');
                    var decimalFormatMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DECIMAL_FORMAT);
                    var precisionString = '';
                    for (var i = 0; i < precision; ++i) {
                        precisionString += 'x';
                    }
                    addValidationErrorMessage({
                        identifier: elementId,
                        name: elmName,
                        validation: 'decimal',
                        message: decimalFormatMessageTpl.evaluate({
                            format: 'x' + thousandsSeparator + 'xxx' + decimalSeparator + precisionString
                        })
                    });
                    return;
                }

                if (!$JR.DIALOG.VALIDATION.checkDecimalLength(elem, thousandsSeparator, decimalSeparator, precision)) {
                    var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                    elem.addClassName('decimal-error');

                    addValidationErrorMessage({
                        identifier: elementId,
                        name: elmName,
                        validation: 'decimal',
                        message: $JR_JS_CONSTANTS.CONST_VALIDATION_DECIMAL_LENGTH
                    });
                    return;
                }

                $JR.UTILITY.formatDecimal(elem, thousandsSeparator, decimalSeparator, precision);
                elem.removeClassName('decimal-error');
            },

            checkDecimalSyntax: function(element, thousandsSeparator, decimalSeparator, precision) {
                var regex = new RegExp("^\[\-\]\?\[0-9\]\{1,\}\(\[\\" + thousandsSeparator + "\]\[0-9\]{3}\)*\(\[\\" +
                    decimalSeparator + "\]\[0-9\]\{1," + precision + "\}\)\?\$", "g");
                return element.value.search(regex) !== -1;
            },

            checkDecimalLength: function(element, thousandsSeparator, decimalSeparator) {
                var elementValue = element.value;
                var ts = elementValue.indexOf(thousandsSeparator) === -1 ? '' : thousandsSeparator;
                var unformattedValue = $JR.UTILITY.getUnformattedDecimalAsString(elementValue, ts, decimalSeparator);
                unformattedValue = rtrim(unformattedValue, '0');
                unformattedValue = rtrim(unformattedValue, '.');
                if (unformattedValue.toString().length > 16) {
                    return false;
                }
                return true;
            },
            checkMinValue: function(elementId, minValue, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'min-value');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('min-value-error');
                    } else {
                        var unformattedValue = $JR.UTILITY.getUnformattedDecimal(elem.value, $JRUSER.thousandsSeparator,
                            $JRUSER.decimalSeparator);
                        if (parseFloat(unformattedValue) < minValue) {
                            var elemName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('min-value-error');
                            var minValueMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_MIN_VALUE);
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elemName,
                                validation: 'min-value',
                                message: minValueMessageTpl.evaluate({
                                    minValue: minValue
                                })
                            });
                        } else {
                            elem.removeClassName('min-value-error');
                        }
                    }
                }
            },

            checkMaxValue: function(elementId, maxValue, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'max-value');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('max-value-error');
                    } else {
                        var unformattedValue = $JR.UTILITY.getUnformattedDecimal(elem.value, $JRUSER.thousandsSeparator,
                            $JRUSER.decimalSeparator);
                        if (parseFloat(unformattedValue) > maxValue) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('max-value-error');
                            var maxValueMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_MAX_VALUE);
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'max-value',
                                message: maxValueMessageTpl.evaluate({
                                    maxValue: maxValue
                                })
                            });
                        } else {
                            elem.removeClassName('max-value-error');
                        }
                    }
                }
            },

            checkDate: function(elementId, dateFormat, includeTime, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'date-format');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('date-format-error');
                    } else {
                        var dateFormats;
                        var date;
                        var tmpDate;
                        var tmpTime;
                        var status = true;
                        if (typeof includeTime === 'undefined' || !includeTime) {
                            dateFormats = [
                                'DD.MM.YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'
                            ];
                            tmpDate = elem.value;
                            tmpTime = '';
                        } else {
                            dateFormats = [
                                'DD.MM.YYYY HH:II:SS',
                                'DD/MM/YYYY HH:II:SS',
                                'MM/DD/YYYY HH:II:SS',
                                'YYYY-MM-DD HH:II:SS'
                            ];
                            var timePos = elem.value.indexOf(' ');
                            if (timePos !== -1) {
                                tmpDate = elem.value.substring(0, timePos);
                                tmpTime = elem.value.substr(timePos + 1);
                            } else {
                                tmpDate = elem.value;
                                tmpTime = '';
                            }
                        }
                        try {
                            dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                            switch (dateFormat) {
                                case 1:
                                    date = tmpDate.split(".");
                                    if (date.length != 3) {
                                        status = false;
                                        break;
                                    }
                                    if (date[0].length != 2 || date[1].length != 2 || date[2].length != 4) {
                                        status = false;
                                        break;
                                    }
                                    var myDate = new Date(date[2], date[1] - 1, date[0]);
                                    if (myDate.getFullYear() != date[2]) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getMonth() != date[1] - 1) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getDate() != date[0]) {
                                        status = false;
                                        break;
                                    }
                                    break;
                                case 2:
                                    date = tmpDate.split("/");
                                    if (date.length != 3) {
                                        status = false;
                                        break;
                                    }
                                    if (date[0].length != 2 || date[1].length != 2 || date[2].length != 4) {
                                        status = false;
                                        break;
                                    }
                                    var myDate = new Date(date[2], date[1] - 1, date[0]);
                                    if (myDate.getFullYear() != date[2]) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getMonth() != date[1] - 1) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getDate() != date[0]) {
                                        status = false;
                                        break;
                                    }
                                    break;
                                case 3:
                                    date = tmpDate.split("/");
                                    if (date.length != 3) {
                                        status = false;
                                        break;
                                    }
                                    if (date[0].length != 2 || date[1].length != 2 || date[2].length != 4) {
                                        status = false;
                                        break;
                                    }
                                    var myDate = new Date(date[2], date[0] - 1, date[1]);
                                    if (myDate.getFullYear() != date[2]) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getMonth() != date[0] - 1) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getDate() != date[1]) {
                                        status = false;
                                        break;
                                    }
                                    break;
                                case 4:
                                    date = tmpDate.split("-");
                                    if (date.length != 3) {
                                        status = false;
                                        break;
                                    }
                                    if (date[0].length != 4 || date[1].length != 2 || date[2].length != 2) {
                                        status = false;
                                        break;
                                    }
                                    var myDate = new Date(date[0], date[1] - 1, date[2]);
                                    if (myDate.getFullYear() != date[0]) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getMonth() != date[1] - 1) {
                                        status = false;
                                        break;
                                    }
                                    if (myDate.getDate() != date[2]) {
                                        status = false;
                                        break;
                                    }
                                    break;
                            }
                            if (status && typeof includeTime !== 'undefined' && includeTime) {
                                while (true) {
                                    if (tmpTime.length != 8 || tmpTime.indexOf(':') === -1) {
                                        status = false;
                                        break;
                                    }
                                    var timeParts = tmpTime.split(':');
                                    if (timeParts.length != 3) {
                                        status = false;
                                        break;
                                    }
                                    var timeHours = parseInt(timeParts[0]);
                                    var timeMinutes = parseInt(timeParts[1]);
                                    var timeSeconds = parseInt(timeParts[2]);
                                    if (isNaN(timeHours) || timeHours < 0 || timeHours > 23) {
                                        status = false;
                                        break;
                                    }
                                    if (isNaN(timeMinutes) || timeMinutes < 0 || timeMinutes > 59) {
                                        status = false;
                                        break;
                                    }
                                    if (isNaN(timeSeconds) || timeSeconds < 0 || timeSeconds > 59) {
                                        status = false;
                                        break;
                                    }
                                    break;
                                }
                            }
                            if (!status) {
                                var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                                elem.addClassName('date-format-error');
                                var dateFormatMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DATE_FORMAT);
                                addValidationErrorMessage({
                                    identifier: elementId,
                                    name: elmName,
                                    validation: 'date-format',
                                    message: dateFormatMessageTpl.evaluate({
                                        format: dateFormats[dateFormat - 1]
                                    })
                                });
                            } else {
                                elem.removeClassName('date-format-error');
                            }
                        } catch(e) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('date-format-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'date-format',
                                message: e
                            });
                        }
                    }
                }
            },

            checkDateValue: function(dateValue, dateFormat) {

                if (dateValue == '') {
                    return true;
                }

                var date;
                var status = true;

                try {
                    dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                    switch (dateFormat) {
                        case 1:
                            date = dateValue.split(".");
                            if (date.length != 3) {
                                status = false;
                                break;
                            }
                            if (date[0].length < 1 || date[0].length > 2 || date[1].length < 1 || date[1].length > 2 ||
                                date[2].length < 2 || date[2].length > 4) {
                                status = false;
                                break;
                            }
                            var myDate = new Date(date[2], date[1] - 1, date[0]);
                            if (myDate.getFullYear() != date[2]) {
                                status = false;
                                break;
                            }
                            if (myDate.getMonth() != date[1] - 1) {
                                status = false;
                                break;
                            }
                            if (myDate.getDate() != date[0]) {
                                status = false;
                                break;
                            }
                            break;
                        case 2:
                            date = dateValue.split("/");
                            if (date.length != 3) {
                                status = false;
                                break;
                            }
                            if (date[0].length < 1 || date[0].length > 2 || date[1].length < 1 || date[1].length > 2 ||
                                date[2].length < 2 || date[2].length > 4) {
                                status = false;
                                break;
                            }
                            var myDate = new Date(date[2], date[1] - 1, date[0]);
                            if (myDate.getFullYear() != date[2]) {
                                status = false;
                                break;
                            }
                            if (myDate.getMonth() != date[1] - 1) {
                                status = false;
                                break;
                            }
                            if (myDate.getDate() != date[0]) {
                                status = false;
                                break;
                            }
                            break;
                        case 3:
                            date = dateValue.split("/");
                            if (date.length != 3) {
                                status = false;
                                break;
                            }
                            if (date[0].length < 1 || date[0].length > 2 || date[1].length < 1 || date[1].length > 2 ||
                                date[2].length < 2 || date[2].length > 4) {
                                status = false;
                                break;
                            }
                            var myDate = new Date(date[2], date[0] - 1, date[1]);
                            if (myDate.getFullYear() != date[2]) {
                                status = false;
                                break;
                            }
                            if (myDate.getMonth() != date[0] - 1) {
                                status = false;
                                break;
                            }
                            if (myDate.getDate() != date[1]) {
                                status = false;
                                break;
                            }
                            break;
                        case 4:
                            date = dateValue.split("-");
                            if (date.length != 3) {
                                status = false;
                                break;
                            }
                            if (date[0].length < 2 || date[0].length > 4 || date[1].length < 1 || date[1].length > 2 ||
                                date[2].length < 1 || date[2].length > 2) {
                                status = false;
                                break;
                            }
                            var myDate = new Date(date[0], date[1] - 1, date[2]);
                            if (myDate.getFullYear() != date[0]) {
                                status = false;
                                break;
                            }
                            if (myDate.getMonth() != date[1] - 1) {
                                status = false;
                                break;
                            }
                            if (myDate.getDate() != date[2]) {
                                status = false;
                                break;
                            }
                            break;
                    }

                    return status;

                } catch(e) {
                    return false;
                }
            },

            checkMinDate: function(elementId, minDate, dateFormat, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'min-date');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('min-date-error');
                    } else {
                        try {
                            dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                            var enteredDate = $JR.UTILITY.getUnformattedDate(elem.value, dateFormat).split('-');
                            var checkDate = new Date(enteredDate[0], enteredDate[1] - 1, enteredDate[2]);
                            minDate = $JR.UTILITY.getUnformattedDate(minDate, dateFormat).split('-');
                            var referenceDate = new Date(minDate[0], minDate[1] - 1, minDate[2]);
                            if (checkDate < referenceDate) {
                                var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                                elem.addClassName('min-date-error');
                                var minDateMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_MIN_DATE);
                                addValidationErrorMessage({
                                    identifier: elementId,
                                    name: elmName,
                                    validation: 'min-date',
                                    message: minDateMessageTpl.evaluate({
                                        minDate: $JR.UTILITY.getFormattedDate(minDate.join('-'), dateFormat)
                                    })
                                });
                            } else {
                                elem.removeClassName('min-date-error');
                            }
                        } catch(e) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('min-date-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'min-date',
                                message: e
                            });
                        }
                    }
                } else {
                    elem.removeClassName('min-date-error');
                }
            },

            checkMaxDate: function(elementId, maxDate, dateFormat, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'max-date');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('max-date-error');
                    } else {
                        try {
                            dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                            var enteredDate = $JR.UTILITY.getUnformattedDate(elem.value, dateFormat).split('-');
                            var checkDate = new Date(enteredDate[0], enteredDate[1] - 1, enteredDate[2]);
                            maxDate = $JR.UTILITY.getUnformattedDate(maxDate, dateFormat).split('-');
                            var referenceDate = new Date(maxDate[0], maxDate[1] - 1, maxDate[2]);
                            if (checkDate > referenceDate) {
                                var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                                elem.addClassName('max-date-error');
                                var maxDateMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_MAX_DATE);
                                addValidationErrorMessage({
                                    identifier: elementId,
                                    name: elmName,
                                    validation: 'max-date',
                                    message: maxDateMessageTpl.evaluate({
                                        maxDate: $JR.UTILITY.getFormattedDate(maxDate.join('-'), dateFormat)
                                    })
                                });
                            } else {
                                elem.removeClassName('max-date-error');
                            }
                        } catch(e) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('max-date-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'max-date',
                                message: e
                            });
                        }
                    }
                }
            },

            checkDateFormat: function(elementId, dateFormat, includeTime, subtableViewId) {

                var elem = $(elementId);
                if (elem != null && elem.value !== undefined) {

                    removeValidationErrorMessage(elementId, 'date-format');

                    if (elem.value.strip() == '') {
                        elem.removeClassName('date-format-error');
                    } else {
                        try {
                            dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                            var dateFormatRegExps;
                            var dateFormats;
                            if (typeof includeTime === 'undefined' || !includeTime) {
                                dateFormatRegExps = [
                                    /^\d{2}\.\d{2}\.\d{4}$/g,
                                    /^\d{2}\/\d{2}\/\d{4}$/g,
                                    /^\d{2}\/\d{2}\/\d{4}$/g,
                                    /^\d{4}-\d{2}-\d{2}$/g
                                ];
                                dateFormats = [
                                    'DD.MM.YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'
                                ];
                            } else {
                                dateFormatRegExps = [
                                    /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}$/g,
                                    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/g,
                                    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/g,
                                    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/g
                                ];
                                dateFormats = [
                                    'DD.MM.YYYY HH:II:SS',
                                    'DD/MM/YYYY HH:II:SS',
                                    'MM/DD/YYYY HH:II:SS',
                                    'YYYY-MM-DD HH:II:SS'
                                ];
                            }
                            var dateFormatRegExp = dateFormatRegExps[dateFormat - 1];
                            if (elem.value.search(dateFormatRegExp) === -1) {
                                var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                                elem.addClassName('date-format-error');
                                var dateFormatMessageTpl = new Template($JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DATE_FORMAT);
                                addValidationErrorMessage({
                                    identifier: elementId,
                                    name: elmName,
                                    validation: 'date-format',
                                    message: dateFormatMessageTpl.evaluate({
                                        format: dateFormats[dateFormat - 1]
                                    })
                                });
                            } else {
                                elem.removeClassName('date-format-error');
                            }
                        } catch(e) {
                            var elmName = $JR.UTILITY.getLabelById(elementId, subtableViewId);
                            elem.addClassName('date-format-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'date-format',
                                message: e
                            });
                        }
                    }
                }
            },

            checkSpecialChars: function(elementId) {

                if ($(elementId) != null && $(elementId).value !== undefined) {

                    removeValidationErrorMessage(elementId, 'special-chars-required');

                    if ($(elementId).value.strip() == '') {
                        $(elementId).removeClassName('special-chars-required-error');
                    } else {
                        if ($(elementId).value.
                                search(/[\!\"\§\$\%\&\/\(\)\=\?\*\+\~\'\#\-\_\.\:\,\;\>\<\{\}\[\]\\]{1,}/g) === -1) {
                            var elmName = $JR.UTILITY.getLabelById(elementId);
                            $(elementId).addClassName('special-chars-required-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'special-chars-required',
                                message: $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_SPECIAL_CHARS_REQUIRED
                            });
                        } else {
                            $(elementId).removeClassName('special-chars-required-error');
                        }
                    }
                }
            },

            checkDigits: function(elementId) {

                if ($(elementId) != null && $(elementId).value !== undefined) {

                    removeValidationErrorMessage(elementId, 'digits-required');

                    if ($(elementId).value.strip() == '') {
                        $(elementId).removeClassName('digits-required-error');
                    } else {
                        if ($(elementId).value.search(/[0-9]{1,}/g) === -1) {
                            var elmName = $JR.UTILITY.getLabelById(elementId);
                            $(elementId).addClassName('digits-required-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'digits-required',
                                message: $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_DIGITS_REQUIRED
                            });
                        } else {
                            $(elementId).removeClassName('digits-required-error');
                        }
                    }
                }
            },

            checkAlphanumerics: function(elementId) {

                if ($(elementId) != null && $(elementId).value !== undefined) {

                    removeValidationErrorMessage(elementId, 'alphanumerics-required');

                    if ($(elementId).value.strip() == '') {
                        $(elementId).removeClassName('alphanumerics-required-error');
                    } else {
                        if ($(elementId).value.search(/[a-zA-Z]{1,}/g) === -1) {
                            var elmName = $JR.UTILITY.getLabelById(elementId);
                            $(elementId).addClassName('alphanumerics-required-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'alphanumerics-required',
                                message: $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_ALPHANUMERICS_REQUIRED
                            });
                        } else {
                            $(elementId).removeClassName('alphanumerics-required-error');
                        }
                    }
                }
            },

            checkUpperAndLowerChars: function(elementId) {

                if ($(elementId) != null && $(elementId).value !== undefined) {

                    removeValidationErrorMessage(elementId, 'upperlower-required');

                    if ($(elementId).value.strip() == '') {
                        $(elementId).removeClassName('upperlower-required-error');
                    } else {
                        if ($(elementId).value.search(/.*[a-z]{1,}.*/g) === -1 ||
                            $(elementId).value.search(/.*[A-Z]{1,}.*/g) === -1) {
                            var elmName = $JR.UTILITY.getLabelById(elementId);
                            $(elementId).addClassName('upperlower-required-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'upperlower-required',
                                message: $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_UPPERLOWER_REQUIRED
                            });
                        } else {
                            $(elementId).removeClassName('upperlower-required-error');
                        }
                    }
                }
            },

            compareInputValues: function(elementId, elementId2) {

                if ($(elementId) != null && $(elementId2) != null && $(elementId).value !== undefined &&
                    $(elementId2).value !== undefined) {

                    removeValidationErrorMessage(elementId, 'retype-required');

                    if ($(elementId).value.strip() == '') {
                        $(elementId).removeClassName('retype-required-error');
                    } else {
                        if ($(elementId).value != $(elementId2).value) {
                            var elmName = $JR.UTILITY.getLabelById(elementId);
                            $(elementId).addClassName('retype-required-error');
                            addValidationErrorMessage({
                                identifier: elementId,
                                name: elmName,
                                validation: 'retype-required',
                                message: $JR_JS_CONSTANTS.CONST_VALIDATION_MSG_RETYPE_REQUIRED
                            });
                        } else {
                            $(elementId).removeClassName('retype-required-error');
                        }
                    }
                }
            }
        }),

        CALLBACKS: $H(),

        initialize: function() {

            // this.ELEMENT.addMethods(this.COMMON_METHODS);
            this.ELEMENT = new this.ELEMENT();

            this.COLUMN.addMethods(this.COMMON_METHODS);
            this.COLUMN = new this.COLUMN();

            // this.ROW.addMethods(this.COMMON_METHODS);
            this.ROW = new this.ROW();

            // this.SECTION.addMethods(this.COMMON_METHODS);
            this.SECTION = new this.SECTION();

            this.SUBTABLE.addMethods(this.COMMON_METHODS);
            this.SUBTABLE = new this.SUBTABLE();

            this.SQL = new this.SQL();

            this.VALIDATION = new this.VALIDATION();

            this.CALLBACKS.set('load', $H());
        }, // TODO Facelift noch benötigt?
        initTabActions: function() {

            var tabberContainer = $$('div.tabberlive').first();
            var tabNavigationPanel = $$('ul.tabbernav').first();
            if (tabNavigationPanel === undefined) {
                return;
            }
            var tabItems = tabNavigationPanel.childElements();

            // If only one tab in dialog, hide the tab
            // navigation
            // panel and return from function
            if (tabItems.length == 1) {
                tabNavigationPanel.hide();
                return;
            }

            var tmpTabItems = tabItems;
            tabItems.each(function(elem) {
                elem.observe('click', function(event) {
                    var i = 0;
                    tmpTabItems.each(function(elem) {
                        if (elem.hasClassName('tabberactive')) {
                            if (!$(tabberContainer.select('.tabbertab')[i].hasClassName('lastVisiblePage'))) {
                                $(tabberContainer.select('.tabbertab')[i].getAttribute('id')).fire('page:focus');
                            }
                        } else {
                            if ($(tabberContainer.select('.tabbertab')[i].hasClassName('lastVisiblePage'))) {
                                $(tabberContainer.select('.tabbertab')[i].getAttribute('id')).
                                    removeClassName('lastVisiblePage');
                                $(tabberContainer.select('.tabbertab')[i].getAttribute('id')).fire('page:blur');
                            }
                        }
                        ++i;
                    });
                });
                elem.observe('mousedown', function(event) {
                    var i = 0;
                    tmpTabItems.each(function(elem) {
                        if (elem.hasClassName('tabberactive')) {
                            $(tabberContainer.select('.tabbertab')[i].getAttribute('id')).
                                addClassName('lastVisiblePage');
                            return;
                        }
                        ++i;
                    });
                });
            });
        }
    }),

    POPUP: Class.create({

        properties: null,

        open: function(url, name, properties, mergeProperties) {
            properties = this.applyClientSettingsForDimensions(name, properties, mergeProperties);
            if (bowser.firefox || bowser.msie) {
                var pixelDensity = getPixelDensity();
                properties.width /= pixelDensity;
                properties.height /= pixelDensity;
                properties.left /= pixelDensity;
                properties.top /= pixelDensity;
            }
            this.setProperties(properties);
            var propertiesString = objectImplode(properties);

            _newwin = window.open(url, name, propertiesString);
        },

        getProperties: function() {
            return this.properties;
        },

        setProperties: function(properties) {
            this.properties = properties;
        },

        getDefaultProperties: function() {

            var top = 100;
            var left = 100;
            var width = 800;
            var height = 600;

            var defaultProperties = {
                dependent: 'yes',
                status: 'no',
                location: 'yes',
                toolbar: 'no',
                scrollbars: 'yes',
                resizable: 'yes',
                top: top,
                left: left,
                width: width,
                height: height
            };

            return defaultProperties;
        },

        applyClientSettingsForDimensions: function(name, properties, mergeProperties) {
            if (typeof _newwin != 'object' || _newwin == null || _newwin.closed) {
                defaultProperties = this.getDefaultProperties();
                name = getDefaultValueIfUndefined(name, 'JobRouterPopup');
                properties = getDefaultValueIfUndefined(properties, {});
                properties = this.applyStoredClientSettingsForDimensions(properties, name);

                mergeProperties = getDefaultValueIfUndefined(mergeProperties, true);

                if (mergeProperties) {
                    for (key in defaultProperties) {
                        if (typeof properties[key] != 'undefined') {
                            continue;
                        }
                        properties[key] = defaultProperties[key];
                    }
                }
            } else {
                properties = {};
            }

            return properties;

        },

        applyStoredClientSettingsForDimensions: function(properties, windowName) {
            if (typeof $CLIENT == 'undefined') {
                return properties;
            }

            var windowSettings = $CLIENT.getSetting('windowSettings');
            var screenKey = this.generateScreenKeyForWindow(windowName);

            if (windowSettings && windowSettings[screenKey]) {
                properties.top = windowSettings[screenKey]['dimensions']['top'];
                properties.left = windowSettings[screenKey]['dimensions']['left'];
                properties.width = windowSettings[screenKey]['dimensions']['width'];
                properties.height = windowSettings[screenKey]['dimensions']['height'];
            }
            return properties;

        },

        applyPositionCorrection: function(_newwin, properties) {
            var leftScreenOffset = _newwin.screenX;
            var topScreenOffset = _newwin.screenY;
            var topCorrection = 0;
            var leftCorrection = 0;

            if (topScreenOffset != properties.top) {
                topCorrection = topScreenOffset - properties.top; // 70;
            }
            if (leftScreenOffset != properties.left) {
                leftCorrection = leftScreenOffset - properties.left; // 9;
            }

            _newwin.moveBy(-leftCorrection, -topCorrection);
            _newwin.focus();
        },

        generateScreenKeyForWindow: function(windowName) {
            var screenDimensions = this.getScreenDimensions(window);
            return windowName + '-' + screenDimensions.width + 'x' + screenDimensions.height;
        },

        addPositionStoreEventsForWindow: function(windowObject, windowName) {
            var screenKey = this.generateScreenKeyForWindow(windowName);
            var self = this;

            var positionStoreEventHandler = function(event) {
                var currentDimensions = event.data.callback(windowObject);
                var storedWindowSettings = getDefaultValueIfUndefined($CLIENT.getSetting('windowSettings'), {});
                var storedDimensions;

                if (!storedWindowSettings[screenKey]) {
                    for (var settings in storedWindowSettings) {
                        var keyParts = settings.split(/-|x/);
                        var width = parseInt(keyParts[1], 10);
                        var height = parseInt(keyParts[2], 10);
                        if (isInAcceptableRange(currentDimensions.screenWidth, width)) {
                            currentDimensions.screenWidth = width;
                        }
                        if (isInAcceptableRange(currentDimensions.screenHeight, height)) {
                            currentDimensions.screenHeight = height;
                        }
                        screenKey = keyParts[0] + '-' + currentDimensions.screenWidth + 'x' +
                            currentDimensions.screenHeight;
                    }
                    self.updateWindowSettingsEntryInDatabase(windowObject, windowName, currentDimensions, screenKey);
                    storedWindowSettings = $CLIENT.getSetting('windowSettings');
                }
                storedDimensions = storedWindowSettings[screenKey].dimensions;

                for (var attribute in storedDimensions) {
                    if (currentDimensions[attribute]) {
                        continue;
                    }
                    currentDimensions[attribute] = storedDimensions[attribute];
                }

                if (storedWindowSettings && storedWindowSettings[screenKey] &&
                    JSON.stringify(storedDimensions) == JSON.stringify(currentDimensions)) {
                    return;
                }
                self.updateWindowSettingsEntryInDatabase(windowObject, windowName, currentDimensions, screenKey);
            };

            if (bowser.msedge) {
                // As per the Microsoft release update EDGE:
                // 		"Window objects associated with frames are no longer
                // 		 affected by moveTo, moveBy, resizeTo, or resizeBy"
                // see: https://msdn.microsoft.com/en-us/library/dn467845%28v=vs.85%29.aspx
                //
                // Reported bug at https://connect.microsoft.com/IE/Feedback/Details/1850904

                // Modifying position and size of a new window is currently not possible.
                return;
            }

            jQuery(windowObject).on('resize', null, { callback: this.getWindowDimensions }, positionStoreEventHandler);
            jQuery(windowObject).on('unload', null, { callback: this.getWindowPositions }, positionStoreEventHandler);
        },

        updateWindowSettingsEntryInDatabase: function(windowObject, windowName, dimensions, screenKey) {
            var windowSettings = {};
            windowSettings[screenKey] = {
                'name': windowName,
                'dimensions': dimensions
            };
            $CLIENT.extendSettingsEntry('windowSettings', windowSettings);

            var parameters = {
                'settings': windowSettings[screenKey],
                'settingType': 'windowSettings',
                'settingKey': screenKey
            };
            $JR.POPUP.storeWindowSettings(windowObject, parameters);
        },

        getScreenDimensions: function(windowObject) {
            var pixelDensity = getPixelDensity();
            var width = windowObject.screen.width;
            var height = windowObject.screen.height;

            if (bowser.firefox || bowser.msie) {
                width = Math.round(width * pixelDensity);
                height = Math.round(height * pixelDensity);
            }

            return {
                'width': width,
                'height': height
            };
        },

        getWindowDimensions: function(windowObject) {
            var pixelDensity = getPixelDensity();

            var windowWidth = jQuery(windowObject).width();
            var windowHeight = jQuery(windowObject).height();
            if (bowser.firefox || bowser.msie || bowser.chrome) {
                windowWidth *= pixelDensity;
                windowHeight *= pixelDensity;
            }
            var scrollbarDimensions = $JR.POPUP.measureVisibleScrollbars(windowObject);
            windowWidth = windowWidth + scrollbarDimensions.width;
            windowHeight = windowHeight + scrollbarDimensions.height;
            var screenDimensions = $JR.POPUP.getScreenDimensions(windowObject);

            return {
                'width': windowWidth,
                'height': windowHeight,
                'screenWidth': screenDimensions.width,
                'screenHeight': screenDimensions.height
            };
        },

        getWindowPositions: function(windowObject) {
            var pixelDensity = getPixelDensity();
            var screenDimensions = $JR.POPUP.getScreenDimensions(windowObject);
            var left = windowObject.screenX;
            var top = windowObject.screenY;

            if (bowser.firefox || bowser.msie) {
                left = Math.ceil(left * pixelDensity);
                top = Math.ceil(top * pixelDensity);
            }

            return {
                'screenWidth': screenDimensions.width,
                'screenHeight': screenDimensions.height,
                'left': left,
                'top': top
            };
        },

        storeWindowSettings: function(windowObject, parameters) {

            if (windowObject.name != 'JobViewer') {
                return;
            }

            if (window.storeWindowSettingsTimeout) {
                clearTimeout(window.storeWindowSettingsTimeout);
            }

            window.storeWindowSettingsTimeout = setTimeout(function() {
                parameters.settings = Object.toJSON(parameters.settings);
                jQuery.post("index.php?cmd=Ajax_UpdateUserClientSettings", parameters, function() {
                }, 'json');
            }, 500);
        },

        measureVisibleScrollbars: function(windowObject) {

            var child, parent, wWithout, wWith, hWithout, hWith;

            var dimensions = {
                width: 0,
                height: 0
            };

            if (windowObject.jQuery === undefined) {
                return dimensions;
            }

            // Create a parent div with a fixed size
            parent = windowObject.jQuery('<div>').css({
                width: '150px',
                height: '150px'
            });

            // Create a child div that's 100% of the width
            // (granted
            // that would be the default for a div) and which
            // exceeds
            // the parent's height
            child = windowObject.jQuery('<div>').css({
                width: '100%',
                height: '200px'
            });

            parent.append(child).appendTo(windowObject.document.body);

            // Measure the width without a scrollbar, then again
            // with
            parent.css('overflow', 'hidden');
            wWithout = child[0].offsetWidth;
            parent.css('overflow', 'scroll');
            wWith = child[0].offsetWidth;
            if (wWithout === wWith && 'clientWidth' in parent[0]) {
                wWith = parent[0].clientWidth;
            }

            // Now make the child 100% height, and too wide
            child.css({
                height: '100%',
                width: '200px'
            });

            // Measure without scrollbar, then again with
            parent.css('overflow', 'hidden');
            hWithout = child[0].offsetHeight;
            parent.css('overflow', 'scroll');
            hWith = child[0].offsetHeight;
            if (hWithout === hWith && 'clientHeight' in parent[0]) {
                hWith = parent[0].clientHeight;
            }

            // Done
            parent.remove();

            // IE always show a vertical scrollbar, so we have
            // to return its width
            // even if the window content actually is not higher
            // than the window height.
            if (Prototype.Browser.IE ||
                windowObject.jQuery(windowObject.document).height() > windowObject.jQuery(windowObject).height()) {
                dimensions.width = wWithout - wWith;
            }

            if (windowObject.jQuery(windowObject.document).width() > windowObject.jQuery(windowObject).width()) {
                dimensions.height = hWithout - hWith;
            }

            return dimensions;
        }

    }),

    UTILITY: Class.create({

        getObjectClass: function(obj) {
            if (obj instanceof Object && obj.constructor && obj.constructor.toString()) {
                var arr = obj.constructor.toString().match(/function\s*(\w+)/);
                if (arr && arr.length == 2) {
                    return arr[1];
                }
            }

            return undefined;
        },

        getLabelById: function(elementId, subtableViewId) {

            if (elementId.startsWith('display_')) {
                elementId = elementId.substr(8);
            }

            var elmName = '';
            if (subtableViewId == null || subtableViewId == undefined) {
                elmName = $(elementId + '_label') ? $(elementId + '_label').innerHTML.stripTags() : '';
                if (elmName.endsWith(':')) {
                    elmName = elmName.substr(0, elmName.length - 1);
                }
            }
            if (elmName == '') {
                var tmpId = elementId;
                var pos = elementId.lastIndexOf('_');
                var currentRowId = elementId.substr(pos + 1);

                if (currentRowId == 'uploaded') {
                    var tmpId2 = elementId.substr(0, pos);
                    pos = tmpId2.lastIndexOf('_');
                    currentRowId = tmpId2.substr(pos + 1);
                }

                if (pos != -1) {
                    tmpId = 'div_' + elementId.substr(0, pos) + '_header';
                }
                var headerElm = $(tmpId);
                if (headerElm && headerElm.nodeName.toLowerCase() == 'th') {
                    // var rows =
                    // $(tmpId).up().up().next().childElements().size()
                    // - 1;
                    var currentRow = 0;
                    var tableRows = $(tmpId).up().up().next().childElements();
                    for (var i = 0; i < tableRows.length; ++i) {
                        var tmpPos = tableRows[i].id.lastIndexOf('_');
                        if (tableRows[i].id.substr(tmpPos + 1) == currentRowId) {
                            currentRow = i;
                            break;
                        }
                    }
                    elmName = headerElm.innerHTML.stripTags();
                    if (elmName.endsWith(':')) {
                        elmName = elmName.substr(0, elmName.length - 1);
                    }
                    elmName = elmName + ' (' + $JR_JS_CONSTANTS.CONST_LINE + ' ' + currentRow + ')';
                }
            }
            if (elmName == '') {
                elmName = elementId;
            }

            return elmName;
        },

        checkLength: function(fieldValue, len) {
            var valueToCheck = fieldValue.value;
            valueToCheck = valueToCheck.replace(/(\r\n|\n|\r)/gm, "<br>");
            if (valueToCheck.length > len) {
                alert($JR_JS_CONSTANTS.CONST_ENTRY_TOO_LONG);
                fieldValue.value = fieldValue.value.substr(0, len);
                return false;
            }
            return true;
        },

        showBox: function(box, availableBoxes) {
            availableBoxes.each(function(aBox) {
                $(aBox).hide();
            });
            if ($(box) != null) {
                $(box).show();
            }
        },

        newWinPos: function(url, width, height, top, left, center, windowName, location) {

            if (typeof windowName === 'undefined' || windowName === '') {
                windowName = 'fenster';
            }

            var opt, newWindow;

            if (center == 1) {
                top = (screen.height - height) / 4;
                left = (screen.width - width) / 2;
            } else {
                top = (top < 0) ? 0 : top;
                left = (left < 0) ? 0 : left;
            }

            opt = "dependent=yes,scrollbars=yes,toolbar=no,menubar=no,status=yes,resizable=yes,top=" + top + ",left=" +
                left + ",width=" + width + ",height=" + height + ",focus=yes" + ",location=" + location;
            newWindow = window.open(url, windowName, opt);
            newWindow.resizeTo(width, height);
            newWindow.focus();
        },

        newWin: function(url, width, height) {

            var top, left, opt, newWindow;

            top = (screen.height - height) / 4;
            left = (screen.width - width) / 2;

            opt = "dependent=yes,toolbar=no,menubar=no,status=yes,scrollbars=yes,resizable=yes,top=" + top + ",left=" +
                left + ",width=" + width + ",height=" + height + ",focus=yes";
            newWindow = window.open(url, "fenster", opt);
            if (newWindow) {
                newWindow.focus();
            }

            return newWindow;
        },

        loadCounter: function(types) {
            new Ajax.Request('index.php', {
                method: 'post',
                parameters: {
                    cmd: 'Ajax_Counter',
                    types: types
                },
                onCreate: function() {
                },
                onSuccess: function(transport) {
                    $JR.UTILITY.showCounter(transport.responseText.evalJSON(true));
                    $JR.UTILITY.updateCategoryCounters();
                }
            });
        },

        loadUserCounter: function(username) {

            new Ajax.Request('index.php', {
                method: 'post',
                parameters: {
                    cmd: 'Ajax',
                    cmd_target: 'userCounter',
                    username: username
                },
                onCreate: function() {
                },
                onSuccess: function(transport) {
                    var result = transport.responseText.evalJSON(true);
                    $('user_inbox_count').update(result.count_inbox);
                    $('user_startbox_count').update(result.count_start);
                    $('user_completedbox_count').update(result.count_completed);
                    $('user_substitutebox_count').update(result.count_substitute);
                }
            });
        },

        showCounter: function(elements) {
            elements.each(function(element) {
                if (!element.name) {
                    return;
                }
                var elementId = 'jr-count' + element.name;
                if ($(elementId) != null) {
                    $(elementId).update(element.value);
                    $JR.UTILITY.addCounterClass(jQuery(elementId.buildJQueryIdSelector()).parent().find('a'),
                        element.value);
                }
            });
        },

        addCounterClass: function(element, counter) {
            element.removeClass('counter1 counter2 counter3 counter4 counter5').
                addClass('counter' + counter.toString().length);
        },

        updateCategoryCounters: function() {
            var $mainNavigation = jQuery('#jr-nav-main');

            $mainNavigation.find('.jr-nav-main-indicator').css('display', 'none');
            $mainNavigation.find('[class*="jr-nav-main-label-"].has-count.changed').
                each(function(index, element) {
                    element = jQuery(element);
                    jQuery(element.closest('.jr-nav-main-item')).
                        find('.jr-nav-main-link-level1').
                        find('.jr-nav-main-indicator').css('display', '');
                });

            if (typeof updateCustomCategoryCounters !== 'undefined' &&
                jQuery.isFunction(updateCustomCategoryCounters)) {
                updateCustomCategoryCounters();
            }
        },

        getEffectiveDateFormat: function(dateFormat) {

            dateFormat = parseInt(dateFormat, 10);
            if (isNaN(dateFormat)) {
                throw $JR_JS_CONSTANTS.CONST_INVALID_DATE_FORMAT;
            }

            // If given date format is "user defined", the
            // correct format
            // has to be determined
            if (dateFormat === 5) {
                // At first try to get date format from current
                // user object
                if (typeof $JRUSER === 'object') {
                    dateFormat = parseInt($JRUSER.dateFormat, 10);
                }
                // Current user object does not exist; try to
                // get date format
                // from JobRouter settings object
                else if (typeof $JRSETTINGS === 'object') {
                    dateFormat = parseInt($JRSETTINGS.dateFormat, 10);
                }
                // JobRouter settings object does not exist; use
                // english format
                // as fallback
                else {
                    dateFormat = 4;
                }
            }

            return dateFormat;
        },

        getEffectiveDateFormatPattern: function(dateFormat, includeTime) {

            var dateFormatPatterns = [
                '%d.%m.%Y', '%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%d'
            ];

            try {
                dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
            } catch(e) {
                alert(e);
                return '';
            }

            if (typeof includeTime !== 'undefined' && includeTime) {
                return dateFormatPatterns[dateFormat - 1] + ' %H:%M:%S';
            }

            return dateFormatPatterns[dateFormat - 1];
        },

        getMomentJSFormatPattern: function(dateFormat, includeTime) {
            var effectiveDateFormatPattern = this.getEffectiveDateFormatPattern(dateFormat, includeTime);

            function convertFormat(format) {
                var parts = format.split(' ');
                var datePart = convertDatePart(parts[0]);
                var timePart = convertTimePart(parts[1]);

                return datePart + (timePart ? (' ' + timePart) : '');
            }

            function convertDatePart(format) {
                if (format === '%d.%m.%Y') {
                    return 'DD.MM.YYYY';
                }
                if (format === '%d/%m/%Y') {
                    return 'DD/MM/YYYY';
                }
                if (format === '%m/%d/%Y') {
                    return 'MM/DD/YYYY';
                }
                if (format === '%Y-%m-%d') {
                    return 'YYYY-MM-DD';
                }

                return '';
            }

            function convertTimePart(format) {
                if (format === '%H:%M:%S') {
                    return 'HH:mm:00';
                }

                return '';
            }

            return convertFormat(effectiveDateFormatPattern);
        },

        getCompleteDate: function(elementId, dateFormat, includeTime, timePrefix) {

            var elem = $(elementId);
            if (elem != null && elem.value != '') {
                var dateValue = ('' + elem.value).strip();
                var dateLength = dateValue.length;
                var timeValue = '';
                var timeLength = 0;
                if (typeof includeTime !== 'undefined' && includeTime) {
                    var timePos = dateValue.indexOf(' ');
                    if (timePos !== -1) {
                        dateValue = ('' + elem.value).strip().substring(0, timePos);
                        dateLength = dateValue.length;
                        timeValue = ('' + elem.value).strip().substr(timePos + 1);
                        timeLength = timeValue.length;
                    } else if (typeof timePrefix !== 'undefined') {
                        timeValue = timePrefix;
                        timeLength = timeValue.length;
                    }
                }
                if (dateLength !== 10 && ((dateLength !== 4 && dateLength !== 6 && dateLength !== 8) ||
                    (dateValue.search(/^\d{4}$/g) === -1 && dateValue.search(/^\d{6}$/g) === -1 &&
                    dateValue.search(/^\d{8}$/g) === -1))) {
                    return;
                }
                if (timeLength !== 0 && ((timeLength !== 4 && timeLength !== 6) ||
                    (timeValue.search(/^\d{4}$/g) === -1 && timeValue.search(/^\d{6}$/g) === -1))) {
                    return;
                }
                try {
                    dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                    if (dateLength === 4) {
                        switch (dateFormat) {
                            case 1:
                                dateValue = dateValue.substr(0, 2) + '.' + dateValue.substr(2) + '.' +
                                    (new Date()).getFullYear();
                                break;
                            case 2:
                            case 3:
                                dateValue = dateValue.substr(0, 2) + '/' + dateValue.substr(2) + '/' +
                                    (new Date()).getFullYear();
                                break;
                            case 4:
                                dateValue = (new Date()).getFullYear() + '-' + dateValue.substr(0, 2) + '-' +
                                    dateValue.substr(2);
                                break;
                        }
                    } else if (dateLength === 6) {
                        switch (dateFormat) {
                            case 1:
                                var givenYear = dateValue.substr(4);
                                var centuryPrefix = $JR.UTILITY.calculateCenturyPrefix(givenYear);

                                dateValue = dateValue.substr(0, 2) + '.' + dateValue.substr(2, 2) + '.' +
                                    centuryPrefix + givenYear;
                                break;
                            case 2:
                            case 3:
                                var givenYear = dateValue.substr(4);
                                var centuryPrefix = $JR.UTILITY.calculateCenturyPrefix(givenYear);

                                dateValue = dateValue.substr(0, 2) + '/' + dateValue.substr(2, 2) + '/' +
                                    centuryPrefix + givenYear;
                                break;
                            case 4:
                                var givenYear = dateValue.substr(0, 2);
                                var centuryPrefix = $JR.UTILITY.calculateCenturyPrefix(givenYear);

                                dateValue = centuryPrefix + givenYear + '-' + dateValue.substr(2, 2) + '-' +
                                    dateValue.substr(4);
                                break;
                        }
                    } else if (dateLength === 8) {
                        switch (dateFormat) {
                            case 1:
                                dateValue = dateValue.substr(0, 2) + '.' + dateValue.substr(2, 2) + '.' +
                                    dateValue.substr(4);
                                break;
                            case 2:
                            case 3:
                                dateValue = dateValue.substr(0, 2) + '/' + dateValue.substr(2, 2) + '/' +
                                    dateValue.substr(4);
                                break;
                            case 4:
                                dateValue = dateValue.substr(0, 4) + '-' + dateValue.substr(4, 2) + '-' +
                                    dateValue.substr(6);
                                break;
                        }
                    }
                    if (timeLength > 0) {
                        if (timeLength === 4) {
                            timeValue = ' ' + timeValue.substr(0, 2) + ':' + timeValue.substr(2, 2) + ':00';
                        } else if (timeLength === 6) {
                            timeValue = ' ' + timeValue.substr(0, 2) + ':' + timeValue.substr(2, 2) + ':' +
                                timeValue.substr(4);
                        }
                    } else {
                        if (typeof includeTime !== 'undefined' && includeTime) {
                            var currentDate = new Date();
                            timeValue = ' ' + (currentDate.getHours()).toPaddedString(2) + ':' +
                                (currentDate.getMinutes()).toPaddedString(2) + ':' +
                                (currentDate.getSeconds()).toPaddedString(2);
                        }
                    }
                    elem.value = dateValue + timeValue;
                } catch(e) {
                    // Igonore exception due to invalid
                    // dateFormat and keep element value
                    return;
                }
            }
        },

        calculateCenturyPrefix: function(shortYear) {
            var currentYear = (new Date()).getFullYear().toString();
            var currentYearTwoDigits = parseInt(currentYear.substr(2), 10);
            var yearPrefix = parseInt(currentYear.substr(0, 2), 10);

            if (Math.abs(currentYearTwoDigits - shortYear) > 50) {
                yearPrefix--;
            }

            return yearPrefix;
        },

        getUnformattedDate: function(formattedDate, dateFormat) {

            if (typeof formattedDate === 'function') {
                formattedDate = formattedDate();
            }

            var unformattedDate = '';
            var tmp;

            var timeValue;
            var timePos = formattedDate.indexOf(' ');
            if (timePos !== -1) {
                timeValue = formattedDate.substr(timePos);
                var dateAndTime = formattedDate.split(' ');
                formattedDate = dateAndTime[0];
            } else {
                timeValue = '';
            }

            try {
                dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                switch (dateFormat) {
                    case 1:
                        tmp = formattedDate.split('.');
                        unformattedDate = tmp[2] + '-' + tmp[1] + '-' + tmp[0];
                        break;
                    case 2:
                        tmp = formattedDate.split('/');
                        unformattedDate = tmp[2] + '-' + tmp[1] + '-' + tmp[0];
                        break;
                    case 3:
                        tmp = formattedDate.split('/');
                        unformattedDate = tmp[2] + '-' + tmp[0] + '-' + tmp[1];
                        break;
                    case 4:
                        unformattedDate = formattedDate;
                        break;
                }
            } catch(e) {
                return formattedDate + timeValue;
            }

            return unformattedDate + timeValue;
        },

        getDateInIsoFormat: function(unformattedDate, dateFormat) {

            var unformattedDate = $JR.UTILITY.getUnformattedDate(unformattedDate, dateFormat);

            return unformattedDate.replace(' ', 'T');
        },

        getFormattedDate: function(unformattedDate, dateFormat) {

            if (typeof unformattedDate === 'function') {
                unformattedDate = unformattedDate();
            }

            var formattedDate = '';
            var tmp;
            var timeValue;
            var timePos = unformattedDate.indexOf(' ');
            if (timePos !== -1) {
                tmp = unformattedDate.substring(0, timePos).split('-');
                timeValue = unformattedDate.substr(timePos);
            } else {
                tmp = unformattedDate.split('-');
                timeValue = '';
            }
            try {
                dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
                switch (dateFormat) {
                    case 1:
                        formattedDate = tmp[2] + '.' + tmp[1] + '.' + tmp[0];
                        break;
                    case 2:
                        formattedDate = tmp[2] + '/' + tmp[1] + '/' + tmp[0];
                        break;
                    case 3:
                        formattedDate = tmp[1] + '/' + tmp[2] + '/' + tmp[0];
                        break;
                    case 4:
                        formattedDate = tmp[0] + '-' + tmp[1] + '-' + tmp[2];
                        break;
                }
            } catch(e) {
                return unformattedDate;
            }

            return formattedDate + timeValue;
        },

        getUnformattedDecimalAsString: function(formattedDecimal, thousandsSeparator, decimalSeparator) {

            var thousandsRegExpPart = '';
            var thousandsSeparatorRegex = null;
            if (thousandsSeparator) {
                thousandsRegExpPart = '\\' + thousandsSeparator;
                thousandsSeparatorRegex = new RegExp('\\' + thousandsSeparator, 'g');
            }

            var decimalRegExpPart = '';
            var decimalSeparatorRegex = null;
            if (decimalSeparator) {
                decimalRegExpPart = '\\' + decimalSeparator;
                decimalSeparatorRegex = new RegExp('\\' + decimalSeparator, 'g');
            }

            var decimalRegex = new RegExp('^[\-0-9' + thousandsRegExpPart + decimalRegExpPart + ']*$');

            if (!formattedDecimal.match(decimalRegex)) {
                return NaN;
            }

            if (decimalSeparator && thousandsSeparator) {
                if (formattedDecimal.indexOf(thousandsSeparator) > formattedDecimal.indexOf(decimalSeparator)) {
                    return NaN;
                }
            }

            if (thousandsSeparatorRegex) {
                formattedDecimal = formattedDecimal.replace(thousandsSeparatorRegex, '');
            }
            if (decimalSeparatorRegex) {
                formattedDecimal = formattedDecimal.replace(decimalSeparatorRegex, '.');
            }

            if (isNaN(formattedDecimal - 0)) {
                return NaN;
            }

            return formattedDecimal;

        },

        getUnformattedDecimal: function(formattedDecimal, thousandsSeparator, decimalSeparator) {
            return parseFloat(
                $JR.UTILITY.getUnformattedDecimalAsString(formattedDecimal, thousandsSeparator, decimalSeparator));
        },

        getFormattedDecimal: function(unformattedDecimal, thousandsSeparator, decimalSeparator, precision) {
            var multiplicator = Math.pow(10, precision);
            // Round amount to defined number of decimal spaces
            unformattedDecimal = Math.round(unformattedDecimal * multiplicator) / multiplicator;
            var posDecimalSeparator = unformattedDecimal.toString().lastIndexOf('.');
            var intPart = '';
            var decPart = '';
            if (posDecimalSeparator != -1) {
                unformattedDecimal = unformattedDecimal.toString().replace(/\./, decimalSeparator);
                intPart = unformattedDecimal.substring(0, posDecimalSeparator);
                decPart = unformattedDecimal.substring(intPart.length);
            } else {
                intPart = unformattedDecimal.toString();
                decPart = decimalSeparator;
            }
            var decLength = decPart.length;
            // Fill decimal part with zeros until defined length
            // is reached
            if (decLength < (precision + 1) && precision != 0) {
                decPart = decPart + '0'.times(precision - decLength + 1);
            }

            var pos = intPart.length;
            var minPos = 0;
            if (intPart.startsWith('-')) {
                minPos = 1;
            }
            var result = '';
            while (pos > 0) {
                if (((pos - 3) > 0 && minPos == 0) || ((pos - 3) > 1 && minPos > 0)) {
                    result = thousandsSeparator + intPart.substring(pos - 3, pos) + result;
                } else {
                    result = intPart.substring(pos - 3, pos) + result;
                }
                pos = pos - 3;
            }

            return result + decPart;
        },

        formatDecimal: function(elem, thousandsSeparator, decimalSeparator, precision) {
            var elementValue = elem.value;
            var ts = elementValue.indexOf(thousandsSeparator) === -1 ? '' : thousandsSeparator;
            var unformattedValue = $JR.UTILITY.getUnformattedDecimal(elementValue, ts, decimalSeparator);

            var formattedValue = $JR.UTILITY.getFormattedDecimal(unformattedValue, thousandsSeparator, decimalSeparator,
                precision);

            elem.value = formattedValue;
        },

        base64encode: function(value) {

            var kstring = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            value = this.utf8encode(value);

            while (i < value.length) {

                chr1 = value.charCodeAt(i++);
                chr2 = value.charCodeAt(i++);
                chr3 = value.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + kstring.charAt(enc1) + kstring.charAt(enc2) + kstring.charAt(enc3) +
                    kstring.charAt(enc4);
            }

            return output;
        },

        base64decode: function(value) {

            var kstring = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            value = value.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < value.length) {

                enc1 = kstring.indexOf(value.charAt(i++));
                enc2 = kstring.indexOf(value.charAt(i++));
                enc3 = kstring.indexOf(value.charAt(i++));
                enc4 = kstring.indexOf(value.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }

            return output;
        },

        utf8encode: function(string) {

            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        inArray: function(needle, haystack) {
            for (var i = 0; i < haystack.length; i++) {
                if (haystack[i] == needle) {
                    return true;
                }
            }
            return false;
        },

        shorten: function(text, length) {
            if (text.length > length) {
                text = text.substr(0, length - 3) + '...';
            }
            return text;
        },

        submitForm: function(formName, action, popup, check, module, modcmd, connection, callback, parameters) {

            var start = true;
            if (check == true) {
                start = false;
                $$('table#boxTable td.checkbox').each(function(e) {
                    if (e.firstChild.checked) {
                        start = true;
                    }
                });
            }

            if (!start) {
                return false;
            }

            var connectionValue = '';
            if ((popup != '') || popup) {

                if (connection == 1) {
                    if ($('connection_name') != null) {
                        connectionValue = $('connection_name').value;
                    }
                }

                if (popup == 1) {
                    loadPopup(formName, action, module, modcmd, connectionValue, parameters);
                } else {
                    var options = eval('(' + popup + ')');
                    if (options['name'] == 'formLayer') {
                        loadFormPopup(formName, action, module, modcmd, connectionValue, parameters, options);
                    } else {
                        loadPopup(formName, action, module, modcmd, connectionValue, parameters);
                    }
                }
            } else {
                switch (action) {
                    case 'close':
                        self.close();
                        break;
                    default:
                        $('form_' + formName).action.value = action;
                        if (callback != null && callback != '') {
                            eval('' + callback + '()');
                        } else {
                            if (checkFormErrors('form_' + formName)) {
                                $('form_' + formName).action.value = action;
                                if ($('form_' + formName).parameters) {
                                    $('form_' + formName).parameters.value = Object.toJSON(parameters);
                                }
                                $('form_' + formName).fire('form:submit');
                            }
                        }
                }
            }
        },

        submitFilterForm: function(formName, action, popup, module, modcmd) {

            formName = ('filter_form_' + formName);
            if (popup) {
                loadPopup(formName, action, module, modcmd);
            } else {
                $(formName).filter_action.value = action;
                $(formName).submit();
            }
        },

        loadPopup: function(formName, action, module, modcmd, connectionValue, parameters) {

            var cl = $JR.LAYERS.getConfirmLayer();
            cl.setHeading($JR_JS_CONSTANTS.CONST_PROMPT_FOR_CONFIRMATION);
            cl.setShowTransparent(true);
            cl.setHideTransparent(false);
            cl.setFormName(formName);
            cl.setModule(module);
            cl.setModCmd(modcmd);
            cl.setConnection(connectionValue);
            cl.setParameters(parameters);

            cl.setCommand(action);

            confirmClickHandler = function(evt) {
                $('form_' + formName).action.value = action;
                if ((connectionValue) && ($('form_' + formName).connection)) {
                    $('form_' + formName).connection.value = connectionValue;
                }
                $('form_' + formName).submit();
            };

            cl.setConfirmButtonListener(confirmClickHandler);
            cl.show();
        },

        loadFormPopup: function(formName, action, module, modcmd, connectionValue, parameters, popupInfos) {

            // remove existing formLayer to abort
            // confirmClickHandler
            if ($('formLayer') != null) {
                $('formLayer').remove();
            }

            var fl = $JR.LAYERS.getFormLayer();
            fl.setHeading(popupInfos['heading']);
            fl.setShowTransparent(true);
            fl.setHideTransparent(false);
            fl.setFormName(formName);
            fl.setModule(module);
            fl.setModCmd(popupInfos['cmd']);
            fl.setWidth(popupInfos['width']);
            fl.setHeight(popupInfos['height']);
            fl.setConfirmText(popupInfos['confirmText']);
            fl.setAbortText(popupInfos['abortText']);
            fl.setImportElements(popupInfos['elements']);

            fl.setParameters(parameters);
            fl.setCommand(action);

            confirmClickHandler = function(evt) {

                /*
                 * declare this function in your view otherwise
                 * submit will be called on your form by default
                 */
                if (submitPopup != null) {
                    submitPopup();
                } else {
                    $('popupForm_' + formName).action.value = action;
                    $('popupForm_' + formName).submit();
                }
            };

            fl.setConfirmButtonListener(confirmClickHandler);
            fl.show();
        },

        loadPopupLocal: function(formName, action, content) {

            var cl = $JR.LAYERS.getConfirmLayer();
            cl.setHeading($JR_JS_CONSTANTS.CONST_PROMPT_FOR_CONFIRMATION);
            cl.setShowTransparent(true);
            cl.setHideTransparent(false);

            cl.setFormName(formName);
            cl.setContent(content);

            confirmClickHandler = function(evt) {
                $('form_' + formName).action.value = action;
                $('form_' + formName).submit();
            };

            cl.setConfirmButtonListener(confirmClickHandler);
            cl.show();
        },

        loadContentPopupLocal: function(formName, action, content, args) {

            var cl = $JR.LAYERS.getContentLayer();
            if (args.width != null) {
                cl.width = args.width;
            } else {
                cl.width = 700;
            }
            if (args.height != null) {
                cl.height = args.height;
            } else {
                cl.height = 600;
            }
            if (args.heading != null) {
                cl.setHeading(args.heading);
            } else {
                cl.setHeading($JR_JS_CONSTANTS.CONST_PROMPT_FOR_CONFIRMATION);
            }

            if (args.showConfirmButton != null) {
                cl.showConfirmButton = args.showConfirmButton;
            }

            if (args.confirmText != null) {
                cl.confirmText = args.confirmText;
            }

            if (args.abortText != null) {
                cl.abortText = args.abortText;
            }

            cl.setShowTransparent(true);
            cl.setHideTransparent(false);

            cl.setFormName(formName);
            cl.setContent(content);

            confirmClickHandler = function(evt) {
                $('form_' + formName).action.value = action;
                $('form_' + formName).submit();
            };

            cl.setConfirmButtonListener(confirmClickHandler);
            cl.show();
        },

        enableElementsByChecked: function(checkElement, targetElement, fireElement) {

            checkElement = $('id_' + checkElement);

            if (targetElement != null && Object.isArray(targetElement) && targetElement.size() > 0) {
                targetElement.each(function(ele) {
                    ele = $('id_' + ele);
                    if (checkElement.checked) {
                        ele.disabled = '';
                    } else {
                        ele.disabled = 'disabled';
                    }
                });
            } else {
                targetElement = $('id_' + targetElement);
                if (checkElement.checked) {
                    targetElement.disabled = '';
                } else {
                    targetElement.disabled = 'disabled';
                }
            }

            if (fireElement != null) {
                $('id_' + fireElement.elementName).fire(fireElement.elementAction);
            }
        },

        showElementByChecked: function(checkElement, targetElement, fireElement) {

            checkElement = $('id_' + checkElement);
            var targetElementDiv = $('div_' + targetElement);
            targetElement = $('id_' + targetElement);

            if (checkElement.checked) {
                targetElementDiv.setStyle({
                    'display': ''
                });
            } else {
                targetElementDiv.setStyle({
                    'display': 'none'
                });
            }

            if (fireElement != null) {
                $('id_' + fireElement.elementName).fire(fireElement.elementAction);
            }
        },

        showElementBySelected: function(selectElement, targetElement) {

            var selectElementDiv = $('div_' + selectElement);
            var targetElementDiv = $('div_' + targetElement);
            selectElement = $('id_' + selectElement);
            targetElement = $('id_' + targetElement);

            if (selectElementDiv.style.display == 'none') {
                targetElementDiv.setStyle({
                    'display': 'none'
                });
            } else {
                if (selectElement.value == '1') {
                    targetElementDiv.setStyle({
                        'display': 'none'
                    });
                }
                if (selectElement.value == '2') {
                    targetElementDiv.setStyle({
                        'display': 'none'
                    });
                }
                if (selectElement.value == '3') {
                    targetElementDiv.setStyle({
                        'display': ''
                    });
                }
            }
        },

        contentShow: function(selector, selected) {

            $$(selector).each(function(e, index) {
                if (index == selected) {
                    $(e).removeClassName('hidden');
                } else {
                    $(e).addClassName('hidden');
                }
            });
        },

        contentHide: function(selector, preselected) {

            $$(selector).each(function(e, index) {
                if (index != preselected) {
                    $(e).addClassName('hidden');
                }
            });
        },

        showFilter: function(type, input, display, callback, params, hideTransparentOnHide, hideTransparentOnAbort) {
            if (hideTransparentOnHide == null) {
                hideTransparentOnHide = true;
            }
            if (hideTransparentOnAbort == null) {
                hideTransparentOnAbort = true;
            }

            filterLayer = new ContentLayer($JR.UTILITY.layerHeading, true, hideTransparentOnHide, hideTransparentOnAbort);
            filterLayer.confirmText = $JR.UTILITY.confirmText;
            filterLayer.abortText = $JR.UTILITY.abortText;
            filterLayer.showConfirmButton = false;
            filterLayer.width = 600;
            filterLayer.height = 600;
            filterLayer.display = display;
            filterLayer.input = input;

            if (callback != null) {
                filterLayer.onClose = callback.onClose;
                filterLayer.onAbort = callback.onAbort;
                filterLayer.onConfirm = callback.onConfirm;
            }

            if (params !== null) {
                filterLayer.params = params;
            }

            filterLayer.command = type;
            filterLayer.show();

            window.onscroll = function(e) {
                $JR_LAYERS.each(function(element) {
                    element.value.refreshPosition(e);
                });
            };
            window.onresize = function(e) {
                $JR_LAYERS.each(function(element) {
                    element.value.refreshPosition(e);
                    element.value.refreshSize(e);
                });
            };
        },

        layerHeading: 'title',
        confirmText: $JR_JS_CONSTANTS.CONST_APPLY,
        abortText: $JR_JS_CONSTANTS.CONST_ABORT
    }),

    EXCEPTION: Class.create({

        MODE_NONE: 0,
        MODE_ALERT: 1,

        mode: this.MODE_ALERT,

        handle: function(e) {
            switch (this.mode) {
                case this.MODE_NONE:
                    // do nothing
                    break;
                case this.MODE_ALERT:
                    alert('Exception: ' + e);
                    break;
            }
        }
    }),

    LAYERS: Class.create({

        getTransparencyLayer: function() {

            if (!$JR_LAYERS.get('transparentLayer')) {
                var tl = new TransparencyLayer();
                $JR_LAYERS.set('transparentLayer', tl);
            }
            return $JR_LAYERS.get('transparentLayer');
        },

        getGenericFormLayer: function(layerId) {

            if (layerId == null) {
                layerId = 'genericFormLayer';
            }

            if (!$JR_LAYERS.get(layerId)) {
                var gfl = new GenericFormLayer(null, null, null, layerId);
                $JR_LAYERS.set(layerId, gfl);
            }
            return $JR_LAYERS.get(layerId);
        },

        getLoadingLayer: function() {

            if (!$JR_LAYERS.get('loadingLayer')) {
                var ll = new LoadingLayer();
                $JR_LAYERS.set('loadingLayer', ll);
            }
            return $JR_LAYERS.get('loadingLayer');
        },

        getConfirmDeleteLayer: function() {

            var cdl = new ConfirmDeleteLayer();
            $JR_LAYERS.set('confirmDeleteLayer', cdl);
            return $JR_LAYERS.get('confirmDeleteLayer');
        },

        getConfirmLayer: function() {

            var cl = new ConfirmLayer();
            $JR_LAYERS.set('confirmLayer', cl);
            return $JR_LAYERS.get('confirmLayer');
        },

        getContentLayer: function() {
            if (!$JR_LAYERS.get('contentLayer')) {
                var cl = new ContentLayer();
                $JR_LAYERS.set('contentLayer', cl);
            }
            return $JR_LAYERS.get('contentLayer');
        },

        getFormLayer: function(name) {
            if (arguments.length === 0) {
                name = 'formLayer';
            }
            var fl = new FormLayer();
            $JR_LAYERS.set(name, fl);
            return $JR_LAYERS.get(name);
        }
    }),

    TABS: Class.create({

        tabLoad: function(obj) {

            $$('#tabs li').each(function(e, index) {
                if (e.id == obj.id) {
                    if (!e.hasClassName('selected')) {
                        e.removeClassName('unselected');
                        e.addClassName('selected');
                        $JR.UTILITY.contentShow('#tab-info li', index);
                        $JR.UTILITY.contentShow('#tab-content li.content', index);
                    }
                } else {
                    if (e.hasClassName('selected')) {
                        e.removeClassName('selected');
                        e.addClassName('unselected');
                    }
                }
            });
            var jrTabElement = $('jrtab');
            if (jrTabElement) {
                jrTabElement.value = obj.id.replace('tab', '');
            }
        },

        tabsLoad: function(selected) {

            $$('#tabs li').each(function(e, index) {
                if (index == selected) {
                    e.addClassName('selected');
                } else {
                    e.addClassName('unselected');
                }
            });
        },

        tabsInit: function(preselected) {

            var preselected = 0;
            $JR.UTILITY.contentHide('#tab-info li', preselected);
            $JR.UTILITY.contentHide('#tab-content li.content', preselected);

            /* Seperat formAddEvents(); */
            $JR.TABS.tabsLoad(preselected);
        }
    }),

    MODULE: Class.create({

        /*
         * change value element depending on selected source,
         * subtable and data type
         */
        changeValueElement: function(id, type, element) {

            var elementRow = $(element).up().up();

            var offset = elementRow.id.lastIndexOf('_row_');
            var row = (offset != '-1') ? '_' + elementRow.id.slice(offset + 5) : '';

            var fieldname;
            if (id.indexOf('batch_') === 0) {
                fieldname = 'batch_' + type + id.substring(6);
            } else {
                fieldname = type + id;
            }

            var texttype = ($(fieldname + '_texttype' + row) != null) ? $(fieldname + '_texttype' + row).value : '';
            var sourcetype = ($(fieldname + '_sourcetype' + row) != null) ? $(
                fieldname + '_sourcetype' + row).value : '';
            var subtable = ($(fieldname + '_subtable' + row) != null) ? $(fieldname + '_subtable' + row).value : '';
            var datatype = ($(fieldname + '_datatype' + row) != null) ? $(fieldname + '_datatype' + row).value : '';
            var required = $(fieldname + '_value' + row).hasClassName('required') ? 'required' : '';

            // remove current value element
            var nodeToDelete = document.getElementById(fieldname + '_value' + row);
            var valueParentNode = nodeToDelete.parentNode;

            // remove image for process fields popup (if it
            // exists)
            var spfPopupToDelete = $(fieldname + '_spfPopup' + row);
            if (spfPopupToDelete != null) {
                spfPopupToDelete.remove();
            }

            // prototype Element.remove() doesn't work with
            // <select>.
            valueParentNode.removeChild(nodeToDelete);

            // source is process table
            if (sourcetype == 1) {
                // disable subtable select and enable datatype
                // select
                $(fieldname + '_subtable' + row).disable();
                $(fieldname + '_subtable' + row).selectedIndex = '';
                $(fieldname + '_datatype' + row).enable();

                // insert new value element with empty options
                var newNode = new Element('select', {
                    'id': fieldname + '_value' + row,
                    'name': fieldname + '_value' + row,
                    'class': 'jr-form-control'
                });
                newNode.addClassName(required);
                $(valueParentNode).insert(newNode);

                // datatype is selected (e.g. file|path) or
                // predefined (varchar|int, ...)
                if (datatype != '') {
                    // fill value options with process table
                    // fields of the given data type
                    var length = arrayTableFields[datatype].length;
                    for (var i = 0; i < length; i++) {
                        elementName = arrayTableFields[datatype][i]['name'];
                        elementValue = arrayTableFields[datatype][i]['value'];

                        var newOptionNode = document.createElement('option');
                        newOptionNode.setAttribute('value', elementValue);
                        newOptionNode.innerHTML = elementName;
                        newNode.insert(newOptionNode);
                    }
                    newNode.addClassName('jr-designer-sa-config-drop-down-list');
                } else {
                    // no data type selected yet -> no value
                    // fields available
                    $(newNode).disable();
                }
            }
            // source is subtable
            else if (sourcetype == 2) {

                // enable datatype
                $(fieldname + '_datatype' + row).enable();

                // get fix subtable
                var blnFixSubtable = false;

                var fixSubtableId = 'id_udf_fixSubtable';
                if (id.indexOf('batch_') === 0) {
                    fixSubtableId = 'id_batch_udf_fixSubtable';
                }

                if ($(fixSubtableId) != null) {
                    if ($(fixSubtableId).value != '') {
                        subtable = $(fixSubtableId).value;
                        blnFixSubtable = true;

                    }
                }

                var parentSubtable = $(fieldname + '_subtable' + row).getAttribute('parent_subtable');
                if (parentSubtable != null) {
                    if ($F(parentSubtable) != '') {
                        subtable = $F(parentSubtable);
                    }
                    blnFixSubtable = true;
                }

                var posdataPrefix = '';
                if (id.indexOf('batch_') === 0) {
                    posdataPrefix = 'batch_';
                }

                var posdataSubtableId = posdataPrefix + 'posdata_' + type + 'subtable';

                var posdataSubtable = $(posdataSubtableId);
                if (posdataSubtable != null) {
                    if ($F(posdataSubtable) != '') {
                        subtable = $F(posdataSubtable);
                    } else {
                        subtable = '';
                    }
                    blnFixSubtable = true;
                }

                // enable subtable selection only when no fix
                // subtable is available
                if (!blnFixSubtable) {
                    $(fieldname + '_subtable' + row).enable();
                } else {
                    $(fieldname + '_subtable' + row).value = subtable;
                }

                // insert new value element with empty options
                var newNode = new Element('select', {
                    'id': fieldname + '_value' + row,
                    'name': fieldname + '_value' + row,
                    'class': 'jr-form-control'
                });
                newNode.addClassName(required);

                // datatype and subtable are already selected ->
                // show available subtable fields
                if (datatype != '' && subtable != '') {
                    var length = arraySubtableFields[subtable][datatype].length;
                    for (var i = 0; i < length; i++) {
                        elementName = arraySubtableFields[subtable][datatype][i]['name'];
                        elementValue = arraySubtableFields[subtable][datatype][i]['value'];
                        var newOptionNode = document.createElement('option');
                        newOptionNode.setAttribute('value', elementValue);
                        newOptionNode.innerHTML = elementName;
                        newNode.insert(newOptionNode);
                        newNode.addClassName('jr-designer-sa-config-drop-down-list');
                    }
                }
                // datatype or subtable not selected -> no
                // subtable fields available yet
                else {
                    newNode.disable();
                }
                $(valueParentNode).insert(newNode);
            }
            // source is fixed value
            else if (sourcetype == 3) {
                $(fieldname + '_subtable' + row).disable();
                $(fieldname + '_subtable' + row).selectedIndex = '';
                $(fieldname + '_datatype' + row).disable();
                $(fieldname + '_datatype' + row).selectedIndex = '';

                var newNode = null;
                var labelNode = null;

                if (texttype == 'textarea') {
                    newNode = new Element('textarea', {
                        'id': fieldname + '_value' + row,
                        'name': fieldname + '_value' + row,
                        'rows': 10,
                        'cols': 47
                    });
                    newNode.addClassName(required);
                } else if (texttype == 'checkbox') {
                    newNode = new Element('input', {
                        'id': fieldname + '_value' + row,
                        'name': fieldname + '_value' + row,
                        'type': 'checkbox',
                        'value': '1',
                        'class': 'jr-checkbox'
                    });
                    labelNode = new Element('label', {
                        'for': fieldname + '_value' + row,
                    });
                } else if (texttype == 'password') {
                    newNode = new Element('input', {
                        'id': fieldname + '_value' + row,
                        'name': fieldname + '_value' + row,
                        'type': 'password',
                        'class': 'jr-form-control'
                    });
                } else {
                    newNode = new Element('input', {
                        'id': fieldname + '_value' + row,
                        'name': fieldname + '_value' + row,
                        'type': 'text',
                        'size': 50,
                        'required': required,
                        'class': 'jr-form-control'
                    });
                    newNode.addClassName(required);
                }

                $(valueParentNode).insert(newNode);
                $(valueParentNode).addClassName('fixed-value-containter');
                if (labelNode) {
                    $(valueParentNode).insert(labelNode);
                }

                if (texttype != 'checkbox' && texttype != 'password') {
                    // insert popup for process and system
                    // fields
                    newNode.addClassName('jr-form-control-with-icon');
                    var onClick = 'showProcessFields(\"' + spi_fields + '\",\"' + fieldname + '_value' + row +
                        '\", \"' + spi_displayInfos + '\")';
                    var spiPopup = new Element('a', {
                        'id': fieldname + '_spfPopup' + row,
                        'name': fieldname + '_spfPopup' + row,
                        'href': "javascript:;",
                        'onclick': onClick,
                        'class': 'jr-form-extended-link'
                    });
                    var icon = new Element('i', { 'class': 'jr-icon-magnify jr-form-control-icon' });
                    spiPopup.appendChild(icon);
                    $(valueParentNode).insert(spiPopup);
                }

            }
            // no source selected
            else {
                $(fieldname + '_subtable' + row).disable();
                $(fieldname + '_subtable' + row).selectedIndex = '';
                $(fieldname + '_datatype' + row).disable();

                var newNode = new Element('input', {
                    'id': fieldname + '_value' + row,
                    'name': fieldname + '_value' + row,
                    'type': 'text',
                    'size': 50,
                    'required': required,
                    'class': 'jr-form-control'
                }).disable();
                newNode.addClassName(required);
                $(valueParentNode).insert(newNode);
            }
        },

        resetSubtables: function(fixSubtableId) {

            if (!fixSubtableId) {
                fixSubtableId = 'id_udf_fixSubtable';
            } else {
                fixSubtableId = 'id_' + fixSubtableId;
            }

            var isBatch = false;
            if (fixSubtableId.indexOf('id_batch_') === 0) {
                isBatch = true;
            }

            var fieldSelector = 'tr.act_field';
            var listSelector = 'tr.act_list';

            if (isBatch) {
                fieldSelector = '#form_popup_editsystemactivitybatchfunction tr.act_field';
                listSelector = '#form_popup_editsystemactivitybatchfunction tr.act_list';
            }

            // get all fields
            $$(fieldSelector).each(function(e, index) {
                var sourceTypeElement = $(e).down().next().down();
                var sourceType = sourceTypeElement.value;
                if (sourceType == 2) {

                    var subtableElement = $(e).down().next().next().down();
                    var oldSubtableElementValue = subtableElement.value;
                    var elementID = sourceTypeElement.id;
                    elementID = elementID.replace(/^batch_field_/, 'batch_');
                    elementID = elementID.replace(/^field_/, '');
                    elementID = elementID.replace(/_sourcetype$/, '');
                    if ($(fixSubtableId).value == '') {
                        subtableElement.enable();
                    } else {
                        subtableElement.disable();
                        subtableElement.value = $(fixSubtableId).value;
                    }
                    if (oldSubtableElementValue == '' || oldSubtableElementValue != $(fixSubtableId).value) {
                        changeValueElement(elementID, 'field_', subtableElement);
                    }
                }
            });

            // get all list fields
            $$(listSelector).each(function(e, index) {

                var sourceTypeElement = $$('#' + e.id + ' [id*="sourcetype"]').first();
                var sourceType = sourceTypeElement.value;
                if (sourceType == 2) {

                    var subtableElement = $$('#' + e.id + ' [id*="subtable"]').first();

                    var elementID = sourceTypeElement.id;
                    elementID = elementID.replace(/^batch_list_/, 'batch_');
                    elementID = elementID.replace(/^list_/, '');
                    elementID = elementID.replace(/_sourcetype_[0-9]{1,}$/, '');
                    if ($(fixSubtableId).value == '') {
                        subtableElement.enable();
                    } else {
                        subtableElement.disable();
                        subtableElement.value = $(fixSubtableId).value;
                    }
                    changeValueElement(elementID, 'list_', subtableElement);
                }
            });
        },

        /*
         * change subtable for lists and positions depending on
         * selected parent subtable
         */
        changeSubtable: function(id, type) {

            var fieldname;
            var batchPrefix = '';
            var idWithoutBatch = id;
            if (id.indexOf('batch_') === 0) {
                fieldname = 'batch_' + type + '_' + id.substring(6);
                batchPrefix = 'batch_';
                idWithoutBatch = id.replace(/^batch_/, '');
            } else {
                fieldname = type + '_' + id;
            }

            var subtable = $(fieldname + '_subtable').value;

            // no subtable selected
            if (subtable == '') {
                // parameter type is list
                if (type == 'list') {
                    var nodeToDelete = $(fieldname + '_subtable_template');
                    if (nodeToDelete != null) {
                        var parentNode = nodeToDelete.parentNode;
                        parentNode.removeChild(nodeToDelete);

                        var newNode = new Element('select', {
                            'id': fieldname + '_subtable_template',
                            'name': fieldname + '_subtable_template',
                            'onchange': 'changeValueElement(\"' + id + '\",\"' + type + '_\",this)',
                            'class': 'jr-form-control jr-designer-sa-config-drop-down-list'
                        });

                        var length = arraySubtables.length;
                        for (var j = 0; j < length; j++) {
                            elementName = arraySubtables[j]['name'];
                            elementValue = arraySubtables[j]['value'];
                            var newOptionNode = document.createElement('option');
                            newOptionNode.setAttribute('value', elementValue);
                            newOptionNode.innerHTML = elementName;
                            newNode.insert(newOptionNode);
                        }
                        if ($(fieldname + '_sourcetype_template').value != 2) {
                            newNode.disable();
                        }

                        $(parentNode).insert(newNode);
                        changeValueElement(id, type + '_', newNode);
                    }

                    var count = $(fieldname + '_maxcount').value;
                    for (var i = 0; i < count; i++) {
                        var nodeToDelete = $(fieldname + '_subtable_' + i);
                        if (nodeToDelete == null) {
                            // rows may not be numbered
                            // consecutively
                            continue;
                        }
                        var parentNode = nodeToDelete.parentNode;
                        parentNode.removeChild(nodeToDelete);

                        var newNode = new Element('select', {
                            'id': fieldname + '_subtable_' + i,
                            'name': fieldname + '_subtable_' + i,
                            'onchange': 'changeValueElement(\"' + id + '\",\"' + type + '_\",this)',
                            'class': 'jr-form-control jr-designer-sa-config-drop-down-list'
                        });

                        var length = arraySubtables.length;
                        for (var j = 0; j < length; j++) {
                            elementName = arraySubtables[j]['name'];
                            elementValue = arraySubtables[j]['value'];
                            var newOptionNode = document.createElement('option');
                            newOptionNode.setAttribute('value', elementValue);
                            newOptionNode.innerHTML = elementName;
                            newNode.insert(newOptionNode);
                        }

                        if ($(fieldname + '_sourcetype_' + i).value != 2) {
                            newNode.disable();
                        }

                        $(parentNode).insert(newNode);
                        changeValueElement(id, type + '_', newNode);
                    }
                } else {
                    $$('input[parent_subtable="' + fieldname + '_subtable' + '"]').each(function(item) {
                        item.value = subtable;
                        var itemId = item.id.slice(id.length + 1, item.id.length - 9);
                        if ($F(id + '_' + itemId + '_sourcetype') == 2) {
                            item.disable();
                            item.readOnly = true;
                            changeValueElement(itemId, id + '_', $(id + '_' + itemId + '_sourcetype'));
                        }
                    });

                    if (type == 'posdata') {
                        $(batchPrefix + type + '_' + idWithoutBatch + '_subtable').up(1).
                            select('div select[id$="subtable"]').each(function(item) {
                            item.value = subtable;
                            var itemId = item.id.slice(id.length + 1, item.id.length - 9);
                            if ($F(id + '_' + itemId + '_sourcetype') == 2) {
                                item.disable();
                                item.readOnly = true;
                                changeValueElement(itemId, id + '_', $(id + '_' + itemId + '_sourcetype'));
                            }
                        });
                    }
                }
            } else {
                if (type == 'list') {

                    var nodeToDelete = $(fieldname + '_subtable_template');
                    if (nodeToDelete != null) {
                        var parentNode = nodeToDelete.parentNode;
                        parentNode.removeChild(nodeToDelete);
                        var newNode = new Element('input', {
                            'id': fieldname + '_subtable_template',
                            'name': fieldname + '_subtable_template',
                            'type': 'text',
                            'value': subtable,
                            'readonly': 'true',
                            'class': 'jr-form-control'
                        });
                        $(parentNode).insert(newNode);
                        changeValueElement(id, type + '_', newNode);
                    }

                    var count = $(fieldname + '_maxcount').value;
                    for (var i = 0; i < count; i++) {
                        var nodeToDelete = $(fieldname + '_subtable_' + i);
                        if (nodeToDelete == null) {
                            // rows may not be numbered
                            // consecutively
                            continue;
                        }
                        var parentNode = nodeToDelete.parentNode;
                        parentNode.removeChild(nodeToDelete);

                        var newNode = new Element('input', {
                            'id': fieldname + '_subtable_' + i,
                            'name': fieldname + '_subtable_' + i,
                            'type': 'text',
                            'value': subtable,
                            'readonly': 'true',
                            'class': 'jr-form-control'
                        });
                        $(parentNode).insert(newNode);
                        changeValueElement(id, type + '_', newNode);
                    }
                } else {
                    $$('select[parent_subtable="' + fieldname + '_subtable' + '"]').each(function(item) {
                        item.value = subtable;
                        var itemId = item.id.slice(id.length + 1, item.id.length - 9);
                        if ($F(id + '_' + itemId + '_sourcetype') == 2) {
                            item.disable();
                            item.readOnly = true;
                            changeValueElement(itemId, id + '_', $(id + '_' + itemId + '_sourcetype'));
                        }
                    });

                    if (type == 'posdata') {
                        $(batchPrefix + type + '_' + idWithoutBatch + '_subtable').up(1).
                            select('div select[id$="subtable"]').each(function(item) {
                            item.value = subtable;
                            var itemId = item.id.slice(id.length + 1, item.id.length - 9);
                            if ($F(id + '_' + itemId + '_sourcetype') == 2) {
                                item.disable();
                                item.readOnly = true;
                                changeValueElement(itemId, id + '_', $(id + '_' + itemId + '_sourcetype'));
                            }
                        });
                    }
                }
            }
        },

        /* change value field for configuration variables */
        changeVariableField: function(row) {

            var sourcetype = $('config_sourcetype_' + row).value;

            var nodeToDelete = $('config_value_' + row);
            var parentNode = nodeToDelete.parentNode;
            parentNode.removeChild(nodeToDelete);
            var newNode = null;

            // source is process table
            if (sourcetype == 1) {
                newNode = new Element('select', {
                    'id': 'config_value_' + row,
                    'name': 'config_value_' + row
                });

                var length = arrayTableFields['varchar'].length;
                for (var i = 0; i < length; i++) {
                    elementName = arrayTableFields['varchar'][i]['name'];
                    elementValue = arrayTableFields['varchar'][i]['value'];
                    var newOptionNode = document.createElement('option');
                    newOptionNode.setAttribute('value', elementValue);
                    newOptionNode.innerHTML = elementName;
                    newNode.insert(newOptionNode);
                }
            } else {
                newNode = new Element('input', {
                    'id': 'config_value_' + row,
                    'name': 'config_value_' + row,
                    'type': 'text'
                });
                if (sourcetype == 0) {
                    newNode.disable();
                }
            }

            $(parentNode).insert(newNode);
        },

        removeListEntry: function(listName, element) {
            var $element = jQuery(element);

            if ($element.hasClass('disabled')) {
                return;
            }

            clearValidationErrorMessages();

            // get row to remove via this
            var $rowToRemove = $element.closest('tr');

            // remove row
            $rowToRemove.remove();

            // maximum id of all list rows
            var $maxCountNode = jQuery('#' + listName + '_maxcount');
            var maxListCount = +$maxCountNode.val();

            // current number of list rows
            var $currentCountNode = jQuery('#' + listName + '_count');
            var currentListCount = +$currentCountNode.val();
            $currentCountNode.val(--currentListCount);

            if (+$currentCountNode.val() === 0) {
                jQuery('#' + listName + '_row_empty').show();
            }

            // enable|disable buttons for adding and removing
            // rows (if min or max list count is reached)
            setAddRemoveButtons(currentListCount, maxListCount, listName);
        },

        setAddRemoveButtons: function(currentCount, maxID, listName) {
            // 1. if max reached -> disable add-Buttons
            var maximumReached = false;
            if (parseInt($(listName + '_max').value) == currentCount) {
                maximumReached = true;
            }

            for (var i = 0; i <= maxID; i++) {
                var insertButton = $(listName + '_insert_' + i);
                if (insertButton != null) {
                    insertButton.disabled = maximumReached;
                }
            }

            // 2. if min reached -> disable remove-Buttons
            var minimumReached = true;

            if ($(listName + '_min').value < currentCount) {
                minimumReached = false;
            }

            for (var i = 0; i <= maxID; i++) {
                var elementRemoveImage = $(listName + '_delete_' + i);
                var elementRemoveImageDisable = $(listName + '_delete_' + i + '_disable_remove');
                if (elementRemoveImage != null) {
                    if (elementRemoveImageDisable != null && elementRemoveImageDisable.value === "true") {
                        elementRemoveImage.disabled = true;
                    } else {
                        elementRemoveImage.disabled = minimumReached;
                        if (minimumReached) {
                            jQuery('#' + listName + '_delete_' + i).addClass('disabled');
                        } else {
                            jQuery('#' + listName + '_delete_' + i).removeClass('disabled');
                        }
                    }
                }
            }
        },

        addListEntry: function(listName, element) {
            var $element = jQuery(element);

            if ($element.hasClass('disabled')) {
                return;
            }

            // maximum id of all list rows
            var $maxCountNode = jQuery('#' + listName + '_maxcount');
            var maxListCount = +$maxCountNode.val();

            // current number of list rows
            var $currentCountNode = jQuery('#' + listName + '_count');
            var currentListCount = +$currentCountNode.val();

            if (currentListCount === 0) {
                jQuery('#' + listName + '_row_empty').hide();
            }

            // id of new list row
            var newRowId = maxListCount + 1;

            // list row after that the new row is inserted
            var $lastListElement = $element.closest('tr');

            // clone row (id's and names are also cloned)
            var $templateListRow = jQuery('#' + listName + '_row_template');
            var $newListRow = $templateListRow.clone();

            // get and change id of new row
            var oldId = $newListRow.attr('id');
            var newId = oldId.slice(0, oldId.lastIndexOf('_') + 1) + newRowId;
            $newListRow.attr('id', newId);

            // insert new row into DOM
            $newListRow.insertAfter($lastListElement);

            // display new row (cloned template row is hidden)
            $newListRow.show();

            // get all children of the new row (all columns)
            var $newListColumns = $newListRow.children();

            for (var i = 0; i < $newListColumns.length; i++) {
                // delete script child
                if ($newListColumns[i].tagName == 'SCRIPT') {
                    jQuery($newListColumns[i]).remove();
                } else {
                    // get children of columns (input fields)
                    var $columnEntries = jQuery($newListColumns[i]).children();
                    var $icons = jQuery($newListColumns[i]).find('i.jr-form-control-icon[id^=img_]');
                    if ($icons.length > 0) {
                        $columnEntries.push($icons[0]);
                    }
                    for (var j = 0; j < $columnEntries.length; j++) {
                        // get and change id
                        oldId = $columnEntries[j].id;
                        if (oldId) {
                            newId = oldId.slice(0, oldId.lastIndexOf('_') + 1) + newRowId;
                            $columnEntries[j].id = newId;
                        }

                        // get and change name
                        var oldName = $columnEntries[j].name;
                        if (oldName) {
                            var newName = oldName.slice(0, oldName.lastIndexOf('_') + 1) + newRowId;
                            $columnEntries[j].name = newName;
                        }

                        // labels for checkboxes and radio buttons
                        var oldLabelFor = $columnEntries[j].htmlFor;
                        if (oldLabelFor) {
                            var newLabelFor = oldLabelFor.slice(0, oldLabelFor.lastIndexOf('_') + 1) + newRowId;
                            $columnEntries[j].htmlFor = newLabelFor;
                        }

                    }
                }
            }

            // new max row id and row count
            $maxCountNode.val(newRowId);
            $currentCountNode.val(++currentListCount);

            // enable|disable buttons for adding and removing
            // rows (if min or max list count is reached)
            setAddRemoveButtons(currentListCount, newRowId, listName);
        },

        checkRequired: function() {

            var blnRequired = false;
            var x = documentgetElementsByName('elements')[0];
            for (var i = 0; i < x.length; i++) {
                var start = (x[i].id).lastIndexOf('_');
                var elementIDPart = (x[i].id).substr(start);
                if (elementIDPart == '_template') {
                    continue;
                }
                if (x[i].getAttribute('required') == 'true') {
                    if (x[i].type == 'checkbox' && !x[i].checked) {
                        x[i].style.backgroundColor = 'red';
                        blnRequired = true;
                        alert('Required field [' + x[i].id + '] has to be checked!');
                    } else if (x[i].type != 'checkbox' && x[i].value == '') {
                        x[i].style.backgroundColor = 'red';
                        blnRequired = true;
                        alert('Required field [' + x[i].id + '] has to be filled!');
                    }
                }
            }
            if (!blnRequired) {

                document.getElementsByName('action')[0].value = 'save';
                $('form_' + this.getName()).submit();
            }
        },
        showProcessFields: function(fields, returnField, displayInfos, searchValue) {

            var showProcessFieldsData = {
                fields: fields,
                returnField: returnField,
                displayInfos: displayInfos
            };
            jQuery('body').data('showProcessFieldsData', showProcessFieldsData);

            var loadingLayer = new LoadingLayer('', true, true);
            loadingLayer.show();

            var displayParameter = {};
            if (displayInfos) {
                if (Object.isString(displayInfos)) {
                    displayParameter = eval('(' + displayInfos + ')');
                } else {
                    displayParameter = displayInfos;
                }
            }

            var options = {
                id: '',
                title: ((displayParameter['heading'] !=
                null) ? displayParameter['heading'] : $JR_JS_CONSTANTS.CONST_PROCESS_TABLE_FIELDS),
                url: 'index.php?cmd=popup_showProcessFields',
                modal: true,
                minHeight: 500,
                height: ((displayParameter['height'] != null) ? parseInt(displayParameter['height']) : jQuery(window).
                    height() - 50),
                minWidth: 400,
                width: ((displayParameter['width'] != null) ? parseInt(displayParameter['width']) : jQuery(window).
                    width() - 100),
                close: function(event, ui) {
                    jQuery(this).dialog('close').dialog('destroy').remove();
                },
                buttons: [
                    {
                        text: jr_get_constant_value(((displayParameter['abortText'] !=
                        null) ? displayParameter['abortText'] : $JR_JS_CONSTANTS.CONST_ABORT)),
                        click: function() {
                            jQuery(this).dialog("close");
                        }
                    }, {
                        id: 'showprocessfields_apply',
                        text: jr_get_constant_value((displayParameter['confirmText'] !=
                        null) ? displayParameter['confirmText'] : $JR_JS_CONSTANTS.CONST_CONFIRM),
                        click: function() {
                            var $selectedFields = jQuery('#pf_selected_fields');
                            if (returnField == 'sourceCodeAce') {
                                window.editor.insert($selectedFields.val());
                            } else {
                                var $returnField = jQuery(returnField.buildJQueryIdSelector());
                                var oldValue = $returnField.val();
                                $returnField.val(oldValue + $selectedFields.val());
                            }
                            jQuery('#showprocessfields').dialog('close');
                        }
                    }
                ],
                open: function() {
                    jQuery('#showprocessfields_apply').hide();
                }
            };

            var params = {
                fields: fields,
                returnField: returnField,
                overwriteReturnField: displayParameter['overwriteReturnField'],
                keepOpenAfterClickOption: displayParameter['keepOpenAfterClickOption'],
                showFilter: displayParameter['showFilter'],
                showCreateProcessMessageButton: displayParameter['showCreateProcessMessageButton']
            };

            if (searchValue) {
                params.searchValue = searchValue;
            }

            jQuery.get(options.url, { params: params }, function() {
            }).always(function() {
                loadingLayer.hide();
            }).done(function(responseObject) {
                var dialog = $JR.widget.dialog('showprocessfields', options);
                dialog.setTitle(jr_get_constant_value(options.title));
                dialog.setContent(responseObject);
                dialog.open();
                if (displayParameter['showFilter']) {
                    jQuery('#jr-popup-show-processmessages_filter').find('input').focus();
                    jQuery('#jr-popup-show-processmessages').DataTable().draw()
                }
            });
        },
    }),

    initialize: function() {
        this.EFFECTS = new this.EFFECTS();
        this.JRFORM = new this.JRFORM();
        this.DIALOG = new this.DIALOG();
        this.POPUP = new this.POPUP();
        this.UTILITY = new this.UTILITY();
        this.LAYERS = new this.LAYERS();
        this.TABS = new this.TABS();
        this.MODULE = new this.MODULE();
        this.EXCEPTION = new this.EXCEPTION();
        this.NOTIFICATION = new window.$JR_APP.CORE.Notification();
    }
});

$JR = new JOBROUTER();
$JR_LAYERS = new Hash();
$JR_UPLOAD_FORMS = new Hash();
$JR_UPLOAD_MANAGERS = new Hash();
$JR_POPUP_WINDOWS = new Array();

var _newwin = false;

var jr_trackWindowOpen = function(winName) {
    $JR_POPUP_WINDOWS[$JR_POPUP_WINDOWS.length] = winName;
};

var jr_closePopupWindows = function() {
    var openCount = $JR_POPUP_WINDOWS.length;
    for (var i = 0; i < openCount; ++i) {
        try {
            if (!$JR_POPUP_WINDOWS[i].closed) {
                $JR_POPUP_WINDOWS[i].close();
            }
        } catch(e) {
            // alert(e.message);
        }
    }
};

var jr_row = function(element, that) {

    var elm;

    // workaround for autocomplete - elements!
    if ($(element).id === undefined && that !== undefined) {
        elm = $(that);
    } else {
        elm = $(element);
    }

    if (elm === null) {
        return;
    }

    if (elm.nodeName && elm.nodeName.toUpperCase() == 'TR') {
        return elm.id.substring(elm.id.lastIndexOf('_') + 1);
    }

    elm = elm.up();
    while (elm.nodeName.toUpperCase() != 'TR') {
        elm = elm.up();
    }

    return elm.down().down().value;
};

var initDialogPages = function() {

    var $pageContainer = jQuery('#pageContainer');
    var tabbedListElements = $pageContainer.find('.tabbertab');
    var pages = [];
    jQuery.each(tabbedListElements, function(key, value) {
        pages[value.id] = value.title;

    });
    $pageContainer.data('pages', pages);
};

/*
 * var jr_show_group = function(sectionId) { if (Object.isArray(sectionId)) {
 * sectionId.each(function (section) { $JR.DIALOG.SECTION.show(section); }); }
 * else { $JR.DIALOG.SECTION.show(sectionId); } };
 *
 * var jr_hide_group = function(sectionId) { if (Object.isArray(sectionId)) {
 * sectionId.each(function (section) { $JR.DIALOG.SECTION.hide(section); }); }
 * else { $JR.DIALOG.SECTION.hide(sectionId); } };
 */

var jr_minimize_section = function(sectionId) {
    if (Object.isArray(sectionId)) {
        sectionId.each(function(section) {
            $JR.DIALOG.SECTION.minimize(section);
        });
    } else {
        $JR.DIALOG.SECTION.minimize(sectionId);
    }
};

var jr_maximize_section = function(sectionId) {
    if (Object.isArray(sectionId)) {
        sectionId.each(function(section) {
            $JR.DIALOG.SECTION.maximize(section);
        });
    } else {
        $JR.DIALOG.SECTION.maximize(sectionId);
    }
};

var getPixelDensity = function() {
    return window.devicePixelRatio || 1;
};

var isInAcceptableRange = function(reference, current) {
    return (Math.abs(reference - current) < 5);
};

var jr_popup = function(url, name, properties, mergeProperties) {
    $JR.POPUP.open(url, name, properties, mergeProperties);
};

var initPopupWindow = function(window) {
    var properties = $JR.POPUP.getProperties();
    $JR.POPUP.applyPositionCorrection(window, properties);
    $JR.POPUP.addPositionStoreEventsForWindow(window, window.name);
};

var checkLength = function(fieldValue, len) {
    $JR.UTILITY.checkLength(fieldValue, len);
};

var showBox = function(box, availableBoxes) {
    $JR.UTILITY.showBox(box, availableBoxes);
};

var newWin = function(url, width, height) {
    return $JR.UTILITY.newWin(url, width, height);
};

var newWinPos = function(url, width, height, top, left, center, windowName) {
    $JR.UTILITY.newWinPos(url, width, height, top, left, center, windowName);
};

var loadUserCounter = function(username) {
    $JR.UTILITY.loadUserCounter(username);
};

var submitForm = function(formName, action, popup, check, module, modcmd, connection, callback, parameters) {
    $JR.UTILITY.submitForm(formName, action, popup, check, module, modcmd, connection, callback, parameters);
};

var submitFilterForm = function(formName, action, popup) {
    $JR.UTILITY.submitFilterForm(formName, action, popup);
};

var loadPopup = function(formName, action, module, modcmd, connection, parameters) {
    $JR.UTILITY.loadPopup(formName, action, module, modcmd, connection, parameters);
};

var loadFormPopup = function(formName, action, module, modcmd, connection, parameters, popupInfos) {
    $JR.UTILITY.loadFormPopup(formName, action, module, modcmd, connection, parameters, popupInfos);
};

var loadPopupLocal = function(formName, action, content) {
    $JR.UTILITY.loadPopupLocal(formName, action, content);
};

var loadContentPopupLocal = function(formName, action, content, args) {
    $JR.UTILITY.loadContentPopupLocal(formName, action, content, args);
};

var enableElementsByChecked = function(checkElement, targetElement, fireElement) {
    $JR.UTILITY.enableElementsByChecked(checkElement, targetElement, fireElement);
};

var showElementByChecked = function(checkElement, targetElement, fireElement) {
    $JR.UTILITY.showElementByChecked(checkElement, targetElement, fireElement);
};

var showElementBySelected = function(checkElement, targetElement) {
    $JR.UTILITY.showElementBySelected(checkElement, targetElement);
};

var showFilter = function(type, input, display, callback, params, hideTransparentOnHide, hideTransparentOnAbort) {
    $JR.UTILITY.showFilter(type, input, display, callback, params, hideTransparentOnHide, hideTransparentOnAbort);
};

var togglePanel = function(id, imgId, listName) {
    $JR.EFFECTS.togglePanel(id, imgId, listName);
};

var resizeNavigation = function(size, mode) {
    $JR.EFFECTS.resizeNavigation(size, mode);
};

var changeValueElement = function(id, type, element) {
    $JR.MODULE.changeValueElement(id, type, element);
};

var resetSubtables = function(fixSubtableId) {
    $JR.MODULE.resetSubtables(fixSubtableId);
};

var changeSubtable = function(id, type) {
    $JR.MODULE.changeSubtable(id, type);
};

var changeVariableField = function(row) {
    $JR.MODULE.changeVariableField(row);
};

var removeListEntry = function(listName, element) {
    $JR.MODULE.removeListEntry(listName, element);
};

var addListEntry = function(listName, element) {
    $JR.MODULE.addListEntry(listName, element);
};

var checkRequired = function() {
    $JR.MODULE.checkRequired();
};

var setAddRemoveButtons = function(currentCount, maxID, listName) {
    $JR.MODULE.setAddRemoveButtons(currentCount, maxID, listName);
};

var showProcessFields = function(fields, returnField, displayInfos) {
    $JR.MODULE.showProcessFields(fields, returnField, displayInfos);
};

var tabsInit = function(preselected) {
    $JR.TABS.tabsInit(preselected);
};

var tabLoad = function(obj) {
    $JR.TABS.tabLoad(obj);
};

var selectObject = Class.create({

    initialize: function(id, filterBox) {
        this.maxSize = 10;
        this.multiple = true;

        this.debug = false;

        this.node = $(id);
        this.options = [];
        this.filterBox = $(filterBox);

        this.needle = '';
        this.lastNeedle = '';

        if (this.node != null) {
            this.node.writeAttribute('size', this.maxSize);
            this.node.writeAttribute('multiple', this.multiple);
            this.node.writeAttribute('style', 'width: 400px; height: 400px;');
        }
    },

    // Methode a) add('label', 'value');
    // Methode b) add(['a', 'b', 'c']);
    set: function() {
        if (this.debug) {
            console.log('set');
        }
        if (typeof (arguments[0]) == 'string') {
            var option = {};
            option.label = arguments[0];
            option.value = arguments[1];
            (arguments[2] == undefined) ? sort = false : sort = arguments[2];

            var goliath;

            if (!sort) {
                this.options.push(option);
                goliath = this.options.length;
            } else {
                goliath = this.getNextGreaterIndex(option);
                this.options.splice(goliath, 0, option);
            }
            this.renderOption(option, goliath);
        } else if (typeof (arguments[0]) == 'object') {
            var self = this;
            (arguments[1] == undefined) ? sort = false : sort = arguments[2];
            arguments[0].each(function(e) {
                self.set(e, e, sort);
            });
        }
    },

    unset: function(label, norender) {
        var self = this;
        this.options.each(function(opt, i) {
            try {
                if (opt.label == label) {
                    self.options.splice(i, 1);
                    if (norender == undefined) {
                        self.remove(label);
                    }
                }
            } catch(e) {
            }
        });
    },

    // Löscht alle Options Elemente
    unsetAll: function(norender) {
        this.options = [];
        if (norender = !undefined) {
            this.removeAll();
        }
    },

    renderOption: function(opt, index) {
        if (index == undefined) {
            index = this.node.options.length;
        }
        nextGreater = this.node.options[index];
        var newOption = document.createElement("option");
        newOption.setAttribute("value", opt.value);
        var text = document.createTextNode(opt.label);
        newOption.appendChild(text);
        this.node.insertBefore(newOption, nextGreater);
    },

    render: function() {
        if (this.debug) {
            console.log("render");
        }
        this.needle = this.filterBox.value.strip();
        if (this.debug) {
            console.log(this.lastNeedle + ":" + this.needle);
        }
        var self = this;
        if (!this.needle.empty()) {
            this.removeAll();
            this.options.each(function(opt) {
                if (opt.label.toLowerCase().indexOf(self.needle.toLowerCase()) > -1) {
                    self.renderOption(opt);
                }
            });
        } else if (this.needle != this.lastNeedle) {
            this.removeAll();
            this.options.each(function(opt) {
                self.renderOption(opt);
            });
        }
        this.lastNeedle = this.needle;
    },

    // Löscht Options HTML-Elemente aus dem DOM
    remove: function(label) {
        if (label != undefined) {
            var self = this;
            $A(this.node.options).each(function(e) {
                // console.log('REMOVE: e.innerHTML: ' + e.innerHTML + ' label:
                // ' + label);
                if (e.innerHTML == label || e.textContent == label) {
                    self.node.removeChild(e);
                }
            });
        } else {
            this.node.removeChild(this.node.firstChild);
        }
    },

    // Löscht Options HTML-Elemente aus dem DOM
    removeAll: function() {
        while (this.node.options.length > 0) {
            this.remove();
        }
    },

    // Löscht alle selektierten Options HTML-Elemente aus dem DOM
    removeSelected: function() {
        this.remove(this.getObjectsSelected());
    },

    loadOptions: function(options) {
        for (var k = 0; k < options.length; k++) {
            this.set(options[k].textContent, options[k].value);
        }
    },

    disable: function() {
        if (this.node != null) {
            this.node.addClassName("disabled");
            this.node.writeAttribute("disabled", true);
        }
    },

    enable: function() {
        this.node.removeClassName("disabled");
        this.node.writeAttribute("disabled", false);
    },

    isEnabled: function() {
        return this.node.readAttribute("disabled") != "disabled";
    },

    getLabelsAll: function() {
        var all = [];
        this.options.each(function(opt) {
            all.push(opt.label);
        });
        return all;
    },

    getValuesAll: function() {
        var all = [];
        this.options.each(function(opt) {
            all.push(opt.value);
        });
        return all;
    },

    getSelected: function(type) {
        var selected = [];
        for (var i = 0; i < this.node.options.length; i++) {
            if (this.node.options[i].selected) {
                if (type == 'label') {
                    selected.push(this.node.options[i].textContent);
                } else if (type == 'value') {
                    selected.push(this.node.options[i].value);
                } else if (type = 'object') {
                    selected.push(this.node.options[i]);
                }
            }
        }
        return selected;
    },

    getLabelsSelected: function() {
        return this.getSelected('label');
    },

    getValuesSelected: function() {
        return this.getSelected('value');
    },

    getObjectsSelected: function() {
        return this.getSelected('object');
    },

    getNextGreaterIndex: function(option) {
        var goliath = -1;
        this.options.each(function(opt, i) {
            if (goliath > -1) {
                throw $break;
            }
            if (this.debug) {
                console.log(option.label.toLowerCase() + " : " + opt.label.toLowerCase());
            }
            if (option.label.toLowerCase() < opt.label.toLowerCase()) {
                if (this.debug) {
                    console.log(option.label.toLowerCase() + " < " + opt.label.toLowerCase() + "i: " + i);
                }
                goliath = i;
            }
        });
        return (goliath > -1) ? goliath : this.options.length;
    }
});

var hideElementWithoutFocus = function(obj, test) {

    var hasFocus = obj.readAttribute('hasFocus');

    if (hasFocus == '0') {
        obj.hide();
    }
};

var searchUser = function(params) {

    if (params == null || params == undefined) {
        params = {};
    }

    params.search_username = $('userSearch_username').value;
    params.lastname = $('userSearch_lastname').value;
    params.prename = $('userSearch_prename').value;
    params.department = $('id_userSearch_department').value;
    params.ajaxSearch = true;

    new Ajax.Updater('searchUserResults', 'index.php?cmd=popup_SearchUser', {
        method: 'get',
        parameters: params,
        evalScripts: true,
        onCreate: function() {
            (new LoadingLayer('', true, false)).show();
        },
        onSuccess: function(transport) {
            (new LoadingLayer(null, false, false)).hide();
            var stepContentContainer = $('stepContentContainer');
            if (stepContentContainer != null) {
                stepContentContainer.hide();
            }
            TableKit.load;
        }
    });
};

var searchProcessUser = function(params) {

    if (params == null || params == undefined) {
        params = {};
    }

    params.search_username = $('userSearch_username').value;
    params.lastname = $('userSearch_lastname').value;
    params.prename = $('userSearch_prename').value;
    params.department = $('id_userSearch_department').value;
    params.processname = $('processname').value;
    params.version = $('version').value;
    params.ajaxSearch = true;

    new Ajax.Updater('searchUserResults', 'index.php?cmd=popup_SearchProcessUser', {
        method: 'get',
        parameters: params,
        evalScripts: true,
        onCreate: function() {
            (new LoadingLayer('', true, false)).show();
        },
        onSuccess: function(transport) {
            (new LoadingLayer(null, false, false)).hide();
            var stepContentContainer = $('stepContentContainer');
            if (stepContentContainer != null) {
                stepContentContainer.hide();
            }
            TableKit.load;
        }
    });
};

var searchJobFunction = function(args) {

    var params = {
        jobfunction: $('jobFunctionSearch_jobfunction').value,
        description: $('jobFunctionSearch_description').value,
        ajaxSearch: true
    };

    new Ajax.Updater('searchJobFunctionResults', 'index.php?cmd=popup_SearchJobFunction', {
        method: 'get',
        parameters: params,
        evalScripts: true,
        onCreate: function() {
            (new LoadingLayer('', true, false)).show();
        },
        onSuccess: function(transport) {
            (new LoadingLayer(null, false, false)).hide();
            // TableKit.load;
        }
    });
};
var confirmUser = function(username, lastname, prename, department, userImage) {

    if (jQuery(('id_' + filterLayer.input).buildJQueryIdSelector()).data('select2')) {
        confirmUserForSelect2(username, lastname, prename, department, userImage);
        return;
    }
    confirmUserForAutocomplete(username, lastname, prename, department);

};

var confirmUserForSelect2 = function(username, lastname, prename, department, userImage) {
    var $filterLayerInput = jQuery(('id_' + filterLayer.input).buildJQueryIdSelector());
    var data = $filterLayerInput.select2('data');

    if (userAlreadyExistsInSelection(username, data)) {
        return;
    }

    var existingUsers = '';

    data.each(function(value, key) {
        existingUsers += value['id'] + '#:#' + value["label"] + '#:#' + value["status"] + '#,#';
    });

    var allUsers = existingUsers + username + '#:#';
    if (userImage) {
        allUsers += '<img class="jr-form-select2-user-pic" src="' + userImage + '" alt="' + username + '">';
    }

    if (prename !== null) {
        allUsers += prename + ' ';
    }

    if (lastname !== null) {
        allUsers += lastname + ' ';
    }

    allUsers += '(' + username + ')' + '#:#ok';

    $filterLayerInput.select2('val', [allUsers]);

    confirmClickHandlerForFilterLayer();
};

var confirmUserForAutocomplete = function(username, lastname, prename, department) {

    $(filterLayer.input).value = username;

    if (filterLayer.display == 'display') {
        var fullname = '';

        if (prename !== null) {
            fullname += prename + ' ';
        }

        if (lastname !== null) {
            fullname += lastname;
        }

        fullname = jQuery.trim(fullname);
        if (fullname) {
            fullname += ' ';
        }

        $('display_' + filterLayer.input).value = fullname + '(' + username + ')';
    } else {
        $('display_' + filterLayer.input).value = username;
    }

    confirmClickHandlerForFilterLayer();
};

var userAlreadyExistsInSelection = function(username, data) {

    data.each(function(value, key) {
        if (value.id == username) {
            alert($JR_JS_CONSTANTS.CONST_VALUE_ALREADY_EXISTS);
            return true;
        }
    });
    return false;
}

var confirmClickHandlerForFilterLayer = function() {

    filterLayer.confirmClickHandler();

    // RAC / 15.01.2010 / IMPORTANT!!! / If called in step dialog,
    // hide dialog content (fix for overlay problem)!
    var stepContentContainer = $('stepContentContainer');
    if (stepContentContainer != null) {
        stepContentContainer.hide();
    }

};

var confirmJobFunction = function(jobfunction, description) {

    $(filterLayer.input).value = jobfunction;

    if (filterLayer.display == 'display') {
        $('display_' + filterLayer.input).value = jobfunction;
    } else {
        $('display_' + filterLayer.input).value = jobfunction;
    }

    filterLayer.confirmClickHandler();
};

var showCalendar = function(id, dateFormat, onUpdateCallback, showTime, language) {
    var format = '';

    try {
        dateFormat = $JR.UTILITY.getEffectiveDateFormat(dateFormat);
        switch (dateFormat) {
            case 1:
                format = '%d.%m.%Y';
                break;
            case 2:
                format = '%d/%m/%Y';
                break;
            case 3:
                format = '%m/%d/%Y';
                break;
            case 4:
                format = '%Y-%m-%d';
                break;
            default:
                format = '%d.%m.%Y';
                break;
        }

        if (showTime) {
            format += ' %H:%M:%S';
        }

        var configuration = {
            ifFormat: format,
            inputField: id,
            button: id + '_SelectDate'
        };

        if (typeof onUpdateCallback === 'function') {
            configuration.onUpdate = onUpdateCallback;
        }

        if (language) {
            configuration.language = language;
        }

        Calendar.setup(configuration);
    } catch(e) {
        $JR.NOTIFICATION.show(e, 'error');
    }
};

var updateField = function(element, target) {

    new Ajax.Updater(target, 'index.php?cmd=Ajax', {
        method: 'get',
        parameters: {
            cmd_target: 'updateField',
            target: target,
            value: element.value
        },
        evalScripts: true,
        onCreate: function() {
        },
        onSuccess: function(transport) {
        }
    });
};

var loadPrintView = function(cmd) {

    var newWindow = window.open('index.php?cmd=' + cmd + '&print=true', '_blank',
        'width=1024,height=768,left=100,top=200, menubar=yes, toolbar=yes');
    newWindow.focus();
};

var checkFormErrors = function(formId) {

    var noErrors = true;

    if (jQuery('.formTable .error').find(':visible').length > 0) {
        noErrors = false;
    }

    return noErrors;
};

var unCheckRadio = function(e) {

    this.checked = '';
};

var moveUp = function(element) {

    var rowElement = element.up(1);
    var preRowElement = rowElement.previous();
    switchRows(rowElement, preRowElement);
};

var moveDown = function(element) {

    var rowElement = element.up(1);
    var nextRowElement = rowElement.next();
    switchRows(nextRowElement, rowElement);
};

var switchRows = function(row, preRow) {

    var i = 0;
    var length = row.childElements().length;
    row.childElements().each(function(element) {
        if ((i > 0) && (i < (length - 3))) {
            var element = $(row.childElements()[i].childElements()[0]);
            var preElement = $(preRow.childElements()[i].childElements()[0]);
            switch (element.type) {
                case 'checkbox':
                    var tempChecked = element.checked;
                    element.checked = preElement.checked;
                    preElement.checked = tempChecked;
                    break;
                case 'radio':
                    var tempChecked = element.checked;
                    element.checked = preElement.checked;
                    preElement.checked = tempChecked;
                    break;
                default:
                    var tempValue = element.value;
                    element.value = preElement.value;
                    preElement.value = tempValue;
                    break;
            }
        } else {
        }
        i++;
    });
};

var moveRowUp = function(element) {

    // current element is <img> in <td>
    var rowElement = element.up().up(); // tr
    var tableElement = rowElement.up().up(); // table

    var preRowElement = rowElement.previous();
    var anchorElement = preRowElement.previous();
    anchorElement.insert({
        'after': rowElement
    });

    showOrHideMoveImages(tableElement.id);
};

var moveRowDown = function(element) {

    // current element is <img> in <td>
    var rowElement = element.up().up();
    var tableElement = rowElement.up().up();

    var nextRowElement = rowElement.next();
    var anchorElement = rowElement.previous();
    anchorElement.insert({
        'after': nextRowElement
    });

    showOrHideMoveImages(tableElement.id);
};

var showOrHideMoveImages = function(tableElement) {
    var tableRows = jQuery('#' + tableElement).find('tbody').find('tr');

    if (tableRows.length <= 2) {
        // only template and empty row
        return;
    }

    tableRows.find('.js-icon-move-down').show();
    tableRows.find('.js-icon-move-up').show();

    tableRows.eq(2).find('.js-icon-move-up').hide();
    tableRows.last().find('.js-icon-move-down').hide();
};

var showJobArchiveListOptions = function(element, heading, confirmText, abortText) {
    // remove existing formLayer to abort confirmClickHandler
    if ($('formLayer') != null) {
        $('formLayer').remove();
    }

    var fl = $JR.LAYERS.getFormLayer();

    fl.setHeading(heading);
    fl.setWidth('500');
    fl.setHeight('400');
    fl.setAbortText(abortText);
    fl.setConfirmText(confirmText);

    fl.setShowTransparent(true);
    fl.setHideTransparent(false);
    fl.setFormName('admintools_configuration');
    fl.setModule('jobarchive');
    fl.setModCmd('popup_showJobArchiveFilterOptions');

    var id = element.id;
    var elementIndex = id.substr(id.lastIndexOf('_') + 1);
    var maxInputLength = jQuery(('id_archivetableactions_field_size_' + elementIndex).buildJQueryIdSelector()).val();
    var fieldName = jQuery(('id_archivetableactions_field_name_' + elementIndex).buildJQueryIdSelector()).val();
    var loadPopupFromRequest = (jQuery.data(document.body, element.id) ? 1 : 0);

    var params = [
        jQuery('#id_id').val(), fieldName, $(element).value, loadPopupFromRequest, maxInputLength
    ];

    fl.setParameters(params);
    fl.setCommand('Admintools_Configuration');

    fl.setConfirmButtonListener(function(evt) {
        showJobArchiveListOptionsConfirmClickHandler(evt, element);
    });
    fl.show();
};

var showJobArchiveListOptionsConfirmClickHandler = function(evt, element) {

    var listLabelsAndOptions = {};

    jQuery('input[id^="id_hidden_archivefieldlist_option_labels_"]').
        not('#id_hidden_archivefieldlist_option_labels_template').each(function(index, currentElement) {
        var id = currentElement.id;
        var labelsAndOptionsIndex = id.substr(id.lastIndexOf('_') + 1);

        if (!listLabelsAndOptions[labelsAndOptionsIndex]) {
            listLabelsAndOptions[labelsAndOptionsIndex] = {};
        }

        listLabelsAndOptions[labelsAndOptionsIndex]['labels'] = jQuery(currentElement).val();
    });

    jQuery('input[id^="id_archivefieldlist_option_value_"]').not('#id_archivefieldlist_option_value_template').
        each(function(index, currentElement) {
            var id = currentElement.id;
            var labelsAndOptionsIndex = id.substr(id.lastIndexOf('_') + 1);

            if (!listLabelsAndOptions[labelsAndOptionsIndex]) {
                return;
            }

            listLabelsAndOptions[labelsAndOptionsIndex]['value'] = jQuery(currentElement).val();
        });

    $(element).value = Object.toJSON(listLabelsAndOptions);

    jQuery.data(document.body, element.id, 1);

    $('formLayer').hide();
    $('transparentLayer').hide();
};

//noinspection JSUnusedGlobalSymbols
var showJobSelectEditFilterOptions = function(element, heading, confirmText, abortText) {
    var fl = $JR.LAYERS.getFormLayer();

    // remove existing formLayer to abort confirmClickHandler
    fl.remove();

    fl.setHeading(heading);
    fl.setWidth('580');
    fl.setHeight('500');
    fl.setAbortText(abortText);
    fl.setConfirmText(confirmText);

    fl.setShowTransparent(true);
    fl.setHideTransparent(false);
    fl.setFormName('admintools_configuration');
    fl.setModule('jobselect');
    fl.setModCmd('popup_showQueryFilterOptions');

    var params = $(element).value;
    fl.setParameters(params);

    fl.setCommand('Admintools_Configuration');

    confirmClickHandler = function(evt) {

        var settings = {};

        settings['fieldType'] = $('p_fieldType').value;
        settings['elementType'] = $('p_elementType').value;

        var optionsArray = {};
        var count = $('jobselect_foptions_maxcount').value;
        for (var i = 1; i <= count; i++) {
            var $jobselectFOptionsOrdernum = jQuery('#id_jobselect_foptions_ordernum_' + i);
            if ($jobselectFOptionsOrdernum) {
                var ordernum = $jobselectFOptionsOrdernum.val();
                optionsArray[ordernum] = i;
            }
        }

        var sortedOptionsArray = {};
        var countSorted = $('jobselect_foptions_count').value;
        for (var i = 1; i <= countSorted; i++) {
            var number = optionsArray[i];
            var name = ($('id_jobselect_foptions_name_' + number).value).replace(/'/g, "#x#");
            var value = ($('id_jobselect_foptions_value_' + number).value).replace(/'/g, "#x#");
            sortedOptionsArray[name] = value;
        }
        settings['optionsContent'] = {};
        settings['optionsContent']['options'] = sortedOptionsArray;

        settings['optionsContent']['dbparams'] = {};
        settings['optionsContent']['dbparams']['db_connection_type'] = $(
            'id_jobselect_foptions_db_connection_type').value;
        settings['optionsContent']['dbparams']['db_username'] = $('id_jobselect_foptions_db_username').value;
        settings['optionsContent']['dbparams']['db_password'] = $('id_jobselect_foptions_db_password').value;
        settings['optionsContent']['dbparams']['hidden_db_password'] = $('hidden_jobselect_foptions_db_password').value;
        settings['optionsContent']['dbparams']['db_host'] = $('id_jobselect_foptions_db_host').value;
        settings['optionsContent']['dbparams']['db_name'] = $('id_jobselect_foptions_db_name').value;
        settings['optionsContent']['dbparams']['db_charset'] = $('id_jobselect_foptions_db_charset').value;
        settings['optionsContent']['dbparams']['dsn_name'] = $('id_jobselect_foptions_dsn_name').value;
        settings['optionsContent']['dbparams']['dsn_user'] = $('id_jobselect_foptions_dsn_user').value;
        settings['optionsContent']['dbparams']['dsn_password'] = $('id_jobselect_foptions_dsn_password').value;
        settings['optionsContent']['dbparams']['hidden_dsn_password'] = $(
            'hidden_jobselect_foptions_dsn_password').value;
        settings['optionsContent']['dbparams']['db_port'] = $('id_jobselect_foptions_db_port').value;
        settings['optionsContent']['dbparams']['db_type'] = $('id_jobselect_foptions_db_type').value;
        settings['optionsContent']['dbparams']['dbquery'] = ($('id_jobselect_foptions_sql').value).replace(/'/g, "#x#");

        settings = Object.toJSON(settings);
        $(element).value = settings;

        $('formLayer').hide();
        $('transparentLayer').hide();
    };

    fl.setConfirmButtonListener(confirmClickHandler);
    fl.show();
};

//noinspection JSUnusedGlobalSymbols
var showJobSelectEditResultIndex = function(element, heading, confirmText, abortText) {
    var fl = $JR.LAYERS.getFormLayer();

    // remove existing formLayer to abort confirmClickHandler
    fl.remove();

    fl.setHeading(heading);
    fl.setWidth('800');
    fl.setHeight('500');
    fl.setAbortText(abortText);
    fl.setConfirmText(confirmText);

    fl.setShowTransparent(true);
    fl.setHideTransparent(false);
    fl.setFormName('admintools_configuration');
    fl.setModule('jobselect');
    fl.setModCmd('popup_showQueryResultIndex');

    var params = $(element).value;
    var paramsValue = params.evalJSON();

    var settingName = ('id_' + $(element).id).replace(/index/g, 'settings');

    paramsValue.settingData = $(settingName).value;

    params = Object.toJSON(paramsValue);

    fl.setParameters(params);

    fl.setCommand('Admintools_Configuration');

    confirmClickHandler = function(evt) {

        var settings = {};

        var fieldType = $('p_fieldType').value;
        settings['fieldType'] = fieldType;

        var elementType = $('p_elementType').value;
        settings['elementType'] = elementType;

        settings['optionData'] = {};
        var count = $('jobselect_rindex_maxcount').value;
        for (var i = 1; i <= count; i++) {
            if ($('jobselect_rindex_row_' + i) != null) {
                settings['optionData'][i] = {};

                settings['optionData'][i]['value'] = ($('id_jobselect_rindex_value_' + i).value).replace(/'/g, "#x#");
                if (fieldType == 'image') {
                    settings['optionData'][i]['img'] = ($('id_jobselect_rindex_img_' + i).value).replace(/'/g, "#x#");
                    settings['optionData'][i]['text'] = ($('id_jobselect_rindex_text_' + i).value).replace(/'/g, "#x#");
                } else if (fieldType == 'script') {
                    settings['optionData'][i]['dbfield'] = ($('id_jobselect_rindex_dbfield_' + i).value).replace(/'/g,
                        "#x#");
                } else {
                    settings['optionData'][i]['id'] = ($('id_jobselect_rindex_id_' + i).value).replace(/'/g, "#x#");
                    settings['optionData'][i]['dbfield'] = ($('id_jobselect_rindex_dbfield_' + i).value).replace(/'/g,
                        "#x#");
                }
            }
        }

        settings = Object.toJSON(settings);
        $(element).value = settings;

        $('formLayer').hide();
        $('transparentLayer').hide();
    };

    fl.setConfirmButtonListener(confirmClickHandler);
    fl.show();
};

var reorderJobSelectList = function(tableElement) {
    var excludedItems = new Array(tableElement + '_header', tableElement + '_row_empty', tableElement +
        '_row_template');
    var i = 1;
    $$('#' + tableElement + ' tr').each(function(item) {
        if ($JR.UTILITY.inArray(item.id, excludedItems) == false) {
            $(item).down().down().value = i;
            i++;
        }
    });
};

var removeSelected = function(elSelect, callback) {

    for (var i = elSelect.length - 1; i >= 0; i--) {
        if (elSelect.options[i].selected) {
            elSelect.remove(i);
            if (elSelect.options.length == 0) {
                if (callback.onEmpty != null) {
                    callback.onEmpty();
                }
            }
            i = 0;
        }
    }
};

var insertSelected = function(elSelect, newElement, callback) {

    var elOptNew = document.createElement('option');
    elOptNew.text = newElement.text;
    elOptNew.value = newElement.value;

    try {
        elSelect.options.add(elOptNew, null); // standards compliant; doesn't
        // work in IE
    } catch(ex) {
        elSelect.options.add(elOptNew); // IE only
    }
    if (callback.onInsert != null) {
        callback.onInsert();
    }
};

var editJobSAPLogin = function(id, heading, confirmText, abortText) {

    // remove existing formLayer to abort confirmClickHandler
    if ($('formLayer') != null) {
        $('formLayer').remove();
    }

    var fl = $JR.LAYERS.getFormLayer();

    fl.setHeading(heading);
    fl.setWidth('550');
    fl.setHeight('400');
    fl.setAbortText(abortText);
    fl.setConfirmText(confirmText);
    fl.setShowTransparent(true);
    fl.setHideTransparent(false);
    fl.setFormName('account_options');
    fl.setModule('jobsap');
    fl.setModCmd('popup_editLogin');

    fl.setParameters(id);

    // GRL / 18.04.2012 / Rechte-Problem beim Ändern der SAP-Benutzerdaten
    // gefixt. #1993
    fl.setCommand('Account_Options');

    confirmClickHandler = function(evt) {

        var settings = {};

        settings['DestSystem'] = $('id_DestSystem').value;
        settings['DestMandant'] = $('id_DestMandant').value;
        settings['DestSprache'] = $('id_DestSprache').value;
        settings['DestUser'] = $('id_DestUser').value;
        settings['DestPasswort'] = $('id_DestPasswort').value;
        settings['OldDestPasswort'] = $('oldPassword').value;
        settings['OldDestSystem'] = $('oldDestSystem').value;
        settings = Object.toJSON(settings);

        new Ajax.Updater('jobSAPUserLogins', 'index.php?cmd=Ajax', {
            method: 'get',
            parameters: {
                cmd_target: 'updateSAPLogin',
                settings: settings,
                mode: $('mode').value
            },
            evalScripts: true,
            onSuccess: function(transport) {
                $('formLayer').hide();
                $('transparentLayer').hide();
            }
        });
    };

    fl.setConfirmButtonListener(confirmClickHandler);
    fl.show();
};

var deleteJobSAPLogin = function(heading, confirmText, abortText) {

    // remove existing formLayer to abort confirmClickHandler
    if ($('formLayer') != null) {
        $('formLayer').remove();
    }

    var fl = $JR.LAYERS.getFormLayer();

    fl.setHeading(heading);
    fl.setWidth('400');
    fl.setHeight('350');
    fl.setAbortText(abortText);
    fl.setConfirmText(confirmText);
    fl.setShowTransparent(true);
    fl.setHideTransparent(false);
    fl.setFormName('admintools_configuration');
    fl.setModule('jobsap');
    fl.setModCmd('popup_deleteLogin');

    var elements = new Array();
    for (var i = 0; i < document.getElementsByName('cbsap[]').length; i++) {
        if (document.getElementsByName('cbsap[]')[i].checked) {
            elements[i] = document.getElementsByName('cbsap[]')[i].value;
        }
    }
    fl.setParameters(elements);

    fl.setCommand('Admintools_Configuration');

    confirmClickHandler = function(evt) {

        var settings = {};
        settings['selectedSAPLogins'] = $('selectedSAPLogins').value;
        settings = Object.toJSON(settings);

        new Ajax.Updater('jobSAPUserLogins', 'index.php?cmd=Ajax', {
            method: 'get',
            parameters: {
                cmd_target: 'deleteSAPLogins',
                settings: settings
            },
            evalScripts: true,
            onSuccess: function(transport) {
                $('formLayer').hide();
                $('transparentLayer').hide();
            }
        });
    };

    fl.setConfirmButtonListener(confirmClickHandler);
    fl.show();
};

var updateView = function(cmd, parameter, callback, blnLayer) {

    var showLayer = true;
    if (blnLayer != null) {
        showLayer = blnLayer;
    }

    var jrBackendFile = 'index';
    if (parameter.jrMode != null) {
        if (parameter.jrMode == 'designer') {
            jrBackendFile = 'designer';
        }
    }

    new Ajax.Updater('jr-main-content', jrBackendFile + '.php?cmd=' + cmd, {
        method: 'post',
        parameters: Object.toQueryString(parameter),
        evalScripts: true,
        onCreate: function() {
            if (showLayer) {
                layer = new LoadingLayer('', true, true);

                window.onscroll = function(e) {
                    $JR_LAYERS.each(function(element) {
                        element.value.refreshPosition(e);
                    });
                };
                window.onresize = function(e) {
                    $JR_LAYERS.each(function(element) {
                        element.value.refreshPosition(e);
                        element.value.refreshSize(e);
                    });
                };

                layer.show();
                (new LoadingLayer('', true, false)).show();
            }
        },
        onSuccess: function(transport) {
            if (showLayer) {
                layer.hide();
            }
            if (typeof callback === 'object' && typeof callback.onSuccess === 'function') {
                callback.onSuccess();
            }

        },
        onComplete: function() {
            if (typeof callback === 'object' && typeof callback.onComplete === 'function') {
                callback.onComplete();
            }
            TableKit.load();
        },
        onFailure: function() {
            alert($JR_JS_CONSTANTS.CONST_ERROR);
        }
    });
};

var checkActionRights = function(element, types) {
    $('id_actions').length = 0;

    var newTypes = checkActionRightsDetermineTypes(element, types);

    var typeNames = newTypes.names;
    var typesArray = newTypes.array;

    jr_add_element('actions', '', '-');

    typeNames.each(function(attr) {
        if (typesArray[attr] == 1) {
            jr_add_element('actions', types[attr].id, types[attr].label);
        }
    });
};

var checkActionRightsDetermineTypes = function(element, types) {
    var typeNames = Object.keys(types);

    var typesArray = [];

    typeNames.each(function(attr) {
        typesArray[attr] = 1;
    });

    var eleName = element.name || 'cb[]';

    var elements = $A(document.getElementsByName(eleName));
    var checkedElements = [];
    var i = 0;

    elements.each(function(el) {
        if (el.checked && el.id != 'cb_all') {
            checkedElements[i] = el;
            i++;
        }
    });

    if (checkedElements.length == 0) {
        typeNames.each(function(attr) {
            typesArray[attr] = 0;
        });
    } else {
        checkedElements.each(function(el) {
            typeNames.each(function(attr) {
                if ($(el).readAttribute(attr) == null || $(el).readAttribute(attr) == '0' ||
                    $(el).readAttribute(attr) == '') {
                    typesArray[attr] = 0;
                }
            });
        });
    }

    return {
        names: typeNames,
        array: typesArray
    };
};

var jr_add_element = function(object, id, name) {
    var newOpt = document.createElement('option');
    newOpt.value = id;
    newOpt.text = name;

    try {
        document.getElementsByName(object)[0].add(newOpt, null);
    } catch(e) {
        document.getElementsByName(object)[0].add(newOpt);
    }
};

var toggleBox = function(boxId, callback) {

    var box = $(boxId);

    if (box.visible()) {
        box.hide();
        if (callback.onHide != null) {
            callback.onHide();
        }
    } else {
        box.show();
        if (callback.onShow != null) {
            callback.onShow();
        }
    }
    if (callback.onToggle != null) {
        callback.onToggle();
    }

    jQuery(window).trigger('resize');
};

var updateObjectConfiguration = function() {

    new Ajax.Updater('messagesId', 'index.php?cmd=Ajax', {
        method: 'get',
        parameters: {
            cmd_target: 'updateObjects'
        },
        evalScripts: true,
        onSuccess: function(transport) {
        },
        onFailure: function() {
            alert($JR_JS_CONSTANTS.CONST_ERROR);
        }
    });
};

var updateMessage = function(message) {

    new Ajax.Updater('messagesId', 'index.php?cmd=Ajax', {
        method: 'get',
        parameters: {
            cmd_target: 'updateMessage',
            message: message
        },
        evalScripts: true,
        onSuccess: function(transport) {
        },
        onFailure: function() {
            alert($JR_JS_CONSTANTS.CONST_ERROR);
        }
    });
};

var showPopup = function(type, input, display, args, callback, params) {
    if ($('contentLayer') != null) {
        $('contentLayer').remove();
    }

    var popupLayer = new ContentLayer($JR.UTILITY.layerHeading, true, true, true);
    popupLayer.confirmText = $JR.UTILITY.confirmText;
    popupLayer.abortText = $JR.UTILITY.abortText;
    popupLayer.showConfirmButton = false;
    popupLayer.width = 600;
    popupLayer.height = 600;
    popupLayer.display = display;
    popupLayer.input = input;
    if (params != null) {
        popupLayer.params = params;
    }

    if (args != null) {
        popupLayer.commandArgs = args;
    }
    if (callback != null) {
        popupLayer.onClose = callback.onClose;
        popupLayer.onAbort = callback.onAbort;
        popupLayer.onConfirm = callback.onConfirm;
    }

    popupLayer.command = type;
    popupLayer.show();

    window.onscroll = function(e) {
        $JR_LAYERS.each(function(element) {
            element.value.refreshPosition(e);
        });
    };
    window.onresize = function(e) {
        $JR_LAYERS.each(function(element) {
            element.value.refreshPosition(e);
            element.value.refreshSize(e);
        });
    };
};

var showProcessTablePopup = function(requestParameters) {
    var command = 'popup_ShowProcessTable';
    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();

    jQuery.get("index.php?cmd=" + command, requestParameters, function() {
    }).always(function() {
        loadingLayer.hide();
    }).done(function(responseObject) {
        var dialog = $JR.widget.dialog('processtablevalues', {
            close: function(event, ui) {
                jQuery(this).dialog('close').dialog('destroy').remove();
            }
        });

        dialog.setTitle(
            jr_get_constant_value('CONST_PROCESS_TABLE') + ' / ' + jr_get_constant_value('CONST_SUBTABLES'));
        dialog.setContent(responseObject);
        dialog.setOptions({
            modal: true,
            width: 900,
            minWidth: (jQuery(window).width() / 100 * 50),
            minHeight: 500,
            maxHeight: jQuery(window).height() - 50,
            buttons: [
                {
                    text: jr_get_constant_value('CONST_CLOSE'),
                    click: function() {
                        jQuery(this).dialog("close");
                    },
                    css: {
                        'z-index': '100'
                    }
                }
            ]
        });

        if (requestParameters.selectedTable) {
            jQuery('#id_selectedTable').val(requestParameters.selectedTable);
        }

        jQuery('#processtablevalues').find('.mainBoxContent').css({
            'overflow': 'auto'
        });

        dialog.open();
    });
};

var showStepHistoryPopup = function(requestParameters) {
    var command = 'popup_ShowStepHistory';
    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();

    jQuery.get("index.php?cmd=" + command, requestParameters, function() {
    }).always(function() {
        loadingLayer.hide();
    }).done(function(responseObject) {
        var dialog = $JR.widget.dialog('stephistoryentries', {
            close: function(event, ui) {
                jQuery(this).dialog('close').dialog('destroy').remove();
            }
        });

        dialog.setTitle(jr_get_constant_value('CONST_LOG'));
        dialog.setContent(responseObject);
        dialog.setOptions({
            modal: true,
            width: 900,
            minWidth: (jQuery(window).width() / 100 * 50),
            minHeight: 500,
            maxHeight: jQuery(window).height() - 50,
            buttons: [
                {
                    text: jr_get_constant_value('CONST_CLOSE'),
                    click: function() {
                        jQuery(this).dialog("close");
                    },
                    css: {
                        'z-index': '100'
                    }
                }
            ]
        });

        // TODO FACELIFT noch notwendig?
        // jQuery('#stephistoryentries').find('.mainBoxContent').css(
        //     {
        //         'overflow': 'auto'
        //     }
        // );

        dialog.open();

        if (jQuery("div.popup.pager").length == 0) {
            return;
        }
    });
};

var showIncidentHistoryPopup = function(requestParameters) {
    var command = 'popup_ShowIncidentHistory';
    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();

    jQuery.get("index.php?cmd=" + command, requestParameters, function() {
    }).always(function() {
        loadingLayer.hide();
    }).done(function(responseObject) {
        var dialog = $JR.widget.dialog('incidenthistoryentries', {
            close: function(event, ui) {
                jQuery(this).dialog('close').dialog('destroy').remove();
            }
        });

        dialog.setTitle(jr_get_constant_value('CONST_LOG'));
        dialog.setContent(responseObject);
        dialog.setOptions({
            modal: true,
            width: 900,
            minWidth: (jQuery(window).width() / 100 * 50),
            minHeight: 500,
            maxHeight: jQuery(window).height() - 50,
            buttons: [
                {
                    text: jr_get_constant_value('CONST_CLOSE'),
                    click: function() {
                        jQuery(this).dialog("close");
                    },
                    css: {
                        'z-index': '100'
                    }
                }
            ]
        });

        dialog.open();
    });
};

var showMapIconText = function(element) {

    var spanElement = $(element).select('span')[0];
    spanElement.show();
};

var hideMapIconText = function(element) {

    var spanElement = $(element).select('span')[0];
    spanElement.hide();
};

var switchArea = function(displayElements, allElements, prefix, callback) {

    if (!jQuery.isArray(displayElements)) {
        displayElements = [displayElements];
    }

    allElements.each(function(element) {
        var $element = jQuery((prefix + element).buildJQueryIdSelector());
        if (jQuery.inArray(element, displayElements) != -1) {
            $element.show();
        } else {
            if (jQuery.inArray(element, displayElements) == -1) {
                $element.hide();
            }
        }
    });

    if (typeof callback !== 'undefined' && Object.isFunction(callback)) {
        callback();
    }
};

var resizeLabelColumn = function(columnId) {

    var maxElemLabelWidth = 0;
    if ($(columnId) != null) {
        $(columnId).select('table.element .dialogElementLabel').each(function(elem) {
            if (elem.getWidth() > maxElemLabelWidth) {
                maxElemLabelWidth = elem.getWidth();
            }
        });
        $(columnId).select('table.element .dialogElementLabel').each(function(elem) {
            elem.setStyle({
                'width': maxElemLabelWidth + 'px'
            });
        });
    }
};

var confirmSwitchDialogHistoryTable = function(heading, processname, version, dialog, id) {

    $('contentLayer').remove();

    var type = 'ConfirmSwitchDialog';
    var display = '';
    var input = '';
    var args = '';
    var params = {
        dialog: dialog,
        id: id
    };

    var doSwitchHistoryTable = function() {
        switchHistoryTable(processname, version, dialog, id);
    };

    var callback = {
        onConfirm: doSwitchHistoryTable
    };

    var popupLayer = $JR.LAYERS.getContentLayer();

    popupLayer.heading = heading;
    popupLayer.confirmText = $JR.UTILITY.confirmText;
    popupLayer.abortText = $JR.UTILITY.abortText;
    popupLayer.showConfirmButton = true;
    popupLayer.width = 350;
    popupLayer.height = 200;
    popupLayer.display = display;
    popupLayer.input = input;
    if (params != null) {
        popupLayer.params = params;
    }

    if (args != null) {
        popupLayer.commandArgs = args;
    }
    if (callback != null) {
        popupLayer.onConfirm = callback.onConfirm;
    }

    popupLayer.command = type;
    popupLayer.show();

    window.onscroll = function(e) {
        $JR_LAYERS.each(function(element) {
            element.value.refreshPosition(e);
        });
    };
    window.onresize = function(e) {
        $JR_LAYERS.each(function(element) {
            element.value.refreshPosition(e);
            element.value.refreshSize(e);
        });
    };
};

var switchHistoryTable = function(processname, version, dialog, id) {

    new Ajax.Request('index.php', {
        method: 'post',
        parameters: {
            cmd: 'Ajax',
            cmd_target: 'switchHistoryTable',
            processname: processname,
            version: version,
            dialog: dialog,
            id: id
        },
        onSuccess: function(transport) {
            var response = transport.responseText.evalJSON(true);
            if (response.result == true) {
                location.href = 'designer.php?cmd=dialogs_DialogEditor&process=' + processname + '&version=' + version +
                    '&dialog=' + dialog + '&dialogtype=desktop';
            } else {
                alert($JR_JS_CONSTANTS.CONST_ERROR);
            }
        }
    });
};

var openActions = function(id) {
    var $container = jQuery('#actions_' + id);
    var $icon = jQuery('#actions_' + id + '_image');

    $icon.removeClass();
    if ($container.is(':visible')) {
        $icon.addClass('jr-icon-chevron-down jr-form-control-icon');
        $container.hide();
        return;
    }

    $icon.addClass('jr-icon-chevron-up jr-form-control-icon');
    $container.show();
};

function clearTinyEditor(sWhich) {
    try {
        tinyMCE.triggerSave();
        tinyMCE.execCommand('mceFocus', false, sWhich);
        tinyMCE.execCommand('mceRemoveControl', false, sWhich);
    } catch(e) {
    }
}

var validationMessages = [];

var insertValidationErrorMessage = function() {
    if (validationMessages.length === 0) {
        return;
    }

    $JR.NOTIFICATION.removeAll();

    $(validationMessages).each(function(el) {
        if (el.name.endsWith(':')) {
            el.name = el.name.substr(0, el.name.length - 1);
        }
        $JR.NOTIFICATION.show(el.name + ': ' + el.message, 'error');
    });

    if (typeof resizeContent == 'function') {
        resizeContent();
    }
};

var addValidationErrorMessage = function(validationMessage) {

    var exists = false;

    for (var i = 0; i < validationMessages.length; ++i) {
        if (validationMessages[i].identifier == validationMessage.identifier &&
            validationMessages[i].validation == validationMessage.validation) {
            exists = true;

            if (validationMessages[i].name != validationMessage.name) {
                validationMessages[i].name = validationMessage.name;
            }
        }
    }

    if (!exists) {
        validationMessages.push(validationMessage);
    }
};

var removeValidationErrorMessage = function(identifier, validation) {

    var newValidationMessages = [];
    for (var i = 0; i < validationMessages.length; ++i) {

        if (validationMessages[i].identifier == identifier && validationMessages[i].validation == validation) {
            continue;
        } else {
            newValidationMessages.push(validationMessages[i]);
        }
    }

    validationMessages = newValidationMessages;
};

var clearValidationErrorMessages = function() {

    validationMessages = [];
};

/**
 * Funktion für die Aktualisierung von SQL-Elementen.
 */

var http_request = false;
var jr_xml_request_in_progress = false;
var requests_in_progress = $H();

var refresh_element = function(elementName, successCallback, errorCallback, elements) {

    if ($(elementName) == null) {
        $JR.NOTIFICATION.show('Given element "' + elementName + '" doesn\'t exist in dialog!', 'error');
        return;
    }

    var elementSelector = elementName.buildJQueryIdSelector();
    var elementType = null;
    var oldValue = null;
    var oldAutoCompleteValue = null;
    var oldAutoCompleteDisplayValue = null;

    var oldLabel = null;
    var $label = jQuery(elementSelector + '_label');
    if ($label && $label[0]) {
        oldLabel = $label[0].innerHTML;
    }

    var oldLabel2 = null;
    var $label2 = jQuery(elementSelector + '_label2');
    if ($label2 && $label2[0]) {
        oldLabel2 = $label2[0].innerHTML;
    }

    if ($(elementName).hasClassName('sqlTextbox')) {
        elementType = 'SqlTextbox';
        oldValue = jQuery(elementSelector).val();
    } else if ($(elementName).hasClassName('sqlCheckbox')) {
        elementType = 'SqlCheckbox';
        oldValue = jQuery(elementSelector).val();
        // Autocomplete - Element
    } else if ($('display_' + elementName) != null && $('display_' + elementName).hasClassName('sqlList')) {
        elementType = 'SqlList';
        oldValue = jQuery(elementSelector).val();
        oldAutoCompleteValue = $(elementName).retrieve('value');
        oldAutoCompleteDisplayValue = $('display_' + $(elementName).id).getValue();
    } else if ($(elementName).hasClassName('sqlList')) {
        elementType = 'SqlList';
        oldValue = jQuery(elementSelector).val();
        if ($(elementName).hasClassName('selectBox')) {
            checkSelectBoxEntry(elementName, 'refresh', successCallback, errorCallback);
            return;
        }
    } else if ($(elementName).hasClassName('sqlTable')) {
        elementType = 'SqlTable';
    }

    if (elementType == null) {
        $JR.NOTIFICATION.show('Given element "' + elementName + '" is not a refreshable SQL element!', 'error');
        return;
    }

    var url = 'index.php';
    var params = null;
    var loadingImage = getSmallSpinner();

    if ($('dialogForm')) {
        params = $('dialogForm').serialize(true);
    } else {
        params = $H();
    }

    var elementIsVisible = $('div_' + elementName).visible();

    if ($('display_' + elementName)) {
        $('display_' + elementName).replace(loadingImage);
    } else {
        $(elementName).replace(loadingImage);
    }

    params.cmd = 'Ajax_SqlRefresh';
    params.elementName = elementName;
    params.elementType = elementType;

    http_request = new Ajax.Request(url, {
        method: 'post',
        parameters: params,
        onCreate: function() {
            jr_xml_request_in_progress = true;
            requests_in_progress.set(elementName, true);
        },
        onSuccess: function(transport) {
            requests_in_progress.set(elementName, false);
            var otherRequestsStillRunning = false;
            requests_in_progress.values().each(function(bool) {
                if (bool) {
                    otherRequestsStillRunning = true;
                    return;
                }
            });
            if (!otherRequestsStillRunning) {
                jr_xml_request_in_progress = false;
            }
            var response = transport.responseText.evalJSON(true);
            if (response.status == 'success') {
                jQuery(('div_' + elementName).buildJQueryIdSelector()).replaceWith(response.value);
                var newElement = $(elementName);
                if (newElement !== null && newElement.hasClassName('sqlList')) {
                    newElement.value = oldValue;
                    if (newElement.selectedIndex === -1) {
                        newElement.selectedIndex = 0;
                    }
                }

                if ($('display_' + elementName) != null && $('display_' + elementName).hasClassName('sqlList')) {
                    newElement.value = oldAutoCompleteValue;
                    $('display_' + newElement.id).value = oldAutoCompleteDisplayValue;
                }

                if (newElement !== null) {
                    if (newElement.hasClassName('sqlTable')) {
                        newElement.store('type', 'sqltable');
                    } else if (newElement.hasClassName('sqlTextbox') || newElement.hasClassName('sqlCheckbox') ||
                        newElement.hasClassName('sqlList')) {
                        newElement.store('value', oldValue);
                        // Autocomplete - Element
                    } else if ($('display_' + elementName) != null &&
                        $('display_' + elementName).hasClassName('sqlList')) {
                        newElement.store('value', oldValue);
                    }
                    if ($(elementName + '_label')) {
                        $(elementName + '_label').innerHTML = oldLabel;
                    }
                    if ($(elementName + '_label2')) {
                        $(elementName + '_label2').innerHTML = oldLabel2;
                    }
                }

                if (elementIsVisible) {
                    jr_show(elementName);
                } else {
                    jr_hide(elementName);
                }
                if (Object.isFunction(successCallback)) {
                    successCallback(elementName, oldValue);
                }
                if (elements != null && Object.isArray(elements) && elements.size() > 0) {
                    refresh_element(elements.first(), successCallback, errorCallback,
                        elements.without(elements.first()));
                }
            } else if (response.status == 'error' && Object.isFunction(errorCallback)) {
                errorCallback(elementName, response.message);
            }
        },
        onComplete: function() {

        },
        onFailure: function() {
            requests_in_progress.set(elementName, false);
            jr_xml_request_in_progress = false;
            if (Object.isFunction(errorCallback)) {
                errorCallback(elementName, 'Error executing SQL refresh. AJAX request failed.');
            }
        }
    });
};

var refresh_elements = function(elements, successCallback, errorCallback) {

    var url = 'index.php';
    var params = null;
    var loadingImage = getSmallSpinner();

    if ($('dialogForm')) {
        params = $('dialogForm').serialize(true);
    } else {
        params = $H();
    }

    params.cmd = 'Ajax_SqlRefreshMultiple';
    params.elements = $H();

    elements.each(function(element) {
        var elementName = element.id;
        var elem = $(elementName);
        var elementType = null;
        if (elem !== null) {
            if (elem.hasClassName('sqlTextbox')) {
                elementType = 'SqlTextbox';
            } else if (elem.hasClassName('sqlCheckbox')) {
                elementType = 'SqlCheckbox';
            } else if (elem.hasClassName('sqlList')) {
                elementType = 'SqlList';
            } else if (elem.hasClassName('sqlTable')) {
                elementType = 'SqlTable';
            }
            if (elementType !== null) {
                // Element durch Loading-Grafik ersetzen
                elem.replace(loadingImage);
                params.elements.set(elementName, elementType);
            }
        }
    });

    params.elements = Object.toJSON(params.elements);

    http_request = new Ajax.Request(url, {

        method: 'post',
        parameters: params,
        onCreate: function() {
            jr_xml_request_in_progress = true;
            elements.each(function(element) {
                requests_in_progress.set(element.id, true);
            });
        },
        onSuccess: function(transport) {
            elements.each(function(element) {
                var elementName = element.id;
                if (elementName.substring(0, 8) == 'display_') {
                    elementName = elementName.substr(8);
                }
                requests_in_progress.set(elementName, false);
            });
            jr_xml_request_in_progress = false;
            var response = transport.responseText.evalJSON(true);
            if (response.status == 'success') {
                elements.each(function(element) {
                    var elementName = element.id;
                    if (elementName.substring(0, 8) == 'display_') {
                        elementName = elementName.substr(8);
                    }
                    if ($('div_' + elementName) !== null) {
                        $('div_' + elementName).replace(response.value[elementName]);
                    }
                    var newElement = $(elementName);
                    if (newElement !== null && newElement.hasClassName('sqlList')) {
                        newElement.value = element.value;
                    }
                });
                if (Object.isFunction(jr_step_onload)) {
                    jr_step_onload();
                }
                if (Object.isFunction(successCallback)) {
                    successCallback('__sqlElements__', null);
                }
            } else if (response.status == 'error' && Object.isFunction(errorCallback)) {
                errorCallback(elementName, response.message);
            }
        },
        onFailure: function() {
            elements.each(function(element) {
                var elementName = element.id;
                if (elementName.substring(0, 8) == 'display_') {
                    elementName = elementName.substr(8);
                }
                requests_in_progress.set(elementName, false);
            });
            jr_xml_request_in_progress = false;
            if (Object.isFunction(errorCallback)) {
                errorCallback(elementName, 'Error executing SQL refresh. AJAX request failed.');
            }
        }
    });
};

var evalScript = function(scripts) {

    try {

        if (scripts != '') {
            var script = "";
            scripts = scripts.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function() {
                if (scripts !== null) {
                    script += arguments[1] + '\n';
                }
                return '';
            });
            if (script) {
                window.setTimeout(script, 1000);
            }

        }

        return false;

    } catch(e) {
        alert(e);
    }
};

var jr_load_section = function(sectionName, params) {

    if (!params) {
        params = {};
    }

    if (jr_xml_request_in_progress == true) {
        var originalArguments = arguments;
        window.setTimeout(function() {
            jr_load_section.apply(null, originalArguments);
        }, 100);
        return;
    }

    var url = 'index.php';
    var requestParams = null;
    var successCallback = null;
    var errorCallback = null;
    var loadAsync = false;
    var showLoadingLayer = false;

    if (params.successCallback !== undefined) {
        successCallback = params.successCallback;
    }

    if (params.errorCallback !== undefined) {
        errorCallback = params.errorCallback;
    }

    if (params.asynchronous !== undefined) {
        loadAsync = params.asynchronous;
    }

    if (params.showLoadingLayer !== undefined) {
        showLoadingLayer = params.showLoadingLayer;
    }

    if (!loadAsync && Prototype.Browser.IE) {
        showLoadingLayer = false;
    }

    if ($('dialogForm')) {
        requestParams = $('dialogForm').serialize(true);
    } else {
        requestParams = $H();
    }

    requestParams.cmd = 'Ajax_LoadSection';
    requestParams.sectionName = sectionName;
    requestParams.jr_section_visible = true;

    new Ajax.Request(url, {

        method: 'post',
        parameters: requestParams,
        asynchronous: loadAsync,
        onCreate: function() {
            jr_xml_request_in_progress = true;
            if (showLoadingLayer) {
                (new LoadingLayer('', true, true, true)).show();
            }
        },
        onSuccess: function(transport) {
            jr_xml_request_in_progress = false;
            var response = transport.responseText;
            if (response.isJSON()) {
                response = response.evalJSON(false);
                if (showLoadingLayer) {
                    (new LoadingLayer('', true, true, true)).hide();
                }
                if (response.status == 'error' && Object.isFunction(errorCallback)) {
                    errorCallback.defer(sectionName, response.message);
                }
            } else {

                evalScript(response);

                jQuery(('div_' + sectionName).buildJQueryIdSelector()).replaceWith(response).promise().done(function() {

                    if ($$('#' + sectionName + ' table.rowContainer tr').length == 0) {
                        $$('#' + sectionName + ' table.rowContainer')[0].append('<tr />');
                    }

                    jr_show_section(sectionName);

                    if (showLoadingLayer) {
                        (new LoadingLayer('', true, true, true)).hide();
                    }
                    if (Object.isFunction(successCallback)) {
                        successCallback.defer(sectionName);
                    }
                });
            }
        },
        onFailure: function() {
            jr_xml_request_in_progress = false;
            if (showLoadingLayer) {
                (new LoadingLayer('', true, true, true)).hide();
            }
            if (Object.isFunction(errorCallback)) {
                errorCallback.defer(sectionName, 'Error loading section. AJAX request failed.');
            }
        }
    });
};

var convertDateValuesInSubtableData = function(subtableData, subtableViewName) {
    for (var i in subtableData) {
        for (var j in subtableData[i]) {
            if (!(subtableData[i][j] instanceof Date)) {
                continue;
            }

            var subtableViewElementHeader = $('div_' + subtableViewName + '_' + j + '_header');
            if (!subtableViewElementHeader) {
                continue;
            }
            var dateFormat = subtableViewElementHeader.retrieve('dateFormat');
            if (!dateFormat) {
                continue;
            }
            var includeTime = subtableViewElementHeader.retrieve('includeTime');
            var formatPattern = $JR.UTILITY.getMomentJSFormatPattern(dateFormat, includeTime);
            subtableData[i][j] = moment(subtableData[i][j]).format(formatPattern);
        }
    }

    return subtableData;
};

var jr_subtable_init = function(subtableViewName, subtableData, successCallback, errorCallback) {

    var subtableViewId = jQuery(('div_' + subtableViewName).buildJQueryIdSelector()).find('.subtableView').attr('id');
    var subtableView = $JR.DIALOG.SUBTABLE.getSubtable(subtableViewId);
    if (typeof subtableView !== 'object') {
        throw new JobRouterException('No SubtableView ' + subtableViewName + ' found!', 'error');
    }

    var url = 'index.php';
    var params = null;

    if ($('dialogForm')) {
        params = $('dialogForm').serialize(true);
    } else {
        params = $H();
    }

    params.cmd = 'Ajax_InitSubtable';
    params.subtableView = subtableViewName;
    subtableData = convertDateValuesInSubtableData(subtableData, subtableViewName);
    params.subtableData = Object.toJSON(subtableData);
    params.jr_reload = 1;

    new Ajax.Request(url, {
        method: 'post',
        parameters: params,
        evalJS: false,
        asynchronous: false,
        onCreate: function() {
            if (!Prototype.Browser.IE) {
                (new LoadingLayer('', true, true, true)).show();
            }
        },
        onSuccess: function(transport) {
            var response = transport.responseText;
            if (response.isJSON()) {
                response = response.evalJSON(false);
                if (!Prototype.Browser.IE) {
                    (new LoadingLayer('', true, true, true)).hide();
                }
                if (response.status == 'error' && Object.isFunction(errorCallback)) {
                    errorCallback(subtableViewName, response.message);
                }
            } else {

                $(subtableView.getName()).select("tbody .subtable_rowinfo").each(function(elem) {
                    elem.down().checked = true;
                });
                subtableView.removeRows();

                var deletedSubtableRows = $(subtableViewId + '_rows_deleted').value;

                evalScript(response);

                jQuery(('div_' + subtableViewName).buildJQueryIdSelector()).replaceWith(response).promise().
                    done(function() {
                        jr_show(subtableViewName);
                        $(subtableViewId + '_rows_deleted').value = deletedSubtableRows;

                        if (!Prototype.Browser.IE) {
                            (new LoadingLayer('', true, true, true)).hide();
                        }
                        if (Object.isFunction(successCallback)) {
                            successCallback(subtableViewName);
                        }
                    });
            }
        },
        onFailure: function() {
            if (!Prototype.Browser.IE) {
                (new LoadingLayer('', true, true, true)).hide();
            }
            if (Object.isFunction(errorCallback)) {
                errorCallback(subtableViewName, 'Error initializing subtable view. AJAX request failed.');
            }
        }
    });
};

var jr_get_subtable_column_type = function(subtableViewName, columnName) {
    var baseId = subtableViewName + '_' + columnName + '_';
    var subtableViewElement = jQuery('[id^=\'' + baseId + '\']');
    var autocompleteColumn = jQuery('[id^=\'display_' + baseId + '\'][class]');
    var fileColumn = subtableViewElement.filter(function() {
        return (jQuery(this).attr('class') != undefined && this.id.match(/_uploaded$/));
    });

    if (fileColumn.length) {
        subtableViewElement = fileColumn;
    }
    if (autocompleteColumn.length) {
        subtableViewElement = autocompleteColumn;
    }

    if (!subtableViewElement.length) {
        return false;
    }

    var classString = subtableViewElement.attr('class');
    if (typeof classString !== 'undefined') {
        return extractElementTypeByClassesString(classString);
    }
    return extractElementTypeFromColumnHeader(baseId);
};

var extractElementTypeFromColumnHeader = function(columnBaseId) {
    var $columnHeaderElement = jQuery("#div_" + columnBaseId + "header");
    if (!$columnHeaderElement.length) {
        return false;
    }
    return $columnHeaderElement[0].retrieve("type").toLowerCase();
};

var extractElementTypeByClassesString = function(classString) {
    var classesArray = classString.split(" ");
    var elementType = false;
    jQuery.each(classesArray, function(index, value) {
        if (value.match(/^stv_/)) {
            elementType = value.replace('stv_', '');
            // return FALSE stop all iterations
            // return TRUE or just return stops only the current iteration
            return false;
        }
    });
    return elementType;
};

var checkSessionStarted = false;

var checkSession = function() {

    var params = {};

    params.cmd = 'Ajax_CheckSession';

    var lockTime = 600;

    if (!checkSessionStarted) {
        new Ajax.PeriodicalUpdater('ajax_updater', 'index.php', {
            method: 'get',
            frequency: lockTime,
            decay: 1,
            parameters: params,
            onSuccess: function(transport) {
            }
        });
    }
};

var checkInboxSteps = function(freq, newStepsInBoxColor, newStepsInBoxCallback) {

    var params = {};

    params.cmd = 'Ajax_CheckInboxSteps';

    var checkInboxStepsPeriodicalUpdater = function() {
        new Ajax.PeriodicalUpdater('ajax_updater', 'index.php', {
            method: 'get',
            frequency: freq,
            decay: 1,
            parameters: params,
            onSuccess: function(transport) {
                var checkResult = transport.responseText.evalJSON(true);
                var newStepsInBox = false;
                /*
                 * checkResult = [ { name: 'start', count: 0, total:
                 * 12121 }, { name: 'inbox', count: 123, total: 12121 }, {
                 * name: 'DateTest_1_3', count: 1, total: 66355 }, {
                 * name: 'DateTest_1_4', count: 3, total: 89087 } ];
                 */
                checkResult.each(function(checkEle) {
                    var checkElementNode = $('jr-check' + checkEle.name);
                    if (checkElementNode !== null) {
                        if (checkEle.count > 0) {
                            newStepsInBox = true;
                            checkElementNode.addClassName('changed');
                        } else {
                            checkElementNode.removeClassName('changed');
                        }
                        if (checkEle.total != undefined && checkEle.total != null) {
                            var elementId = 'jr-count' + checkEle.name;
                            if ($(elementId) !== null) {
                                $(elementId).update(checkEle.total);
                            }
                        }
                    }
                });
                $JR.UTILITY.updateCategoryCounters();
                if (Object.isFunction(newStepsInBoxCallback) && newStepsInBox) {
                    try {
                        newStepsInBoxCallback.defer(checkResult);
                    } catch(e) {
                        alert('Error in newStepsInBoxCallback function: ' + e);
                    }
                }
            }
        });
    };

    checkInboxStepsPeriodicalUpdater();
};

var ms = false;
var ns = false;

if (Prototype.Browser.IE) {
    ms = true;
} else if (Prototype.Browser.Gecko) {
    ns = true;
}

var toggleInputFieldChecked = function(obj) {

    if (obj.checked) {
        $('id_input_field').checked = true;
        $('id_input_field').disabled = true;
    } else {
        $('id_input_field').disabled = false;
    }
};

var loadPDFFile = function(filename) {

    var top = 100;
    var left = 100;
    var width = 1024;
    var height = 768;
    var opt = "dependent=yes,toolbar=yes,menubar=no,status=yes,resizable=yes,top=" + top + ",left=" + left + ",width=" +
        width + ",height=" + height + ",focus=yes";

    var url = "output/temp/" + filename + ".pdf";

    var newWindow = window.open(url, "JobRouterPDF", opt);
    newWindow.focus();
};

var loadTable = function(url) {

    new Ajax.Updater('contentLayerText', url, {
        method: 'get',
        onCreate: function() {
            (new LoadingLayer('', true, false)).show();
        },
        onSuccess: function(transport) {
            (new LoadingLayer(null, false, false)).hide();
            // TableKit.load;
        }
    });
};

var fillResponseFields = function(assignData, layerId) {

    assignData.each(function(ele) {
        var element = $(ele.name);

        if (element == null) {
            return $JR.NOTIFICATION.show('Form element "' + ele.name + '" doesn\'t exist - cannot assign value!',
                'error');
        }

        if (ele.value == null) {
            ele.value = '';
        }
        if (element.type == 'checkbox') {
            if (ele.value == 'Y') {
                element.checked = true;
            } else {
                element.checked = false;
            }
        } else {
            if (element.hasClassName('text')) {
                element.innerHTML = ele.value;
            } else if (element.hasClassName('date')) {
                element.value = convertSAMDate(ele.value, 'date', $(ele.name).retrieve('dateFormat'));
            } else if (element.hasClassName('datetime')) {
                element.value = convertSAMDate(ele.value, 'datetime', $(ele.name).retrieve('dateFormat'));
            } else {
                element.value = ele.value;
            }
        }

    });

    if (layerId) {
        $(layerId).hide();
        $JR.LAYERS.getTransparencyLayer().hide();
    }
};

var checkResponseFieldsChange = function(assignData) {

    var changed = false;

    assignData.each(function(ele) {

        var element = $(ele.name);

        if (element == null) {
            return;
        }

        var oldValue = null;
        var newValue = null;

        if (element.type == 'checkbox') {
            oldValue = element.checked;
            newValue = (ele.value == 'Y') ? true : false;
        } else {

            if (element.hasClassName('text')) {
                oldValue = element.innerHTML;
                newValue = ele.value;
            } else if (element.hasClassName('date')) {
                oldValue = element.value;
                newValue = convertSAMDate(ele.value, 'date', $(ele.name).retrieve('dateFormat'));
            } else if (element.hasClassName('datetime')) {
                oldValue = element.value;
                newValue = convertSAMDate(ele.value, 'datetime', $(ele.name).retrieve('dateFormat'));
            } else {
                oldValue = element.value;
                newValue = ele.value;
            }
        }

        if (oldValue != newValue) {
            changed = true;
        }
    });

    return changed;
};

var convertSAMDate = function(samValue, type, dateFormat) {

    if (samValue == null || samValue == '') {
        return '';
    }

    if (samValue.indexOf(' ') > -1) {
        samValue = samValue.replace(/ /g, '-');
    }

    var dateParts = samValue.split('-');
    if (type == 'date') {
        return $JR.UTILITY.getFormattedDate(dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2], dateFormat);
    } else {
        var timeParts = dateParts[3].split('.');
        return $JR.UTILITY.getFormattedDate(
            dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2] + ' ' + timeParts[0] + ':' + timeParts[1] + ':' +
            timeParts[2], dateFormat);
    }
};

var addBookmark = function(title, strURL) {

    if (strURL == '' || strURL == '/index.php') {
        alert('No valid JobRouter-URL in Settings found!');
        return true;
    }

    if (window.sidebar) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(title, strURL, '');
    } else if (window.external) { // IE Favorite
        window.external.AddFavorite(strURL, title);
    } else if (window.opera && window.print) { // Opera Hotlist
        return true;
    }
};

var checkSelectBoxEntry = function(elementId, eventName, successCallback, errorCallback) {

    if (eventName == 'onBlur') {
        selectBoxOnBlur(elementId);
        return;
    }

    var element = $(elementId);
    removeValidationErrorMessage(elementId, 'validation-selectbox-failed');
    element.removeClassName('validation-selectbox-failed');
    element.removeClassName('validation-failed');

    if (element.value.strip() == '') {
        if (eventName == 'onChange') {
            selectBoxOnChange(elementId);
        }
        return;
    }

    var url = 'index.php?cmd=Ajax_SelectBox';
    var subtableViewName = '';
    var subtableViewRow = '';
    var subtableViewColumn = '';

    var params = null;
    params = $('dialogForm').serialize(true);
    params.elementName = elementId;

    if (element.hasClassName('stv_sqllist')) {
        subtableViewName = element.up(4).id;
        subtableViewRow = elementId.substring(elementId.lastIndexOf('_') + 1);
        subtableViewColumn = elementId.substring(subtableViewName.length + 1, elementId.lastIndexOf('_'));
        params.subtableViewName = subtableViewName;
        params.subtableViewRow = subtableViewRow;
        params.subtableRow = document.getElementsByName(subtableViewName + '_row_id[' + subtableViewRow + ']')[0].value;
    }

    new Ajax.Request(url, {
        method: 'post',
        parameters: params,

        onCreate: function() {
            jr_xml_request_in_progress = true;
            requests_in_progress.set(elementId, true);
            jQuery(elementId.buildJQueryIdSelector()).attr('readonly', 'readonly');
        },

        onSuccess: function(transport) {
            requests_in_progress.set(elementId, false);
            var otherRequestsStillRunning = false;
            requests_in_progress.values().each(function(bool) {
                if (bool) {
                    otherRequestsStillRunning = true;
                    return;
                }
            });
            if (!otherRequestsStillRunning) {
                jr_xml_request_in_progress = false;
            }

            var response = transport.responseText.evalJSON(true);
            if (response.status == 'success') {
                if (response.check == true) {
                    element.addClassName('validation-passed');
                } else {
                    element.addClassName('validation-selectbox-failed');
                    element.addClassName('validation-failed');
                    element.removeClassName('validation-passed');
                }
            } else if (response.status == 'error') {
                element.addClassName('validation-selectbox-failed');
                element.addClassName('validation-failed');
                element.removeClassName('validation-passed');
            }
            jQuery(elementId.buildJQueryIdSelector()).removeAttr('readonly');

            if (eventName == 'onChange') {
                selectBoxOnChange(elementId);
            }

            removeValidationErrorMessage(elementId, 'validation-selectbox-failed');

            if (Object.isFunction(successCallback)) {
                if (subtableViewName != '') {
                    successCallback(subtableViewName, subtableViewColumn, subtableViewRow);
                } else {
                    successCallback(element.id, element.value);
                }
            }
        },
        onFailure: function() {

            requests_in_progress.set(elementId, false);
            var otherRequestsStillRunning = false;
            requests_in_progress.values().each(function(bool) {
                if (bool) {
                    otherRequestsStillRunning = true;
                    return;
                }
            });
            if (!otherRequestsStillRunning) {
                jr_xml_request_in_progress = false;
            }

            element.addClassName('validation-selectbox-failed');
            element.addClassName('validation-failed');
            element.removeClassName('validation-passed');

            jQuery(elementId.buildJQueryIdSelector()).removeAttr('readonly');

            if (eventName == 'onChange') {
                selectBoxOnChange(elementId);
            }

            removeValidationErrorMessage(elementId, 'validation-selectbox-failed');

            if (Object.isFunction(errorCallback)) {
                if (subtableViewName != '') {
                    errorCallback(subtableViewName, subtableViewColumn, subtableViewRow,
                        'Error executing SQL refresh. AJAX request failed.');
                } else {
                    errorCallback(element.id, 'Error executing SQL refresh. AJAX request failed.');
                }
            }
        }
    });
};

var selectBoxOnBlur = function(elementId) {

    var element = $(elementId);
    if (element == null) {
        return;
    }

    if (element.hasClassName('stv_sqllist')) {
        var elementName = elementId.substring(0, elementId.lastIndexOf('_'));
        var row = elementId.substring(elementId.lastIndexOf('_') + 1);
        try {
            var tempOnBlur = eval(elementName + '_onBlur');
            if (Object.isFunction(tempOnBlur)) {
                tempOnBlur(row);
            }
        } catch(e) {
        }
    } else {
        try {
            var tempOnBlur = eval(elementId + '_onBlur');
            if (Object.isFunction(tempOnBlur)) {
                tempOnBlur();
            }
        } catch(e) {
        }
    }
};

var selectBoxOnChange = function(elementId) {

    var element = $(elementId);
    if (element == null) {
        return;
    }

    if (element.hasClassName('stv_sqllist')) {
        var elementName = elementId.substring(0, elementId.lastIndexOf('_'));
        var row = elementId.substring(elementId.lastIndexOf('_') + 1);
        try {
            var tempOnChange = eval(elementName + '_onChange');
            if (Object.isFunction(tempOnChange)) {
                tempOnChange(row);
            }
        } catch(e) {
        }
    } else {
        try {
            var tempOnChange = eval(elementId + '_onChange');
            if (Object.isFunction(tempOnChange)) {
                tempOnChange();
            }
        } catch(e) {
        }
    }
};

var executeSelectBoxSearch = function(elementId) {

    if ($('formLayer') != null) {
        $('formLayer').remove();
    }

    var fl = $JR.LAYERS.getFormLayer();
    fl.setHeading($JR_JS_CONSTANTS.CONST_SELECTBOX_HEADING);
    fl.setWidth(800);
    fl.setHeight(600);
    fl.setAbortText($JR_JS_CONSTANTS.CONST_ABORT);
    fl.hideConfirmButton();

    fl.setFormName('selectbox_form');

    var params = null;
    params = $('dialogForm').serialize(true);
    params.elementName = elementId;

    var element = $(elementId);
    if (element.hasClassName('stv_sqllist')) {
        var subtableViewName = element.up(4).id;
        params.subtableViewName = subtableViewName;
        var subtableViewRow = elementId.substring(elementId.lastIndexOf('_') + 1);
        params.subtableViewRow = subtableViewRow;
        params.subtableRow = document.getElementsByName(subtableViewName + '_row_id[' + subtableViewRow + ']')[0].value;
    }

    fl.setParameters(Object.toJSON(params));

    fl.setCommand('SelectBox');
    fl.show();
};

var getSelectBoxId = function(element) {

    var selectbox = element.up().select('input')[0];
    if (selectbox) {
        return selectbox.id;
    }
};

var refreshTimezones = function(obj, timezoneFieldName) {

    new Ajax.Request('index.php?cmd=Ajax', {
        method: 'get',
        parameters: {
            cmd_target: 'getTimezonesByContinent',
            continent: obj.value
        },
        onSuccess: function(transport) {
            var response = transport.responseText.evalJSON(true);
            var selectHtmlString = '<select class="jr-form-control jr-form-control-half" id="id_' + timezoneFieldName +
                '" name="' + timezoneFieldName + '">';
            response.each(function(elem) {
                selectHtmlString += '<option value="' + elem.value + '">' + elem.name + '</option>';
            });
            selectHtmlString += '</select>';
            $('id_' + timezoneFieldName).replace(selectHtmlString);
        },
        onFailure: function() {
            var selectHtmlString = '<select id="id_' + timezoneFieldName + '" name="' + timezoneFieldName + '">';
            selectHtmlString += '<option value="">-</option>';
            selectHtmlString += '</select>';
            $('id_' + timezoneFieldName).replace(selectHtmlString);
        }
    });
};

var changeJobSelectFieldType = function(element, elementType) {

    var typeArray = [];
    if (elementType == 'filter') {
        typeArray = new Array('select');
    } else {
        typeArray = new Array('dw_show_document', 'dwis_show_document', 'dwwebclient_show_document', 'script', 'image', 'jobarchive_show');
    }

    if ($JR.UTILITY.inArray($(element).value, typeArray)) {
        $(element).next().show();
    } else {
        $(element).next().hide();
    }

    var fieldType = $(element).value;
    var hiddenSettingsField = $(element).up().next().next().next().down().next();
    var newSettings = hiddenSettingsField.value.replace(/'/g, '"');

    try {
        newSettings = newSettings.evalJSON();
    } catch(ex) {
        console.log('Error:' + ex);
    }

    newSettings['fieldType'] = fieldType;
    newSettings = Object.toJSON(newSettings);

    $(hiddenSettingsField).value = newSettings;

    var hiddenEditField = $(element).next().next();
    var newSettings = {};
    try {
        newSettings = hiddenEditField.value.evalJSON();
        if (!newSettings) {
            newSettings = {};
        }
    } catch(ex) {
        alert('Error:' + ex);
    }
    newSettings['fieldType'] = fieldType;
    newSettings = Object.toJSON(newSettings);

    $(hiddenEditField).value = newSettings;

    // disable dbfield for script type
    if (elementType == 'result') {
        var dbField = $(element).up().next().down();
        if (fieldType == 'script') {
            dbField.disable();
        } else {
            dbField.enable();
        }
    }

    if (elementType == 'filter') {
        if (fieldType == 'select') {
            $(element).up().next().next().down().value = '';
        }
    }
};

var reorderTableWidget = function(tableElement) {

    var excludedItems = new Array(tableElement + '_header', tableElement + '_row_empty', tableElement +
        '_row_template');
    var j = 1;
    $$('#' + tableElement + ' tr').each(function(item) {
        if ($JR.UTILITY.inArray(item.id, excludedItems) == false) {
            var order = item.select('.order')[0];
            if (order) {
                order.down().value = j;
            }
            j++;
        }
    });
};

var focusNextWidgetTableField = function(event) {

    var element = Event.element(event);
    var elementNameWithoutRow = element.id.substring(0, element.id.lastIndexOf('_'));
    var tableName = element.up(3).id;
    var currentOrdernum = element.up(1).select('.order')[0].down().value;

    // down arrow
    if (event.keyCode == 40) {

        var nextField = null;
        var nextOrdernum = currentOrdernum * 1 + 1;

        var excludedItems = new Array(tableName + '_header', tableName + '_row_empty', tableName + '_row_template');
        $$('#' + tableName + ' tr').each(function(item) {
            if ($JR.UTILITY.inArray(item.id, excludedItems) == false) {
                var ordernumField = item.select('.order')[0].down();
                if (ordernumField.value == '1') {
                    var rowId = ordernumField.id.substring(ordernumField.id.lastIndexOf('_') + 1);
                    nextField = elementNameWithoutRow + '_' + rowId;
                } else if (ordernumField.value == nextOrdernum) {
                    var rowId = ordernumField.id.substring(ordernumField.id.lastIndexOf('_') + 1);
                    nextField = elementNameWithoutRow + '_' + rowId;
                    $break;
                }
            }
        });

        $(nextField).activate();
        event.stop();

    } else if (event.keyCode == 38) {

        // up arrow
        var nextField = null;
        var nextOrdernum = currentOrdernum * 1 - 1;

        var excludedItems = new Array(tableName + '_header', tableName + '_row_empty', tableName + '_row_template');
        $$('#' + tableName + ' tr').each(function(item) {
            if ($JR.UTILITY.inArray(item.id, excludedItems) == false) {
                var ordernumField = item.select('.order')[0].down();
                if (nextOrdernum == 0) { // last field wins
                    var rowId = ordernumField.id.substring(ordernumField.id.lastIndexOf('_') + 1);
                    nextField = elementNameWithoutRow + '_' + rowId;
                } else if (ordernumField.value == nextOrdernum) {
                    var rowId = ordernumField.id.substring(ordernumField.id.lastIndexOf('_') + 1);
                    nextField = elementNameWithoutRow + '_' + rowId;
                    $break;
                }
            }
        });

        $(nextField).activate();
        event.stop();
    }
};

var showTranslationPopup = function(element, type, heading, abortText, confirmText, mode, options) {

    if (Object.isUndefined(options)) {
        options = {};
    }

    var defaults = {
        layerName: 'formLayer',
        width: 520,
        height: 500
    };

    var settings = jQuery.extend({}, defaults, options);

    // remove existing formLayer to abort confirmClickHandler
    if ($(settings.layerName) != null) {
        $(settings.layerName).remove();
    }
    var fl = $JR.LAYERS.getFormLayer(settings.layerName);
    fl.layerId = settings.layerName;
    fl.setHeading(heading);
    fl.setWidth(settings.width);
    fl.setHeight(settings.height);
    fl.setAbortText(abortText);
    fl.setConfirmText(confirmText);

    if (settings.layerName !== 'formLayer') {
        fl.hideTransparentOnAbort = false;
    }

    fl.setCompleteCallback(function() {
        if ($('id_translation_' + $('translation_default_language').value)) {
            $('id_translation_' + $('translation_default_language').value).focus();
        }
    });

    fl.setCommand('showTranslations');

    var params = new Array();
    params[0] = $(element).next().value;

    // workaround for validation message
    if ($(element).previous().tagName == 'DIV') {
        params[1] = $(element).previous().previous().value;
    } else {
        params[1] = $(element).previous().value;
    }

    params[2] = $('translation_default_language').value;
    params[3] = type;
    params[4] = mode;

    var translationFormIdSuffix = '';
    if (settings.layerName !== 'formLayer') {
        params.push(settings.layerName);
        translationFormIdSuffix = settings.layerName;
    }
    fl.setParameters(params);

    var confirmClickHandler = function(evt) {
        try {
            var linkedTextboxElementId = $(element).previous().readAttribute('id');
            jQuery(linkedTextboxElementId.buildJQueryIdSelector()).change();
        } catch(e) {
            // suppress errors and warnings, if not available
        }

        // workaround for validation message
        var valueElement;
        if ($(element).previous().tagName == 'DIV') {
            valueElement = $(element).previous().previous();
        } else {
            valueElement = $(element).previous();
        }

        var translationFormId = 'translationForm' + translationFormIdSuffix;
        var fieldId = 'id_translation_' + jQuery('#translation_default_language').val();
        valueElement.value = jQuery(translationFormId.buildJQueryIdSelector()).find(fieldId.buildJQueryIdSelector()).
            val();

        $(element).next().value = $(translationFormId).serialize();
        $(settings.layerName).hide();
        if (settings.layerName === 'formLayer') {
            $('transparentLayer').hide();
        }
    };

    fl.setConfirmButtonListener(confirmClickHandler);
    fl.show();
};

var jr_open_in_iframe = function(url, targetIFrame, elementsToHide, elementsToShow) {

    if ($(targetIFrame) == null) {
        alert('Target iFrame doesn\' exist: ' + targetIFrame);
    }

    jQuery.ajax({
        url: url
    }).done(function(data, textStatus, jqXHR) {

        $(targetIFrame).src = url;

        if (jqXHR.getResponseHeader('Content-Type') != 'application/octet-stream') {

            $(targetIFrame).show();

            if (Object.isArray(elementsToHide)) {
                elementsToHide.each(function(item) {
                    if (item != null) {
                        item.hide();
                    }
                });
            } else if (elementsToHide != null) {
                elementsToHide.hide();
            }

            if (Object.isArray(elementsToShow)) {
                elementsToShow.each(function(item) {
                    if (item != null) {
                        item.show();
                    }
                });
            } else if (elementsToShow != null) {
                elementsToShow.show();
            }
        }
    });
};

var objectImplode = function(obj, keyValueSeparator, elementSeparator) {

    keyValueSeparator = getDefaultValueIfUndefined(keyValueSeparator, '=');
    elementSeparator = getDefaultValueIfUndefined(elementSeparator, ',');

    var elements = [];
    for (key in obj) {
        elements.push(key + keyValueSeparator + obj[key]);
    }
    return elements.join(',');
};

var getDefaultValueIfUndefined = function(value, defaultValue) {

    if (typeof value == 'undefined') {
        return defaultValue;
    }
    return value;
};

var isRadioElement = function(id) {
    return ($(id) !== null && !Object.isUndefined($(id).retrieve('type')) &&
    $(id).retrieve('type').toLowerCase() == 'radio');
};

var isSTVElement = function(id) {

    var classNames = $w($(id).className);
    for (var i = 0; i < classNames.length; ++i) {
        if (classNames[i].substring(0, 4) == 'stv_') {
            return true;
        }
    }
    return jQuery(id.buildJQueryIdSelector()).closest('table').hasClass('subtableView');
};

var retrieveFromSTVHeaderElement = function(id) {

    var $element = jQuery(id.buildJQueryIdSelector());
    if ($element.hasClass('stv_autocomplete')) {
        return 'div_' + id.substring(id.indexOf('_') + 1, id.lastIndexOf('_')) + '_header';
    }

    if ($element.hasClass('stv_radio')) {
        id = id.substring(0, id.lastIndexOf('_'));
    }

    return 'div_' + id.substring(0, id.lastIndexOf('_')) + '_header';
};

var jr_get_constant_value = function(constantName) {
    if (typeof $JR_JS_CONSTANTS[constantName] == 'undefined') {
        return constantName;
    }
    if (arguments.length > 1) {
        var tpl = new Template($JR_JS_CONSTANTS[constantName]);
        return tpl.evaluate(arguments[1]);
    }

    return $JR_JS_CONSTANTS[constantName];
};

var castToBoolean = function(value) {

    return !!value;
};

var MindoxPolling = function(subtableViews, workflowid, onSuccessScript, reloadSections) {

    var sections = [];

    http_request = new Ajax.Request('modules/mindox/data/ajax.php?guid=' + workflowid, {
        method: 'get',
        onCreate: function() {
            jr_xml_request_in_progress = true;
        },
        onSuccess: function(transport) {
            jr_xml_request_in_progress = false;
            var response = transport.responseText;

            reloadSections.each(function(section) {
                sections.push(section);
            });

            if (response == 'CHANGED') {

                $$('table.section').each(function(section) {

                    section.select('table.subtableView').each(function(subtableView) {

                        if ($JR.UTILITY.inArray(subtableView.id, subtableViews) &&
                            !$JR.UTILITY.inArray(section.id, sections)) {

                            sections.push(section.id);
                        }

                    });

                });

                sections.each(function(section) {
                    jr_load_section(section);
                });

                new LoadingLayer('', true, true).hide();

            } else if (response == 'NOT CHANGED') {
                MindoxPolling.delay(2, subtableViews, workflowid, onSuccessScript, reloadSections);
            } else if (response == 'ERROR') {
                new LoadingLayer('', true, true).hide();
            } else {
                alert(response);
                new LoadingLayer('', true, true).hide();
                return;
            }
        },
        onFailure: function() {
            jr_xml_request_in_progress = false;
        }
    });
};

var validateAutocompleteSubtableField = function(subtableName, subtableColumn, subtableRow, mode, callback) {
    var elementName = subtableName + '_' + subtableColumn + '_' + subtableRow;
    var headerName = 'div_' + subtableName + '_' + subtableColumn + '_header';
    var source = $(headerName).retrieve('source');
    source += '&element_name=' + subtableColumn + '&jrsubtablerow=' + subtableRow;
    executeAutocompleteValidation(elementName, source, mode, callback);
};

var validateAutocompleteField = function(name, mode, callback) {
    var source = $(name).retrieve('source');
    executeAutocompleteValidation(name, source, mode, callback);
};

var executeAutocompleteValidation = function(name, source, mode, callback) {

    jQuery.ajax({
        beforeSend: function() {
            jr_xml_request_in_progress = true;
            requests_in_progress.set(name, true);
        },
        url: source + '&autocomplete_mode=' + mode + '&autocomplete_display=' +
        encodeURIComponent(jQuery(('display_' + name).buildJQueryIdSelector()).val()) + '&autocomplete_value=' +
        encodeURIComponent(jQuery(name.buildJQueryIdSelector()).val()),
        dataType: "json",
        data: jQuery("#dialogForm").serialize(),
        type: "POST",
        success: function(data, status) {
            var $displayNameElement = jQuery(('display_' + name).buildJQueryIdSelector());
            var $nameElement = jQuery(name.buildJQueryIdSelector());
            if ($displayNameElement.val() != '' && !data.value) {
                removeValidationErrorMessage('display_' + name, 'required');
                $displayNameElement.addClass('autocomplete-valid-error');
                $nameElement.val($displayNameElement.val());
            } else {
                if (mode == 'display') {
                    $displayNameElement.val(data.display);
                    $nameElement.val(data.value);
                } else {
                    $displayNameElement.val(data.display);
                }
                $displayNameElement.removeClass('autocomplete-valid-error');
            }

            if (callback instanceof Function) {
                callback.apply($displayNameElement[0]);
            }

            Validation.validate($('display_' + name));

            requests_in_progress.set(name, false);
            checkRequestsInProgress();
        }
    });
};

var setAutoCompleteValue = function(id, value, mode) {

    if ($(id).retrieve('listType') == 2) {
        $(id).value = value;
        $('display_' + id).value = value;

        if ($(id).retrieve('validInput') == '1') {
            validateAutocompleteField(id, mode);
        }
    }
};

var setAutoCompleteSubtableValue = function(subtableViewName, columnName, rowId, value, mode) {

    var headerElement = $('div_' + subtableViewName + '_' + columnName + '_header');
    var id = subtableViewName + '_' + columnName + '_' + rowId;

    if ($(headerElement).retrieve('listType') == 2) {
        $(id).value = value;
        $('display_' + id).value = value;
        if ($(headerElement).retrieve('validInput') == '1') {
            validateAutocompleteSubtableField(subtableViewName, columnName, rowId, mode);
        }
    }
};

var createJobArchiveViewMultiDownload = function() {
    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();

    var url = "index.php?cmd=Ajax_JobArchiveViewMultiDownload&action=createMultiDownload";
    var mappedParameters = remapGetParameters({
        modcmd: 'protocolEventSource',
        id: 'protocolEventId'
    });

    url += '&' + jQuery.param(mappedParameters);

    jQuery.post(url, jQuery('table.jr-box-table td.checkbox input').serialize(), function() {
    }, 'json').always(function() {
        loadingLayer.hide();
    }).done(function(responseObject) {
        if (responseObject.success) {
            var downloadLink = 'export.php?type=jobarchive&action=download&dlticket=' + responseObject.success + '';
            location.href = downloadLink;
            uncheckAllCheckboxesInBoxTable();
        } else if (responseObject.error) {
            showErrorPopup(jr_get_constant_value(responseObject.error));
        }
    }).fail(function() {
        showErrorPopup(jr_get_constant_value('CONST_AJAX_REQUEST_ERROR'));
    });
};

var remapGetParameters = function(getParameterMapping) {
    var parsedGetParameters = parseGetParameters();
    var destGetParameters = {};
    jQuery.each(getParameterMapping, function(sourceParameterName, destParameterName) {
        if (!parsedGetParameters[sourceParameterName]) {
            return;
        }
        destGetParameters[destParameterName] = parsedGetParameters[sourceParameterName];
    });
    return destGetParameters;
};

var parseGetParameters = function() {
    var vars = {};
    var url = window.location.href;
    if (url.lastIndexOf('#') > -1) {
        url = url.substr(0, url.lastIndexOf('#'));
    }
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
};

var downloadRevisionById = function(revisionId) {
    jQuery('div.loading-indicator').show();
    jQuery('table.revisionlist').hide();

    return jQuery.post("index.php?cmd=Ajax_JobArchiveViewMultiDownload&action=createMultiDownload", {
        cb: [revisionId]
    }, function() {
    }, "json").always(function() {
        jQuery('div.loading-indicator').hide();
        jQuery('table.revisionlist').show();
    }).done(function(responseObject) {
        if (responseObject.success) {
            var downloadLink = 'export.php?type=jobarchive&action=download&dlticket=' + responseObject.success + '';
            location.href = downloadLink;
        } else if (responseObject.error) {
            alert(jr_get_constant_value(responseObject.error));
        }
    }).fail(function() {
        alert(jr_get_constant_value('CONST_AJAX_REQUEST_ERROR'));
    });
};

var showErrorPopup = function(errorText) {

    // remove existing formLayer to abort confirmClickHandler
    if ($('formLayer') != null) {
        $('formLayer').remove();
    }

    var fl = $JR.LAYERS.getFormLayer();
    fl.setShowTransparent(true);
    fl.setHideTransparent(false);
    fl.hideConfirmButton();
    fl.setWidth(350);
    fl.setHeight(200);
    fl.setHeading(jr_get_constant_value('CONST_ERROR'));
    fl.setContent('<span class="">' + errorText + '</span>');
    fl.setAbortText(jr_get_constant_value('CONST_OK'));
    fl.show();
};

var uncheckAllCheckboxesInBoxTable = function() {
    jQuery('table.jr-box-table td.checkbox input').attr('checked', false).parent().parent().
        removeClass('jr-box-table-row-checked');
    jQuery('#cb_all').attr('checked', false);
};

var getStepActionFunctionNames = function() {

    return [
        'sendStep', 'saveStep', 'assignStep', 'requestStep', 'backStep', 'releaseStep', 'jumpToStep', 'abortStep'
    ];
};

var getStepActionFunctionShortNames = function() {

    return [
        'send', 'save', 'assign', 'request', 'back', 'jumpTo', 'abort', 'resubmission', 'finish'
    ];
};

var disableStepActions = function() {

    if (!window.jrtemp) {
        window.jrtemp = {};
    }

    var stepFunctionsToDisable = getStepActionFunctionNames();

    jQuery.each(stepFunctionsToDisable, function(index, functionToDisable) {
        if (!window.jrtemp[functionToDisable]) {
            window.jrtemp[functionToDisable] = $JRSTEP[functionToDisable];
            $JRSTEP[functionToDisable] = function() {
            };
        }
    });
};

var enableStepActions = function() {

    var stepFunctionsToEnable = getStepActionFunctionNames();
    jQuery.each(stepFunctionsToEnable, function(index, functionToEnable) {
        $JRSTEP[functionToEnable] = window.jrtemp[functionToEnable];
    });
};

var showAjaxPostResultInDialog = function(url, postParameters) {

    if (arguments.length < 2) {
        postParameters = {};
    }

    disableStepActionsAndShowLoadingLayer();

    return jQuery.post(url, postParameters, function() {
    }, 'json').done(handleAjaxPostResponse).fail(handleFailedAjaxPost);
};

var disableStepActionsAndShowLoadingLayer = function(jsonResponse) {
    disableEscKey();
    disableStepActions();
    var showStepContainer = (window.isOnSubmitMode ? true : false);
    new LoadingLayer('', true, true, showStepContainer).show();
};

var disableEscKey = function() {
    jQuery(document).on('keyup.disableEscKey', function(e) {
        if (e.keyCode == 27) {
            e.preventDefault();
            return false;
        }
    });
};

var enableStepActionsAndHideLoadingLayer = function(jsonResponse) {
    enableEscKey();
    enableStepActions();
    new LoadingLayer().hide();
};

var enableEscKey = function() {
    jQuery(document).off('keyup.disableEscKey');
};

var handleAjaxPostResponse = function(jsonResponse) {

    if (jsonResponse.status === 'error') {
        showErrorsFromJsonResponse(jsonResponse);
    } else {
        $JR.NOTIFICATION.removeAll();
    }

    if (jsonResponse.status !== 'error' || jsonResponse.forceUpdateElements) {
        setValuesFromJsonResponse(jsonResponse);
    }
    enableStepActionsAndHideLoadingLayer();
};

var handleFailedAjaxPost = function() {

    $JR.NOTIFICATION.show([jr_get_constant_value('CONST_AJAX_REQUEST_ERROR')], 'error');
    enableStepActionsAndHideLoadingLayer();
};

var setValuesFromJsonResponse = function(jsonResponse) {

    if (!jsonResponse.elements) {
        return;
    }
    var elements = jsonResponse.elements;
    jQuery.each(elements, function(elementId, elementOptions) {
        if (elementOptions.error) {
            return true;
        }
        if (elementOptions.type == '5') {
            var dialogElementId = jQuery(elementId.buildJQueryIdSelector()).closest('tr').attr('id');
            jr_subtable_init(dialogElementId.substr(4), elementOptions.value);
        } else {
            jr_set_value(elementId, elementOptions.value);
        }
    });
};

var showErrorsFromJsonResponse = function(jsonResponse) {

    if (jsonResponse.status !== 'error') {
        return;
    }

    var errorMessages = [];
    var elements = jsonResponse.elements;

    jQuery.each(elements, function(elementId, elementOptions) {
        if (elementOptions.error) {
            errorMessages.push(elementOptions.error);
        }
    });

    $JR.NOTIFICATION.show(errorMessages, 'error');
};

var JobSapBAPICall = function(elementId, dialogData, onSuccess, onError) {

    var url = 'index.php?module=jobsapbapi&modcmd=JobsapbapiAjax';

    var postParameters = dialogData;
    postParameters += '&elementName=' + elementId;

    var jqXHR = showAjaxPostResultInDialog(url, postParameters);

    if (onSuccess) {
        jqXHR.done(onSuccess);
    }

    if (onError) {
        jqXHR.fail(onError);
    }
};

var scrollMenuWithPage = function() {

    $j(window).scroll(function() {
        var currentScrollPosition = jQuery(window).scrollTop();
        var windowHeight = jQuery(window).height();
        var $menu = jQuery('#menu');

        if (!$menu.length) {
            return;
        }

        var menuHeight = $menu.position().top + $menu.outerHeight(true);
        var marginTop = currentScrollPosition;
        if (menuHeight > windowHeight) {
            marginTop = (windowHeight - menuHeight) + currentScrollPosition;

            if (marginTop < 0) {
                marginTop = 0;
            }
        }

        jQuery('#menuWrapper').stop().animate({
            'marginTop': marginTop + 'px'
        }, 'slow');
    });
};

var ajaxRefreshRuleList = function(elementId, parameters) {

    var element = jQuery(elementId.buildJQueryIdSelector());

    element.hide();
    element.parent().append('<img src="images/loading.gif" alt="loading" width="14" height="14" class="loading">');

    var url = 'index.php?cmd=Ajax_RuleList';
    jQuery.post(url, parameters, function() {
    }, 'json').done(function(jsonResponse) {
        element.show();
        element.parent().find('.loading').hide();
        var options = [];
        if (jsonResponse.result) {
            options = jsonResponse.result;
        }
        insertSelectOptions(elementId, options);
    });

};

var insertSelectOptions = function(elementId, options) {

    $(elementId).options.length = null;
    jQuery.each(options, function(index, option) {
        jQuery(elementId.buildJQueryIdSelector()).
            append('<option value="' + option.value + '">' + option.name + '</option>');
    });
};

var switchAreaFOptions = function(selected) {
    var dbUsername = $('div_jobselect_foptions_db_username').hide();
    var dbPassword = $('div_jobselect_foptions_db_password').hide();
    var dbHost = $('div_jobselect_foptions_db_host').hide();
    var dbName = $('div_jobselect_foptions_db_name').hide();
    var dsnName = $('div_jobselect_foptions_dsn_name').hide();
    var dsnUser = $('div_jobselect_foptions_dsn_user').hide();
    var dsnPassword = $('div_jobselect_foptions_dsn_password').hide();
    var dbPort = $('div_jobselect_foptions_db_port').hide();
    var dbType = $('div_jobselect_foptions_db_type').hide();
    var dbCharset = $('div_jobselect_foptions_db_charset').hide();

    dbUsername.hide();
    dbPassword.hide();
    dbHost.hide();
    dbName.hide();
    dsnName.hide();
    dsnUser.hide();
    dsnPassword.hide();
    dbPort.hide();
    dbType.hide();
    dbCharset.hide();

    switch (selected) {
        case '0':
        case '1':
        case '4':
            dbUsername.show();
            dbPassword.show();
            dbHost.show();
            dbName.show();
            dbPort.show();
            dbCharset.show();
            break;
        case '2':
            dbUsername.show();
            dbPassword.show();
            dbHost.show();
            dbCharset.show();
            break;
        case '3':
            dsnName.show();
            dsnUser.show();
            dsnPassword.show();
            dbType.show();
            dbCharset.show();
            break;
        case '5':
            dbUsername.show();
            dbPassword.show();
            dbHost.show();
            dbName.show();
            dbPort.show();
            break;
    }
};

var autocompleteDialogElementInitialized = false;

var initAutocompleteDialogElement = function() {

    if (!autocompleteDialogElementInitialized) {
        jQuery.widget("custom.jrautocomplete", jQuery.ui.autocomplete, {
            _renderMenu: function(ul, items) {
                jQuery.each(items, function(index, item) {
                    jQuery("<li></li>").data("ui-autocomplete-item", item).append(jQuery("<a></a>").text(item.label)).
                        appendTo(ul);
                });
            }
        });
        autocompleteDialogElementInitialized = true;
    }
};

var showRuleDetails = function(params) {

    var url = 'index.php?cmd=Ajax_RuleDetails';

    return jQuery.post(url, params, function() {
    }, 'json').done(handleRuleDetailsResponse).fail(handleRuleDetailsPostFailure);
};

var handleRuleDetailsResponse = function(jsonResponse) {

    if (jsonResponse.status === 'error') {
        showRuleDetailsErrorsFromJsonResponse(jsonResponse);
    } else {

        var conditionType = jsonResponse.result.always;
        var conditionTypeText = convertConditionTypeToText(conditionType);
        var conditionDetailsText = '';

        if (conditionType == 0) {
            var simpleCondition = jsonResponse.result.simpleCondition;
            if (simpleCondition !== null) {
                conditionDetailsText += simpleCondition.field1a;
                conditionDetailsText += ' ' + convertOperatorToText(simpleCondition.operator1);
                conditionDetailsText += ' ' + simpleCondition.field1b;
                if (simpleCondition.operation1 != 0) {
                    conditionDetailsText += ' ' + convertOperationToText(simpleCondition.operation1);
                    conditionDetailsText += ' ' + simpleCondition.field2a;
                    conditionDetailsText += ' ' + convertOperatorToText(simpleCondition.operator2);
                    conditionDetailsText += ' ' + simpleCondition.field2b;
                }
                if (simpleCondition.operation2 != 0) {
                    conditionDetailsText += ' ' + convertOperationToText(simpleCondition.operation2);
                    conditionDetailsText += ' ' + simpleCondition.field3a;
                    conditionDetailsText += ' ' + convertOperatorToText(simpleCondition.operator3);
                    conditionDetailsText += ' ' + simpleCondition.field3b;
                }
            }
        } else if (conditionType == 2) {
            conditionDetailsText = jsonResponse.result.complexCondition;
        } else if (conditionType == 3) {
            conditionDetailsText = jsonResponse.result.functionCondition;
        }

        $JR.NOTIFICATION.removeAll();
        $JR.NOTIFICATION.show(conditionTypeText + '\n' + conditionDetailsText, 'info');
    }
};

var convertConditionTypeToText = function(conditionType) {

    var constantName = '';

    if (conditionType == 0) {
        constantName = 'CONST_EXECUTE_IF';
    } else if (conditionType == 1) {
        constantName = 'CONST_EXECUTE_ALWAYS';
    } else if (conditionType == 2) {
        constantName = 'CONST_EXECUTE_CONDITION';
    } else if (conditionType == 3) {
        constantName = 'CONST_EXECUTE_FUNCTION';
    }

    return jr_get_constant_value(constantName);
};

var convertOperatorToText = function(operator) {

    switch (operator) {
        case 0:
            return '=';
        case 1:
            return '<>';
        case 2:
            return '<';
        case 3:
            return '>';
        case 4:
            return '<=';
        case 5:
            return '>=';
        case 6:
            return 'LIKE';
        case 7:
            return 'NOT LIKE';
    }

    throw 'Invalid operator: ' + operator;
};

var convertOperationToText = function(operation) {

    switch (operation) {
        case 0:
            return '';
        case 1:
            return 'AND';
        case 2:
            return 'OR';
    }

    throw 'Invalid operator: ' + operation;
};

var showRuleDetailsErrorsFromJsonResponse = function(jsonResponse) {

    if (jsonResponse.status !== 'error') {
        return;
    }

    showRuleDetailsErrorMessages([jsonResponse.message]);
};

var handleRuleDetailsPostFailure = function() {

    showRuleDetailsErrorMessages([jr_get_constant_value('CONST_AJAX_REQUEST_ERROR')]);
};

var showRuleDetailsErrorMessages = function(messages) {
    $JR.NOTIFICATION.show(messages, 'error');
};

var checkRequestsInProgress = function() {

    var otherRequestsStillRunning = false;
    requests_in_progress.values().each(function(bool) {
        if (bool) {
            otherRequestsStillRunning = true;
            return;
        }
    });

    if (!otherRequestsStillRunning) {
        jr_xml_request_in_progress = false;
    } else {
        jr_xml_request_in_progress = true;
    }
};

var showRevisionListPopup = function(url) {

    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();

    jQuery.post(url, {
        page: 1
    }, function() {
    }, 'html').always(function() {
        loadingLayer.hide();
    }).done(function(responseHtml) {
        var formLayer = $('formLayer');
        // remove existing formLayer to abort confirmClickHandler
        if (formLayer != null) {
            formLayer.remove();
        }

        var fl = $JR.LAYERS.getFormLayer();
        fl.setShowTransparent(true);
        fl.setHideTransparent(false);
        fl.hideConfirmButton();
        fl.setWidth(800);
        fl.setHeight(600);
        fl.setHeading(jr_get_constant_value('CONST_REVISION_BROWSER'));
        fl.setContent(responseHtml);
        fl.setAbortText(jr_get_constant_value('CONST_CLOSE'));
        fl.show();
    }).fail(function() {
        showErrorPopup(jr_get_constant_value('CONST_AJAX_REQUEST_ERROR'));
    });
};

var executeSelectBoxSearchWrapper = function(element, onClickEvent) {

    var returnValue = onClickEvent();

    var inputOfSelectBox = jQuery(element).prevAll('input')[0];

    if (jQuery(inputOfSelectBox).hasClass('stv_sqllist')) {
        var stvId = jQuery(inputOfSelectBox).attr('id');
        var rawId = stvId.substring(0, stvId.lastIndexOf('_'));
        inputOfSelectBox = jQuery(('div_' + rawId + '_header').buildJQueryIdSelector())[0];
    }

    var disabled = inputOfSelectBox.retrieve('disabled');

    if (disabled == true || disabled == 1 || disabled == '1') {
        returnValue = false;
    }

    if (returnValue !== false) {
        executeSelectBoxSearch(getSelectBoxId(element));
    }
};

var hash = function(stringToHash, algo) {
    if (arguments.length === 1) {
        algo = getDefaultHashAlgo();
    }
    return window[algo](stringToHash);
};

var hashVerify = function(stringToHash, hashValue, algo) {
    if (arguments.length === 2) {
        algo = getDefaultHashAlgo();
    }
    return hashValue == hash(stringToHash, algo);
};

var getSupportedHashAlgos = function() {
    return ['crc32'];
};

var getDefaultHashAlgo = function() {
    return getSupportedHashAlgos()[0];
};

var makeCRCTable = function() {
    var c;
    var crcTable = [];
    for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
};

var crc32 = (function() {
    var crcTable = makeCRCTable();
    return function(str) {
        var crc = 0 ^ -1;
        for (var i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ -1) >>> 0;
    };
})();

var quotemeta = function(string) {
    return string.replace(/[.+*?|\\^$(){}\[\]-]/g, '\\$&');
}

var rtrim = function(string, chr) {
    var expr = (!chr) ? new RegExp('\\s+$') : new RegExp(quotemeta(chr) + '+$');
    return string.replace(expr, '');
};

var validateSubtablesRowCount = function() {
    var subtablesValid = true;

    $JR.DIALOG.SUBTABLE.getSubtables().each(function(parameters) {

        var subtableId = parameters.key;
        var subtable = parameters.value;
        var message = null;

        if (subtable.isMinRowsUndershot()) {
            message = jr_get_constant_value("CONST_SUBTABLE_VIEW_MIN_ROWS") + ": " + subtable.getMinRows();
        } else if (subtable.isMaxRowsExceeded()) {
            message = jr_get_constant_value("CONST_SUBTABLE_VIEW_MAX_ROWS") + ": " + subtable.getMaxRows();
        } else {
            removeValidationErrorMessage(subtableId, 'rowCount');
            insertValidationErrorMessage();
            return;
        }

        subtablesValid = false;

        addValidationErrorMessage({
            identifier: subtableId,
            validation: 'rowCount',
            name: subtableId,
            message: message
        });
        insertValidationErrorMessage();
    });

    return subtablesValid;
};

var getDefaultPopupOptions = function() {
    return {
        id: '',
        title: '',
        url: '',
        modal: true,
        minHeight: 400,
        maxHeight: 600,
        minWidth: 600,
        closeText: $JR_JS_CONSTANTS.CONST_CLOSE,
        close: function(/*event, ui*/) {
            jQuery(this).dialog('close').dialog('destroy').remove();
        },
        buttons: [
            {
                text: jr_get_constant_value('CONST_CLOSE'),
                click: function() {
                    jQuery(this).dialog("close");
                }
            }
        ]
    };
};

(function($) {
    $JR.dialog = function(options, formName) {
        var defaultPopupOptions = getDefaultPopupOptions();
        var options = $.extend(defaultPopupOptions, options);
        var openDeletePopup = function() {
            var deleteButton = {
                text: jr_get_constant_value('CONST_DELETE'),
                class: 'jr-btn-alert',
                click: function() {
                    var formId = ('form_' + formName).buildJQueryIdSelector();
                    $(formId + ' input[name=action]').val('delete');
                    var $formElement = $(formId);
                    var target = $formElement.prop('target');
                    $formElement.prop('target', '_self');
                    $formElement.submit();
                    $formElement.prop('target', target);
                }
            };

            var cancelButton = {
                text: jr_get_constant_value('CONST_CANCEL'),
                click: function() {
                    $(this).dialog("close");
                }
            };

            options.buttons = [];
            options.buttons.unshift(cancelButton);
            options.buttons.unshift(deleteButton);

            var loadingLayer = new LoadingLayer('', true, true);
            loadingLayer.show();

            var dialog = $JR.widget.dialog('deleteDialog', options);
            dialog.setTitle(jr_get_constant_value('CONST_PROMPT_FOR_CONFIRMATION'));

            var deleteContent = generateDeleteContent();
            dialog.setContent(deleteContent);
            loadingLayer.hide();
            dialog.open();

            // Suppress auto-focus on main action button in PopUps
            jQuery('.jr-btn, .ui-button').blur();
        };

        var generateDeleteContent = function() {
            var titleContainer = $('<p>' + jr_get_constant_value('CONST_CONFIRM_DELETE_ELEMENTS') + '</p>');
            var table = generateTableForShortcutRows();
            var noWrapContainer = $('<div />', { style: "white-space:nowrap" });
            noWrapContainer.append(table);
            var container = $('<div />');
            container.append(titleContainer, noWrapContainer);

            return container.html();
        };

        var generateTableForShortcutRows = function() {
            var table = $('<table />', { 'class': 'jr-box-table jr-default-table' });
            table.attr('cellpadding', 3);
            table.attr('cellspacing', 0);

            var thead = $('<thead />');

            var headerRow = getHeaderRow();
            thead.append(headerRow);

            var tbody = $('<tbody />');
            var selectedElements = $('input[name=\'cb[]\']:checked:enabled');
            if (selectedElements.length == 0) {
                var emptyRow = getEmptyRow();
                tbody.append(emptyRow);
            } else {
                $.each(selectedElements, function(index, selectedElement) {
                    var selectedRow = getSelectedRow(index, selectedElement);
                    tbody.append(selectedRow);
                });
            }

            table.append(thead);
            table.append(tbody);

            return table;
        };

        var getHeaderRow = function() {
            var row = $('<tr></tr>');
            var tableHeaderElements = $('form[id^=\'form_\'] th[shortcut != \'\']');
            $.each(tableHeaderElements, function(key, element) {
                if (key > 2) {
                    return false;
                }
                var headerColumn = $('<th></th>').addClass('jr-box-header');
                var value = $(element).text();
                headerColumn.text(value);
                row.append(headerColumn);
            });

            return row;
        };

        var getEmptyRow = function() {
            var row = $('<tr></tr>');
            var countShortcutRows = $('form[id^=\'form_\'] th[shortcut != \'\']').length;
            var i = 0;
            while (i < countShortcutRows) {
                var emptyColumn = $('<td></td>').text('-');
                row.append(emptyColumn);
                i++;
                if (i === 3) {
                    break;
                }
            }
            return row;
        };

        var getSelectedRow = function(index, selectedElement) {

            var row = $('<tr></tr>');
            var allSelectedColumns = $(selectedElement).parent().parent().children();
            var i = 0;
            $.each(allSelectedColumns, function(key, selectedColumn) {
                var headerElement = $(selectedColumn).closest('table').find('th').eq($(selectedColumn).index());
                if ($(headerElement).attr('shortcut') !== '') {
                    var column = null;
                    if ($(selectedColumn).find('img').length) {
                        column = $('<td></td>').append($(selectedColumn).find('img').clone());
                    } else {
                        var value = $(selectedColumn).find('input').val();
                        if (!value) {
                            value = $(selectedColumn).text();
                        }
                        column = $('<td></td>').text(value);
                    }

                    row.append(column);
                    i++;
                    if (i === 3) {
                        return false;
                    }
                }
            });

            return row;
        };

        var openImportProcessPopup = function() {
            var importButton = {
                text: jr_get_constant_value('CONST_IMPORT'),
                disabled: 'disabled',
                class: 'jr-btn-success',
                click: function() {
                    checkImportXml();
                }
            };

            var cancelButton = {
                text: jr_get_constant_value('CONST_CANCEL'),
                click: function() {
                    $(this).dialog("close");
                }
            };

            options.buttons = [];
            options.buttons.unshift(cancelButton);
            options.buttons.unshift(importButton);

            var loadingLayer = new LoadingLayer('', true, true);
            loadingLayer.show();
            var url = 'index.php?cmd=popup_importXML';

            var parameters = {
                'ajax': true,
                'formName': 'admintools_processes'
            };

            jQuery.post(url, parameters, function() {
            }).always(function() {
                loadingLayer.hide();
            }).done(function(responseObject) {
                var dialog = $JR.widget.dialog('importDialog', options);
                dialog.setTitle(jr_get_constant_value('CONST_IMPORT_PROCESS_FILE'));
                dialog.setContent(responseObject);
                dialog.open();
            });
        };

        var checkImportXml = function() {

            var popupCmd = jQuery('#popupCmd').val();
            var popupFormName = jQuery('#popupFormName').val();
            var action = jQuery('#import_action').val();

            var $popupFormNameSelector = jQuery('#popupForm_' + popupFormName);
            $popupFormNameSelector.attr('action', 'index.php?cmd=' + popupCmd);
            $popupFormNameSelector.attr('target', 'uploadIFrame');

            (new LoadingLayer('', true, false)).show();
            jQuery('.ui-dialog').hide();
            jQuery('#uploadFileDialog').css('display', 'none');
            $popupFormNameSelector.submit();
        };

        var getButtonsForImport = function() {

            var importButton = {
                text: jr_get_constant_value('CONST_IMPORT'),
                class: 'jr-btn-success',
                click: function() {
                    importXml();
                }
            };

            var cancelButton = {
                text: jr_get_constant_value('CONST_CANCEL'),
                click: function() {
                    $(this).dialog("close");
                }
            };

            return [importButton, cancelButton];
        };

        var getButtonsForCancel = function() {
            var cancelButton = {
                text: jr_get_constant_value('CONST_CANCEL'),
                click: function() {
                    $(this).dialog("close");
                }
            };

            return [cancelButton];
        };

        var importXml = function() {
            var action = 'import';
            var params = {};
            params.ajax = true;
            params.formName = popupFormName;
            params.import_action = action;

            params.jrVersion = jQuery('#jrVersion').val();
            var $idConvertFinishRuleSelector = jQuery('#id_convertFinishRule');

            params.convertFinishRule = 0;
            if ($idConvertFinishRuleSelector.length != 0 && $idConvertFinishRuleSelector.attr('checked')) {
                params.convertFinishRule = 1;
            }

            params.newProcessName = jQuery('#id_newProcessName').val();
            params.newProcessVersion = jQuery('#id_newProcessVersion').val();
            params.newProcessTableName = jQuery('#id_newProcessTableName').val();

            var eSubtables = [];
            var countSubtables = jQuery('#countSubtables').val();

            for (var i = 0; i < countSubtables; i++) {
                var newSubtable = jQuery(('id_newSubtables[' + i + ']').buildJQueryIdSelector()).val();
                var oldSubtable = jQuery(('id_oldSubtables[' + i + ']').buildJQueryIdSelector()).val();
                eSubtables[i] = newSubtable + ',' + oldSubtable;
            }
            params["subtables[]"] = eSubtables;

            params = importProcessSamFunctions.setSamAssets('samWebServiceConnections',
                'importSamCreateNewWebserviceConnection', params);
            params = importProcessSamFunctions.setSamAssetConfiguration('samWebServiceConnections', params);

            params = importProcessSamFunctions.setSamAssets('samResourceLists', 'importSamCreateNewResourcelist',
                params);
            params = importProcessSamFunctions.setSamAssetConfiguration('samResourceLists', params);

            var $idDefaultProcessLanguageSelector = jQuery('#id_defaultProcessLanguage');
            if ($idDefaultProcessLanguageSelector.length == 0) {
                params.defaultProcessLanguage = '';
            } else {
                params.defaultProcessLanguage = $idDefaultProcessLanguageSelector.val();
            }

            var $processLanguageListSelector = jQuery('#processLanguagesList');
            if ($processLanguageListSelector.length == 0) {
                params.processLanguagesList = '';
            } else {
                params.processLanguagesList = $processLanguageListSelector.val();
            }

            var popupCmd = jQuery('#popupCmd').val();
            var popupFormName = jQuery('#popupFormName').val();

            var loadingLayer = new LoadingLayer('', true, true);
            loadingLayer.show();
            jQuery('.ui-dialog').hide();

            var url = 'index.php?cmd=' + popupCmd;
            jQuery.post(url, params, function() {
            }).always(function() {
                loadingLayer.hide();
                jQuery('.ui-dialog').show();
            }).done(function(responseObject) {
                var dialog = $JR.widget.dialog('importDialog', options);
                jQuery('#importDialog')[0].innerHTML = responseObject;
                if (!jQuery('#blnError').val() || jQuery('#blnProcessImported').val()) {
                    dialog.setTitle(jr_get_constant_value('CONST_RESULT'));
                    dialog.dialog('option', 'buttons', [
                        {
                            text: jr_get_constant_value('CONST_CLOSE'),
                            click: function() {
                                window.location = 'index.php?cmd=' + getUrlParameter('cmd') +
                                    '&filter=1&action=filter&processname=' +
                                    encodeURIComponent(jQuery('#newProcessName').val());
                            }
                        }
                    ]);
                    dialog.dialog('option', 'height', 250);
                }
                dialog.open();
            });
        };

        var getUrlParameter = function(command) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == command) {
                    return sParameterName[1];
                }
            }
        };

        var openExportProcessPopup = function() {
            var exportButton = {
                text: jr_get_constant_value('CONST_EXPORT'),
                disabled: 'disabled',
                class: 'jr-btn-success',
                click: function() {
                    exportProcess();
                }
            };

            var cancelButton = {
                text: jr_get_constant_value('CONST_CANCEL'),
                click: function() {
                    $(this).dialog("close");
                }
            };

            options.buttons = [];
            options.buttons.unshift(cancelButton);
            options.buttons.unshift(exportButton);

            var loadingLayer = new LoadingLayer('', true, true);
            loadingLayer.show();
            var url = 'index.php?cmd=popup_exportXML';

            var parameters = {
                'ajax': true,
                'formName': 'admintools_processes'
            };

            var parameters = jQuery('#form_admintools_processes').serializeArray();
            parameters.push({
                name: 'ajax',
                value: true
            });
            parameters.push({
                name: 'formName',
                value: 'admintools_processes'
            });

            jQuery.post(url, parameters, function() {
            }).always(function() {
                loadingLayer.hide();
            }).done(function(responseObject) {
                var dialog = $JR.widget.dialog('exportDialog', options);
                dialog.setTitle(jr_get_constant_value('CONST_PLEASE_CHECK'));
                dialog.setContent(responseObject);
                dialog.open();

                if (jQuery('#popupForm_admintools_processes #rows').val() > 0) {
                    var exportButton = jQuery('.ui-dialog-buttonpane').find('.jr-btn-success');
                    exportButton.attr('disabled', false);
                    exportButton.removeClass('ui-state-disabled ui-button-disabled')
                }
            });
        };

        var exportProcess = function() {
            var formName = document.getElementById('formName').value;
            var rows = document.getElementById('rows').value;

            var params = {};
            params.ajax = true;
            params.formName = formName;

            var eProcessName = [];
            for (var i = 0; i < document.getElementsByName('exportProcessName[]').length; i++) {
                eProcessName[i] = document.getElementsByName('exportProcessName[]')[i].value;
            }
            params["exportProcessName[]"] = eProcessName;

            var eVersion = [];
            for (var i = 0; i < document.getElementsByName('exportVersion[]').length; i++) {
                eVersion[i] = document.getElementsByName('exportVersion[]')[i].value;
            }
            params["exportVersion[]"] = eVersion;

            var eFileName = [];
            for (var i = 0; i < document.getElementsByName('exportFileName[]').length; i++) {
                eFileName[i] = document.getElementsByName('exportFileName[]')[i].value;
            }
            params["exportFileName[]"] = eFileName;

            var eFormat = [];
            for (var i = 0; i < document.getElementsByName('exportFormat[]').length; i++) {
                eFormat[i] = document.getElementsByName('exportFormat[]')[i].value;
            }
            params["exportFormat[]"] = eFormat;

            params.action = 'export';
            params.rows = rows;

            var loadingLayer = new LoadingLayer('', true, true);
            loadingLayer.show();
            jQuery('.ui-dialog').hide();

            var dialog = $JR.widget.dialog('exportDialog', options);
            var url = 'index.php?cmd=' + formName;

            jQuery.post(url, params, function() {
            }).always(function() {
                loadingLayer.hide();
                jQuery('.ui-dialog').show();
                dialog.setTitle(jr_get_constant_value('CONST_RESULT'));
                dialog.dialog('option', 'buttons', [
                    {
                        text: jr_get_constant_value('CONST_CLOSE'),
                        click: function() {
                            dialog.close();
                            var count = document.getElementsByName('cb[]').length;
                            for (i = 0; i < count; i++) {
                                document.getElementsByName('cb[]')[i].up().up().
                                    removeClassName('jr-box-table-row-checked');
                                document.getElementsByName('cb[]')[i].checked = false;
                            }
                            jQuery('#form_admintools_processes').attr('action', '');
                        }
                    }
                ]);
            }).done(function(responseObject) {
                dialog.setContent(responseObject);
                dialog.open();
            });
        };

        return {
            openDeletePopup: openDeletePopup,
            openImportProcessPopup: openImportProcessPopup,
            openExportProcessPopup: openExportProcessPopup,
            getButtonsForImport: getButtonsForImport,
            getButtonsForCancel: getButtonsForCancel
        };
    };
})(jQuery);

var hideLoadingLayer = function() {
    (new LoadingLayer(null, true, true)).hide();
};

var checkForbiddenCharsInFilename = function(inputElement) {
    var fileName = inputElement.value;
    if (fileName.match(/[^A-Za-z0-9_]/)) {
        alert(jr_get_constant_value('CONST_FILENAME_ALLOWED_CHARACTERS'));
        newFileName = fileName.replace(/[^A-Za-z0-9_]/g, "")
        inputElement.value = newFileName;
    }
};

var systemAnalysisExport = function() {
    var loadingLayer = new LoadingLayer();
    loadingLayer.show();
    var title = jr_get_constant_value("CONST_SYSTEM_ANALYSIS_EXPORT_TITLE");
    var content = jr_get_constant_value("CONST_SYSTEM_ANALYSIS_EXPORT_DESCRIPTION");
    var dialog = $JR.widget.dialog('systemAnalysisExport');
    var options = getDefaultPopupOptions();
    options.minHeight = 300;
    options.minWidth = 400;
    options.buttons[0].text = jr_get_constant_value('CONST_CANCEL');

    var exportButton = {
        text: jr_get_constant_value('CONST_EXPORT'),
        class: 'jr-btn-success',
        click: function() {
            loadingLayer.show();
            var ticketUrl = location.href.replace("?", "?action=export&");
            jQuery.get(ticketUrl, {}, function() {
            }, 'json').always(function() {
                loadingLayer.hide();
                dialog.close();
            }).done(function(responseObject) {
                if (responseObject.status === "ok") {
                    var downloadLink = 'export.php?type=ticket&filename=jranalysis.zip&action=download&ticketId=' +
                        responseObject.result + '';
                    location.href = downloadLink;
                } else if (responseObject.error) {
                    showErrorPopup(jr_get_constant_value(responseObject.error));
                }
            });
        }
    };
    options.buttons.unshift(exportButton);
    dialog.setOptions(options);
    dialog.setTitle(jr_get_constant_value(title));
    dialog.setContent(content);
    dialog.open();
    loadingLayer.hide();
};

var systemAnalysisImport = function() {
    var loadingLayer = new LoadingLayer();
    loadingLayer.show();
    var title = jr_get_constant_value("CONST_SYSTEM_ANALYSIS_IMPORT_TITLE");
    var content = '<form id="system_analysis_import" method="post" enctype="multipart/form-data" action="' +
        location.href + '">';
    content += jr_get_constant_value("CONST_SYSTEM_ANALYSIS_IMPORT_DESCRIPTION");
    content += getDragAndDropArea();
    content += '<input type="hidden" name="action" value="import" />';
    content += '</form>';
    var dialog = $JR.widget.dialog('systemAnalysisImport');
    var options = getDefaultPopupOptions();
    options.minHeight = 300;
    options.minWidth = 400;
    options.buttons[0].text = jr_get_constant_value('CONST_CANCEL');

    var importButton = {
        text: jr_get_constant_value('CONST_IMPORT'),
        class: 'jr-btn-success',
        click: function() {
            jQuery('#system_analysis_import').submit();
        }
    };
    options.buttons.unshift(importButton);
    dialog.setOptions(options);
    dialog.setTitle(jr_get_constant_value(title));
    dialog.setContent(content);
    dialog.open();
    loadingLayer.hide();
};

var extractFileNameFromFilePath = function(path) {
    if (path.indexOf('/') >= 0) {
        return (path.substr(path.lastIndexOf('/') + 1));
    }

    return (path.substr(path.lastIndexOf('\\') + 1));
};

var setVisibilityForSubtableActionButtons = function(subtable, val) {
    var subtableActions = ['add_value', 'add', 'copy', 'delete', 'template'];
    if (val) {
        subtableActions.forEach(function(action) {
            jQuery((subtable + '_' + action).buildJQueryIdSelector()).hide();
        });
    } else {
        subtableActions.forEach(function(action) {
            jQuery((subtable + '_' + action).buildJQueryIdSelector()).show();
        });
    }
};

var ajaxRequestDirectDownload = function(url, params) {
    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();
    return jQuery.post(url, params, null, 'json').always(function() {
        loadingLayer.hide();
    }).fail(function() {
        showErrorPopup(jr_get_constant_value("CONST_AJAX_REQUEST_ERROR"));
    }).done(function(responseObject) {
        if (responseObject.status === "ok") {
            var filename = responseObject.result.filename;
            var ticketId = responseObject.result.ticketId;
            var downloadLink = 'export.php?type=ticket&filename=' + filename + '&action=download&ticketId=' + ticketId +
                '';
            location.href = downloadLink;
        } else if (responseObject.status === 'error') {
            showErrorPopup(jr_get_constant_value(responseObject.message));
        }
    });
};

var submitFormViaHiddenIframe = function(form, action_url, dialog) {
    var iframeId = 'upload_iframe';
    var iframe = createUploadIframe(iframeId);
    form.parentNode.appendChild(iframe);
    window.frames[iframeId].name = iframeId;

    var iframeElement = document.getElementById(iframeId);
    jQuery(iframeElement).load(function() {
        new LoadingLayer('', true, true).hide();
        var content = getIframeContentAsText(iframeElement);
        var iframe = jQuery(this);
        iframe.unbind('load');
        setTimeout(function() {
            iframe.remove();
        }, 250);
        handleJsonResultResponse(dialog, jQuery.parseJSON(content));
    });

    form.setAttribute("target", iframeId);
    form.setAttribute("action", action_url);
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("encoding", "multipart/form-data");
    form.submit();

    new LoadingLayer('', true, true).show();
};

var getIframeContentAsText = function(iframeElement) {
    if (iframeElement.contentDocument) {
        return iframeElement.contentDocument.body.innerHTML;
    }
    if (iframeElement.contentWindow) {
        return iframeElement.contentWindow.document.body.innerHTML;
    }
    if (iframeElement.document) {
        return iframeElement.document.body.innerHTML;
    }
    return '';
};

var createUploadIframe = function(iframeId) {
    if (arguments.length === 0) {
        iframeId = "upload_iframe";
    }
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", iframeId);
    iframe.setAttribute("name", iframeId);
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
    return iframe;
};

var handleJsonResultResponse = function(dialog, responseObject) {
    jQuery('#general-errors').hide();

    if (responseObject.status === 'ok') {
        dialog.dialog("close");
        var url = '';
        if (typeof urlAfterSubmitviaHiddenIframe !== 'undefined' && urlAfterSubmitviaHiddenIframe) {
            url = urlAfterSubmitviaHiddenIframe;
        } else {
            url = (window.location.href).replace(/#/g, "");
        }
        window.location.href = url;
        return;
    }

    if (responseObject.status !== 'error') {
        return;
    }
    jQuery('#general-errors').html('').show();

    if (responseObject.elements) {
        jQuery.each(responseObject.elements, function(index, value) {
            jQuery('#general-errors').append('<div class="jr-notification-popup jr-notification-error"><i class="jr-icon-notification-error"></i><span>' + value.error + '</span></div>')
        });
        return;
    }

    addGeneralError(responseObject.message);
};

var addGeneralError = function(message) {
    jQuery('#general-errors').append('<div class="jr-notification-popup jr-notification-error"><i class="jr-icon-notification-error"></i><span>' + message + '</span></div>')
};

function initFormValidation(formId, submitHandler) {
    jQuery(document).ready(function() {
        jQuery(formId.buildJQueryIdSelector()).validate({
            ignore: "input[id*='autogen'] .ignore-validation",
            submitHandler: submitHandler,
            errorPlacement: function(error, element) {
                element.parent().prepend(error);
            },
            highlight: function(element, errorClass, validClass) {
                var elem = jQuery(element);
                if (elem.hasClass('ignore-validation')) {
                    return;
                }

                if (elem.data('select2')) {
                    jQuery(('s2id_' + elem.attr('id') + ' ul').buildJQueryIdSelector()).addClass(errorClass);
                } else {
                    elem.addClass(errorClass);
                }
            }, //When removing make the same adjustments as when adding
            unhighlight: function(element, errorClass, validClass) {
                var elem = jQuery(element);
                if (elem.data('select2')) {
                    jQuery(('s2id_' + elem.attr('id') + ' ul').buildJQueryIdSelector()).removeClass(errorClass);
                } else {
                    elem.removeClass(errorClass);
                }
            }
        });
        // workaround for jQuery dialog error on select2 search, see http://goo.gl/FEBCHN
        if (jQuery.ui && jQuery.ui.dialog && jQuery.ui.dialog.prototype._allowInteraction) {
            var ui_dialog_interaction = jQuery.ui.dialog.prototype._allowInteraction;
            jQuery.ui.dialog.prototype._allowInteraction = function(e) {
                if (jQuery(e.target).closest('.select2-drop').length) {
                    return true;
                }
                return ui_dialog_interaction.apply(this, arguments);
            };
        }

    });
}

var jr_get_instance_id = function() {
    var instanceId = document.documentElement.dataset.jrInstanceId;

    if (typeof instanceId === 'undefined') {
        return void 0;
    }

    return parseInt(instanceId, 10);
};

var validateJobFerdXmlTemplate = function(templateName) {

    clearValidationErrorMessages();

    if (!templateName) {
        insertValidationErrorMessage();
        return;
    }

    var url = 'index.php?cmd=Ajax&&cmd_target=validateJobFerdXmlTemplate&templateName=' + templateName;

    jQuery.ajax({
        url: url
    }).done(function(data, textStatus, jqXHR) {
        jQuery.parseJSON(data).each(function(element) {
            $(validationMessages).push({
                'name': element.name,
                'message': element.value
            });
        });
        insertValidationErrorMessage();
    });
};

var showTableWidgetFilterOptionsPopup = function(clickedImage, url, options) {
    if (arguments.length < 3) {
        options = {};
    }
    var hiddenInputField = jQuery(clickedImage).parent().find('input[type=hidden]');
    var dialogTitle = jr_get_constant_value('CONST_SETTINGS');

    return ajaxShowPopupCommand(url, hiddenInputField, dialogTitle, options);
};

//noinspection JSUnusedGlobalSymbols
var showArchiveTableWidgetFilterOptionsPopup = function(clickedImage, url) {
    var hiddenInputField = jQuery(clickedImage).parent().find('input[type=hidden]');
    var tableValues;
    var hiddenInputValue = hiddenInputField.val();

    if (jQuery.trim(hiddenInputValue).length > 0 && hiddenInputValue !== 'null') {
        tableValues = hiddenInputValue.toQueryParams();
    } else {
        tableValues = '';
    }

    var options = {
        extraParams: {
            params: [
                'tablename', 'fieldname', tableValues, 1, //!load from DB required
                50 //max input length
            ]
        }
    };
    return showTableWidgetFilterOptionsPopup(clickedImage, url, options);
};

var ajaxShowPopupCommandHelper = function(url, requestParameters) {
    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();
    var settings = {
        method: "POST",
        url: url,
        data: requestParameters
    };

    return jQuery.ajax(settings).always(function() {
        loadingLayer.hide();
    });

    //return jQuery.get(url, requestParameters, function () {
    //}).always(function () {
    //	loadingLayer.hide();
    //});
};

var ajaxShowPopupCommand = function(url, hiddenFieldStore, dialogTitle, options) {
    var dialogName = 'dialog-for-' + hiddenFieldStore.attr('name');
    var defaults = {
        modal: true,
        width: 900,
        minWidth: (jQuery(window).width() / 100 * 50),
        minHeight: 500,
        maxHeight: jQuery(window).height() - 50,
        buttons: [
            {
                text: jr_get_constant_value('CONST_SAVE'),
                class: 'jr-btn-success',
                click: function() {
                    var serializedForm = jQuery(this).find('form').serialize();
                    hiddenFieldStore.val(serializedForm);
                    jQuery(this).dialog("destroy");
                    hiddenFieldStore.change();
                }
            }, {
                text: jr_get_constant_value('CONST_ABORT'),
                click: function() {
                    jQuery(this).dialog("destroy");
                }
            }
        ],
        close: function() {
            jQuery(this).dialog("destroy");
        },
        extraParams: {}
    };

    var settings = jQuery.extend({}, defaults, options);
    var hiddenValue = hiddenFieldStore.val();
    var params = jQuery.extend({}, hiddenValue.toQueryParams(), settings.extraParams);

    return ajaxShowPopupCommandHelper(url, params).done(function(responseHtml) {
        dialog = $JR.widget.dialog(dialogName);
        dialog.setTitle(dialogTitle);
        dialog.setContent(responseHtml);
        dialog.setOptions(settings);
        dialog.open();
    });
};

var showNewTranslationPopup = function(clickedImage, defaultLanguageElementId, dialogTitle) {

    var url = "index.php?cmd=popup_showTranslations";
    var hiddenInputField = jQuery(clickedImage).closest('td').find('input[type=hidden]');
    var defaultLanguage = jQuery('#translation_default_language').val();
    var defaultLanguageTextboxId = 'id_' + jQuery(clickedImage).find('i').attr('id').substring(4);
    var hiddenInputValue = hiddenInputField.val();
    var params = [];
    var translations = '';

    if (jQuery.trim(hiddenInputValue).length > 0) {
        translations = hiddenInputValue.toQueryParams();
    }

    params[0] = translations;
    params[1] = translations['translation_' + defaultLanguage] || '';
    params[2] = defaultLanguage;
    params[3] = 'textbox';
    params[4] = 'user';

    var options = {
        extraParams: {
            params: params
        },
        width: 520,
        minWidth: 520
    };

    hiddenInputField.unbind('change').change(function() {
        var translations = jQuery(this).val().toQueryParams();
        var defaultTranslationKey = 'translation_' + defaultLanguage;
        if (translations[defaultTranslationKey]) {
            jQuery(defaultLanguageTextboxId.buildJQueryIdSelector()).val(translations[defaultTranslationKey]);
        }
    });

    return ajaxShowPopupCommand(url, hiddenInputField, dialogTitle, options);
};

var normalizeDomId = function(domId, preserveCase) {
    if (arguments.length === 1) {
        preserveCase = true;
    }

    var normalizedId = domId.toString().replace(/\s/g, '_');

    if (preserveCase === false) {
        return normalizedId.toLowerCase();
    }

    return normalizedId;
};

/*******************************************************************************
 Dialogintegration
 *******************************************************************************/
var initResizeHandlers = function() {
    if (!jQuery('#bottomHandler').hasClass('hidden')) {
        initBottomIntegration();
    }
    if (!jQuery('#rightHandler').hasClass('hidden')) {
        initRightIntegration();
    }
};

var destroyResizableInstance = function(selector) {
    if (jQuery(selector).resizable('instance') == undefined) {
        return;
    }

    jQuery(selector).resizable('destroy');
};

var initRightIntegration = function() {
    destroyResizableInstance('#dialogAndRightHandler');
    jQuery('#dialogAndRightHandler').resizable({
        handles: { 'e': '#rightHandler' },
        create: function(event, ui) {
            jQuery('#rightHandler').mousedown(function() {
                jQuery('#integration_right_iframe').css('pointer-events', 'none');
            });
            jQuery(document).mouseup(function() {
                jQuery('#integration_right_iframe').css('pointer-events', 'auto');
            });
        },
        start: function(event, ui) {
            window.onresize = '';
        },
        stop: function(event, ui) {
            window.onresize = resizeContent;
            saveIntegrationSize(jQuery('#rightIntegration').width(), 'right');
        },
        resize: function(event, ui) {
            resizeRightIntegrationWidth();
            repositionNotifications();
        }
    });

    jQuery('#dialogAndRightHandler').resizable('enable');
};

var initBottomIntegration = function() {
    destroyResizableInstance('#upperStepContent');
    jQuery('#upperStepContent').resizable({
        handles: { 's': '#bottomHandler' },
        create: function(event, ui) {
            var $integrations = jQuery('#integration_right_iframe, #integration_bottom_iframe');
            jQuery('#bottomHandler').mousedown(function() {
                $integrations.css('pointer-events', 'none');
            });
            jQuery(document).mouseup(function() {
                $integrations.css('pointer-events', 'auto');
            });
        },
        start: function(event, ui) {
            window.onresize = '';
        },
        stop: function(event, ui) {
            window.onresize = resizeContent;
            saveIntegrationSize(jQuery('#bottomIntegration').height(), 'bottom');
        },
        resize: function(event, ui) {
            resizeDialogAndRightIntegrationHeight();
            resizeBottomIntegrationHeight();
            repositionNotifications();
        }
    });

    jQuery('#upperStepContent').resizable('enable');
};

var integrationIsJobViewer = function(id) {
    var $integrationFrame = jQuery('#' + id);
    return $integrationFrame.length && $integrationFrame.hasClass('jr-viewer-used');
};

var hideRightIntegration = function() {
    jQuery('#rightFrameToggleImageHide').hide();
    jQuery('#rightFrameToggleImageShow').show();
    jQuery('#rightIntegration').addClass('hidden');
    jQuery('#rightIntegration').removeClass('jr-inline-block');
    resizeDialogWidth();
    jQuery('#dialogAndRightHandler').resizable('disable');
    repositionNotifications();
    jQuery(document).trigger('jr-rearrange-dialog-pages');
};

var showRightIntegration = function() {
    jQuery('#rightFrameToggleImageHide').show();
    jQuery('#rightFrameToggleImageShow').hide();
    jQuery('#rightIntegration').removeClass('hidden');
    jQuery('#rightIntegration').addClass('jr-inline-block');
    resizeDialogWidth();
    jQuery('#dialogAndRightHandler').resizable('enable');
    repositionNotifications();
    jQuery(document).trigger('jr-rearrange-dialog-pages');
};

var saveIntegrationSize = function(size, type) {
    var parameters = {};
    var input = {};
    input.username = $JRUSER.userName;
    input.processname = $JRSTEP.processname;
    input.step = $JRSTEP.step;
    input.integrationType = type;
    input.integrationSize = size;

    if (window.storeWindowSettingsTimeout) {
        clearTimeout(window.storeWindowSettingsTimeout);
    }

    window.storeWindowSettingsTimeout = setTimeout(function() {
        parameters.settings = Object.toJSON(input);
        jQuery.post("index.php?cmd=Ajax_UpdateIntegrationSize", parameters, function() {
        }, 'json');
    }, 500);
};

/*******************************************************************************
 Neuberechnung der Höhen und Breiten
 *******************************************************************************/
var correctHeightByElements = function($element, elementSelectorsForHeightCorrection, staticHeightReduction) {
    staticHeightReduction = arguments.length >= 3 ? staticHeightReduction : 2;

    var height = document.body.getBoundingClientRect().height;
    var heightCorrection = calculateHeightCorrectionForElementSelectors(elementSelectorsForHeightCorrection);
    heightCorrection += calculateHeightCorrectionForMessageContainers();
    heightCorrection += staticHeightReduction;
    $element.height(height - heightCorrection);
};

var calculateHeightCorrectionForElementSelectors = function(elementSelectorsForHeightCorrection) {
    var heightCorrection = 0, $currentElement, i;
    for (i = 0; i < elementSelectorsForHeightCorrection.length; i++) {
        $currentElement = jQuery(elementSelectorsForHeightCorrection[i]);
        if (!$currentElement.length) {
            continue;
        }
        if (!$currentElement.is(':visible')) {
            continue;
        }
        heightCorrection += $currentElement.outerHeight(true);
    }
    return heightCorrection;
};

var calculateHeightCorrectionForMessageContainers = function() {
    var messageContainer = '', heightCorrection = 0, i;
    for (i = 0; i < 10; i++) {
        messageContainer = 'stepMessagesContainer' + i;
        if ($(messageContainer) == null) {
            break;
        }
        if (!$(messageContainer).visible()) {
            continue;
        }
        heightCorrection += $(messageContainer).getHeight();
    }
    return heightCorrection;
};

var resizeDialogWidth = function() {
    var dialogWidth = jQuery('#upperStepContent').width();
    if (jQuery('#rightIntegration').is(':visible')) {
        dialogWidth -= Math.round(jQuery('#rightIntegration')[0].getBoundingClientRect().width);
    }
    jQuery('#dialogAndRightHandler').width(dialogWidth - 1);

    resizeRightIntegrationWidth();

    var handlerWidth = jQuery('#rightHandler').is(':visible') ? 7 : 0;
    jQuery('#jr-step-dialog-tab-contents').width(dialogWidth - 20 - handlerWidth);

    jQuery(document).trigger('jr-rearrange-dialog-pages');
};

var resizeStepContentHeight = function() {
    var $content = jQuery('#stepContentContainer');
    correctHeightByElements($content, [
        '#jr-header', '#jr-headline'
    ], 6); // 6px for Firefox
    var pageHeight = $content.height();
    if (jQuery('#bottomIntegration').is(':visible')) {
        pageHeight -= jQuery('#bottomIntegration').height();
    }
    jQuery('#upperStepContent').height(pageHeight);
    updateStepDialogTabContentsHeight(pageHeight);
};

var resizeDialogAndRightIntegrationHeight = function() {
    var newHeight = jQuery('#upperStepContent').height();
    if (jQuery('#bottomHandler').is(':visible')) {
        newHeight -= jQuery('#bottomHandler').height();
    }

    var $integrationFrame = jQuery('#integration_right_iframe');
    if (integrationIsJobViewer('integration_right_iframe') && !$integrationFrame[0].contentWindow.viewerReady) {
        return;
    }

    jQuery('#dialogAndRightIntegration').height(newHeight);
    updateStepDialogTabContentsHeight(newHeight);
};

var updateStepDialogTabContentsHeight = function(pageHeight) {
    jQuery('#jr-step-dialog-tab-contents').height(pageHeight - 20); // correct padding from .stepContentContainer .jr-tab-contents
};

var resizeBottomIntegrationHeight = function() {
    var $integrationFrame = jQuery('#integration_bottom_iframe');
    if (integrationIsJobViewer('integration_bottom_iframe') && !$integrationFrame[0].contentWindow.viewerReady) {
        return;
    }
    var $bottomIntegration = jQuery('#bottomIntegration');
    if (!$bottomIntegration.is(':visible')) {
        return;
    }

    var contentHeight = jQuery('#stepContentContainer').height();
    var dialogContentHeight = jQuery('#upperStepContent').height();
    $bottomIntegration.height(contentHeight - dialogContentHeight);
};

var resizeRightIntegrationWidth = function() {

    var $integrationFrame = jQuery('#integration_right_iframe');
    if (integrationIsJobViewer('integration_right_iframe') && !$integrationFrame[0].contentWindow.viewerReady) {
        return;
    }
    var $rightIntegration = jQuery('#rightIntegration');
    if (!$rightIntegration.is(':visible')) {
        return;
    }

    var dialogWidth = jQuery('#dialogAndRightIntegration').width();
    var contentWidth = jQuery('#dialogAndRightHandler').width();
    $rightIntegration.width(dialogWidth - contentWidth - 1);

    jQuery('#jr-step-dialog-tab-contents').width(contentWidth - 27);
    jQuery(document).trigger('jr-rearrange-dialog-pages');
};

var repositionNotifications = function() {
    var $rightIntegration = jQuery('#rightIntegration');
    var $bottomIntegration = jQuery('#bottomIntegration');

    if ($rightIntegration.length + $bottomIntegration.length === 0) {
        return;
    }

    var $notificationContainer = jQuery('#jr-notifications');

    if ($rightIntegration.length) {
        if (typeof repositionNotifications.notificationRightOffset == 'undefined') {
            repositionNotifications.notificationRightOffset = +$notificationContainer.css('right').replace('px', '');
        }

        var integrationWidth = repositionNotifications.notificationRightOffset + jQuery('#rightHandler').width();

        if ($rightIntegration.is(':visible')) {
            integrationWidth += $rightIntegration.width();
        }

        $notificationContainer.css('right', integrationWidth);
    }

    if ($bottomIntegration.length) {
        if (typeof repositionNotifications.notificationTopOffset == 'undefined') {
            repositionNotifications.notificationTopOffset = +$notificationContainer.css('top').replace('px', '') -
                +jQuery('#jr-header').height() - jQuery('#jr-headline').height() -
                jQuery('#jr-step-dialog-tabs').height() + jQuery('#bottomHandler').height();
        }

        var height = jQuery('#upperStepContent').height() - repositionNotifications.notificationTopOffset;
        var innerHeight = $notificationContainer.find('.jr-notifications-inner').outerHeight();

        if (innerHeight < height) {
            $notificationContainer.css('height', 'auto');
            return;
        }

        $notificationContainer.height(height);
    }
};

var resizeContent = function() {
    resizeStepContentHeight();
    resizeDialogAndRightIntegrationHeight();
    resizeDialogWidth();
    repositionNotifications();
};

var getKeywordMultiSelectData = function(params) {
    var cmd = 'Ajax_KeywordList';
    var archive = params.archive;
    var field = params.field;
    var entriesPerPage = params.entriesPerPage;

    return {
        url: "index.php",
        dataType: 'json',
        data: function(cmdParams, page) {
            return {
                cmd: cmd,
                archive: archive,
                field: field,
                searchTerm: cmdParams,
                page: page
            };
        },
        results: function(data, page) {
            var more = (page * entriesPerPage) < data.total_count;

            if (data.items && data.items.length == 0) {
                more = false;
            }

            return {
                results: data.items,
                more: more
            };
        },
        cache: true
    };
};

var reloadPhpFunctionParameters = function(idPrefix, obj, params) {
    var functionSuffix = idPrefix + '_function';
    var descriptionSuffix = functionSuffix + '_description';
    var parametersSuffix = functionSuffix + '_parameters';
    var tableRowSelector = ('tr_' + descriptionSuffix).buildJQueryIdSelector();

    if (obj.value === '') {
        jQuery(tableRowSelector).hide();
        jQuery(parametersSuffix.buildJQueryIdSelector()).hide();
        return;
    }
    jQuery(('div_' + functionSuffix).buildJQueryIdSelector()).find("td").first().append('<span class="' + idPrefix +
        '-function-loading-layer"><img src="images/loading.gif" width="15" height="15" alt="loading"></span>');

    jQuery(descriptionSuffix.buildJQueryIdSelector()).html('&nbsp;');
    var defaults = {
        id: jQuery(('id_' + functionSuffix).buildJQueryIdSelector()).val()
    };
    params = jQuery.extend({}, defaults, params);

    jQuery.get("index.php?cmd=ajax&cmd_target=getPhpFunctionDescription", params).done(function(response) {
        jQuery(tableRowSelector).show();
        jQuery('#div_function_link').css("visibility", "");
        jQuery(descriptionSuffix.buildJQueryIdSelector()).html(response);

    });
    jQuery(obj).parent().find('a').show().css('visibility', '');
    jQuery.get("index.php?cmd=Popup_PhpFunctionParameters", params).done(function(response) {
        var $parametersElement = jQuery(parametersSuffix.buildJQueryIdSelector());
        $parametersElement.show();
        $parametersElement.html(response);
        $parametersElement.find("script").each(function(i) {
            eval(jQuery(this).text());
        });
        jQuery('.' + idPrefix + '-function-loading-layer').remove();
    });
};

var initColorPicker = function(colorPickerElement, name, color, disabled, options) {
    var defaults = {
        color: '' + color + '',
        className: 'jr-form-control jr-form-control-color-picker',
        showInput: true,
        showInitial: true,
        disabled: disabled,
        showSelectionPalette: true,
        preferredFormat: "hex",
        chooseText: $JR_JS_CONSTANTS.CONST_OK,
        cancelText: $JR_JS_CONSTANTS.CONST_ABORT,
        change: function(definedColor) {
            jQuery(name.buildJQueryIdSelector()).val(definedColor.toHexString());
        }
    };

    var settings = jQuery.extend( {}, defaults, options );
    jQuery(colorPickerElement.buildJQueryIdSelector()).spectrum(settings);
};

var getSerializedDialog = function() {
    var filteredElements = jQuery('#dialogForm').serializeArray().filter(function(item) {
        return item.name != 'jr_send';
    });
    return jQuery.param(filteredElements);
};

String.prototype.buildJQueryIdSelector = function() {
    return "#" + this.replace(/(:|\.|\[|\]|,|\?)/g, "\\$1");
};

String.prototype.isValidDate = function() {
    var IsoDateRe = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");
    var matches = IsoDateRe.exec(this);
    if (!matches) {
        return false;
    }

    var composedDate = new Date(matches[1], (matches[2] - 1), matches[3]);

    return ((composedDate.getMonth() == (matches[2] - 1)) && (composedDate.getDate() == matches[3]) &&
    (composedDate.getFullYear() == matches[1]));
};

var toggleAllFormCheckboxes = function(element) {
    var cbAllElement = jQuery(element);
    if (cbAllElement.attr('checked')) {
        cbAllElement.closest("form").find("input[type=checkbox]").attr("checked", "checked");
    } else {
        cbAllElement.closest("form").find("input[type=checkbox]").removeAttr("checked");
    }
};

var ajaxPostRequest = function(url, params, dataType) {
    if (arguments.length < 3) {
        dataType = 'json';
    }

    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();
    return jQuery.post(url, params, null, dataType).always(function() {
        loadingLayer.hide()
    });
};

/**
 * This function is a quick fix for bug 6601 and has to be implmented correctly.
 * @param idPart
 * @param method
 */
var toggleSubtableRadioButtonGroupColumnVisibility = function(idPart, method) {
    var idStart = (idPart).buildJQueryIdSelector().replace('#', '');
    var $inputs = jQuery('input[id^="' + idStart + '"]');
    var $referenceTableCell = jQuery($inputs[0]).closest('td');
    jQuery.each($inputs, function(index, element) {
        jQuery(element).closest('td')[method]();
    });
    $referenceTableCell.closest('table').find('th').eq($referenceTableCell.index())[method]();
};

var showContextMenu = function(element) {

    var contextMenu = jQuery('#contextmenu');

    jQuery(document).click(function(event) {
        var target = jQuery(event.target);
        if (!target.hasClass('select-menu')) {
            try {
                contextMenu.menu('destroy');
                contextMenu.next('.jr-footer-contextmenu').remove();
                contextMenu.css('display', 'none');
                return;
            } catch(e) {
                return;
                // do nothing
            }
        }

        var linkElement = jQuery(target).closest('a');
        var elementActions = jQuery(linkElement).data('contextMenuItems');
        contextMenu.empty();
        if (!elementActions) {
            return;
        }
        for (var i = 0; i < elementActions.length; i++) {
            contextMenu.append(elementActions[i].label);
            contextMenu.menu("refresh");
            var menuItem = jQuery('#contextmenu').find('li').last();
            var func = JSONfn.parse(elementActions[i].onClick);
            menuItem.bind("click", func);
        }
    });

    var offset = jQuery(element).offset();
    contextMenu.css({
        top: offset.top - 6,
        left: offset.left + 19,
        display: ''
    });

    // make sure site footer doesn't block entries
    contextMenu.after('<div class="jr-footer-contextmenu"></div>')

    contextMenu.menu();
};

var showManualListing = function() {
    var options = {
        modal: true,
        minHeight: 500,
        maxHeight: (jQuery(window).height() - 50),
        minWidth: 400,
        close: function(event, ui) {
            jQuery(this).dialog('close').dialog('destroy').remove();
        },
        buttons: [
            {
                text: jr_get_constant_value($JR_JS_CONSTANTS.CONST_CLOSE),
                click: function() {
                    jQuery(this).dialog("close");
                }
            }
        ]
    };

    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();
    jQuery.getJSON("index.php?cmd=Ajax_Manual").always(function() {
        loadingLayer.hide()
    }).done(function(response) {
        var listingEntries = {};
        if (response.result) {
            listingEntries = response.result;
        }

        var manualURLs = Object.keys(listingEntries);
        if (manualURLs.length == 1) {
            var win = window.open(manualURLs[0]);
            if (win) {
                return;
            }
        }

        var dialog = $JR.widget.dialog('showManualListing', options);
        dialog.setTitle(jr_get_constant_value('CONST_MANUAL'));

        var content = '<div class="jr-form-row manual-listing-filter-wrapper">';
        content += '<label class="jr-form-label" for="manual-listing-filter">' + jr_get_constant_value('CONST_SEARCH') +
            '</label>';
        content += '<span class="jr-form-control-wrapper">';
        content += '<input class="jr-form-control" autocomplete="off" type="text" name="manual-listing-filter" id="manual-listing-filter" value="" autofocus onkeyup="filterManualListingEntries(this);">';
        content += '</span>';
        content += '</div>';

        var borderStyle = showEmptyMessage ? '' : 'style="border:none;"';

        content += '<ul class="jr-manual-listing" ' + borderStyle + '>';
        var showEmptyMessage = true;
        jQuery.each(listingEntries, function(url, label) {
            content += '<li class="jr-manual-listing-item"><a href="' + url + '" target="_blank">' + label +
                '</a></li>';
            showEmptyMessage = false;
        });

        content += '<li class="jr-manual-listing-item-empty' + (showEmptyMessage ? '' : ' hidden') +
            '"><i class="jr-icon-notification-info"></i><span>' + jr_get_constant_value('CONST_NO_MANUAL_AVAILABLE') +
            '</span></li>';

        content += '</ul>';
        dialog.setContent(content);
        dialog.open();

    }).fail(function() {
        $JR.NOTIFICATION.show(jr_get_constant_value('CONST_ERROR'), 'error');
    });
}

var filterManualListingEntries = function(element) {
    var searchString = jQuery(element).val().toLowerCase();
    if (searchString.trim() === '') {
        jQuery('.jr-manual-listing-item').removeClass('hidden').not(':last').css('border-width', '1px');
        return;
    }
    jQuery('.jr-manual-listing-item').each(function() {
        var text = jQuery(arguments[1]).text().toLowerCase();
        jQuery(this).removeClass('hidden');
        if (text.indexOf(searchString) === -1) {
            jQuery(this).addClass('hidden');
        }
    });
    var emptyItem = jQuery('.jr-manual-listing-item-empty');
    var visibleListItems = jQuery('.jr-manual-listing-item:not(.hidden)');
    visibleListItems.last().css('border-width', 0);
    emptyItem.addClass('hidden');
    if (visibleListItems.length === 0) {
        emptyItem.removeClass('hidden');
    }
};

var getSmallSpinner = function() {
    return '<span class="jr-spinner-small jr-spinner-inline"></span>';
};

var getSpinner = function() {
    return '<div class="jr-spinner"></div>';
};

var getDashboardSpinner = function() {
    return '<div class="jr-spinner-small"></div>';
};

var jr_status_test = function(params) {
    new Ajax.Updater('test_result', 'index.php?cmd=Ajax', {
        method: 'get',
        parameters: params,
        onComplete: function() {
            jQuery('#test_image').hide();
        },
        onLoading: function() {
            jQuery('#test_result').text('');
            jQuery('#test_image').show();
        }
    });
}
