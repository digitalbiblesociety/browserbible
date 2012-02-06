
/**
 * Feature/brower/OS detection
 *
 * @author John Dyer (http://j.hn/)
 */

docs.Features = (function() {
	var
		t = {},
		d = document,
		nav = navigator,
		ua = nav.userAgent.toLowerCase();

	// detect browsers (only the ones that have some kind of quirk we need to work around)
	t.isiPad = (ua.match(/ipad/i) !== null);
	t.isiPhone = (ua.match(/iphone/i) !== null);
	t.isiOS = t.isiPhone || t.isiPad;
	t.isAndroid = (ua.match(/android/i) !== null);
	t.isIE = (nav.appName.toLowerCase().indexOf("microsoft") != -1);
	t.isChrome = (ua.match(/chrome/gi) !== null);
	t.isFirefox = (ua.match(/firefox/gi) !== null);
	t.isWebkit = (ua.match(/webkit/gi) !== null);
	t.isOpera = (ua.match(/opera/gi) !== null);
	t.hasTouch = ('ontouchstart' in window);
	
	// Webkit/firefox
	t.hasWebkitNativeFullScreen = (typeof d.webkitRequestFullScreen !== 'undefined');
	t.hasMozNativeFullScreen = (typeof d.mozRequestFullScreen !== 'undefined');
	
	t.hasTrueNativeFullScreen = (t.hasWebkitNativeFullScreen || t.hasMozNativeFullScreen);
	t.nativeFullScreenEnabled = t.hasTrueNativeFullScreen;
	if (t.hasMozNativeFullScreen) {
		t.nativeFullScreenEnabled = d.mozFullScreenEnabled;
	}
	
	if (t.hasTrueNativeFullScreen) {
		t.fullScreenEventName = (t.hasWebkitNativeFullScreen) ? 'webkitfullscreenchange' : 'mozfullscreenchange';
		
		
		t.isFullScreen = function() {
			if (d.mozRequestFullScreen) {
				return d.mozFullScreen;
			} else if (d.webkitRequestFullScreen) {
				return d.webkitIsFullScreen;
			} else {
				return false;
			}
		}
				
		t.requestFullScreen = function(el) {
	
			if (t.hasWebkitNativeFullScreen) {
				el.webkitRequestFullScreen();
			} else if (t.hasMozNativeFullScreen) {
				el.mozRequestFullScreen();
			}
		}
		
		t.cancelFullScreen = function() {				
			if (t.hasWebkitNativeFullScreen) {
				document.webkitCancelFullScreen();
			} else if (t.hasMozNativeFullScreen) {
				document.mozCancelFullScreen();
			}
		}	
		
	}
	
	return t;
})();