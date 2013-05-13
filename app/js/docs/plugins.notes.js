	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		var notesPopup = docs.createModal('notes', 'Notes &amp; Cross References'),
			timer = null,
			selectedNote = null,
			startTimer = function() {				
				stopTimer();
				console.log('starting notes timer');
				timer = setTimeout(function() {
					notesPopup.hide();
					selectedNote = null;
				}, 1000);
			},
			stopTimer = function() {
				if (timer != null) {
					clearTimeout(timer);
					timer = null;
				}
			};
			
		notesPopup.content.css({'max-height': '200px', 'overflow': 'auto'});
		
		notesPopup.window
			.on('mouseleave', function() {
				startTimer();
			})
			.on('mouseover', function() {
				stopTimer();	
			})		
		
		
	
		// SHOW specific note in the footer
		docManager.content.on('mouseover', 'span.note, span.cf', function() {
			
			var note = $(this);
						
			note
				.closest('.document-container')
				.find('.document-footer')
				.empty()
				.append(note.clone());
			
						
		}).on('mouseout', 'span.note, span.cf', function() {
			
			$(this)
				.closest('.document-container')
				.find('.document-footer')
				.empty();
		}).on('click', 'span.note, span.cf', function(e) {
		
			var note = $(this);
			
			if (selectedNote!= null && selectedNote.html() == note.html() && notesPopup.window.is(':visible')) {
				notesPopup.hide();
				return;
			}
			
			selectedNote = note;
		
			if (note.hasClass('cf')) {
				notesPopup.title.html(docs.Localizer.get('plugin_notesandcf_cf'));
			} else if (note.hasClass('note')) {
				notesPopup.title.html(docs.Localizer.get('plugin_notesandcf_note'));
			}
		
			notesPopup.content.empty().append(note.clone());

			
			// measure position
			var 
				notePos = note.offset(),
				noteWidth = note.width(),
				noteHeight = note.height(),
				popupWidth = notesPopup.window.outerWidth(true),
				popupHeight = notesPopup.window.outerHeight(true),
				windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				// default to below and to the right
				top = (notePos.top + noteHeight + noteHeight > windowHeight) ? notePos.top - popupHeight - 5 : notePos.top + noteHeight + 4,
				left = (notePos.left + popupWidth > windowWidth) ? windowWidth - popupWidth : notePos.left;			
			
			notesPopup.show();
			notesPopup.window.css({top: top, left: left});
			
			bibly.scanForReferences(notesPopup.content.find('.text')[0]);
			
			stopTimer();
			
			$(document).one('mousemove', function() {
				startTimer();
			});			
			
		});
		
		// SHOW all notes from a verse in the footer
		var hadNote = false;
		docManager.content.on('mouseover', 'span.verse', function() {
			
			var verse = $(this),
				notes = verse.find('span.note, span.cf');
			
			// shown in footer
			if (notes.length > 0) {	
				verse
					.closest('.document-container')
					.find('.document-footer')
					.empty()
					.append(notes.clone());
					
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