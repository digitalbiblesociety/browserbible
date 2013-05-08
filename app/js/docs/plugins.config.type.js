/**
 * Adds font size and face options
 *
 * @author John Dyer (http://j.hn/)
 */

docs.plugins.push({

	init: function(docManager) {

		var
			// FONT face
			fontFamilyOptions = [
				{name: 'Default'},
				{name: 'Georgia'},
				{name: 'Geneva'},
				{name: 'Baskerville'}
			],
			renderFontFamilyOption = function(id, name) {
				return '<label for="' + id + '" title="' + name + '"><span class="' + id + '">Aa</span></label>';
			};
			
			// FONT SIZE
			/*fontSizeOptions = [
				{name: 'Tiny'},
				{name: 'Small'},
				{name: 'Default'},
				{name: 'Large'},
				{name: 'Huge'}
			],
			renderFontSizeOption = function(id, name) {
				return '<label for="' + id + '"><span class="' + id + '">Aa</span></label>';
			},*/
			
		var configWindow = docManager.configWindow;						
			
		
		docManager.createFontSlider = function(title, prefix) {
		
			var fontsSizes = new Array('10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26');
			
			var configBlock =
				$('<div class="config-options" id="config-' + prefix + '">' + 
						'<h3 id="config-size-title">' + title + ': <span id="font-size"></span></h3>' + 
					'</div>')
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
				
			configBlock.append($('<div id="font-slider"></div>'));
			
			var defaultFontSizeIndex = 8;
			var fontSizeIndex = parseInt($.jStorage.get('docs-config-' + prefix, defaultFontSizeIndex ), 10);
			
			if (isNaN(fontSizeIndex)) {
				fontSizeIndex = defaultFontSizeIndex;
			}
			
			//$('.document-wrapper').css('font-size', fontsSizes[fontSizeIndex] + 'px' );
			$('#content').css('font-size', fontsSizes[fontSizeIndex] + 'px' );
			$('#font-slider').slider({
				value: fontSizeIndex,
				min: 0,
				max: 16,
				step: 1,
				slide: function(event, ui) {
					var sFontSizeArray = fontsSizes[ui.value];
					$('#font-size').html(sFontSizeArray + ' px');
					$('#content').css('font-size', sFontSizeArray + 'px' );
					$.jStorage.set('docs-config-' + prefix, $('#font-slider').slider("option", "value")+1);
				}
			});
			$('#font-size').html((fontsSizes[$('#font-slider').slider('value')]) + ' px');

			// resize
			configWindow.show();		
			configWindow.size(400, configBlock.position().top + configBlock.outerHeight(true) + 20);
			configWindow.hide();
		}			
			
		docManager.createOptionSet(docs.Localizer.get('plugin_config_option_font'), 'fontfamily', fontFamilyOptions, renderFontFamilyOption);
		docManager.createFontSlider(docs.Localizer.get('plugin_config_option_size'), 'fontpxsize');
			
	}
	
});