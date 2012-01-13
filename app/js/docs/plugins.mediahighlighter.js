	
/**
 * Media Highlighter
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) { 	
	
		var coolstuff = {
			'v001001001' : [
				{
					type: 'audio',
					stuff: 'creation.mp3'
				}
			],
			'v06602201' : [
				{
					type: 'video',
					stuff: 'return_of_jc_Sweetness.mp4'
				}		
			]
		};
		
		docManager.delegate('span.verse', 'mouseover', function() {
			
			var verseId = $(this).attr('data-verse'),
				data = coolstuff[verseId];
				
			if (typeof data != 'undefined') {
				console.log('Cool stuff should appear here: ' + verseId, data)
			}
			
		});
		
	}
});