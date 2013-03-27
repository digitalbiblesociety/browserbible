// Load a versions file from
// /app/content/bible/versions.json
// then checks for subfolders

bible.versions = {
	// prebuild version array
	versionData: null,
	
	// versions by key
	versionsByKey: {},
	
	// list of keys
	versionKeys: [],
	
	getVersion: function(key) {
		return this.versionsByKey[key];
	},
	
	loadingVersionIndex: -1,
	
	loadingCallback: null,
	
	// loaded from content/bible/versions.js
	allVersions: [],
	
	loadVersionManifest: function() {
		var t = this;
		
		$.ajax({
			url: 'content/bibles/versions.json',
			dataType: 'json',
			cache: false,
			success: function(data) {
				t.allVersions = data.versions;
				t.loadNextVersion();
			},
			error: function(x) {
				console.log('asdfa', x)
				
			}
		});
	},
	
	loadNextVersion: function() {
		if (this.allVersions.length == 0) {
			this.loadVersionManifest();
			return;
		}
		
		var t = this,
			versionFolder = '';
		
		t.loadingVersionIndex++;
		
		if (t.loadingVersionIndex < t.allVersions.length) {	
		
			versionFolder = this.allVersions[this.loadingVersionIndex];
		
			$.ajax({
				url: 'content/bibles/' + versionFolder + '/version.json',
				dataType: 'json',
				success: function(data) {
					
					// create language
					if (typeof t.versionData[data.language.toLowerCase()] == 'undefined') {
						t.versionData[data.language.toLowerCase()] = {
							languageName: bible.language.codes[data.language.toLowerCase()],
							versions: {}
						};
					}
					// insertdata
					t.versionData[data.language.toLowerCase()].versions[data.code] = data;
					t.versionsByKey[data.code] = data;
					t.versionKeys.push(data.code);
					
					t.loadNextVersion();
				},
				error: function(error) {
					console.log(error)
					t.loadNextVersion();
				}
			});
		} else {
			t.loadingFinished();
		}
		
	},
	
	loadingFinished: function() {
		this.versionKeys.sort();
	
		//this.versionData = bible.versionData;
		this.loadingCallback(bible.versions.versionData);		
	},
	
	getVersions: function(callback) {
	
		this.loadingCallback = callback;
		
		if (this.versionData == null) {
			this.versionData = {};
			this.loadNextVersion();
		} else {
			this.loadingFinished();
		}
	}
};

bible.language = {
	codes:  {
		af:'Afrikaans',
		sq:'Albanian',
		ar:'Arabic',
		be:'Belarusian',
		bg:'Bulgarian',
		ca:'Catalan',
		zh:'Chinese',
		'zh-cn':'Chinese Simplified',
		'zh-tw':'Chinese Traditional',
		hr:'Croatian',
		cs:'Czech',
		da:'Danish',
		nl:'Dutch',
		en:'English',
		enn: 'English Notes',
		et:'Estonian',
		tl:'Filipino',
		fi:'Finnish',
		fr:'French',
		gl:'Galician',
		de:'German',
		el:'Greek',
		ht:'Haitian Creole',
		iw:'Hebrew',
		he:'Hebrew',
		hi:'Hindi',
		hu:'Hungarian',
		is:'Icelandic',
		id:'Indonesian',
		ga:'Irish',
		it:'Italian',
		ja:'Japanese',
		ko:'Korean',
		lv:'Latvian',
		lt:'Lithuanian',
		mk:'Macedonian',
		ms:'Malay',
		mt:'Maltese',
		my:'Burmese',
		no:'Norwegian',
		fa:'Persian',
		pl:'Polish',
		pt:'Portuguese',
		//'pt-pt':'Portuguese (Portugal)',
		ro:'Romanian',
		ru:'Russian',
		sr:'Serbian',
		sk:'Slovak',
		sl:'Slovenian',
		es:'Spanish',
		sw:'Swahili',
		sv:'Swedish',
		tl:'Tagalog',
		th:'Thai',
		tr:'Turkish',
		uk:'Ukrainian',
		vi:'Vietnamese',
		cy:'Welsh',
		yi:'Yiddish'
	}
};