/**
 * Document manager for Bible app
 *
 * @author John Dyer (http://j.hn/)
 */

var docs = {};


/**
 * Document manager for Bible app
 *
 * @author John Dyer (http://j.hn/)
 */
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
	
	documents: [],
	
	addDocument: function(navigator, selectedDocumentId) {
		
		var document = new docs.Document(this, 'doc-' + this.documents.length.toString(), navigator, selectedDocumentId);	
		this.documents.push ( document );
		
		this.content.append(document.container);
		
		this.resizeDocuments();
	},
	
	resizeDocuments: function() {
		
		if (this.documents.length == 0)
			return;	
		
		var contentWidth = this.content.width(),
			documentMargin = this.documents[0].container.outerWidth(true) - this.documents[0].container.width();
		
		for (var i=0, il=this.documents.length; i<il; i++) {
			
			var document = this.documents[i],
				newWidth = contentWidth/il - documentMargin;
			
			document.content.width( newWidth );
			document.header.width( newWidth - parseInt(document.header.css('padding-left'),10) - parseInt(document.header.css('padding-right'),10));
			document.footer.width( newWidth - parseInt(document.footer.css('padding-left'),10) - parseInt(document.footer.css('padding-right'),10));
			
			document.resize();
			
		}
		
	},
	
	sync: function(sourceDocument, visibleFragmentInfo) {
		
		// move the other panes in sync
		for (var i=0, il=this.documents.length; i<il; i++) {
			
			var document = this.documents[i];
			
			if (sourceDocument.id != document.id // make sure this isn't the one that generated the request
				&& sourceDocument.navigator.name == document.navigator.name // same type (i.e. bible)
				//&& sourceDocument.syncList.val() == document.syncList.val() // does the user want this one synced?
				&& document.syncCheckbox.is(':checked')
				) {
				
				document.navigateById(visibleFragmentInfo.fragmentId, false, visibleFragmentInfo.offset);
				
			}
		
		}		
		
	},
	
	setFocus: function(sourceDocument) {
		
		// move the other panes in sync
		for (var i=0, il=this.documents.length; i<il; i++) {
			
			var document = this.documents[i];
			
			if (sourceDocument.id != document.id) {
				
				document.hasFocus = false;
				document.container.removeClass('document-focused');
				
			}
		
		}		
		
	}	
	
	
};

docs.Document = function(manager, id, navigator, selectedDocumentId) {

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
					//'<select class="document-sync-list"><option seleced>A</option><option>B</option><option>C</option></select>' +
					'<select class="document-selector">' + this.navigator.getOptions() + '</select>' +
					'<input type=\"checkbox\" class=\"document-sync-checkbox\" checked />' +
					'<input type=\"button\" class=\"document-search-button\" value="S" />' +
					'<input type=\"button\" class=\"document-info-button\" value="i" />' +
					//'<input type="text" class="document-search" />' +
				'</div>' +
				'<div class="document-content">' +
					'<div class="document-wrapper">' +
					'</div>' +					
				'</div>' +
				'<div class="document-footer">' +
					'&nbsp;' + 
				'</div>' +
			'</div>'
		);
	
	// find DOM elements
	this.header = this.container.find('.document-header');
	this.input = this.container.find('.document-input');
	this.button = this.container.find('.document-button');
	this.selector = this.container.find('.document-selector').val(selectedDocumentId);
	this.syncList = this.container.find('.document-sync-list'); // currently not being used
	this.syncCheckbox = this.container.find('.document-sync-checkbox');
	this.search = this.container.find('.document-search');
	
	this.content = this.container.find('.document-content');
	this.wrapper = this.container.find('.document-wrapper');
	
	this.footer = this.container.find('.document-footer');
	
	
	// setup events
	var t = this;
	this.content.on('scroll', function(e) { t.handleScroll(e); });
	this.button.on('click', function(e) {
		t.navigateToUserInput();
	});
	this.input.on('keyup', function(e) {
		if (e.keyCode == 13) {
			t.navigateToUserInput();
		}
	});
	this.search.on('keyup', function(e) {
		if (e.keyCode == 13) {
			t.search();
		}
	});	
	this.wrapper.on('mouseenter mouseover', function(e) {
		t.setFocus(true);
	});	
	this.container.on('mouseenter mouseover', function(e) {
		t.setFocus(true);
	});	
	this.selector.on('change', function(e) {
		t.wrapper.empty();
		t.navigateToUserInput();
	});
	
	
	// TODO: real loading
	//this.load(fragmentId);
	//this.load('c001002', 'append');
	//this.load('c001003', 'append');	
	
	// will be appended in the Document Manager class
};
docs.Document.prototype = {
	
	hasFocus: false,
	
	ignoreScrollEvent: false,
	
	resize: function() {
		var availableHeight = this.container.parent().height(),
			containerMargin = this.container.outerHeight(true) - this.container.height(),
			contentMargin = this.content.outerHeight(true) - this.content.height(),
			headerHeight = this.header.outerHeight(true),
			footerHeight = this.footer.outerHeight(true);
			
		this.content.height( availableHeight - containerMargin -contentMargin - headerHeight - footerHeight );
		
		// TODO save scroll
	},
	
	load: function(fragmentId, action) {
		
		
		
		var t = this,
			sectionId = t.navigator.convertFragmentIdToSectionId( fragmentId ),
			url = 'content/bibles/' + this.selector.val() + '/';
			
		// select the URL based on the action
		switch (action) {
			default:
			case 'text':
				url += sectionId + '.html';
				break;
			case 'next':
				var nextSectionId = t.navigator.getNextSectionId(sectionId);
				if (nextSectionId == null) {
					return;
				}
				url +=  nextSectionId + '.html';
				break;
			case 'prev':
				var prevSectionId = t.navigator.getPrevSectionId(sectionId);
				if (prevSectionId == null) {
					return;
				}				
				url += prevSectionId + '.html';
				break;			
		}
		
		console.log(this.id, fragmentId, action, url);
		
		// load the URL and insert, append, prepend the content
		$.ajax({
			url: url,
			dataType: 'html',
			success: function(data) {
				
				var newSectionNode = $(data).find(t.navigator.sectionSelector),
					newSectionId = newSectionNode.attr(t.navigator.sectionIdAttr);
				
				// Check if the content is already here!
				if (t.wrapper.find( t.navigator.sectionSelector + '[' + t.navigator.sectionIdAttr + '="' + newSectionId + '"]').length > 0) {
					return;
				}
				
				
				
				switch (action) {
					default:
					case 'text':
						
						t.ignoreScrollEvent = true;
						
						t.wrapper.empty();
						t.wrapper.append(newSectionNode);
						
						// TODO: scroll to individual verse (not just the chapter)
						console.log( t.id, fragmentId, newSectionNode.attr('data-osis') );
						
						if (fragmentId.substring(7,10) != '001') {
							t.scrollToFragmentNode(t.wrapper.find('span.verse[data-osis=' + fragmentId + ']'), 0);
						} else {
							t.content.scrollTop(0);
						}
						
						// now maunally check scroll
						t.checkScrollPosition();
					
						t.ignoreScrollEvent = false;
					
						break;
					case 'next':
						
						// simply append the node
						t.wrapper.append(newSectionNode);
						
						break;
					case 'prev':
						
						var oldScroll = t.content.scrollTop(),
							oldWrapperHeight = t.wrapper.outerHeight(true);

						t.wrapper.prepend(newSectionNode);
						
						try {
							var newWrapperHeight = t.wrapper.outerHeight(true),
								newScroll = oldScroll + (newWrapperHeight - oldWrapperHeight);
							
							t.content.scrollTop(newScroll);
						} catch (e) {
							console.log('error', 'Cant fix scroll');
						}


						break;			
				}
				
				// LIMIT
				t.ignoreScrollEvent = true;
				
				var sections = t.wrapper.find( t.navigator.sectionSelector );
				
				if (sections.length > 5) {
				
					// find the one where the top of the chapter is not past the bottom of the scroll pane
					var mostVisibleIndex = 0;
					sections.each(function(index) {
						var sectionNode = $(this);

						//console.log( sectionNode.attr('data-chapter'), sectionNode.position().top, t.content.height(), t.content.scrollTop() );
						
						if (sectionNode.position().top > t.content.scrollTop()) {
							mostVisibleIndex = index;

							return false;
						}
						
						// keep looking :)
						return true;
					});
					
					//console.log(t.id + ' -- need to remove some', mostVisibleIndex);
					
					
					if (mostVisibleIndex <= 2) {
						// remove from the bottom
						sections.last().remove();
					} else {
						// remove from the top
						var topNode = sections.first(),
							topHeight = topNode.outerHeight(true),
							oldScroll = t.content.scrollTop(),
							newScroll = oldScroll - topHeight;

						topNode.remove();
						t.content.scrollTop(newScroll);
					}
					
				}
				t.ignoreScrollEvent = false;
				
				
				// update the input panel
				t.updateNavigationInput();
			}
		})
	},
	
	checkScrollPosition: function() {
		// measure sections
		var t = this,
			sections = this.wrapper.find( t.navigator.sectionSelector ),
			totalHeight = 0;
		
		sections.each(function(e) {
			totalHeight += $(this).height();
		});

		// measure top and bottom height
		var paneHeight = t.content.height(),
			distFromTop = t.content.scrollTop(),
			distFromBottom = totalHeight - paneHeight - distFromTop,
			fragmentId;

		// check if we need to load the prev or next one
		if (distFromTop < 750) {
			//console.log(t.id, 'load prev');

			fragmentId = sections
							.first() // the first chapter (top)
							.find( t.navigator.fragmentSelector + ':first') // first fragments
							.attr( t.navigator.fragmentIdAttr );

			this.load(fragmentId, 'prev');

		} else if (distFromBottom < 750) {
			//console.log(t.id, 'load next');

			fragmentId = sections
							.last() // the last chapter (bottom)
							.find( t.navigator.fragmentSelector + ':first') // first fragments
							.attr( t.navigator.fragmentIdAttr );
							
			this.load(fragmentId, 'next');
		}		
	},
	
	scrollTimeout: null,
	
	handleScroll: function(e) {
		var t = this;
		
		t.updateNavigationInput();
		
		if (t.ignoreScrollEvent) {
			return;
		}
		
		
		if (t.scrollTimeout != null) {
			clearTimeout(this.scrollTimeout);
			t.scrollTimeout = null;
		}
		this.scrollTimeout = setTimeout(function() {
			t.checkScrollPosition(e);
		}, 50);	
	},
	
	setDocumentId: function(documentId) {
		this.selector.val(documentId);
	},
	
	navigateToUserInput: function() {
		
		this.navigateByString( this.input.val(), true );
		
		this.updateNavigationInput();
	},
	
	navigateByString: function(someString, getFocus, offset) {
		
		// parse into fragmentId
		var fragmentId = this.navigator.parseString(someString);
		
		console.log(this.id, 'navigateByString', someString, fragmentId);
		
		// load if needed
		if (fragmentId != null) {
			this.navigateById(fragmentId, getFocus, offset);
		}
	},
	
	navigateById: function(fragmentId, getFocus, offset) {
		
		var fragmentNode = this.navigator.findFragment( fragmentId, this.content );
		
		if (typeof offset == 'undefined')
			offset = 0;
		if (typeof getFocus == 'undefined')
			getFocus = false;
		
		this.setFocus(getFocus);
		
		console.log(this.id, 'navigateById', fragmentId, fragmentNode);
		
		if (fragmentNode.length > 0) {

			// scroll to this one
			this.scrollToFragmentNode(fragmentNode, offset);
			
		} else {
			
			
			// load the section (chapter)
			this.load(fragmentId);
			
		}		
		
	},
	
	setFocus: function(hasFocus) {
		this.hasFocus = hasFocus;
		if (hasFocus) {
			this.container.addClass('document-focused');
			this.manager.setFocus(this);
		}
	},
	
	updateNavigationInput: function() {
		
		var t = this,
			paneTop = this.content.position().top,
			visibleFragmentInfo = null;
		
		// look through all the markers and find the first one that is fully visible
		t.content.find( this.navigator.fragmentSelector ).each(function(e) {
			var m = $(this);
			if (m.offset().top - paneTop > -2) {
				
				// pass the marker data
				visibleFragmentInfo = {
					// verse ID
					fragmentId: m.attr( t.navigator.fragmentIdAttr ),
					
					// extra positioning info
					offset: paneTop - m.offset().top
				};
				return false;
			}
			
			// means "keep looking" :)
			return true;
		});
		
		// found a fragment
		if (visibleFragmentInfo != null) {
			
			// turn the ID into a readable reference for the input
			var navigationInput = t.navigator.formatNavigation(visibleFragmentInfo.fragmentId, t.selector.find('option:selected').attr('data-language'));	
			t.input.val( navigationInput );
			
			// sync to other like panes
			if (this.hasFocus && this.syncCheckbox.is(':checked')) {
				t.manager.sync(this, visibleFragmentInfo);
			}
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
	},
	
	search: function() {
		var t = this,
			searchText = t.search.val();
			
		
		
	}
};
