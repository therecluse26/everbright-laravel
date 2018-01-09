

var refreshDocuWareIndexFieldLists  = function (fileCabinet) {
		
	var params = {cmd: 'Ajax', module: 'docuware', modcmd: 'DocuWareAjax', cmd_target: 'refreshDocuWareFileCabinetFields', selectedFileCabinet: fileCabinet, dwMode: 1};
																								
	new Ajax.Request('index.php?cmd=Ajax', {
		
		method: 'get',			
		parameters: params,
		onComplete: function() {
		},
		onLoading: function() {			
		},
		onSuccess: function(transport) {
					
			var indexFields = transport.responseText.evalJSON(true);			 

			for (var i=1; i<6; i++) {
										
				var item = $('id_s_index'+i);			
		
				item.options.length = 0;
				indexFields.each(function(field) {		
					if (field.value != '248' || (field.value == '248')) {
						var newOption = new Element('option', {'value': field.value}).update(field.name);
						item.insert(newOption);
					}
				});
			}
			
			for (var i=1; i<21; i++) {

				var item = $('id_i_index'+i);											
			
				item.options.length = 0; 	
				indexFields.each(function(field) {
					if (field.value != '248' || (field.value == '248')) {
						var newOption = new Element('option', {'value': field.value}).update(field.name);
						item.insert(newOption);
					}
				});
							
				
			}							
										
/*			$$('.' + udList).each(function(item) {
								
				var listName = item.id;
				var blnShowDWDocId = false;
								
				if(listName.indexOf('list_search') == 0 || listName.indexOf('list_indexOutput') == 0) {
					blnShowDWDocId = true;
				}

				$(item).update();
				indexFields.each(function(field) {
					if (field.value != '248' || (field.value == '248' && blnShowDWDocId)) {
						newOption = new Element('option', {'value': field.value}).update(field.name);
						item.insert(newOption);
					}
				});
			});	*/
					
		}
	});
}