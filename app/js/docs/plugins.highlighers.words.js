/**
 * Highlights words based on Strong's number and attempts to find similar verses in other panes
 *
 * @author John Dyer (http://j.hn/)
 */

docs.plugins.push({

	init: function(content) {
		// add-on WORDS
		var wordClass = 'word-highlight';
		
		content.delegate('span.word', 'mouseover', function() {
			
			var word = $(this),
				verse = word.closest('.verse'),
				verseId = verse.attr('data-verse'),
				lexId = word.attr('data-lex');
	
				
			$('.' + wordClass).removeClass( wordClass );
			
			$('span.verse[data-verse="' + verseId + '"] span.word[data-lex="' + lexId + '"]').addClass(wordClass);
			
		}).delegate('span.word', 'mouseout', function() {
			//$('.' + wordClass).removeClass( wordClass );
			
			$(this).removeClass(wordClass);
		});
	}
});