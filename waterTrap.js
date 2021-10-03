
$("#calculateBtn").click(function() {
    // read input array
    var heights = [];
    
    var str = $("#heights").val();
    heights = str.split(",");   

   if(heights.length === 0)  {
       alert("invalid input");
       return;
   }

   alert(trap(heights));
});


/**
 * @param {number[]} heights
 * @return {number}
 */
 var trap = function(heights) {

    let nLevels = Math.max(...heights);  // horizontal levels to check = max given block height
    let levels = new Array();   // array of levels

    const level = {
        "blockCell": 0,
        "waterCell": 0
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

    levels.forEach(level => {
        console.log(level);
    })

    renderElevation(heights);

    return waterCells;
}


var renderElevation = function(levels) {

    var graph = new joint.dia.Graph;
    
    var paper = new joint.dia.Paper({
        el: document.getElementById('myholder'),
        model: graph,
        width: 800,
        height: 600,
        gridSize: 1
    });

    var block = new joint.shapes.standard.Rectangle();
    // a solid block
    //rect.position(100, 30);
    block.resize(50, 50);
    block.attr({ body: { fill: 'lightgrey' }});
    block.addTo(graph);

    // a water block
    var water = new joint.shapes.standard.Rectangle();
    water.resize(50, 50);
    water.translate(400, 0);
    water.attr({body: { fill: 'lightblue'}});
    //rect2.attr('label/text', 'World!');
    water.addTo(graph);

    // draw elevation
    



} 
