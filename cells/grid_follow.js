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

/**
* 
*/
function createGrid(rows, columns){
	//Loop through the 
	for (var i = 0; i < rows; i++){
		
		// Add a new row represented as an array
		grid.push([]);
		for (var j = 0; j < columns; j++){
			grid[i].push(createCell(i,j));
			
			if (i != 0){
				grid[i][j].neighbor.north = grid[i-1][j];
				grid[i-1][j].neighbor.south = grid[i][j];
			}
			if (j != 0){
				grid[i][j].neighbor.west = grid[i][j-1];
				grid[i][j-1].neighbor.east = grid[i][j];
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
			
		}
	}
}

function checkMouseOver(cell){
		if ((canvas.offsetLeft + (cell.row * cell.len)) < mouse.x && 
			mouse.x < (canvas.offsetLeft + ((cell.row+1) * cell.len))){
				
				if ((canvas.offsetTop + (cell.column * cell.len)) < mouse.y && mouse.y < (canvas.offsetTop + ((cell.column+1) * cell.len))) {
					cell.color = "#42f4a1";
					return true;
				}
		}
		cell.color = "#ffffff";
		return false;
	
}

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

createGrid(80,80);
setInterval(drawGrid, 2);