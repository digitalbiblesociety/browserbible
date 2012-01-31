	
/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
		
		var morphWindow = docs.createModal("morph", "Morphology Highlighting").size(400,200).center(),
			defaultTransforms = [
				{
					strong: 'G2424',
					morph: null,
					css: {'border-bottom':'dotted 2px blue'}
					
				},
				{
					strong: null,
					morph: /^V-A/gi,
					css: {'background':'#ccffcc'}
				}
			],
			transforms = $.jStorage.get('docs-morphology', defaultTransforms);
			
		function drawTransforms() {
			morphWindow.content.empty();
			
			var row = createRow();
			
			
		}
		
		function createRow() {
			return $(
				'<div class="morph-row">' +
					'<div class="morph-strong">' +
						'<input type="text" placeholder="Strong Number" />' +
					'</div>' +
					'<div class="morph-morph">' +
						'<select>' +
							// boom
						'</select>' +
					'</div>' +					 
				 '</div>');
			
		}
		
		// run transforms
		docManager.addEventListener('load', function(e) {
			
			if (transforms.length === 0)
				return;
			
			e.chapter.find('span.w').each(function(index, node) {
				var w = $(this),
					transform,
					wordMorphData;
				
				for (var i=0, il=transforms.length; i<il; i++) {
					transform = transforms[i];
					
					if (transform.strong != null && w.hasClass(transform.strong)) {
						w.css(transform.css);
					}
					
					if (transform.morph != null) {
						wordMorphData = w.attr('data-morph');
						if (wordMorphData != null && transform.morph.test(wordMorphData)) {
							w.css(transform.css);	
						}
					}
				}
			});
		});
		
		
		// add button to header
		$('<input type="button" id="docs-morphology" />')
			.appendTo(docManager.header.find('#header-nav'))
			.on('click', function() {
				if (morphWindow.window.is(':visible'))
					morphWindow.hide();
				else
					morphWindow.show();
			});			
		
	}
});