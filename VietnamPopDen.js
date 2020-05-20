/*jslint browser: true*/
/*global d3*/
/*global topojson*/
/*global console*/
/* eslint-disable no-console */

// data from: https://www.citypopulation.de/en/vietnam/cities/
// referenced: https://bl.ocks.org/mbostock/5562380

// Define Margin
var margin = {left: 80, right: 100, top: 50, bottom: 50 }, 
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Creating the Canvas for SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var path = d3.geoPath(d3.geoMercator()
                        .scale([1700])
                        .translate([-2900,height+300]));

var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);

// legend
var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g.selectAll("rect")
    .data(color.range().map(function(d) {
        d = color.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
    }))
    .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Population per square kilometer");

g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickValues(color.domain()))
    .select(".domain")
        .remove();

// converts data so that it's easier to use
function rowConverter(data) {
    return {
        region : data.Name,
        area : data.Area,
        pop : data["2019"],
        popden : parseFloat(data["2019"].replace(/,/g, '')) / parseFloat(data.Area.replace(/,/g, ''))
    }
}

//d3.json("geoVN.json").then(function(geo) {
//    console.log("geo", geo);
//});

d3.csv("VNdata.csv",rowConverter).then(function(data) {
    
    console.log("data", data);

//    http://techslides.com/demos/d3/d3-geo-renderer.html
    d3.json("topoVN.json").then(function(topo) {

        console.log("topology", topo);
        var regions = topojson.feature(topo, topo.objects.gadm36_VNM_1).features;
        console.log("regions", regions);
        console.log(topojson.feature(topo, topo.objects.gadm36_VNM_1));
        
        var mappd = svg.append("g")
            .attr("x", width/2)
            .attr("y", height/2)
            .selectAll("path")
            .data(topojson.feature(topo, topo.objects.gadm36_VNM_1).features)
//            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .enter().append("path")
//                .attr("fill", function(d) { console.log(d); return color(d.properties.density); })
                .attr("d", path);
        
//        mappd.attr("fill", color(1000));
        mappd
            .data(data)
            .attr("fill", function(d) { console.log(d); return color(d.popden); })

//        svg.append("path")
//            .data(topojson.feature(topo, topo.objects.gadm36_VNM_1).features)
//            .attr("fill", "none")
//            .attr("stroke", "#000")
//            .attr("stroke-opacity", 0.3)
//            .attr("d", path);

    });//.catch(function(error){console.log(error)});
});
