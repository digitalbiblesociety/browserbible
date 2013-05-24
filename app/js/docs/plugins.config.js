	
/**
 * Adds a configuration window for fonts, colors, and sizes
 *
 * @author John Dyer (http://j.hn/)
 */


docs.plugins.push({

	init: function(docManager) {
		
		// create config menu and button
		var 
			configWidth = 450, 
			
			configWindow = docs.createModal('config', docs.Localizer.get('plugin_config_title')).size(configWidth, 300),
			
			configButton = $('<input type="button" id="docs-config" />')
				.appendTo(docManager.header.find('#header-nav'))
				.on('click', function() {
				
					// show config menu
					if (configWindow.window.is(':visible')) {
						configWindow.hide();
					} else {
						configWindow.show();
						
						configWindow.window.css({
							top: configButton.offset().top + configButton.height() + 5,
							left: configButton.offset().left + configButton.width() - configWindow.window.outerWidth()
						});					
						
					}
				});
				
				
		// TEST!
		//configButton.hide();
		
		/*		
		$('#top-logo').css('cursor','pointer').on('click', function(e) {
			e.preventDefault();
			
			
			// show config menu
			if (configWindow.window.is(':visible')) {
				configWindow.hide();
			} else {
				configWindow.show();
				configWindow.center();
			}	
			
			return false;		
	
		});
		*/
				
		docManager.configWindow = configWindow;			
		
		/// 
		/// Methods for adding items to the config menu
		///
		
		var
			renderOptionDefault = function(id, name) {
				return '<label for="' + id + '" title="' + name + '">' + name + '</label>';
			};		
			
		docManager.createOptionSet = function(title, prefix, data, renderOption) {
			
			if (typeof renderOption == 'undefined') {
				renderOption = renderOptionDefault;
			}
			
			var configBlock =
				$('<div class="config-options" id="config-' + prefix + '"><h3>' + title + '</h3></div>')
					.appendTo( configWindow.content )
					.on('click', 'input', function() {

						var bod = $(document.body);
							
						// remove all 
						$(this).closest('.config-options').find('input').each(function(i, input) {
							//console.log('removing ', $(input).val());
							bod.removeClass('config-' + prefix + '-' + $(input).val() );
						});
						
						// select this one
						bod.addClass( 'config-' + prefix + '-' + $(this).val() );
						
						// save setting
						$.jStorage.set('docs-config-' + prefix + '', $(this).val());
					});
		
			for (var i=0, il=data.length; i<il; i++) {
				var name = data[i].name,
					value = name.toLowerCase().replace(' ','');
				
				configBlock.append($('<div class="config-option">' +
										'<input type="radio" name="config-' + prefix + '-choice" id="config-' + prefix + '-' + value + '" value="' + value + '" />' +
										renderOption('config-' + prefix + '-' + value, name) + 
									'</div>'
									));
			}
			var userConfig = $.jStorage.get('docs-config-' + prefix, 'default');
			
			configBlock.find('#config-' + prefix + '-' + userConfig + '').trigger('click');			
		
		
			// resize?
			docManager.resizeConfigWindow();
		}
	
		
		docManager.resizeConfigWindow = function() {
			
			configWindow.show();
			configWindow.content.css('height','auto');
			configWindow.size(configWidth, configWindow.content.outerHeight(true) + configWindow.title.outerWidth(true) );
			configWindow.hide();		
			
		}		
	
	}
});