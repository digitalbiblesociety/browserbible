/**
 * All the functions necessary to navigate a Bible
 * @requires bible.BibleFormatter
 *
 * @author John Dyer (http://j.hn/)
 */

bible.BibleNavigator = {
	
	name: 'bible',
	
	sectionSelector: 'div.chapter',
	
	sectionIdAttr: 'data-osis',
	
	fragmentSelector: 'span.verse',
	
	fragmentIdAttr: 'data-osis',
	
	getOptions: function() {
		var html = '',
			langCode,
			language,
			versionCode,
			version;
		
		for (langCode in bible.versions.versionData) {
			language = bible.versions.versionData[langCode];
			
			html += '<optgroup label="' + language.languageName + '">';
			
			for (versionCode in language.versions) {
				version = language.versions[versionCode];
				
				html += '<option value="' + versionCode + '" data-language="' + langCode + '" data-version=\'' + JSON.stringify(version) + '\'>' + version.abbreviation + ' - ' + version.name + '</option>';
				
			}
			
			html += '</optgroup>';
		}
	
		return html;
	},
	
	formatNavigation: function(fragmentId, language) {
		
		var reference = new bible.Reference(fragmentId);
		reference.language = language;
		
		return reference.toString();
		
		//return bible.BibleFormatter.verseCodeToReferenceString(fragmentId, 0);
	},
	
	findFragment: function(fragmentId, content) {
		return content.find('span.verse[data-osis="' + fragmentId + '"]');
	},
	
	parseString: function(input) {
		var reference = new bible.Reference(input);
		
		if (reference != null) {
			// make sure the first verse is seleced
			
			if (reference.verse1 < 1) {
				reference.verse1 = 1;
			}
			return reference.toOsisVerse(); // not to chapter, to verse
		} else {
			return null;
		}
	},
	
	convertFragmentIdToSectionId: function(fragmentId) {
		
		//
		var parts = fragmentId.split('.'),
			chapter = parts[0] + '.' + parts[1];
			
		
		return chapter;
	},
	
	getNextSectionId: function(sectionId) {
		var reference = new bible.Reference(sectionId),
			nextChapterReference = reference.nextChapter();
			
		if (nextChapterReference !== null) {
			return nextChapterReference.toOsisChapter();
		} else {
			return null;
		}
		//return bible.BibleFormatter.getNextChapterCode(sectionId);
	},
	
	getPrevSectionId: function(sectionId) {
		var reference = new bible.Reference(sectionId),
			prevChapterReference = reference.prevChapter();
			
		if (prevChapterReference !== null) {
			return prevChapterReference.toOsisChapter();
		} else {
			return null;
		}
	},
	
	setupNavigationList: function(document) {
		document.navigationWindow.on('mouseleave', function() {
			$(this).hide();
		});
		document.navigationWindow.html(
			'<div class="book-list document-navigation-list"><h3>' + docs.Localizer.get('bible_navigator_books') + '</h3><div class="nav-scroller"><ul></ul></div></div>' +
			'<div class="chapter-list document-navigation-list"><h3>' + docs.Localizer.get('bible_navigator_chapters') + '</h3><div class="nav-scroller"><ul></ul></div></div>'
		);
		
		// events!
		document.navigationWindow.on('click', '.book-list li', function() {
					
			var li = $(this),
				chapters =  parseInt(li.attr('data-chapters'), 10),
				chaptersHtml = "";
				
			for (var i= 0; i<chapters; i++) {
				chaptersHtml += '<li>' + (i+1) + '</li>';
			}
			
			document.navigationWindow.find('.chapter-list ul').html(chaptersHtml);
			
			li.addClass('selected').siblings().removeClass('selected');
		});
		
		document.navigationWindow.on('click', '.chapter-list li', function() {
			
			var li = $(this),
				chapterNumber = parseInt(li.html(), 10),
				bookOsis = li.closest('.document-navigation-window').find('.book-list li.selected').attr('data-osis');
			
			console.log(bookOsis + ' ' + chapterNumber);
				
			document.navigateByString(bookOsis + ' ' + chapterNumber);
			document.navigationWindow.hide();
		});			
	},
	
	showNavigationList: function(document) {
		
		// get books
		var versionInfo = JSON.parse( document.selector.find('option:selected').attr('data-version') );
			booksHtml = '';

		for (var i in versionInfo.books) {
			//books += '<li data-osis="' + bible.BOOK_DATA[ versionInfo.books[i] ].chapters.length + '">' + versionInfo.bookNames[i] + '</li>';
			booksHtml += '<li class="' + versionInfo.code.toLowerCase() + '" data-osis="' + versionInfo.books[i] + '" data-chapters="' + bible.BOOK_DATA[ versionInfo.books[i] ].chapters.length + '">' +
				//versionInfo.bookNames[i] +
				bible.BOOK_DATA[ versionInfo.books[i] ].names[versionInfo.language.toLowerCase()][0] + 
			'</li>';
		}
		document.navigationWindow.find('.book-list ul').html(booksHtml);
		
		
		// show
		var inputPos = document.input.offset(),
			inputHeight = document.input.outerHeight();
		
		document.navigationWindow.css({
			'top': (inputPos.top + inputHeight) + 'px',
			'left': (inputPos.left) + 'px'
		})
		.show();
		
		var reference = new bible.Reference(document.input.val()),
			bookToSelect = document.navigationWindow.find('.book-list li[data-osis="' + reference.osisBookID + '"]'),
			selectedBookOffset = bookToSelect.offset(),
			scroller = document.navigationWindow.find('.book-list .nav-scroller'),
			scrollerOffset = scroller.offset();
			
		scroller.scrollTop( selectedBookOffset.top - scrollerOffset.top - scroller.scrollTop() - 10);
			
		bookToSelect.click();		
	}
	
};