document.body.style.backgroundColor = "black";


document.addEventListener("keydown", function(){
	if (event.key == " "){
		// falling = true;
		stop();
	}else{
	}
	// clear();
});

var canvas = document.getElementById("canvas");
var stage = new createjs.Stage(canvas);
var grid = [];
var changing = [];
var backward = [];
var cellSize = 20;
var perRow = canvas.width/cellSize;
var output;
var eventXY = [];
var coolDown = [];
var hack = 0;
var waves = [] // array of wave objects, each will have a event, forward, and back attribute.
var noRedraw = false;

/**
*
ervery vell is just a rect with a color, the color is the unique thing
so what we do is make the color be the only thing we track
then when the color needs to be drawn say is [1] == 1 if ye then draw, or we could say is it white?
then draw or wahtever we define the basic color to be

what about lerping through the old mouse to the current mouse nad mkaing all tiles
decay at offset

X X X X 0, 0,1,2,3
X X X X 1, 0,1,2,3
X X X X 2, 0,1,2,3

Y Y Y Y3 Y Y Y6 Y Y Y Y Y

(stage.width/cellSize)

100 / 20 = 5, gets the amount per row

*/
function createGrid(rows, columns){
	stage.enableMouseOver();
	//Loop through the
	for (var cell = 0; cell < rows+columns; cell++){
		var rect = new createjs.Shape();
		var color = "#ffff00";
		rect.graphics.beginFill(color).beginStroke(1).drawRect(0,0,cellSize, cellSize);
		rect.x = (cell % perRow)*cellSize;
		rect.y = Math.floor(cell / perRow)*cellSize;
		rect.name = rect.x+","+rect.y;
		grid.push(color);

		stage.addChild(rect);
		rect.on("mouseover", handleMouseOver);
		rect.on("mouseout", handleMouseOver);
		rect.on("click", clickedCell);
	}
	stage.update();
}

function drawGrid() {

	if (!noRedraw) {
		if (waves.length > 0) {
			redrawPassed();
			changeCell();
		}
		stage.update();
	}
}

// click, get neighbrs and addthem t an array, if they are in the array don't readd.
// for everything in arry, grab neighbors, rotate, turn color.
// repeat until the
function handleMouseOver(evt) {
	var cell = determineCell(evt);
	//set dirty flag
	if (evt.type == "mouseover" && waves.length == 0) {
		stage.swapChildrenAt(stage.getChildIndex(evt.target), stage.numChildren-1);
		evt.target.graphics.clear().beginFill("#00ff00").beginStroke(6).drawRect(0,0,cellSize,cellSize).endFill();
		// evt.target.scaleX = 1.2;
		// evt.target.scaleY = 1.2;
		// evt.target.x += ((cellSize*1.2)-cellSize)/2;
		// evt.target.y += ((cellSize*1.2)-cellSize)/2;
		document.getElementById("debug").innerHTML = "X: "+evt.stageX+", Y:"+evt.stageY+", cell: "+cell;
	}

	// remove dirty flag
	if (evt.type == "mouseout" && waves.length == 0) {
		evt.target.graphics.clear().beginFill("#ffff00").beginStroke(1).drawRect(0,0,cellSize,cellSize).endFill();
		// evt.target.scaleX = 1;
		// evt.target.scaleY = 1;
		// evt.target.x = evt.target.y = 0;
	}
}

function determineCell(evt) {
	return Math.floor(evt.stageX/cellSize) + Math.floor((evt.stageY/cellSize))*perRow;
}

function clickedCell(evt) {

	// evt.target.regX = evt.target.regY = cellSize/2;
	// createjs.Tween.get(target).wait(500).to({alpha:0, visible:false}, 1000).call(handleComplete);
	// createjs.Tween.get(evt.target)
  // .to({ rotation:135 }, 1000, createjs.Ease.getPowInOut(4))
  // .to({ rotation:45 }, 500, createjs.Ease.getPowInOut(2))

	var cell = determineCell(evt);
  var coordinate = evt.target.name.split(",");
	//eventXY = {x:coordinate[0]+cellSize/2, y:coordinate[1]+cellSize/2};
  eventXY.push({x:evt.target.x, y:evt.target.y});
	changing.push([evt.target.name]);
	waves.push({
		"event": {x:evt.target.x, y:evt.target.y},
		"changing": [evt.target.name],
		"backward": []
	});
  //find the center point of the rectnagle, will use this when finding manhattan distance
  document.getElementById("clicker").innerHTML = "X: "+waves[waves.length-1].event.x+", Y: "+waves[waves.length-1].event.y;
}

 /*
 *
 * For every cell, check:
 *	1) if neighbors are in bounds
 *  2) then find man distance
 * 	3) then compare man distance to ensure moving away from center
 * 	4) store the current cell in the backward array
 */

function changeCell() {
	var forward = [];

  for (var i = waves.length-1; i >= 0; i--) {
		forward = []
		for (var j = 0; j < waves[i].changing.length; j++) {
	  	var cell = stage.getChildByName(waves[i].changing[j]);
			var currentXY = waves[i].event;
	    var manDistance = Math.abs(currentXY.x - cell.x) + Math.abs(currentXY.y - cell.y);

			var northNeigh = inBounds(cell.x, cell.y - cellSize) ? Math.abs(currentXY.x - cell.x) + Math.abs(currentXY.y - cell.y + cellSize): 0;
			var southNeigh = inBounds(cell.x, cell.y + cellSize) ?  Math.abs(currentXY.x - cell.x) + Math.abs(currentXY.y - cell.y - cellSize) : 0;
			var eastNeigh = inBounds(cell.x + cellSize, cell.y) ? Math.abs(currentXY.x - cell.x - cellSize) + Math.abs(currentXY.y - cell.y) : 0;
			var westNeigh = inBounds(cell.x - cellSize, cell.y) ? Math.abs(currentXY.x - cell.x	+ cellSize) + Math.abs(currentXY.y - cell.y) : 0;


	    if (manDistance < northNeigh && !forward.includes(cell.x+","+ (cell.y-cellSize))) {
	    	forward.push(cell.x+","+ (cell.y-cellSize));
	    }
	    if (manDistance < southNeigh && !forward.includes(cell.x+","+(cell.y+cellSize))) {
	    	forward.push(cell.x+","+ (cell.y+cellSize));
	    }
	    if (manDistance < eastNeigh && !forward.includes((cell.x+cellSize)+","+ cell.y)) {
	    	forward.push((cell.x+cellSize)+","+ cell.y);
	    }
	    if (manDistance < westNeigh && !forward.includes((cell.x-cellSize)+","+ cell.y)) {
	    	forward.push((cell.x-cellSize)+","+ cell.y);
	    }
			if (!waves[i].backward.includes((cell.x-cellSize)+","+ cell.y)) {
				waves[i].backward.push(cell.x+","+ cell.y);
			}
	    cell.graphics.clear().beginFill("#0000ff").beginStroke(0).drawRect(0,0,cellSize,cellSize).endFill();
	  }
		if (forward.length > 0) {
			waves[i].changing = forward;
		}
		else {
			waves[i].changing = [];
		}

		// console.log("changeLength: "+" "+i+", "+changing[i].length);
		// changing[i] = forward;
		//wave[i].chaning = forward
	}
}

function redrawPassed() {
	for (var i = waves.length-1; i >= 0; i--) {
		waves[i].backward.forEach(function (pastCell) {
			var cell = stage.getChildByName(pastCell);
			cell.graphics.clear().beginFill("#ffff00").beginStroke(1).drawRect(0,0,cellSize,cellSize).endFill();
		});
		if (waves[i].changing.length > 0) {
			waves[i].backward = [];
		}
		else {
			waves.splice(i, 1);
		}
	}

}

function inBounds(x, y) {
	return x >= 0 && x < canvas.width && y >= 0 && y < canvas.height;
}


// find the cell coordinates that was clicked, once found set a global var
// find the neioghbors of this shape and save them
// one each subsequent draw change the color every cewll in the neihgbor array then find all neighbors
// on every subsequent draw

function stop() {
	console.log("waves: "+waves);
	console.log("backward: "+backward);
	waves = [];
	noRedraw = !noRedraw;
}

createGrid(canvas.width,canvas.height);
setInterval(drawGrid, 50);
