	
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
						displayTextArray.push( strongData.lemma + ' (' + strongKey + ') - ' + strongData.strongs_def + (strongLetter == 'G' ? ' [' + bible.morphology.Greek.getMorphology( morph ) + ']' : '') );
					}
					
					
				}
				
				word
					.closest('.document-container')
					.find('.document-footer')
					.html(displayTextArray.join('; '));
						
			
			}
					
		});
		
	}
});