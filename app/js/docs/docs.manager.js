/**
 * Document manager for Bible app
 *
 * @author John Dyer (http://j.hn/)
 */


/**
 * Array for plugins to be added on startup
 */
docs.plugins = [
	
	
];

/**
 * Document manager for Bible app
 */
docs.DocManager = {
	
	init: function(header, footer, content, window) {
		this.header = header;
		this.footer = footer;
		this.content = content;
		this.window = window;
		
		var t = this;
		
		this.window.resize(function() { t.onResize(); });
	
		
		if (docs.Features.hasTouch) {
			this.window.on("orientationchange", function() { t.onResize(); });
		}
		
		this.onResize();
	},
	
	onResize: function() {
		
		// iOS
		if (docs.Features.hasTouch) {
			if (document.height < window.outerHeight) {
				document.body.style.height = (window.outerHeight + 50) + 'px';
			}
			
			setTimeout( function(){ window.scrollTo(0, 1); }, 50 );	
		}
		
		var headerHeight = this.header.outerHeight(true),
			footerHeight = this.footer.outerHeight(true),
			windowHeight = this.window.height(),
			windowWidth = this.window.width();
			
		this.content
			.height(windowHeight - headerHeight - footerHeight - 10 + (docs.Features.hasTouch ? 50 : 0))
			.width(windowWidth - 30);
		
		this.resizeDocuments();	
	},
	
	documents: [],

	docIndex: 0,
	
	addDocument: function(navigator, selectedDocumentId) {
		
		var document = new docs.Document(this, 'doc-' + this.docIndex.toString(), navigator, selectedDocumentId);	
		this.documents.push ( document );
		
		this.content.append(document.container);
		
		this.resizeDocuments();
		this.docIndex++;
		
		if (this.documents.length === 1) {
			$('.document-lock-button, .document-close-button').hide();
		} else {
			$('.document-lock-button, .document-close-button').show();
		}
		//console.warn(this.documents.length, $('.document-lock-button, .document-close-button') );
		
		return document;
	},
	
	loadSettings: function(defaultSettings) {
		
		var docSettings = $.jStorage.get('docs-settings', defaultSettings);				
		
		// setup all documents and load content
		for (var i=0, il=docSettings.docs.length; i<il; i++) {
			var docSetting = docSettings.docs[i],
				document = docs.DocManager.addDocument(bible.BibleNavigator, docSetting.version);
			
			document.syncCheckbox.prop('checked', docSetting.linked);
			document.navigateById(docSetting.location, false);
		}
				
	},
	
	saveSettings: function() {
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
	},
	
	remove: function(document) {
		var docIndex = 0;
		
		for (var i=0, il=this.documents.length; i<il; i++) {
			var doc = this.documents[i];
			if (doc.id === document.id) {
				docIndex = i;
				break;
			}
		}
		
		this.documents.splice(docIndex, 1);
		
		this.resizeDocuments();
		this.saveSettings();
		

		if (this.documents.length === 1) {
			$('.document-lock-button, .document-close-button').hide();
		}		
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
			
			document.header.width( newWidth - (document.header.outerWidth(true) - document.header.width()) );
			document.footer.width( newWidth - (document.footer.outerWidth(true) - document.footer.width()) );
			
			//document.header.width( newWidth - parseInt(document.header.css('padding-left'),10) - parseInt(document.header.css('padding-right'),10));
			//document.footer.width( newWidth - parseInt(document.footer.css('padding-left'),10) - parseInt(document.footer.css('padding-right'),10));
			
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
				//&& document.syncCheckbox.is(':checked')
				&& document.lockBtn.hasClass('state-locked')
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
				document.footer.empty();
				
			}
		
		}		
		
	},
	
	// start: fake events
	events: {},
	addEventListener: function (eventName, callback, bubble) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(callback);
	},
	removeEventListener: function (eventName, callback) {
		if (!eventName) { this.events = {}; return true; }
		var callbacks = this.events[eventName];
		if (!callbacks) return true;
		if (!callback) { this.events[eventName] = []; return true; }
		for (i = 0; i < callbacks.length; i++) {
			if (callbacks[i] === callback) {
				this.events[eventName].splice(i, 1);
				return true;
			}
		}
		return false;
	},	
	dispatchEvent: function (eventName) {
		var i,
			args,
			callbacks = this.events[eventName];

		if (callbacks) {
			args = Array.prototype.slice.call(arguments, 1);
			for (i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(null, args);
			}
		}
	}
	// end: fake events
	
	
};

docs.Document = function(manager, id, navigator, selectedDocumentId) {

	var t = this;

	// store
	t.manager = manager;
	t.id = id;
	t.navigator = navigator;
	t.fragmentId = null;
	
	// create pane
	t.container = $(
			'<div class="document-container" id="' + id + '">' +
				'<div class="document-header">' +
				
					'<div class="document-header-left">' +
						'<div class="document-header-input">' +
							'<input type="text" class="document-input" />' +
						'</div>' +

						'<div class="document-header-selector">' +
							'<span>NASB</span>' +
							'<select class="document-selector">' + t.navigator.getOptions() + '</select>' +
						'</div>' +

					'</div>' +
					
					'<div class="document-header-right">' +
						'<input type=\"button\" class=\"document-header-button document-info-button\" value="i" />' +
						'<input type=\"button\" class=\"document-header-button document-search-button\" value="S" />' +
						'<input type=\"button\" class=\"document-header-button document-audio-button\" value="A" />' +
						'<input type=\"button\" class=\"document-header-button document-lock-button state-locked\" value="L" />' +						
						'<input type=\"button\" class=\"document-header-button document-close-button\" value="X" />' +
					'</div>' +
					/*
					'<div class="document-header-options">' +
						'<input type=\"button\" class=\"document-header-button document-options-button\" value="O" />' +
					'</div>' +
					*/
				'</div>' +
				'<div class="document-content">' +
					'<div class="document-wrapper">' +
					'</div>' +					
				'</div>' +
				'<div class="document-about"></div>' + 
				'<div class="document-footer">' +
					'&nbsp;' + 
				'</div>' +
				'<div class="document-footer-resize"></div>' +
			'</div>'
		);
	
	
	
	// find DOM elements
	t.header = t.container.find('.document-header');
	t.input = t.container.find('.document-input');
	t.button = t.container.find('.document-button');
	t.selector = t.container.find('.document-selector').val(selectedDocumentId);
	
	// double check. if the selected version (from memory) isn't there, try the first one
	selectedDocumentId = t.selector.val();
	
	t.syncList = t.container.find('.document-sync-list'); // currently not being used
	t.syncCheckbox = t.container.find('.document-sync-checkbox');
	t.lockBtn = t.container.find('.document-lock-button');
	t.searchBtn = t.container.find('.document-search-button');
	t.infoBtn = t.container.find('.document-info-button');
	t.closeBtn = t.container.find('.document-close-button');
	t.about = t.container.find('.document-about');
	
	// config
	t.optionsBtn = t.container.find('.document-options-button');
	t.optionsWindow = docs.createModal(t.id + 'options', 'Options');
	t.optionsWindow.content.append( t.container.find('.document-header-options') );	
	t.optionsBtn.on('click', function() {
		if (t.optionsWindow.content.is(':visible')) {
			t.optionsWindow.hide();
		} else {
			t.optionsWindow.show();
			t.optionsWindow.window.css({top: t.optionsBtn.offset().top + 25, left: t.optionsBtn.offset().left + 25 - t.optionsWindow.window.width()});
		}
	});
	
	
	//audio
	t.currentAudio = null;
	t.audioBtn = t.container.find('.document-audio-button').hide();
	
	// only support native MP3
	var audio = document.createElement('audio');
	if (audio.canPlayType && (audio.canPlayType('audio/mp3') != '' || audio.canPlayType('audio/mpeg') != '')) {

		t.audioWindow = docs.createModal(t.id + '-audio', 'Audio');
		t.audioWindow.content.append('<audio id="' + t.id + '-audio-player" type="audio/mp3"></audio>');
		t.audioWindow.show();
		
		// create a media palyer
		$('#' + t.id + '-audio-player').mediaelementplayer({type: 'audio/mp3', audioWidth: '100%', success: function(media, node, player) { t.player = player; } });
	
		t.audioWindow.hide();
		t.audioBtn.on('click', function() {
			if (t.audioWindow.content.is(':visible')) {
				t.audioWindow.hide();
			} else {
				t.audioWindow.show();
				t.audioWindow.window.css({top: t.audioBtn.offset().top + 25, left: t.audioBtn.offset().left + 25 - t.audioWindow.window.width()});
				
				var
					reference = new bible.Reference(t.input.val()),
					sectionId = reference.toOsisChapter();
				
				if (sectionId != t.currentAudio) {
					
					var filename = t.audioData.name ? t.audioData.name(reference) : sectionId + '.mp3';
					
					t.player.pause();
					t.player.setSrc('content/audio/' + t.selector.val() + '/' + filename);
					t.player.load();
					
					reference.verse1 = 0;
					t.audioWindow.title.html(reference.toString());	
					
					t.currentAudio = sectionId;
				}
				
				
			}
		});
	} else {
		t.audioBtn.remove();
	}
	
	t.updateVersion(selectedDocumentId);
	
	// main content aresas
	t.content = t.container.find('.document-content');
	t.wrapper = t.container.find('.document-wrapper');
	
	t.footer = t.container.find('.document-footer');
	if (docs.Features.hasTouch) {
		t.footer.remove();
	}
	
	// footer resizing
	t.footerHandle = t.container.find('.document-footer-resize');
	
	
	var mouseIsDown = false;
	t.footerHandle.on('mousedown', function(e) {
		e.preventDefault();
		mouseIsDown = true;
		return false;
	});
	$(document).on('mouseup', function(e) {
		mouseIsDown = false;
	});
	$(document).on('mousemove', function(e) {
		if (mouseIsDown) {
			// do resize	
			var footerTop = t.footer.offset().top,
				footerHeight = t.footer.outerHeight(true),
				footerExtras = footerHeight -  t.footer.height(),
				mouseTop = e.clientY,
				newFooterActualHeight = footerTop + footerHeight - mouseTop,
				newFooterCssHeight = newFooterActualHeight -  footerExtras;
			
			// resize all
			$('.document-footer').css({height: newFooterCssHeight});
			$('.document-footer-resize').css({bottom: newFooterActualHeight});
			
			//t.footerHandle.css({bottom: newFooterActualHeight});
			//t.footer.css({height: newFooterCssHeight});
			t.manager.resizeDocuments();
		}
	});
	
	
	
	t.navigationWindow = $(
			'<div class="document-navigation-window">' +
			'</div>'
		).appendTo(document.body);
	t.navigator.setupNavigationList(t);	
	
	
	// setup events
	
	t.content.on('scroll', function(e) { t.handleScroll(e); });
	t.button.on('click', function(e) {
		t.navigateToUserInput();
	});
	t.input.on('keyup', function(e) {
		if (e.keyCode == 13) {
			t.navigateToUserInput();
			t.navigationWindow.hide();
		}
	}).on('click', function(e) {
		
		// show the navigation list
		t.navigator.showNavigationList(t);	
		
	}).on('blur', function(e) {
		//t.navigationWindow.hide();
	});
	t.searchBtn.on('click', function(e) {
		//console.log('search cicked');
		
		docs.Search.searchVersion.val( t.selector.val() );
		docs.Search.searchWindow.show();
		docs.Search.searchInput.focus();
	});
	t.closeBtn.on('click', function(e) {
		t.close();
	});	
	
	t.wrapper.on('mouseenter mouseover', function(e) {
		t.setFocus(true);
	});	
	t.container.on('mouseenter mouseover', function(e) {
		t.setFocus(true);
	});	
	t.selector.on('change', function(e) {
		t.wrapper.empty();
		// TODO Set version
		t.updateVersion(t.selector.val());
		
		t.navigateToUserInput();
	});
	
	// buttons
	t.infoBtn.on('click', function(e) {
		// load about page
		
		
		t.optionsWindow.hide();
		
		
		if (t.about.is(':visible')) {
			t.about.hide();
		} else {
			t.about
				.empty()
				.css('top', t.header.outerHeight(true))
				.css('left', 0)
				.width(t.content.width() - (t.about.outerWidth(true) - t.about.width()) )
				.height(t.content.height() - (t.about.outerHeight(true) - t.about.height()) )
				.show();
				
			$.ajax({
				url: 'content/bibles/' + t.selector.val() + '/about.html',
				dataType: 'html',
				success: function(html) {
					var doc = $(html),
						about = doc.find('.about');
					
					t.about
						.append(about);
				},
				error: function() {
					t.about.append('Error loading about.html');
				}
			});
			
		}
	});
	t.searchBtn.on('click', function(e) {
		// popup search
		
		
		
	});
	
	t.lockBtn.on('click', function(e) {
		var btn = $(this);
		
		if (btn.hasClass('state-locked')) {
			btn.removeClass('state-locked').addClass('state-unlocked');
		} else {
			btn.removeClass('state-unlocked').addClass('state-locked');
		}
		
		
		
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
		var t = this,
			availableHeight = t.container.parent().height(),
			containerMargin = t.container.outerHeight(true) - t.container.height(),
			contentMargin = t.content.outerHeight(true) - t.content.height(),
			headerHeight = t.header.outerHeight(true),
			footerHeight = t.footer.outerHeight(true);
			
		t.content.height( availableHeight - containerMargin -contentMargin - headerHeight - footerHeight );
		
		
		// position resizer
		t.footerHandle.css({
				bottom: (t.footer.outerHeight(true) - t.footerHandle.outerHeight(true))+ 'px',
				width: t.footer.outerWidth(true) + 'px'
		});
		
		// TODO save scroll
	},
	
	switchingOver: false,
	
	updateVersion: function(version) {
		var t = this,
			versionInfo = bible.versions.versionsByKey[version];
		
		t.container.find('.document-header-selector span').html(versionInfo.abbreviation);		
		
		t.audioBtn.hide();
		
		// find audio
		$.ajax({
			url:'content/audio/' + version + '/version.json',
			success: function(data) {
				
				var audioJson = eval('(' + data + ')');
				
				//console.log('audio data', audioJson);
				t.audioData = audioJson;
				t.audioBtn.show();
			}
		})
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
			error: function() {
				console.log('failed', url);
				
				if (!t.switchingOver) {
					t.switchingOver = true;
					
					var currentVersion = t.selector.val(),
						switchToVersion = '';
					
					if (currentVersion === 'el_tisch') {
						switchToVersion = 'he_wlc';
					} else if (currentVersion === 'he_wlc') {
						switchToVersion = 'el_tisch';
					}
					
					if (switchToVersion != '') {
						//console.log('switch to ', switchToVersion);
						
						t.selector.find('option').each(function(index, opt) {
							
							if ($(opt).attr('value') === switchToVersion) {
								t.selector[0].selectedIndex = index;
							}
							
						});
						
						var versionInfo = bible.versions.versionsByKey[switchToVersion];
						t.container.find('.document-header-selector span').html(versionInfo.abbreviation);	
						
						//t.selector[0].selectedIndex = 0;
						//t.selector.val('he_wlc');
						t.load(fragmentId, action);
					}
						
				}
				
		
				
			},
			success: function(data) {
				
				if (t.switchingOver == true)
					t.switchingOver = false;
				
				var newSectionNode = $(data).find(t.navigator.sectionSelector),
					newSectionId = newSectionNode.attr(t.navigator.sectionIdAttr);
					
				
				
				// Check if the content is already here!
				//if (t.wrapper.find( t.navigator.sectionSelector + '[' + t.navigator.sectionIdAttr + '="' + newSectionId + '"]').length > 0) {
				if (t.wrapper.find( 'div.' + newSectionId.replace(/\./gi,'_') + '').length > 0) {
					console.log(newSectionId, 'already there');
					return;
				}
				
				switch (action) {
					default:
					case 'text':
						
						t.ignoreScrollEvent = true;
						
						t.wrapper.empty();
						t.wrapper.append(newSectionNode);
						t.content.scrollTop(0);	
						
						// TODO: scroll to individual verse (not just the chapter)
						//console.log( t.id, fragmentId, newSectionNode.attr('data-osis') );	
						
						//if (fragmentId.substring(7,10) != '001') {
							//t.scrollToFragmentNode(t.wrapper.find('span.verse[data-osis=' + fragmentId + ']'), 0);
							var targetFragment = t.wrapper.find('span.' + fragmentId.replace(/\./gi,'_') + '');
							if (targetFragment.length > 0) {
								t.scrollToFragmentNode(targetFragment, 0);
							} else {
								console.log('error finding: ' + fragmentId);
							}
						//} else {
						//	t.content.scrollTop(0);
						//}
						
						// now maunally check scroll
						t.checkScrollPosition();
					
						t.ignoreScrollEvent = false;
					
						break;
					case 'next':
							
						// simply append the node
						t.wrapper.append(newSectionNode);
						
						t.checkScrollPosition();
						
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
						
						t.checkScrollPosition();
						
						break;			
				}
				
				// LIMIT
				t.ignoreScrollEvent = true;
				
				var sections = t.wrapper.find( t.navigator.sectionSelector );
				
				if (sections.length > 7) {
				
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
					
					console.log(t.id,'reducing', mostVisibleIndex, t.content.scrollTop(), t.content.height());
				
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
				t.updateNavigationInput(false);
				
				// fire up the chain
				t.manager.dispatchEvent('load', {chapter: newSectionNode});
			}
		})
	},
	
	checkScrollPosition: function() {
		
		//console.log(this.id, 'checkScrollPosition');
		
		// measure sections
		var t = this,
			sections = t.wrapper.find( t.navigator.sectionSelector ),
			totalHeight = 0;
		
		sections.each(function(e) {
			totalHeight += $(this).height();
		});

		// measure top and bottom height
		var paneHeight = t.content.height(),
			distFromTop = t.content.scrollTop(),
			distFromBottom = totalHeight - paneHeight - distFromTop,
			fragmentId;
			
		if (t.id === 'doc-0') {
			console.log(t.id, totalHeight, distFromTop, distFromBottom, sections.length, (distFromTop < 250 ), (distFromBottom < 250));
		}
		
		//if ( sections.length <= 5 ) {
			// check if we need to load the prev or next one
			if (distFromTop < 250) {
				console.log(t.id, 'load prev');
	
				fragmentId = sections
								.first() // the first chapter (top)
								.find( t.navigator.fragmentSelector + ':first') // first fragments
								.attr( t.navigator.fragmentIdAttr );
	
				t.load(fragmentId, 'prev');
	
			} else if (distFromBottom < 250) {
				
				console.log(t.id, 'load next');
	
				fragmentId = sections
								.last() // the last chapter (bottom)
								.find( t.navigator.fragmentSelector + ':first') // first fragments
								.attr( t.navigator.fragmentIdAttr );
									
				t.load(fragmentId, 'next');
			}
		//}
	},
	
	scrollTimeout1: null,
	scrollTimeout2: null,
	
	handleScroll: function(e) {
		var t = this;
		
		//console.log(t.id, 'handleScroll', t.ignoreScrollEvent);
		
		// update the navigation window
		var syncPanes = !t.ignoreScrollEvent,
			checkScroll = !t.ignoreScrollEvent;
		
		t.updateNavigationInput(syncPanes);
		
		if (!checkScroll) {
			return;
		}
		
		/*
		// send out sync events
		var slowDownSyncing = false;	
		if (slowDownSyncing) {
			
			//t.updateNavigationInput(false);
		
			if (t.scrollTimeout2 == null) {
				
				t.scrollTimeout2 = setTimeout(function() {
					t.updateNavigationInput(true);
					t.scrollTimeout2 = null;
				}, 50);			
			}
		} else {
			t.updateNavigationInput(true);
		}
		*/
		
		
		// #1: Fire all the time when scrolling
		//t.checkScrollPosition();
		//return;
		
		
		// #2: Only fire after user is done scrolling 
		/*
		if (t.scrollTimeout1 != null) {
			clearTimeout(t.scrollTimeout1);
			t.scrollTimeout1 = null;
		}
		t.scrollTimeout1 = setTimeout(function() {
			t.checkScrollPosition(e);
		}, 100);
		*/
		
		
		// #3: Fire every so often
		if (t.scrollTimeout1 == null) {
			
			t.scrollTimeout1 = setTimeout(function() {
				t.checkScrollPosition();
				clearTimeout(t.scrollTimeout1);
				t.scrollTimeout1 = null;				
			}, 50);				
			
		}
	
		
	},
	
	setDocumentId: function(documentId) {
		this.selector.val(documentId);
	},
	
	navigateToUserInput: function() {
		var t = this;
		
		t.navigateByString( t.input.val(), true );
		
		t.updateNavigationInput(false);
	},
	
	navigateByString: function(someString, getFocus, offset) {
		
		// parse into fragmentId
		var t = this
			fragmentId = t.navigator.parseString(someString);
		
		//console.log(this.id, 'navigateByString', someString, fragmentId);
		
		// load if needed
		if (fragmentId != null) {
			t.navigateById(fragmentId, getFocus, offset);
		}
	},
	
	navigateById: function(fragmentId, getFocus, offset) {
		
		var fragmentNode = this.navigator.findFragment( fragmentId, this.content );
		
		if (typeof offset == 'undefined')
			offset = 0;
		if (typeof getFocus == 'undefined')
			getFocus = false;
		
		this.setFocus(getFocus);
		
		//console.log(this.id, 'navigateById', fragmentId, fragmentNode);
		
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
	
	
	
	updateNavigationInput: function(doSync) {
		
		var t = this,
			paneTop = this.content.offset().top,
			visibleFragmentInfo = null;
			
		doSync = doSync || false;
		
		//console.log(t.id, 'updateNavigationInput', doSync);
		
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
			
			t.fragmentId = visibleFragmentInfo.fragmentId;
			
			// turn the ID into a readable reference for the input
			var navigationInput = t.navigator.formatNavigation(visibleFragmentInfo.fragmentId, t.selector.find('option:selected').attr('data-language'));	
			t.input.val( navigationInput );
			
			// sync to other like panes
			//if (doSync && t.hasFocus && t.syncCheckbox.is(':checked')) {
			
			
			if (doSync && t.hasFocus && t.lockBtn.hasClass('state-locked')) {
				t.manager.sync(t, visibleFragmentInfo);
			}
			
			t.manager.dispatchEvent('navigation', {document: t});
		}
	},
	
	scrollToFragmentNode: function(node, offset) {
		
		// calculate node position
		var t = this,
			paneTop = t.content.offset().top,
			scrollTop = t.content.scrollTop(),
			nodeTop = node.offset().top,
			nodeTopAdjusted = nodeTop - paneTop + scrollTop;
			
		// go to it
		t.ignoreScrollEvent = true;
		t.content.scrollTop(nodeTopAdjusted + (offset || 0));
		t.ignoreScrollEvent = false;
	},
	
	close: function() {
		
		var t = this;
		
		t.container.remove();
		t.manager.remove(this);
		
	}
};
