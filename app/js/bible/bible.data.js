/**
 * Bible namespace, Bible chapter/verse statistics, Book names and abbreviations
 *
 * @license MIT/GLPv2
 * @author John Dyer (http://j.hn/)
 */

if (typeof window.bible == 'undefined')
	window.bible = {};

/**
 * @description OSIS book ID with chapter/verse statistics and English names
 */
bible.BOOK_DATA = {
	/*
	 Old Testament
	*/
	"Gen": {
		"chapters":[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
		"names":{"eng":["Genesis","Ge","Gen"]}
	},
	"Exod": {
		"chapters":[22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
		"names":{"eng":["Exodus","Ex","Exo"]}
	},
	"Lev": {
		"chapters":[17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],
		"names":{"eng":["Leviticus","Le","Lev"]}
	},
	"Num": {
		"chapters":[54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
		"names":{"eng":["Numbers","Nu","Num"]}
	},
	"Deut": {
		"chapters":[46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
		"names":{"eng":["Deuteronomy","Dt","Deut","Deu","De"]}
	},
	"Josh": {
		"chapters":[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
		"names":{"eng":["Joshua","Js","Jos","Jos","Josh"]}
	},
	"Judg": {
		"chapters":[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
		"names":{"eng":["Judges","Jg","Jdg","Jdgs"]}
	},
	"Ruth": {
		"chapters":[22,23,18,22],
		"names":{"eng":["Ruth","Ru","Rut"]}
	},
	"1Sam": {
		"chapters":[28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
		"names":{"eng":["1 Samuel","1S","1 Sam","1Sam","1 Sa","1Sa","I Samuel","I Sam","I Sa"]}
	},
	"2Sam": {
		"chapters":[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
		"names":{"eng":["2 Samuel","2S","2 Sam","2Sam","2 Sa","2Sa","II Samuel","II Sam","II Sa","IIS"]}
	},
	"1Kgs": {
		"chapters":[53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
		"names":{"eng":["1 Kings","1K","1 Kin","1Kin","1 Ki","IK","1Ki","I Kings","I Kin","I Ki"]}
	},
	"2Kgs": {
		"chapters":[18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
		"names":{"eng":["2 Kings","2K","2 Kin","2Kin","2 Ki","IIK","2Ki","II Kings","II Kin","II Ki"]}
	},
	"1Chr": {
		"chapters":[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
		"names":{"eng":["1 Chronicles","1Ch","1 Chr","1Chr","1 Ch","ICh","I Chronicles","I Chr","I Ch"]}
	},
	"2Chr": {
		"chapters":[17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
		"names":{"eng":["2 Chronicles","2Ch","2 Chr","2 Chr","2Chr","2 Ch","IICh","II Chronicles","II Chr","II Ch"]}
	},
	"Ezra": {
		"chapters":[11,70,13,24,17,22,28,36,15,44],
		"names":{"eng":["Ezra","Ezr"]}
	},
	"Neh": {
		"chapters":[11,20,32,23,19,19,73,18,38,39,36,47,31],
		"names":{"eng":["Nehemiah","Ne","Neh","Neh","Ne"]}
	},
	"Esth": {
		"chapters":[22,23,15,17,14,14,10,17,32,3],
		"names":{"eng":["Esther","Es","Est","Esth"]}
	},
	"Job": {
		"chapters":[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
		"names":{"eng":["Job","Jb","Job"]}
	},
	"Ps": {
		"chapters":[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],
		"names":{"eng":["Psalm","Ps","Psa"]}
	},
	"Prov": {
		"chapters":[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
		"names":{"eng":["Proverbs","Pr","Prov","Pro"]}
	},
	"Eccl": {
		"chapters":[18,26,22,16,20,12,29,17,18,20,10,14],
		"names":{"eng":["Ecclesiastes","Ec","Ecc", "Qohelet"]}
	},
	"Song": {
		"chapters":[17,17,11,16,16,13,13,14],
		"names":{"eng":["Song of Songs","So","Sos","Song of Solomon","SOS","SongOfSongs","SongofSolomon", "Canticle of Canticles"]}
	},
	"Isa": {
		"chapters":[31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
		"names":{"eng":["Isaiah","Is","Isa"]}
	},
	"Jer": {
		"chapters":[19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
		"names":{"eng":["Jeremiah","Je","Jer"]}
	},
	"Lam": {
		"chapters":[22,22,66,22,22],
		"names":{"eng":["Lamentations","La","Lam","Lament"]}
	},
	"Ezek": {
		"chapters":[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
		"names":{"eng":["Ezekiel","Ek","Ezek","Eze"]}
	},
	"Dan": {
		"chapters":[21,49,30,37,31,28,28,27,27,21,45,13],
		"names":{"eng":["Daniel","Da","Dan","Dl","Dnl"]}
	},
	"Hos": {
		"chapters":[11,23,5,19,15,11,16,14,17,15,12,14,16,9],
		"names":{"eng":["Hosea","Ho","Hos"]}
	},
	"Joel": {
		"chapters":[20,32,21],
		"names":{"eng":["Joel","Jl","Joel","Joe"]}
	},
	"Amos": {
		"chapters":[15,16,15,13,27,14,17,14,15],
		"names":{"eng":["Amos","Am","Amos","Amo"]}
	},
	"Obad": {
		"chapters":[21],
		"names":{"eng":["Obadiah","Ob","Oba","Obd","Odbh"]}
	},
	"Jonah": {
		"chapters":[17,10,10,11],
		"names":{"eng":["Jonah","Jh","Jon","Jnh"]}
	},
	"Mic": {
		"chapters":[16,13,12,13,15,16,20],
		"names":{"eng":["Micah","Mi","Mic"]}
	},
	"Nah": {
		"chapters":[15,13,19],
		"names":{"eng":["Nahum","Na","Nah","Nah","Na"]}
	},
	"Hab": {
		"chapters":[17,20,19],
		"names":{"eng":["Habakkuk","Hb","Hab","Hk","Habk"]}
	},
	"Zeph": {
		"chapters":[18,15,20],
		"names":{"eng":["Zephaniah","Zp","Zep","Zeph"]}
	},
	"Hag": {
		"chapters":[15,23],
		"names":{"eng":["Haggai","Ha","Hag","Hagg"]}
	},
	"Zech": {
		"chapters":[21,13,10,14,11,15,14,23,17,12,17,14,9,21],
		"names":{"eng":["Zechariah","Zc","Zech","Zec"]}
	},
	"Mal": {
		"chapters":[14,17,18,6],
		"names":{"eng":["Malachi","Ml","Mal","Mlc"]}
	},
	
	/*
	 New Testament
	*/	
	"Matt": {
		"chapters":[25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
		"names":{"eng":["Matthew","Mt","Matt","Mat"]}
	},
	"Mark": {
		"chapters":[45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
		"names":{"eng":["Mark","Mk","Mar","Mrk"]}
	},
	"Luke": {
		"chapters":[80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
		"names":{"eng":["Luke","Lk","Luk","Lu"]}
	},
	"John": {
		"chapters":[51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
		"names":{"eng":["John","Jn","Joh","Jo"]}
	},
	"Acts": {
		"chapters":[26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
		"names":{"eng":["Acts","Ac","Act"]}
	},
	"Rom": {
		"chapters":[32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],
		"names":{"eng":["Romans","Ro","Rom","Rmn","Rmns"]}
	},
	"1Cor": {
		"chapters":[31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],
		"names":{"eng":["1 Corinthians","1Co","1 Cor","1Cor","ICo","1 Co","1Co","I Corinthians","I Cor","I Co"]}
	},
	"2Cor": {
		"chapters":[24,17,18,18,21,18,16,24,15,18,33,21,14],
		"names":{"eng":["2 Corinthians","2Co","2 Cor","2Cor","IICo","2 Co","2Co","II Corinthians","II Cor","II Co"]}
	},
	"Gal": {
		"chapters":[24,21,29,31,26,18],
		"names":{"eng":["Galatians","Ga","Gal","Gltns"]}
	},
	"Eph": {
		"chapters":[23,22,21,32,33,24],
		"names":{"eng":["Ephesians","Ep","Eph","Ephn"]}
	},
	"Phil": {
		"chapters":[30,30,21,23],
		"names":{"eng":["Philippians","Pp","Phi","Phil","Phi"]}
	},
	"Col": {
		"chapters":[29,23,25,18],
		"names":{"eng":["Colossians","Co","Col","Colo","Cln","Clns"]}
	},
	"1Thess": {
		"chapters":[10,20,13,18,28],
		"names":{"eng":["1 Thessalonians","1Th","1 Thess","1Thess","ITh","1 Thes","1Thes","1 The","1The","1 Th","1Th","I Thessalonians","I Thess","I The","I Th"]}
	},
	"2Thess": {
		"chapters":[12,17,18],
		"names":{"eng":["2 Thessalonians","2Th","2 Thess","2 Thess","2Thess","IITh","2 Thes","2Thes","2 The","2The","2 Th","2Th","II Thessalonians","II Thess","II The","II Th"]}
	},
	"1Tim": {
		"chapters":[20,15,16,16,25,21],
		"names":{"eng":["1 Timothy","1Ti","1 Tim","1Tim","1 Ti","ITi","1Ti","I Timothy","I Tim","I Ti"]}
	},
	"2Tim": {
		"chapters":[18,26,17,22],
		"names":{"eng":["2 Timothy","2Ti","2 Tim","2 Tim","2Tim","2 Ti","IITi","2Ti","II Timothy","II Tim","II Ti"]}
	},
	"Titus": {
		"chapters":[16,15,15],
		"names":{"eng":["Titus","Ti","Tit","Tt","Ts"]}
	},
	"Phlm": {
		"chapters":[25],
		"names":{"eng":["Philemon","Pm","Phile","Phile","Philm","Pm"]}
	},
	"Heb": {
		"chapters":[14,18,19,16,14,20,28,13,28,39,40,29,25],
		"names":{"eng":["Hebrews","He","Heb","Hw"]}
	},
	"Jas": {
		"chapters":[27,26,18,17,20],
		"names":{"eng":["James","Jm","Jam","Jas","Ja"]}
	},
	"1Pet": {
		"chapters":[25,25,22,19,14],
		"names":{"eng":["1 Peter","1P","1 Pet","1Pet","IPe","1P","I Peter","I Pet","I Pe"]}
	},
	"2Pet": {
		"chapters":[21,22,18],
		"names":{"eng":["2 Peter","2P","2 Pet","2Pet","2Pe","IIP","II Peter","II Pet","II Pe"]}
	},
	"1John": {
		"chapters":[10,29,24,21,21],
		"names":{"eng":["1 John","1J","1 Jn","1Jn","1 Jo","IJo","I John","I Jo","I Jn"]}
	},
	"2John": {
		"chapters":[13],
		"names":{"eng":["2 John","2J","2 Jn","2Jn","2 Jo","IIJo","II John","II Jo","II Jn"]}
	},
	"3John": {
		"chapters":[14],
		"names":{"eng":["3 John","3J","3 Jn","3 Jn","3Jn","3 Jo","IIIJo","III John","III Jo","III Jn"]}
	},
	"Jude": {
		"chapters":[25],
		"names":{"eng":["Jude","Jude","Jude"]}
	},
	"Rev": {
		"chapters":[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,20],
		"names":{"eng":["Revelation","Re","Rev","Rvltn"]}
	},

	/*
	 Apocrypha
	*/	
	"Tob":{
		"chapters":[22,14,17,21,22,17,18],
		"names":{"eng":["Tobit"]}
	},
	"Jdt":{
		"chapters":[],
		"names":{"eng":["Judith"]}
	},
	"AddEsth":{
		"chapters":[],
		"names":{"eng":["Additions to Esther"]}
	},
	"Wis":{
		"chapters":[],
		"names":{"eng":["Wisdom", "Wisdom of Solomon"]}
	},
	"Sir":{
		"chapters":[],
		"names":{"eng":["Sirach","Ecclesiasticus"]}
	},
	"Bar":{
		"chapters":[],
		"names":{"eng":["Baruch"]}
	},
	"EpJer":{
		"chapters":[],
		"names":{"eng":["Letter of Jeremiah"]}
	},
	"PrAzar":{
		"chapters":[],
		"names":{"eng":["Prayer of Azariah"]}
	},
	"Sus":{
		"chapters":[],
		"names":{"eng":["Susanna"]}
	},
	"Bel":{
		"chapters":[],
		"names":{"eng":["Bel and the Dragon"]}
	},
	"1Macc":{
		"chapters":[],
		"names":{"eng":["1 Maccabees"]}
	},
	"2Macc":{
		"chapters":[],
		"names":{"eng":["2 Maccabees"]}
	},
	"3Macc":{
		"chapters":[],
		"names":{"eng":["3 Maccabees"]}
	},
	"4Macc":{
		"chapters":[],
		"names":{"eng":["4 Maccabees"]}
	},
	"PrMan":{
		"chapters":[],
		"names":{"eng":["Prayer of Manasseh", "Song of the Three Children"]}
	},
	"1Esd":{
		"chapters":[],
		"names":{"eng":["1 Esdras"]}
	},
	"2Esd":{
		"chapters":[],
		"names":{"eng":["2 Esdras","5 Ezra"]}
	},
	"Ps151":{
		"chapters":[],
		"names":{"eng":["Psalm"]}
	}
};

/**
 * @description Default order of Old Testament books
 */
bible.OT_BOOKS = ["Gen","Exod","Lev","Num","Deut","Josh","Judg","Ruth","1Sam","2Sam","1Kgs","2Kgs","1Chr","2Chr","Ezra","Neh","Esth","Job","Ps","Prov","Eccl","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal"];

/**
 * @description Default order of New Testament books
 */
bible.NT_BOOKS = ["Matt","Mark","Luke","John","Acts","Rom","1Cor","2Cor","Gal","Eph","Phil","Col","1Thess","2Thess","1Tim","2Tim","Titus","Phlm","Heb","Jas","1Pet","2Pet","1John","2John","3John","Jude","Rev"];

/**
 * @description Default order of Apocryphal books
 */
bible.AP_BOOKS = ["Tob","Jdt","AddEsth","Wis","Sir","Bar","EpJer","PrAzar","Sus","Bel","1Macc","2Macc","3Macc","4Macc","1Esd","2Esd","Ps151"];

/**
 * @description Default order of Apocryphal books
 */
bible.DEFAULT_BIBLE = bible.OT_BOOKS.concat(bible.NT_BOOKS);

/**
 * @description Default order of Bible's with Apocryphal books
 */
bible.APOCRYPHAL_BIBLE = bible.OT_BOOKS.concat(bible.AP_BOOKS, bible.NT_BOOKS);


/**
 * @description Adds names in bulk for a language
 */
bible.addNames = function(lang, bookList, namesData) {
	for (var i in bookList) {
		var osisKey = bookList[i],
			names = namesData[i];
			
		if (typeof names === 'string')
			bible.BOOK_DATA[ osisKey ].names[lang] = [names];
		else
			bible.BOOK_DATA[ osisKey ].names[lang] = names;
	}
}

// Burmese
bible.addNames("bur",bible.DEFAULT_BIBLE,[
"ကမၻာဦးက်မ္း  ","ထြက္ေျမာက္ရာက်မ္း  ","ဝတ္ျပဳရာက်မ္း  ","ေတာလည္ရာက်မ္း  ","တရားေဟာရာက်မ္း   ","ေယာရႈမွတ္စာ  ","တရားသူႀကီးမွတ္စာ   ","ရုသဝတၳဳ   ","ဓမၼရာဇဝင္ပဌမေစာင္   ","ဓမၼရာဇဝင္ဒုတိယေစာင္   ","ဓမၼရာဇဝင္တတိယေစာင္ ","ဓမၼရာဇဝင္စတုတၳေစာင္   ","ရာဇဝင္ခ်ဳပ္ပဌမေစာင္   ","ရာဇဝင္ခ်ဳပ္ဒုတိယေစာင္   ","ဧဇရမွတ္စာ  ","ေနဟမိမွတ္စာ   ","ဧသတာဝတၱဳ   ","ေယာဘဝတၱဳ   ","ဆာလံက်မ္း   ","သုတၱံက်မ္း   ","ေဒသနာက်မ္း   ","ေရွာလမုန္သီခ်င္း   ","ေဟရွာယအနာဂတိၱက်မ္း   ","ေယရမိအနာဂတၱိက်မ္း   ","ေယရမိျမည္တမ္းစကား   ","ေယဇေက်လအနာကတၱိက်မ္း   ","ဒံေယလအနာဂတၱိက်မ္း   ","ေဟာေရွအနာဂတၱိက်မ္း   ","ေယာလအနာဂတၱိက်မ္း   ","အာမုတ္အနာဂတၱိက်မ္း   ","ၾသဗဒိဗ်ာဒိတ္ရူပါရုံ   ","ေယာနဝတၳဳ   ","မိကၡာအနာဂတၱိက်မ္း   ","နာဟံုအနာဂတၱိက်မ္း   ","ဟဗကၠဳတ္အနာဂတၱိက်မ္း   ","ေဇဖနိအနာဂတၱိက်မ္း   ","ဟဂၢဲအနာဂတၱိက်မ္း   ","ဇာခရိအနာဂတၱိက်မ္း   ","မာလခိအနာဂတၱိက်မ္း   ","ရွင္မႆဲခရစ္ဝင္   ","ရွင္မာကုခရစ္ဝင္   ","ရွင္လုကာခရစ္ဝင္   ","ရွင္ေယာဟန္ခရစ္ဝင္   ","တမန္ေတာ္ဝတၳဳ   ","ေရာမၾသဝါဒစာ   ","ေကာရိ ႏၱဳ ၾသဝါဒစာပဌမေစာင္  ","ေကာရိ သု ၾသဝါဒစာဒုတိယေစာင္   ","ဂလာတိၾသဝါဒစာ   ","ဧဖက္ၾသဝါဒစာ   ","ဖိလိပၸိၾသဝါဒစာ   ","ေကာေလာသဲၾသဝါဒစာ   ","သက္သာေလာနိတ္ၾသဝါဒစာပဌမေစာင္   ","သက္သာေလာနိတ္ၾသဝါဒစာဒုတိယေစာင္   ","တိေမာေသၾသဝါဒပဌမေစာင္   ","တိေမာေသၾသဝါဒစာဒုတိယေစာင္   ","တိတုၾသဝါဒစာ   ","ဖိေလမုန္ၾသဝါဒစာ   ","ေဟျဗဲၾသဝါဒစာ   ","ရွင္ယာကုပ္ၾသဝါဒစာ   ","ရွင္ေပတရုၾသဝါဒစာပဌမေစာင္   ","ရွင္ေပတရုၾသဝါဒစာဒုတိယေစာင္   ","ရွင္ေယာဟန္ၾသဝါဒစာပဌမေစာင္    ","ရွင္ေယာဟန္ၾသဝါဒစာဒုတိယေစာင္    ","ရွင္ေယာဟန္ၾသဝါဒစာတတိယေစာင္   ","ရွင္ယုဒၾသဝါဒစာ   ","ဗ်ာဒိတ္က်မ္း   "
]);

// spanish
bible.addNames("spa", bible.DEFAULT_BIBLE, [
	"Génesis","Exodo","Levítico","Números","Deuteronomio","Josué","Jueces","Rut","1 Samuel","2 Samuel","1 Reyes","2 Reyes","1 Crónicas","2 Crónicas","Esdras","Nehemías","Ester","Job","Salmos","Proverbios","Eclesiastés","Cantares","Isaías","Jeremías","Lamentaciones","Ezequiel","Daniel","Oseas","Joel","Amós","Abdías","Jonás","Miqueas","Nahúm","Habacuc","Sofonías","Hageo","Zacarías","Malaquías",
	"Mateo","Marcos","Lucas","Juan","Hechos","Romanos","1 Corintios","2 Corintios","Gálatas","Efesios","Filipenses","Colosenses","1 Tesalonicenses","2 Tesalonicenses","1 Timoteo","2 Timoteo","Tito","Filemón","Hebreos","Santiago","1 Pedro","2 Pedro","1 Juan","2 Juan","3 Juan","Judas","Apocalipsis"
]);

// French
bible.addNames("fre",bible.DEFAULT_BIBLE,[
	"Genèse","Exode","Lévitique","Nombres","Deutéronome","Josué","Juges","Ruth","1 Samuel","2 Samuel","1 Rois","2 Rois","1 Chroniques","2 Chroniques","Esdras","Néhémie","Esther","Job","Psaumes","Proverbes","Ecclésiaste","Cantique","Esaïe","Jérémie","Lamentations","Ezéchiel","Daniel","Osée","Joël","Amos","Abdias","Jonas","Michée","Nahum","Habacuc","Sophonie","Aggée","Zacharie","Malachie",
	"Matthieu","Marc","Luc","Jean","Actes","Romains","1 Corinthiens","2 Corinthiens","Galates","Ephésiens","Philippiens","Colossiens","1 Thessalonicien","2 Thessalonicien","1 Timothée","2 Timothée","Tite","Philemon","Hébreux","Jacques","1 Pierre","2 Pierre","1 Jean","2 Jean","3 Jean","Jude","Apocalypse"
]);

// German
bible.addNames("de",bible.DEFAULT_BIBLE,[
	"Genesis","Exodus","Levitikus","Numeri","Deuteronomium","Josua","Richter","Rut","1 Samuel","2 Samuel","1 Könige","2 Könige","1 Chronik","2 Chronik","Esra","Nehemia","Ester",["Hiob","Ijob"],"Psalter","Sprichwörter","Kohelet","Hohelied Salmos","Jesaja","Jeremia",["Klagelieder","Jeremias"],["Hesekiel","Ezechiel"],"Daniel","Hosea","Joel","Amos","Obadja","Jona","Micha","Nahum","Habakuk","Zefanja","Haggai","Sacharja","Maleachi",
	"Matthäus","Markus","Lukas","Johannes","Apostelgeschichte des Lukas","Römer","1 Korinther","2 Korinther","Galater","Epheser","Philipper","Kolosser","1 Thessalonicher","2 Thessalonicher","1 Timotheus","2 Timotheus","Titus","Philemon","Hebräer","Jakobus","1 Petrus","2 Petrus","1 Johannes","2 Johannes","3 Johannes","Judas","Offenbarung des Johannes"
]);

// Greek
bible.addNames("gre", bible.DEFAULT_BIBLE, [
	"ΓΕΝΕΣΙΣ","ΕΞΟΔΟΣ","ΛΕΥΙΤΙΚΟΝ","ΑΡΙΘΜΟΙ","ΔΕΥΤΕΡΟΝΟΜΙΟΝ","ΙΗΣΟΥΣ ΝΑΥΗ","ΚΡΙΤΑΙ","ΡΟΥΘ","ΒΑΣΙΛΕΙΩΝ Α΄","ΒΑΣΙΛΕΙΩΝ B΄","ΒΑΣΙΛΕΙΩΝ Γ΄","ΒΑΣΙΛΕΙΩΝ Δ΄","ΠΑΡΑΛΕΙΠΟΜΕΝΩΝ Α΄","ΠΑΡΑΛΕΙΠΟΜΕΝΩΝ B΄","ΕΣΔΡΑΣ","ΝΕΕΜΙΑΣ","ΕΣΘΗΡ","ΙΩΒ","ΨΑΛΜΟΙ","ΠΑΡΟΙΜΙΑΙ","ΕΚΚΛΗΣΙΑΣΤΗΣ","ΑΣΜΑ ΑΣΜΑΤΩΝ","ΗΣΑΪΑΣ","ΙΕΡΕΜΙΑΣ","ΘΡΗΝΟΙ ΙΕΡΕΜΙΟΥ","ΙΕΖΕΚΙΗΛ ","ΔΑΝΙΗΛ","ΩΣΗΕ","ΙΩΗΛ","ΑΜΩΣ","ΟΒΔΙΟΥ","ΙΩΝΑΣ","ΜΙΧΑΙΑΣ","ΝΑΟΥΜ","ΑΜΒΑΚΟΥΜ","ΣΟΦΟΝΙΑΣ ","ΑΓΓΑΙΟΣ","ΖΑΧΑΡΙΑΣ","ΜΑΛΑΧΙΑΣ",	
	"ΚΑΤΑ ΜΑΤΘΑΙΟΝ","ΚΑΤΑ ΜΑΡΚΟΝ","ΚΑΤΑ ΛΟΥΚΑΝ","ΚΑΤΑ ΙΩΑΝΝΗΝ","ΠΡΑΞΕΙΣ","ΠΡΟΣ ΡΩΜΑΙΟΥΣ","ΠΡΟΣ ΚΟΡΙΝΘΙΟΥΣ Α΄","ΠΡΟΣ ΚΟΡΙΝΘΙΟΥΣ Β΄","ΠΡΟΣ ΓΑΛΑΤΑΣ","ΠΡΟΣ ΕΦΕΣΙΟΥΣ","ΠΡΟΣ ΦΙΛΙΠΠΗΣΙΟΥΣ","ΠΡΟΣ ΚΟΛΟΣΣΑΕΙΣ","ΘΕΣΣΑΛΟΝΙΚΕΙΣ Α΄","ΘΕΣΣΑΛΟΝΙΚΕΙΣ Β΄","ΠΡΟΣ ΤΙΜΟΘΕΟΝ Α΄","ΠΡΟΣ ΤΙΜΟΘΕΟΝ Β΄","ΠΡΟΣ ΤΙΤΟΝ","ΠΡΟΣ ΦΙΛΗΜΟΝΑ","ΠΡΟΣ ΕΒΡΑΙΟΥΣ","ΙΑΚΩΒΟΥ","ΠΕΤΡΟΥ Α΄","ΠΕΤΡΟΥ Β΄","ΙΩΑΝΝΟΥ Α΄","ΙΩΑΝΝΟΥ Β΄","ΙΩΑΝΝΟΥ Γ΄","ΙΟΥΔΑ","ΑΠΟΚΑΛΥΨΙΣ ΙΩΑΝΝΟΥ"
]);

// Hebrew
bible.addNames("heb", bible.OT_BOOKS, [
	"בראשית","שמות","ויקרא","במדבר","דברים","יהושע","שופטים","רות","שמואל א","שמואל ב","מלכים א","מלכים ב","דברי הימים א","דברי הימים ב","עזרא","נחמיה","אסתר","איוב","תהילים","קהלת","קהלת","שיר השירים","ישעה","ירמיה","איכה","יחזקאל","דניאל","הושע","יואל","עמוס","עבדיה","יונה","מיכה","נחום","חבקוק","צפניה","חגי","זכריה","מלאכי"
]);

// Russian
bible.addNames('rus', bible.DEFAULT_BIBLE, [
	"Бытие","Исход","Левит","Числа","Второзаконие","Иисус Навин","Книга Судей","Руфь","1-я Царств","2-я Царств","3-я Царств","4-я Царств","1-я Паралипоменон","2-я Паралипоменон","Ездра","Неемия","Есфирь","Иов","Псалтирь","Притчи","Екклесиаст","Песни Песней","Исаия","Иеремия","Плач Иеремии","Иезекииль","Даниил","Осия","Иоиль","Амос","Авдия","Иона","Михей","Наум","Аввакум","Софония","Аггей","Захария","Малахия",
	"От Матфея","От Марка","От Луки","От Иоанна","Деяния","К Римлянам","1-е Коринфянам","2-е Коринфянам","К Галатам","К Ефесянам","К Филиппийцам","К Колоссянам","1-е Фессалоникийцам","2-е Фессалоникийцам","1-е Тимофею","2-е Тимофею","К Титу","К Филимону","К Евреям","Иакова","1-e Петра","2-e Петра","1-e Иоанна","2-e Иоанна","3-e Иоанна","Иуда","Откровение"
]);

// Chinese (Simplified)
bible.addNames('chi', bible.DEFAULT_BIBLE, [
	"創 世 記","出 埃 及 記","利 未 記","民 數 記","申 命 記","約 書 亞 記","士 師 記","路 得 記","撒 母 耳 記 上","撒 母 耳 記 下","列 王 紀 上","列 王 紀 下","歷 代 志 上","歷 代 志 下","以 斯 拉 記","尼 希 米 記","以 斯 帖 記","約 伯 記","詩 篇","箴 言","傳 道 書","雅 歌","以 賽 亞 書","耶 利 米 書","耶 利 米 哀 歌","以 西 結 書","但 以 理 書","何 西 阿 書","約 珥 書","阿 摩 司 書","俄 巴 底 亞 書","約 拿 書","彌 迦 書","那 鴻 書","哈 巴 谷 書","西 番 雅 書","哈 該 書","撒 迦 利 亞","瑪 拉 基 書","馬 太 福 音","馬 可 福 音","路 加 福 音","約 翰 福 音","使 徒 行 傳","羅 馬 書","歌 林 多 前 書","歌 林 多 後 書","加 拉 太 書","以 弗 所 書","腓 立 比 書","歌 羅 西 書","帖 撒 羅 尼 迦 前 書","帖 撒 羅 尼 迦 後 書","提 摩 太 前 書","提 摩 太 後 書","提 多 書","腓 利 門 書","希 伯 來 書","雅 各 書","彼 得 前 書","彼 得 後 書","約 翰 一 書","約 翰 二 書","約 翰 三 書","猶 大 書","启 示 录"
]);

// Chinese (Traditional)
bible.addNames('zho', bible.DEFAULT_BIBLE, [
	"創 世 記","出 埃 及 記","利 未 記","民 數 記","申 命 記","約 書 亞 記","士 師 記","路 得 記","撒 母 耳 記 上","撒 母 耳 記 下","列 王 紀 上","列 王 紀 下","歷 代 志 上","歷 代 志 下","以 斯 拉 記","尼 希 米 記","以 斯 帖 記","約 伯 記","詩 篇","箴 言","傳 道 書","雅 歌","以 賽 亞 書","耶 利 米 書","耶 利 米 哀 歌","以 西 結 書","但 以 理 書","何 西 阿 書","約 珥 書","阿 摩 司 書","俄 巴 底 亞 書","約 拿 書","彌 迦 書","那 鴻 書","哈 巴 谷 書","西 番 雅 書","哈 該 書","撒 迦 利 亞","瑪 拉 基 書","馬 太 福 音","馬 可 福 音","路 加 福 音","約 翰 福 音","使 徒 行 傳","羅 馬 書","歌 林 多 前 書","歌 林 多 後 書","加 拉 太 書","以 弗 所 書","腓 立 比 書","歌 羅 西 書","帖 撒 羅 尼 迦 前 書","帖 撒 羅 尼 迦 後 書","提 摩 太 前 書","提 摩 太 後 書","提 多 書","腓 利 門 書","希 伯 來 書","雅 各 書","彼 得 前 書","彼 得 後 書","約 翰 一 書","約 翰 二 書","約 翰 三 書","猶 大 書","启 示 录"
]);

// Arabic
bible.addNames('ara', bible.DEFAULT_BIBLE, [
	"التكوين","الخروج","اللاويين","العدد","التثنية","يشوع","القضاة","راعوث","صموئيل الأول","صموئيل الثاني","الملوك الأول","الملوك الثاني","أخبار الأيام الأول","أخبار الأيام الثاني","عزرا","نحميا","أستير","أيوب","المزامير","الأمثال","الجامعة","نشيد الأنشاد","أشعياء","أرمياء","مراثي أرمياء","حزقيال","دانيال","هوشع","يوئيل","عاموس","عوبديا","يونان","ميخا","ناحوم","حبقوق","صفنيا","حجي","زكريا","ملاخي","متى","مرقس","لوقا","يوحنا","أعمال الرسل","رومية","1 كورنثوس","2 كورنثوس","غلاطية","أفسس","فيليبي","كولوسي","1 تسالونيكي","2 تسالونيكي","1 تيموثاوس","2 تيموثاوس","تيطس","فيليمون","العبرانيين","يعقوب","1 بطرس","2 بطرس","1 يوحنا","2 يوحنا","3 يوحنا","يهوذا","رؤيا"
]);

// turkish
bible.addNames('tur', bible.DEFAULT_BIBLE, [
["Yaratilis", "Tekvin"],
["Misir'dan Çikis", "Çikis"],
"Levililer",
["Çölde Sayim", "Sayilar"],
"Yasa'nin Tekrari",
"Yesu",
"Hakimler",
"Rut",
"1 Samuel",
"2 Samuel",
"1 Krallar",
"2 Krallar",
"1 Tarihler",
"2 Tarihler",
"Ezra",
"Nehemya",
"Ester",
["Eyüp", "Eyub"],
"Mezmurlar",
["Süleyman'in Özdeyisleri", "Süleyman'in Meselleri"],
"Vaiz",
["Ezgiler Ezgisi", "Nesideler Nesidesi"],
["Yesaya", "Isaya"],
"Yeremya",
["Agitlar", "Yeremya'nin Mersiyeleri"],
"Hezekiel",
"Daniel",
"Hosea",
"Yoel",
"Amos",
["Ovadya", "Obadya"],
"Yunus",
"Mika",
"Nahum",
"Habakkuk",
["Sefanya", "Tsefanya"],
["Hagay", "Haggay"],
["Zekeriya", "Zekarya"],
"Malaki",
"Matta",
"Markos",
"Luka",
"Yuhanna",
["Elçilerin Isleri", "Resullerin Isleri"],
"Romalilar",
["1 Korintliler", "1. Korintoslular"],
["2 Korintliler", "2. Korintoslular"],
"Galatyalilar",
["Efesliler", "Efesoslular"],
"Filipililer",
"Koloseliler",
"1 Selanikiler",
"2 Selanikiler",
"1 Timoteos",
"2 Timoteos",
"Titus",
"Filimon",
"Ibraniler",
["Yakup", "Yakub"],
"1 Petrus",
"2 Petrus",
"1 Yuhanna",
"2 Yuhanna",
"3 Yuhanna",
"Yahuda",
"Vahiy"	
	
]);