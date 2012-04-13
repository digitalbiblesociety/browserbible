	
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
		
			fontFamilyOptions = [
				{name: 'Default'},
				{name: 'Georgia'},
				{name: 'Tahoma'},
				{name: 'Baskerville'}
			],
			renderFontFamilyOption = function(id, name) {
				return '<label for="' + id + '"><span class="' + id + '">Aa</span></label>';
			},
			themeOptions = [
				{name: 'Default'},
				{name: 'Tan'},
				{name: 'Green'}
			],
			renderThemeOption = function(id, name) {
				return 	'<label for="' + id + '" class="' + id + '">' +
							'<span class="site-header theme-demo"></span><span class="document-header theme-demo"></span>' +
						'</label>';
			},
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
			/* configWindow = $('<div id="config-menu" class="modal-window">' +
							'<div class="modal-header">Configuration<span class="modal-close">Close</span></div>'+
							'<div class="modal-content">' +
							'</div>' +
						'</div>')
			
			.appendTo(document.body)
			.hide();
			*/
			configWindow = docs.createModal('config', 'Configuration').size(400, 300);
			
			
		function createOptionSet(title, prefix, data, renderOption) {
			var configBlock =
				$('<div class="config-options" id="config-' + prefix + '"><h3>' + title + '</h3></div>')
					.appendTo( configWindow.content )
					.on('click', 'input', function() {
						var bod = $(document.body);
						
						console.log( $(this) );
						
						// remove all fonts
						$(this).closest('.config-options').find('input').each(function(i, input) {
							console.log('removing ', $(input).val());
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
		
		}
		
		createOptionSet('Theme', 'theme', themeOptions, renderThemeOption);
		createOptionSet('Fonts', 'font', fontFamilyOptions, renderFontFamilyOption);
		createOptionSet('Size', 'size', fontSizeOptions, renderFontSizeOption);
		createOptionSet('Verses', 'verses', [{name: 'Default'},{name: 'Hide Verses'}], renderOptionDefault);
		createOptionSet('Notes', 'notes', [{name: 'Default'},{name: 'Hide Notes'}], renderOptionDefault);

		
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