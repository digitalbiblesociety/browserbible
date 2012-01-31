	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		// create popup
		var selectedWord = null,
			lemmaSelectedClass = 'lemma-selected',
			popup = docs.createModal('lemma', 'Lemma Data'),
			timer = null,
			startTimer = function() {				
				stopTimer();
				console.log('starting timer');
				timer = setTimeout(function() {
					$('.' + lemmaSelectedClass).removeClass(lemmaSelectedClass);
					popup.hide();
				}, 1000);
			},
			stopTimer = function() {
				if (timer != null) {
					clearTimeout(timer);
					timer = null;
				}
			};								
		
		popup.window
			.on('mouseleave', function() {
				startTimer();
			})
			.on('mouseover', function() {
				stopTimer();	
			})
			.on('click', '.strong-search', function() {
				
				//console.log('lemma clikc');
				var strongSearch = $(this),
					strongKey = strongSearch.attr('data-strong');
					
				docs.Search.searchVersion.val( selectedWord.closest('.document-container').find('.document-header select').val() );
				docs.Search.searchInput.val( strongKey );
				docs.Search.searchWindow.show();
				docs.Search.doSearch();
			})			
			.find('.popup-close')
				.on('click', function() {
					stopTimer();
					$('.' + lemmaSelectedClass).removeClass(lemmaSelectedClass);					
				})
			.end();
								
		// finds data on a <span class="word"> and gets its morph and lemma data
		function getWordData(word) {
				
				var lemma = word.attr('data-lemma'),
					lemmaParts = lemma != null ? lemma.split(' ') : [],
					morph = word.attr('data-morph'),
					morphParts = morph != null ? morph.split(' ') : [],
					wordData = [],
					strongLetter = '',
					strongInfo = '',
					strongKey = '',
					strongNumber = 0, 
					strongData = {};
					
				if (lemmaParts.length > 0) {
				
					for (var i=0, il=lemmaParts.length; i<il; i++) {
						strongInfo = lemmaParts[i].replace('strong:','');
						strongLetter = strongInfo.substring(0,1);
						strongNumber = parseInt(strongInfo.substring(1), 10);
						strongKey = strongLetter + strongNumber.toString();
						morph = (i< morphParts.length) ? morphParts[i].replace('robinson:','') : '';
							
						if (strongLetter == 'H')
							strongData = strongsHebrewDictionary[strongKey];
						else if (strongLetter == 'G')
							strongData = strongsGreekDictionary[strongKey];
						
						if (typeof strongData != 'undefined') {
							wordData.push({
								strongLetter: strongLetter,
								strongData: strongData,
								strongKey: strongKey,
								morph: morph,
								formattedMorph: (strongLetter == 'G' && morph != '') ? bible.morphology.Greek.getMorphology( morph ): ''
							});
						}
					}
				}
				
				return wordData;
					
			};
		
	
		// define mouseover and click events for words
		docManager.content.on('mouseover', 'span.w', function() {
			
			// push into footer
			var word = $(this),
				wordData = getWordData(word),
				formattedWords = [];
			
			if (wordData.length > 0) {
				
				for (var i=0, il=wordData.length; i<il; i++) {
					formattedWords.push(
						'<span class="lex-entry">' +
							'<span class="lemma ' + (wordData[i].strongLetter == 'H' ? 'hebrew' : 'greek') + '">' + wordData[i].strongData.lemma + '</span> (<span class="strongs-number">' + wordData[i].strongKey + '</span>) ' +
							(wordData[i].formattedMorph != '' ? '<span class="morphology">' + wordData[i].formattedMorph + '</span>' : '') +
							' - <span class="definition">' + wordData[i].strongData.strongs_def + '</span>' +
						'</span>'
					);
				}
				
				word
					.closest('.document-container')
					.find('.document-footer')
					.html(formattedWords.join('; '));
			}
			
		}).on('click', 'span.w', function() {
			
			$('.' + lemmaSelectedClass).removeClass(lemmaSelectedClass);
			
			// show popup
			var word = $(this).addClass(lemmaSelectedClass),
				wordData = getWordData(word),
				formattedWords = [];
				
				
			if (wordData.length > 0) {
				
				// store for lemma search
				selectedWord = word;
				
				// format for popup		
				for (var i=0, il=wordData.length; i<il; i++) {
					formattedWords.push(
						'<span class="lex-entry lemma-popup">' +
							'<span class="lemma ' + (wordData[i].strongLetter == 'H' ? 'hebrew' : 'greek') + '">' + wordData[i].strongData.lemma + '</span> (<span class="strongs-number">' + wordData[i].strongKey + '</span>) ' +
							(wordData[i].formattedMorph != '' ? '<span class="morphology">' + wordData[i].formattedMorph + '</span>' : '') +
							'<span class="definition">' + wordData[i].strongData.strongs_def + '</span>' +
							'<span class="strong-search" data-strong="' + wordData[i].strongKey + '">Search for all occurrences</span>' +
						'</span>'
					);
				}			
				
				// put the content inside
				popup.content.html( formattedWords.join('<br><br>') );
				
				// measure position
				var 
					wordPos = word.offset(),
					wordWidth = word.width(),
					wordHeight = word.height(),
					popupWidth = popup.window.outerWidth(true),
					popupHeight = popup.window.outerHeight(true),
					windowWidth = $(window).width(),
					windowHeight = $(window).height(),
					// default to below and to the right
					top = (wordPos.top + wordHeight + popupHeight > windowHeight) ? wordPos.top - popupHeight - 5 : wordPos.top + wordHeight + 4,
					left = (wordPos.left + popupWidth > windowWidth) ? windowWidth - popupWidth : wordPos.left;
				
		
				// place me!	
				popup.window.css({top: top, left: left});
				popup.show();
				
				stopTimer();
				
				$(document).one('mousemove', function() {
					console.log('moved away from word');
					startTimer();
				});
			}
				
	
		});
		
	}
});