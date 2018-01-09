function editPhpFunctionsOnload() {
    $('id_phpFunctionsErrorMenu').style.display = 'none';

    documentationVisibility();
}

function editPhpFunctionsFinish(as_action) {
    $('id_sourceCode_cp').value = id_sourceCode.getCode();
    $('id_sourceCode_cp').disabled = false;
    // $('id_action').action = as_action;
    /* submitForm('editphpfunctions', as_action, '', '', '', '', '', ''); */
}

function documentationVisibility() {
    var $buttonActivate = jQuery('#jr-actionbar-button-show-documentation');
    var $buttonDeactivate = jQuery('#jr-actionbar-button-hide-documentation');
    var $documentationFieldSet = jQuery('#id_documentationMenu');

    if (jQuery('#id_documentationVisibility').val() == 's') {
        $buttonActivate.hide();
        $buttonDeactivate.show();
        $documentationFieldSet.show();
        return;
    }

    $buttonActivate.show();
    $buttonDeactivate.hide();
    $documentationFieldSet.hide();
}

function textareaResize(as_name, as_event, as_width, as_height) {
    if (as_event.type == 'focus') {
        $('id_' + as_name).style.width = '100%';
        $('id_' + as_name).style.height = '300px';
    } else {
        $('id_' + as_name).style.width = as_width;
        $('id_' + as_name).style.height = as_height;
    }
}

function showPHPError(as_id) {
    if ($('close_' + as_id).style.display == 'none') {
        $('open_' + as_id + '_title').setAttribute('class', 'close');
        $('close_' + as_id).style.display = '';
    } else {
        $('open_' + as_id + '_title').setAttribute('class', 'open');
        $('close_' + as_id).style.display = 'none';
    }
}

function hidePHPError(as_id) {
    $('open_' + as_id).style.display = 'none';
}

function phpFunctionsValidation(as_validation_text) {

    if ($('sourceCodeAce') != null) {
        $('id_syntaxIframe').src = "./phpFunctionChecker.php?token=" + $('token').value;
    } else {
        if (typeof(id_sourceCode) !== 'undefined') {
            $('id_sourceCode_cp').value = id_sourceCode.getCode();
            if ($('id_sourceCode_cp').value == "") {
                $('id_phpFunctionsErrorMenu').style.display = 'none';
            } else {
                $('id_syntaxIframe').src = "./phpFunctionChecker.php?token=" + $('token').value;
            }
        } else {
            if ($('id_sourceCode').value == "") {
                $('id_phpFunctionsErrorMenu').style.display = 'none';
            } else {
                $('id_syntaxIframe').src = "./phpFunctionChecker.php?token=" + $('token').value;
            }
        }
    }
}

var windowWidth = function(as_window, as_document) {
    if (as_window.innerWidth) {
        return as_window.innerWidth;
    } else if (as_document && as_document.offsetWidth) {
        return as_document.offsetWidth;
    } else {
        return 0;
    }
};

function togglePHPsubmenu() {
    if ($('div_phpFunctions_submenu').style.display == 'none') {
        $('div_phpFunctions_submenu').style.display = '';
        $('id_sourceCode_td').firstChild.style.width = '100%'; // 687px
    } else {
        $('div_phpFunctions_submenu').style.display = 'none';
        $('id_sourceCode_td').firstChild.style.width = (windowWidth($('contentBox_wf_php_sourcecode'),
                $('contentBox_wf_php_sourcecode')) - 66) + 'px';	// 887px
        //$('id_sourceCode_td').firstChild.style.width = '100%';
    }

    if (typeof editor != 'undefined') {
        editor.resize();
    }
}

function showPHPsubmenu(as_menu) {
    $('id_dialogFields').style.display = 'none';
    $('id_processConfigurations').style.display = 'none';
    $('id_processMessages').style.display = 'none';
    $('id_phpFunctions').style.display = 'none';
    $('id_phpTemplates').style.display = 'none';
    $('id_tableFields').style.display = 'none';
    $('id_subtableFields').style.display = 'none';
    $('id_subtables').style.display = 'none';

    $('id_' + as_menu).style.display = '';
}

function as_first_strike() {
    if ($('id_id').value == '') {
        $('div_sourceCode').style.display = 'none';
        $('div_sourceFirstStrike').style.display = '';
    } else {
        if (id_sourceCode.getCode() != '') {
            sourceExlode = id_sourceCode.getCode().split('class ');
            sourceExlodeEnd = sourceExlode[1].split(' extends');

            id_sourceCode.setCode(sourceExlode[0] + 'class ' + $('id_id').value + ' extends' + sourceExlodeEnd[1]);
        } else {
            id_sourceCode.setCode('<' + '?php\n' + '\n' + '/**\n' + ' *\n' + ' */\n' + 'class ' + $('id_id').value +
                ' extends PHPFunctionClass\n' + '{\n' + '   /**\n' + '    *\n' + '    */\n' +
                '   public function execute()\n' + '   {\n' + '\n' + '       // ' +
                $JR_JS_CONSTANTS.CONST_PHP_FUNCTION_CONTENT + '\n' + '\n' + '\n' + '   }\n' + '\n' + '   // ' +
                $JR_JS_CONSTANTS.CONST_PHP_FUNCTION_OTHER_METHODS + '\n' + '\n' + '}\n' + '\n' + '?>');
        }

        $('id_sourceCode_td').firstChild.style.width = '100%';
        $('id_sourceCode_td').firstChild.style.height = '460px';
        $('div_sourceCode').style.display = '';
        $('div_sourceFirstStrike').style.display = 'none';
    }
}