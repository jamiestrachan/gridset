GAME.board = (function () {
	var settings = GAME.settings;
	var rows = settings.rows;
	var cols = settings.cols;
	var grid = [];
	
	function boardWalk(func) {
		var x, y;
		for (y = 0; y < rows; y++) {
			for (x = 0; x < cols; x++) {
				func(x, y, grid[x][y]);
			}
		}
	}
	
	function reset () {
		var x, y, startxs, startys, i, j;
		
		// clear out (or build) the board
		grid = [];
		for (x = 0; x < cols; x++) {
			grid[x] = [];
			for (y = 0; y < rows; y++) {
				grid[x][y] = null;
			}
		}
		
		// add start pieces
		startxs = [Math.floor(cols / 2) - 1, Math.floor(cols / 2)];
		startys = [Math.floor(rows / 2) - 1, Math.floor(rows / 2)];
		for (i = 0; i < startxs.length; i++) {
			for (j = 0; j < startys.length; j++) {
				placePiece(startxs[i], startys[j], new GAME.Piece(), true);
			}
		}
	}
	
	function isPiece (x, y) {
		return ((x >= 0) && (y >= 0) && (x < cols) && (y < rows) && !!grid[x][y]);
	}
	
	function isPlayable (x, y) {
		var testVal, adjacent;
		testVal = !isPiece(x, y);
		testVal = testVal && (x >= 0) && (y >= 0) && (x < cols) && (y < rows);
		adjacent = isPiece(x-1, y) || isPiece(x+1, y) || isPiece(x, y-1) || isPiece(x, y+1);
		if (settings.allowDiagonal) {
			adjacent = adjacent || (isPiece(x-1, y-1) || isPiece(x-1, y+1) || isPiece(x+1, y-1) || isPiece(x+1, y+1));
		}
		return testVal && adjacent;
	}
	
	function getRandomPlayable () {
		var checkx = -1
		var checky = -1;
		while (!isPlayable(checkx, checky)) {
			checkx = Math.floor(Math.random() * cols);
			checky = Math.floor(Math.random() * rows);
		}
		return {x: checkx, y: checky};
	}
	
	function checkSet(pieces) {
		var allSame, allDifferent, attList, i, j;
		
		if (pieces.length !== settings.pieceAttributeValues) {
			return false;
		}
		// loop through one attribute at a time
		for (i = 0; i < settings.pieceAttributes; i++) {
			// reset
			attList = [];
			allSame = true;
			allDifferent = true;
			// build a list of all the values of the attribute in question for each piece
			for (j = 0; j < pieces.length; j++) {
				if ((pieces[j].getAttributes === undefined) || (typeof pieces[j].getAttributes()[i] !== "number")) { return false; } // make sure we're working with pieces
				attList.push(pieces[j].getAttributes()[i]);
			}
			attList.sort(); // by sorting the array of values, we can test uniqueness by just comparing values to their neighbours
			for (j = 0; j < attList.length - 1; j++) {
				allSame = allSame && (attList[j] === attList[j+1]);
				allDifferent = allDifferent && (attList[j] !== attList[j+1]);
			}
			if (!allSame && !allDifferent) { return false; } // stop the test if any attribute fails
		}
		return true;
	}
	
	function checkBoard(x, y) {
		var piecesInASet = settings.pieceAttributeValues;
		var steps = piecesInASet - 1;
		var vectors = [[-1,0], [0,-1]];
		var sets = [];
		var v, s, p, startx, starty, curx, cury, testPieces, testCoords;
		
		if (settings.allowDiagonal) { vectors.push([-1,-1]); vectors.push([-1,+1]); }
		
		for (v = 0; v < vectors.length; v++) {
			for (s = -steps; s <= 0; s++) {
				startx = (vectors[v][0] * s) + x;
				starty = (vectors[v][1] * s) + y;
				testPieces = [];
				testCoords = [];
				for (p = 0; p < piecesInASet; p++) {
					curx = startx + (vectors[v][0] * p);
					cury = starty + (vectors[v][1] * p);
					if (isPiece(curx, cury)) {
						testCoords.push([curx, cury]);
						testPieces.push(grid[curx][cury]);
					}
				}
				if (testPieces.length === piecesInASet) {
					if (checkSet(testPieces)) {
						sets.push(testCoords);
					}
				}
			}
		}
		return sets;
	}
	
	function handleSets(sets) {
		GAME.scorekeeper.scoreSets(sets.length);
		if (sets && sets.length && sets.length > 0) {
			for (i = 0; i < sets.length; i++) {
				for (j = 0; j < sets[i].length; j++) {
					clearPiece(sets[i][j][0], sets[i][j][1]);
				}
			}
			if (isEmptyBoard()) {
				GAME.display.announce("Empty board!");
				GAME.scorekeeper.scoreEmptyBoard();
				reset();
			}
		}
	}
	
	function clearPiece (x, y) {
		if (isPiece(x, y)) { grid[x][y] = null; }
	}
	
	function placePiece (x, y, piece, force) {
		var coords;
		if (!x && !y) { // place piece randomly if x, y aren't specified
			coords = getRandomPlayable();
			x = coords.x;
			y = coords.y;
		}
		if (force || isPlayable(x, y)) {
			if (!piece) {
				piece = GAME.queue.nextPiece();
			}
			grid[x][y] = piece;
			if (!force) { handleSets(checkBoard(x, y)); } // we only force pieces at the beginning of the game so checking sets is irrelevant and messes up the scorekeeper
			return true;
		} else {
			return false;
		}
	}
	
	function isEmptyBoard () {
		var countPieces = 0;
		boardWalk(function (x, y) {
			if (isPiece(x, y)) { countPieces++; }
		});
		return (countPieces === 0);
	}
	
	function isGameOver () {
		var countPlayable = 0;
		boardWalk(function (x, y) {
			if (isPlayable(x, y)) { countPlayable++; }
		});
		return (countPlayable === 0);
	}
	
	function toString () {
		var str = "";
		boardWalk(function (x, y, spot) {
			if ((x === 0) && (y !== 0)) { str += "\r\n"; }
			if (spot) {
				str += spot.toString();
			} else {
				str += "[     ]";
			}
		});
		return str;
	}
	
	return {
		reset: reset,
		boardWalk: boardWalk,
		placePiece: placePiece,
		isGameOver: isGameOver,
		toString: toString
	};
}());