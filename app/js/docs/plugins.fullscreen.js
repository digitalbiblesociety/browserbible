	
/**
 * Fullscreen button
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		var body = document.body;
	
		if (typeof body.requestFullScreen != 'undefined' ||
			typeof body.webkitRequestFullScreen != 'undefined' ||
			typeof body.mozRequestFullScreen != 'undefined') {
	
			$('<input type="button" id="docs-fullscreen" />')
				.appendTo(docManager.header.find('#header-nav'))
				.on('click', function() {
				
					if (typeof body.requestFullScreen != 'undefined') {
						body.requestFullScreen();
					} else if (typeof body.webkitRequestFullScreen != 'undefined') {
						body.webkitRequestFullScreen();
					} else if (typeof body.mozRequestFullScreen != 'undefined') {
						body.mozRequestFullScreen();
					}
				});
		}
		
	}
});