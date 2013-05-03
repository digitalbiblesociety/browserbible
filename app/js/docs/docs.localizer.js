docs.Localizer = {
	language: 'eng',
	defaultLanguage: 'eng',
	get: function(key) {
		var word = '';
		
		if (docs.Languages[this.language] && docs.Languages[this.language][key]) {
			word = 	docs.Languages[this.language][key];
		} else if (docs.Languages[this.defaultLanguage] && docs.Languages[this.defaultLanguage][key]) {
			word = 	docs.Languages[this.defaultLanguage][key];
		}
		
		return word;
	},
	localize: function() {
		$('[data-localized]').each(function() {
			var key = $(this).attr('data-localized'),
				word = (key != null) ? docs.Localizer.get(key) : '';
				
			if (word != '') {
				$(this).html(word);
			}
		});
	}
}
docs.Languages = {
	"eng": {
		"site_title": "Bible Browser",
		"site_footer": "Powered by <a href='http://dbsbible.org/'>Sofia Bible Browser</a>",
		
		"plugin_config_title": "Configuration",
		"plugin_config_option_theme": "Theme",
		"plugin_config_option_font": "Font",
		"plugin_config_option_size": "Size",
		"plugin_config_option_chapters": "Chapters",
		"plugin_config_option_verses": "Verses",
		"plugin_config_option_wordsofchrist": "Words of Christ",
		"plugin_config_option_notes": "Notes",
		"plugin_config_option_images": "Images",
		"plugin_config_option_maps": "Maps",
		"plugin_config_option_video": "Video",
		
		"plugin_morphology_title": "Morphology Highlighting",
		"plugin_config_table_strong": "Strong's #",
		"plugin_config_table_morph": "Morphology/Frequency",
		"plugin_config_table_style": "Style",
		"plugin_config_table_color": "Color",
		"plugin_config_table_add": "Add Row",
		
		"plugin_lemma_title": "Lemma Data",
		
		"plugin_images_title": "Images",
		
		"plugin_video_title": "Video",
		
		"plugin_notesandcf_note": "Note",
		"plugin_notesandcf_cf": "Cross References",
		
		"bible_navigator_books": "Books",
		"bible_navigator_chapters": "Chapters",
		"plugin_config_option_titles": "Titles"

	}
}