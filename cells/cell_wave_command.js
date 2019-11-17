document.body.style.backgroundColor = "black";


document.addEventListener("keydown", function(){
	if (event.key == " "){
		falling = true;
	}else{
		clear();
	}
});

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var stage = new createjs.Stage(canvas);
var grid = [];
var fillCommands = [];
var strokeCommands = [];
var cellSize = 20;
var perRow = canvas.width/cellSize;
var mouse = {x:null, y:null, changed:true};
var changeColor = "#42f4a1";
var output;

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
		fillCommands.push(rect.graphics.beginFill(color).command);
		strokeCommands.push(rect.graphics.beginStroke(0).);
		rect.graphics.drawRect(0,0,0+cellSize, 0+cellSize);
		rect.x = (cell % perRow)*cellSize;
		rect.y = Math.floor(cell / perRow)*cellSize;
		grid.push(color);
		stage.addChild(rect);
		rect.on("mouseover", handleMouseOver);
		rect.on("mouseout", handleMouseOver);
	}
	stage.update();
}

function drawGrid() {
	//check for a dirty flag, if w is at the front then it needs to be redrawn, else we don't need to
	for (var cell = 0; cell < grid.length; cell++){
		// if (grid[cell] != "#ffff00") {
			// var rect = new createjs.Shape();
			// if (cell == 9)
			fillCommands[cell].style = grid[cell];
			// strokeCommands[cell].style = grid[cell][0] == "s" ? 6 : 0;
			// rect.graphics.beginFill("#00ff00").beginStroke(grid[cell][0] == "s" ? 6 : 0).drawRect(0,0,0+cellSize, 0+cellSize);
			// rect.graphics.beginFill("#00ff00").beginStroke(grid[cell][0] == "s" ? 6 : 0).drawRect(0,0,0+cellSize, 0+cellSize);
			// else
			// 	rect.graphics.beginFill("#ffffff").beginStroke(0).drawRect(-50,-50,-50+cellSize, -50+cellSize);
			// rect.x = (cell % perRow)*cellSize;
			// rect.y = Math.floor(cell / perRow)*cellSize;
			// rect.x = canvas.width/2;
			// rect.y = canvas.height/2;
			// rect.cache(rect.x,rect.y, rect.x+cellSize, rect.y+cellSize);
			// stage2.addChild(rect);
			// stage.addChild(rect);
			// rect.on("mouseover", handleMouseOver);
			// rect.on("mouseout", handleMouseOver);
		// }
	}
	/*
		click
		then grab neighors change the fours color
		then at next step check the neighbors, set a checked stat?
		these neighbors need their color changed, this is wave 1

		if another wave is started then a cell could be in multiple waves told that it will need to change colors
		there could be up to many waves at once though
		how to check them all?
	*/
	stage.update();
}

function handleMouseOver(evt) {
	var cell = determineCell(evt);
	//set dirty flag
	if (evt.type == "mouseover") {
		if (grid.length > cell) {
			grid[cell] = "#00ff00";
			grid[cell] = "s"+grid[cell];
		}
		document.getElementById("debug").innerHTML = "X: "+evt.stageX+", Y:"+evt.stageY+", cell: "+cell;
		// console.log("www");
	}
	// console.log("Target: "+evt.target);
	// remove dirty flag
	if (evt.type == "mouseout") {
		// if (grid.length > cell)
			// grid[cell] = "#00ff00";
		// console.log("Target: "+determineCell());
	}
}

function determineCell(evt) {
	return Math.floor(evt.stageX/cellSize) + Math.floor((evt.stageY/cellSize))*perRow;
}

function decay(cell){
	// find the diff between the current value and pure white
	// then adjust the value by a bit, or adjust it by a constant, like 20% until it is white

	if (cell.color != "#ffffff"){
		var temp = convertHexToDecimal(cell.color.slice(1, cell.color.length));
		var white = convertHexToDecimal("ffffff");
		temp += Math.floor(white *.1);
		//console.log(convertDecimalToHex(temp));
		cell.color = "#"+convertDecimalToHex(temp < white ? temp : white);
		//console.log(cell.color);
	}


}

function convertHexToDecimal(value){
	var total = 0;
	var base = 16;

	for (var i = value.length-1; i >= 0; i--){
		switch(value[i]){
			case "a":
				total += (10 * Math.pow(base, i));
				break;
			case "b":
				total += (11 * Math.pow(base, i));
				break;
			case "c":
				total += (12 * Math.pow(base, i));
				break;
			case "d":
				total += (13 * Math.pow(base, i));
				break;
			case "e":
				total += (14 * Math.pow(base, i));
				break;
			case "f":
				total += (15 * Math.pow(base, i));
				break;
			default:
				total += (value[i] * Math.pow(base, i)); //Conversion equation lifted from here: https://www.rapidtables.com/convert/number/hex-to-decimal.html
				break;
		}
	}

	return total;
}

function convertDecimalToHex(value){
	var total = "";
	var quotient = value;
	//total += value % 16;
	while(quotient > 0){
		var remainder = quotient % 16;
		quotient = Math.floor(quotient/16);
		switch(remainder){
			case 10:
				total = "a"+ total;
				break;
			case 11:
				total = "b"+ total;
				break;
			case 12:
				total = "c" + total;
				break;
			case 13:
				total = "d" + total;
				break;
			case 14:
				total = "e" + total;
				break;
			case 15:
				total = "f" + total;
				break;
			default:
				total = remainder + total;
		}
	}
	// console.log(total);
	return total;
}

createGrid(40,30);
setInterval(drawGrid, 1);
