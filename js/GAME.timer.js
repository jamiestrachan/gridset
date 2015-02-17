GAME.timer = (function () {
	var settings = GAME.settings;
	var interval = settings.timerInterval;
	var listeners = [];
	var timer;
	
	function reset () {
		interval = settings.timerInterval;
		listeners = [];
	}
	
	function start () {
		timer = setTimeout(timerUp, interval);
	}
	
	function stop () {
		clearTimeout(timer);
	}
	
	function restart () {
		stop();
		start();
	}
	
	function addListener (func) {
		listeners.push(func);
	}
	
	function getInterval () {
		return interval;
	}
	
	function timerUp () {
		var i;
		for (i = 0; i < listeners.length; i++) {
			listeners[i](interval);
		}
		start();
	}
	
	return {
		reset: reset,
		start: start,
		stop: stop,
		restart: restart,
		getInterval: getInterval,
		addListener: addListener
	};
}());