
$("#generateBtn").click(function() {
    // read input array
    var heights = [];
    
    var str = $("#heights").val();
    if(str.length === 0)  {
        alert("invalid input");
        return;
    }
    heights = str.split(",");   

   // go thru data, get number of water cells and render input with result
   trap(heights);
});


/**
 * @param {number[]} heights
 * @return {number}
 */
 var trap = function(heights) {

    let nLevels = Math.max(...heights);  // horizontal levels to check = max given block height
    let levels = new Array();   // array of levels

    const level = {
        "blockCell": 0, // known solid block
        "waterCell": 0  // air or water, initially empty cell
    }

    // create as many arrays as levels
    for(i = 0; i < nLevels; i++)
        levels[i] = [];

    // fill 'level' arrays with 1 if it is a block and 0 if empty cell
    heights.forEach(height => {
        levels.forEach((level, index) => {
            let value = height > index ? 1 : 0;
            let cell = { "blockCell": value, "waterCell": 0};
            level.push(cell);
        })
    });

/*     levels.forEach(level => {
        console.log(level);
    }) */

    let waterCells = 0;  // keep the count of contained water cells

    // here we traverse the levels counting the water cells in between blocks and mark water cells
    levels.forEach((level) => {
        let block = false;
        let emptyCells = 0;
        level.forEach((cell, index) => {
            if(cell.blockCell === 1) {
                if(emptyCells > 0) {
                    waterCells += emptyCells;
                    // mark water cells
                    let start = index - emptyCells;
                    for( i = start; i < index; i++) {
                        level[i].waterCell = 1;
                    }
                    emptyCells = 0;                    
                }
                block = true;
            }
            else if (cell.blockCell === 0) {   // if not necessary but just for clarity
                if(block)
                    emptyCells++;
            }
        })
    });

/*     levels.forEach(level => {
        console.log(level);
    }) */

    // present graph and result
    renderElevation(levels, waterCells);

    return waterCells;
}



/**
 * @param {levels[]} rows of cells
 * @return {number} number of water cells
 */

var renderElevation = function(levels, waterCells) {

    var graph = new joint.dia.Graph;
    let cellSize = 60;
    let graphWidth = 1200;
    let graphHeight = 600;
    
    var paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        model: graph,
        width: graphWidth,
        height: graphHeight,
        gridSize: cellSize,
        interactive: false
    });

    paper.drawGrid({
        thickness: 2,
        color: 'black'    
    });

    // a solid block
    var block = new joint.shapes.standard.Rectangle();
    block.resize(cellSize, cellSize);
    block.attr({ body: { fill: 'grey', strokeWidth: 0 }});

    // a water block
    var water = new joint.shapes.standard.Rectangle();
    water.resize(cellSize, cellSize);
    water.attr({body: { fill: 'lightskyblue', strokeWidth: 0}});

    // draw elevation and falling rain populating cells appropiately

    // go through levels and position blocks
    let xOffset = 0;
    let yOffset = 0;

     levels.forEach((level, levelIndex) => {
        //console.log("level index: " + levelIndex);
        yOffset = graphHeight - cellSize * (levelIndex + 1);
        level.forEach((cell, cellIndex) => {
            let newBlock;
            if(cell.blockCell === 1) {
                // solid block cell
                newBlock = block.clone(); 
                newBlock.translate(xOffset + cellSize * cellIndex + 1, yOffset); 
            }
            else if(cell.waterCell === 1) {
                newBlock = water.clone();
                // watercell drops from outside the paper
                newBlock.position(xOffset + cellSize * cellIndex + 1, -100);
                newBlock.transition('position', { x: xOffset + cellSize * cellIndex + 1, y: yOffset }, {
                    delay: 100,
                    duration: 2000,
                    valueFunction: joint.util.interpolate.object
                });     
            }
            else {
                newBlock = water.clone();
                // watercells drop from outside and disappear
                newBlock.position(xOffset + cellSize * cellIndex + 1, -100);
                newBlock.transition('position', { x: xOffset + cellSize * cellIndex + 1, y: yOffset + levels.length * cellSize }, {
                    delay: 100,
                    duration: 2000,
                    valueFunction: joint.util.interpolate.object
                });     
            }
            newBlock.addTo(graph);
        })
    });

    // output result on upper right corner of paper
    let resultWidth = 300;
    block.position(graphWidth + resultWidth, 0);
    block.resize(resultWidth, 80);
    block.attr(
         { 
            body: {
                fill: 'lightgreen',
                strokeWidth: 0
            },
            label: {
                text: waterCells + " water cell(s)",
                fill: 'black',
                fontSize: 36,
                fontWeight: 'bold'
            }
        });


    block.addTo(graph);
    // display result dragging it from outside the paper
    block.transition('position', {x: graphWidth - resultWidth, y: 0 }, {
        delay: 100,
        duration: 3000,
        valueFunction: joint.util.interpolate.object
    });   
} 
