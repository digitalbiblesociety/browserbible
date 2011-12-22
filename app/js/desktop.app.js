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
		docs.plugins[i].init();
	}
	
});