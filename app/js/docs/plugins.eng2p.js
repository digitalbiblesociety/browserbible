	
/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
	
		docManager.addStyle('\
.eng2p-original {\
text-decoration: line-through;\
color: #444;\
display:none;\
}\
.eng2p-corrected {\
color:#393;\
}\
.eng2p-highlight,.eng2p-highlight-demo {\
color:#393;\
}\
.config-eng2p-off .eng2p-original {\
text-decoration: inherit;\
color: inherit;\
display: inherit;\
}\
.config-eng2p-off .eng2p-corrected {\
display: none;\
}\
label[for="config-texan"] {\
background-image:url(css/images/texan.svg);\
}\
#config-eng2p th {\
white-space:nowrap;\
}\
#config-eng2p td,th {\
border: solid 1px #ddd;\
padding: 2px;\
text-align:left;\
font-size: 85%;\
}');	
	
		
		//docManager.createOptionToggle('Texanize plurals', 'texan', true);

		var configBlock =
			$('<div class="config-options" id="config-eng2p">' + 
				'<h3>English Second Person Plural</h3>' + 		
		
	'<table>' +
		'<tbody>' +	
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-none" value="none" />' +
					'<label for="eng2p-option-none">None</label>' +
				'</th>' +
				'<td>You</td>' +
				'<td>Your</td>' +
				'<td>Yours</td>' +
				'<td>Yourselves</td>' +
			'</tr>' +
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-highlight" value="highlight" />' +
					'<label for="eng2p-option-highlight">Highlight</label>' +
				'</th>' +
				'<td><span class="eng2p-highlight-demo">You</span></td>' +
				'<td><span class="eng2p-highlight-demo">Your</span></td>' +
				'<td><span class="eng2p-highlight-demo">Yours</span></td>' +
				'<td><span class="eng2p-highlight-demo">Yourselves</span></td>' +
			'</tr>' +	
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-youall" value="youall"  />' +
					'<label for="eng2p-option-youall">General US</label>' +
				'</th>' +
				'<td>You all</td>' +
				'<td>You all\'s</td>' +
				'<td>You all\'s</td>' +				
				'<td>You allselves</td>' +
			'</tr>' +					
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-yall" value="yall" />' +
					'<label for="eng2p-option-yall">Southern US</label>' +
				'</th>' +
				'<td>Y\'all</td>' +
				'<td>Y\'all\'s</td>' +
				'<td>Y\'all\'s</td>' +
				'<td>Y\'allselves</td>' +
			'</tr>' +
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-youguys"  value="youguys" />' +
					'<label for="eng2p-option-youguys">Western US</label>' +
				'</th>' +
				'<td>You guys</td>' +
				'<td>Your guys\'s</td>' +
				'<td>Your guys\'s</td>' +			
				'<td>Your guys selves</td>' +				
			'</tr>' +
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-youseguys" value="youseguys" />' +
					'<label for="eng2p-option-youseguys">NYC/Chicago</label>' +
				'</th>' +
				'<td>Youse guys</td>' +
				'<td>Youse guys\'s</td>' +
				'<td>Youse guys\'s</td>' +			
				'<td>Youse guys selves</td>' +
			'</tr>' +
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-yinz" value="yinz" />' +
					'<label for="eng2p-option-yinz">Pittsburgh</label>' +
				'</th>' +
				'<td>Yinz</td>' +
				'<td>Yinz\'s</td>' +
				'<td>Yinz\'s</td>' +
				'<td>Yinzselves</td>' +				
			'</tr>' +
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-youlot" value="youlot" />' +
					'<label for="eng2p-option-youlot">United Kingdom</label>' +
				'</th>' +
				'<td>You lot</td>' +
				'<td>You lot\'s</td>' +
				'<td>You lot\'s</td>' +				
				'<td>Yourlot\'s</td>' +				
			'</tr>' +
			'<tr>' +
				'<th>' +
					'<input type="radio" name="eng2p-option" id="eng2p-option-ye" value="ye" />' +
					'<label for="eng2p-option-ye">Old English</label>' +
				'</th>' +
				'<td>Ye</td>' +
				'<td>Ye\'s</td>' +
				'<td>Ye\'s</td>' +
				'<td>Yeselves</td>' +				
			'</tr>' +						
		'</tbody>' +	
	'</table>' +
				'</div>')
				.appendTo( docManager.configWindow.content );	
				
		// push settings				
		var texanSetting = $.jStorage.get('docs-config-eng2p-setting', 'none');
		$('#eng2p-option-' + texanSetting).prop('checked',true);
		getPluralValues();			
		
		// create updates
		$('input[name="eng2p-option"]').on('click',function() {
			// update the setting value
			texanSetting = $(this).val();
			
			// store value
			$.jStorage.set('docs-config-eng2p-setting', texanSetting);
			
			// values
			getPluralValues();
			
			// re-run
			$('div.chapter[lang="eng"]').each(function() {
				var chapter = $(this);
			
				removePluralTransforms(chapter);
				runPluralTransforms(chapter);						
			});
		});				
					
	
		function getPluralValues() {
		
			var selectedRow = $('#eng2p-option-' + texanSetting).closest('tr');
		
			bible.eng2p.youPluralSubject = selectedRow.find('td:eq(0)').html();
			bible.eng2p.youPluralPossessiveDeterminer = selectedRow.find('td:eq(1)').html();
			bible.eng2p.youPluralPossessivePronoun = selectedRow.find('td:eq(2)').html();
			bible.eng2p.youPluralReflexive = selectedRow.find('td:eq(3)').html();
		}
	
		function removePluralTransforms(node) {
			bible.eng2p.removePluralTransforms(node);
		}
	
		function runPluralTransforms(node) {
			node.find('.verse').each(function(index, el) {
				var verse = $(this),
					osis = verse.attr('data-osis');

				if (bible.eng2p.secondPersonPlurals.indexOf(osis) > -1) {
					var html = verse.html();
					
					if (texanSetting == 'highlight') {
						html = bible.eng2p.highlightPlurals( html );
					} else if (texanSetting != 'none') {
						html = bible.eng2p.replacePlurals( html );				
					}
					
					verse.html( html );

				};
			});	
		}
	
		// run transforms
		docManager.addEventListener('load', function(e) {
			if (e.chapter.attr('lang') == 'eng' && texanSetting != 'none') {			
				runPluralTransforms(e.chapter);
			}
		});				
		
	}
});

bible.eng2p = {

	youPluralRegExp:  /\b([yY])ou(r|rs|rselves)?\b/g,
	
	youPluralSubject: "Y'all",
	youPluralPossessiveDeterminer: "Y'all's",
	youPluralPossessivePronoun: "Y'all's",
	youPluralReflexive: "Y'allselves",	
	
	removePluralTransforms: function(node) {
		// remove the changed words
		node.find('.eng2p-corrected').remove();
		
		// remove the surrounding spans
		node.find('.eng2p-highlight').each(function() {
			var span = this;
			
			this.parentNode.replaceChild(document.createTextNode(span.innerText), this);
		});
		
		// remove the surrounding spans		
		node.find('.eng2p-original').each(function() {
			var span = this;
			
			this.parentNode.replaceChild(document.createTextNode(span.innerText), this);
		});		
	},
	
	highlightPlurals: function(input) {
		var output = input.replace(bible.eng2p.youPluralRegExp, function(match, $1, $2, offset, originalString) { 			
		
			// return the greatness
			return '<span class="eng2p-highlight">' + match + '</span>';	
		});	
			
		return output;
	},		
	
	replacePlurals: function(input) {
		
		var output = input.replace(bible.eng2p.youPluralRegExp, function(match, $1, $2, offset, originalString) { 			
			var replacement = '';

			// you, your, yours checker
			switch (match.toLowerCase()) {
				case 'you':
					replacement = bible.eng2p.youPluralSubject;
					break;
				case 'your':
					replacement = bible.eng2p.youPluralPossessiveDeterminer;
					break;
				case 'yours':
					replacement = bible.eng2p.youPluralPossessivePronoun;
					break;
				case 'yourselves':
					replacement = bible.eng2p.youPluralReflexive;
					break;
				default:
					replacement = match; // 'UNKNOWN [' + match + ',' + $1 + ']';
					break;
					
			}
			
			// You vs. you
			if ($1 === $1.toUpperCase()) {
				replacement = replacement.substring(0,1).toUpperCase() + replacement.substring(1);
			} else {
				replacement = replacement.substring(0,1).toLowerCase() + replacement.substring(1);
			}
			
			// replace standard ' with ’
			replacement = replacement.replace(/'/gi,'&rsquo;');		
		
		
			// return the greatness
			return '<span class="eng2p-original">' + match + '</span><span class="eng2p-corrected">' + replacement + '</span>';	
		});
	
		return output;
	},
		

	secondPersonPlurals: [
// Logos @R?2?P on ESV Reverse Interlinear
"Gen.1.22","Gen.1.28","Gen.3.1","Gen.3.3","Gen.3.4","Gen.3.5","Gen.4.23","Gen.9.1","Gen.9.4","Gen.9.7","Gen.17.10","Gen.17.11","Gen.18.4","Gen.18.5","Gen.19.2","Gen.19.7","Gen.19.8","Gen.19.14","Gen.22.5","Gen.23.4","Gen.23.8","Gen.24.49","Gen.24.54","Gen.24.56","Gen.26.27","Gen.29.5","Gen.29.7","Gen.31.6","Gen.31.46","Gen.32.4","Gen.32.16","Gen.32.19","Gen.32.20","Gen.34.8","Gen.34.9","Gen.34.10","Gen.34.11","Gen.34.12","Gen.34.15","Gen.34.17","Gen.34.30","Gen.35.2","Gen.37.6","Gen.37.20","Gen.37.22","Gen.37.27","Gen.38.24","Gen.39.14","Gen.40.8","Gen.41.55","Gen.42.1","Gen.42.2","Gen.42.7","Gen.42.9","Gen.42.12","Gen.42.15","Gen.42.16","Gen.42.18","Gen.42.19","Gen.42.20","Gen.42.22","Gen.42.33","Gen.42.34","Gen.42.36","Gen.42.38","Gen.43.2","Gen.43.3","Gen.43.5","Gen.43.6","Gen.43.7","Gen.43.11","Gen.43.12","Gen.43.13","Gen.43.23","Gen.43.27","Gen.43.29","Gen.43.31","Gen.44.4","Gen.44.5","Gen.44.10","Gen.44.15","Gen.44.17","Gen.44.21","Gen.44.23","Gen.44.25","Gen.44.27","Gen.44.29","Gen.45.1","Gen.45.4","Gen.45.5","Gen.45.8","Gen.45.9","Gen.45.13","Gen.45.17","Gen.45.18","Gen.45.19","Gen.45.24","Gen.46.34","Gen.47.16","Gen.47.23","Gen.47.24","Gen.49.1","Gen.49.2","Gen.49.29","Gen.50.4","Gen.50.17","Gen.50.19","Gen.50.20","Gen.50.21","Gen.50.25",
"Exod.1.16","Exod.1.18","Exod.1.22","Exod.2.18","Exod.2.20","Exod.3.12","Exod.3.18","Exod.3.21","Exod.3.22","Exod.4.15","Exod.5.4","Exod.5.5","Exod.5.7","Exod.5.8","Exod.5.11","Exod.5.13","Exod.5.14","Exod.5.16","Exod.5.18","Exod.5.19","Exod.5.21","Exod.6.7","Exod.6.26","Exod.7.9","Exod.8.8","Exod.8.25","Exod.8.28","Exod.9.8","Exod.9.28","Exod.9.30","Exod.10.2","Exod.10.8","Exod.10.10","Exod.10.11","Exod.10.17","Exod.10.24","Exod.11.7","Exod.12.3","Exod.12.4","Exod.12.5","Exod.12.9","Exod.12.10","Exod.12.11","Exod.12.14","Exod.12.15","Exod.12.17","Exod.12.18","Exod.12.20","Exod.12.21","Exod.12.22","Exod.12.24","Exod.12.25","Exod.12.27","Exod.12.31","Exod.12.32","Exod.12.46","Exod.13.3","Exod.13.19","Exod.14.2","Exod.14.13","Exod.14.14","Exod.15.21","Exod.16.3","Exod.16.6","Exod.16.7","Exod.16.9","Exod.16.12","Exod.16.16","Exod.16.23","Exod.16.25","Exod.16.26","Exod.16.28","Exod.16.29","Exod.17.2","Exod.19.4","Exod.19.5","Exod.19.6","Exod.19.12","Exod.19.15","Exod.20.20","Exod.20.22","Exod.20.23","Exod.22.21","Exod.22.22","Exod.22.25","Exod.22.31","Exod.23.9","Exod.23.13","Exod.23.25","Exod.24.1","Exod.24.14","Exod.25.2","Exod.25.3","Exod.25.9","Exod.25.19","Exod.30.9","Exod.30.32","Exod.30.37","Exod.31.13","Exod.31.14","Exod.32.2","Exod.32.24","Exod.32.27","Exod.32.29","Exod.32.30","Exod.34.13","Exod.35.3","Exod.35.5","Exod.35.30",
"Lev.1.2","Lev.2.11","Lev.2.12","Lev.3.17","Lev.7.23","Lev.7.24","Lev.7.26","Lev.7.32","Lev.8.31","Lev.8.32","Lev.8.33","Lev.8.35","Lev.9.3","Lev.9.6","Lev.10.4","Lev.10.6","Lev.10.7","Lev.10.9","Lev.10.12","Lev.10.13","Lev.10.14","Lev.10.17","Lev.10.18","Lev.11.2","Lev.11.3","Lev.11.4","Lev.11.8","Lev.11.9","Lev.11.11","Lev.11.13","Lev.11.21","Lev.11.22","Lev.11.24","Lev.11.33","Lev.11.42","Lev.11.43","Lev.11.44","Lev.11.45","Lev.14.34","Lev.15.2","Lev.15.31","Lev.16.29","Lev.16.30","Lev.16.31","Lev.17.14","Lev.18.3","Lev.18.4","Lev.18.5","Lev.18.6","Lev.18.24","Lev.18.26","Lev.18.30","Lev.19.2","Lev.19.3","Lev.19.4","Lev.19.5","Lev.19.11","Lev.19.12","Lev.19.15","Lev.19.19","Lev.19.23","Lev.19.25","Lev.19.26","Lev.19.27","Lev.19.28","Lev.19.30","Lev.19.31","Lev.19.33","Lev.19.34","Lev.19.35","Lev.19.37","Lev.20.7","Lev.20.8","Lev.20.15","Lev.20.22","Lev.20.23","Lev.20.24","Lev.20.25","Lev.20.26","Lev.22.20","Lev.22.22","Lev.22.24","Lev.22.25","Lev.22.28","Lev.22.29","Lev.22.30","Lev.22.31","Lev.22.32","Lev.23.2","Lev.23.3","Lev.23.4","Lev.23.6","Lev.23.7","Lev.23.8","Lev.23.10","Lev.23.12","Lev.23.14","Lev.23.15","Lev.23.16","Lev.23.17","Lev.23.18","Lev.23.19","Lev.23.21","Lev.23.25","Lev.23.27","Lev.23.28","Lev.23.31","Lev.23.32","Lev.23.35","Lev.23.36","Lev.23.37","Lev.23.38","Lev.23.39","Lev.23.40","Lev.23.41","Lev.23.42","Lev.25.2","Lev.25.9","Lev.25.10","Lev.25.11","Lev.25.12","Lev.25.13","Lev.25.14","Lev.25.17","Lev.25.18","Lev.25.19","Lev.25.20","Lev.25.22","Lev.25.24","Lev.25.44","Lev.25.45","Lev.25.46","Lev.26.1","Lev.26.2","Lev.26.3","Lev.26.5","Lev.26.6","Lev.26.7","Lev.26.10","Lev.26.12","Lev.26.14","Lev.26.15","Lev.26.16","Lev.26.17","Lev.26.18","Lev.26.21","Lev.26.23","Lev.26.25","Lev.26.26","Lev.26.27","Lev.26.29","Lev.26.38",
"Num.1.2","Num.1.3","Num.4.18","Num.4.19","Num.4.27","Num.4.32","Num.5.3","Num.6.23","Num.9.3","Num.9.8","Num.10.5","Num.10.6","Num.10.7","Num.10.9","Num.10.10","Num.11.18","Num.11.19","Num.11.20","Num.12.4","Num.12.6","Num.12.8","Num.13.2","Num.13.17","Num.13.18","Num.13.20","Num.14.9","Num.14.25","Num.14.28","Num.14.29","Num.14.30","Num.14.31","Num.14.34","Num.14.42","Num.14.43","Num.15.2","Num.15.3","Num.15.12","Num.15.14","Num.15.19","Num.15.20","Num.15.21","Num.15.22","Num.15.39","Num.15.40","Num.16.3","Num.16.6","Num.16.7","Num.16.8","Num.16.10","Num.16.11","Num.16.16","Num.16.17","Num.16.21","Num.16.24","Num.16.26","Num.16.28","Num.16.30","Num.16.38","Num.16.41","Num.16.45","Num.18.1","Num.18.5","Num.18.7","Num.18.26","Num.18.28","Num.18.29","Num.18.31","Num.18.32","Num.19.3","Num.20.4","Num.20.5","Num.20.8","Num.20.10","Num.20.12","Num.20.24","Num.21.5","Num.21.17","Num.21.27","Num.22.8","Num.22.13","Num.22.19","Num.25.5","Num.25.17","Num.26.2","Num.27.8","Num.27.9","Num.27.10","Num.27.11","Num.27.14","Num.28.2","Num.28.3","Num.28.11","Num.28.18","Num.28.19","Num.28.20","Num.28.23","Num.28.24","Num.28.25","Num.28.26","Num.28.27","Num.28.31","Num.29.1","Num.29.2","Num.29.7","Num.29.8","Num.29.12","Num.29.13","Num.29.35","Num.29.36","Num.29.39","Num.31.3","Num.31.4","Num.31.15","Num.31.17","Num.31.18","Num.31.19","Num.31.20","Num.31.23","Num.31.24","Num.31.29","Num.32.6","Num.32.7","Num.32.14","Num.32.15","Num.32.20","Num.32.22","Num.32.23","Num.32.24","Num.32.29","Num.33.52","Num.33.53","Num.33.54","Num.33.55","Num.34.7","Num.34.8","Num.34.10","Num.34.13","Num.34.18","Num.35.2","Num.35.4","Num.35.5","Num.35.6","Num.35.7","Num.35.8","Num.35.11","Num.35.13","Num.35.14","Num.35.31","Num.35.32","Num.35.33",
"Deut.1.7","Deut.1.8","Deut.1.13","Deut.1.14","Deut.1.16","Deut.1.17","Deut.1.18","Deut.1.19","Deut.1.20","Deut.1.22","Deut.1.26","Deut.1.27","Deut.1.29","Deut.1.31","Deut.1.33","Deut.1.39","Deut.1.40","Deut.1.41","Deut.1.42","Deut.1.43","Deut.1.45","Deut.1.46","Deut.2.3","Deut.2.4","Deut.2.5","Deut.2.6","Deut.2.13","Deut.2.24","Deut.3.18","Deut.3.20","Deut.3.22","Deut.4.1","Deut.4.2","Deut.4.6","Deut.4.11","Deut.4.15","Deut.4.16","Deut.4.22","Deut.4.23","Deut.4.25","Deut.4.26","Deut.4.27","Deut.4.28","Deut.4.29","Deut.5.1","Deut.5.5","Deut.5.23","Deut.5.24","Deut.5.30","Deut.5.32","Deut.5.33","Deut.6.3","Deut.6.14","Deut.6.16","Deut.6.17","Deut.7.5","Deut.7.12","Deut.7.25","Deut.8.1","Deut.8.19","Deut.8.20","Deut.9.7","Deut.9.8","Deut.9.16","Deut.9.18","Deut.9.21","Deut.9.22","Deut.9.23","Deut.9.24","Deut.10.16","Deut.10.19","Deut.11.2","Deut.11.8","Deut.11.9","Deut.11.10","Deut.11.13","Deut.11.16","Deut.11.17","Deut.11.18","Deut.11.19","Deut.11.22","Deut.11.23","Deut.11.25","Deut.11.27","Deut.11.28","Deut.11.31","Deut.11.32","Deut.12.1","Deut.12.2","Deut.12.3","Deut.12.4","Deut.12.5","Deut.12.6","Deut.12.7","Deut.12.8","Deut.12.9","Deut.12.10","Deut.12.11","Deut.12.12","Deut.12.16","Deut.12.32","Deut.13.4","Deut.13.13","Deut.14.1","Deut.14.4","Deut.14.6","Deut.14.7","Deut.14.8","Deut.14.9","Deut.14.10","Deut.14.11","Deut.14.12","Deut.14.20","Deut.14.21","Deut.17.16","Deut.18.15","Deut.19.19","Deut.20.3","Deut.20.18","Deut.22.24","Deut.24.8","Deut.27.2","Deut.27.4","Deut.28.62","Deut.28.63","Deut.28.68","Deut.29.2","Deut.29.6","Deut.29.7","Deut.29.9","Deut.29.16","Deut.29.17","Deut.30.18","Deut.31.5","Deut.31.6","Deut.31.14","Deut.31.19","Deut.31.26","Deut.31.27","Deut.31.28","Deut.31.29","Deut.32.1","Deut.32.3","Deut.32.6","Deut.32.7","Deut.32.39","Deut.32.43","Deut.32.46","Deut.32.47","Deut.32.51","Deut.33.16",
"Josh.1.11","Josh.1.14","Josh.1.15","Josh.2.1","Josh.2.5","Josh.2.10","Josh.2.12","Josh.2.13","Josh.2.14","Josh.2.16","Josh.3.3","Josh.3.4","Josh.3.5","Josh.3.6","Josh.3.8","Josh.3.9","Josh.3.10","Josh.3.12","Josh.4.2","Josh.4.3","Josh.4.5","Josh.4.7","Josh.4.17","Josh.4.22","Josh.4.24","Josh.6.3","Josh.6.4","Josh.6.6","Josh.6.7","Josh.6.10","Josh.6.16","Josh.6.18","Josh.6.22","Josh.7.2","Josh.7.12","Josh.7.13","Josh.7.14","Josh.8.2","Josh.8.4","Josh.8.7","Josh.8.8","Josh.9.6","Josh.9.8","Josh.9.11","Josh.9.22","Josh.10.4","Josh.10.18","Josh.10.19","Josh.10.22","Josh.10.24","Josh.10.25","Josh.18.4","Josh.18.6","Josh.18.8","Josh.20.2","Josh.22.2","Josh.22.3","Josh.22.4","Josh.22.5","Josh.22.8","Josh.22.16","Josh.22.18","Josh.22.19","Josh.22.28","Josh.22.31","Josh.23.3","Josh.23.4","Josh.23.5","Josh.23.6","Josh.23.7","Josh.23.8","Josh.23.11","Josh.23.12","Josh.23.13","Josh.23.14","Josh.23.16","Josh.24.6","Josh.24.7","Josh.24.8","Josh.24.11","Josh.24.13","Josh.24.14","Josh.24.15","Josh.24.19","Josh.24.20","Josh.24.22","Josh.24.23","Josh.24.27",
"Judg.2.2","Judg.3.28","Judg.5.2","Judg.5.3","Judg.5.9","Judg.5.10","Judg.5.23","Judg.6.10","Judg.6.31","Judg.7.15","Judg.7.17","Judg.7.18","Judg.7.24","Judg.8.5","Judg.8.15","Judg.8.18","Judg.8.19","Judg.8.24","Judg.9.2","Judg.9.7","Judg.9.15","Judg.9.16","Judg.9.18","Judg.9.19","Judg.9.28","Judg.9.48","Judg.10.12","Judg.10.13","Judg.10.14","Judg.11.7","Judg.11.26","Judg.12.2","Judg.12.3","Judg.14.2","Judg.14.12","Judg.14.13","Judg.14.15","Judg.14.18","Judg.15.7","Judg.15.10","Judg.15.12","Judg.16.18","Judg.16.25","Judg.18.2","Judg.18.6","Judg.18.9","Judg.18.10","Judg.18.14","Judg.18.24","Judg.19.5","Judg.19.9","Judg.19.23","Judg.19.24","Judg.19.30","Judg.20.3","Judg.20.7","Judg.20.13","Judg.20.23","Judg.20.28","Judg.21.10","Judg.21.11","Judg.21.20","Judg.21.21","Judg.21.22",
"Ruth.1.8","Ruth.1.9","Ruth.1.11","Ruth.1.12","Ruth.1.13","Ruth.1.20","Ruth.1.21","Ruth.2.15","Ruth.2.16","Ruth.4.2",
"1Sam.2.3","1Sam.2.23","1Sam.2.29","1Sam.4.9","1Sam.5.11","1Sam.6.2","1Sam.6.3","1Sam.6.5","1Sam.6.6","1Sam.6.7","1Sam.6.8","1Sam.6.9","1Sam.6.21","1Sam.7.3","1Sam.7.5","1Sam.8.17","1Sam.8.18","1Sam.8.22","1Sam.9.9","1Sam.9.13","1Sam.9.19","1Sam.10.14","1Sam.10.19","1Sam.10.24","1Sam.11.9","1Sam.11.10","1Sam.11.12","1Sam.11.14","1Sam.12.1","1Sam.12.3","1Sam.12.5","1Sam.12.7","1Sam.12.11","1Sam.12.12","1Sam.12.13","1Sam.12.14","1Sam.12.15","1Sam.12.16","1Sam.12.17","1Sam.12.20","1Sam.12.21","1Sam.12.24","1Sam.12.25","1Sam.13.9","1Sam.14.9","1Sam.14.10","1Sam.14.12","1Sam.14.17","1Sam.14.27","1Sam.14.29","1Sam.14.33","1Sam.14.34","1Sam.14.38","1Sam.14.40","1Sam.14.42","1Sam.15.3","1Sam.15.6","1Sam.15.32","1Sam.16.5","1Sam.16.17","1Sam.17.8","1Sam.17.9","1Sam.17.10","1Sam.17.25","1Sam.18.22","1Sam.18.25","1Sam.19.15","1Sam.21.14","1Sam.21.15","1Sam.22.7","1Sam.22.8","1Sam.22.13","1Sam.22.17","1Sam.23.21","1Sam.23.22","1Sam.23.23","1Sam.25.5","1Sam.25.6","1Sam.25.13","1Sam.25.19","1Sam.26.16","1Sam.27.10","1Sam.28.7","1Sam.29.10","1Sam.30.23",
"2Sam.1.20","2Sam.1.24","2Sam.2.5","2Sam.2.6","2Sam.2.7","2Sam.3.17","2Sam.3.18","2Sam.3.31","2Sam.3.38","2Sam.7.7","2Sam.10.5","2Sam.11.15","2Sam.11.20","2Sam.11.21","2Sam.13.9","2Sam.13.17","2Sam.13.28","2Sam.14.30","2Sam.15.10","2Sam.15.14","2Sam.15.28","2Sam.15.36","2Sam.16.11","2Sam.16.20","2Sam.17.16","2Sam.17.21","2Sam.18.12","2Sam.19.11","2Sam.19.12","2Sam.19.13","2Sam.19.22","2Sam.19.29","2Sam.20.16","2Sam.20.21","2Sam.21.3","2Sam.24.2",
"1Kgs.1.28","1Kgs.1.32","1Kgs.1.33","1Kgs.1.34","1Kgs.1.35","1Kgs.1.45","1Kgs.3.24","1Kgs.3.25","1Kgs.3.26","1Kgs.3.27","1Kgs.9.6","1Kgs.11.2","1Kgs.12.5","1Kgs.12.12","1Kgs.12.24","1Kgs.13.4","1Kgs.13.13","1Kgs.13.27","1Kgs.13.31","1Kgs.18.21","1Kgs.18.24","1Kgs.18.25","1Kgs.18.27","1Kgs.18.30","1Kgs.18.33","1Kgs.18.34","1Kgs.18.40","1Kgs.20.7","1Kgs.20.9","1Kgs.20.11","1Kgs.20.12","1Kgs.20.18","1Kgs.20.28","1Kgs.20.33","1Kgs.21.9","1Kgs.21.10","1Kgs.22.3","1Kgs.22.27","1Kgs.22.28","1Kgs.22.31",
"2Kgs.1.2","2Kgs.1.5","2Kgs.1.6","2Kgs.2.3","2Kgs.2.5","2Kgs.2.16","2Kgs.2.17","2Kgs.2.18","2Kgs.2.20","2Kgs.3.15","2Kgs.3.17","2Kgs.3.19","2Kgs.4.41","2Kgs.5.7","2Kgs.6.2","2Kgs.6.11","2Kgs.6.13","2Kgs.6.19","2Kgs.6.32","2Kgs.7.1","2Kgs.7.4","2Kgs.7.9","2Kgs.7.14","2Kgs.9.11","2Kgs.9.27","2Kgs.9.33","2Kgs.9.34","2Kgs.10.3","2Kgs.10.6","2Kgs.10.8","2Kgs.10.10","2Kgs.10.14","2Kgs.10.19","2Kgs.10.20","2Kgs.10.23","2Kgs.10.25","2Kgs.11.5","2Kgs.11.6","2Kgs.11.8","2Kgs.11.15","2Kgs.12.7","2Kgs.17.12","2Kgs.17.13","2Kgs.17.27","2Kgs.17.35","2Kgs.17.36","2Kgs.17.37","2Kgs.17.38","2Kgs.17.39","2Kgs.18.19","2Kgs.18.22","2Kgs.18.28","2Kgs.18.31","2Kgs.18.32","2Kgs.18.36","2Kgs.19.6","2Kgs.19.10","2Kgs.19.29","2Kgs.20.7","2Kgs.22.13","2Kgs.22.15","2Kgs.22.18","2Kgs.23.18","2Kgs.23.21","2Kgs.25.24",
"1Chr.12.17","1Chr.15.12","1Chr.16.8","1Chr.16.9","1Chr.16.10","1Chr.16.11","1Chr.16.12","1Chr.16.15","1Chr.16.22","1Chr.16.23","1Chr.16.24","1Chr.16.28","1Chr.16.29","1Chr.16.30","1Chr.16.34","1Chr.16.35","1Chr.17.6","1Chr.19.5","1Chr.21.2","1Chr.22.19","1Chr.28.2","1Chr.28.8","1Chr.29.20",
"2Chr.7.19","2Chr.10.5","2Chr.10.12","2Chr.11.4","2Chr.12.5","2Chr.13.4","2Chr.13.9","2Chr.13.11","2Chr.13.12","2Chr.15.2","2Chr.15.7","2Chr.18.14","2Chr.18.18","2Chr.18.25","2Chr.18.26","2Chr.18.27","2Chr.18.30","2Chr.19.6","2Chr.19.7","2Chr.19.9","2Chr.19.10","2Chr.19.11","2Chr.20.15","2Chr.20.16","2Chr.20.17","2Chr.20.20","2Chr.20.21","2Chr.23.4","2Chr.23.7","2Chr.23.14","2Chr.24.5","2Chr.24.20","2Chr.28.9","2Chr.28.11","2Chr.28.13","2Chr.29.5","2Chr.29.11","2Chr.29.31","2Chr.30.6","2Chr.30.7","2Chr.30.8","2Chr.30.9","2Chr.32.7","2Chr.32.12","2Chr.32.13","2Chr.32.15","2Chr.34.21","2Chr.34.23","2Chr.34.26","2Chr.35.3","2Chr.35.4","2Chr.35.5","2Chr.35.6","2Chr.35.23",
"Ezra.8.29","Ezra.9.12","Ezra.10.10","Ezra.10.11",
"Neh.1.8","Neh.1.9","Neh.2.17","Neh.4.12","Neh.4.14","Neh.4.20","Neh.5.8","Neh.5.9","Neh.5.11","Neh.7.3","Neh.8.9","Neh.8.10","Neh.8.11","Neh.8.15","Neh.9.5","Neh.13.21","Neh.13.25",
"Esth.4.14","Esth.4.16","Esth.5.5","Esth.7.10","Esth.8.8",
"Job.6.21","Job.6.22","Job.6.23","Job.6.24","Job.6.26","Job.6.27","Job.6.28","Job.6.29","Job.13.5","Job.13.6","Job.13.7","Job.13.8","Job.13.9","Job.13.10","Job.13.13","Job.13.17","Job.17.10","Job.18.2","Job.19.2","Job.19.3","Job.19.5","Job.19.6","Job.19.15","Job.19.21","Job.19.22","Job.19.28","Job.19.29","Job.21.2","Job.21.3","Job.21.5","Job.21.27","Job.21.28","Job.21.29","Job.21.34","Job.27.12","Job.32.11","Job.32.13","Job.34.2","Job.34.10","Job.37.2","Job.42.7","Job.42.8",
"Ps.2.10","Ps.2.11","Ps.2.12","Ps.4.2","Ps.4.3","Ps.4.4","Ps.4.5","Ps.6.8","Ps.9.11","Ps.11.1","Ps.14.6","Ps.22.23","Ps.24.7","Ps.24.9","Ps.27.8","Ps.29.1","Ps.29.2","Ps.30.4","Ps.31.23","Ps.31.24","Ps.32.9","Ps.32.11","Ps.33.1","Ps.33.2","Ps.33.3","Ps.34.3","Ps.34.8","Ps.34.9","Ps.34.11","Ps.46.8","Ps.46.10","Ps.47.1","Ps.47.6","Ps.47.7","Ps.48.12","Ps.48.13","Ps.49.1","Ps.50.5","Ps.50.22","Ps.58.1","Ps.58.2","Ps.62.3","Ps.62.8","Ps.62.10","Ps.66.1","Ps.66.2","Ps.66.3","Ps.66.5","Ps.66.8","Ps.66.16","Ps.68.4","Ps.68.13","Ps.68.16","Ps.68.26","Ps.68.32","Ps.68.34","Ps.71.11","Ps.75.4","Ps.75.5","Ps.76.11","Ps.78.1","Ps.81.1","Ps.81.2","Ps.81.3","Ps.82.2","Ps.82.3","Ps.82.4","Ps.82.7","Ps.83.4","Ps.90.3","Ps.94.8","Ps.95.1","Ps.95.6","Ps.95.7","Ps.95.8","Ps.96.1","Ps.96.2","Ps.96.3","Ps.96.7","Ps.96.8","Ps.96.9","Ps.96.10","Ps.97.7","Ps.97.10","Ps.97.12","Ps.98.1","Ps.98.4","Ps.98.5","Ps.98.6","Ps.99.5","Ps.99.9","Ps.100.1","Ps.100.2","Ps.100.3","Ps.100.4","Ps.103.20","Ps.103.21","Ps.103.22","Ps.105.1","Ps.105.2","Ps.105.3","Ps.105.4","Ps.105.5","Ps.105.15","Ps.106.1","Ps.107.1","Ps.113.1","Ps.114.6","Ps.115.10","Ps.115.11","Ps.117.1","Ps.118.1","Ps.118.19","Ps.118.27","Ps.118.29","Ps.119.115","Ps.122.6","Ps.134.1","Ps.134.2","Ps.135.1","Ps.135.3","Ps.135.19","Ps.135.20","Ps.136.1","Ps.136.2","Ps.136.3","Ps.136.26","Ps.137.3","Ps.137.7","Ps.139.19","Ps.146.3","Ps.147.7","Ps.148.1","Ps.148.2","Ps.148.3","Ps.148.4","Ps.148.7","Ps.149.1","Ps.150.1","Ps.150.2","Ps.150.3","Ps.150.4","Ps.150.5",
"Prov.1.22","Prov.1.23","Prov.1.24","Prov.1.25","Prov.4.1","Prov.4.2","Prov.5.7","Prov.7.24","Prov.8.5","Prov.8.6","Prov.8.10","Prov.8.32","Prov.8.33","Prov.9.5","Prov.9.6","Prov.31.6","Prov.31.31",
"Song.1.6","Song.2.5","Song.2.7","Song.2.15","Song.3.3","Song.3.5","Song.3.11","Song.5.1","Song.5.8","Song.6.13","Song.8.4",
"Isa.1.2","Isa.1.5","Isa.1.10","Isa.1.12","Isa.1.13","Isa.1.15","Isa.1.16","Isa.1.17","Isa.1.18","Isa.1.19","Isa.1.20","Isa.1.29","Isa.1.30","Isa.2.3","Isa.2.5","Isa.2.22","Isa.3.7","Isa.3.10","Isa.3.14","Isa.3.15","Isa.5.3","Isa.5.8","Isa.6.9","Isa.7.9","Isa.7.13","Isa.8.9","Isa.8.10","Isa.8.12","Isa.8.13","Isa.8.19","Isa.10.3","Isa.12.3","Isa.12.4","Isa.12.5","Isa.13.2","Isa.13.6","Isa.14.21","Isa.16.1","Isa.16.3","Isa.16.7","Isa.18.2","Isa.18.3","Isa.19.11","Isa.21.5","Isa.21.12","Isa.21.13","Isa.21.14","Isa.22.4","Isa.22.9","Isa.22.10","Isa.22.11","Isa.22.14","Isa.23.1","Isa.23.2","Isa.23.6","Isa.23.13","Isa.23.14","Isa.24.15","Isa.26.2","Isa.26.4","Isa.26.19","Isa.27.2","Isa.27.12","Isa.28.12","Isa.28.14","Isa.28.15","Isa.28.18","Isa.28.22","Isa.28.23","Isa.29.1","Isa.29.9","Isa.30.10","Isa.30.11","Isa.30.12","Isa.30.15","Isa.30.16","Isa.30.17","Isa.30.21","Isa.30.22","Isa.31.6","Isa.32.9","Isa.32.10","Isa.32.11","Isa.33.11","Isa.33.13","Isa.34.1","Isa.34.16","Isa.35.3","Isa.35.4","Isa.36.4","Isa.36.7","Isa.36.13","Isa.36.16","Isa.36.21","Isa.37.6","Isa.37.10","Isa.37.30","Isa.40.1","Isa.40.2","Isa.40.3","Isa.40.18","Isa.40.21","Isa.40.25","Isa.40.26","Isa.41.1","Isa.41.21","Isa.41.22","Isa.41.23","Isa.42.10","Isa.42.18","Isa.43.10","Isa.43.18","Isa.43.19","Isa.44.8","Isa.44.23","Isa.45.8","Isa.45.11","Isa.45.17","Isa.45.19","Isa.45.20","Isa.45.21","Isa.45.22","Isa.46.3","Isa.46.5","Isa.46.8","Isa.46.9","Isa.46.12","Isa.48.1","Isa.48.6","Isa.48.14","Isa.48.16","Isa.48.20","Isa.49.1","Isa.49.9","Isa.49.13","Isa.50.1","Isa.50.11","Isa.51.1","Isa.51.2","Isa.51.4","Isa.51.6","Isa.51.7","Isa.52.2","Isa.52.3","Isa.52.9","Isa.52.11","Isa.52.12","Isa.55.1","Isa.55.2","Isa.55.3","Isa.55.6","Isa.55.12","Isa.56.1","Isa.56.9","Isa.56.12","Isa.57.3","Isa.57.4","Isa.57.14","Isa.58.3","Isa.58.4","Isa.58.6","Isa.61.6","Isa.62.7","Isa.62.10","Isa.62.11","Isa.65.12","Isa.65.13","Isa.65.14","Isa.65.15","Isa.65.18","Isa.66.1","Isa.66.5","Isa.66.10","Isa.66.11","Isa.66.12","Isa.66.13","Isa.66.14",
"Jer.2.4","Jer.2.7","Jer.2.10","Jer.2.12","Jer.2.19","Jer.2.29","Jer.2.31","Jer.3.13","Jer.3.14","Jer.3.16","Jer.3.19","Jer.3.20","Jer.3.22","Jer.4.3","Jer.4.4","Jer.4.5","Jer.4.6","Jer.4.8","Jer.4.16","Jer.5.1","Jer.5.10","Jer.5.19","Jer.5.20","Jer.5.21","Jer.5.22","Jer.5.31","Jer.6.1","Jer.6.4","Jer.6.5","Jer.6.6","Jer.6.16","Jer.6.17","Jer.6.18","Jer.7.2","Jer.7.3","Jer.7.4","Jer.7.5","Jer.7.6","Jer.7.9","Jer.7.10","Jer.7.12","Jer.7.13","Jer.7.21","Jer.7.23","Jer.8.8","Jer.8.14","Jer.9.4","Jer.9.17","Jer.9.20","Jer.10.1","Jer.10.2","Jer.10.5","Jer.11.2","Jer.11.4","Jer.11.6","Jer.11.7","Jer.11.13","Jer.12.9","Jer.12.13","Jer.13.15","Jer.13.16","Jer.13.17","Jer.13.18","Jer.13.23","Jer.14.13","Jer.16.12","Jer.16.13","Jer.17.4","Jer.17.20","Jer.17.21","Jer.17.22","Jer.17.24","Jer.17.27","Jer.18.11","Jer.18.13","Jer.18.18","Jer.19.3","Jer.20.6","Jer.20.10","Jer.20.13","Jer.21.3","Jer.21.11","Jer.21.12","Jer.22.3","Jer.22.4","Jer.22.5","Jer.22.10","Jer.22.26","Jer.22.30","Jer.23.2","Jer.23.16","Jer.23.20","Jer.23.35","Jer.23.36","Jer.23.38","Jer.25.3","Jer.25.4","Jer.25.5","Jer.25.6","Jer.25.7","Jer.25.8","Jer.25.27","Jer.25.28","Jer.25.29","Jer.25.34","Jer.26.4","Jer.26.5","Jer.26.11","Jer.26.12","Jer.26.13","Jer.26.14","Jer.26.15","Jer.27.4","Jer.27.9","Jer.27.10","Jer.27.12","Jer.27.13","Jer.27.14","Jer.27.15","Jer.27.16","Jer.27.17","Jer.29.5","Jer.29.6","Jer.29.7","Jer.29.8","Jer.29.12","Jer.29.13","Jer.29.15","Jer.29.19","Jer.29.20","Jer.29.28","Jer.30.6","Jer.30.22","Jer.30.24","Jer.31.6","Jer.31.7","Jer.31.10","Jer.31.34","Jer.32.5","Jer.33.11","Jer.33.20","Jer.34.14","Jer.34.15","Jer.34.16","Jer.34.17","Jer.35.5","Jer.35.6","Jer.35.7","Jer.35.11","Jer.35.13","Jer.35.14","Jer.35.15","Jer.35.18","Jer.37.7","Jer.37.9","Jer.37.10","Jer.37.18","Jer.40.3","Jer.40.9","Jer.40.10","Jer.41.6","Jer.42.9","Jer.42.10","Jer.42.11","Jer.42.15","Jer.42.16","Jer.42.18","Jer.42.19","Jer.42.20","Jer.42.21","Jer.42.22","Jer.43.2","Jer.44.2","Jer.44.4","Jer.44.9","Jer.44.21","Jer.44.22","Jer.44.23","Jer.44.24","Jer.44.25","Jer.44.26","Jer.44.29","Jer.46.3","Jer.46.4","Jer.46.9","Jer.46.14","Jer.48.2","Jer.48.6","Jer.48.9","Jer.48.14","Jer.48.17","Jer.48.20","Jer.48.26","Jer.48.28","Jer.49.3","Jer.49.5","Jer.49.8","Jer.49.11","Jer.49.14","Jer.49.20","Jer.49.28","Jer.49.30","Jer.49.31","Jer.50.2","Jer.50.5","Jer.50.8","Jer.50.14","Jer.50.15","Jer.50.16","Jer.50.26","Jer.50.27","Jer.50.29","Jer.50.45","Jer.51.3","Jer.51.6","Jer.51.8","Jer.51.9","Jer.51.10","Jer.51.11","Jer.51.12","Jer.51.27","Jer.51.28","Jer.51.45","Jer.51.46","Jer.51.50",
"Lam.1.12","Lam.1.18","Lam.4.15",
"Ezek.5.7","Ezek.6.3","Ezek.6.6","Ezek.6.7","Ezek.6.13","Ezek.7.4","Ezek.7.9","Ezek.9.1","Ezek.9.5","Ezek.9.6","Ezek.9.7","Ezek.11.5","Ezek.11.6","Ezek.11.7","Ezek.11.8","Ezek.11.10","Ezek.11.11","Ezek.11.12","Ezek.11.15","Ezek.11.17","Ezek.12.20","Ezek.13.2","Ezek.13.5","Ezek.13.7","Ezek.13.8","Ezek.13.9","Ezek.13.11","Ezek.13.12","Ezek.13.14","Ezek.13.18","Ezek.13.19","Ezek.13.21","Ezek.13.23","Ezek.14.6","Ezek.14.8","Ezek.14.22","Ezek.14.23","Ezek.15.7","Ezek.17.12","Ezek.17.21","Ezek.18.19","Ezek.18.25","Ezek.18.30","Ezek.18.31","Ezek.18.32","Ezek.20.7","Ezek.20.18","Ezek.20.19","Ezek.20.20","Ezek.20.34","Ezek.20.38","Ezek.20.39","Ezek.20.41","Ezek.20.42","Ezek.20.43","Ezek.20.44","Ezek.21.24","Ezek.22.21","Ezek.22.22","Ezek.23.49","Ezek.24.21","Ezek.24.22","Ezek.24.23","Ezek.24.24","Ezek.25.3","Ezek.25.5","Ezek.30.2","Ezek.32.20","Ezek.33.10","Ezek.33.11","Ezek.33.20","Ezek.33.25","Ezek.33.26","Ezek.33.30","Ezek.34.3","Ezek.34.4","Ezek.34.7","Ezek.34.9","Ezek.34.18","Ezek.34.21","Ezek.35.9","Ezek.35.13","Ezek.36.1","Ezek.36.3","Ezek.36.4","Ezek.36.6","Ezek.36.8","Ezek.36.9","Ezek.36.11","Ezek.36.22","Ezek.36.23","Ezek.36.25","Ezek.36.27","Ezek.36.28","Ezek.36.30","Ezek.36.31","Ezek.36.32","Ezek.37.4","Ezek.37.5","Ezek.37.6","Ezek.37.7","Ezek.37.13","Ezek.37.14","Ezek.39.17","Ezek.39.18","Ezek.39.19","Ezek.39.20","Ezek.44.8","Ezek.44.28","Ezek.44.30","Ezek.45.1","Ezek.45.6","Ezek.45.9","Ezek.45.13","Ezek.45.20","Ezek.47.13","Ezek.47.14","Ezek.47.18","Ezek.47.21","Ezek.47.22","Ezek.47.23","Ezek.48.8","Ezek.48.9","Ezek.48.20","Ezek.48.29",
"Dan.1.10",
"Hos.2.1","Hos.2.2","Hos.4.1","Hos.4.15","Hos.4.18","Hos.5.1","Hos.5.8","Hos.6.1","Hos.9.5","Hos.10.8","Hos.10.12","Hos.10.13","Hos.14.2",
"Joel.1.2","Joel.1.3","Joel.1.5","Joel.1.13","Joel.1.14","Joel.2.1","Joel.2.12","Joel.2.13","Joel.2.15","Joel.2.16","Joel.2.19","Joel.2.22","Joel.2.23","Joel.2.26","Joel.2.27","Joel.3.5","Joel.3.6","Joel.3.7","Joel.3.9","Joel.3.10","Joel.3.11","Joel.3.13","Joel.3.17",
"Amos.2.12","Amos.3.1","Amos.3.9","Amos.3.13","Amos.4.1","Amos.4.3","Amos.4.4","Amos.4.5","Amos.4.6","Amos.4.8","Amos.4.9","Amos.4.10","Amos.4.11","Amos.5.1","Amos.5.4","Amos.5.5","Amos.5.6","Amos.5.11","Amos.5.14","Amos.5.15","Amos.5.22","Amos.5.25","Amos.5.26","Amos.6.2","Amos.6.3","Amos.6.12","Amos.8.4",
"Obad.1","Obad.13","Obad.16",
"Jonah.1.7","Jonah.1.12",
"Mic.1.2","Mic.1.10","Mic.2.3","Mic.2.6","Mic.2.8","Mic.2.9","Mic.2.10","Mic.3.1","Mic.3.9","Mic.4.2","Mic.6.1","Mic.6.2","Mic.6.9","Mic.6.16","Mic.7.5",
"Nah.1.9","Nah.2.8","Nah.2.9",
"Hab.1.5",
"Zeph.1.11","Zeph.2.1","Zeph.2.3","Zeph.3.8","Zeph.3.14",
"Hag.1.5","Hag.1.6","Hag.1.7","Hag.1.8","Hag.1.9","Hag.2.4","Hag.2.5","Hag.2.15","Hag.2.18",
"Zech.1.3","Zech.1.4","Zech.2.6","Zech.2.9","Zech.3.4","Zech.3.10","Zech.6.7","Zech.6.15","Zech.7.5","Zech.7.6","Zech.7.9","Zech.7.10","Zech.8.13","Zech.8.15","Zech.8.16","Zech.8.17","Zech.8.19","Zech.9.12","Zech.10.1","Zech.11.2","Zech.11.12","Zech.14.5",
"Mal.1.2","Mal.1.5","Mal.1.6","Mal.1.7","Mal.1.8","Mal.1.9","Mal.1.10","Mal.1.13","Mal.2.2","Mal.2.4","Mal.2.8","Mal.2.13","Mal.2.14","Mal.2.15","Mal.2.16","Mal.2.17","Mal.3.6","Mal.3.7","Mal.3.8","Mal.3.10","Mal.3.12","Mal.3.13","Mal.3.14","Mal.3.18","Mal.4.2","Mal.4.3","Mal.4.4",
// Logos @V??2?P
"Gen.1.29","Gen.9.2","Gen.9.3","Gen.9.5","Gen.9.9","Gen.9.10","Gen.9.11","Gen.9.12","Gen.9.15","Gen.17.12","Gen.17.13","Gen.23.9","Gen.27.45","Gen.29.4","Gen.31.5","Gen.31.7","Gen.31.9","Gen.31.29","Gen.34.16","Gen.37.7","Gen.40.7","Gen.42.14","Gen.43.14","Gen.44.19","Gen.45.7","Gen.45.12","Gen.45.20","Gen.46.33","Gen.47.3","Gen.48.21","Gen.50.24",
"Exod.3.13","Exod.3.14","Exod.3.15","Exod.3.16","Exod.3.17","Exod.3.19","Exod.3.20","Exod.5.10","Exod.5.17","Exod.6.6","Exod.6.8","Exod.7.4","Exod.10.5","Exod.10.16","Exod.11.1","Exod.11.9","Exod.12.2","Exod.12.6","Exod.12.13","Exod.12.16","Exod.12.19","Exod.12.23","Exod.12.26","Exod.12.49","Exod.13.4","Exod.16.4","Exod.16.8","Exod.16.15","Exod.16.32","Exod.16.33","Exod.18.10","Exod.22.24","Exod.23.21","Exod.23.31","Exod.24.8","Exod.26.33","Exod.29.42","Exod.30.8","Exod.30.10","Exod.30.15","Exod.30.16","Exod.30.31","Exod.30.36","Exod.32.13","Exod.33.5","Exod.35.2","Exod.35.10",
"Lev.6.18","Lev.8.34","Lev.9.4","Lev.11.5","Lev.11.6","Lev.11.7","Lev.11.10","Lev.11.12","Lev.11.20","Lev.11.23","Lev.11.26","Lev.11.27","Lev.11.28","Lev.11.29","Lev.11.31","Lev.11.35","Lev.11.38","Lev.11.39","Lev.16.34","Lev.17.11","Lev.17.12","Lev.18.2","Lev.18.27","Lev.18.28","Lev.19.6","Lev.19.9","Lev.19.10","Lev.19.36","Lev.20.14","Lev.21.8","Lev.22.3","Lev.22.19","Lev.22.33","Lev.23.11","Lev.23.22","Lev.23.24","Lev.23.43","Lev.24.3","Lev.24.22","Lev.25.6","Lev.25.21","Lev.25.23","Lev.25.38","Lev.25.55","Lev.26.4","Lev.26.8","Lev.26.9","Lev.26.11","Lev.26.13","Lev.26.19","Lev.26.20","Lev.26.22","Lev.26.24","Lev.26.28","Lev.26.30","Lev.26.31","Lev.26.32","Lev.26.33","Lev.26.34","Lev.26.35","Lev.26.36","Lev.26.37","Lev.26.39",
"Num.1.4","Num.1.5","Num.9.10","Num.9.14","Num.10.8","Num.10.29","Num.14.32","Num.14.33","Num.14.41","Num.15.15","Num.15.16","Num.15.18","Num.15.23","Num.15.29","Num.15.41","Num.16.9","Num.17.4","Num.17.5","Num.18.3","Num.18.4","Num.18.6","Num.18.23","Num.18.27","Num.18.30","Num.25.18","Num.28.22","Num.28.30","Num.29.5","Num.32.8","Num.32.21","Num.32.30","Num.33.51","Num.33.56","Num.34.2","Num.34.3","Num.34.4","Num.34.6","Num.34.9","Num.34.12","Num.34.17","Num.35.10","Num.35.12","Num.35.29","Num.35.34",
"Deut.1.6","Deut.1.9","Deut.1.10","Deut.1.11","Deut.1.12","Deut.1.15","Deut.1.23","Deut.1.30","Deut.1.32","Deut.1.34","Deut.1.35","Deut.1.37","Deut.1.44","Deut.3.19","Deut.3.21","Deut.3.26","Deut.4.3","Deut.4.4","Deut.4.5","Deut.4.8","Deut.4.12","Deut.4.13","Deut.4.14","Deut.4.20","Deut.4.21","Deut.4.34","Deut.5.4","Deut.5.22","Deut.5.28","Deut.6.1","Deut.6.20","Deut.7.4","Deut.7.7","Deut.7.8","Deut.9.9","Deut.9.10","Deut.9.17","Deut.9.19","Deut.9.25","Deut.10.4","Deut.10.15","Deut.10.17","Deut.11.4","Deut.11.5","Deut.11.7","Deut.11.11","Deut.11.14","Deut.11.21","Deut.11.24","Deut.11.26","Deut.13.3","Deut.13.5","Deut.13.7","Deut.14.19","Deut.20.2","Deut.20.4","Deut.23.4","Deut.24.9","Deut.25.17","Deut.27.1","Deut.27.12","Deut.28.14","Deut.29.4","Deut.29.5","Deut.29.10","Deut.29.11","Deut.29.14","Deut.29.18","Deut.29.22","Deut.30.19","Deut.31.12","Deut.31.13","Deut.32.17","Deut.32.38",
"Josh.1.3","Josh.1.4","Josh.1.13","Josh.2.9","Josh.2.11","Josh.2.21","Josh.3.11","Josh.4.6","Josh.4.21","Josh.4.23","Josh.5.9","Josh.6.5","Josh.9.12","Josh.9.23","Josh.9.24","Josh.15.4","Josh.18.3","Josh.18.7","Josh.20.3","Josh.22.24","Josh.22.25","Josh.22.27","Josh.23.9","Josh.23.10","Josh.23.15","Josh.24.2","Josh.24.3","Josh.24.5","Josh.24.9","Josh.24.10","Josh.24.12",
"Judg.2.1","Judg.2.3","Judg.6.8","Judg.6.9","Judg.7.7","Judg.8.2","Judg.8.3","Judg.8.7","Judg.8.23","Judg.9.17","Judg.11.9","Judg.12.4","Judg.18.8","Judg.18.18","Judg.18.25","Judg.20.12",
"Ruth.2.4","Ruth.4.9","Ruth.4.10",
"1Sam.6.4","1Sam.8.11","1Sam.8.13","1Sam.8.14","1Sam.8.15","1Sam.8.16","1Sam.10.2","1Sam.10.15","1Sam.10.18","1Sam.11.2","1Sam.12.2","1Sam.12.6","1Sam.12.8","1Sam.12.22","1Sam.12.23","1Sam.17.47","1Sam.18.23","1Sam.22.3","1Sam.30.24","1Sam.30.26",
"2Sam.1.21","2Sam.4.11","2Sam.7.23","2Sam.15.27","2Sam.16.10","2Sam.18.2","2Sam.18.4","2Sam.19.10","2Sam.21.4",
"1Kgs.8.61","1Kgs.12.6","1Kgs.12.9","1Kgs.12.11","1Kgs.12.14","1Kgs.12.28","1Kgs.18.18",
"2Kgs.1.3","2Kgs.1.7","2Kgs.3.18","2Kgs.7.12","2Kgs.9.15","2Kgs.10.2","2Kgs.10.9","2Kgs.10.13","2Kgs.10.24","2Kgs.11.7","2Kgs.18.27","2Kgs.18.29","2Kgs.18.30",
"1Chr.13.2","1Chr.15.13","1Chr.16.18","1Chr.16.19","1Chr.22.18",
"2Chr.10.6","2Chr.10.9","2Chr.10.11","2Chr.10.14","2Chr.13.5","2Chr.13.8","2Chr.28.10","2Chr.29.8","2Chr.32.10","2Chr.32.11","2Chr.32.14","2Chr.33.8","2Chr.36.23",
"Ezra.1.3","Ezra.4.2","Ezra.4.3","Ezra.8.28","Ezra.9.11",
"Neh.2.19","Neh.2.20","Neh.5.7","Neh.6.3","Neh.13.17","Neh.13.18","Neh.13.27",
"Job.6.25","Job.12.2","Job.12.3","Job.13.2","Job.13.4","Job.13.11","Job.13.12","Job.16.2","Job.16.4","Job.16.5","Job.18.3","Job.27.5","Job.27.11","Job.32.6","Job.32.12","Job.32.14",
"Ps.22.26","Ps.58.9","Ps.69.32","Ps.82.6","Ps.95.9","Ps.105.11","Ps.115.14","Ps.115.15","Ps.118.26","Ps.127.2","Ps.129.8",
"Prov.1.26","Prov.1.27","Prov.8.4",
"Isa.1.7","Isa.1.11","Isa.1.14","Isa.5.5","Isa.7.14","Isa.21.10","Isa.23.7","Isa.28.19","Isa.29.10","Isa.29.11","Isa.29.16","Isa.30.3","Isa.30.13","Isa.30.18","Isa.30.20","Isa.30.29","Isa.31.7","Isa.32.20","Isa.33.4","Isa.36.12","Isa.36.14","Isa.36.15","Isa.36.17","Isa.36.18","Isa.40.9","Isa.41.24","Isa.41.26","Isa.42.9","Isa.42.17","Isa.42.23","Isa.43.12","Isa.43.14","Isa.43.15","Isa.46.1","Isa.50.10","Isa.51.12","Isa.55.8","Isa.55.9","Isa.59.2","Isa.59.3","Isa.61.5","Isa.61.7","Isa.62.6","Isa.65.7","Isa.65.11","Isa.66.20","Isa.66.22",
"Jer.2.5","Jer.2.9","Jer.2.30","Jer.3.12","Jer.3.15","Jer.3.18","Jer.4.10","Jer.5.14","Jer.5.15","Jer.5.18","Jer.5.25","Jer.6.20","Jer.7.7","Jer.7.8","Jer.7.11","Jer.7.14","Jer.7.15","Jer.7.22","Jer.7.25","Jer.8.17","Jer.11.5","Jer.13.20","Jer.14.14","Jer.15.14","Jer.16.9","Jer.16.11","Jer.17.1","Jer.18.6","Jer.21.4","Jer.21.5","Jer.21.8","Jer.21.9","Jer.21.14","Jer.23.17","Jer.23.33","Jer.23.39","Jer.23.40","Jer.29.9","Jer.29.10","Jer.29.11","Jer.29.14","Jer.29.16","Jer.29.21","Jer.29.27","Jer.29.31","Jer.32.36","Jer.32.43","Jer.33.10","Jer.34.13","Jer.34.21","Jer.36.19","Jer.37.19","Jer.38.5","Jer.42.4","Jer.42.12","Jer.42.13","Jer.44.3","Jer.44.7","Jer.44.8","Jer.44.10","Jer.44.11","Jer.50.12","Jer.51.24",
"Ezek.5.16","Ezek.5.17","Ezek.6.4","Ezek.6.5","Ezek.6.8","Ezek.6.9","Ezek.11.9","Ezek.11.19","Ezek.12.11","Ezek.12.22","Ezek.12.25","Ezek.13.15","Ezek.13.20","Ezek.16.45","Ezek.16.55","Ezek.18.2","Ezek.18.3","Ezek.18.29","Ezek.20.3","Ezek.20.5","Ezek.20.27","Ezek.20.29","Ezek.20.30","Ezek.20.31","Ezek.20.32","Ezek.20.33","Ezek.20.35","Ezek.20.36","Ezek.20.37","Ezek.20.40","Ezek.22.19","Ezek.22.20","Ezek.23.48","Ezek.34.17","Ezek.34.19","Ezek.34.31","Ezek.36.2","Ezek.36.7","Ezek.36.10","Ezek.36.12","Ezek.36.13","Ezek.36.24","Ezek.36.26","Ezek.36.29","Ezek.36.33","Ezek.36.36","Ezek.37.12","Ezek.37.25","Ezek.43.27","Ezek.44.6","Ezek.44.7","Ezek.45.10","Ezek.45.12","Ezek.45.21",
"Dan.10.21",
"Hos.1.9","Hos.1.10","Hos.4.13","Hos.4.14","Hos.5.13","Hos.6.4","Hos.9.10","Hos.10.15",
"Joel.2.14","Joel.2.20","Joel.2.25","Joel.2.28","Joel.3.4","Joel.3.8",
"Amos.2.10","Amos.2.11","Amos.2.13","Amos.3.2","Amos.4.2","Amos.4.7","Amos.5.12","Amos.5.18","Amos.5.21","Amos.5.27","Amos.6.14","Amos.8.10","Amos.9.7",
"Mic.1.11","Mic.2.4","Mic.3.6","Mic.3.12",
"Zeph.2.2","Zeph.2.5","Zeph.2.12","Zeph.3.20",
"Hag.1.4","Hag.1.10","Hag.1.13","Hag.2.3","Hag.2.17",
"Zech.1.2","Zech.1.5","Zech.1.6","Zech.2.8","Zech.4.9","Zech.8.9","Zech.8.14","Zech.8.23","Zech.11.9",
"Mal.1.12","Mal.2.1","Mal.2.3","Mal.2.9","Mal.3.1","Mal.3.5","Mal.3.9","Mal.3.11","Mal.4.5",
	
// Python script over SBL GNT	
"Matt.2.8","Matt.3.2","Matt.3.3","Matt.3.7","Matt.3.8","Matt.3.9","Matt.3.11","Matt.4.17","Matt.4.19","Matt.5.11","Matt.5.12","Matt.5.13","Matt.5.14","Matt.5.16","Matt.5.17","Matt.5.18","Matt.5.20","Matt.5.21","Matt.5.22","Matt.5.27","Matt.5.28","Matt.5.32","Matt.5.33","Matt.5.34","Matt.5.37","Matt.5.38","Matt.5.39","Matt.5.43","Matt.5.44","Matt.5.45","Matt.5.46","Matt.5.47","Matt.5.48","Matt.6.1","Matt.6.2","Matt.6.5","Matt.6.7","Matt.6.8","Matt.6.9","Matt.6.14","Matt.6.15","Matt.6.16","Matt.6.19","Matt.6.20","Matt.6.24","Matt.6.25","Matt.6.26","Matt.6.27","Matt.6.28","Matt.6.29","Matt.6.30","Matt.6.31","Matt.6.32","Matt.6.33","Matt.6.34","Matt.7.1","Matt.7.2","Matt.7.6","Matt.7.7","Matt.7.9","Matt.7.11","Matt.7.12","Matt.7.13","Matt.7.15","Matt.7.16","Matt.7.20","Matt.7.23","Matt.8.10","Matt.8.11","Matt.8.26","Matt.8.32","Matt.9.4","Matt.9.6","Matt.9.11","Matt.9.13","Matt.9.24","Matt.9.28","Matt.9.29","Matt.9.30","Matt.9.38","Matt.10.5","Matt.10.6","Matt.10.7","Matt.10.8","Matt.10.9","Matt.10.11","Matt.10.12","Matt.10.13","Matt.10.14","Matt.10.15","Matt.10.16","Matt.10.17","Matt.10.18","Matt.10.19","Matt.10.20","Matt.10.22","Matt.10.23","Matt.10.26","Matt.10.27","Matt.10.28","Matt.10.29","Matt.10.30","Matt.10.31","Matt.10.34","Matt.10.40","Matt.10.42","Matt.11.4","Matt.11.7","Matt.11.8","Matt.11.9","Matt.11.11","Matt.11.14","Matt.11.17","Matt.11.21","Matt.11.22","Matt.11.24","Matt.11.28","Matt.11.29","Matt.12.3","Matt.12.5","Matt.12.6","Matt.12.7","Matt.12.11","Matt.12.27","Matt.12.28","Matt.12.31","Matt.12.33","Matt.12.34","Matt.12.36","Matt.13.11","Matt.13.14","Matt.13.16","Matt.13.17","Matt.13.18","Matt.13.29","Matt.13.30","Matt.13.51","Matt.14.16","Matt.14.18","Matt.14.27","Matt.15.3","Matt.15.5","Matt.15.6","Matt.15.7","Matt.15.10","Matt.15.14","Matt.15.16","Matt.15.17","Matt.15.34","Matt.16.2","Matt.16.3","Matt.16.6","Matt.16.8","Matt.16.9","Matt.16.10","Matt.16.11","Matt.16.15","Matt.16.28","Matt.17.5","Matt.17.7","Matt.17.9","Matt.17.12","Matt.17.17","Matt.17.20","Matt.17.24","Matt.18.3","Matt.18.10","Matt.18.12","Matt.18.13","Matt.18.14","Matt.18.18","Matt.18.19","Matt.18.35","Matt.19.4","Matt.19.8","Matt.19.9","Matt.19.14","Matt.19.23","Matt.19.24","Matt.19.28","Matt.20.4","Matt.20.6","Matt.20.7","Matt.20.22","Matt.20.23","Matt.20.25","Matt.20.26","Matt.20.27","Matt.20.32","Matt.21.2","Matt.21.3","Matt.21.5","Matt.21.13","Matt.21.16","Matt.21.21","Matt.21.22","Matt.21.24","Matt.21.25","Matt.21.27","Matt.21.28","Matt.21.31","Matt.21.32","Matt.21.33","Matt.21.42","Matt.21.43","Matt.22.4","Matt.22.9","Matt.22.13","Matt.22.18","Matt.22.19","Matt.22.21","Matt.22.29","Matt.22.31","Matt.22.42","Matt.23.3","Matt.23.8","Matt.23.9","Matt.23.10","Matt.23.11","Matt.23.13","Matt.23.15","Matt.23.16","Matt.23.23","Matt.23.25","Matt.23.27","Matt.23.28","Matt.23.29","Matt.23.30","Matt.23.31","Matt.23.32","Matt.23.33","Matt.23.34","Matt.23.35","Matt.23.36","Matt.23.37","Matt.23.38","Matt.23.39","Matt.24.2","Matt.24.4","Matt.24.6","Matt.24.9","Matt.24.15","Matt.24.20","Matt.24.23","Matt.24.25","Matt.24.26","Matt.24.32","Matt.24.33","Matt.24.34","Matt.24.42","Matt.24.43","Matt.24.44","Matt.24.47","Matt.25.6","Matt.25.8","Matt.25.9","Matt.25.12","Matt.25.13","Matt.25.28","Matt.25.30","Matt.25.34","Matt.25.35","Matt.25.36","Matt.25.40","Matt.25.41","Matt.25.42","Matt.25.43","Matt.25.45","Matt.26.2","Matt.26.10","Matt.26.11","Matt.26.13","Matt.26.15","Matt.26.18","Matt.26.21","Matt.26.26","Matt.26.27","Matt.26.29","Matt.26.31","Matt.26.32","Matt.26.36","Matt.26.38","Matt.26.40","Matt.26.41","Matt.26.45","Matt.26.46","Matt.26.48","Matt.26.55","Matt.26.64","Matt.26.65","Matt.26.66","Matt.27.17","Matt.27.21","Matt.27.24","Matt.27.65","Matt.28.5","Matt.28.6","Matt.28.7","Matt.28.9","Matt.28.10","Matt.28.13","Matt.28.14","Matt.28.19","Matt.28.20",
"Mark.1.3","Mark.1.8","Mark.1.15","Mark.1.17","Mark.2.8","Mark.2.10","Mark.2.25","Mark.3.28","Mark.4.3","Mark.4.11","Mark.4.13","Mark.4.24","Mark.4.40","Mark.5.39","Mark.6.9","Mark.6.10","Mark.6.11","Mark.6.31","Mark.6.37","Mark.6.38","Mark.6.50","Mark.7.6","Mark.7.8","Mark.7.9","Mark.7.11","Mark.7.12","Mark.7.13","Mark.7.14","Mark.7.18","Mark.8.5","Mark.8.12","Mark.8.15","Mark.8.17","Mark.8.18","Mark.8.19","Mark.8.20","Mark.8.21","Mark.8.29","Mark.9.1","Mark.9.7","Mark.9.13","Mark.9.16","Mark.9.19","Mark.9.33","Mark.9.39","Mark.9.41","Mark.9.50","Mark.10.3","Mark.10.5","Mark.10.14","Mark.10.15","Mark.10.29","Mark.10.36","Mark.10.38","Mark.10.39","Mark.10.42","Mark.10.43","Mark.10.44","Mark.10.49","Mark.11.2","Mark.11.3","Mark.11.5","Mark.11.17","Mark.11.22","Mark.11.23","Mark.11.24","Mark.11.25","Mark.11.29","Mark.11.30","Mark.11.31","Mark.11.33","Mark.12.10","Mark.12.15","Mark.12.17","Mark.12.24","Mark.12.26","Mark.12.27","Mark.12.38","Mark.12.43","Mark.13.5","Mark.13.7","Mark.13.9","Mark.13.11","Mark.13.13","Mark.13.14","Mark.13.18","Mark.13.21","Mark.13.23","Mark.13.28","Mark.13.29","Mark.13.30","Mark.13.33","Mark.13.35","Mark.13.36","Mark.13.37","Mark.14.6","Mark.14.7","Mark.14.9","Mark.14.13","Mark.14.14","Mark.14.15","Mark.14.18","Mark.14.22","Mark.14.25","Mark.14.27","Mark.14.28","Mark.14.32","Mark.14.34","Mark.14.38","Mark.14.41","Mark.14.42","Mark.14.44","Mark.14.48","Mark.14.49","Mark.14.62","Mark.14.64","Mark.14.71","Mark.15.9","Mark.15.12","Mark.15.36","Mark.16.6","Mark.16.7","Mark.16.15",
"Luke.2.10","Luke.2.11","Luke.2.12","Luke.2.49","Luke.3.4","Luke.3.7","Luke.3.8","Luke.3.13","Luke.3.14","Luke.3.16","Luke.4.21","Luke.4.23","Luke.4.24","Luke.4.25","Luke.5.4","Luke.5.22","Luke.5.24","Luke.5.30","Luke.5.34","Luke.6.2","Luke.6.3","Luke.6.9","Luke.6.21","Luke.6.22","Luke.6.23","Luke.6.24","Luke.6.25","Luke.6.26","Luke.6.27","Luke.6.28","Luke.6.31","Luke.6.32","Luke.6.33","Luke.6.34","Luke.6.35","Luke.6.36","Luke.6.37","Luke.6.38","Luke.6.46","Luke.6.47","Luke.7.9","Luke.7.22","Luke.7.24","Luke.7.25","Luke.7.26","Luke.7.28","Luke.7.32","Luke.7.33","Luke.7.34","Luke.8.10","Luke.8.18","Luke.8.25","Luke.8.52","Luke.9.3","Luke.9.4","Luke.9.5","Luke.9.13","Luke.9.14","Luke.9.20","Luke.9.27","Luke.9.35","Luke.9.41","Luke.9.44","Luke.9.48","Luke.9.50","Luke.10.2","Luke.10.3","Luke.10.4","Luke.10.5","Luke.10.6","Luke.10.7","Luke.10.8","Luke.10.9","Luke.10.10","Luke.10.11","Luke.10.12","Luke.10.13","Luke.10.14","Luke.10.16","Luke.10.19","Luke.10.20","Luke.10.23","Luke.10.24","Luke.11.2","Luke.11.5","Luke.11.8","Luke.11.9","Luke.11.11","Luke.11.13","Luke.11.18","Luke.11.19","Luke.11.20","Luke.11.39","Luke.11.41","Luke.11.42","Luke.11.43","Luke.11.44","Luke.11.46","Luke.11.47","Luke.11.48","Luke.11.51","Luke.11.52","Luke.12.1","Luke.12.3","Luke.12.4","Luke.12.5","Luke.12.7","Luke.12.8","Luke.12.11","Luke.12.12","Luke.12.14","Luke.12.15","Luke.12.22","Luke.12.24","Luke.12.25","Luke.12.26","Luke.12.27","Luke.12.28","Luke.12.29","Luke.12.30","Luke.12.31","Luke.12.32","Luke.12.33","Luke.12.34","Luke.12.35","Luke.12.36","Luke.12.37","Luke.12.39","Luke.12.40","Luke.12.44","Luke.12.51","Luke.12.54","Luke.12.55","Luke.12.56","Luke.12.57","Luke.13.2","Luke.13.3","Luke.13.4","Luke.13.5","Luke.13.14","Luke.13.15","Luke.13.24","Luke.13.25","Luke.13.26","Luke.13.27","Luke.13.28","Luke.13.32","Luke.13.34","Luke.13.35","Luke.14.5","Luke.14.17","Luke.14.24","Luke.14.28","Luke.14.33","Luke.15.4","Luke.15.6","Luke.15.7","Luke.15.9","Luke.15.10","Luke.15.22","Luke.15.23","Luke.16.9","Luke.16.11","Luke.16.12","Luke.16.13","Luke.16.15","Luke.16.26","Luke.17.3","Luke.17.6","Luke.17.7","Luke.17.10","Luke.17.14","Luke.17.21","Luke.17.22","Luke.17.23","Luke.17.32","Luke.17.34","Luke.18.6","Luke.18.8","Luke.18.14","Luke.18.16","Luke.18.17","Luke.18.29","Luke.19.13","Luke.19.24","Luke.19.26","Luke.19.27","Luke.19.30","Luke.19.31","Luke.19.33","Luke.19.40","Luke.19.46","Luke.20.3","Luke.20.5","Luke.20.8","Luke.20.24","Luke.20.25","Luke.20.46","Luke.21.3","Luke.21.6","Luke.21.8","Luke.21.9","Luke.21.12","Luke.21.13","Luke.21.14","Luke.21.15","Luke.21.16","Luke.21.17","Luke.21.18","Luke.21.19","Luke.21.20","Luke.21.28","Luke.21.29","Luke.21.30","Luke.21.31","Luke.21.32","Luke.21.34","Luke.21.36","Luke.22.8","Luke.22.10","Luke.22.11","Luke.22.12","Luke.22.15","Luke.22.16","Luke.22.17","Luke.22.18","Luke.22.19","Luke.22.20","Luke.22.26","Luke.22.27","Luke.22.28","Luke.22.29","Luke.22.30","Luke.22.31","Luke.22.35","Luke.22.37","Luke.22.40","Luke.22.46","Luke.22.51","Luke.22.52","Luke.22.53","Luke.22.67","Luke.22.68","Luke.22.70","Luke.23.14","Luke.23.28","Luke.23.30","Luke.24.5","Luke.24.6","Luke.24.17","Luke.24.38","Luke.24.39","Luke.24.41","Luke.24.44","Luke.24.48","Luke.24.49",
"John.1.23","John.1.26","John.1.38","John.1.39","John.1.51","John.2.5","John.2.7","John.2.8","John.2.16","John.2.19","John.3.7","John.3.11","John.3.12","John.3.28","John.4.20","John.4.21","John.4.22","John.4.29","John.4.32","John.4.35","John.4.38","John.4.48","John.5.19","John.5.20","John.5.24","John.5.25","John.5.28","John.5.33","John.5.34","John.5.35","John.5.37","John.5.38","John.5.39","John.5.40","John.5.42","John.5.43","John.5.44","John.5.45","John.5.46","John.5.47","John.6.10","John.6.12","John.6.20","John.6.26","John.6.27","John.6.29","John.6.32","John.6.36","John.6.43","John.6.47","John.6.49","John.6.53","John.6.61","John.6.62","John.6.63","John.6.64","John.6.65","John.6.67","John.6.70","John.7.7","John.7.8","John.7.19","John.7.21","John.7.22","John.7.23","John.7.24","John.7.28","John.7.33","John.7.34","John.7.36","John.7.45","John.7.47","John.8.14","John.8.15","John.8.19","John.8.21","John.8.22","John.8.23","John.8.24","John.8.25","John.8.26","John.8.28","John.8.31","John.8.32","John.8.33","John.8.34","John.8.36","John.8.37","John.8.38","John.8.39","John.8.40","John.8.41","John.8.42","John.8.43","John.8.44","John.8.45","John.8.46","John.8.47","John.8.49","John.8.51","John.8.54","John.8.55","John.8.56","John.8.58","John.9.19","John.9.21","John.9.23","John.9.27","John.9.30","John.9.41","John.10.1","John.10.7","John.10.20","John.10.25","John.10.26","John.10.32","John.10.34","John.10.36","John.10.37","John.10.38","John.11.15","John.11.34","John.11.39","John.11.44","John.11.49","John.11.50","John.11.56","John.12.8","John.12.19","John.12.24","John.12.30","John.12.35","John.12.36","John.13.10","John.13.11","John.13.12","John.13.13","John.13.14","John.13.15","John.13.16","John.13.17","John.13.18","John.13.19","John.13.20","John.13.21","John.13.33","John.13.34","John.13.35","John.14.1","John.14.2","John.14.3","John.14.4","John.14.7","John.14.9","John.14.10","John.14.11","John.14.12","John.14.13","John.14.14","John.14.15","John.14.16","John.14.17","John.14.18","John.14.19","John.14.20","John.14.24","John.14.25","John.14.26","John.14.27","John.14.28","John.14.29","John.14.30","John.14.31","John.15.3","John.15.4","John.15.5","John.15.7","John.15.8","John.15.9","John.15.10","John.15.11","John.15.12","John.15.14","John.15.15","John.15.16","John.15.17","John.15.18","John.15.19","John.15.20","John.15.21","John.15.26","John.15.27","John.16.1","John.16.2","John.16.4","John.16.5","John.16.6","John.16.7","John.16.10","John.16.12","John.16.13","John.16.14","John.16.15","John.16.16","John.16.17","John.16.19","John.16.20","John.16.22","John.16.23","John.16.24","John.16.25","John.16.26","John.16.27","John.16.31","John.16.32","John.16.33","John.18.4","John.18.7","John.18.8","John.18.29","John.18.31","John.18.39","John.19.4","John.19.6","John.19.14","John.19.15","John.19.35","John.20.17","John.20.19","John.20.21","John.20.22","John.20.23","John.20.26","John.20.31","John.21.5","John.21.6","John.21.10","John.21.12",
"Acts.1.4","Acts.1.5","Acts.1.7","Acts.1.8","Acts.1.11","Acts.2.14","Acts.2.15","Acts.2.17","Acts.2.22","Acts.2.23","Acts.2.29","Acts.2.33","Acts.2.36","Acts.2.38","Acts.2.39","Acts.2.40","Acts.3.12","Acts.3.13","Acts.3.14","Acts.3.15","Acts.3.16","Acts.3.17","Acts.3.19","Acts.3.20","Acts.3.22","Acts.3.25","Acts.3.26","Acts.4.7","Acts.4.10","Acts.4.11","Acts.4.19","Acts.5.8","Acts.5.9","Acts.5.20","Acts.5.25","Acts.5.28","Acts.5.30","Acts.5.35","Acts.5.38","Acts.5.39","Acts.6.3","Acts.7.2","Acts.7.4","Acts.7.26","Acts.7.37","Acts.7.42","Acts.7.43","Acts.7.49","Acts.7.51","Acts.7.52","Acts.7.53","Acts.8.19","Acts.8.24","Acts.10.21","Acts.10.28","Acts.10.29","Acts.10.37","Acts.11.16","Acts.12.17","Acts.13.2","Acts.13.15","Acts.13.16","Acts.13.25","Acts.13.26","Acts.13.32","Acts.13.34","Acts.13.38","Acts.13.40","Acts.13.41","Acts.13.46","Acts.14.15","Acts.14.17","Acts.15.1","Acts.15.7","Acts.15.10","Acts.15.13","Acts.15.24","Acts.15.25","Acts.15.28","Acts.15.29","Acts.16.15","Acts.16.17","Acts.16.36","Acts.17.3","Acts.17.22","Acts.17.23","Acts.17.28","Acts.18.6","Acts.18.14","Acts.18.15","Acts.18.21","Acts.19.2","Acts.19.3","Acts.19.13","Acts.19.15","Acts.19.25","Acts.19.26","Acts.19.36","Acts.19.37","Acts.19.39","Acts.20.10","Acts.20.18","Acts.20.20","Acts.20.25","Acts.20.26","Acts.20.27","Acts.20.28","Acts.20.29","Acts.20.30","Acts.20.31","Acts.20.32","Acts.20.34","Acts.20.35","Acts.21.13","Acts.21.28","Acts.22.1","Acts.22.3","Acts.22.25","Acts.23.15","Acts.23.23","Acts.24.21","Acts.24.22","Acts.25.5","Acts.25.24","Acts.25.26","Acts.26.8","Acts.27.22","Acts.27.25","Acts.27.31","Acts.27.33","Acts.27.34","Acts.28.20","Acts.28.25","Acts.28.26","Acts.28.28",
"Rom.1.6","Rom.1.7","Rom.1.8","Rom.1.9","Rom.1.10","Rom.1.11","Rom.1.12","Rom.1.13","Rom.1.15","Rom.2.24","Rom.6.3","Rom.6.11","Rom.6.12","Rom.6.13","Rom.6.14","Rom.6.16","Rom.6.17","Rom.6.18","Rom.6.19","Rom.6.20","Rom.6.21","Rom.6.22","Rom.7.1","Rom.7.4","Rom.8.9","Rom.8.10","Rom.8.11","Rom.8.13","Rom.8.15","Rom.9.26","Rom.10.19","Rom.11.2","Rom.11.13","Rom.11.25","Rom.11.28","Rom.11.30","Rom.12.1","Rom.12.2","Rom.12.3","Rom.12.14","Rom.12.16","Rom.12.18","Rom.12.19","Rom.13.6","Rom.13.7","Rom.13.8","Rom.13.11","Rom.13.14","Rom.14.1","Rom.14.13","Rom.14.16","Rom.15.5","Rom.15.6","Rom.15.7","Rom.15.10","Rom.15.11","Rom.15.13","Rom.15.14","Rom.15.15","Rom.15.22","Rom.15.23","Rom.15.24","Rom.15.28","Rom.15.29","Rom.15.30","Rom.15.32","Rom.15.33","Rom.16.1","Rom.16.2","Rom.16.3","Rom.16.5","Rom.16.6","Rom.16.7","Rom.16.8","Rom.16.9","Rom.16.10","Rom.16.11","Rom.16.12","Rom.16.13","Rom.16.14","Rom.16.15","Rom.16.16","Rom.16.17","Rom.16.19","Rom.16.20","Rom.16.21","Rom.16.22","Rom.16.23","Rom.16.24",
"1Cor.1.3","1Cor.1.4","1Cor.1.5","1Cor.1.6","1Cor.1.7","1Cor.1.8","1Cor.1.9","1Cor.1.10","1Cor.1.11","1Cor.1.12","1Cor.1.13","1Cor.1.14","1Cor.1.15","1Cor.1.26","1Cor.1.30","1Cor.2.1","1Cor.2.2","1Cor.2.3","1Cor.2.5","1Cor.3.1","1Cor.3.2","1Cor.3.3","1Cor.3.4","1Cor.3.5","1Cor.3.9","1Cor.3.16","1Cor.3.17","1Cor.3.18","1Cor.3.21","1Cor.3.22","1Cor.3.23","1Cor.4.3","1Cor.4.5","1Cor.4.6","1Cor.4.8","1Cor.4.10","1Cor.4.14","1Cor.4.15","1Cor.4.16","1Cor.4.17","1Cor.4.18","1Cor.4.19","1Cor.4.21","1Cor.5.1","1Cor.5.2","1Cor.5.4","1Cor.5.6","1Cor.5.7","1Cor.5.9","1Cor.5.10","1Cor.5.11","1Cor.5.12","1Cor.5.13","1Cor.6.1","1Cor.6.2","1Cor.6.3","1Cor.6.4","1Cor.6.5","1Cor.6.7","1Cor.6.8","1Cor.6.9","1Cor.6.11","1Cor.6.15","1Cor.6.16","1Cor.6.18","1Cor.6.19","1Cor.6.20","1Cor.7.1","1Cor.7.5","1Cor.7.14","1Cor.7.23","1Cor.7.28","1Cor.7.32","1Cor.7.35","1Cor.8.9","1Cor.8.12","1Cor.9.1","1Cor.9.2","1Cor.9.11","1Cor.9.12","1Cor.9.13","1Cor.9.24","1Cor.10.1","1Cor.10.7","1Cor.10.10","1Cor.10.13","1Cor.10.14","1Cor.10.15","1Cor.10.18","1Cor.10.20","1Cor.10.21","1Cor.10.25","1Cor.10.27","1Cor.10.28","1Cor.10.31","1Cor.10.32","1Cor.11.1","1Cor.11.2","1Cor.11.3","1Cor.11.13","1Cor.11.14","1Cor.11.17","1Cor.11.18","1Cor.11.19","1Cor.11.20","1Cor.11.22","1Cor.11.23","1Cor.11.24","1Cor.11.25","1Cor.11.26","1Cor.11.30","1Cor.11.33","1Cor.11.34","1Cor.12.1","1Cor.12.2","1Cor.12.3","1Cor.12.21","1Cor.12.27","1Cor.12.31","1Cor.14.1","1Cor.14.5","1Cor.14.6","1Cor.14.9","1Cor.14.12","1Cor.14.18","1Cor.14.20","1Cor.14.23","1Cor.14.25","1Cor.14.26","1Cor.14.31","1Cor.14.36","1Cor.14.37","1Cor.14.39","1Cor.15.1","1Cor.15.2","1Cor.15.3","1Cor.15.11","1Cor.15.12","1Cor.15.14","1Cor.15.17","1Cor.15.33","1Cor.15.34","1Cor.15.51","1Cor.15.58","1Cor.16.1","1Cor.16.2","1Cor.16.3","1Cor.16.5","1Cor.16.6","1Cor.16.7","1Cor.16.10","1Cor.16.11","1Cor.16.12","1Cor.16.13","1Cor.16.14","1Cor.16.15","1Cor.16.16","1Cor.16.18","1Cor.16.19","1Cor.16.20","1Cor.16.23","1Cor.16.24",
"2Cor.1.2","2Cor.1.6","2Cor.1.7","2Cor.1.8","2Cor.1.11","2Cor.1.12","2Cor.1.13","2Cor.1.14","2Cor.1.15","2Cor.1.16","2Cor.1.18","2Cor.1.19","2Cor.1.21","2Cor.1.23","2Cor.1.24","2Cor.2.1","2Cor.2.2","2Cor.2.3","2Cor.2.4","2Cor.2.5","2Cor.2.7","2Cor.2.8","2Cor.2.9","2Cor.2.10","2Cor.3.1","2Cor.3.2","2Cor.3.3","2Cor.4.5","2Cor.4.12","2Cor.4.14","2Cor.4.15","2Cor.5.11","2Cor.5.12","2Cor.5.13","2Cor.5.20","2Cor.6.1","2Cor.6.11","2Cor.6.12","2Cor.6.13","2Cor.6.14","2Cor.6.17","2Cor.6.18","2Cor.7.2","2Cor.7.3","2Cor.7.4","2Cor.7.7","2Cor.7.8","2Cor.7.9","2Cor.7.11","2Cor.7.12","2Cor.7.13","2Cor.7.14","2Cor.7.15","2Cor.7.16","2Cor.8.1","2Cor.8.6","2Cor.8.7","2Cor.8.9","2Cor.8.10","2Cor.8.11","2Cor.8.13","2Cor.8.14","2Cor.8.16","2Cor.8.17","2Cor.8.22","2Cor.8.23","2Cor.8.24","2Cor.9.1","2Cor.9.2","2Cor.9.3","2Cor.9.4","2Cor.9.5","2Cor.9.8","2Cor.9.10","2Cor.9.13","2Cor.9.14","2Cor.10.1","2Cor.10.6","2Cor.10.7","2Cor.10.8","2Cor.10.9","2Cor.10.13","2Cor.10.14","2Cor.10.15","2Cor.10.16","2Cor.11.1","2Cor.11.2","2Cor.11.3","2Cor.11.4","2Cor.11.6","2Cor.11.7","2Cor.11.8","2Cor.11.9","2Cor.11.11","2Cor.11.16","2Cor.11.19","2Cor.11.20","2Cor.12.11","2Cor.12.12","2Cor.12.13","2Cor.12.14","2Cor.12.15","2Cor.12.16","2Cor.12.17","2Cor.12.18","2Cor.12.19","2Cor.12.20","2Cor.12.21","2Cor.13.1","2Cor.13.3","2Cor.13.4","2Cor.13.5","2Cor.13.6","2Cor.13.7","2Cor.13.9","2Cor.13.11","2Cor.13.12","2Cor.13.13",
"Gal.1.3","Gal.1.6","Gal.1.7","Gal.1.8","Gal.1.9","Gal.1.11","Gal.1.13","Gal.1.20","Gal.2.5","Gal.3.1","Gal.3.2","Gal.3.3","Gal.3.4","Gal.3.5","Gal.3.7","Gal.3.26","Gal.3.27","Gal.3.28","Gal.3.29","Gal.4.6","Gal.4.8","Gal.4.9","Gal.4.10","Gal.4.11","Gal.4.12","Gal.4.13","Gal.4.14","Gal.4.15","Gal.4.16","Gal.4.17","Gal.4.18","Gal.4.19","Gal.4.20","Gal.4.21","Gal.4.28","Gal.5.1","Gal.5.2","Gal.5.4","Gal.5.7","Gal.5.8","Gal.5.10","Gal.5.12","Gal.5.13","Gal.5.15","Gal.5.16","Gal.5.17","Gal.5.18","Gal.5.21","Gal.6.1","Gal.6.2","Gal.6.7","Gal.6.11","Gal.6.12","Gal.6.13","Gal.6.18",
"Eph.1.2","Eph.1.13","Eph.1.15","Eph.1.16","Eph.1.17","Eph.1.18","Eph.2.1","Eph.2.2","Eph.2.5","Eph.2.8","Eph.2.11","Eph.2.12","Eph.2.13","Eph.2.17","Eph.2.19","Eph.2.22","Eph.3.1","Eph.3.2","Eph.3.4","Eph.3.13","Eph.3.16","Eph.3.17","Eph.3.18","Eph.3.19","Eph.4.1","Eph.4.4","Eph.4.17","Eph.4.20","Eph.4.21","Eph.4.22","Eph.4.23","Eph.4.25","Eph.4.26","Eph.4.27","Eph.4.29","Eph.4.30","Eph.4.31","Eph.4.32","Eph.5.1","Eph.5.2","Eph.5.3","Eph.5.5","Eph.5.6","Eph.5.7","Eph.5.8","Eph.5.11","Eph.5.15","Eph.5.17","Eph.5.18","Eph.5.19","Eph.5.25","Eph.5.33","Eph.6.1","Eph.6.4","Eph.6.5","Eph.6.9","Eph.6.10","Eph.6.11","Eph.6.13","Eph.6.14","Eph.6.16","Eph.6.17","Eph.6.21","Eph.6.22",
"Phil.1.2","Phil.1.3","Phil.1.4","Phil.1.5","Phil.1.6","Phil.1.7","Phil.1.8","Phil.1.9","Phil.1.10","Phil.1.12","Phil.1.19","Phil.1.24","Phil.1.25","Phil.1.26","Phil.1.27","Phil.1.28","Phil.1.29","Phil.1.30","Phil.2.2","Phil.2.5","Phil.2.12","Phil.2.13","Phil.2.14","Phil.2.15","Phil.2.17","Phil.2.18","Phil.2.19","Phil.2.20","Phil.2.22","Phil.2.25","Phil.2.26","Phil.2.28","Phil.2.29","Phil.2.30","Phil.3.1","Phil.3.2","Phil.3.15","Phil.3.17","Phil.3.18","Phil.4.1","Phil.4.4","Phil.4.5","Phil.4.6","Phil.4.7","Phil.4.8","Phil.4.9","Phil.4.10","Phil.4.14","Phil.4.15","Phil.4.16","Phil.4.17","Phil.4.18","Phil.4.19","Phil.4.21","Phil.4.22","Phil.4.23",
"Col.1.2","Col.1.3","Col.1.4","Col.1.5","Col.1.6","Col.1.7","Col.1.8","Col.1.9","Col.1.12","Col.1.21","Col.1.22","Col.1.23","Col.1.24","Col.1.25","Col.1.27","Col.2.1","Col.2.4","Col.2.5","Col.2.6","Col.2.7","Col.2.8","Col.2.10","Col.2.11","Col.2.12","Col.2.13","Col.2.16","Col.2.18","Col.2.20","Col.3.1","Col.3.2","Col.3.3","Col.3.4","Col.3.5","Col.3.7","Col.3.8","Col.3.9","Col.3.12","Col.3.13","Col.3.15","Col.3.16","Col.3.17","Col.3.18","Col.3.19","Col.3.20","Col.3.21","Col.3.22","Col.3.23","Col.3.24","Col.4.1","Col.4.2","Col.4.5","Col.4.6","Col.4.7","Col.4.8","Col.4.9","Col.4.10","Col.4.12","Col.4.13","Col.4.14","Col.4.15","Col.4.16","Col.4.17","Col.4.18",
"1Thess.1.1","1Thess.1.2","1Thess.1.3","1Thess.1.4","1Thess.1.5","1Thess.1.6","1Thess.1.7","1Thess.1.8","1Thess.1.9","1Thess.2.1","1Thess.2.2","1Thess.2.5","1Thess.2.6","1Thess.2.7","1Thess.2.8","1Thess.2.9","1Thess.2.10","1Thess.2.11","1Thess.2.12","1Thess.2.13","1Thess.2.14","1Thess.2.17","1Thess.2.18","1Thess.2.19","1Thess.2.20","1Thess.3.2","1Thess.3.3","1Thess.3.4","1Thess.3.5","1Thess.3.6","1Thess.3.7","1Thess.3.8","1Thess.3.9","1Thess.3.10","1Thess.3.11","1Thess.3.12","1Thess.3.13","1Thess.4.1","1Thess.4.2","1Thess.4.3","1Thess.4.4","1Thess.4.6","1Thess.4.8","1Thess.4.9","1Thess.4.10","1Thess.4.11","1Thess.4.12","1Thess.4.13","1Thess.4.15","1Thess.4.18","1Thess.5.1","1Thess.5.2","1Thess.5.4","1Thess.5.5","1Thess.5.11","1Thess.5.12","1Thess.5.13","1Thess.5.14","1Thess.5.15","1Thess.5.16","1Thess.5.17","1Thess.5.18","1Thess.5.19","1Thess.5.20","1Thess.5.21","1Thess.5.22","1Thess.5.23","1Thess.5.24","1Thess.5.25","1Thess.5.26","1Thess.5.27","1Thess.5.28",
"2Thess.1.2","2Thess.1.3","2Thess.1.4","2Thess.1.5","2Thess.1.6","2Thess.1.7","2Thess.1.10","2Thess.1.11","2Thess.1.12","2Thess.2.1","2Thess.2.2","2Thess.2.3","2Thess.2.5","2Thess.2.6","2Thess.2.13","2Thess.2.14","2Thess.2.15","2Thess.2.17","2Thess.3.1","2Thess.3.3","2Thess.3.4","2Thess.3.5","2Thess.3.6","2Thess.3.7","2Thess.3.8","2Thess.3.9","2Thess.3.10","2Thess.3.11","2Thess.3.13","2Thess.3.14","2Thess.3.15","2Thess.3.16","2Thess.3.18",
"1Tim.6.21",
"2Tim.4.22",
"Titus.3.15",
"Phlm.1.3","Phlm.1.22","Phlm.1.25",
"Heb.3.1","Heb.3.7","Heb.3.8","Heb.3.9","Heb.3.12","Heb.3.13","Heb.3.15","Heb.4.1","Heb.4.7","Heb.5.11","Heb.5.12","Heb.6.9","Heb.6.10","Heb.6.11","Heb.6.12","Heb.7.4","Heb.9.20","Heb.10.25","Heb.10.29","Heb.10.32","Heb.10.34","Heb.10.35","Heb.10.36","Heb.12.3","Heb.12.4","Heb.12.5","Heb.12.7","Heb.12.8","Heb.12.12","Heb.12.13","Heb.12.14","Heb.12.17","Heb.12.18","Heb.12.22","Heb.12.25","Heb.13.2","Heb.13.3","Heb.13.7","Heb.13.9","Heb.13.16","Heb.13.17","Heb.13.18","Heb.13.19","Heb.13.21","Heb.13.22","Heb.13.23","Heb.13.24","Heb.13.25",
"Jas.1.2","Jas.1.3","Jas.1.4","Jas.1.5","Jas.1.16","Jas.1.19","Jas.1.21","Jas.1.22","Jas.2.1","Jas.2.2","Jas.2.3","Jas.2.4","Jas.2.5","Jas.2.6","Jas.2.7","Jas.2.8","Jas.2.9","Jas.2.12","Jas.2.16","Jas.2.24","Jas.3.1","Jas.3.13","Jas.3.14","Jas.4.1","Jas.4.2","Jas.4.3","Jas.4.4","Jas.4.5","Jas.4.7","Jas.4.8","Jas.4.9","Jas.4.10","Jas.4.11","Jas.4.14","Jas.4.15","Jas.4.16","Jas.5.1","Jas.5.2","Jas.5.3","Jas.5.4","Jas.5.5","Jas.5.6","Jas.5.7","Jas.5.8","Jas.5.9","Jas.5.10","Jas.5.11","Jas.5.12","Jas.5.13","Jas.5.14","Jas.5.16","Jas.5.19",
"1Pet.1.2","1Pet.1.4","1Pet.1.6","1Pet.1.7","1Pet.1.8","1Pet.1.9","1Pet.1.10","1Pet.1.12","1Pet.1.13","1Pet.1.14","1Pet.1.15","1Pet.1.16","1Pet.1.17","1Pet.1.18","1Pet.1.20","1Pet.1.21","1Pet.1.22","1Pet.1.25","1Pet.2.2","1Pet.2.3","1Pet.2.5","1Pet.2.7","1Pet.2.9","1Pet.2.12","1Pet.2.13","1Pet.2.17","1Pet.2.20","1Pet.2.21","1Pet.2.24","1Pet.2.25","1Pet.3.2","1Pet.3.6","1Pet.3.7","1Pet.3.9","1Pet.3.13","1Pet.3.14","1Pet.3.15","1Pet.3.16","1Pet.3.18","1Pet.3.21","1Pet.4.1","1Pet.4.4","1Pet.4.7","1Pet.4.12","1Pet.4.13","1Pet.4.14","1Pet.4.15","1Pet.5.1","1Pet.5.2","1Pet.5.4","1Pet.5.5","1Pet.5.6","1Pet.5.7","1Pet.5.8","1Pet.5.9","1Pet.5.10","1Pet.5.12","1Pet.5.13","1Pet.5.14",
"2Pet.1.2","2Pet.1.4","2Pet.1.5","2Pet.1.8","2Pet.1.10","2Pet.1.11","2Pet.1.12","2Pet.1.13","2Pet.1.15","2Pet.1.16","2Pet.1.19","2Pet.2.1","2Pet.2.3","2Pet.2.13","2Pet.3.1","2Pet.3.2","2Pet.3.8","2Pet.3.9","2Pet.3.11","2Pet.3.14","2Pet.3.15","2Pet.3.17","2Pet.3.18",
"1John.1.2","1John.1.3","1John.1.5","1John.2.1","1John.2.7","1John.2.8","1John.2.12","1John.2.13","1John.2.14","1John.2.15","1John.2.18","1John.2.20","1John.2.21","1John.2.24","1John.2.26","1John.2.27","1John.2.28","1John.2.29","1John.3.1","1John.3.5","1John.3.7","1John.3.11","1John.3.13","1John.3.15","1John.4.1","1John.4.2","1John.4.3","1John.4.4","1John.5.13","1John.5.21",
"2John.1.6","2John.1.8","2John.1.10","2John.1.12",
"Jude.1.2","Jude.1.3","Jude.1.5","Jude.1.12","Jude.1.17","Jude.1.18","Jude.1.20","Jude.1.21","Jude.1.22","Jude.1.23","Jude.1.24",
"Rev.1.4","Rev.1.9","Rev.2.10","Rev.2.13","Rev.2.23","Rev.2.24","Rev.2.25","Rev.6.16","Rev.7.3","Rev.11.12","Rev.12.12","Rev.14.7","Rev.16.1","Rev.18.4","Rev.18.6","Rev.18.7","Rev.18.20","Rev.19.5","Rev.19.17","Rev.19.18","Rev.22.16"	
	]	
};