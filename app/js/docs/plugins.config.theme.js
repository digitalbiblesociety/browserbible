/**
 * Adds theme options to the config window
 *
 * @author John Dyer (http://j.hn/)
 */


docs.plugins.push({

	init: function(docManager) {

		var
			// THEME colors
			themeOptions = [
				{name: 'Default'},
				{name: 'Brown'},
				{name: 'White'},
				{name: 'Steel'},				
			],
			renderThemeOption = function(id, name) {
				return 	'<label for="' + id + '" class="' + id + '" title="' + name + '">' +
							'<span class="config-theme-' + name.toLowerCase() + '-demo1 theme-demo"></span><span class="config-theme-' + name.toLowerCase() + '-demo2 theme-demo"></span>' +
						'</label>';
			};
			
			
		docManager.createOptionSet(docs.Localizer.get('plugin_config_option_theme'), 'theme', themeOptions, renderThemeOption);
			
	}
	
});