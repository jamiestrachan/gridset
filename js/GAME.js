var GAME = {
	states: {},
	settings: {
		rows: 8,
		cols: 8,
		pieceAttributes : 3,
		pieceAttributeValues: 3, // this also determines how many pieces are needed to make a set
		allowDiagonal: true,
		queueLength: 5,
		pieceSize: 40,
		timerInterval: 10000,
		pointsPerSet: 100,
		emptyBoardBonus: 500
	}
};
