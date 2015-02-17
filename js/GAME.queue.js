GAME.queue = (function () {
	var settings = GAME.settings;
	var queueLength = settings.queueLength;
	var queue = [];
	
	function reset () {
		var i;
		
		queue = [];
		for (i = 0; i < queueLength; i++) {
			queue.push(new GAME.Piece());
		}
	}
	
	function walkQueue (func) {
		var i;
		for (i = 0; i < queueLength; i++) {
			func(i, queue[i]);
		}
	}
	
	function nextPiece () {
		queue.push(new GAME.Piece());
		return queue.shift();
	}
	
	function toString () {
		return "[" + queue.join(",") + "]";
	}
	
	return {
		reset: reset,
		walkQueue: walkQueue,
		nextPiece: nextPiece,
		toString: toString
	};
}());