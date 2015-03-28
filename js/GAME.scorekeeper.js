GAME.scorekeeper = (function () {
	var settings = GAME.settings;
	var pointsPerSet = GAME.settings.pointsPerSet;
	var emptyBoardBonus = GAME.settings.emptyBoardBonus;
	var score, multiplier;
	
	function reset () {
		score = 0;
		multiplier = 1;
	}
	
	function getScore () {
		return score;
	}
	
	function getMultiplier () {
		return multiplier;
	}
	
	function scoreSets (count) {
		score += count * pointsPerSet * multiplier * (1 + (0.5 * (count - 1)));
		if (count > 0) {
			multiplier++;
		} else {
			multiplier = 1;
		}
	}
	
	function scoreEmptyBoard () {
		score += emptyBoardBonus;
	}
	
	return {
		reset: reset,
		getScore: getScore,
		getMultiplier: getMultiplier,
		scoreSets: scoreSets,
		scoreEmptyBoard: scoreEmptyBoard
	};
}());
