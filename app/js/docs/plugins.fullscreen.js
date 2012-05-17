	
/**
 * Fullscreen button
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		var body = document.body,
			isFullscreen = false;
	
		if (typeof body.requestFullScreen != 'undefined' ||
			typeof body.webkitRequestFullScreen != 'undefined' ||
			typeof body.mozRequestFullScreen != 'undefined') {
	
			$('<input type="button" id="docs-fullscreen" />')
				.appendTo(docManager.header.find('#header-nav'))
				.on('click', function() {
				
					if (typeof body.requestFullscreen != 'undefined') {
						if (isFullscreen) {
							document.exitFullscreen();
						} else {
							body.requestFullscreen();
						}
						isFullscreen = !isFullscreen;
						
					} else if (typeof body.webkitRequestFullScreen != 'undefined') {
						
						if (isFullscreen) {
							document.webkitCancelFullScreen();
						} else {
							body.webkitRequestFullScreen();
						}
						isFullscreen = !isFullscreen;						
						
					} else if (typeof body.mozRequestFullScreen != 'undefined') {
						
						if (isFullscreen) {
							document.mozCancelFullScreen();
						} else {
							body.mozRequestFullScreen();
						}
						isFullscreen = !isFullscreen;						
					}
					
					if (isFullscreen)
						$(this).addClass('is-fullscreen');
					else
						$(this).removeClass('is-fullscreen');
				});
		}
		
	}
});