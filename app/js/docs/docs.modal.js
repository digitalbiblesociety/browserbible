docs.createModalIndex = 0;
docs.createModal = function(id, startTitle) {
	var popup = $(
			'<div class="popup-window" id="' + id + '">' +
				'<div class="popup-header">' +
					'<span class="popup-title">' + startTitle + '</span>' + 
					'<span class="popup-close"></span>' + 
				'</div>' +
				'<div class="popup-menu"></div>' +
				'<div class="popup-content"></div>' +
				'<div class="popup-footer"></div>' +
			'</div>')
				.appendTo(document.body)
				.hide(),
		header = popup.find('.popup-header'),
		title = popup.find('.popup-title'),
		menu = popup.find('.popup-menu'),
		close = popup.find('.popup-close').on('click', function() { popup.hide(); }),
		content = popup.find('.popup-content'),
		footer = popup.find('.popup-footer'),
		isMouseDown = false,
		startWindowPosition = null,
		startMousePosiont = null;
		
	$(document).on('mousemove', function(e) {
		if (isMouseDown) {
			
			popup.css({
				top: startWindowPosition.top - (startMousePosition.y - e.clientY),
				left: startWindowPosition.left - (startMousePosition.x - e.clientX)	  
			});
		}
		
	}).on('mouseup', function() {
		isMouseDown = false;
	});
	
	
	header.on('mousedown', function(e) {
		isMouseDown = true;
		startWindowPosition = popup.offset();
		startMousePosition = {x:e.clientX, y:e.clientY};
	});
	
	return {
		window: popup,
		height: -1,
		width: -1,
		title: title,
		menu: menu,
		content: content,
		footer: footer,
		close: close,
		hide: function() {
			popup.hide();
			return this;
		},
		show: function() {
			// hide all others
			$('.popup-window').hide();
			
			// show this one
			popup.show().css({'z-index': docs.createModalIndex++});
			
			if (this.height > 0 && this.width > 0) {
				this.size(this.width, this.height);
			}

			return this;
		},
		size: function(width, height) {
			popup
				.width(width)
				.height(height);
				
			var visible = popup.is(':visible');
				
			popup.show();
			
			var newWidth = Math.abs(width - (content.outerWidth(true) - content.width()) );
			content.width(newWidth);
			
			content.height(height 
							- menu.outerHeight(true) 
							- title.outerHeight(true) 
							- footer.outerHeight(true) 
							- (content.outerHeight(true) - content.height()) 
							- 5);
			
			if (!visible)
				popup.hide();
			
			this.height = height;
			this.width = width;
				
			return this;
		},
		center: function() {
			
			var pos = popup.offset(),
				width = popup.outerWidth(true),
				height = popup.outerHeight(true),
				wHeight = $(window).height(),
				wWidth = $(window).width(),
				top = (wHeight - height)/2;
				left = (wWidth - width)/2;
			
			popup.css({top: top, left: left})
			
			return this;
		}
	}
}