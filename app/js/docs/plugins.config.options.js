/**
 * Create a set of toggles for the config window
 *
 * @author John Dyer (http://j.hn/)
 */

docs.plugins.push({

	init: function(docManager) {


		// create options areas
		var optionsArea = $('<div class="config-options"><h3>Elements</h3></div>')
							.appendTo(docManager.configWindow.content);


		docManager.createOptionToggle = function(title, prefix, checked) {
				
			checked = $.jStorage.get('docs-config-' + prefix, checked);
			
			
			var bod = $(document.body),
				setStyle = function(on) {
					if (on) {
						bod.removeClass( 'config-' + prefix + '-off');
					} else {
						bod.addClass( 'config-' + prefix + '-off');
					}					
				},
				configBlock =
					$('<div class="config-toggle">' +
						'<input type="checkbox" ' + (checked ? ' checked' : '') + ' id="config-' + prefix + '" />' +
						'<label for="config-' + prefix + '" title="' + title + '">' + title +'</label>' + 
					'</div>')
						.appendTo( optionsArea )
						.on('click', 'input', function() {
							
							var checked = $(this).is(':checked');
								
							setStyle(checked);
							
							// save setting
							$.jStorage.set('docs-config-' + prefix + '', checked);
						});
			
			setStyle(checked);	
			
			docManager.resizeConfigWindow();
		}



		
		docManager.addStyle('\
.config-chapters-off .chapter-num {\
display: none;\
}');
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_chapters'), 'chapters', true);


		docManager.addStyle('\
.config-verses-off .verse-num {\
	display:none;\
}');
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_verses'), 'verses', true);



		docManager.addStyle('\
.config-notes-off .chapter .note,\
.config-notes-off .chapter .cf {\
	display:none;\
}');
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_notes'), 'notes', true);
		
		
		// <h3> title </h3>
		docManager.addStyle('\
.config-titles-off .chapter h3 {\
	display:none;\
}');		
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_titles'), 'titles', true);
		
		// <span class="woc">Word of Jesus</h3>	
		docManager.addStyle('\
.config-wordsofchrist-off .woc {\
	color:inherit;\
}');		
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_wordsofchrist'), 'wordsofchrist', true);		
			
	}
	
});