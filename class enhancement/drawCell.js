//Render cellData and draw sub svg
function drawCell(margin2, color, yearLower, yearUpper, data) {
    console.log("cellData", data);
       
   var height = d3.select("#cell").attr("height"),
       width = d3.select("#cell").attr("width");
    
    var svg = d3.select("#cell").append('g')
        .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

    
     var xScale = 
        d3.scaleLinear().range([0, width])
        .domain([yearLower-1, yearUpper+1]).nice();
    

    //Set axis without ticks
    var xAxis = d3.axisBottom()
    .tickFormat(d3.format("d"))
    .ticks(10)
    .scale(xScale).tickSize([]);
        

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    
     var nodes = data.map(function(d) {
        return {
          name: d.name,
          country: d.country,
          continent: d.continent,
          rationale: d.Rationale,
          year: d.year2,
          category: d.cat,
          award: d.award,
          //fixed x
          fx: xScale(d.year2),
        };
    });
    
    
    svg.append("g")
        .attr('transform', 'translate(0,' + (height - 3.5 * margin2.bottom) + ')')
        .attr('class', 'x axis')
        .call(xAxis);
    
    //Force layout simulation 
    var simulation = d3.forceSimulation(nodes)
        .force("x", d3.forceX(function(d) { 
            return xScale(d.year); }).strength(0.005))
        //Tune here to get resonable y
         .force("y", d3.forceY(4000).strength(0.005))
        .force("collide", d3.forceCollide().radius(20))
        .force("manyBody", d3.forceManyBody().strength(-50))
        .stop();
    
    for (var i = 0; i < 10; ++i) 
    simulation.tick();
    
    
    //Append image to circles
    for (var i = 0; i< nodes.length; ++i) {
        svg.append("defs")
        .append("pattern")
        //Need to remove char ' and white space for js to work
        .attr("id", nodes[i].name.toLowerCase().replace(/ /g, "_").replace("'", ""))
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
    }
    

    //Make the image resizable
    svg.selectAll("pattern").append('image')
        .data(nodes)
        .attr("xlink:href", function (d){ return "square_images/" + d.name + ".jpg"; })
        .attr("class", "image")
        .attr("patternContentUnits", "none")
      .attr("width", 1)
      .attr("height", 1);       
  
    var circle = svg.selectAll(".dot")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "dot-image")
        .attr("fill", function(d) {
            return "url(#"+d.name.toLowerCase().replace(/ /g, "_").replace("'", "")+")"
        })
        .attr("cx", function(d) { return d.x} )
        .attr("cy", function(d) { return d.y} )
        .attr("r", 20)
        .on("mouseover", function(d) {
            d3.select(this)
            tooltip.transition()
                .duration(200)
                .attr('r',10)
                .style("opacity", .8);
            tooltip.html(d.name+"<br/>"+"Year: "+ d.year+"<br/>"+"Country: "+d.country+"<br/>"+"Award: "+d.award+" - "+d.category+"<br/>"+"________________"+"<br/>"+d.rationale) 
                .style("left", (d3.event.pageX - 5.5) + "px")
                .style("top", (d3.event.pageY + 1) + "px");
              })
        .on("mouseout", function(d) {
            tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
        });
            
}

