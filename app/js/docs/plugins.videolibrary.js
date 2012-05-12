/**
 * Shows videos for verses
 * HARDCODED URLS: We don't know what languages, versions, etc. will be availble so this only makes the icons and player work.
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function( docManager ) { 
				
		if (!docs.Features.hasTouch) {
			

			// create media popup
			var
				width = 640,
				height = 360,
				popup = docs.createModal('video-player', 'Video').size(width+14,height+36).center(),
				playerid = 'player1',
				player = null,
				currentUrls = '';
				
			popup.content.css('padding', 0);
				
				
			function playUrl(urls) {
				
				if (player != null) {
					if (currentUrls == urls) {
						//player.setCurrentTime(0);
						player.play();
					} else {
						player.setSrc(urls);
						player.load();
						player.play();
					}
					
					currentUrls = urls;
				}
				
			}
 
			// click an image in the media popup
			popup.content.html('<video id="' + playerid + '" width="' + width.toString() + '" height="' + height.toString() + '" style="width:100%; height:100%;"></video>');
			
			
			// setup events to add media icons
			docManager.addEventListener('load', function(e) {
				
				addVideoIcons(e.chapter);
				
			});
			
			// add option
			docManager.createOptionToggle('Video', 'video', true);			
			
			function addVideoIcons(chapter) {
				
				chapter.find('.verse').each(function(index, verseNode) {
					
					// find verse and look for images
					var verse = $(verseNode),
						verseId = verse.attr('data-osis'),
						videos = videoLibrary[verseId];
					
					// if we have images, then insert the icon	
					if (typeof videos != 'undefined') {
						var videosIcon = $('<span class="video-icon inline-icon"></span>').appendTo(verse);
					}
					
				});
				
				chapter.on('click', '.video-icon', function() {
				
					var
						videoIcon = $(this),
						verse = videoIcon.closest('.verse'),
						verseOsis = verse.attr('data-osis'),
						reference = new bible.Reference(verseOsis).toString(),
						videoIndex = videoLibrary[verseOsis],
						//videoUrl = 'content/videos/jesusfilm/en_cr/JESUS_Western Caribbean Creole English_61-' + videoIndex + '_60229.mp4';
						videoSrc = [
									{type: 'video/mp4', src: 'content/videos/jesusfilm/en_cr/JESUS_Western Caribbean Creole English_61-' + videoIndex + '_60229.mp4'},
									{type: 'video/mp4', src: 'content/videos/jesusfilm/en_cr/JESUS_Western Caribbean Creole English_61-' + videoIndex + '_60229.webm'}
								   ];
						
					popup.title.html('Video: ' + reference.toString());	
					popup.center().show();
					
					if (player != null) {
						
						playUrl(videoSrc);
					} else {
						
						$('#' + playerid).mediaelementplayer({type:['video/mp4','video/webm'], success: function(m, n, p) {
							player = p;
							playUrl(videoSrc);
						}});
						
					}
				});
				
				popup.close.on('click', function() {
					player.pause();
					
				});
				
			}
			
		}
	}
});
