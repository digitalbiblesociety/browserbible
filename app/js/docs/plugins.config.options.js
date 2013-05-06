/**
 * Create a set of toggles for the config window
 *
 * @author John Dyer (http://j.hn/)
 */

docs.plugins.push({

	init: function(docManager) {
		
		docManager.addStyle('\
.config-chapters-off .chapter-num {\
display: none;\
}');
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_chapters'), 'chapters', true);


		docManager.addStyle('\
.config-verses-off .verse-num {\
	display:none;\
}');
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_verses'), 'verses', true);



		docManager.addStyle('\
.config-notes-off .chapter .note,\
.config-notes-off .chapter .cf {\
	display:none;\
}');
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_notes'), 'notes', true);
		
		
		// <h3> title </h3>
		docManager.addStyle('\
.config-titles-off .chapter h2,\
.config-titles-off .chapter h3 {\
	display:none;\
}');		
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_titles'), 'titles', true);
		
		// <span class="woc">Word of Jesus</h3>	
		docManager.addStyle('\
.config-wordsofchrist-off .woc {\
	color:inherit;\
}');		
		docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_wordsofchrist'), 'wordsofchrist', true);		
			
	}
	
});