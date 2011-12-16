


docs.Document = function(id, navigator, docNode) {
	var t = this;
	
	t.id = id;
	t.navigator = navigator;
	t.node = docNode;
	
	t.location = docNode.find('.document-location');
	t.content = docNode.find('.document-content');
	
	t.location.change(t.handleChange);
};

docs.Document.prototype = {
	handleChange: function(e) {
		// user entered navigation text
	}
};