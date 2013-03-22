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
						//popup.hide();
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
							reference = new bible.Reference(verseOsis).toString(),
							imagesData = allPrevNext.concat(flexPrev, imageLibrary[verseOsis], flexNext),
							before = '<li><img src=\"content/images/',
							after = '\" width="75" /></li>',
							imagesHtml = before + imagesData.join(after + before) + after,
							imgIndex = 0;
							
						for (var i = 0; i < imageLibraryKeys.length; i++) {
						  if (imageLibrary[verseOsis] == imageLibrary[imageLibraryKeys[i]]) {
								imgIndex = i;
							}
						};
	
						popup.title.html('Images: ' + reference.toString());							
						popup.content.html('<ul class="image-library-thumbs">' + imagesHtml + '</ul><div class="imgControls"><span class="imgPrev"><span></span></span><span class="imgNext"><span></span></span></div>');
						popup.center().show();
						
						function imgSlides(index) {
							$('.image-library-thumbs').empty();
							popup.title.html('Images: ' + bible.Reference(imageLibraryKeys[index]).toString());
							$('.image-library-thumbs').append(before + imageLibrary[imageLibraryKeys[index]].join(after + before) + after);
							$('.document-input').val(bible.Reference(imageLibraryKeys[index]).toString());
							docManager.documents[0].navigateToUserInput();
							imgIndex = index;
						};
						
						$('.imgNext').click(function() {
							imgSlides(imgIndex + 1);
						});
						
						$('.imgPrev').click(function() {
							imgSlides(imgIndex - 1);
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

