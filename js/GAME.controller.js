GAME.controller = (function () {
	var dom = GAME.dom;
	var $ = dom.$;
	var firstRun = true;
	
	function init () {
		if (firstRun) {
			if (/Android/.test(navigator.userAgent)) {
					$("html")[0].style.height = "200%";
					setTimeout(function() {
							window.scrollTo(0, 1);
					}, 0);
			}
			
			dom.bindAll($("button[data-state]"), "click", function (e) { changeState(e.currentTarget.getAttribute("data-state"), e.currentTarget.getAttribute("data-stateinfo")); });
			firstRun = false;
		}
	}
	
	function changeState (newState, stateInfo) {
		var $states = $(".state");
		var i;
		
		if (GAME.states[newState] && GAME.states[newState].init(stateInfo)) {
			dom.hide($states);
			dom.show($(".state#" + newState));
		}
	}

	return {
		init: init,
		changeState: changeState
	}
}());