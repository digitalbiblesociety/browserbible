	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		// create popup
		var selectedWord = null,
			morphPopup = $('<div class="popup-window">' +
								'<div class="popup-header">Word Details<span class="popup-close">Close</span></div>' +
								'<div class="popup-content"></div>' +
							'</div>')
								.appendTo(document.body)
								.hide(),
								
			morphHeader = morphPopup.find('.popup-header'),
			morphContent = morphPopup.find('.popup-content'),
			timer = null,
			startTimer = function() {				
				stopTimer();
				console.log('starting timer');
				timer = setTimeout(function() {
					console.log('timer fired');
					morphPopup.hide();
				}, 1000);
			},
			stopTimer = function() {
				console.log('trying to stop', timer);
				if (timer != null) {
					console.log('cleared timer');
					clearTimeout(timer);
					timer = null;
				}
			};								
		
		morphPopup
			.on('mouseleave', function() {
				console.log('mouseleave');
				startTimer();
			})
			.on('mouseover', function() {
				console.log('mouseover');
				stopTimer();	
			})
			.on('click', '.strongs-number', function() {
				
				//console.log('lemma clikc');
				
				docs.Search.searchVersion.val( selectedWord.closest('.document-container').find('.document-header select').val() );
				docs.Search.searchInput.val( $(this).html() );
				docs.Search.searchWindow.show();
				docs.Search.doSearch();
			})			
			.find('.popup-close')
				.on('click', function() {
					stopTimer();
					morphPopup.hide();
				})
			.end();
								
		// finds data on a <span class="word"> and gets its morph and lemma data
		function formatMorphData(word) {
				
				var lemma = word.attr('data-lemma'),
					lemmaParts = lemma != null ? lemma.split(' ') : [],
					morph = word.attr('data-morph'),
					morphParts = morph != null ? morph.split(' ') : [],
					displayTextArray = [],
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
							displayTextArray.push( '<span class="lex-entry"><span class="lemma ' + (strongLetter == 'H' ? 'hebrew' : 'greek') + '">' + strongData.lemma + '</span> (<span class="strongs-number">' + strongKey + '</span>) - <span class="definition">' + strongData.strongs_def + '</span>' + (strongLetter == 'G' && morph != '' ? ' <span class="morphology">[' + bible.morphology.Greek.getMorphology( morph ) + ']</span>' : '') );
						}
					}
				}
				
				return displayTextArray;
					
			};
		
	
		// define mouseover and click events for words
		docManager.content.on('mouseover', 'span.w', function() {
			
			// push into footer
			var word = $(this),
				morphArray = formatMorphData(word);
			
			if (morphArray.length > 0) {
				
				word
					.closest('.document-container')
					.find('.document-footer')
					.html(morphArray.join('; '));
			}
			
		}).on('click', 'span.w', function() {
			
			// show popup
			var word = $(this),
				morphArray = formatMorphData(word);
				
			
				
			if (morphArray.length > 0) {
				
				// store for lemma search
				selectedWord = word;
				
				// put the content inside
				morphContent.html( morphArray.join('<br><br>') );
				
				// measure position
				var 
					wordPos = word.offset(),
					wordWidth = word.width(),
					wordHeight = word.height(),
					morphWidth = morphPopup.outerWidth(true),
					morphHeight = morphPopup.outerHeight(true),
					windowWidth = $(window).width(),
					windowHeight = $(window).height(),
					// default to below and to the right
					top = (wordPos.top + wordHeight + morphHeight > windowHeight) ? wordPos.top - morphHeight - 5 : wordPos.top + wordHeight,
					left = (wordPos.left + morphWidth > windowWidth) ? windowWidth - morphWidth : wordPos.left;
				
		
				// place me!	
				morphPopup
					.show()
					.css({top: top, left: left});
					
				stopTimer();
				
				$(document).one('mousemove', function() {
					console.log('moved away from word');
					startTimer();
				});
			}
				
	
		});
		
	}
});