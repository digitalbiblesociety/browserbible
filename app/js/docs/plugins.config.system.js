/**
 * Adds any notes about the system
 *
 * @author John Dyer (http://j.hn/)
 */


docs.plugins.push({

	init: function(docManager) {

		$('<div><p>inScript Bible Browser: <a href="http://www.github.com/digitalbiblesociety/biblebrowser/">source code</a> | <a href="http://www.github.com/digitalbiblesociety/biblebrowser/">Digital Bible Society</a></p></div>')
			.appendTo(docManager.configWindow.content);

			
	}
	
});