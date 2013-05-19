	
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
		
		// update placeholder
		morphWindow.rows.on('change', '.morph-type select', function() {
			var typeSelector = $(this),
				type = typeSelector.val(),
				placeholder = '';
				
			
			switch (type) {
				case 'strongs':
					
					placeholder = 'Strong\'s (e.g. G2424, H234)';
					break;
					
				case 'morphology':
					placeholder = 'Morphology Expression (e.g. V-P?I)';
					
					break;
				case 'frequency':
					placeholder = 'Number (e.g. 25)';
				
					break;
			}
			
			
			typeSelector.closest('.morph-row').find('.morph-data input').attr('placeholder', placeholder);
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
						breakBefore: true,
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
						breakBefore: true,
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
					}
					,
					{
						declension : 'Person',
						breakBefore: true,
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
					},
					{
						declension : 'Number',
						parts :  [
							{
								letter : 'S',
								type : 'Singular'
							},
							{
								letter : 'P',
								type : 'Plural'
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
					.hide(),
			
			morphSelectorTimer = null,
			
			startMorphSelectorTimer = function() {				
				stopMorphSelectorTimer();
				
				morphSelectorTimer = setTimeout(function() {
					morphSelector.hide();
				}, 1000);
			},
			stopMorphSelectorTimer = function() {
				if (morphSelectorTimer != null) {
					clearTimeout(morphSelectorTimer);
					morphSelectorTimer = null;
				}
			};
		
		morphSelector	
			.on('mouseleave', function() {
				startMorphSelectorTimer();
			})
			.on('mouseover', function() {
				stopMorphSelectorTimer();	
			});
				
		morphSelector.currentInput = null;
		
		// find table parts
		var morphSelectorHeaderRow = morphSelector.find('thead tr'),
			morphSelectorMainRow = morphSelector.find('tbody tr'),
			morphSelectorPOS = $('<td class="morph-pos"></td>').appendTo(morphSelectorMainRow);

		// add parts of speech
		for (var i=0, il=partsOfSpeech.length; i<il; i++) {
			morphSelectorPOS.append(
				$('<span data-value="' + partsOfSpeech[i].letter + '">' + partsOfSpeech[i].type + '</span>')
			);
		}
		
		function updateMorphSelector(value) {
		
			if (value.length == 0) {
				morphSelector.find('span').removeClass('selected');
				drawSelectedPartOfSpeech();
				return;
			}
		
			var firstChar = value.substring(0,1);
			
			// select it
			var partOfSpeechSpan = morphSelectorPOS.find('span[data-value="' + firstChar + '"]');
			
			if (partOfSpeechSpan.length > 0) {
				partOfSpeechSpan.addClass('selected')
					.siblings()
						.removeClass('selected');
				
				drawSelectedPartOfSpeech();
								
				// do the rest of the characters one by one
				if (value.length > 2) {
					var remainder = value.substring(2);
					
					for (var i=0, il=remainder.length; i<il; i++) {
						var letter = remainder[i];
												
						morphSelectorMainRow
							.find('td:nth-child(' + (i+2) + ')')
							.find('span[data-value="' + letter + '"]')
								.addClass('selected');
					}
				}
			}
			
			
			
		}	
		
		function drawSelectedPartOfSpeech() {
			
			// clear out headers
			morphSelectorHeaderRow.find('th').first()
				.siblings()
				.remove();	
		
			// clear out the main declensions
			morphSelectorMainRow.find('td').first()
				.siblings()
				.remove();					
		
			// find whatever is selcted
			var selectedSpan = morphSelectorPOS.find('.selected'),
				selectedValue = selectedSpan.attr('data-value');
				
			if (selectedSpan.length == 0) {
				return;
			}
		
			// find part of speech
			var partOfSpeech = null;
			for (var i=0, il=partsOfSpeech.length; i<il; i++) {
				if (partsOfSpeech[i].letter === selectedValue) {
					partOfSpeech = partsOfSpeech[i];
					break;
				}					
			}	
									
			// now make the new siblings
			for (var i=0, il=partOfSpeech.declensions.length; i<il; i++) {
				// create td
				//var td = $('<td />').appendTo( selectedSpan.closest('tr') );					
				var declension = partOfSpeech.declensions[i],
					td = $('<th>' + declension.declension + '</th>').appendTo( morphSelectorHeaderRow );
					td = $('<td />').appendTo( selectedSpan.closest('tr') );				
				
				for (var j=0, jl=declension.parts.length; j<jl; j++) {
					$('<span data-value="' + declension.parts[j].letter + '"' + (declension.breakBefore ? ' data-breakbefore="true"' : '') + '>' + declension.parts[j].type + '</span>')
						.appendTo(td);
				}
			}	
			
			morphSelector.height( morphSelector.find('table').height() );		
		}	
		
		// selecting a span	
		morphSelector.on('click', 'span', function() {
			var selectedSpan = $(this),
				selectedValue = selectedSpan.attr('data-value');
			
			
			// select or delect a class
			if (selectedSpan.hasClass('selected')) {

				selectedSpan
					.removeClass('selected')

			} else {

				selectedSpan
					.addClass('selected')
					.siblings()
						.removeClass('selected');
								
			}

			// redraw the parts if needed			
			if (selectedSpan.closest('td').hasClass('morph-pos')) {
				drawSelectedPartOfSpeech();
			}
			
			
			// push new value to input
			var selector = '',
				lastPartOfSpeechWithSelection = -1;

			// first see what the last position with a selected value is
			// [Verb] [ ] [ ] [Subjunctive] == 3
			selectedSpan.closest('tr').find('td').each(function(index, node) {
				var td = $(this),
					selectedDeclension = td.find('span.selected');	
					
				// if something is selected then mark it
				if (selectedDeclension.length > 0) {			
					lastPartOfSpeechWithSelection = index;
				}
			});
			
			// construct the text input from the selected positions
			selectedSpan.closest('tr').find('td').each(function(index, node) {
			
				var td = $(this),
					selectedDeclension = td.find('span.selected'),
					includeBreak = td.find('span').first().attr('data-breakbefore') == "true";
				
				// if nothing selected add ? but only if there is something after it
				if (selectedDeclension.length == 0) {
					if (index <= lastPartOfSpeechWithSelection) {
						selector += (includeBreak ? '-' : '') + '?';
					}
				} else {
					selector += (includeBreak ? '-' : '') + selectedDeclension.attr('data-value');
				}
			});
			
			
			if (morphSelector.currentInput != null) {
				morphSelector.currentInput.val(selector);
			}
			
			saveTransforms();
			resetTransforms();
	
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
					
					updateMorphSelector( dataInput.val() );
				}
			}
		});
		
		morphWindow.rows.on('keyup', '.morph-data input', function() {
			
			var dataInput = $(this);

			updateMorphSelector( dataInput.val() );			
			
			morphSelector.show();
		});	
		
		morphWindow.rows.on('blur', '.morph-data input', function() {
		
			//morphSelector.hide();
			
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
							transform.morphRegExp = new RegExp('^' + transform.data.replace(/\?/gi,'.{1}'), 'gi');
						} else {
							transform.morphRegExp = null;
						}
												
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
			
		
			morphWindow.rows.find('.morph-row').each( function(i, el) {
				var row = $(this),
					styleValue = row.find('.morph-style select').val();
					
				
				applyStyle(row.find('.morph-example span').attr('style',''), styleValue);
				//	.css(styleValue.split(':')[0], styleValue.split(':')[1]);				
			});
		}
		
		function applyStyle(node, css) {
		
			var props = css.split(';');
			
			
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
						'<input type="text" placeholder="Strong\'s (e.g. G2424, H234)" />' +
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

		//morphWindow.show();
	}
});