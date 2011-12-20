/**
 * Document manager for Bible app
 *
 * @author John Dyer (http://j.hn/)
 */

var docs = {};

docs.DocManager = {
	
	init: function(header, footer, content, window) {
		this.header = header;
		this.footer = footer;
		this.content = content;
		this.window = window;
		
		var t = this;
		
		this.window.resize(function() { t.onResize(); });
		this.onResize();
	},
	
	onResize: function() {
		
		var headerHeight = this.header.outerHeight(true),
			footerHeight = this.footer.outerHeight(true),
			windowHeight = this.window.height(),
			windowWidth = this.window.width();
			
		this.content
			.height(windowHeight - headerHeight - footerHeight)
			.width(windowWidth);
		
		this.resizeDocuments();	
	},
	
	docIndex: 0,
	
	documents: [],
	
	addDocument: function(navigator, selectedDocumentId, fragmentId) {
		
		var document = new docs.Document(this, 'doc-' + this.docIndex, navigator, selectedDocumentId, fragmentId);	
		this.documents[this.docIndex] = document;
		
		this.content.append(document.container);
		
		this.docIndex++;
		
		this.resizeDocuments();
	},
	
	resizeDocuments: function() {
		
		if (this.documents.length == 0)
			return;	
		
		var contentWidth = this.content.width(),
			documentMargin = this.documents[0].container.outerWidth(true) - this.documents[0].container.width();
		
		for (var i=0, il=this.documents.length; i<il; i++) {
			
			var document = this.documents[i];
			
			document.content.width( contentWidth/il - documentMargin*2	);
			
			document.resize();
			
		}
		
	},
	
	sync: function(sourceDocument, visibleFragmentInfo) {
		
		// move the other panes in sync
		for (var i=0, il=this.documents.length; i<il; i++) {
			
			var document = this.documents[i];
			
			if (sourceDocument.id != document.id // make sure this isn't the one that generated the request
				&& sourceDocument.navigator.name == document.navigator.name // same type (i.e. bible)
				&& sourceDocument.sync.val() == document.sync.val() // does the user want this one synced?
				) {
				
				document.scrollToFragmentId(visibleFragmentInfo.fragmentId); //, visibleFragmentInfo.offset);
				
			}
		
		}		
		
	}
	
};

docs.Document = function(manager, id, navigator, selectedDocumentId, fragmentId) {

	// store
	this.manager = manager;
	this.id = id;
	this.navigator = navigator;	
	
	// create pane
	this.container = $(
			'<div class="document-container" id="' + id + '">' +
				'<div class="document-header">' +
					'<input type="text" class="document-input" />' +
					'<input type="button" value="GO" class="document-button" />' +
					'<select class="document-selector">' + this.navigator.getOptions() + '</select>' +
					'<select class="document-sync"><option seleced>A</option><option>B</option><option>C</option></select>' +
				'</div>' +
				'<div class="document-content">' +
					'<div class="document-wrapper">' +
					'</div>' +					
				'</div>' +
				'<div class="document-footer">' +
					'Footer' + 
				'</div>' +
			'</div>'
		);
	
	// find DOM elements
	this.header = this.container.find('.document-header');
	this.input = this.container.find('.document-input');
	this.button = this.container.find('.document-button');
	this.selector = this.container.find('.document-selector').val(selectedDocumentId);
	this.sync = this.container.find('.document-sync');
	
	this.content = this.container.find('.document-content');
	this.wrapper = this.container.find('.document-wrapper');
	
	this.footer = this.container.find('.document-footer');
	
	
	// setup events
	var t = this;
	this.content.on('scroll', function(e) { t.handleScroll(e); });
	
	// TODO: real loading
	this.load(fragmentId);
	this.load('c001002');
	this.load('c001003');	
	
	// will be appended in the Document Manager class
};
docs.Document.prototype = {
	
	resize: function() {
		var availableHeight = this.container.parent().height(),
			containerMargin = this.container.outerHeight(true) - this.container.height(),
			headerHeight = this.header.outerHeight(true),
			footerHeight = this.footer.outerHeight(true);
			
		this.content.height( availableHeight - containerMargin - headerHeight - footerHeight );
		
		// TODO save scroll
	},
	
	load: function(fragmentId) {
		
		var t = this;
		
		$.ajax({
			url: 'content/bibles/' + this.selector.val() + '/' + fragmentId + '.html',
			dataType: 'html',
			success: function(data) {
				
				t.wrapper.append( $(data).find(t.navigator.documentDataSelector)  );
				t.updateDocumentNavigation();
			}
		})
	},
	
	handleScroll: function(e) {
		// find verse
		
		this.updateDocumentNavigation();
	},
	
	updateDocumentNavigation: function() {
		
		var t = this,
			paneTop = this.content.position().top,
			visibleFragmentInfo = null;
		
		// look through all the markers and find the first one that is fully visible
		t.content.find( this.navigator.fragmentSelector ).each(function(e) {
			var m = $(this);
			if (m.offset().top - paneTop > -2) {
				
				// pass the marker data
				visibleFragmentInfo = {
					fragmentId: m.attr( t.navigator.fragmentIdAttr ),
					offset: m.offset().top - paneTop
				};
				return false;
			}
			
			// means "keep looking" :)
			return true;
		});
		
		// found a fragment
		if (visibleFragmentInfo != null) {
			
			// turn the ID into a readable reference for the input
			var navigationInput = t.navigator.formatNavigation(visibleFragmentInfo.fragmentId);	
			t.input.val( navigationInput );
			
			// sync to other like panes
			t.manager.sync(this, visibleFragmentInfo);
		}
	},
	
	scrollToFragmentId: function(fragmentId, offset) {
		
		var fragmentNode = this.navigator.findFragment( fragmentId, this.content ); 
		
		if (fragmentNode.length > 0) {

			// scroll to this one
			this.scrollToFragmentNode(fragmentNode, (offset || 0));
			
		} else {
			
			// AJAX load?
			
		}		
		
	},
	
	scrollToFragmentNode: function(node, offset) {
		
		// calculate node position
		var paneTop = this.content.position().top,
			scrollTop = this.content.scrollTop(),
			nodeTop = node.offset().top,
			nodeTopAdjusted = nodeTop - paneTop + scrollTop;
		
		// go to it
		//this.ignoreScrollEvent = true;
		this.content.scrollTop(nodeTopAdjusted + (offset || 0));
		//this.ignoreScrollEvent = false;
	}		
};

bible.BibleNavigator = {
	
	name: 'bible',
	
	documentDataSelector: 'div.chapter',
	
	fragmentSelector: 'span.verse',
	
	fragmentIdAttr: 'data-verse',
	
	selectorData: {
		'en' : {
			languageName: 'English',
			versions: {
				'en_kjv': {
					abbreviation: 'KJV',
					name: 'King James Version',
					copyright: 'Public Domain'
				},
				'en_net': {
					abbreviation: 'NET',
					name: 'New English Translation',
					copyright: 'Copyright bible.org'
				}				
			}
		},
		'ar' : {
			languageName: 'Arabic',
			versions: {
				'ar_kjv': {
					abbreviation: 'ARR',
					name: 'King James Version',
					copyright: 'Public Domain'
				},
				'ar_net': {
					abbreviation: 'AR2',
					name: 'New English Translation',
					copyright: 'Copyright bible.org'
				}				
			}
		}		
	},
	
	getOptions: function() {
		var html = '',
			langCode,
			language,
			versionCode,
			version;
		
		for (langCode in this.selectorData) {
			language = this.selectorData[langCode];
			
			html += '<optgroup label="' + language.languageName + '">';
			
			for (versionCode in language.versions) {
				version = language.versions[versionCode];
				
				html += '<option value="' + versionCode + '">' + version.abbreviation + ' - ' + version.name + '</option>';
				
			}
			
			html += '</optgroup>';
		}
	
		return html;
	},
	
	formatNavigation: function(fragmentId) {
		return bible.BibleFormatter.parseVerseCode(fragmentId, 0);
	},
	
	findFragment: function(fragmentId, content) {
		return content.find('span.verse[data-verse=' + fragmentId + ']');
	}
	
}


// startup
jQuery(function($) {
	
	// setup main site areas
	docs.DocManager.init($('#header'), $('#footer'), $('#content'), $(window))

	docs.DocManager.addDocument(bible.BibleNavigator, 'en_kjv', 'c001001');
	docs.DocManager.addDocument(bible.BibleNavigator, 'en_kjv', 'c001001');
	docs.DocManager.addDocument(bible.BibleNavigator, 'en_kjv', 'c001001');
});