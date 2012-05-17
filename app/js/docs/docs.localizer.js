docs.Localizer = {
	language: 'ar',
	defaultLanguage: 'en',
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
	"en": {
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
		"bible_navigator_chapters": "Chapters"

	},
	"ar": {
		"site_title": "الكتاب المقدس متصفح",
		"site_footer": "<a href='http://dbsbible.org/'>Sofia Bible Browser</a> مدعوم منم ",
		
		"plugin_config_title": "تكوين",
		"plugin_config_option_theme": "موضوع",
		"plugin_config_option_font": "الخط",
		"plugin_config_option_size": "الحجم",
		"plugin_config_option_chapters": "الفصول",
		"plugin_config_option_verses": "آيات",
		"plugin_config_option_wordsofchrist": "كلمات المسيح",
		"plugin_config_option_notes": "ملاحظات",
		"plugin_config_option_images": "صور",
		"plugin_config_option_video": "الفيديو",
		
		"plugin_morphology_title": "تسليط الضوء على علم الصرف",
		"plugin_config_table_strong": " قوي و# ,",
		"plugin_config_table_morph": "علم الصرف / تردد",
		"plugin_config_table_style": "ستايل",
		"plugin_config_table_color": "لون",
		"plugin_config_table_add": "إضافة صف",
		
		"plugin_lemma_title": "بيانات يما",
		
		"plugin_images_title": "صور",
		
		"plugin_video_title": "الفيديو",
		
		"plugin_notesandcf_note": "علما",
		"plugin_notesandcf_cf": "المراجع الصليب",
		
		"bible_navigator_books": "الكتب",
		"bible_navigator_chapters": "الفصول"
		
		
	}
}

