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