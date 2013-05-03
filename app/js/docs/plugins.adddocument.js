	
/**
 * Option to add additional documents
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) { 	
	
		$('<input type="button" id="docs-add-document" />')
			.appendTo(docManager.header.find('#header-nav'))
			.on('click', function() {
			
				docManager.addDocument(bible.BibleNavigator, 'eng_kjv');
				docManager.documents[docManager.documents.length-1].navigateByString(docManager.documents[0].input.val());
				docManager.saveSettings();
			});
		
	}
});