	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(content) { 	
	
		content.delegate('span.word', 'mouseover', function() {
			
			var word = $(this),
				lemma = word.attr('data-lemma'),
				morph = word.attr('data-morph');
				
			morph = morph.split(' ')[0].replace('robinson:','');
				
			// shown in footer
			//if (lex != null && morph != null && lex.substring(0,8) == 'strong:G') {	
			if (morph != null) {
				word
					.closest('.document-container')
					.find('.document-footer')
					.html(lemma + ' - ' + bible.morphology.Greek.getMorphology( morph ) ); //+ ' (' + morph + ')');
			}			
			
		});
		
	}
});