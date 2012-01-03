/**
 * Main Document Application
 *
 * @author John Dyer (http://j.hn/)
 */

jQuery(function($) {
	
	// setup main site areas
	docs.DocManager.init($('#header'), $('#footer'), $('#content'), $(window))

	docs.DocManager.addDocument(bible.BibleNavigator, 'en_kjv');
	docs.DocManager.addDocument(bible.BibleNavigator, 'es_rv');
	docs.DocManager.addDocument(bible.BibleNavigator, 'ar_svd');
	docs.DocManager.addDocument(bible.BibleNavigator, 'zhcn_ncv');
	
	
	docs.DocManager.documents[0].navigateById('Rom.1.1', true);
	
	// startup plugins
	for (var i=0, il=docs.plugins.length; i<il; i++) {
		docs.plugins[i].init($('#content'));
	}
	
});