/**
 * Main Document Application
 *
 * @author John Dyer (http://j.hn/)
 */

jQuery(function($) {
	
	
	
	// setup main site areas
	docs.DocManager.init($('#header'), $('#footer'), $('#content'), $(window));

	// load versions, then start doing other stuff
	bible.versions.getVersions(function(versions) {

		var defaultDocSettings = {
			docs: [
			{
				version: 'en_kjv',
				location: 'John.3.1',
				linked: true
			},
			{
				version: 'el_tisch',
				location: 'John.15.1',
				linked: false
			},
			{
				version: 'tr_turk',
				location: 'John.3.1',
				linked: true
			}			
			]
		};

		var docSettings = $.jStorage.get('docs-settings', defaultDocSettings);
		
		console.log(docSettings);
		
		
		// setup all documents and load content
		for (var i=0, il=docSettings.docs.length; i<il; i++) {
			var docSetting = docSettings.docs[i],
				document = docs.DocManager.addDocument(bible.BibleNavigator, docSetting.version);
			
			document.syncCheckbox.prop('checked', docSetting.linked);
			document.navigateById(docSetting.location, false);
		}
		
		docs.DocManager.addEventListener('navigation', function(e) {
			
			// save the state of all?
			//console.log('nav event');
			var docSettings = {docs:[]};
			for (var i=0, il=docs.DocManager.documents.length; i<il; i++) {
				var document = docs.DocManager.documents[i];
				docSettings.docs.push({
					version: document.selector.val(),
					//location: document.input.val(),
					location: document.fragmentId,
					linked: document.syncCheckbox.prop('checked')
				});
			}
			
			//console.log(docSettings);
			$.jStorage.set('docs-settings', docSettings);
		});


		
		// startup plugins
		var content = $('#content');
		for (var i=0, il=docs.plugins.length; i<il; i++) {
			docs.plugins[i].init( content, docs.DocManager);
		}
		
		// fullscren button
		$('#docs-fullscreen').on('click', function() {
			$('body')[0].webkitRequestFullScreen();
		});
	});
	
	// search
	docs.Search = (function() {
		
		var searchWindow = $(
			'<div id="search-window" class="modal-window">' +
				'<div class="modal-window-header">' +
					'<input type="text" class="search-text" />' +
					'<select class="search-version">' + bible.BibleNavigator.getOptions() + '</select>' +
					'<input type="button" class="search-button" value="Search" />' +
					'<input type="button" class="modal-window-close" value="Close" />' +
					//'<input type="button" class="search-cancel" value="Cancel" />' + 
				'</div>' +
				'<div class="modal-window-body"></div>' +
				'<div class="modal-window-footer"></div>' +
			'</div>').appendTo( $(document.body) ).hide(), 
			searchHeader = searchWindow.find('.modal-window-header'),
			searchBody = searchWindow.find('.modal-window-body'),
			searchFooter = searchWindow.find('.modal-window-footer'),
			searchClose = searchWindow.find('.modal-window-close'),
			searchInput = searchWindow.find('.search-text'),
			searchVersion = searchWindow.find('.search-version'),
			searchButton = searchWindow.find('.search-button');
			
		searchClose.on('click', function() {
			searchWindow.hide();
		});
		
		searchInput.on('keyup', function(e) {
			if (e.keyCode === 13)
				doSearch();
		});
		searchButton.on('click', function() {
			doSearch();	
		});
		
		searchWindow.on('click', 'span.verse', function() {		
			
			docs.DocManager.documents[0].navigateById($(this).attr('data-osis') , true);
	
			searchWindow.hide();
		});
		
		
		
		function doSearch() {
			console.log('doing search');
			
			var input = searchInput.val(),
				version = searchVersion.val();
				
			searchBody.empty();
			
			bible.BibleSearch.search( input, version,
				
				// chapter progress
				function(bookOsisID, chapterIndex, resultsCount, startDate) {
					
					//if (showFeedback) {
						searchFooter.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '; searching: ' + bible.BOOK_DATA[ bookOsisID ].names['en'][0] + ' ' + (chapterIndex+1).toString() )
						//searchProgress.width( (bookIndex+1)/66 * sbw );
					//}
					
				},
				
				// ended
				function(resultHtml, resultsCount, startDate) {
					
					searchBody.html(resultHtml);
					
					searchFooter.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '');
					
					//searchButton.prop('disabled', false);
					//searchText.prop('disbled', false);	
				}
			);	
		}
		
		return {
			searchVersion: searchVersion,
			searchWindow: searchWindow,
			searchInput: searchInput,
			doSearch: doSearch
		}
		
	})();
	
});