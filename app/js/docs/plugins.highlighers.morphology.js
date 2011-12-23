	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(content) { 	
	
		content.delegate('span.word', 'mouseover', function() {
			
			var word = $(this),
				lex = word.attr('data-lex'),
				morph = word.attr('data-morph');
				
			// shown in footer
			if (lex != null && morph != null && lex.substring(0,4) == 'sn:G') {	
				word
					.closest('.document-container')
					.find('.document-footer')
					.html('Morph:' + bible.morphology.Greek.getMorphology( morph ) );
			}			
			
		});
		
	}
});