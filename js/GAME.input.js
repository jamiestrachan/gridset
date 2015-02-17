GAME.input = (function () {
	var settings = GAME.settings;
	var dom = GAME.dom;
	var $ = dom.$;
	var handlers;
	
	function handleClick(e, click) {
		var board = $("#boardcontainer")[0];
		var rect = board.getBoundingClientRect();
		var relX, relY, x, y
		
		e.preventDefault();

		relX = click.clientX - rect.left;
		relY = click.clientY - rect.top;

		x = Math.floor(relX / rect.width * settings.cols);
		y = Math.floor(relY / rect.height * settings.rows);

		trigger("click", x, y);
	}
	
	function init () {
		var board = $("#boardcontainer")[0];

		handlers = {};

		dom.bind(board, "mousedown", function(e) {
				handleClick(e, e);
		});
		
		dom.bind(board, "touchstart", function(e) {
				handleClick(e, e.targetTouches[0]);
		});
	}
	
	function bind (action, handler) {
		if (!handlers[action]) { handlers[action] = []; }
		
		handlers[action].push(handler);
	}

	function trigger(action) {
		var actionHandlers = handlers[action];
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (actionHandlers) {
			for (var i = 0; i < actionHandlers.length; i++) {
				actionHandlers[i].apply(null, args);
			}
		}
	}

	
	return {
		init: init,
		bind: bind
	}
}());