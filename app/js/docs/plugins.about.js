	
/**
 * Adds a abouturation window for fonts, colors, and sizes
 *
 * @author John Dyer (http://j.hn/)
 */


docs.plugins.push({

	init: function(docManager) {
		
		// create about menu and button
		var 			
			aboutWindow = docs.createModal('about', 'About').size(450, 300),
			isLoaded = false;
			

		
		$('#top-logo').css('cursor','pointer').on('click', function(e) {
			e.preventDefault();		
			
			// show about menu
			if (aboutWindow.window.is(':visible')) {
				aboutWindow.hide();
			} else {
				if (!isLoaded) {
					
					isLoaded = true;
					$.ajax({
						url: 'content/about.html',
						dataType: 'html',
						success: function(d) {
							aboutWindow.content.append( $(d) );
						}
					});					
				}
			
				aboutWindow.show();
				aboutWindow.center();
			}	
			
			return false;		
	
		});
	}
});