/**
 * Main Document Application
 *
 * @author John Dyer (http://j.hn/)
 */

jQuery(function($) {
	
	if (typeof window.console == 'undefined')
		window.console = {log:function() {}};
		
	// updates languages
	docs.Localizer.localize();
	
	// setup main site areas
	docs.DocManager.init($('#header'), $('#footer'), $('#content'), $(window));
	
	// test for AJAX capabilities
	$.ajax({
		url: 'mobile.html',
		
		error: function() {
			
			var modal = docs.createModal('error', '<strong>Error</strong>: Browser doesn\'t support local files').size(500,300).center();
			
			modal.content.html(
					'<p>Windows, Start, Run</p>' +
					'<code>"%UserProfile%\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe" --allow-file-access-from-files</code>' +				
					'<p>Mac, Terminal</p>' +
					'<code>/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --allow-file-access-from-files</code>'		
			);
			modal.show();
			
			//alert('Your browser does not support loading local files. If you are using Chrome, you need to launch it with --allow-file-access-from-files ')
		},
		
		success: function() {
			
			// load versions, then start doing other stuff
			bible.versions.getVersions(function(versions) {
		
				var defaultDocSettings = (docs.Features.hasTouch) ?
				{
					docs: [
					{
						version: 'en_kjv',
						location: 'John.3.1',
						linked: true
					}
					]
				}
				:
				{
					docs: [
					{
						version: 'en_kjv',
						location: 'John.3.1',
						linked: true
					},
					{
						version: 'el_tisch',
						location: 'John.3.1',
						linked: true
					}		
					]
				};
				docs.DocManager.loadSettings(defaultDocSettings);
				
				docs.DocManager.addEventListener('navigation', function(e) {		
					docs.DocManager.saveSettings();
				});
				
				// startup plugins
				for (var i=0, il=docs.plugins.length; i<il; i++) {
					docs.plugins[i].init( docs.DocManager);
				}
				
				// search
				docs.Search = (function() {
										
					var searchWindow = docs.createModal('search', 'Search'),
						
						searchInput = $('<input type="text" class="search-text" />').appendTo(searchWindow.menu),
						searchButton = $('<input type="button" class="search-button" value="Search" />').appendTo(searchWindow.menu),
						printButton = $('<input type="button" class="print-button" value="Print" />').appendTo(searchWindow.menu),
						searchVersion = $('<br><select class="search-version">' + bible.BibleNavigator.getOptions() + '</select>').appendTo(searchWindow.menu);
						
						
					searchWindow.footer.html('&nbsp;-');
					searchWindow.size(580,400).center();
					searchWindow.content.css({'overflow': 'auto'});
					
					$(window).on('resize', function() {
						searchWindow.center();
					});
					
					searchInput.on('keyup', function(e) {
						if (e.keyCode === 13)
							doSearch();
					});
					searchButton.on('click', function() {
						doSearch();	
					});
					
					printButton.on('click', function() {
						
						var printWin = window.open('','','letf=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status=0');
						printWin.document.write('<!DOCTYPE html><html><head>' +
													'<link href="css/studybible.css" rel="stylesheet">' +
												'</head><body>' + searchWindow.content[0].innerHTML + '</body></html>');
						printWin.document.close();
						printWin.focus();
						printWin.print();
						printWin.close();
					});					
					
					searchWindow.content.on('click', 'span.verse', function() {		
						
						docs.DocManager.documents[0].navigateById($(this).attr('data-osis') , true);
				
						searchWindow.hide();
					});
					
					
					
					function doSearch() {
						
						if (window.location.href.indexOf('file:') == -1) {
							
							console.warn('this will be slow');
							
						}
						
						var input = searchInput.val(),
							version = searchVersion.val();
							
						console.log(input, version);
							
						searchWindow.content.empty();
						
						bible.BibleSearch.search( input, version,
							
							// chapter progress
							function(bookOsisID, chapterIndex, resultsCount, startDate) {
								
								//if (showFeedback) {
									searchWindow.footer.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '; searching: ' + bible.BOOK_DATA[ bookOsisID ].names['en'][0] + ' ' + (chapterIndex+1).toString() )
									//searchProgress.width( (bookIndex+1)/66 * sbw );
								//}
								
							},
							
							// ended
							function(resultHtml, resultsCount, startDate) {
								
								searchWindow.content.html(resultHtml);
								
								searchWindow.footer.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '');
								
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
					
				})(); // search function creation
				
			}); // getversions callback
	
		} // main AJAX test success callback
	});
	
});