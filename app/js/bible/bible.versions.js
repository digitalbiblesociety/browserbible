bible.versions = {
	// prebuild version array
	versionData: null,
	
	allVersions: [
		'ar_svd',
		'en_esv',
		'en_kjv',
		'en_nasb',
		'en_net',
		'en_oeb',
		'en_web',
		'el_tisch',
		'es_rv',
		'he_wlc',
		'ru_syn',
		'tr_turk',
		'zhcn_ncv',
		'zhtw_ncv'
	],
	
	loadingVersionIndex: -1,
	
	loadingCallback: null,
	
	loadNextVersion: function() {
		
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
					
					t.loadNextVersion();
				},
				error: function() {
					
					t.loadNextVersion();
				}
			});
		} else {
			t.loadingFinished();
		}
		
	},
	
	loadingFinished: function() {
		//this.versionData = bible.versionData;
	
		this.loadingCallback(bible.versionData);		
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
	
bible.versionData = {
	'ar' : {
		languageName: 'Arabic',
		versions: {
			'ar_svd': {
				abbreviation: 'SVD',
				name: 'Smith & Van Dyke (1895)',
				copyright: '?'
			}				
		}
	},
	'en' : {
		languageName: 'English',
		versions: {
			'en_esv': {
				abbreviation: 'ESV',
				name: 'English Standard Version',
				copyright: 'Copyright Crossway'
			},			
			'en_kjv': {
				abbreviation: 'KJV',
				name: 'King James Version',
				copyright: '?'
			},
			'en_nasb': {
				abbreviation: 'NASB',
				name: 'New American Standard',
				copyright: 'Copyright Lockman'
			},			
			'en_net': {
				abbreviation: 'NET',
				name: 'New English Translation',
				copyright: 'Copyright bible.org'
			},
			'en_oeb': {
				abbreviation: 'OEB',
				name: 'Open English Bible',
				copyright: ''
			},			
			'en_web': {
				abbreviation: 'WEB',
				name: 'World English Bible',
				copyright: ''
			}			
		}
	},
	'el' : {
		languageName: 'Greek',
		versions: {
			'el_tisch': {
				abbreviation: 'TISCH',
				name: 'Tischendorf',
				copyright: '?'
			}				
		}
	},
	'es' : {
		languageName: 'Spanish',
		versions: {
			'es_rv': {
				abbreviation: 'RV',
				name: 'Reina Valera (1909)',
				copyright: '?'
			}				
		}
	},
	'he' : {
		languageName: 'Hebrew',
		versions: {
			'he_wlc': {
				abbreviation: 'WLC',
				name: 'Westminster Lenigradex Codex',
				copyright: '?'
			}				
		}
	},	
	'ru' : {
		languageName: 'Russian',
		versions: {
			'ru_syn': {
				abbreviation: 'SYN',
				name: 'Russian Synodal (1876)',
				copyright: ''
			}
		}
	},
	'tr' : {
		languageName: 'Turkish',
		versions: {
			'tr_turk': {
				abbreviation: 'TURK',
				name: 'Turkish',
				copyright: ''
			}
			/*,
			'tr_turknt': {
				abbreviation: 'TURKNT',
				name: 'Turkish New Testament',
				copyright: ''
			}
			*/
		}
	},
	'zh-CN' : {
		languageName: 'Chinese Simplified',
		versions: {
			'zhcn_ncv': {
				abbreviation: 'NVCs',
				name: 'New Chinese Version',
				copyright: '?'
			}				
		}
	},
	'zh-TW' : {
		languageName: 'Chinese Traditional',
		versions: {
			'zhtw_ncv': {
				abbreviation: 'NVCt',
				name: 'New Chinese Version',
				copyright: '?'
			}				
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
			et:'Estonian',
			tl:'Filipino',
			fi:'Finnish',
			fr:'French',
			gl:'Galician',
			de:'German',
			el:'Greek',
			ht:'Haitian Creole',
			iw:'Hebrew',
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
