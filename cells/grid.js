document.body.style.backgroundColor = "black";

//Get the element from the HTML
var canvas = document.getElementById("canvas");
//Required for drawing onto the canvas, the context can be either 2d or 3d, but one must be specified
var ctx = canvas.getContext("2d");

//A handy variable that will hold all of the cells
var grid = [];

/**
* Create a 2D array (array of arrays) and while we're
* creating the grid create a cell and add it to the grid array
*/
function createGrid(rows, columns){
	//Loop for "rows" times and each time add an empty array to the end of the grid array
	for (var i = 0; i < rows; i++){
		grid.push([]);
		
		//On every row loop, loop for "columns" times and each time create a cell object and add the current array
		for (var j = 0; j < columns; j++){
			grid[i].push(createCell(i,j));			
		}
	}
	drawGrid();
}

/**
*	Creates a cell which starts out as a white rectangle.
*	Each cell is an object that knows about:
*						the cell's location (row,column),
*						the cell's length
*						the cell's background color (default is white)
*/
function createCell(row, col, length=10){
	var cell = {
		row:0,
		column:0,
		len: length,
		color:"#ffffff",
	};
	
	cell.row = row;
	cell.column = col;
	
	return cell;
}

/**
*	Loop through the grid array and draw each reactangle
*/
function drawGrid(){
	
	for (var i = 0; i < grid.length; i++){
		for (var j = 0; j < grid[i].length; j++){
			//Set the color to the cell's color
			ctx.fillStyle = grid[i][j].color;
			//Offset each reactangle so that they are drawn in a grid
			ctx.fillRect(10*i, 10*j, grid[i][j].len, grid[i][j].len);
			
		}
	}
}

/**
* Called by the HTML everytime the mouse moves on the Canvas
*/
function updateColor(event){
	var mouse =  getMousePos(event);
	var found = false;
	
	//Loop through the cells  to find which one the mouse is currently over
	//Once found change the brackground of that cell
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
function getMousePos(e){
	return {x: e.clientX, y:e.clientY};
}

//On file load this will create a grid with 80 rows and columns
createGrid(80,80);

//Every 10ms run drawGrid, this allows fairly seamless updating of the screen while the mouse is moving
setInterval(drawGrid, 10);