/**
 * Shows videos for verses
 * HARDCODED URLS: We don't know what languages, versions, etc. will be availble so this only makes the icons and player work.
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function( docManager ) { 
				
		if (!docs.Features.hasTouch) {
			
			var
				chaptersAwaiting = [];

			// create media popup
			var
				width = 640,
				height = 360,
				popup = docs.createModal('video-player', docs.Localizer.get('plugin_video_title')).size(width+14,height+36).center(),
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
			docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_video'), 'video', true);			
			
			function addVideoIcons(chapter) {
				
				if (typeof videoLibrary == 'undefined') {
					if (chaptersAwaiting != null) {
						console.log('storing', chapter);
						chaptersAwaiting.push(chapter);
					}
						
				} else {
					
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
							canPlayMP4 = (typeof document.createElement("video").canPlayType === "function" && document.createElement("video").canPlayType("video/mp4") !== ""),
							videoIcon = $(this),
							verse = videoIcon.closest('.verse'),
							verseOsis = verse.attr('data-osis'),
							reference = new bible.Reference(verseOsis).toString(),
							videoIndex = videoLibrary[verseOsis],
							//videoUrl = 'content/videos/' + videoIndex + '.mp4';
							videoSrc = [
										{type: 'video/mp4', src: 'content/videos/' + videoIndex + '.mp4'}
									   ];
						if (canPlayMP4) {
						popup.title.html('Video: ' + reference.toString());	
						popup.center().show();
						
						if (player != null) {
							
							playUrl(videoSrc);
						} else {
							
							$('#' + playerid).mediaelementplayer({type:['video/mp4'], success: function(m, n, p) {
								player = p;
								playUrl(videoSrc);
							}});
							
						}
						
					} else {
						$('.popup-content').empty();
						popup.title.html('Video: ' + reference.toString());	
						popup.center().show();
						$('.popup-content').append('<object id="flashplayer" type="application/x-shockwave-flash" data="js/docs/player.swf" width="100%" height="100%"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="flashvars" value="file=../../content/videos/' + videoIndex + '.mp4"></object>');
					}
					});
				}
			}
			
			popup.close.on('click', function() {
				player.pause();
			});			
			
			$.ajax({
				url: 'content/videos/videos.js',
				dataType: 'script',
				success: function() {
					
					while (chaptersAwaiting.length > 0) {
						var chapter = chaptersAwaiting.pop();
						addVideoIcons(chapter);
					}
				},
				error: function() {
					console.log('ERROR: loading videos');
					chaptersAwaiting = null;
				}
			});			
			
		}
	}
});
