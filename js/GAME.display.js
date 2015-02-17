GAME.display = (function () {
	var settings = GAME.settings;
	var rows = settings.rows;
	var cols = settings.cols;
	var pieceSize = settings.pieceSize;
	var queueLength = settings.queueLength;
	var dom = GAME.dom;
	var $ = dom.$;
	var boardContainer, bgCvs, bgCtx, bCvs, bCtx;
	var queueContainer, qCvs, qCtx;
	var scoreContainer;
	
	function drawBackground () {
		var x, y;
		
		bgCtx.save();
		bgCtx.scale(bgCvs.width / cols, bgCvs.height / rows);
		bgCtx.fillStyle = "#eee";
		bgCtx.fillRect(0, 0, cols, rows);
		
		bgCtx.fillStyle = "#d3d3d3";
		for (x = 0; x < cols; x++) {
			for (y = 0; y < rows; y++) {
				if ((x + y) % 2 === 0) {
					bgCtx.fillRect(x, y, 1, 1);
				}
			}
		}
		bgCtx.restore();
		
		bgCtx.save();
		bgCtx.scale(4, 4);
		bgCtx.fillStyle = "#c3c3c3";
		bgCtx.globalAlpha = 0.3;
		
		for (x = 0; x < bgCvs.width / 4; x++) {
			for (y = 0; y < bgCvs.height / 4; y++) {
				if ((x + y) % 2 === 0) {
					bgCtx.fillRect(x, y, 1, 1);
				}
			}
		}
		bgCtx.restore();
	}
	
	function drawPiece (ctx, x, y, piece) {
		var colourIdx = piece.getAttributes()[0];
		var shapeIdx = piece.getAttributes()[1];
		var patternIdx = piece.getAttributes()[2];
		var colour, grad;
		
		ctx.save();
		ctx.scale(bCvs.width / cols, bCvs.height / rows);
		switch (colourIdx) {
			case 0:
				colour = "#f00";
				break;
			case 1:
				colour = "#0f0";
				break;
			case 2:
				colour = "#00f";
				break;
			default:
				colour = "#000";
		}
		ctx.strokeStyle = colour;
		ctx.fillStyle = colour;
		
		switch (shapeIdx) {
			case 0: // square
				ctx.beginPath();
				ctx.moveTo(x + 0.1, y + 0.1);
				ctx.lineTo(x + 0.9, y + 0.1);
				ctx.lineTo(x + 0.9, y + 0.9);
				ctx.lineTo(x + 0.1, y + 0.9);
				ctx.closePath();
				break;
			case 1: // diagonal
				ctx.beginPath();
				ctx.moveTo(x + 0.5, y + 0.1);
				ctx.lineTo(x + 0.9, y + 0.5);
				ctx.lineTo(x + 0.5, y + 0.9);
				ctx.lineTo(x + 0.1, y + 0.5);
				ctx.closePath();
				break;
			case 2: // circle
				ctx.beginPath();
				ctx.arc(x + 0.5, y + 0.5, 0.45, 0, Math.PI * 2, false);
				ctx.closePath();
				break;
			default:
			// ??
		}
		
		switch (patternIdx) {
			case 0:
				ctx.fill();
				break;
			case 1:
				ctx.lineWidth = 0.1;
				ctx.stroke();
				break;
			case 2:
				grad = ctx.createLinearGradient(x, y, x + 1, y + 1);
				grad.addColorStop(0, "white");
				grad.addColorStop(0.1, colour);
				grad.addColorStop(0.2, "white");
				grad.addColorStop(0.3, colour);
				grad.addColorStop(0.4, "white");
				grad.addColorStop(0.5, colour);
				grad.addColorStop(0.6, "white");
				grad.addColorStop(0.7, colour);
				grad.addColorStop(0.8, "white");
				grad.addColorStop(0.9, colour);
				grad.addColorStop(1, "white");
				ctx.fillStyle = grad;
				ctx.fill();
				break;
			default:
		}
		ctx.restore();
	}
	
	function drawBoard () {
		bCtx.clearRect(0, 0, bCvs.width, bCvs.height);
		
		GAME.board.boardWalk(function (x, y, piece) {
			if (piece) { drawPiece(bCtx, x, y, piece); }
		});
	}
	
	function drawQueue () {
		qCtx.clearRect(0, 0, qCvs.width, qCvs.height);

		GAME.queue.walkQueue(function (i, piece) {
			if (piece) {
				qCtx.save();
				if (i !== 0) { qCtx.globalAlpha = 0.5; qCtx.translate(qCvs.height * (((settings.queueLength - 1) - i) / 5), qCvs.height * 0.15); qCtx.scale(0.8, 0.8); }
				drawPiece(qCtx, (settings.queueLength - 1) - i, 0, piece);
				qCtx.restore();
			}
		}, true);
	}
	
	function drawScoreboard () {
		var output = "Score: " + GAME.scorekeeper.getScore();
		if (GAME.scorekeeper.getMultiplier() > 1) {
			output += " <small>(x" + GAME.scorekeeper.getMultiplier() + ")</small>";
		}
		scoreContainer.innerHTML =  output;
	}
	
	function announce (msg) {
		console.log(msg);
	}
	
	function init () {
		boardContainer = $("#boardcontainer")[0];
		bgCvs = document.createElement("canvas");
		dom.addClass(bgCvs, "boardbg");
		bgCvs.width = pieceSize * cols;
		bgCvs.height = pieceSize * rows;
		bgCtx = bgCvs.getContext("2d");
		boardContainer.appendChild(bgCvs);
		
		bCvs = document.createElement("canvas");
		dom.addClass(bCvs, "board");
		bCvs.width = pieceSize * cols;
		bCvs.height = pieceSize * rows;
		bCtx = bCvs.getContext("2d");
		boardContainer.appendChild(bCvs);
		
		queueContainer = $("#queuecontainer")[0];
		qCvs = document.createElement("canvas");
		dom.addClass(qCvs, "board");
		qCvs.width = pieceSize * queueLength;
		qCvs.height = pieceSize;
		qCtx = qCvs.getContext("2d");
		queueContainer.appendChild(qCvs);
		
		scoreContainer = $("#scorecontainer")[0];

		drawBackground();
		drawBoard();
		drawQueue();
		drawScoreboard();
	}
	
	function redraw () {
		drawBoard();
		drawQueue();
		drawScoreboard();
	}
		
	return {
		init: init,
		redraw: redraw,
		announce: announce
	};
}());