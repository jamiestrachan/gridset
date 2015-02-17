GAME.states.game = (function () {
	var dom = GAME.dom;
	var $ = dom.$;
	var firstRun = true;
	var timed = true;
	var timerDuration, timerTimer, timerStart;

	function init (mode) {
		if (firstRun) {
			GAME.input.init();
			GAME.input.bind("click", handleClick);
			firstRun = false;
		}
		
		if (mode === "freeplay") { timed = false; }
		dom.empty($("#boardcontainer")[0]);
		dom.empty($("#queuecontainer")[0]);
		GAME.queue.reset();
		GAME.board.reset();
		GAME.scorekeeper.reset();
		GAME.display.init();
		if (timed) {
			GAME.timer.reset();
			GAME.timer.addListener(handleTimeout);
			displayTimer();
			GAME.timer.start();
		}

		return true;
	}
	
	function handleClick(x, y) {
		if (GAME.board.placePiece(x, y)) {
			GAME.display.redraw();
			if (timed) {
				clearInterval(timerTimer);
				GAME.timer.restart();
				displayTimer();
			}
		}
	}
	
	function displayTimer () {
		if ($("#timercontainer div").length === 0) {
			$("#timercontainer")[0].appendChild(document.createElement("div"));
		} else {
			dom.removeClass($("#timercontainer div")[0], "warning");
			dom.removeClass($("#timercontainer div")[0], "danger");
		}
		timerDuration = GAME.timer.getInterval();
		clearInterval(timerTimer);
		timerStart = Date.now();
		redrawTimer();
		timerTimer = setInterval(redrawTimer, 33);
	}
	
	function redrawTimer () {
		var delta = Date.now() - timerStart;
		var progress = delta / timerDuration;
		if (progress > 0.8) {
			dom.removeClass($("#timercontainer div")[0], "warning");
			dom.addClass($("#timercontainer div")[0], "danger");
		} else if (progress > 0.6) {
			dom.addClass($("#timercontainer div")[0], "warning");
		}
		$("#timercontainer div")[0].style.width = ((1 - progress) * 100) + "%";
	}
	
	function handleTimeout () {
		clearInterval(timerTimer);
		GAME.board.placePiece();
		GAME.display.redraw();
		displayTimer();
		if (GAME.board.isGameOver()) {
			GAME.timer.stop();
			clearInterval(timerTimer);
			GAME.display.announce("GAME OVER!");
		}
	}
	
	return {
		init: init
	}
}());