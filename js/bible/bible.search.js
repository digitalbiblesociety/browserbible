/**
 * Loads HTML bible files and searches them for text (RegExp).
 * Requires jQuery for AJAX
 *
 * @author John Dyer (http://j.hn/)
 */

bible.BibleSearch = {
		
	isSearching: false,
	
	canceled: false,
	
	bookIndex: 0,
	
	chapterIndex: 0,
	
	searchText: '',
	
	searchRegExp: null,
	
	highlightRegExp: null,
	
	verseRegExp: new RegExp('v[0-9]{9}','gi'),
	
	resultCount: 0,
	
	startTime: null,
	
	searchResultsArray: [],
	
	version: '',
	
	search: function(text, version, chapterCallback, endedCallback) {
		if (this.isSearching)
			return;
		
		// save variables
		this.searchText = text;
		this.version = version;
		this.chapterCallback = chapterCallback;
		this.endedCallback = endedCallback;
		
		// compile regexp
		this.searchRegExp = new RegExp('<span class="verse"(.)*\\b' + text + '\\b(.)*</span>', 'gi');
		this.highlightRegExp = new RegExp('\\b' + text + '\\b', 'gi');

		// reset variables
		this.bookIndex = 0;
		this.chapterIndex = 0;
		this.canceled = false;
		this.resultCount = 0;
		this.startTime = new Date();
		this.searchResultsArray = [];
		
		this.isSearching = true;
		this.loadChapter();
	},
	
	cancelSearch: function() {
		this.isSearching = false;
		this.canceled = true;
	},
	
	loadChapter: function() {
		
		var s = this,
			chapterUrl = 'content/bibles/' + this.version + '/' + bible.BibleFormatter.getChapterCode(this.bookIndex+1, this.chapterIndex+1) + '.html';
		
		this.chapterCallback(this.bookIndex, this.chapterIndex, this.resultCount, this.startTime);
		
		$.ajax({
			url: chapterUrl,
			dataType: 'html',
			success: function(data) {
				
				s.textSearch(data);
				
				// move on or cancel
				if (!s.canceled) {
					s.nextChapter();
				} else {
					s.ended();
				}
			},
			error: function(e) {
				s.nextChapter();
			}
		});			
	},
	
	textSearch: function(data) {

		// find words
		var matches = data.match(this.searchRegExp),
			i, il,
			html, verse;
		
		if (matches != null && matches.length > 0) {
			
			for (i=0, il=matches.length; i<il; i++) {
				
				// hightlight text
				html = matches[i].replace(this.highlightRegExp, function(match) {
					return '<span class="highlight">' + match + '</span>';
				});
				
				// find and format verse
				verse = bible.BibleFormatter.parseVerseCode( matches[i].match( this.verseRegExp)[0] );
				
				// put it altogether for a row
				html = '<div class="search-result"><span class="search-verse">' + verse + '</span>' + html + '</div>';
				
				// store results
				this.searchResultsArray.push(  html );
				this.resultCount++;
			}
		}
	},
	
	nextChapter: function() {
		
		// more chapters?
		if (this.chapterIndex < bible.Books[this.bookIndex].verses.length-1 ) {
			this.chapterIndex++;
		} else {
			this.bookIndex++;
			this.chapterIndex = 0;
			
			// check for last book!
			if (this.bookIndex > bible.Books.length-1) {
				this.ended();
				return;
			}
		}
		
		var t = this;
		
		// IE errors out without this
		setTimeout(function() {
			t.loadChapter();
		}, 1);
		
	},
	
	ended: function() {		
		this.isSearching = false;
		
		this.endedCallback(this.searchResultsArray.join(''), this.resultCount, this.startTime);
		
		this.searchResultsArray = null;
		
		//results.html( this.searchResultsArray.join('') );	
	}
};