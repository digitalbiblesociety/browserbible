/**
 * Bible namespace, bible book names and chapter/verse statistics
 *
 * @author John Dyer (http://j.hn/)
 */

var bible = {};
bible.Books = [
{
	names: ['Genesis', 'Ge', 'Gen', '01_Gen'],
	verses: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26]
},
{
	names: ['Exodus', 'Ex', 'Exo', '02_Exod'],
	verses: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38]
},
{
	names: ['Leviticus', 'Le', 'Lev', '03_Lev'],
	verses: [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34]
},
{
	names: ['Numbers', 'Nu', 'Num', '04_Num'],
	verses: [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13]
},
{
	names: ['Deuteronomy', 'Dt', 'Deut', 'Deu', 'De', '05_Deut'],
	verses: [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12]
},
{
	names: ['Joshua', 'Js', 'Jos', 'Jos', 'Josh', '06_Josh'],
	verses: [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33]
},
{
	names: ['Judges', 'Jg', 'Jud', 'Jdg', 'Ju', 'Jdgs', '07_Judg'],
	verses: [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25]
},
{
	names: ['Ruth', 'Ru', 'Rut', '08_Ruth'],
	verses: [22, 23, 18, 22]
},
{
	names: ['1 Samuel', '1S', '1 Sam', '1Sam', '1 Sa', '1Sa', 'I Samuel', 'I Sam', 'I Sa', 'IS', '09_1Sam'],
	verses: [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13]
},
{
	names: ['2 Samuel', '2S', '2 Sam', '2Sam', '2 Sa', '2Sa', 'II Samuel', 'II Sam', 'II Sa', 'IIS', '10_2Sam'],
	verses: [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25]
},
{
	names: ['1 Kings', '1K', '1 Kin', '1Kin', '1 Ki', 'IK', '1Ki', 'I Kings', 'I Kin', 'I Ki', '11_1Kgs'],
	verses: [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53]
},
{
	names: ['2 Kings', '2K', '2 Kin', '2Kin', '2 Ki', 'IIK', '2Ki', 'II Kings', 'II Kin', 'II Ki', '12_2Kgs'],
	verses: [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30]
},
{
	names: ['1 Chronicles', '1Ch', '1 Chr', '1Chr', '1 Ch', 'ICh', 'I Chronicles', 'I Chr', 'I Ch', '13_1Chr'],
	verses: [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30]
},
{
	names: ['2 Chronicles', '2Ch', '2 Chr', '2 Chr', '2Chr', '2 Ch', 'IICh', 'II Chronicles', 'II Chr', 'II Ch', '14_2Chr'],
	verses: [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23]
},
{
	names: ['Ezra', 'Ezr', '15_Ezra'],
	verses: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44]
},
{
	names: ['Nehemiah', 'Ne', 'Neh', 'Neh', 'Ne', '16_Neh'],
	verses: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31]
},
{
	names: ['Esther', 'Es', 'Est', 'Esth', '17_Esth'],
	verses: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3]
},
{
	names: ['Job', 'Jb', 'Job', '18_Job'],
	verses: [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17]
},
{
	names: ['Psalm', 'Ps', 'Psa', '19_Ps'],
	verses: [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6]
},
{
	names: ['Proverbs', 'Pr', 'Prov', 'Pro', '20_Prov'],
	verses: [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31]
},
{
	names: ['Ecclesiastes', 'Ec', 'Ecc', '21_Ecc'],
	verses: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14]
},
{
	names: ['Song of Songs', 'So', 'Sos', 'Song of Solomon', 'SOS', 'SongOfSongs', 'SongofSolomon', '22_Song'],
	verses: [17, 17, 11, 16, 16, 13, 13, 14]
},
{
	names: ['Isaiah', 'Is', 'Isa', '23_Isa'],
	verses: [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24]
},
{
	names: ['Jeremiah', 'Je', 'Jer', '24_Jer'],
	verses: [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34]
},
{
	names: ['Lamentations', 'La', 'Lam', 'Lament', '25_Lam'],
	verses: [22, 22, 66, 22, 22]
},
{
	names: ['Ezekiel', 'Ek', 'Ezek', 'Eze', '26_Ezek' ],
	verses: [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35]
},
{
	names: ['Daniel', 'Da', 'Dan', 'Dl', 'Dnl', '27_Dan'],
	verses: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13]
},
{
	names: ['Hosea', 'Ho', 'Hos', '28_Hos'],
	verses: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9]
},
{
	names: ['Joel', 'Jl', 'Joe', '29_Joel'],
	verses: [20, 32, 21]
},
{
	names: ['Amos', 'Am', 'Amo', '30_Amos'],
	verses: [15, 16, 15, 13, 27, 14, 17, 14, 15]
},
{
	names: ['Obadiah', 'Ob', 'Oba', 'Obd', 'Odbh', '31_Obad' ],
	verses: [21]
},
{
	names: ['Jonah', 'Jh', 'Jon', 'Jnh', '32_Jonah'],
	verses: [17, 10, 10, 11]
},
{
	names: ['Micah', 'Mi', 'Mic', '33_Mic'],
	verses: [16, 13, 12, 13, 15, 16, 20]
},
{
	names: ['Nahum', 'Na', 'Nah', '34_Nah'],
	verses: [15, 13, 19]
},
{
	names: ['Habakkuk', 'Hb', 'Hab', 'Hk', 'Habk', '35_Hab'],
	verses: [17, 20, 19]
},
{
	names: ['Zephaniah', 'Zp', 'Zep', 'Zeph', 'Ze', '36_Zeph'],
	verses: [18, 15, 20]
},
{
	names: ['Haggia', 'Ha', 'Hag', 'Hagg', '37_Hag'],
	verses: [15, 23]
},
{
	names: ['Zechariah', 'Zc', 'Zech', 'Zec', '38_Zech'],
	verses: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21]
},
{
	names: ['Malachi', 'Ml', 'Mal', 'Mlc', '39_Mal'],
	verses: [14, 17, 18, 6]
},
{
	names: ['Matthew', 'Mt', 'Matt', 'Mat', '40_Matt'],
	verses: [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20]
},
{
	names: ['Mark', 'Mk', 'Mar', 'Mrk', '41_Mark'],
	verses: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20]
},
{
	names: ['Luke', 'Lk', 'Luk', 'Lu', '42_Luke' ],
	verses: [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53]
},
{
	names: ['John', 'Jn', 'Joh', 'Jo', '43_John'],
	verses: [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25]
},
{
	names: ['Acts', 'Ac', 'Act', '44_Acts'],
	verses: [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31]
},
{
	names: ['Romans', 'Ro', 'Rom', 'Rmn', 'Rmns', '45_Rom'],
	verses: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27]
},
{
	names: ['1 Corinthians', '1Co', '1 Cor', '1Cor', 'ICo', '1 Co', '1Co', 'I Corinthians', 'I Cor', 'I Co', '46_1Cor'],
	verses: [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24]
},
{
	names: ['2 Corinthians', '2Co', '2 Cor', '2Cor', 'IICo', '2 Co', '2Co', 'II Corinthians', 'II Cor', 'II Co', '47_2Cor'],
	verses: [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14]
},
{
	names: ['Galatians', 'Ga', 'Gal', 'Gltns', '48_Gal'],
	verses: [24, 21, 29, 31, 26, 18]
},
{
	names: ['Ephesians', 'Ep', 'Eph', 'Ephn', '49_Eph'],
	verses: [23, 22, 21, 32, 33, 24]
},
{
	names: ['Philippians', 'Pp', 'Phi', 'Phil', '50_Phil'],
	verses: [30, 30, 21, 23]
},
{
	names: ['Colossians', 'Co', 'Col', 'Colo', 'Cln', 'Clns', '51_Col'],
	verses: [29, 23, 25, 18]
},
{
	names: ['1 Thessalonians', '1Th', '1 Thess', '1Thess', 'ITh', '1 Thes', '1Thes', '1 The', '1The', '1 Th', '1Th', 'I Thessalonians', 'I Thess', 'I The', 'I Th', '52_1Thess'],
	verses: [10, 20, 13, 18, 28]
},
{
	names: ['2 Thessalonians', '2Th', '2 Thess', '2 Thess', '2Thess', 'IITh', '2 Thes', '2Thes', '2 The', '2The', '2 Th', '2Th', 'II Thessalonians', 'II Thess', 'II The', 'II Th', '53_1Thess'],
	verses: [12, 17, 18]
},
{
	names: ['1 Timothy', '1Ti', '1 Tim', '1Tim', '1 Ti', 'ITi', '1Ti', 'I Timothy', 'I Tim', 'I Ti', '54_1Tim'],
	verses: [20, 15, 16, 16, 25, 21]
},
{
	names: ['2 Timothy', '2Ti', '2 Tim', '2 Tim', '2Tim', '2 Ti', 'IITi', '2Ti', 'II Timothy', 'II Tim', 'II Ti', '55_2Tim'],
	verses: [18, 26, 17, 22]
},
{
	names: ['Titus', 'Ti', 'Tit', 'Tt', 'Ts', '56_Titus'],
	verses: [16, 15, 15]
},
{
	names: ['Philemon', 'Pm', 'Phile', 'Phile', 'Philm', 'Pm', '57_Phlm'],
	verses: [25]
},
{
	names: ['Hebrews', 'He', 'Heb', 'Hw', '58_Heb'],
	verses: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25]
},
{
	names: ['James', 'Jm', 'Jam', 'Jas', 'Ja', '59_Jas'],
	verses: [27, 26, 18, 17, 20]
},
{
	names: ['1 Peter', '1P', '1 Pet', '1Pet', 'IPe', '1P', 'I Peter', 'I Pet', 'I Pe', '60_1Pet'],
	verses: [25, 25, 22, 19, 14]
},
{
	names: ['2 Peter', '2P', '2 Pet', '2Pet', '2Pe', 'IIP', 'II Peter', 'II Pet', 'II Pe', '61_2Pet'],
	verses: [21, 22, 18]
},
{
	names: ['1 John', '1J', '1 Jn', '1Jn', '1 Jo', 'IJo', 'I John', 'I Jo', 'I Jn', '62_1John'],
	verses: [10, 29, 24, 21, 21]
},
{
	names: ['2 John', '2J', '2 Jn', '2Jn', '2 Jo', 'IIJo', 'II John', 'II Jo', 'II Jn', '63_2John'],
	verses: [13]
},
{
	names: ['3 John', '3J', '3 Jn', '3 Jn', '3Jn', '3 Jo', 'IIIJo', 'III John', 'III Jo', 'III Jn', '64_3John'],
	verses: [14]
},
{
	names: ['Jude', '65_Jude'],
	verses: [25]
},
{
	names: ['Revelation', 'Re', 'Rev', 'Rvltn', '66_Rev'],
	verses: [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 20]
}
];