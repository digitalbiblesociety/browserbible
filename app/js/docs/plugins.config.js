	
/**
 * Adds a configuration window for fonts, colors, and sizes
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		// create config menu
		var
			fontOptions = [
				{name: 'Default'},
				{name: 'Georgia'},
				{name: 'Tahoma'},
				{name: 'Baskerville'}
			],
			colorOptions = [
				{name: 'Default'},
				{name: 'Tan'},
				{name: 'Green'}
			],
			sizeOptions = [
				{name: 'Small'},
				{name: 'Default'},
				{name: 'Large'},
				{name: 'Jumbo'}
			],				
			/* configWindow = $('<div id="config-menu" class="modal-window">' +
							'<div class="modal-header">Configuration<span class="modal-close">Close</span></div>'+
							'<div class="modal-content">' +
							'</div>' +
						'</div>')
			
			.appendTo(document.body)
			.hide();
			*/
			configWindow = docs.createModal('config', 'Configuration').size(400, 300);
			
			
		function createOptionSet(title, prefix, data) {
			var configBlock =
				$('<div class="config-options" id="config-' + prefix + '"><h3>' + title + '</h3></div>')
					.appendTo( configWindow.content )
					.on('click', 'input', function() {
						var bod = $(document.body);
						
						// remove all fonts
						$(this).siblings('input').each(function(i, input) {
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
				configBlock.append($('<input type="radio" name="config-' + prefix + '-choice" id="config-' + prefix + '-' + value + '" value="' + value + '" /><label for="config-' + prefix + '-' + value + '">' + name + '</label>'))
			}
			var userConfig = $.jStorage.get('docs-config-' + prefix, 'default');
			
			configBlock.find('#config-' + prefix + '-' + userConfig + '').trigger('click');			
		
		}
		
		createOptionSet('Theme', 'theme', colorOptions);
		createOptionSet('Fonts', 'font', fontOptions);
		createOptionSet('Size', 'size', sizeOptions);
		createOptionSet('Verses', 'verses', [{name: 'Default'},{name: 'Hide Verses'}]);
		createOptionSet('Notes', 'notes', [{name: 'Default'},{name: 'Hide Notes'}]);

		
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