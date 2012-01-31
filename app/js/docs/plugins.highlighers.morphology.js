	
/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		docManager.addEventListener('load', function(e) {
			
			e.chapter.find('span.w').each(function(i, node) {
				var w = $(this);
				
				if (w.hasClass())
				
			});
		}
	}
});