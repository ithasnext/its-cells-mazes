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
var grid = [];
var mouse = {x:null, y:null};
var changeColor = "#42f4a1";

/**
*
*/
function createGrid(columns, rows){
	//Loop through the
	for (var gridRows = 0; gridRows < rows; gridRows++){

		// Add a new row represented as an array
		grid.push([]);
		for (var gridCols = 0; gridCols < columns; gridCols++){
			grid[gridRows].push(createCell(gridRows,gridCols));

			if (gridRows != 0){
				grid[gridRows][gridCols].neighbor.west = grid[gridRows-1][gridCols];
				grid[gridRows-1][gridCols].neighbor.east = grid[gridRows][gridCols];
			}
			if (gridCols != 0){
				grid[gridRows][gridCols].neighbor.north = grid[gridRows][gridCols-1];
				grid[gridRows][gridCols-1].neighbor.south = grid[gridRows][gridCols];
			}

		}
	}

	drawGrid();
}

function createCell(row, col, length=10){
	var cell = {
		row:0,
		column:0,
		len: length,
		color:"#ffffff",
		neighbor: {north:null, south:null, east:null, west:null}
	};

	cell.row = row;
	cell.column = col;

	return cell;
}

function drawGrid(){
	//clear grid
	for (var i = 0; i < grid.length; i++){
		for (var j = 0; j < grid[i].length; j++){
			checkMouseOver(grid[i][j]);
			ctx.fillStyle = grid[i][j].color;
			ctx.fillRect(grid[i][j].len*i, grid[i][j].len*j, grid[i][j].len, grid[i][j].len);
			if (grid[i][j].color != "#ffffff") {
				decay(grid[i][j]);
			}

		}
	}
}

function checkMouseOver(cell){
		if ((canvas.offsetLeft + (cell.row * cell.len)) < mouse.x &&
			mouse.x < (canvas.offsetLeft + ((cell.row+1) * cell.len))){

				if ((canvas.offsetTop + (cell.column * cell.len)) < mouse.y && mouse.y < (canvas.offsetTop + ((cell.column+1) * cell.len))) {
					cell.color = changeColor;
					if (cell.neighbor.north) cell.neighbor.north.color = changeColor;//cell.neighbor.north.neighbor.north = changeColor;
					if (cell.neighbor.south) cell.neighbor.south.color = changeColor;//cell.neighbor.south.neighbor.south = changeColor;
					if (cell.neighbor.east) cell.neighbor.east.color = changeColor;//cell.neighbor.east.neighbor.east = changeColor;
					if (cell.neighbor.west) cell.neighbor.west.color = changeColor;//cell.neighbor.west.neighbor.west = changeColor;
					// cell.neighbor.north.neighbor.east = changeColor;//cell.neighbor.north.neighbor.west = changeColor;
					//cell.neighbor.south.neighbor.east = changeColor;//cell.neighbor.south.neighbor.west = changeColor;
					return true;
				}
		}else{}
		//cell.color = "#ffffff";
		return false;

}

//Unused, this was the first function that we used to check if the mouse
// was over a particular grid item
function updateColor(event){
	var mouse =  getMousePos(event);
	var found = false;
	for (var i = 0; i < grid.length; i++){
		if ((canvas.offsetLeft + (i * 10)) < mouse.x &&
			!(i+1 > grid.length) && (mouse.x < (canvas.offsetLeft + ((i+1) * 10)))){

			for (var j = 0; j < grid[i].length; j++){
				if ((canvas.offsetTop + (j * 10)) < mouse.y &&
					!(j+1 > grid[i].length) && mouse.y < (canvas.offsetTop + ((j+1) * 10))) {
					grid[i][j].color = "#42f4a1";
				}
			}
		}
	}
}

//Get the mouse position for the supplied event e
function updateMouse(e){
	if (e){
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}else{
		mouse.x = null;
		mouse.y = null;
	}
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
	console.log(total);
	return total;
}

createGrid(40,30);
setInterval(drawGrid, 100);
