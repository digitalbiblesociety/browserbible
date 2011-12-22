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
		i, j,
		afterRange = false,
		afterSeparator = false,
		startedNumber = false,
		currentNumber = '',
		name,
		possibleMatch;


	// go through all books and test all names
	for (i = bible.Books.length - 1; i >= 0; i--) {
		// test each name starting with the full name, then short code, then abbreviation, then alternates
		for (j = 0; j < bible.Books[i].names.length; j++) {
			name = new String(bible.Books[i].names[j]).toLowerCase();
			possibleMatch = input.substring(0, Math.floor(name.length, input.length)).toLowerCase();

			if (possibleMatch == name) {
				bookIndex = i;
				input = input.substring(name.length);
				break;
			}

		}
		if (bookIndex > -1)
			break;
	}

	if (bookIndex < 0)
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
	} else if (chapter1 > bible.Books[bookIndex].verses.length) {
		chapter1 = bible.Books[bookIndex].verses.length;
		if (verse1 > 0)
			verse1 = 1;
	}

	// validate max verse
	/*
	if (verse1 == -1) {
	verse1 = 1;
	} else 
	*/
	if (verse1 > bible.Books[bookIndex].verses[chapter1 - 1]) {
		verse1 = bible.Books[bookIndex].verses[chapter1 - 1];
	}
	if (verse2 <= verse1) {
		chapter2 = -1;
		verse2 = -1;
	}

	// finalize
	return bible.Reference(bookIndex, chapter1, verse1, chapter2, verse2);

}

bible.Reference = function () {

	var 
		_bookIndex = -1,
		_chapter1 = -1,
		_verse1 = -1,
		_chapter2 = -1,
		_verse2 = -1;

	if (arguments.length == 0) {
		// error		
	} else if (arguments.length == 1 && typeof arguments[0] == 'string') { // a string that needs to be parsed
		return bible.parseReference(arguments[0]);
	} else if (arguments.length == 1) { // unknonw
		return null;
	} else {
		_bookIndex = arguments[0];
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
		bookIndex: _bookIndex,
		chapter: _chapter1,
		verse: _verse1,
		chapter1: _chapter1,
		verse1: _verse1,
		chapter2: _chapter2,
		verse2: _verse2,

		isValid: function () {
			return (_bookIndex > -1 && _bookIndex < bible.Books.length && _chapter1 > 0);
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
			if (this.bookIndex < 0 || this.bookIndex >= bible.Books.length) return "invalid";

			return bible.Books[this.bookIndex].names[0] + ' ' + this.chapterAndVerse();
		},

		toOsis: function () {
			if (this.bookIndex < 0 || this.bookIndex >= bible.Books.length) return "invalid";
			return bible.Books[this.bookIndex].names[2] + '.' + this.chapter1 + '.' + this.verse1;
		},
		toChapterCode: function () {
			if (this.bookIndex < 0 || this.bookIndex >= bible.Books.length) return "invalid";
			return 'c' + padLeft((this.bookIndex+1).toString(), 3, '0') + padLeft(this.chapter1.toString(), 3, '0');
		},
		toVerseCode: function () {
			if (this.bookIndex < 0 || this.bookIndex >= bible.Books.length) return "invalid";
			return 'v' + padLeft((this.bookIndex+1).toString(), 3, '0') + padLeft(this.chapter1.toString(), 3, '0') + padLeft((this.verse1 <= 0 ? 1 : this.verse1).toString(), 3, '0');
		},
		prevChapter: function () {
			this.verse1 = 1;
			this.chapter2 = -1;
			this.verse2 = -1;
			if (this.chapter1 == 1 && this.bookIndex > -1) {
				this.bookIndex--;
				this.chapter1 = bible.Books[this.bookIndex].verses.length;
			}
			else {
				this.chapter1--;
			}
			return this;
		},
		nextChapter: function () {
			this.verse1 = 1;
			this.chapter2 = -1;
			this.verse2 = -1;
			if (this.chapter1 < bible.Books[this.bookIndex].verses.length) {
				this.chapter1++;
			} else if (this.bookIndex < bible.Books.length - 1) {
				this.bookIndex++;
				this.chapter1 = 1;
			}

			return this;
		}
		,
		isFirstChapter: function () {
			return (this.bookIndex == 0 && this.chapter1 == 1); //  && this.verse1 == 1);
		},
		isLastChapter: function () {
			return (this.bookIndex == bible.Books.length - 1 && this.chapter1 == v.length); //  && 	this.verse1 == v[v.length-1]);
		}
	}
};
bible.utility = {};
