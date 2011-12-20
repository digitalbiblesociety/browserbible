/**
 * Master navigation
 *
 * @author John Dyer (http://j.hn/)
 */

var DocumentManager = function (id) {
	this.id;
	this.node = $(id);
	this.documents = [];
};
DocumentManager.prototype = {
	createDocument: function(id, navigator) {
		var docNode = $(
			'<div id="' + id + '" class="document-window">' + 
				'<div class="document-header">' + 
					'<input type="text" class="document-location" />' + 
				'</div>' +
				'<div class="document-body">' + 
					'<div class="document-content"></div>' +
				'</div>' +
			'</div>'),
			
			doc = new docs.Document(id, navigator, docNode);
				
		this.documents.push(doc);
		this.node.append(docNode);
				
		return doc;
			
		
	}
};