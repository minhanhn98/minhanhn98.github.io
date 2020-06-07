/*jslint browser: true*/
/*global d3*/
/*global console*/
/* eslint-disable no-console */

function drawDefault() {
    
    var margin = {top: 10, right: 60, bottom: 20, left:150},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


    var margin2 = {top: 20, right: 20, bottom: 20, left: 150},
    width2 = 1100 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

    //used to parse time data on "year" only
    var parseTime = d3.timeParse("%Y");
    var xValue = function(d) { return d.year;}
    var xScale = d3.scaleTime().range([0, width-80]);
    var xMap = function(d) { return xScale(xValue(d));};

    var yValue = function(d) { return d.category;};
    //var yScale = d3.scalePoint().range([height, 0]).padding(1);

    var yScale = d3.scaleLinear().range([height, 0]);

    //var yMap = function(d) { return yScale(yValue(d))+d3.randomUniform(15, 45)();};
    var yMap = function(d) { return yScale(yValue(d));};


    var color = d3.scaleOrdinal().domain(["All","North America","South America", "Europe","Africa","Asia","Australia" ]).range(["#9b989a","#beaed4","#fb9a99","#a6d854","#80b1d3","#ffd92f","#ff9933"]);

    var circles;

    //#fbb4ae    
    var xAxis = d3.axisBottom().scale(xScale).ticks(13).tickSize(0,9,0);
    var yAxis = d3.axisLeft().scale(yScale).ticks(11).tickSize(0,9,0).tickFormat( function(d) { return mapfunc(d);});

    //.tickFormat(function(d) { return mapping[d.category2]; });
    var svg = d3.select('body')
        .append('svg')
        .attr("id", 'default')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    //For draw cell
    //    var svg2 = d3.select('body')
    //        .append('svg')
    //        .attr("id", 'cell')
    //        .attr('width', width2 + margin2.left + margin2.right)
    //        .attr('height', height2 + margin2.top + margin2.bottom);
    var svg2 = d3.select('body')
        .append('svg')
        .attr("id", 'cell')
        .attr('width', width2 + margin2.left + margin2.right)
        .attr('height', height2 + margin2.bottom + margin2.top);


    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    function rowConverter(d) {
        return {
            year2: +d.year,
            year: parseTime(d.yearMap),
            cat: d.cat,
            name: d.name,
            category: d.catMap,
            country: d.country,
            award: d.award,
            Rationale: d.Rationale,
            continent: d.continent
        }
    }

    d3.csv('full.csv',rowConverter).then(function(data){
//        data.forEach(function(d){
//                d.year2 = +d.year;
//                d.year = parseTime(d.yearMap); 
//                d.cat = d.cat;
//                d.name=d.name;
//                d.category = d.catMap;
//                d.country=d.country;
//                d.award = d.award;
//                d.Rationale = d.Rationale;
//                d.continent = d.continent;
//        });
        console.log("data", data);

        var asia = [];
        var namerica = ["All"];
        var samerica = ["All"];
        var africa = ["All"];
        var europe = ["All"];
        var australia = ["All"];

        // organizing countries by their continent
        for (var i = 0; i < data.length; i++) {
            if (data[i].continent == "Asia" && !asia.includes(data[i].country))
            {
                asia.push(data[i].country);
            }
            if (data[i].continent == "Africa" && !africa.includes(data[i].country))
            {
                africa.push(data[i].country);
            }
            if (data[i].continent == "Australia" && !australia.includes(data[i].country))
            {
                australia.push(data[i].country);
            }
            if (data[i].continent == "Europe" && !europe.includes(data[i].country))
            {
                europe.push(data[i].country);
            }
            if (data[i].continent == "North America" && !namerica.includes(data[i].country))
            {
                namerica.push(data[i].country);
            }
            if (data[i].continent == "South America" && !samerica.includes(data[i].country))
            {
                samerica.push(data[i].country);
            }
        }
        console.log("asia", asia);
        console.log("africa", africa);
        console.log("australia", australia);
        console.log("europe", europe);
        console.log("namerica", namerica);
        console.log("samerica", samerica);

        xScale.domain([d3.min(data, function(d){return d.year;}),
            d3.max(data,function(d){return d.year;})]).nice();

        yScale.domain([d3.min(data, function(d) { return d.category;})-1, d3.max(data, function(d) { return d.category;})]).nice();

    //		yScale.domain(d3.extent(data, function(d){
    //			return d.category2;
    //		})).nice();
            //yScale.domain(data.map(function(d) { return d.category; }));




        var x = svg.append('g')
            .attr('transform', 'translate(0,' +height  + ')')
            .attr('class', 'x axis')
            .call(xAxis);

        var zoom = d3.zoom().on("zoom",zoomed);

        // y-axis is translated to (0,0)
        var y = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .attr("y", 26)
            .attr("x",-5)
            .attr("cx", -1000)
            .attr("cy", -1000)
            .attr("dy", ".85em")
            .attr("font-weight","bold");
            //.attr("transform", "rotate(60)")


        // Draw the x gridlines
        var xgrid = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height+ ")")
            .call(make_x_gridlines(xScale, 13).tickSize(-height).tickFormat(""))



        // Draw the y gridlines
        var ygrid = svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines(yScale, 11)
                .tickSize(-width+80)
                .tickFormat("")
            )     


        circles=svg.selectAll(".dot")
            .data(data)
        .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return color(d.continent);})
            .on("mouseover", function(d) {
                d3.select(this)
                    tooltip.transition()
                        .duration(200)
                        .attr('r',10)
                        .style("opacity", .9);
                    tooltip.html(d.name+"<br/>"+"Year: "+ d.year2+"<br/>"+"Country: "+d.country+"<br/>"+"Award: "+d.award+" - "+d.cat+"<br/>"+"________________"+"<br/>"+d.Rationale) 
                        .style("left", (d3.event.pageX -4) + "px")
                        .style("top", (d3.event.pageY+2 ) + "px");
          })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    //TODO: the zoom not looks good  
    //    svg.call(d3.zoom()
    //            .scaleExtent([1/2, 32])
    //            .on("zoom", zoomed));
    //    

        // drop down menu
        // referenced: https://www.d3-graph-gallery.com/graph/connectedscatter_select.html
        var dropdownArray = ["namerica", "samerica", "europe", "africa", "asia", "australia"];
        
        namerica = namerica.sort();
        namerica.splice(1, 0, "None");
        d3.select("#namerica")
            .selectAll('myOptions')
                .data(namerica)
            .enter()
                .append('option')
            .text(function (d) { return d; }); // text showed in the menu
                
        samerica = samerica.sort();
        samerica.splice(1, 0, "None");
        d3.select("#samerica")
            .selectAll('myOptions')
                .data(samerica)
            .enter()
                .append('option')
            .text(function (d) { return d; }); // text showed in the menu
    
        // drop down menu
        europe = europe.sort();
        europe.splice(1, 0, "None");
        d3.select("#europe")
            .selectAll('myOptions')
                .data(europe)
            .enter()
                .append('option')
            .text(function (d) { return d; }); // text showed in the menu
    
        // drop down menu
        africa = africa.sort();
        africa.splice(1, 0, "None");
        d3.select("#africa")
            .selectAll('myOptions')
                .data(africa)
            .enter()
                .append('option')
            .text(function (d) { return d; }); // text showed in the menu
    
        // drop down menu
        asia = asia.sort();
        asia.splice(0, 0, "All");
        asia.splice(1, 0, "None");
        d3.select("#asia")
            .selectAll('myOptions')
                .data(asia)
            .enter()
                .append('option')
            .text(function (d) { return d; }); // text showed in the menu
    
        // drop down menu
        australia = australia.sort();
        australia.splice(1, 0, "None");
        d3.select("#australia")
            .selectAll('myOptions')
                .data(australia)
            .enter()
                .append('option')
            .text(function (d) { return d; }); // text showed in the menu
        
        d3.selectAll(".dropdown").on("change", function() {
            // color.domain()[ind] is the continent the country belongs to
            // connecting the dropdown with the legend
            var ind = dropdownArray.indexOf(d3.select(this).attr("id")) + 1;
            update(d3.select(this), data, color.domain()[ind], color.domain());
        });
        
        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
                .attr("class", "legend")
                .attr("id", function(d, i){
                    return color.domain()[i];}) // assign ID to each legend
                .attr("transform", function(d, i) { return "translate(0," + i * 27 + ")"; });
        
        legend.append("select");
        
        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 50)
            .attr("rx",5)
            .attr("ry",5)
            .attr("width", 110)
            .attr("height", 25)
            .style("fill", color)
            .attr("id", function(d){
                return "rect"+d.replace(" ","");});
        
        //  Adding click event
        legend.on("click", function(type) {


         //dim all of the legends
        //d3.selectAll(".legend")
          //  .style("opacity", 0.1);
        // make the one selected be un-dimmed
        //d3.select(this)
          //  .style("opacity", 1);

            //Show if 'All' selected
            if (d3.select(this).attr('id') == 'All') {
                // turns on all buttons and dots
                if (d3.select(this).select("rect").style("opacity") == 0.4) {
                    d3.selectAll(".dot")
                        .style("opacity", 1);
                    d3.selectAll("rect")
                        .style("opacity", 1); 
                    // ________________________________________________________________________________________________________
                    d3.selectAll(".dropdown").property("value", "All");
                }
                // grays out all buttons and dots
                else {
                    d3.selectAll(".dot")
                        .style("opacity", 0.1);
                    d3.selectAll("rect")
                        .style("opacity", 0.4);
                    d3.selectAll(".dropdown").property("value", "None");
                }
            } else {
                // ___________________________________________________________________________________________________________
                // if continent button clicked, change dropdown menu of that button to All
                var indx = color.domain().indexOf(d3.select(this).attr('id'));
                var dropdown = "#"+dropdownArray[indx-1];
                console.log("in legend, dropdown id: ", dropdown);
                
                // grays out the "All" button
                d3.select("#rectAll").style("opacity", 0.4);
                // highlights/colors button and dots belonging to continent
                if (d3.select(this).select("rect").style("opacity") == 0.4) {
                    d3.selectAll(".dot")
                        .filter(function(d){
                            return d["continent"] == type
                        })
                        //Make this line seen
                        .style("opacity", 1);
                    d3.select(this).select("rect").style("opacity", 1);
                    d3.select(dropdown).property("value", "All");
                }
                // grays out buttons and dots belonging to the continent
                else {
                    d3.selectAll(".dot")
                        .filter(function(d){
                            return d["continent"] == type
                        })
                        //Make this line grayed
                        .style("opacity", 0.1);
                    d3.select(this).select("rect").style("opacity", 0.4);
                    d3.select(dropdown).property("value", "None");
                }
                countingIters();
                console.log(d3.select(this).attr('id'));

            // PREVIOUS CODE
    //          //Select all dot and hide
    //          d3.selectAll(".dot")
    //          .style("opacity", 0.1)
    //          .filter(function(d){
    //            return d["continent"] == type
    //          })
    //            //Make this line seen
    //           .style("opacity", 1);
    //            
    //          d3.selectAll("rect")
    //          .style("opacity", 0.1);
    //          d3.select(this).select("rect").style("opacity", 1);
    //          console.log("clicked id", d3.select(this).attr('id'));
    //          console.log("id rect", d3.select(this).select("rect").attr('id'));
    //            
    //          if (d3.select(this).select("rect").style("opacity") == 1)
    //              {
    //                  console.log("rectangle opacity is 1");
    //              }
            }  
        })

      // draw legend text
        legend.append("text")
            .attr("x", width+3)
            .attr("y", 7)
            .attr("dy", "0.65em")
            .style("text-anchor", "middle")
            .style("font-size","14px")
            .style("font-family","sans-serif")
            .text(function(d) { return d;})


        //Clickabl legend ref: http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774  
        var categoryMap = ["Art", "Literature", "Medicine", "Chemistry", "Physics", "Math",  "Computer", "Peace & Leadership", "Pioneers"];

        svg.on("click", function() {
            //Get click coordinate
            var coords = d3.mouse(this);
            //Convert pixel to data
            var posX = xScale.invert(coords[0]),
                posY = Math.floor(yScale.invert(coords[1]));
            var category = categoryMap[posY],
                date = new Date(posX),
                year = date.getFullYear();

            //Find decade boundary given year
            var decadeLower = year - year%10,
                decadeUpper = decadeLower + 10;

            //Get relevant data
            var cellData = data.filter(function(d) {
                return d["cat"] === category && d["year2"] < decadeUpper && d["year2"] >= decadeLower
            });
            clearCell();
            drawCell(margin2, color, decadeLower, decadeUpper, cellData);
        });

    function zoomed() {
    //Create new scale based on event
        var new_xScale = d3.event.transform.rescaleX(xScale)
        var new_yScale = d3.event.transform.rescaleX(yScale)


        //Update axes
        x.call(xAxis.scale(new_xScale));
        xgrid.call(make_x_gridlines(new_xScale, 13).tickFormat(""));
        ygrid.call(make_y_gridlines(new_yScale, 11).tickFormat(""));

        //Update scatter plot and associated text
        svg.selectAll(".dot")
            .attr("transform", d3.event.transform);
        svg.selectAll(".text")
            .attr("transform", d3.event.transform);
        svg.selectAll(".grid")
            .attr("transform",
            d3.event.transform);
        }     
    });  

}


// Gridlines in x axis funcitons
function make_x_gridlines(xScale, ticks) {  
    return d3.axisBottom(xScale)
    .ticks(ticks)
         
}


// Gridlines in y axis function
function make_y_gridlines(yScale, ticks) {     
    return d3.axisLeft(yScale)
        .ticks(ticks)
}

function mapfunc(d){
    
    if(d==1){return "Art";}
    if(d==2){return "Literature";}
    if(d==3){return "Medicine";}
    if(d==4){return "Chemistry";}
    if(d==5){return "Physics";}
    if(d==6){return "Math";}
    if(d==7){return "Computer";}
    if(d==8){return "Peace & Leadership";}
    if(d==9){return "Pioneers";}
    if(d==10){return "Peace";}
 
}

// updates the dots based on the dropdown menu
function update(obj, dataInput, continent, rectData) {
    console.log("clicked", obj.property("value"));
    console.log("dropdown", obj.attr("id"));
    console.log("continent", continent);
    
    // get the rectangle with the id equal to the continent _________________________________________________________________
    var rectCont = d3.select("#rect"+continent.replace(" ",""));
    console.log("button continent id: ", rectCont.attr("id"));
    console.log("rect style opacity: ", rectCont.style("opacity"));
    
    
    if (obj.property("value") == "All") {
        d3.selectAll(".dot")
        .data(dataInput)
        .filter(function(d){
            return d["continent"] == continent
        })
        //Make this line seen
        .style("opacity", 1);
        rectCont.style("opacity", 1);
    }
    else {
        // greys out all button
        d3.select("#rectAll").style("opacity", 0.4);
        // greys out continent data
        d3.selectAll(".dot")
        .data(dataInput)
        .filter(function(d){
            return d["continent"] == continent
        })
        .style("opacity", 0.1);
        rectCont.style("opacity", 0.4);
        
        // colors country data
        if (obj.property("value") != "None")  {
            d3.selectAll(".dot")
                .data(dataInput)
                .filter(function(d){
                    return d["country"] == obj.property("value")
                })
                .style("opacity", 1);
            rectCont.style("opacity", 1);
        }
    }
    // if all drop down values are "ALL" turn on all button
    countingIters()
}

function countingIters() {
    // if all drop down values are "ALL" turn on all button
    var iter = 0;
    var menus = document.getElementsByClassName("dropdown");
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].value == "All") {
            iter++;
        }
        // because australia only has one country associated with it
        if (menus[i].value == "Australia") {
            iter++;
        }
        console.log(menus[i].value);
    }
    console.log("iter", iter);
    if (iter >= 6) {d3.select("#rectAll").style("opacity", 1);}
    else {d3.select("#rectAll").style("opacity", 0.4);}
}