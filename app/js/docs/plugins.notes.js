	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(content) { 	
	
		content.delegate('span.note, span.cf', 'mouseover', function() {
			
			var note = $(this),
				definition = note.find('dfn');
				
			console.log(definition);
				
			// shown in footer
			if (definition.length > 0) {	
				note
					.closest('.document-container')
					.find('.document-footer')
					.empty()
					.append(note.clone());
			}			
			
		}).delegate('span.note, span.cf', 'mouseout', function() {
			
			$(this)
				.closest('.document-container')
				.find('.document-footer')
				.empty();
		});
		
	}
});