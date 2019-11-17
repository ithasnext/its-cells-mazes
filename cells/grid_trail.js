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
var changeColor = "rgb(0,255,0)";

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
		changed: true,
		color:"rgb(255,255,255)",
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
			if (grid[i][j].changed){
				decay(grid[i][j]);
				ctx.fillStyle = grid[i][j].color;
				ctx.fillRect(grid[i][j].len*i, grid[i][j].len*j, grid[i][j].len, grid[i][j].len);
				
				if (grid[i][j].color == "rgb(255,255,255)"){
					//grid[i][j].changed = false;
					
				}else{
					ctx.strokeStyle = "rgb(0,0,0)";
					ctx.strokeRect(grid[i][j].len*i, grid[i][j].len*j, grid[i][j].len, grid[i][j].len);
				}
			}			
		}
	}
}

function checkMouseOver(cell){
		if ((canvas.offsetLeft + (cell.row * cell.len)) < mouse.x && 
			mouse.x < (canvas.offsetLeft + ((cell.row+1) * cell.len))){
				
				if ((canvas.offsetTop + (cell.column * cell.len)) < mouse.y && mouse.y < (canvas.offsetTop + ((cell.column+1) * cell.len))) {
					cell.color = changeColor;
					cell.changed = true;
					if (cell.neighbor.north){
						cell.neighbor.north.color = changeColor;
						decay(cell.neighbor.north, 15);
						cell.neighbor.north.changed = true;
						
						
						if (cell.neighbor.north.neighbor.north){
							cell.neighbor.north.neighbor.north.color = changeColor;
							decay(cell.neighbor.north.neighbor.north, 25);
							cell.neighbor.north.neighbor.north.changed = true;
						}
						
						if (cell.neighbor.north.neighbor.east){
							cell.neighbor.north.neighbor.east.color = changeColor;
							decay(cell.neighbor.north.neighbor.east, 25);
							cell.neighbor.north.neighbor.east.changed = true;
						}
						if (cell.neighbor.north.neighbor.west){
							cell.neighbor.north.neighbor.west.color = changeColor;
							decay(cell.neighbor.north.neighbor.west, 35);
							cell.neighbor.north.neighbor.west.changed = true;
						}
					} 
					if (cell.neighbor.south){
						cell.neighbor.south.color = changeColor;
						decay(cell.neighbor.south, 15);
						cell.neighbor.south.changed = true;
						
						
						if (cell.neighbor.south.neighbor.south){
							cell.neighbor.south.neighbor.south.color = changeColor;
							decay(cell.neighbor.south.neighbor.south, 25);
							cell.neighbor.south.neighbor.south.changed = true;
						}
						
						if (cell.neighbor.south.neighbor.east){
							cell.neighbor.south.neighbor.east.color = changeColor;
							decay(cell.neighbor.south.neighbor.east, 23);
							cell.neighbor.south.neighbor.east.changed = true;
						}
						if (cell.neighbor.south.neighbor.west){
							cell.neighbor.south.neighbor.west.color = changeColor;
							decay(cell.neighbor.south.neighbor.west, 35);
							cell.neighbor.south.neighbor.west.changed = true;
						}
					}
					if (cell.neighbor.east){
						cell.neighbor.east.color = changeColor;
						decay(cell.neighbor.east, 15);
						cell.neighbor.east.changed = true;
						
						if (cell.neighbor.east.neighbor.east){
							cell.neighbor.east.neighbor.east.color = changeColor;
							decay(cell.neighbor.east.neighbor.east, 25);
							cell.neighbor.east.neighbor.east.changed = true;
						}
					}
					if (cell.neighbor.west){
						cell.neighbor.west.color = changeColor;
						decay(cell.neighbor.west, 15);
						cell.neighbor.west.changed = true;
						
												
						if (cell.neighbor.west.neighbor.west){
							cell.neighbor.west.neighbor.west.color = changeColor;
							decay(cell.neighbor.west.neighbor.west, 25);
							cell.neighbor.west.neighbor.west.changed = true;
						}
					}
					if (cell.color == "rgb(255,255,255)") cell.changed = false;
					return true;
				}
		}
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
					grid[i][j].color = changeColor;
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

function decay(cell, amount=15){
	// find the diff between the current value and pure white
	// then adjust the value by a bit, or adjust it by a constant, like 20% until it is white
	if (cell.color != "rgb(255,255,255)"){		
		var temp = cell.color.split(","); //returns an array depending on the number of commas. ex. temp = [rgb(0, 255, 0)]
		temp = temp[0].split("(")[1]; // Take the first element of temp and split it on (, but only save the second element returned 
		temp = parseInt(temp) + amount;
		temp = temp < 255 ? temp : 255;
		cell.color = "rgb("+temp+",255,"+temp+")";
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

createGrid(80,80);
setInterval(drawGrid, 10);