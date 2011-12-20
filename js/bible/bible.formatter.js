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
	
	parseVerseCode: function(verseCode) {
		if (verseCode.length != 10)
			return 'unknown';
		
		var bookNumber = parseInt(verseCode.substring(1,4),10),
			chapterNumber = parseInt(verseCode.substring(4,7),10),
			verseNumber = parseInt(verseCode.substring(7,10),10);
		
		return bible.Books[bookNumber-1].names[2] + ' ' + chapterNumber + ':' + verseNumber;
	}	
};