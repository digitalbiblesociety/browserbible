	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(content) { 	
	
		content.on('mouseover', 'span.note, span.cf', function() {
			
			var note = $(this),
				definition = note.find('dfn');
						
			// shown in footer
			if (definition.length > 0) {	
				note
					.closest('.document-container')
					.find('.document-footer')
					.empty()
					.append(note.clone());
			}			
			
		}).on('mouseout', 'span.note, span.cf', function() {
			
			$(this)
				.closest('.document-container')
				.find('.document-footer')
				.empty();
		});
		
		
		content.on('mouseover', 'span.verse', function() {
			
			var verse = $(this),
				notes = verse.find('span.note, span.cf');
			
			// shown in footer
			if (notes.length > 0) {	
				verse
					.closest('.document-container')
					.find('.document-footer')
					.empty()
					.append(notes.clone());
			}			
			
		}).delegate('mouseout', 'span.verse', function() {
			
			$(this)
				.closest('.document-container')
				.find('.document-footer')
				.empty();
		});		
		
	}
});