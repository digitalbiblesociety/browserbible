/**
 * Highlights words based on Strong's number and attempts to find similar verses in other panes
 *
 * @author John Dyer (http://j.hn/)
 */

docs.plugins.push({

	init: function(content) {
		// add-on WORDS
		var wordClass = 'word-highlight';
		
		content.on('mouseover', 'span.word', function() {
			
			var word = $(this),
				verse = word.closest('.verse'),
				verseId = verse.attr('data-osis'),
				lemmaInfo = word.attr('data-lemma');
	
			$('.' + wordClass).removeClass( wordClass );
			
			$('span.verse[data-osis="' + verseId + '"] span.word[data-lemma="' + lemmaInfo + '"]').addClass(wordClass);
			
			verse
				.closest('.document-container')
				.find('.document-footer')
				.empty()
				.append( lemmaInfo );
			
		}).on('mouseout', 'span.word', function() {
			$('.' + wordClass).removeClass( wordClass );
			
			//$(this).removeClass(wordClass);
		});
	}
});