/**
 * Shows image icon for verses
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function( docManager ) { 
				
		if (!docs.Features.hasTouch) {
			
			// create media popup
			var
				chaptersAwaiting = [],
				popup = docs.createModal('image-library', docs.Localizer.get('plugin_images_title')).size(320,200).center();

			// click an image in the media popup
			popup.content
				.css('overflow', 'hidden')
				.on('click', 'img', function() {
				
					// show image in a new window	
					var image = $(this),
						src = image.attr('src'),
						imageHeight = image.height(),
						imageWidth = image.width(),
						windowWidth = screen.availWidth,
						windowHeight = screen.availHeight,
						windowX = 0,
						windowY = 0;
					
					if (imageHeight > imageWidth)  {
						// center the portrait image
						windowWidth = imageWidth / imageHeight * windowHeight;
					} else {
						windowHeight = imageHeight / imageWidth * windowWidth;
					}
					windowY = screen.availHeight / 2 - windowHeight / 2;
					windowX = screen.availWidth / 2 - windowWidth / 2;				
					
					// hide the thumbnails if there is only one
					if (image.parent().siblings().length == 0) {
						popup.hide();
					}
					
					// launch image
					var imgWin = window.open(src,'image-view','left=' + windowX  +',top=' + windowY + ',width=' + windowWidth + ',height=' + windowHeight + ',toolbar=0,scrollbars=0,status=0');
				});				
			
			
			// setup events to add media icons
			docManager.addEventListener('load', function(e) {				
				addMediaIcons(e.chapter);
			});
			
			// add option
			docManager.createOptionToggle(docs.Localizer.get('plugin_config_option_images'), 'images', true);
			
			function addMediaIcons(chapter) {
				
				if (typeof imageLibrary == 'undefined') {
					if (chaptersAwaiting != null) {
						chaptersAwaiting.push(chapter);
					}
						
				} else {					
				
					chapter.find('.verse').each(function(index, verseNode) {
						
						// find verse and look for images
						var verse = $(verseNode),
							verseId = verse.attr('data-osis'),
							images = imageLibrary[verseId],
							verseOffset = null,
							parentContent = null,
							parentContentOffset = null;
						
						// if we have images, then insert the icon	
						if (typeof images != 'undefined') {
							
							var mediaIcon = $('<span class="image-icon inline-icon"></span>')
												.appendTo(verse);
						}
						
					});
					
					chapter.on('click', '.image-icon', function() {
						console.log('ICON');
						var 
							imageIcon = $(this),
							verse = imageIcon.closest('.verse'),
							verseOsis = verse.attr('data-osis'),
							imageLibraryKeys = Object.keys(imageLibrary),
							flexPrev = [],
							flexNext = [],
							n = 0,
							p = 0;
							
						for (var i = 0; i < imageLibraryKeys.length; i++) {
						  if (imageLibrary[verseOsis] == imageLibrary[imageLibraryKeys[i]]) {
								n = i;
								p = i;
								if (imageLibrary[imageLibraryKeys[i - 1]] != undefined) {
									flexPrev = flexPrev.concat(imageLibrary[imageLibraryKeys[i - 2]], imageLibrary[imageLibraryKeys[i - 1]])
								} else {
									flexPrev = [];
								}
								if (imageLibrary[imageLibraryKeys[i + 1]] != undefined) {
									flexNext = flexNext.concat(imageLibrary[imageLibraryKeys[i + 1]],imageLibrary[imageLibraryKeys[i + 2]])
								} else {
									flexNext = [];
								}
							}
						}
						
						var
							n = n + 3,
							p = p - 3,
							allPrevNext = [],
							reference = new bible.Reference(verseOsis).toString(),
							imagesData = allPrevNext.concat(flexPrev, imageLibrary[verseOsis], flexNext),
							before = '<li><img src=\"content/images/',
							after = '\" /></li>',
							imagesHtml = before + imagesData.join(after + before) + after;
							
						popup.title.html('Images: ' + reference.toString());							
						popup.content.html('<div class="flexslider carousel"><ul class="slides">' + imagesHtml + '</ul></div>');
						popup.center().show();
						
						$('.flexslider').flexslider({
							animation: "slide",
							animationLoop: false,
							slideshow: false,
							controlNav: false,
							itemWidth: 85,
							itemMargin: 5,
							start: function(slider) {
								//$('.flexslider').flexslider(slider.count-3)
							},
							end: function(slider){
								$(".pull-next").click(function(e) {
									e.preventDefault();
									slider.addSlide(before + imageLibrary[imageLibraryKeys[n + 1]].join(after + before) + after)
									$('.flexslider').flexslider("next")
									n = n + 1;
								});
								$(".pull-prev").click(function(e) {
									e.preventDefault();
									slider.addSlide(before + imageLibrary[imageLibraryKeys[p - 1]].join(after + before) + after, 0)
									$('.flexslider').flexslider("prev")
									p = p - 1;
								});
							}
						});
					});
				}
			}
			
			$.ajax({
				url: 'content/images/images.js',
				dataType: 'script',
				success: function() {
					
					while (chaptersAwaiting.length > 0) {
						var chapter = chaptersAwaiting.pop();
						addMediaIcons(chapter);
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

