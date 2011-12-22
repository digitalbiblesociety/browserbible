/**
 * Formatting tools for Bible references and HTML codes
 *
 * @author John Dyer (http://j.hn/)
 */
 
bible.BibleFormatter = {

	padLeft: function(input, length, s) {
		while (input.length < length)
			input = s + input;
		return input;
	},

	getChapterCode: function(bookNumber, chapterNumber) {
		return 'c' + this.padLeft((bookNumber).toString(), 3, '0') + this.padLeft((chapterNumber).toString(), 3, '0');
	},
	
	generateVerseCode: function(bookNumber, chapterNumber, verseNumber) {
		return 'v' + this.padLeft((bookNumber).toString(), 3, '0') + this.padLeft((chapterNumber).toString(), 3, '0') + this.padLeft((verseNumber).toString(), 3, '0');
	},	
	
	parseBibleCode: function(bibleCode, bookNameIndex) {
		if (bibleCode.length != 7 && bibleCode.length != 10)
			return null;
		
		// book, chapter, verse
		return {
			bookNumber: parseInt(bibleCode.substring(1,4),10),
			chapterNumber: parseInt(bibleCode.substring(4,7),10),
			verseNumber: bibleCode.length == 10 ? parseInt(bibleCode.substring(7,10),10) : 0
		};
	},
	
	verseCodeToReferenceString: function(verseCode, bookNameIndex) {
		if (verseCode.length != 10)
			return 'unknown';
		
		if (typeof bookNameIndex == 'undefined')
			bookNameIndex = 2;
			
		var referenceData = this.parseBibleCode(verseCode);
		
		return bible.Books[referenceData.bookNumber-1].names[bookNameIndex] + ' ' + referenceData.chapterNumber + ':' + referenceData.verseNumber;
	},	
	
	getNextChapterCode: function(chapterCode) {
		var referenceData = this.parseBibleCode(chapterCode);
		
		// if at the end of the current book
		if (referenceData.chapterNumber == bible.Books[referenceData.bookNumber-1].verses.length) {
			
			// if this is the last book
			if (referenceData.bookNumber == bible.Books.length) {
				return null;
			} else {
				return this.getChapterCode(referenceData.bookNumber+1, 1);
			}
			
		} else {	
			return this.getChapterCode(referenceData.bookNumber, referenceData.chapterNumber+1);
		}
	},
	
	getPrevChapterCode: function(chapterCode) {
		var referenceData = this.parseBibleCode(chapterCode);

		// if at the beginning of the current book
		if (referenceData.chapterNumber == 1) {
			
			// if this is the first book
			if (referenceData.bookNumber == 1) {
				return null;
			} else {
				return this.getChapterCode(referenceData.bookNumber-1, bible.Books[referenceData.bookNumber-2].verses.length);
			}
			
		} else {	
			return this.getChapterCode(referenceData.bookNumber, referenceData.chapterNumber-1);
		}
	}
};