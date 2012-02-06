/**
 * Highlights words based on Strong's number and attempts to find similar verses in other panes
 *
 * @author John Dyer (http://j.hn/)
 */

docs.plugins.push({

	init: function(docManager) {
		// add-on WORDS
		var wordClass = 'word-highlight';
		
		if (!docs.Features.hasTouch) {
		
			docManager.content.on('mouseover', 'span.w', function() {
				
				var word = $(this),
					verse = word.closest('.verse'),
					verseId = verse.attr('data-osis'),
					lemmaInfo = word.attr('data-lemma');
		
				$('.' + wordClass).removeClass( wordClass );
				
				$(lemmaInfo.split(' ')).each(function(i, lemma) {
					if (lemma != 'G3588') {
						//$('span.verse[data-osis="' + verseId + '"] span.word[data-lemma*="' + lemma + '"]').addClass(wordClass);
						//$('span.' + verseId.replace(/\./gi,'_') + ' span.word[data-lemma*="' + lemma + '"]').addClass(wordClass);
						$('.' + verseId.replace(/\./gi,'_')).find('.' + lemma + '').addClass(wordClass);
					}
				});
					
			}).on('mouseout', 'span.w', function() {
				$('.' + wordClass).removeClass( wordClass );
				
			});
		}
	}
});