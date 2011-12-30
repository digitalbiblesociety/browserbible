/**
 * Main Document Application
 *
 * @author John Dyer (http://j.hn/)
 */

jQuery(function($) {
	
	// setup main site areas
	docs.DocManager.init($('#header'), $('#footer'), $('#content'), $(window))

	docs.DocManager.addDocument(bible.BibleNavigator, 'en_kjv');
	docs.DocManager.addDocument(bible.BibleNavigator, 'en_nasb');
	docs.DocManager.addDocument(bible.BibleNavigator, 'el_tisch');
	
	docs.DocManager.documents[0].navigateById('v048001001', true);
	
	// startup plugins
	for (var i=0, il=docs.plugins.length; i<il; i++) {
		docs.plugins[i].init($('#content'));
	}
	
	// search
	(function() {
		
		var searchWindow = $(
			'<div id="search-results" class="modal-window">' +
				'<div id="search-header" class="modal-window-header"></div>' +
				'<div id="search-body" class="modal-window-body"></div>' +
			'</div>').appendTo( $(document.body) ).hide(), //.center(),
			searchHeader = searchWindow.find('.modal-window-header'),
			searchBody = searchWindow.find('.modal-window-body'),
			searchText = $('#bible-search-input'),
			searchButton = $('#bible-search-button');
		
		searchText.keyup(function(e) {
			if (e.keyCode === 13)
				doSearch
		});
		searchButton.click(function() {
			doSearch();	
		});
		
		searchBody.delegate('span.verse', 'click', function() {
			
			console.log( $(this).attr('data-verse')  );
			
		});
		
		function doSearch() {
			console.log('doing search');
			
			var input = searchText.val(),
				version = 'en_kjv';
				
			searchWindow.show();
			
			bible.BibleSearch.search( input, version,
				
				// chapter progress
				function(bookIndex, chapterIndex, resultsCount, startDate) {
					
					//if (showFeedback) {
						searchHeader.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '; searching: ' + bible.Books[ bookIndex ].names[0] + ' ' + (chapterIndex+1).toString() )
						//searchProgress.width( (bookIndex+1)/66 * sbw );
					//}
					
				},
				
				// ended
				function(resultHtml, resultsCount, startDate) {
					
					searchBody.html(resultHtml);
					
					searchHeader.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '');
					
					//searchButton.prop('disabled', false);
					//searchText.prop('disbled', false);	
				}
			);	
		}
		
	})();
	
});