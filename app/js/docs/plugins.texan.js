	
/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function(docManager) {
	
		docManager.addStyle('\
.texan-old {\
text-decoration: line-through;\
color: #444;\
}\
.texan-corrected {\
}\
.config-texan-off .texan-old {\
text-decoration: inherit;\
color: inherit;\
}\
.config-texan-off .texan-corrected {\
display: none;\
}');	
	
		
		docManager.createOptionToggle('Texanize plurals', 'texan', true);
			
		
		var youRegExp = /\byou\b/gi,
			yourRegExp = /\byour\b/gi;

		
		function runTransforms(node) {
		
			node.find('.verse').each(function(index, el) {
				var verse = $(this),
					osis = verse.attr('data-osis');

				if (bible.texan.yallare.indexOf(osis) > -1) {
					
					var html = verse.html();
					
					html = html.replace(yourRegExp, '<span class="texan-old">your</span><span class="texan-corrected"> y&rsquo;alls</span>');
					html = html.replace(youRegExp, '<span class="texan-old">you</span><span class="texan-corrected"> y&rsquo;all</span>');
				
					verse.html( html )
				};
			});
			
		
		}
	
	
		// run transforms
		docManager.addEventListener('load', function(e) {
			if (e.chapter.attr('lang') == 'eng') {
				runTransforms(e.chapter);
			}
		});				
		
	}
});

bible.texan = {
	yallare: [
		'1Cor.2.5',
		'1Cor.3.16',
		'1Cor.3.17'
	],	

};