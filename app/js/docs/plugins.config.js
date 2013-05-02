	
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
				{name: 'Tiny'},
				{name: 'Small'},
				{name: 'Default'},				
				{name: 'Large'},
				{name: 'Huge'}
			],
			renderFontSizeOption = function(id, name) {
				return '<label for="' + id + '"><span class="' + id + '">Aa</span></label>';
			},
			
			// THEME colors
			themeOptions = [
				{name: 'Default'},
				{name: 'Brown'},
				{name: 'White'},
				{name: 'Clean'},				
			],
			renderThemeOption = function(id, name) {
				return 	'<label for="' + id + '" class="' + id + '">' +
							'<span class="config-theme-' + name.toLowerCase() + '-demo1 theme-demo"></span><span class="config-theme-' + name.toLowerCase() + '-demo2 theme-demo"></span>' +
						'</label>';
			},			
			

			configWindow = docs.createModal('config', docs.Localizer.get('plugin_config_title') + ' (v' + docs.version + ')').size(400, 300);
		docManager.createFontSlider = function(title, prefix) {
		
			var aFontsSizeArray = new Array('10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26');
			
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
						
					});
				
			configBlock.append($('<div style="width:200px;"><div id="font-slider"></div></div><span id="font-size"></span>'));
			
			var userConfig = parseInt($.jStorage.get('docs-config-' + prefix, 2), 10);
			$('.document-wrapper').css('font-size', (userConfig + 11) + 'px' );
			$('#font-slider').slider({
				value: userConfig,
				min: 0,
				max: 16,
				step: 1,
				slide: function(event, ui) {
					var sFontSizeArray = aFontsSizeArray[ui.value];
					$('#font-size').html(sFontSizeArray + ' px');
					$('.document-wrapper').css('font-size', sFontSizeArray + 'px' );
					$.jStorage.set('docs-config-' + prefix, $('#font-slider').slider("option", "value")+1);
				}
			});
			$('#font-size').html((aFontsSizeArray[$('#font-slider').slider('value')]) + ' px');

			//configBlock.find('#config-' + prefix + '-' + userConfig + '').trigger('click');			
		
		
			// resize?
		
			configWindow.show();
			
			configWindow.size(400, configBlock.position().top + configBlock.outerHeight(true) + 20);
			configWindow.hide();
			//configWindow.content.height
		}			
			
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
		//docManager.createFontSlider(docs.Localizer.get('plugin_config_option_size'), 'size');
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_chapters'), 'chapters', true);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_verses'), 'verses', true);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_wordsofchrist'), 'wordsofchrist', true);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_notes'), 'notes', true);
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_titles'), 'titles', true);
		
		// add to top row of buttons
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