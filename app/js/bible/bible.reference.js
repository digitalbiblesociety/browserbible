/**
 * Bible reference parser
 *
 * @author John Dyer (http://j.hn/)
 */

bible.parseReference = function (textReference) {

	var 
		bookIndex = -1,
		chapter1 = -1,
		verse1 = -1,
		chapter2 = -1,
		verse2 = -1,
		input = new String(textReference),
		i,
		lang,
		osisBookId,
		matchingOsisBookID = null,
		matchingLanguage = null,
		afterRange = false,
		afterSeparator = false,
		startedNumber = false,
		currentNumber = '',
		name,
		possibleMatch;


	// go through all books and test all names
	for (osisBookId in bible.BOOK_DATA) {
		
		// match OSIS id?
		possibleMatch = input.substring(0, Math.floor(osisBookId.length, input.length)).toLowerCase();
		if (possibleMatch == osisBookId.toLowerCase()) {
			matchingOsisBookID = osisBookId;
			input = input.substring(osisBookId.length);
			matchingLanguage = 'eng';
			break;
		}		
		
		// if no direct match on OSIS id, then go through names in each language
		for (lang in bible.BOOK_DATA[osisBookId].names) {	
		
			// test each name starting with the full name, then short code, then abbreviation, then alternates
			for (var i=0, il=bible.BOOK_DATA[osisBookId].names[lang].length; i<il; i++) {
				
				name = new String(bible.BOOK_DATA[osisBookId].names[lang][i]).toLowerCase();
				possibleMatch = input.substring(0, Math.floor(name.length, input.length)).toLowerCase();
	
				if (possibleMatch == name) {
					matchingOsisBookID = osisBookId;
					matchingLanguage = lang;
					input = input.substring(name.length);
					break; // out of names
				}				
			}
		
			if (matchingOsisBookID != null)
				break;	// out of languages

		}
		if (matchingOsisBookID != null)
			break; // out of books
	}

	if (matchingOsisBookID  == null)
		return null;


	for (i = 0; i < input.length; i++) {
		var c = input.charAt(i);

		if (c == ' ' || isNaN(c)) {
			if (!startedNumber)
				continue;

			if (c == '-') {
				afterRange = true;
				afterSeparator = false;
			} else if (c == ':' || c == ',' || c == '.') {
				afterSeparator = true;
			} else {
				// ignore
			}

			// reset
			currentNumber = '';
			startedNumber = false;

		} else {
			startedNumber = true;
			currentNumber += c;

			if (afterSeparator) {
				if (afterRange) {
					verse2 = parseInt(currentNumber);
				} else { // 1:1
					verse1 = parseInt(currentNumber);
				}
			} else {
				if (afterRange) {
					chapter2 = parseInt(currentNumber);
				} else { // 1
					chapter1 = parseInt(currentNumber);
				}
			}
		}
	}

	// reassign 1:1-2	
	if (chapter1 > 0 && verse1 > 0 && chapter2 > 0 && verse2 <= 0) {
		verse2 = chapter2;
		chapter2 = chapter1;
	}
	// fix 1-2:5
	if (chapter1 > 0 && verse1 <= 0 && chapter2 > 0 && verse2 > 0) {
		verse1 = 1;
	}

	// just book
	if (bookIndex > -1 && chapter1 <= 0 && verse1 <= 0 && chapter2 <= 0 && verse2 <= 0) {
		chapter1 = 1;
		//verse1 = 1;
	}

	// validate max chapter
	if (chapter1 == -1) {
		chapter1 = 1;
	} else if (chapter1 > bible.BOOK_DATA[matchingOsisBookID].chapters.length) {
		chapter1 = bible.BOOK_DATA[matchingOsisBookID].chapters.length;
		if (verse1 > 0)
			verse1 = 1;
	}

	// validate max verse
	/*
	if (verse1 == -1) {
	verse1 = 1;
	} else 
	*/
	if (verse1 > bible.BOOK_DATA[matchingOsisBookID].chapters[chapter1 - 1]) {
		verse1 = bible.BOOK_DATA[matchingOsisBookID].chapters[chapter1 - 1];
	}
	if (verse2 <= verse1) {
		chapter2 = -1;
		verse2 = -1;
	}

	// finalize
	return bible.Reference(matchingOsisBookID, chapter1, verse1, chapter2, verse2);

}

bible.Reference = function () {

	var 
		_osisBookID = -1,
		_chapter1 = -1,
		_verse1 = -1,
		_chapter2 = -1,
		_verse2 = -1,
		_language = 'en';

	if (arguments.length == 0) {
		// error		
	} else if (arguments.length == 1 && typeof arguments[0] == 'string') { // a string that needs to be parsed
		return bible.parseReference(arguments[0]);
	} else if (arguments.length == 1) { // unknonw
		return null;
	} else {
		_osisBookID = arguments[0];
		_chapter1 = arguments[1];
		if (arguments.length >= 3) _verse1 = arguments[2];
		if (arguments.length >= 4) _chapter2 = arguments[3];
		if (arguments.length >= 5) _verse2 = arguments[4];
	}

	function padLeft(input, length, s) {
		while (input.length < length)
			input = s + input;
		return input;
	}

	return {
		osisBookID: _osisBookID,
		chapter: _chapter1,
		verse: _verse1,
		chapter1: _chapter1,
		verse1: _verse1,
		chapter2: _chapter2,
		verse2: _verse2,
		language: _language,
		bookList: bible.DEFAULT_BIBLE,

		isValid: function () {
			return (typeof _osisBookID != 'undefined' && _osisBookID != null && _chapter1 > 0);
		},

		chapterAndVerse: function (cvSeparator, vvSeparator, ccSeparator) {
			cvSeparator = cvSeparator || ':';
			vvSeparator = vvSeparator || '-';
			ccSeparator = ccSeparator || '-';

			if (this.chapter1 > 0 && this.verse1 <= 0 && this.chapter2 <= 0 && this.verse2 <= 0) // John 1
				return this.chapter1;
			else if (this.chapter1 > 0 && this.verse1 > 0 && this.chapter2 <= 0 && this.verse2 <= 0) // John 1:1
				return this.chapter1 + cvSeparator + this.verse1;
			else if (this.chapter1 > 0 && this.verse1 > 0 && this.chapter2 <= 0 && this.verse2 > 0) // John 1:1-5
				return this.chapter1 + cvSeparator + this.verse1 + vvSeparator + this.verse2;
			else if (this.chapter1 > 0 && this.verse1 <= 0 && this.chapter2 > 0 && this.verse2 <= 0) // John 1-2
				return this.chapter1 + ccSeparator + this.chapter2;
			else if (this.chapter1 > 0 && this.verse1 > 0 && this.chapter2 > 0 && this.verse2 > 0) // John 1:1-2:2
				return this.chapter1 + cvSeparator + this.verse1 + ccSeparator + ((this.chapter1 != this.chapter2) ? this.chapter2 + cvSeparator : '') + this.verse2;
			else
				return 'unknown';
		},

		toString: function () {
			if (this.osisBookID == null) return "invalid";

			var bookName = '',
				bookNames = bible.BOOK_DATA[this.osisBookID].names[this.language];
			
			if (typeof bookNames != 'undefined') {
				bookName = bookNames[0];
			} else {
				bookName = bible.BOOK_DATA[this.osisBookID].names['eng'][0]
			}

			return bookName + ' ' + this.chapterAndVerse();
		},

		toOsis: function () {
			if (this.osisBookID == null) return "invalid";
			
			return this.osisBookID + '.' + this.chapter1 + (this.verse1 > 0 ? '.' + this.verse1 : '');
		},
		
		toOsisChapter: function () {
			if (this.osisBookID == null) return "invalid";
			
			return this.osisBookID + '.' + this.chapter1;
		},
		
		toOsisVerse: function () {
			if (this.osisBookID == null) return "invalid";
			
			return this.osisBookID + '.' + this.chapter1 + '.' + (this.verse1 > 0 ? this.verse1 : '0');
		},			
		
		prevChapter: function () {
			this.verse1 = 1;
			this.chapter2 = -1;
			this.verse2 = -1;
			if (this.chapter1 == 1 && this.bookList.indexOf(this.osisBookID) == 0) {
				return null;
			} else {
				if (this.chapter1 == 1) {
					// get the previous book
					this.osisBookID = this.bookList[this.bookList.indexOf(this.osisBookID)-1];
					
					// get the last chapter in this book
					this.chapter1 = bible.BOOK_DATA[this.osisBookID].chapters.length;
				} else {
					// just go back a chapter
					this.chapter1--;
				}
				
			}
			
			// return the object ()
			return this;
		},
		
		nextChapter: function () {
			this.verse1 = 1;
			this.chapter2 = -1;
			this.verse2 = -1;
			
			// check for the last chapter in the last book
			if (this.bookList[this.osisBookID] == this.bookList.length-1 && bible.BOOK_DATA[this.osisBookID].chapters.length == this.chapter1) {
				return null;
			} else {	
				
				if (this.chapter1 < bible.BOOK_DATA[this.osisBookID].chapters.length) {
					// just go up one chapter
					this.chapter1++;
				} else if (this.bookList.indexOf(this.osisBookID) < this.bookList.length-1) {
					// go to the next book, first chapter
					this.osisBookID = this.bookList[this.bookList.indexOf(this.osisBookID)+1];
					this.chapter1 = 1;
				}
				
			}

			return this;
		},
		
		isFirstChapter: function () {
			return (this.chapter1 == 1 && this.bookList.indexOf(this.osisBookID) == 0);
		},
		
		isLastChapter: function () {
			return (this.bookList[this.osisBookID] == this.bookList.length-1 && bible.BOOK_DATA[this.osisBookID].chapters.length == this.chapter1);
		}
	}
};
bible.utility = {};
