/**
 * Shows map icon for verses
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function( docManager ) { 
				
		if (!docs.Features.hasTouch) {
			
			// create media popup
			var
				chaptersAwaiting = [],
				popup = docs.createModal('map-library', docs.Localizer.get('plugin_maps_title')).size(320,200).center();

			// click an map in the media popup
			popup.content
				.css('overflow', 'hidden')
				.on('click', 'img', function() {
				
					// show map in a new window	
					var map = $(this),
						src = map.attr('src'),
						mapHeight = map.height(),
						mapWidth = map.width(),
						windowWidth = screen.availWidth,
						windowHeight = screen.availHeight,
						windowX = 0,
						windowY = 0;
					
					if (mapHeight > mapWidth)  {
						// center the portrait map
						windowWidth = mapWidth / mapHeight * windowHeight;
					} else {
						windowHeight = mapHeight / mapWidth * windowWidth;
					}
					windowY = screen.availHeight / 2 - windowHeight / 2;
					windowX = screen.availWidth / 2 - windowWidth / 2;				
					
					// hide the thumbnails if there is only one
					if (map.parent().siblings().length == 0) {
						popup.hide();
					}
					
					// launch map
					var imgWin = window.open(src,'map-view','left=' + windowX  +',top=' + windowY + ',width=' + windowWidth + ',height=' + windowHeight + ',toolbar=0,scrollbars=0,status=0');
				});				
			
			
			// setup events to add media icons
			docManager.addEventListener('load', function(e) {				
				addMediaIcons(e.chapter);
			});
			
			// add option
			docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_maps'), 'maps', true);
			
			function addMediaIcons(chapter) {
				
				if (typeof mapLibrary == 'undefined') {
					if (chaptersAwaiting != null) {
						chaptersAwaiting.push(chapter);
					}
						
				} else {					
				
					chapter.find('.verse').each(function(index, verseNode) {
						
						// find verse and look for maps
						var verse = $(verseNode),
							verseId = verse.attr('data-osis'),
							maps = mapLibrary[verseId],
							verseOffset = null,
							parentContent = null,
							parentContentOffset = null;
						
						// if we have maps, then insert the icon	
						if (typeof maps != 'undefined') {
							
							var mediaIcon = $('<span class="map-icon inline-icon"></span>')
												.appendTo(verse);
						}
						
					});
					
					chapter.on('click', '.map-icon', function() {
						
						var
							mapIcon = $(this),
							verse = mapIcon.closest('.verse'),
							verseOsis = verse.attr('data-osis'),
							reference = new bible.Reference(verseOsis).toString(),
							mapsData = mapLibrary[verseOsis],
							before = '<li><img src=\"content/maps/',
							after = '\" /></li>',
							mapsHtml = before + mapsData.join(after + before) + after;
							
						popup.title.html('maps: ' + reference.toString());
							
						popup.content.html('<ul class="map-library-thumbs">' + mapsHtml + '</ul>');
						popup.center().show();
					});
				}
				
			}
			
			$.ajax({
				url: 'content/maps/maps.js',
				dataType: 'script',
				success: function() {
					
					while (chaptersAwaiting.length > 0) {
						var chapter = chaptersAwaiting.pop();
						addMediaIcons(chapter);
					}
				},
				error: function() {
					console.log('ERROR: loading maps');
					chaptersAwaiting = null;
				}
			});					
			
		}
	}
});
