/**
 * Highlights verses on mouseover and attempts to find similar verses in other panes
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function( content ) { 
	
		var verseClass = 'verse-highlight';
		
		content.on('mouseover', 'span.verse', function() {
			
			var verse = $(this),
				verseId = verse.attr('data-osis');
				
			$('.' + verseClass).removeClass( verseClass );
			
			$('span.verse[data-osis="' + verseId + '"]').addClass(verseClass);
			
		}).on('mouseout', 'span.verse', function() {
			
			$(this).removeClass(verseClass);
			
		});
	}
});
