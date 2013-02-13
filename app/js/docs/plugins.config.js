	
/**
 * Adds a configuration window for fonts, colors, and sizes
 *
 * @author John Dyer (http://j.hn/)
 */


docs.plugins.push({

	init: function(docManager) {
		
		// create config menu
		var
			renderOptionDefault = function(id, name) {
				return '<label for="' + id + '">' + name + '</label>';
			},			
		
			// FONT face
			fontFamilyOptions = [
				{name: 'Default'},
				{name: 'Georgia'},
				{name: 'Tahoma'},
				{name: 'Baskerville'}
			],
			renderFontFamilyOption = function(id, name) {
				return '<label for="' + id + '"><span class="' + id + '">Aa</span></label>';
			},
			
			// FONT SIZE
			fontSizeOptions = [
				{name: 'Small'},
				{name: 'Default'},
				{name: 'Large'},
				{name: 'Jumbo'},
				{name: 'Huge'}
			],
			renderFontSizeOption = function(id, name) {
				return '<label for="' + id + '"><span class="' + id + '">Aa</span></label>';
			},
			
			// THEME colors
			themeOptions = [
				{name: 'Default'},
				{name: 'Brown'},
				{name: 'White'}
			],
			renderThemeOption = function(id, name) {
				return 	'<label for="' + id + '" class="' + id + '">' +
							'<span class="config-theme-' + name.toLowerCase() + '-demo1 theme-demo"></span><span class="config-theme-' + name.toLowerCase() + '-demo2 theme-demo"></span>' +
						'</label>';
			},			
			
			/* configWindow = $('<div id="config-menu" class="modal-window">' +
							'<div class="modal-header">Configuration<span class="modal-close">Close</span></div>'+
							'<div class="modal-content">' +
							'</div>' +
						'</div>')
			
			.appendTo(document.body)
			.hide();
			*/
			configWindow = docs.createModal('config', docs.Localizer.get('plugin_config_title') + ' (v' + docs.version + ')').size(400, 300);
			
			
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
		
			configWindow.show();
			
			configWindow.size(400, configBlock.position().top + configBlock.outerHeight(true) + 20);
			configWindow.hide();
			//configWindow.content.height
		}
		
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
						'<label for="config-' + prefix + '">' + title +'</label>' + 
					'</div>')
						.appendTo( configWindow.content )
						.on('click', 'input', function() {
							
							var checked = $(this).is(':checked');
								
							setStyle(checked);
							
							// save setting
							$.jStorage.set('docs-config-' + prefix + '', checked);
						});
			
			setStyle(checked);
			
			
			configWindow.show();
			
			configWindow.size(400, configBlock.position().top + configBlock.outerHeight(true) + 20);
			configWindow.hide();
			//configWindow.content.height
		}		
		
		docManager.createOptionSet(docs.Localizer.get('plugin_config_option_theme'), 'theme', themeOptions, renderThemeOption);
		docManager.createOptionSet(docs.Localizer.get('plugin_config_option_font'), 'font', fontFamilyOptions, renderFontFamilyOption);
		docManager.createOptionSet(docs.Localizer.get('plugin_config_option_size'), 'size', fontSizeOptions, renderFontSizeOption);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_chapters'), 'chapters', true);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_verses'), 'verses', true);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_wordsofchrist'), 'wordsofchrist', true);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_notes'), 'notes', true);
		
		//docManager.createOptionSet('Verses', 'verses', [{name: 'Default'},{name: 'Hide Verses'}]);
		
		//docManager.createOptionSet('Words of Christ', 'wordsofchrist', [{name: 'Default'},{name: 'Black'}]);
		//docManager.createOptionSet('Notes', 'notes', [{name: 'Default'},{name: 'Hide Notes'}]);

		
		var configButton = $('<input type="button" id="docs-config" />')
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
	}
});