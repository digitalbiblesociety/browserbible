	
/**
 * Fullscreen button
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
				{name: 'Tahoma'}
			],
			colorOptions = [
				{name: 'Default'},
				{name: 'Tan'},
				{name: 'Green'}
			],		
			configWindow = $('<div id="config-menu" class="modal-window">' +
							'<div class="modal-header">Configuration<span class="modal-close">Close</span></div>'+
							'<div class="modal-content">' +
							'</div>' +
						'</div>')
			.appendTo(document.body)
			.hide();
		
		// create font options
		var fontBlock =
				$('<div class="config-options" id="config-fonts"><h3>Fonts</h3></div>')
					.appendTo( configWindow.find('.modal-content') )
					.on('click', 'input', function() {
						console.log('clicked',this);
						var bod = $(document.body);
						
						// remove all fonts
						$(this).siblings('input').each(function(i, input) {
							bod.removeClass('config-font-' + $(input).val() );
						});
						
						// select this one
						bod.addClass( 'config-font-' + $(this).val() );
						
						$.jStorage.set('docs-config-font', $(this).val());
					});
		
		for (var i=0, il=fontOptions.length; i<il; i++) {
			var title = fontOptions[i].name;
			fontBlock.append($('<input type="radio" name="config-font-choice" id="config-font-' + title.toLowerCase() + '" value="' + title.toLowerCase() + '" /><label for="config-font-' + title.toLowerCase() + '">' + title + '</label>'))
		}
		var userFontConfig = $.jStorage.get('docs-config-font', 'default');
		
		fontBlock.find('#config-font-' + userFontConfig + '').trigger('click');
		
		//	'<div class="config-options" id="config-colors"><h3>Colors</h3></div>' +
							
		// create font options
		var colorBlock =
				$('<div class="config-options" id="config-colors"><h3>Theme Colors</h3></div>')
					.appendTo( configWindow.find('.modal-content') )
					.on('click', 'input', function() {
						console.log('clicked',this);
						var bod = $(document.body);
						
						// remove all fonts
						$(this).siblings('input').each(function(i, input) {
							bod.removeClass('config-theme-' + $(input).val() );
						});
						
						// select this one
						bod.addClass( 'config-theme-' + $(this).val() );
						
						$.jStorage.set('docs-config-theme', $(this).val());
					});
		
		for (var i=0, il=colorOptions.length; i<il; i++) {
			var title = colorOptions[i].name;
			colorBlock.append($('<input type="radio" name="config-theme-choice" id="config-theme-' + title.toLowerCase() + '" value="' + title.toLowerCase() + '" /><label for="config-theme-' + title.toLowerCase() + '">' + title + '</label>'))
		}
		var userColorConfig = $.jStorage.get('docs-config-theme', 'default');
		
		colorBlock.find('#config-theme-' + userColorConfig + '').trigger('click');		
		
		
		$('<input type="button" id="docs-config" />')
			.appendTo(docManager.header.find('#header-nav'))
			.on('click', function() {
			
				// show config menu
				if (configWindow.is(':visible')) {
					configWindow.hide();
				} else {
					configWindow.show();
				}
			});
		
		
	}
});