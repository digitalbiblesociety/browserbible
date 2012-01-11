	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(content) { 	
	
		// SHOW specific note in the footer
		content.on('mouseover', 'dl.note, dl.cf', function() {
			
			var note = $(this),
				definition = note.find('dt');
						
			// shown in footer
			if (definition.length > 0) {	
				note
					.closest('.document-container')
					.find('.document-footer')
					.empty()
					.append(note.children().clone());
			}			
			
		}).on('mouseout', 'span.note, span.cf', function() {
			
			$(this)
				.closest('.document-container')
				.find('.document-footer')
				.empty();
		});
		
		// SHOW all notes from a verse in the footer
		var hadNote = false;
		content.on('mouseover', 'span.verse', function() {
			
			var verse = $(this),
				notes = verse.find('dl.note, dl.cf');
			
			// shown in footer
			if (notes.length > 0) {	
				verse
					.closest('.document-container')
					.find('.document-footer')
					.empty()
					.append(notes.children().clone());
					
				//hadNote = true;
			}			
			
		}).on('mouseout', 'span.verse', function() {
			
			$(this)
				.closest('.document-container')
				.find('.document-footer')
				.empty();
		});		
		
	}
});