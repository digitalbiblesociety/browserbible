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
				popup = docs.createModal('image-library', 'Images').size(320,200).center();

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
			docManager.createOptionToggle('Images', 'images', true);
			
			function addMediaIcons(chapter) {
				
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
						imagesData = imageLibrary[verseOsis],
						before = '<li><img src=\"content/images/',
						after = '\" /></li>',
						imagesHtml = before + imagesData.join(after + before) + after;
						
					popup.title.html('Images: ' + reference.toString());
						
					popup.content.html('<ul class="image-library-thumbs">' + imagesHtml + '</ul>');
					popup.center().show();
				});
				
			}
			
		}
	}
});
