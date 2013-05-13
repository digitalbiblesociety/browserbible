	
/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		var morphWindow = docs.createModal("morph", "Morphology Highlighting").size(550,300).center(),
			defaultTransforms = [
				{
					type: 'strongs',
					data: 'G2424',
					style: 'border-bottom: dotted 2px #9999ff'
				},
				{
					type: 'morph',
					data: 'V-A',
					style: 'border-bottom: dotted 2px #9999ff'
				}
				
			],
			transforms = $.jStorage.get('docs-morphology', defaultTransforms);
			
		// headers
		morphWindow.content.append(
			$('<div class="morph-row">' +
				'<div class="morph-type">Type</div>' +
				'<div class="morph-data">Selector</div>' +
				'<div class="morph-style">Style</div>' +
			 '</div>')   
		);
		
		morphWindow.rows = $('<div />').appendTo(morphWindow.content);
		morphWindow.addRow =
				$('<input type="button" value="Add Row" />')
					.appendTo(morphWindow.content)
					.on('click', function() {
						var row = createRow();
						morphWindow.rows.append(row);
					});
		
		// Save and update
		morphWindow.rows.on('change keyup', 'select, input', function() {
			
			updateExamples();
			
			saveTransforms();
			
			resetTransforms();
			
		});
		
		// remove row
		morphWindow.rows.on('click', '.morph-remove', function() {
			
			// remove row
			
			$(this).closest(".morph-row").remove();
			
			saveTransforms();
			
			resetTransforms();			
			
		});
		
		
		// morph selector
		var partsOfSpeech = [
			{
				letter : 'N',
				type : 'Noun',
				declensions : [
					{
						declension : 'Case',
						parts :  [
							{
								letter : 'N',
								type : 'Nominative'
							},
							{
								letter : 'A',
								type : 'Accusative'
							},					
							{
								letter : 'D',
								type : 'Dative'
							},					
							{
								letter : 'G',
								type : 'Genative'
							},					
							{
								letter : 'V',
								type : 'Vocative'
							}											
						]
					},
					{
						declension : 'Number',
						parts :  [
							{
								letter : 'P',
								type : 'Plural'
							},
							{
								letter : 'S',
								type : 'Singular'
							}
						]
					},
					{
						declension : 'Gender',
						parts :  [
							{
								letter : 'F',
								type : 'Feminine'
							},
							{
								letter : 'M',
								type : 'Masculine'
							},
							{
								letter : 'N',
								type : 'Nueter'
							}
						]
					}			
				]
			},
			{
				letter : 'V',
				type : 'Verb',
				declensions : [
					{
						declension : 'Tense',
						parts :  [
							{
								letter : 'A',
								type : 'Aorist'
							},
							{
								letter : 'F',
								type : 'Future'
							},					
							{
								letter : 'I',
								type : 'Imperfect'
							},					
							{
								letter : 'R',
								type : 'Perfect'
							},					
							{
								letter : 'L',
								type : 'Pluperfect'
							},					
							{
								letter : 'P',
								type : 'Present'
							}
						]
					},
					{
						declension : 'Voice',
						parts :  [
							{
								letter : 'A',
								type : 'Active'
							},
							{
								letter : 'M',
								type : 'Middle'
							},
							{
								letter : 'P',
								type : 'Passive'
							}
						]
					},
					{
						declension : 'Mood',
						parts :  [
							{
								letter : 'I',
								type : 'Indicative'
							},
							{
								letter : 'S',
								type : 'Subjunctive'
							},
							{
								letter : 'O',
								type : 'Optative'
							},
							{
								letter : 'M',
								type : 'Imperative'
							},
							{
								letter : 'N',
								type : 'Infinitive'
							},
							{
								letter : 'P',
								type : 'Participle'
							}
						]
					},
					{
						declension : 'Person',
						parts :  [
							{
								letter : '1',
								type : '1st Person'
							},
							{
								letter : '2',
								type : '2nd Person'
							},
							{
								letter : '3',
								type : '3rd Person'
							}
						]
					}			
				]
			}			
		
		];	
		
		var morphSelector = $('<div class="morph-selector"><table>' + 
				'<thead>' + 
					'<tr><th>Part of Speech</th></tr>' + 
				'</thead>' + 
				'<tbody>' + 
					'<tr></tr>' +
				'</tbody>' + 
				'</table></div>')
					.appendTo( $(document.body) )
					.hide();
				
		morphSelector.currentInput = null;
		
		// add main selector
		var morphSelectorHeaderRow = morphSelector.find('thead tr'),
			morphSelectorMainRow = morphSelector.find('tbody tr'),
			morphSelectorPOS = $('<td class="morph-pos"></td>').appendTo(morphSelectorMainRow);

							
		for (var i=0, il=partsOfSpeech.length; i<il; i++) {
			morphSelectorPOS.append(
				$('<span data-value="' + partsOfSpeech[i].letter + '">' + partsOfSpeech[i].type + '</span>')
			);
		}
		
		// selecting a span	
		morphSelector.on('click', 'span', function() {
			var selectedSpan = $(this),
				selectedValue = selectedSpan.attr('data-value');
			
			if (selectedSpan.hasClass('selected')) {

				selectedSpan
					.removeClass('selected')

			} else {

				selectedSpan
					.addClass('selected')
					.siblings()
						.removeClass('selected');
						
			}
							
			if (selectedSpan.closest('td').hasClass('morph-pos')) {
				
				// find part of speech
				var partOfSpeech = null;
				for (var i=0, il=partsOfSpeech.length; i<il; i++) {
					if (partsOfSpeech[i].letter === selectedValue) {
						partOfSpeech = partsOfSpeech[i];
						break;
					}					
				}	
				
				// clear out the other TDs
				selectedSpan.closest('td')
					.siblings()
					.remove();
				
				// clear out headers
				morphSelectorHeaderRow.find('th').first()
					.siblings()
					.remove();
										
				// now make the new siblings
				for (var i=0, il=partOfSpeech.declensions.length; i<il; i++) {
					// create td
					//var td = $('<td />').appendTo( selectedSpan.closest('tr') );					
					var declension = partOfSpeech.declensions[i],
						td = $('<th>' + declension.declension + '</th>').appendTo( morphSelectorHeaderRow );
						td = $('<td />').appendTo( selectedSpan.closest('tr') );				
					
					for (var j=0, jl=declension.parts.length; j<jl; j++) {
						$('<span data-value="' + declension.parts[j].letter + '">' + declension.parts[j].type + '</span>')
							.appendTo(td);
					}
				}							
				
			}
			
			morphSelector.height( morphSelector.find('table').height() );
			
			
			// push new value to input
			var selector = '';
			
			selectedSpan.closest('tr').find('td').each(function() {
			
				var td = $(this),
					selectedDeclension = td.find('span.selected');
					
				if (selectedDeclension.length == 0) {
					selector += '?';
				} else {
					selector += selectedDeclension.attr('data-value');
				}
				
				// add a dash after the part of speach
				if (td.hasClass('morph-pos')) {
					selector += '-';
				}					
					
				//}
			});
			
			console.log('form', selector, morphSelector.currentInput);
			
			if (morphSelector.currentInput != null) {
				morphSelector.currentInput.val(selector);
			}
			
			
		});
		
		// show with input
		morphWindow.rows.on('click', '.morph-data', function() {
			
			var dataBlock = $(this),
				dataInput = dataBlock.find('input'),
				type = dataBlock.closest('.morph-row').find('.morph-type select').val();
						
			if (type == 'morphology') {
			
				if (morphSelector.is(':visible')) {
					morphSelector.hide();
				} else {
					morphSelector.show();
					morphSelector.css({
						top: dataInput.offset().top + dataBlock.height(),
						left: dataInput.offset().left,
						zIndex: morphWindow.window.css('zindex')+1
					});
				
					morphSelector.currentInput = dataInput;
				}
			}
		});		
			
		
		function resetTransforms() {
			// remove all inline styles
			$('span.w').attr('style','');
			
			// re-run on existing chapters
			$('div.chapter').each(function() {
				runTransforms( $(this) );
			});
		}
		
		function saveTransforms() {
			transforms = [];
			
			morphWindow.rows.find('.morph-row').each(function() {
				var row = $(this),
					transform = {};
				
				transform.type = row.find('.morph-type select').val();
				transform.data = row.find('.morph-data input').val();
				transform.style = row.find('.morph-style select').val();
				
				
				// compute
				switch (transform.type) {
					case 'strongs':
						// NOTHING
						break;
						
					case 'morphology':
						// compile regexp
						if (transform.data != '') {
							transform.morphRegExp = new RegExp('^' + transform.data.replace('?','.{1}'), 'gi');
						} else {
							transform.morphRegExp = null;
						}
						
						console.log('regex', transform.morphRegExp );
						
						break;
					case 'frequency':
						// parse
						
						var number = parseInt(transform.data);
						
						if (isNaN(number)) {
							transform.data = 0;
						} else {
							transform.data = number;						
						}
					
						break;
				}
				
				// compute
				/*
				if ((transform.strong != '' || transform.morph != '') && transform.style != '' && transform.color != '') {
					
					// compile regexp
					
					if (transform.morph.substring(0,2) === 'f-') {
						transform.frequency = parseInt(transform.morph.substring(2), 10);
					} else if (transform.morph != '') {			
						transform.morphRegExp = new RegExp('^' + transform.morph, 'gi');
					}
					
					
					
				}
				*/
				
				transforms.push(transform);
			});
			
			console.log('morphology: saved ' + transforms.length + ' transforms');
			
			// store for next load
			$.jStorage.set('docs-morphology', transforms);
		}
		
		function drawTransforms() {
			morphWindow.rows.empty();
			
			var row = createRow();
			
			for (var i=0, il=transforms.length; i<il; i++) {
				var row = createRow(),
					transform = transforms[i];
				
				row.find('.morph-type select').val(transform.type);
				row.find('.morph-data input').val(transform.data);
				row.find('.morph-style select').val(transform.style);
				
				morphWindow.rows.append(row);		
			}
		}
		
		function updateExamples() {
			
			console.log(morphWindow.rows);
		
			morphWindow.rows.find('.morph-row').each( function(i, el) {
				var row = $(this),
					styleValue = row.find('.morph-style select').val();
					
				
				applyStyle(row.find('.morph-example span').attr('style',''), styleValue);
				//	.css(styleValue.split(':')[0], styleValue.split(':')[1]);				
			});
		}
		
		function applyStyle(node, css) {
		
			var props = css.split(';');
			
			console.log(node, css);
			
			for (var i=0, il=props.length; i<il; i++) {
		
				var parts = props[i].split(':');				
				
				if (parts.length === 2) {
					node.css(parts[0], parts[1]);
				}
			}
		}
		
		function createRow() {
		
			// create styles
			var cssStyles = [],
				colors = ['#ff9999','#99ff99','#9999ff"','#ffff99','#ff99ff','#99ffff'],
				colorNames = ['Red','Green','Blue','Yellow','Magenta','Cyan'],
				styles = ['color:{0}','background:{0}','border-bottom: solid 2px {0}','border-bottom: dotted 2px {0}',],
				styleNames = ['Text Color','Background','Solid Underline','Dotted Underline'];
				
				
			for (var i=0, il=styles.length; i<il; i++) {
				for (var j=0, jl=colors.length; j<jl; j++) {
					cssStyles.push('<option value="' + styles[i].replace('{0}',colors[j]) + '">' + styleNames[i] + ': ' + colorNames[j] + '</option>');
				}
			}
			
			// custom
			cssStyles.push('<option value="color:red;text-shadow:yellow 0 0 2px;">Fire</option>');
			cssStyles.push('<option value="text-shadow:0 0 1px gray;">Shadow</option>');			
		
		
			return $(
				'<div class="morph-row">' +
					'<div class="morph-type">' +
						'<select>' +
							'<option value="strongs">Strongs</option>' + 
							'<option value="morphology">Morphology</option>' +
							'<option value="frequency">Frequency</option>' + 
						'</select>' +							
					'</div>' + 
					'<div class="morph-data">' +
						'<input type="text" placeholder="Strong # or @Morph" />' +
					'</div>' +
					'<div class="morph-style">' +
						'<select>' +
							cssStyles.join('') + 					
						'</select>' +
					'</div>' +
					'<div class="morph-example">' +
						'<span>example</span>' +
					'</div>' +
					'<div class="morph-remove">' +
						'X' +
					'</div>' +
				 '</div>');
		}
		
		function runTransforms(chapter) {
			if (transforms.length === 0)
				return;
			
			chapter.find('span.w').each(function(index, node) {
				var w = $(this),
					transform,
					wordMorphData;
				
				for (var i=0, il=transforms.length; i<il; i++) {
					transform = transforms[i];

					switch (transform.type) {
						case 'strongs':
						
							if (transform.data !== '' && w.hasClass(transform.data)) {
								applyStyle(w, transform.style);
							}						
						
							break;
						case 'morphology':

							if (transform.morphRegExp != null) {
								wordMorphData = w.attr('data-morph');
								if (wordMorphData != null && transform.morphRegExp.test(wordMorphData)) {
									applyStyle(w, transform.style);
								}
							}
						
							break;
						case 'frequency':
							
							if (transform.data  > 0) {
								var strongs = w.attr('data-lemma');
								
								if (strongs != null ) {
								
									// run all possible strongs on this word or phrase
									strongs = strongs.split(' ');
									for (var j=0, jl=strongs.length; j<jl; j++) {
										var freq = (typeof strongsGreekFrequencies != 'undefined') ? strongsGreekFrequencies[ strongs[j] ] : 0;
										
										if (freq > 0 && freq <= transform.data) {
											applyStyle(w, transform.style);	
										}
									}
								}								
							}
							
						
							break;
					
					
					}			
				}				
			});
		}
		
		// run transforms
		docManager.addEventListener('load', function(e) {
			runTransforms(e.chapter);
		});		
		
		// add button to config
		docManager.createMorphologyPlugin = function(title, prefix) {
			
			var configBlock =
				$('<div class="config-options" id="config-' + prefix + '">' + 
						'<h3 id="config-size-title">' + title + '</h3>' + 
					'</div>')
						.appendTo( docManager.configWindow.content );
				
			$('<input type="button" value="Edit Morphology Filters">')
				.on('click', function(e) {
					if (morphWindow.window.is(':visible')) {
						morphWindow.hide();
					} else {
						morphWindow.show();
					}					
				})
				.appendTo(configBlock);
				
			// double check size
			docManager.resizeConfigWindow();
		}	
		
		docManager.createMorphologyPlugin('Morphology Filters', 'morphology');		
		
		/*
		// add button to header
		$('<input type="button" id="docs-morphology" />')
			.appendTo(docManager.header.find('#header-nav'))
			.on('click', function() {
				if (morphWindow.window.is(':visible')) {
					morphWindow.hide();
				} else {
					morphWindow.show();
				}
			});	
		*/		
		
		// initial setup
		drawTransforms();
		updateExamples();
		saveTransforms();

		morphWindow.show();
	}
});