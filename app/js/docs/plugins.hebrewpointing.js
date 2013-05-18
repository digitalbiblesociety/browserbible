	
/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
	
	
		
		docManager.addStyle('\
.hebrew-vowel {\
	color: #ff0000;\
}\
.hebrew-accent-major {\
	color: #00ff00;\
}\
.hebrew-accent-minor {\
	color: #0000ff;\
}\
.hebrew-layers {\
	display: inline-block;\
	position: relative;\
}\
.hebrew-layers .hebrew-layers-original {\
	color: transparent;\
}\
.hebrew-layers .hebrew-layers-vowels {\
	position: absolute;\
	top: 0;\
	right: 0;\
	color: #ff0000;\
}\
.hebrew-layers .hebrew-layers-accents {\
	position: absolute;\
	top: 0;\
	right: 0;\
	color: #00ff00;\
}\
.hebrew-layers .hebrew-layers-consonants {\
	position: absolute;\
	top: 0;\
	right: 0;\
	color: #000000;\
}\
.hebrew-accent-minor {\
	color: #0000ff;\
}');	
			

		
		function runTransforms(node) {
			node.find('span.w').each(function() {
				
				var span = $(this),
					html = span.html();
				
				// color it!
				span
					.html ( 
						hebrewTools.colorizeLayers( html ) 
					);
		
			});
		
		}
	
	
		// run transforms
		docManager.addEventListener('load', function(e) {
			if (e.chapter.attr('lang') == 'heb') {
				runTransforms(e.chapter);
			}
		});				
		
	}
});


var hebrewTools = {
	vowels: [
		{name:'Sheva',value:'\u05B0'},
		{name:'Hatef Segol',value:'\u05B1'},
		{name:'Hatef Patah',value:'\u05B2'},
		{name:'Hatef Qamats',value:'\u05B3'},
		{name:'Hiriq',value:'\u05B4'},
		{name:'Tsere',value:'\u05B5'},
		{name:'Segol',value:'\u05B6'},
		{name:'Patah',value:'\u05B7'},
		{name:'Qamats',value:'\u05B8'},
		{name:'Holam',value:'\u05B9'},
		/*{name:'Qubuts',value:'\u05BA'},*/
		{name:'Qubuts',value:'\u05BB'},
		{name:'Dagesh, Mapiq, Shuruq',value:'\u05BC'},
		{name:'Meteg',value:'\u05BD'},
		/*{name:'Meteg',value:'\u05BE'},*/
		{name:'Rafe',value:'\u05BF'},
		{name:'Shin Dot',value:'\u05C1'},
		{name:'Sin Dot',value:'\u05C2'},
		{name:'Mark Upper Dot',value:'\u05C4'}	
	],
	
	major_accents: [
		{name:'Etnahta',value:'\u0591'},
		{name:'Segol',value:'\u0592'},
		{name:'Shalshelet',value:'\u0593'},
		{name:'Zaqef Qatan',value:'\u0594'},
		{name:'Gadol',value:'\u0595'},
		{name:'Tipeha',value:'\u0596'},
		{name:'Revia',value:'\u0597'},
		{name:'Zarqa',value:'\u0598'},
		{name:'Pashta',value:'\u0599'}
	],
		
		/* minor */
	minor_accents: [	
		{name:'Yetiv',value:'\u059A'},
		{name:'Tevir',value:'\u059B'},
		{name:'Geresh',value:'\u059C'},
		{name:'Geresh Muqdam',value:'\u059D'},
		{name:'Gershayim',value:'\u059E'},
		{name:'Qarney Para',value:'\u059F'},
		{name:'Telisha Gedola',value:'\u05A0'},
		{name:'Pazer',value:'\u05A1'},
		{name:'?',value:'\u05A2'},
		{name:'Munah',value:'\u05A3'},
		{name:'Mahapakh',value:'\u05A4'},
		{name:'Merkha',value:'\u05A5'},
		{name:'Merkha Kefula',value:'\u05A6'},
		{name:'Darga',value:'\u05A7'},
		{name:'Qadma',value:'\u05A8'},
		{name:'Telisha Qetana',value:'\u05A9'},
		{name:'Yerah Ben Yomo',value:'\u05AA'},
		{name:'Ole',value:'\u05AB'},
		{name:'Iluy',value:'\u05AC'},
		{name:'Dehi',value:'\u05AD'},
		{name:'Zinor',value:'\u05AE'},					
		{name:'Masora Circle',value:'\u05AF'}					
	],
		
	removeVowels: function(input) {
		var output = '';
		
		// process the text
		for (var i=0; i<input.length; i++) {
			var letter = input[i],
				skip = false;
							
			for (var j=0; j<this.vowels.length; j++) {
				var vowel = this.vowels[j];
				if (letter == vowel.value) {
					skip = true;
					break;
				}
			}
			
			if (!skip) {
				output += letter;
			}						
				
		}
		
		return output;		

	},	
	
	removeAccents: function(input) {
		var output = '';
		
		// process the text
		for (var i=0; i<input.length; i++) {
			var letter = input[i],
				skip = false;
			
			
			// major
			for (var j=0; j<this.major_accents.length; j++) {
				var accent = this.major_accents[j];
				if (letter == accent.value) {
					skip = true;
					break;
				}
			}
					
			if (!skip) {
				// minor
				for (var j=0; j<this.minor_accents.length; j++) {
					var accent = this.minor_accents[j];
					if (letter == accent.value) {
						skip = true;
						break;
					}
				}	
			}
			
			if (!skip) {
				output += letter;
			}						
				
		}
		
		return output;	
	},		

	onlyConsonants: function(input) {
		var output = '';
		
		// process the text
		for (var i=0; i<input.length; i++) {
			var letter = input[i],
				skip = false;
			
			
			// major
			for (var j=0; j<this.major_accents.length; j++) {
				var accent = this.major_accents[j];
				if (letter == accent.value) {
					skip = true;
					break;
				}
			}					
					
			// check vowels
			if (!skip) {
				for (var j=0; j<this.vowels.length; j++) {
					var vowel = this.vowels[j];
					if (letter == vowel.value) {
						skip = true;
						break;
					}
				}
			}
					
			if (!skip) {
				// minor
				for (var j=0; j<this.minor_accents.length; j++) {
					var accent = this.minor_accents[j];
					if (letter == accent.value) {
						skip = true;
						break;
					}
				}	
			}
			
			if (!skip) {
				output += letter;
			}						
				
		}
		
		return output;		
	},
	
	colorizeInline: function(input) {
		var output = 
				'<span class="hebrew-layers">' +
					'<span class="hebrew-layers-original">' + input + '</span>' +
					'<span class="hebrew-layers-accents">' + this.removeVowels(input) + '</span>' +
					'<span class="hebrew-layers-vowels">' + this.removeAccents(input) + '</span>' +
					'<span class="hebrew-layers-consonants">' + this.onlyConsonants(input) + '</span>' +
				'</span>';
		
		return output;
	},
		
	colorizeLayers: function(input) {
		
		var output = '';
		
		// process the text
		for (var i=0; i<input.length; i++) {
			var letter = input[i],
				marked = false;
			
			// check vowels
			for (var j=0; j<this.vowels.length; j++) {
				var vowel = this.vowels[j];
				if (letter == vowel.value) {
					letter = '<span class="hebrew-vowel">' + letter + '</span>';
					marked = true;
					break;
				}
			}
	
			if (!marked) {
				// minor
				for (var j=0; j<this.minor_accents.length; j++) {
					var accent = this.minor_accents[j];
					if (letter == accent.value) {
						letter = '<span class="hebrew-accent-minor">' + letter + '</span>';
						marked = true;
						break;
					}
				}	
			}
			
			if (!marked) {
			
				// major
				for (var j=0; j<this.major_accents.length; j++) {
					var accent = this.major_accents[j];
					if (letter == accent.value) {
						letter = '<span class="hebrew-accent-major">' + letter + '</span>';
						marked = true;
						break;
					}
				}		
			}		
		
			output += letter;
		}
		
		return output;
	}	
};