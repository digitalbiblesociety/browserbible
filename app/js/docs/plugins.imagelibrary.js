/**
 * Shows image icon for verses
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.push({

	init: function( docManager ) { 
				
		if (!docs.Features.hasTouch) {
			
			var
				popup = docs.createModal('image-library', 'Images').size(320,200).center(),
				imageIcon = $('<div class="image-library-icon"></div>')
									.appendTo(document.body)
									.hide(),
				currentVerseOsis = '',
				timer = null,
				startTimer = function() {				
					stopTimer();
					timer = setTimeout(function() {
						imageIcon.hide();
					}, 1000);
				},
				stopTimer = function() {
					if (timer != null) {
						clearTimeout(timer);
						timer = null;
					}
				};
			
			imageIcon.on('mouseover' , function() {
				stopTimer();
			}).on('mouseout', function() {
				startTimer();
			}).on('click', function() {
				
				// show images as thumbnails in a popup window
				
				var
					reference = new bible.Reference(currentVerseOsis).toString(),
					imagesData = imageLibrary[currentVerseOsis],
					before = '<li><img src=\"content/images/',
					after = '\" /></li>',
					imagesHtml = before + imagesData.join(after + before) + after;
				
				popup.title.html('Images: ' + reference.toString());
					
				popup.content.html('<ul class="image-library-thumbs">' + imagesHtml + '</ul>');
				popup.center().show();
			});
			
			
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
						// keep screen height as full
						
						windowWidth = imageWidth / imageHeight * windowHeight;
						windowX = screen.availWidth / 2 - windowWidth / 2;
						
					} else {
						windowHeight = imageHeight / imageWidth * windowWidth;
						windowY = screen.availHeight / 2 - windowHeight / 2;
					}
					
					
					var imgWin = window.open(src,'image-view','left=' + windowX  +',top=' + windowY + ',width=' + windowWidth + ',height=' + windowHeight + ',toolbar=0,scrollbars=0,status=0');
				});
			
			
			// check for verses to show
			docManager.content.on('mouseover', 'span.verse', function() {
				
				stopTimer();
					
				var verse = $(this),
					verseId = verse.attr('data-osis'),
					images = imageLibrary[verseId],
					verseOffset = null,
					parentContent = null,
					parentContentOffset = null;
					
				if (typeof images != 'undefined') {
					
					currentVerseOsis = verseId;
					verseOffset = verse.offset();
					parentContent = verse.closest('.document-content');
					parentContentOffset = parentContent.offset();
					
					imageIcon
						.css( {top: verseOffset.top, left: parentContentOffset.left} )
						.show();
				} else {
					currentVerseOsis = '';
					
					imageIcon.hide();
				}
				
				
			}).on('mouseout', 'span.verse', function() {
			
				startTimer();
			});
		}
	}
});
