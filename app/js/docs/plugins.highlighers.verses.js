/**
 * Highlights verses on mouseover and attempts to find similar verses in other panes
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function() { 
	
		var verseClass = 'verse-highlight';
		$('#content').delegate('span.verse', 'mouseover', function() {
			
			var verse = $(this),
				verseId = verse.attr('data-verse');
				
			$('.' + verseClass).removeClass( verseClass );
			
			$('span.verse[data-verse="' + verseId + '"]').addClass(verseClass);
			
		}).delegate('span.verse', 'mouseout', function() {
			
			$(this).removeClass(verseClass);
			
		});
	}
});
