GAME.Piece = function () {
	var settings = GAME.settings;
	var args = Array.prototype.slice.call(arguments);
	var attributes = [];
	
	function getAttributes() {
		return attributes;
	}
	
	function toString() {
		return "[" + attributes.join(",") + "]";
	}
	
	// construct
	(function () {
		var i;
		if (args) {
			if ((args.length === 1) && (args[0].length === settings.pieceAttributes)) {
				attributes = args[0];
			} else if (args.length === settings.pieceAttributes) {
				attributes = args;
			}
		}
		if (attributes.length === 0) {
			for (i = 0; i < settings.pieceAttributes; i++) {
				attributes.push(Math.floor(Math.random() * settings.pieceAttributeValues));
				//attributes.push(0)
			}
		}
	}());
		
	return {
		getAttributes : getAttributes,
		toString : toString
	};
};