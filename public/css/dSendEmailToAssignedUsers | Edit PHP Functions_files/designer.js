$JRDESIGNER = {};

$JRDESIGNER.getDialogElements = function(processName, version, dialog, successCallback, errorCallback) {
    if (Object.isUndefined(successCallback)) {
        successCallback = function(data) {
            alert('Request done: ' + data);
        };
    }

    if (Object.isUndefined(errorCallback)) {
        errorCallback = function(jqXHR, textStatus) {
            alert('Request failed: ' + textStatus);
        };
    }

    var url = 'index.php';
    var data = {
        cmd: 'Ajax_Designer',
        action: 'getDialogElements',
        process: processName,
        version: version,
        dialog: dialog
    };
    jQuery.getJSON(url, data).done(successCallback).fail(errorCallback);
};

$JRDESIGNER.getTableFields = function(processName, version, successCallback, errorCallback) {
    if (Object.isUndefined(successCallback)) {
        successCallback = function(data) {
            alert('Request done: ' + data);
        };
    }

    if (Object.isUndefined(errorCallback)) {
        errorCallback = function(jqXHR, textStatus) {
            alert('Request failed: ' + textStatus);
        };
    }

    var url = 'index.php';
    var data = {
        cmd: 'Ajax_Designer',
        action: 'getTableFields',
        process: processName,
        version: version
    };
    jQuery.getJSON(url, data).done(successCallback).fail(errorCallback);
};

$JRDESIGNER.getSubtables = function(processName, version, successCallback, errorCallback) {
    if (Object.isUndefined(successCallback)) {
        successCallback = function(data) {
            alert('Request done: ' + data);
        };
    }

    if (Object.isUndefined(errorCallback)) {
        errorCallback = function(jqXHR, textStatus) {
            alert('Request failed: ' + textStatus);
        };
    }

    var url = 'index.php';
    var data = {
        cmd: 'Ajax_Designer',
        action: 'getSubtables',
        process: processName,
        version: version
    };
    jQuery.getJSON(url, data).done(successCallback).fail(errorCallback);
};

$JRDESIGNER.getSubtableFields = function(processName, version, subtable, successCallback, errorCallback) {
    if (Object.isUndefined(successCallback)) {
        successCallback = function(data) {
            alert('Request done: ' + data);
        };
    }

    if (Object.isUndefined(errorCallback)) {
        errorCallback = function(jqXHR, textStatus) {
            alert('Request failed: ' + textStatus);
        };
    }

    var url = 'index.php';
    var data = {
        cmd: 'Ajax_Designer',
        action: 'getSubtableFields',
        process: processName,
        version: version,
        subtable: subtable
    };
    jQuery.getJSON(url, data).done(successCallback).fail(errorCallback);
};

$JRDESIGNER.getSubtableViews = function(processName, version, dialog, successCallback, errorCallback) {
    if (Object.isUndefined(successCallback)) {
        successCallback = function(data) {
            alert('Request done: ' + data);
        };
    }

    if (Object.isUndefined(errorCallback)) {
        errorCallback = function(jqXHR, textStatus) {
            alert('Request failed: ' + textStatus);
        };
    }

    var url = 'index.php';
    var data = {
        cmd: 'Ajax_Designer',
        action: 'getSubtableViews',
        process: processName,
        version: version,
        dialog: dialog
    };
    jQuery.getJSON(url, data).done(successCallback).fail(errorCallback);
};

$JRDESIGNER.getSubtableViewElements = function(processName, version, subtableView, successCallback, errorCallback) {
    if (Object.isUndefined(successCallback)) {
        successCallback = function(data) {
            alert('Request done: ' + data);
        };
    }

    if (Object.isUndefined(errorCallback)) {
        errorCallback = function(jqXHR, textStatus) {
            alert('Request failed: ' + textStatus);
        };
    }

    var url = 'index.php';
    var data = {
        cmd: 'Ajax_Designer',
        action: 'getSubtableViewElements',
        process: processName,
        version: version,
        subtableView: subtableView
    };
    jQuery.getJSON(url, data).done(successCallback).fail(errorCallback);
};

$JRDESIGNER.exportProcessMessages = function() {
    ajaxRequestDirectDownload('index.php?cmd=ajax_exportProcessMessages', {
        action: 'export'
    });
};

$JRDESIGNER.showImportProcessMessagesPopup = function() {

    var options = getDefaultPopupOptions();
    var saveButton = {
        text: jr_get_constant_value('CONST_IMPORT_IT'),
        click: function() {
            $JRDESIGNER.importProcessMessages(jQuery(this));
        }
    };

    var loadingLayer = new LoadingLayer('', true, true);
    loadingLayer.show();

    var url = 'index.php?cmd=popup_importProcessMessages';

    jQuery.get(url, function() {
    }).always(function() {
        loadingLayer.hide();
    }).done(function(responseObject) {
        options.buttons.unshift(saveButton);
        var dialog = $JR.widget.dialog('indexDialog', options);
        dialog.setTitle(jr_get_constant_value('CONST_IMPORT'));
        dialog.setContent(responseObject);
        dialog.open();
    });
};

var urlAfterSubmitviaHiddenIframe;

$JRDESIGNER.importProcessMessages = function(dialog) {
    var restUrl = 'index.php?cmd=Ajax_ImportProcessMessages';
    var form = document.getElementById('processMessagesForm');
    urlAfterSubmitviaHiddenIframe = 'designer.php?cmd=ProcessMessages';
    submitFormViaHiddenIframe(form, restUrl, dialog);
};

function showCreateProcessMessagePopup(returnField) {
    var url = "index.php?cmd=popup_editProcessMessage";
    var params = [];
    var options = {
        title: jr_get_constant_value('CONST_ADD_PROCESS_MESSAGE'),
        height: 300,
        minHeight: 300,
        width: 500,
        minWidth: 500,
        buttons: [
            {
                id: 'addprocessmessage_apply',
                text: jr_get_constant_value("CONST_SAVE"),
                class: 'jr-btn-success',
                click: function() {
                    saveProcessMessage(returnField);
                }
            }, {
                text: jr_get_constant_value('CONST_CANCEL'),
                click: function() {
                    jQuery(this).dialog('close');
                }
            }
        ],
        open: function() {
            jQuery('#addprocessmessage_apply').hide();
        }
    };

    loadingLayer.show();

    jQuery.get(url, { params: params }, function() {
    }).always(function() {
        loadingLayer.hide();
    }).done(function(responseHtml) {
        var dialog = $JR.widget.dialog('addProcessMessage', options);
        dialog.setContent(responseHtml);
        dialog.open();
        dialog.setOptions(options);
    });
}

function saveProcessMessage(fieldId) {
    if (!jQuery('#editProcessMessageForm').valid()) {
        return;
    }
    var params = jQuery('#editProcessMessageForm').serializeArray();
    var messageName = jQuery('#id_processmessage_name').val();

    if (typeof dialogIdentifier === 'object') {
        params.push({
            name: 'process',
            value: dialogIdentifier.process
        });
        params.push({
            name: 'version',
            value: dialogIdentifier.version
        });
    } else if (typeof processIdentifier === 'object') {
        params.push({
            name: 'process',
            value: processIdentifier.process
        });
        params.push({
            name: 'version',
            value: processIdentifier.version
        });
    }

    var url = 'index.php?cmd=Ajax_ProcessMessages&action=saveProcessMessage';

    loadingLayer.show();

    jQuery.post(url, params, function() {}, 'json').always(function() {
        loadingLayer.hide();
    }).done(function(responseObject) {
        if (responseObject.status === 'success') {
            jQuery('#' + fieldId).val('[jrm_' + messageName + ']');
            jQuery('#addProcessMessage,#showprocessfields').dialog('close');
        } else {
            var $name = jQuery("#id_processmessage_name");
            $name.rules("add", { "jr-value-already-exists": [messageName] });
            $name.valid();
        }
    }).fail(function() {
        alert(jr_get_constant_value('CONST_AJAX_REQUEST_ERROR'));
    });
}