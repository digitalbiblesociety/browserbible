	
/**
 * Finds verse references and highlights them
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		// insert style
		$('<style id="verse-popup-style">.tagged-reference { cursor: pointer; color: #779;  }</style>').appendTo($(document.body));
		
		// create popup
		var versePopup = docs.createModal('Verses', 'Verses');
		versePopup.content.css({'max-height': '150px', 'overflow': 'auto'});
		
		// setup events to add media icons
		docManager.addEventListener('load', function(e) {				
			findVerses(e.chapter);
		});
		
		function findVerses(chapter) {
			
			bibly.handleLinks = function(node, reference) {
				
				//node.style.fontWeight = 'bold';
				//node.style.color = '#0ff';
				node.className = 'tagged-reference';
				
				$(node).on('mouseover', function() {
					
					// measure position
					var
						node = $(this),
						nodePos = node.offset(),
						nodeWidth = node.width(),
						nodeHeight = node.height(),
						popupWidth = versePopup.window.outerWidth(true),
						popupHeight = versePopup.window.outerHeight(true),
						windowWidth = $(window).width(),
						windowHeight = $(window).height(),
						// default to below and to the right
						top = (nodePos.top + nodeHeight + nodeHeight > windowHeight) ? nodePos.top - popupHeight - 5 : nodePos.top + nodeHeight + 4,
						left = (nodePos.left + popupWidth > windowWidth) ? windowWidth - popupWidth : nodePos.left;			
					
					
					versePopup.title.html(reference.toString());
					versePopup.show();
					versePopup.window.css({top: top, left: left});					
					
					var chapterUrl = 'content/bibles/' + docManager.documents[0].selector.val() + '/' + reference.osisBookID + '.' + reference.chapter1 + '.html';
					
					versePopup.content.html('Loading...');
					
					// TODO: get verse text!
					$.ajax({
						url: chapterUrl,
						dataType: 'html',
						success: function(data) {
							var verseClasses = [],
								startVerse = reference.verse1 > 0 ? reference.verse1 : 1,
								endVerse = reference.verse2 > 0 ? Math.min(reference.verse1+3,reference.verse2) : reference.verse1;
							
							for (var i=startVerse; i<=endVerse; i++) {
								verseClasses.push('.' + reference.osisBookID + '_' + reference.chapter1 + '_' + i);
							}
							
							versePopup.content.empty();
							
							var verses = $(data).find( verseClasses.join(',') )
											.find('span.note, span.cf')
											.remove()
											.end();
							
							verses.appendTo(versePopup.content);
							
						}, error: function() {
							
							console.log('error', chapterUrl);
						}
					});
					
					
				}).on('mouseout', function() {
					
					versePopup.hide();
					
				}).on('click', function() {
					
					var firstDoc = docManager.documents[0];
					
					firstDoc.input.val( reference.toString() );
					firstDoc.navigateToUserInput();
				});
				
				
			}
			
			//console.log('scan', chapter[0]);
			
			bibly.scanForReferences(chapter[0]);
			
		}
	}
});


bible.genNames = function() {
	var names = [],
		i = 0,
		il = bible.DEFAULT_BIBLE.length;
	for (; i<il; i++) {
		
		var osisName = bible.DEFAULT_BIBLE[i];
		
		names.push( bible.BOOK_DATA[osisName].names['eng'].join('|') );
	}
	
	return names.join('|');
};


// adapted from old scripturizer.js code

(function() {
	
	/* Scripture API methods */
	var
		callbackIndex = 100000,
		jsonpCache = {},
		jsonp = function(url, callback){  
		
			var jsonpName = 'callback' + (callbackIndex++),
				script = doc.createElement("script"); 
		
			win[jsonpName] = function(d) {
				callback(d);
			}
			jsonpCache[url] = jsonpName;
		
			url += (url.indexOf("?") > -1 ? '&' : '?') + 'callback=' + jsonpName;			  
			//url += '&' + new Date().getTime().toString(); // prevent caching        
						
			script.setAttribute("src",url);
			script.setAttribute("type","text/javascript");                
			body.appendChild(script);
			
		},
		getBibleText = function(refString, callback) {
			var v = getPopupVersion(),
				max = bibly.maxVerses,
				reference = new bible.Reference(refString);
				
			// check that it's only 4 verses
			if (reference.verse1 > 0 && reference.verse2 > 0 && reference.verse2 - reference.verse1 > (max-1)) {
				reference.verse2 = reference.verse1 + (max-1);
			} else if (reference.verse1 <= 0 && reference.verse2 <= 0) {
				reference.verse1 = 1;
				reference.verse2 = max;
				reference.chapter2 = -1;
			}
					
			switch (v) {
				default:
				case 'NET':
					jsonp('http://labs.bible.org/api/?passage=' + encodeURIComponent(reference.toString()) + '&type=json', callback);
					break;
				case 'KJV':
				case 'LEB':
					jsonp('http://api.biblia.com/v1/bible/content/' + v + '.html.json?style=oneVersePerLine&key=' + bibly.bibliaApiKey + '&passage=' + encodeURIComponent(reference.toString()), callback);
					break;
				case 'ESV':
					jsonp('http://www.esvapi.org/crossref/ref.php?reference=' + encodeURIComponent(reference.toString()), callback);
					break;					
			} 
		},		
		handleBibleText = function(d) {
			var 
				v = getPopupVersion(),
				p = bibly.popup,
				max = bibly.maxVerses,
				text = '',
				className = v + '-version',
				i,il;
				
			switch (v) {
				default:
				case 'NET':
					for (i=0,il=d.length; i<il && i<max; i++) {
						text += '<span class="bibly_verse_number">' + d[i].verse + '</span>' + d[i].text + ' ';
					}
					break;
				case 'KJV':
				case 'LEB':
					className += ' biblia';
					text = d.text;
					break;
				case 'ESV':
					text = d.content;
					break;					
			}
			
			p.content.innerHTML = '<div class="' + className + '">' + text + '</div>';
		};
		
	/* handler for when a verse node is found */
	var
		createBiblyLinks = function(newNode, reference) {
				newNode.setAttribute('href', reference.toShortUrl() + (bibly.linkVersion != '' ? '.' + bibly.linkVersion : ''));
				newNode.setAttribute('title', 'Read ' + reference.toString());
				newNode.setAttribute('rel', reference.toString());
				newNode.setAttribute('class', bibly.className);
				if (bibly.newWindow) {
					newNode.setAttribute('target', '_blank')
				}
				
				if (bibly.enablePopups) {
					addEvent(newNode,'mouseover', handleLinkMouseOver);
					addEvent(newNode,'mouseout', handleLinkMouseOut);
				}		
		
		},

		checkPosTimeout,
		handleLinkMouseOver = function(e) {
			if (!e) e = win.event;
			
			clearPositionTimer();
						
			var target = (e.target) ? e.target : e.srcElement,
				p = bibly.popup,
				pos = getPosition(target),
				x = y = 0,
				v = getPopupVersion();
				referenceText = target.getAttribute('rel'),
				viewport = getWindowSize(),
				scrollPos = getScroll();
			
			p.outer.style.display = 'block';
			p.header.innerHTML = referenceText + ' (' + v + ')';
			p.content.innerHTML = 'Loading...<br/><br/><br/>';
			p.footer.innerHTML = getFooter(v);
			
			
			function positionPopup() {
				x = pos.left - (p.outer.offsetWidth/2) + (target.offsetWidth/2);
				y = pos.top - p.outer.clientHeight; // for the arrow
				
				if (x < 0) {
					x = 0;
				} else if (x + p.outer.clientWidth > viewport.width) {
					x = viewport.width - p.outer.clientWidth - 20;
				}
				
				if (y < 0 || (y < scrollPos.y) ){ // above the screen
					y = pos.top + target.offsetHeight + 10;
					p.arrowtop.style.display = 'block';
					p.arrowtop_border.style.display = 'block';
					p.arrowbot.style.display = 'none';
					p.arrowbot_border.style.display = 'none';					
					
				} else {
					y = y-10; 
					p.arrowtop.style.display = 'none';
					p.arrowtop_border.style.display = 'none';
					p.arrowbot.style.display = 'block';
					p.arrowbot_border.style.display = 'block';					
				}
				
				p.outer.style.top = y + 'px';
				p.outer.style.left = x + 'px';				
			}
			positionPopup();
			
			
			getBibleText(referenceText, function(d) {
				// handle the various JSON outputs
				handleBibleText(d);
				
				// reposition the popup
				//y = pos.top - p.outer.clientHeight - 10; // border
				//p.outer.style.top = y + 'px';
				positionPopup();
			});			
		},
		handleLinkMouseOut = function(e) {
			startPositionTimer();
		},
		
		handlePopupMouseOver = function(e) {	
			clearPositionTimer();
		},
		handlePopupMouseOut = function(e) {
			startPositionTimer();
		},
		
		/* Timer on/off */
		startPositionTimer = function () {
			checkPosTimeout = setTimeout(hidePopup, 500);
		},
		clearPositionTimer = function() {
			clearTimeout(checkPosTimeout);
			delete checkPosTimeout;
		},
		hidePopup = function() {
			var p = bibly.popup;
			p.outer.style.display = 'none';	
		},
		
		getPosition = function(node) {		
			var curleft = curtop = curtopscroll = curleftscroll = 0;
			if (node.offsetParent) {
				do {
					curleft += node.offsetLeft;
					curtop += node.offsetTop;				
					curleftscroll += node.offsetParent ? node.offsetParent.scrollLeft : 0;
					curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
				} while (node = node.offsetParent);
			}
			
			return {left:curleft,top:curtop,leftScroll:curleftscroll,topScroll:curtopscroll};
		},
		getWindowSize= function() {
			var width = 0, 
				height = 0;
			if( typeof( win.innerWidth ) == 'number' ) {
				// Non-IE
				width = win.innerWidth;
				height = win.innerHeight;
			} else if( doc.documentElement && ( doc.documentElement.clientWidth || doc.documentElement.clientHeight ) ) {
				//IE 6+ in 'standards compliant mode'
				width = doc.documentElement.clientWidth;
				height = doc.documentElement.clientHeight;
			} else if( body && ( body.clientWidth || body.clientHeight ) ) {
				//IE 4 compatible
				width = body.clientWidth;
				height = body.clientHeight;
			}
			
			return {width:width, height: height};
		},
		getScroll = function () {
			var scrOfX = 0, 
				scrOfY = 0;
			if( body && ( body.scrollLeft || body.scrollTop ) ) {
				//DOM compliant
				scrOfY = body.scrollTop;
				scrOfX = body.scrollLeft;
			} else if( doc.documentElement && ( doc.documentElement.scrollLeft || doc.documentElement.scrollTop ) ) {
				//IE6 standards compliant mode
				scrOfY = doc.documentElement.scrollTop;
				scrOfX = doc.documentElement.scrollLeft;
			} else if( typeof( win.pageYOffset ) == 'number' ) {
				//Netscape compliant
				scrOfY = win.pageYOffset;
				scrOfX = win.pageXOffset;
			}
			
			return {x: scrOfX, y:scrOfY };
		};		
	
	
	/* core bibly functions */
	var bibly = {
			version: '0.9.2',
			maxNodes: 500,
			className: 'bibly_reference',
			enablePopups: true,
			popupVersion: 'ESV',
			linkVersion: '',
			bibliaApiKey: '436e02d01081d28a78a45d65f66f4416', 
			autoStart: true,
			startNodeId: '',
			maxVerses: 4,
			newWindow: false,
			ignoreClassName: 'bibly_ignore',
			ignoreTags: ['h1','h2','h3','h4'],
			newTagName: 'A',
			handleLinks: createBiblyLinks
		},	
		win = window,
		doc = document,
		body = null,		
		defaultPopupVersion = 'ESV',
		allowedPopupVersions = ['NET','ESV','KJV','LEB','DARBY'],
		bok = bible.genNames(),	
		
		
		
		// 1 OR 1:1 OR 1:1-2, 100, but not 1000
		ver = '(' 	+						// 
					'(1?\\d{1,2})' +		// 1				
					'([\.:]\\s?(\\d+))?' + 	// :2
				')' +	
				'(' + 						
					'\\s?[-Ð&]\\s?(\\d+)' +	// -3
					'([\.:]\\s?(\\d+))?' +  // :4
				')?',
		
		// NOT 1. Only 1:1 OR 1:1-2 
		ver2 = '(1?\\d{1,2})' 					// 1##
					+ '[\.:]\\s?(\\d+)'
					+ '(\\s?[-Ð&]\\s?(\\d+))?', // this is needed so verses after semi-colons require a :. Problem John 3:16; 2 Cor 3:3 <-- the 2 will be a verse)
			
		regexPattern = 	'\\b('+bok+')\.?\\s+' 	// book name with period and/or spaces afterward
						+ '(' + ver				// verse pattern (1 OR 1:1 OR 1:1-2)
							+ '('
							+ '(\\s?,(\\s+)?'+ver+')|' // , VERSE
							+ '(\\s?;(\\s+)?'+ver2+')' // ; CHAPTER:Verse
							+ ')*'					// infinite reoccurance
						+ ')\\b',
		
		referenceRegex = new RegExp(regexPattern, 'mi'),
		verseRegex = new RegExp(ver, 'mi'),
		alwaysSkipTags = ['a','script','style','textarea'],
		lastReference = null,
		textHandler = function(node) {
			var match = referenceRegex.exec(node.data), 
				val, 
				referenceNode, 
				afterReferenceNode,
				newLink;
			
			// reset this
			lastReference = null;
			
			if (match) {
				val = match[0];
				// see https://developer.mozilla.org/en/DOM/text.splitText
				// split into three parts [node=before][referenceNode][afterReferenceNode]
				referenceNode = node.splitText(match.index);
				afterReferenceNode = referenceNode.splitText(val.length);
				
				// send the matched text down the 
				newLink = createLinksFromNode(node, referenceNode);
				
				return newLink;
			} else {
				return node;
			}
		},
		createLinksFromNode = function(node, referenceNode) {
			if (referenceNode.nodeValue == null)
				return referenceNode;
		
			// split up match by ; and , characters and make a unique link for each
			var 
				newLink,
				commaIndex = referenceNode.nodeValue.indexOf(','),
				semiColonIndex = referenceNode.nodeValue.indexOf(';'),
				separatorIndex = (commaIndex > 0 && semiColonIndex > 0) ? Math.min(commaIndex, semiColonIndex) : Math.max(commaIndex, semiColonIndex),
				separator,
				remainder,
				reference,
				startRemainder;
			
			// if there is a separator ,; then split up into three parts [node][separator][after]
			if (separatorIndex > 0) {
				separator = referenceNode.splitText(separatorIndex);
				
				startRemainder = 1;
				while(startRemainder < separator.nodeValue.length && separator.nodeValue.substring(startRemainder,startRemainder+1) == ' ')
					startRemainder++;
				
				remainder = separator.splitText(startRemainder);
			}	
			
			// test if the text matches a real reference
			refText = referenceNode.nodeValue;	
			reference = parseRefText(refText);
			if (typeof reference != 'undefined' && reference.isValid()) {
				
				// replace the referenceNode TEXT with an anchor node to bib.ly
				newNode = node.ownerDocument.createElement(bibly.newTagName);				
				node.parentNode.replaceChild(newNode, referenceNode);	
				
				// this can be overridden for other systems
				bibly.handleLinks(newNode, reference);
				
				newNode.appendChild(referenceNode);
				
				// if there was a separator, now parse the stuff after it
				if (remainder) {				
					newNode = createLinksFromNode(node, remainder);				
				}
				
				return newNode;
			} else {
				// for false matches, return it unchanged
				return referenceNode;
			}
		},
		parseRefText = function(refText) {
			
			var 
				text = refText,
				reference = new bible.Reference(text),
				match = null,
				p1, p2, p3, p4;
			
			if (reference != null && typeof reference.isValid != 'undefined' && reference.isValid()) {
				
				lastReference = reference;
				return reference;
				
			} else if (lastReference  != null) {
				
				// single verse match (3)
				match = verseRegex.exec(refText);				
				if (match) {				
			
// "1"			["1", 		"1", 	"1", u, 	u, 		u, 		u, 		u, u]
// "1:2"		["1:2", 	"1:2", 	"1", ":2", 	"2", 	u, 		u, 		u, u]
// "1-2"		["1-2", 	"1", 	"1", u, 	u, 		"-2", 	"2", 	u, u]
// "1:2-3"		["1:2-3", 	"1:2", 	"1", ":2", 	"2", 	"-3", 	"3", 	u, u]
// "1:2-3:4"	["1:2-3:4", "1:2", 	"1", ":2", 	"2", 	"-3:4", "3", 	":4", "4"]					
					
					p1 = parseInt(match[2],10);
					p2 = parseInt(match[4],10);
					p3 = parseInt(match[6],10);
					p4 = parseInt(match[8],10);
					
					if (isNaN(p2)) {
						p2 = 0;
					}
					if (isNaN(p3)) {
						p3 = 0;
					}
					if (isNaN(p4)) {
						p4 = 0;
					}
					
					// single verse (1)
					if (p1 > 0 && p2 == 0 && p3 == 0 && p4 == 0) {
											
						lastReference.verse1 = p1;
						lastReference.chapter2 = -1;
						lastReference.verse2 = -1;
					
					// 1:2
					} else if (p1 > 0 && p2 > 0 && p3 == 0 && p4 == 0) {
						
						lastReference.chapter1 = p1;
						lastReference.verse1 = p2;
						lastReference.chapter2 = -1;
						lastReference.verse2 = -1;	
						
					// 1-2
					} else if (p1 > 0 && p2 == 0 && p3 > 0 && p4 == 0) {
						
						lastReference.verse1 = p1;
						lastReference.chapter2 = -1;
						lastReference.verse2 = p3;							
					
					// 1:2-3
					} else if (p1 > 0 && p2 > 0 && p3 > 0 && p4 == 0) {
						
						lastReference.chapter1 = p1;
						lastReference.verse1 = p2;
						lastReference.chapter2 = -1;
						lastReference.verse2 = p3;		
					
	
					// 1:2-3:4
					} else if (p1 > 0 && p2 > 0 && p3 > 0 && p4 > 0) {
						
						lastReference.chapter1 = p1;
						lastReference.verse1 = p2;
						lastReference.chapter2 = p3;
						lastReference.verse2 = p4;
					}
					
					
					return lastReference;
				}
			
				// failure
				return {
					refText: refText,
					toShortUrl: function() {
						return 'http://bib.ly/' + refText.replace(/\s/ig,'').replace(/:/ig,'.').replace(/Ð/ig,'-');
					},
					toString: function() {
						return refText  + " = Can't parse it";
					}
				};				
			} else {
				return undefined;
			}
		},

		getFooter = function(version) {
			switch (version) {
				case 'NET':
					return '<a href="http://bible.org/">NET Bible¨ copyright ©1996-2006 by Biblical Studies Press, LLC</a>';
				case 'ESV':
					return 'English Standard Version. Copyright &copy;2001 by <a href="http://www.crosswaybibles.org">Crossway Bibles</a>';
				case 'LEB':					
				case 'KJV':
					return version + ' powered by <a href="http://biblia.com/">Biblia</a> web services from <a href="http://www.logos.com/">Logos Bible Software</a>';
				default:
					return '';
			}
		},
		
		getPopupVersion = function() {
			var v = bibly.popupVersion.toUpperCase(), 
				indexOf=-1, 
				i=0, 
				il=allowedPopupVersions.length;
			
			// old IEs don't have Array.indexOf
			for (; i < il; i++) {
				if (allowedPopupVersions[i].toUpperCase() === v) {
					indexOf = i;
					break;
				}
			}

			return (indexOf > -1) ? v : defaultPopupVersion;
		},

		scanForReferences = function(node) {				
			// build doc
			traverseDOM(node.childNodes[0], 1, textHandler);		
		},
		traverseDOM = function(node, depth, textHandler) {
			var count = 0,
				//skipRegex = /^(a|script|style|textarea)$/i,
				skipRegex = new RegExp('^(' + alwaysSkipTags.concat(bibly.ignoreTags).join('|') + ')$', 'i');
				
				
			while (node && depth > 0) {
				count++;
				if (count >= bibly.maxNodes) {
					setTimeout(function() { traverseDOM(node, depth, textHandler); }, 50);
					return;
				}

				switch (node.nodeType) {
					case 1: // ELEMENT_NODE
						if (!skipRegex.test(node.tagName.toLowerCase()) && node.childNodes.length > 0 && (bibly.ignoreClassName == '' || node.className.toString().indexOf(bibly.ignoreClassName) == -1)) {											
							node = node.childNodes[0];
							depth ++;
							continue;
						}
						break;
					case 3: // TEXT_NODE
					case 4: // CDATA_SECTION_NODE
						node = textHandler(node);
						break;
				}

				if (node.nextSibling) {
					node = node.nextSibling;
				} else {
					while (depth > 0) {
						node = node.parentNode;
						depth --;
						if (node.nextSibling) {
							node = node.nextSibling;
							break;
						}
					}
				}
			}
		},
		addEvent = function(obj,name,fxn) {
			if (obj.attachEvent) {
				obj.attachEvent('on' + name, fxn);
			} else if (obj.addEventListener) {
				obj.addEventListener(name, fxn, false);
			} else {
				var __ = obj['on' + name];
				obj['on' + name] = function() {
				   fxn();
					__();
				};
			}			
		},		
		isStarted = false,
		extend = function() {
			// borrowed from ender
			var options, name, src, copy, 
				target = arguments[0] || {},
				i = 1,
				length = arguments.length;	

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && typeof target !== "function" ) {
				target = {};
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) != null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;				
		},
		startBibly = function() {
			
			if (isStarted)
				return;				
			isStarted = true;
			
			doc = document;
			body = doc.body;
			
			// create popup
			var p = bibly.popup = {
					outer: doc.createElement('div')
				}, 
				parts = ['header','content','footer','arrowtop_border','arrowtop','arrowbot_border','arrowbot'],
				i,
				il,
				div,
				name,
				node = null;
				
			p.outer.className = 'bibly_popup_outer';
			// build all the parts	
			for (i=0,il=parts.length; i<il; i++) {
				name = parts[i];
				div = doc.createElement('div');
				div.className = 'bibly_popup_' + name;
				p.outer.appendChild(div);
				p[name] = div;
			}
			
			body.appendChild(p.outer);	
			
			addEvent(p.outer,'mouseover',handlePopupMouseOver);
			addEvent(p.outer,'mouseout',handlePopupMouseOut);

			if (bibly.autoStart) {
				if (bibly.startNodeId != '') {
					node = doc.getElementById(bibly.startNodeId);
				}
				
				if (node == null) {
					node = body;
				}
				
				scanForReferences(node);
			}
		};

	// super cheater version of DOMoade
	// do whatever happens first
	addEvent(doc,'DOMContentLoaded',startBibly);
	addEvent(win,'load',startBibly);	
	
	if (typeof window.bibly != 'undefined') 
		bibly = extend(bibly, window.bibly);
	
	// export
	bibly.startBibly = startBibly;
	bibly.scanForReferences = scanForReferences;
	win.bibly = bibly;	
})();