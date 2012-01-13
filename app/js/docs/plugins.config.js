	
/**
 * Fullscreen button
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		// create config menu
		var configWindow = $('<div id="config-menu" class="modal-window">' +
							'<div class="modal-header">Configuration<span class="modal-close">Close</span></div>'+
							'<div class="modal-content">' +
								'<div class="config-option">' +
									'<input type="radio" name="config-font" id="config-font-default" />' +
									'<label for="config-font-default">Default</label>' +
								'</div>' +
							'</div>'+
						'</div>')
			.appendTo(document.body)
			.hide();
		
		
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