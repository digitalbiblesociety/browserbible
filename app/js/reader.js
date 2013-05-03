jQuery(function() {

var $win = $(window),
	$doc = $(document),
	$body = $(document.body),
	
	$header = $('#header'),
	$container = $('#container'),		
	$main = $('#main'),
	$content = $('#content'),
	$table = $content.find('tbody'),
		
				
	$version1 = $('#version1'),
	$version1Navigation = null,
	$version2 = $('#version2'),
	$version2Navigation = null,
	
	$reference = $('#reference'),
	$referenceNavigation = null,	

	$logo = $('#logo'),	
				
	isLoading = false,
	hasTouch = ('ontouchstart' in window),
	nav = navigator,
	ua = navigator.userAgent,
	autoLoad = true // !(ua.toLowerCase().indexOf('iphone') > -1 || ua.toLowerCase().indexOf('ipad') > -1)
	;


$win.on('scroll', scrollCheck);	
$win.on('touchend touchmove', scrollCheck);		

var scrollTimeout = null,
	ignoreScroll = false;
	
function scrollCheck() {

	//if (ignoreScroll)
	//	return;
	
	// #3: Fire every so often
	if (scrollTimeout == null) {
		
		scrollTimeout = setTimeout(function() {
			updateReference();
			
			if (autoLoad) {
				seeIfWeNeedToLoadMoreStuff();
				saveSettings();
			}
			
			clearTimeout(scrollTimeout);
			scrollTimeout = null;				
		}, 250);
	}		
}	

function updateReference() {
	var top = $win.scrollTop(),
		contentOffset = $content.offset(),
		pixel = top + $header.height() + 10; // parseInt($main.css('padding-top'), 10); // + contentOffset.top;
		
	$content.find('div.chapter').each(function(index, el) { 
		
		var c = $(this);
		if (c.offset().top + c.height() > pixel) {
			
			var chapterOsis = c.attr('data-osis'),
				osisParts = chapterOsis.split('.'), 
				bookOsis = osisParts[0],
				chapterNumber = osisParts[1],				
				book = bible.BOOK_DATA[bookOsis];
				
			setReference( chapterOsis );
			
			$reference.html( book.names['eng'][2] + ' ' + chapterNumber);
		
			return false;
		}
				
		return true; // keep looking
	});
}


function start() {

	// create buttons that aren't in the main HTML page
	createNavigation();	
	createOptions();
	createPrevNext();
	
	// load main settings
	var defaultSettings = { 
			version1: 'eng_kjv',
			version2: '',
			reference: 'John.1'
		},
		settings = $.jStorage.get('reader-settings', defaultSettings);		

	// use settings to update refeence
	setReference(settings.reference);	
		
	// detect versions via JSON
	bible.versions.getVersions(function(data) {
		
		var html = [];
	
		for (var langCode in bible.versions.versionData) {
			var language = bible.versions.versionData[langCode];
			
			
			html.push('<div class="navigation-row-header">' + language.languageName + '</div>');
			
			for (var versionKey in language.versions) {
			
				var version = language.versions[versionKey];
			
				html.push('<div class="navigation-row navigation-version" data-version="' + versionKey + '">' +
								'<span class="navigation-version-abbr">' + version.abbreviation + '</span>' +
								'<span class="navigation-version-name">' + version.name + '</span>' +
							'</div>'
				);
			}

		}
		
		var listHtml = html.join('');
		
		createVersionList($version1, $version1Navigation, listHtml, settings.version1);
		createVersionList($version2, $version2Navigation, listHtml, settings.version2);
		
		//$version1Navigation = $( html ).appendTo($body);
		//$version2Navigation = $( html ).appendTo($body);

		
		// defaults
		setVersion($version1, settings.version1);
		setVersion($version2, settings.version2);		
		//$version1.val(settings.version1);
		//$version2.val(settings.version2);	
		
		
		
		if ($version2.val() != '') {
			$content.addClass('two-columns');
		}				
		
		navigate();
	});
	
	// enable plugins
	for (var p in docs.plugins) {
		docs.plugins[p].init({content:$content});
	}

}

function createVersionList(versionDisplay, versionNavigation, listHtml, initialVersion) {
	
	// create the navigation
	var html = '<div class="reader-navigation reader-version-navigation">' + 
					'<div class="reader-navigation-header">Version' + 
						(versionDisplay.attr('id') == 'version2' ? '<span class="reader-version-remove">Remove</span>' : '') + 
					'</div>' + 
					'<div class="reader-version-list">' + 
						listHtml +
					'</div>' +
				'</div>';

	versionNavigation = $( html ).appendTo($body).hide();
	

	// connect the objects
	versionNavigation.display = versionDisplay;
	versionDisplay.navigation = versionNavigation;		
		
	// handle clicks
	versionNavigation.on('click', '.navigation-version', function() {
		
		var el = $(this),
			versionKey = el.attr('data-version');
			
		el.addClass('selected').siblings().removeClass('selected');
	
		versionDisplay.val(versionKey);
		versionDisplay.html( el.find('.navigation-version-abbr').html() );
		
		if (versionDisplay.attr('id') == 'version1') {
			changeVersion();
		} else { 
			toggleParallel();
		}
		
		versionNavigation.hide();	
	});
	
	versionDisplay.on('click', function() {
		
		if (versionNavigation.is(':visible')) {
			versionNavigation.hide();
		} else {
			versionNavigation.show();		
		}
		
	});
	
	versionNavigation.on('click', '.reader-version-remove', function() {
		
		versionDisplay.val('');
		versionDisplay.html('None');		
		versionNavigation.hide();
		
		toggleParallel();		

	});
	
}

function setVersion(versionDisplay, versionKey) {

	
	// find the version and make it selected
	var el = versionDisplay.navigation.find('.navigation-version[data-version="' + versionKey + '"]');	
	
	if (el.length == 0) {
		versionDisplay.html('None');
		versionDisplay.val('');		
		return;	
	}
	
	el.addClass('selected').siblings().removeClass('selected');
	
	// store the version as a value and show the abbrevation to the user
	versionDisplay.val(versionKey);
	versionDisplay.html( el.find('.navigation-version-abbr').html() );
	
	// attempt to scroll to the version in the list
	// temporarily show the list so that we can accurately detect the school
	versionDisplay.navigation.show();
	
	var list = versionDisplay.navigation.find('.reader-version-list'),
		listTop = list.offset().top,
		versionTop = el.offset().top;
		
	list.scrollTop(versionTop - listTop);
	
	// now hide again 
	versionDisplay.navigation.hide();	
	
	
}


function createNavigation() {

	// NAV: Fancy
	$referenceNavigation = $(
			'<div class="reader-navigation reader-bible-navigation">' + 
				'<div class="reader-navigation-column book-list">' + 
					'<div class="reader-navigation-header">Books</div>' + 
					'<div class="reader-navigation-list">' + 
					'</div>' + 
				'</div>' +
				'<div class="reader-navigation-column chapter-list">' + 
					'<div class="reader-navigation-header">Chapters</div>' + 
					'<div class="reader-navigation-list">' + 
					'</div>' + 
				'</div>' + 
			'</div>'
		)
		.hide()
		.appendTo($(document.body));
		
	// fill with English for now
	var html = [];
	for (var i=0, il=bible.DEFAULT_BIBLE.length; i<il; i++) {

		var osis = bible.DEFAULT_BIBLE[i],
			book = bible.BOOK_DATA[osis];

		html.push('<span class="navigation-row navigation-book" data-osis="' + osis + '" data-chapters="' + book.chapters.length + '">' + book.names['eng'][0] + '</span>');
	}
	$referenceNavigation.find('.book-list .reader-navigation-list').html( html.join('') );	
	
	
	// BOOK CLICK
	$referenceNavigation.find('.book-list .navigation-book').on('click', function(e) {
		
		var el = $(this),
			osis = el.data('osis'),
			chapters = parseInt(el.data('chapters'), 10),
			html = [];
			
		console.log('book click', el, osis, e.pointer);	
			
		// create chapter buttons
		for (var i= 0; i<chapters; i++) {
			html.push('<span class="navigation-block navigation-chapter" data-chapter="' + (i+1) + '">' + (i+1) + '</span>');
		}
		
		$referenceNavigation.find('.chapter-list .reader-navigation-list').html( html.join('') );
		
		el.addClass('selected').siblings().removeClass('selected');	
	});
	
	// CHAPTER CLICK
	$referenceNavigation.find('.chapter-list').on('click', '.navigation-chapter', function() {
		
		var el = $(this),
			osis = $referenceNavigation.find('.book-list .selected').attr('data-osis'),
			chapter = el.html(),
			html = [];
			
		console.log('chapter click', osis, chapter);			
			
		load(osis + '.' + chapter, 'text');	
	
		$referenceNavigation.hide();
	});	
	
	
	$reference.on('click', function() {
		if ($referenceNavigation.is(':visible')) {
			$referenceNavigation.hide();
		} else {
			$referenceNavigation.show();		
		}
	
	});
	
	
}

function setReference(chapterOsis) {
	
	$reference.val( chapterOsis );
	
	var isVisible = $referenceNavigation.is(':visible');
	
	if (!isVisible) {
		$referenceNavigation.show();
	}
	
	var osisParts = chapterOsis.split('.'),
		bookOsis = osisParts[0],
		chpaterNumber = osisParts[1],
		bookList = $referenceNavigation.find('.book-list .reader-navigation-list'),
		bookListTop = bookList.offset().top,
		bookListScroll = bookList.scrollTop(),
		selectedBook = bookList.find('span[data-osis="' + bookOsis + '"]'), // .click(),
		selectedBookTop = selectedBook.offset().top;

	// only do a selection when it's hidden
	if (!isVisible) {
		selectedBook.click();
		bookList.scrollTop(selectedBookTop - bookListTop - 5);
	}

	if (!isVisible) {
		$referenceNavigation.hide();
	}
	
	$referenceNavigation.find('.chapter-list span[data-chapter="' + chpaterNumber + '"]').addClass('selected');
}

function createPrevNext() {
	
	var prevButton = $('<div class="reader-prev load-button">&#8639; Load Previous &#8638; </div>').prependTo($content),
		nextButton = $('<div class="reader-next load-button">&#8643; Load Next &#8642;</div>').appendTo($content);	
	
		
	prevButton.on('click', loadPrev);
	nextButton.on('click', loadNext);	
	
	if (autoLoad) {
		prevButton.hide();
		nextButton.hide();		
	}
}

function createOptions() {
	var optionsWindow = $(
			'<div class="reader-window" id="options-window">' + 
				'<div class="reader-window-header">' + 
					'Settings' + 
				'</div>' + 
				'<div class="reader-window-body">' + 
				
					'<h4>Options</h4>' + 
					'<label><input type="checkbox" id="option-autoload"' + (autoLoad ? ' checked' : '') + '>Auto Load</option></label>' +
					//'<a href="javascript:window.location.reload();">Reload()</a>' +
			
					'<h4>Show</h4>' + 
					'<label><input type="checkbox" class="option-showhide" id="option-showchapters" checked>Chapters</option></label>' +
					'<label><input type="checkbox" class="option-showhide" id="option-showverses" checked>Verses</option></label>' +
					'<label><input type="checkbox" class="option-showhide" id="option-showtitles" checked>Titles</option></label>' +
					'<label><input type="checkbox" class="option-showhide" id="option-shownotes" >Notes</option></label>' +				
					
				'</div>' +
			'</div>'				
		)
		.hide()
		.appendTo( 	$(document.body) );
		
	// SHOW/HIDE
	$logo.on('click', function() {
		if (optionsWindow.is(':visible')) {
			optionsWindow.hide();
		} else {
			optionsWindow.show();
		}
	});
	
	$content.on('click', function() {
		optionsWindow.hide();
	});
	
	
	// AUTO LOAD
	optionsWindow.find('#option-autoload').on('click', function() {
		
		autoLoad = $(this).is(':checked');
		
		if (autoLoad) {
			$('.load-button').hide();
		} else {
			$('.load-button').show();
		} 
	});
	
	
	// AUTO LOAD
	optionsWindow.find('#option-autoload').on('click', function() {
		
		autoLoad = $(this).is(':checked');
		
		if (autoLoad) {
			$('.load-button').hide();
		} else {
			$('.load-button').show();
		} 
	});	
	
	$('.option-showhide').on('click', function() {
		
		var checkbox = $(this),
			id = checkbox.attr('id'),
			className = id.split('-')[1].replace('show','hide-');
			
		if (checkbox.is(':checked')) {
			$table.removeClass(className);
		} else {
			$table.addClass(className);		
		}
	
	});
	
	
	// load default
	$table.addClass('hide-notes');
}

function saveSettings() {
	$.jStorage.set('reader-settings', { 
		version1: $version1.val(),
		version2: $version2.val(),
		reference: $reference.val()	
	});
}


$reference.on('change', navigate);
$version1.on('change', changeVersion)
$version2.on('change', toggleParallel);


function loadPrev() {
	var reference = new bible.Reference( $reference.val() );

	if (reference.isFirstChapter()) {
		return;
	}
	
	var prevReference = reference.prevChapter();
	
	load(prevReference.toOsisChapter(), 'text');
}

function loadNext() {
	var reference = new bible.Reference( $reference.val() );

	if (reference.isLastChapter()) {
		return;
	}
	
	var nextReference = reference.nextChapter();
	
	load(nextReference.toOsisChapter(), 'text');
}

function navigate() {
	load( $reference.val(), 'text' );
	saveSettings();	
}

function changeVersion() {
	// console.log('change main version');
	load( $reference.val(), 'text' );	
	saveSettings();	
}

function load(osis, action) {
	
	var version = $version1.val(),
		targetOsis = osis,
		targetReference = new bible.Reference(targetOsis),
		url = 'content/bibles/' + version + '/';
			
	console.log(osis, action, isLoading);
	
	switch (action) {
		default:
		case 'text':
			$table.empty();
			break;
		case 'next':
			var reference = new bible.Reference(osis);
			if (reference.isLastChapter()) {
				return;
			}
			
			targetOsis = reference.nextChapter().toOsisChapter();
			targetReference = new bible.Reference(targetOsis); 
			
			$table.append($('<tr data-osis="' + targetOsis + '"><td><span class="reader-loading">Loading</span></td></tr>'));
			break;
		case 'prev':
			var reference = new bible.Reference(osis);
			if (reference.isFirstChapter()) {
				return;
			}
			
			targetOsis = reference.prevChapter().toOsisChapter();
			targetReference = new bible.Reference(targetOsis);			
			
			$table.prepend($('<tr data-osis="' + targetOsis + '"><td><span class="reader-loading">Loading</span></td></tr>'));
			
			break;
		
	}
	
	// check if this one exist
	if ($table.find('div.' + targetOsis.replace(/\./gi, '_') ).length > 0) {
		return;
	}
	isLoading = true;
	
	$.ajax({
		url: url + targetOsis + '.html',
		success: function(d) {
			
			var doc = $(d),
				chapter = doc.find('div.chapter');
				
			
			switch (action) {
				default:
				case 'text':
				
					$table.empty();
					
					chapter
						.appendTo($table)
						.wrap('<tr><td></td></tr>');
						
					$win.scrollTop(0);					
					
					// fall through to apppend
				case 'next':
				
					//chapter
					//	.appendTo($table)
					//	.wrap('<tr><td></td></tr>');
						
					$table.find('tr[data-osis="' + targetOsis + '"] td:first')
						.empty()
						.append(chapter);						
				
					break;
					
				case 'prev':
					
					//ignoreScroll = true;
					
					var scrollTop = $win.scrollTop(),
						firstTop = $table.find('tr').first().offset().top;
					
					// console.log('prev', scrollTop, firstTop);
					
					$table.find('tr[data-osis="' + targetOsis + '"] td:first')
						.empty()
						.append(chapter);
				
					//chapter
					//	.prependTo($table)
					//	.wrap('<tr><td></td></tr>');
						
					var chapterHeight = chapter.outerHeight(true);
						
					
					$win.scrollTop(scrollTop + chapterHeight + firstTop);
					//chapterRow.prependTo($table);
					
					//ignoreScroll = false;					
										
					break;
			}
			
			if (!autoLoad && new targetReference.isFirstChapter()) {
				$('#prev-button').hide();
			} else {
				$('#prev-button').show();
			}
			if (!autoLoad && new targetReference.isLastChapter()) {
				$('#next-button').hide();
			} else {
				$('#next-button').show();
			}			
			
			
			isLoading = false;			
			
			if ($version2.val() != '') {
				chapter.closest('td').after( $('<td />') );
			}
				
			//setTimeout(function() {
			if (autoLoad) {
				seeIfWeNeedToLoadMoreStuff();
			}
				
			if ($version2.val() != '') {
				loadMatchingColumns();
			}
			//}, 250);
							
			//if (callback)
			//	callback();
		}
	});	


}

function seeIfWeNeedToLoadMoreStuff() {

	//return;
	if ( !autoLoad ) {
		return;
	}

	if ( isLoading ) {
		return;
	}

	var rows = $table.find('tr');
	
	if (rows.length == 0) {
		return;
	}
	
	var	
		windowHeight = $win.height(),
		contentHeight = $content.outerHeight(true),
		scrollTop = $win.scrollTop(),
		
		pixelsAbove = scrollTop,
		pixelsBelow = contentHeight - windowHeight - scrollTop;
		
	// console.log(windowHeight, pixelsAbove, pixelsBelow);
	
	// work on which ever one has less 
	

	if (pixelsBelow < windowHeight || pixelsAbove < windowHeight) {
	
		if (pixelsBelow < pixelsAbove) {
			
			/*
			if (rows.length >= 5) {
				// pull off first one
				var firstChapter = $table.find('tr:first-child'),
					chapterHeight = firstChapter.outerHeight(true);
					
				firstChapter.remove();
				
				$win.scrollTop( scrollTop - chapterHeight );
				
			}
			*/		
		
			var osis = rows.last().find('div.chapter').attr('data-osis');
		
			// load the next baby!
			load( osis, 'next');
		} else {
		
			if (rows.length >= 5) {
				// pull off first one
				$table.find('tr:last-child').remove();
				
			}		

			var osis = rows.find('div.chapter').first().attr('data-osis');
			
			// console.log('prev', rows.find('div.chapter').first(), osis);
		
			//setTimeout(function() {
				load( osis, 'prev');
			//}, 50);
		}
	}
		

}



function toggleParallel() {
	
	var version = $version2.val();
	
	// if nothing is selected remove second <td>s
	if (version == '') {
	
		$content.removeClass('two-columns');
		$table.find('td:nth-child(2)').remove();
		
	} else {
		
		if ($content.hasClass('two-columns')) {

			$table.find('td:nth-child(2)').empty();

		
		} else {
			// setup the 50% appearance
			$content.addClass('two-columns');
			
			// add in the second <td>
			$table.find('td').after($('<td />') );
			
			// clear empties
			$table.find('td:nth-child(1)').not(":has(div)").closest('tr').remove();			
		}

		loadMatchingColumns();

		
	}	
	
	saveSettings();	
}

function loadMatchingColumns() {


	console.log('load match');
	
	if ($version2.val() == '') {
		console.log(' - QUIT', $version2.val());
		// console.log('match', 'STOP: no 2nd version');
		return;
	}
	
	if (isLoading ) {
		console.log(' - isloading');
		return;
	}


	// find the first missing cell
	var emptyCell = $table.find('td:nth-child(2)').not(":has(div)").first();

	// console.log('loadMatchingColumns', emptyCell);
	
	if (emptyCell.length ==  0) {
		console.log(' - STOP: no more to load');
		return;
	}				
				
	var version = $version2.val(),
		mainCell = emptyCell.siblings('td'),
		mainChapter = mainCell.find('div.chapter'),
		osis = mainChapter.attr('data-osis');				

	if (typeof osis == 'undefined') {
	
		console.log(' - STOP: no OSIS');	
	
		mainCell.closest('tr').remove();
	
	} else {
	
	
		console.log(' - ', osis);
	

		isLoading = true;	
		
		$.ajax({
			url: 'content/bibles/' + version + '/' + osis + '.html',
			success: function(d) {
				
				// check if still empty
				if (emptyCell.is(':empty')) {
					var doc = $(d);
									
					doc.find('div.chapter')
						.appendTo( emptyCell );
				}	
				
				isLoading = false;	

				// console.log('side success', $version2.val() );	
					
				//if ($version2.val() != '') {
				
					//console.log(' - ', osis);
				
				
					loadMatchingColumns();
				//}	
			
			}
		});	
	}			

}


window.load = load;

	start();
});