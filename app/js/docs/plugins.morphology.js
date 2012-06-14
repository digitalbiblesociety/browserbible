	
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
					strong: 'G2424',
					morph: '',
					style: 'underline-dotted',
					color: '#ff9999'
				},
				{
					strong: null,
					morph: 'V-A',
					style: 'background',
					color: '#99ff99'				
				}
			],
			transforms = $.jStorage.get('docs-morphology', defaultTransforms);
			
		// headers
		morphWindow.content.append(
			$('<div class="morph-row">' +
				'<div class="morph-strong">Strong #</div>' +
				'<div class="morph-morph">Morphology/Frequency</div>' +
				'<div class="morph-style">Style</div>' +
				'<div class="morph-color">Color</div>' +
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
				
				transform.strong = row.find('.morph-strong input').val();
				transform.morph = row.find('.morph-morph select').val();
				transform.style = row.find('.morph-style select').val();
				transform.color = row.find('.morph-color select').val();
				transform.frequency = 0;
				transform.morphRegExp = null;
				
				// compute
				if ((transform.strong != '' || transform.morph != '') && transform.style != '' && transform.color != '') {
					
					// compile regexp
					if (transform.morph.substring(0,2) === 'f-') {
						transform.frequency = parseInt(transform.morph.substring(2), 10);
					} else if (transform.morph != '') {			
						transform.morphRegExp = new RegExp('^' + transform.morph, 'gi');
					}
					
					// compute css
					switch (transform.style) {
						case 'color':
							transform.css = {'color' : transform.color};
							break;
						case 'background':
							transform.css = {'background' : transform.color};
							break;
						case 'underline-solid':
							transform.css = {'border-bottom' : 'solid 2px ' + transform.color};
							break;
						case 'underline-dotted':
							transform.css = {'border-bottom' : 'dotted 2px ' + transform.color};
							break;
					}
					
					row.find('.morph-example span')
						.attr('style','')
						.css(transform.css);
					
					transforms.push(transform);
				}
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
				
				row.find('.morph-strong input').val(transform.strong);
				row.find('.morph-morph select').val(transform.morph);
				row.find('.morph-style select').val(transform.style);
				row.find('.morph-color select').val(transform.color);
				
				morphWindow.rows.append(row);
			}
		}
		
		function createRow() {
			return $(
				'<div class="morph-row">' +
					'<div class="morph-strong">' +
						'<input type="text" placeholder="Strong #" />' +
					'</div>' +
					'<div class="morph-morph">' +
						'<select>' +
							'<option value="">--</option>' +
							'<optgroup label="Frequency">' +
								'<option value="f-5">5 times or fewer</option>' + 
								'<option value="f-10">10 times or fewer</option>' +
								'<option value="f-15">15 times or fewer</option>' + 
								'<option value="f-20">20 times or fewer</option>' + 								
							'</optgroup>' +								
							'<optgroup label="Greek Verb Tenses">' +
								'<option value="V">All Verb Tenses</option>' + 
								'<option value="V-P">Present</option>' + 
								'<option value="V-A">Aorist</option>' + 
								'<option value="V-I">Imperfect</option>' + 
								'<option value="V-F">Future</option>' + 
								'<option value="V-R">Perfect</option>' + 
								'<option value="V-L">Pluperfect</option>' + 	
							'</optgroup>' +
							'<optgroup label="Greek Noun Cases">' +
								'<option value="N">All Noun Cases</option>' + 
								'<option value="N-N">Nominative</option>' + 
								'<option value="N-A">Accusative</option>' + 
								'<option value="N-G">Genitive</option>' + 
								'<option value="N-D">Dative</option>' +
							'</optgroup>' +							
						'</select>' +
					'</div>' +
					'<div class="morph-style">' +
						'<select>' +
							'<option value="color">Text Color</option>' +
							'<option value="background">Text Background</option>' +
							//'<option value="outline">Outline</option>' +
							'<option value="underline-solid">Solid Underline</option>' +
							'<option value="underline-dotted">Dotted Underline</option>' + 
						'</select>' +					
					'</div>' +
					'<div class="morph-color">' +
						'<select>' +
							'<option value="#ff9999" style="background-color: #ff9999;">Red</option>' +
							'<option value="#99ff99" style="background-color: #99ff99;">Green</option>' +
							'<option value="#9999ff" style="background-color: #9999ff;">Blue</option>' +
							'<option value="#ffff99" style="background-color: #ffff99;">Yellow</option>' +
							'<option value="#ff99ff" style="background-color: #ff99ff;">Magenta</option>' +
							'<option value="#99ffff" style="background-color: #99ffff;">Cyan</option>' +
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
						
					// both
					if (transform.frequency > 0) {
						var strongs = w.attr('data-lemma');
						
						if (strongs != null ) {
							strongs = strongs.split(' ');
							for (var j=0, jl=strongs.length; j<jl; j++) {
								var freq = strongsGreekFrequencies[ strongs[j] ];
								
								if (freq <= transform.frequency) {
									w.css(transform.css);	
								}
							}
						}		
					
					} else if (transform.strong != '' && transform.morphRegExp != null) {
						wordMorphData = w.attr('data-morph');
						if (w.hasClass(transform.strong) && wordMorphData != null && transform.morphRegExp.test(wordMorphData)) {
							w.css(transform.css);	
						}
					} else {
						
						// only strong's
						if (transform.strong != '' && w.hasClass(transform.strong)) {
							w.css(transform.css);
						}
						
						// only morph
						if (transform.morphRegExp != null) {
							wordMorphData = w.attr('data-morph');
							if (wordMorphData != null && transform.morphRegExp.test(wordMorphData)) {
								w.css(transform.css);	
							}
						}
					}
				}
			});
		}
		
		// run transforms
		docManager.addEventListener('load', function(e) {
			runTransforms(e.chapter);
		});		
		
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
		
		// initial setup
		drawTransforms();
		saveTransforms();
	}
});