// Set up our chart
// Reference: https://www.d3-graph-gallery.com/graph/scatter_basic.html
//= ================================
// set the dimensions and margins of the graph
var margin = {top: 20, right: 40, bottom: 50, left: 70},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./assets/data/data.csv").then(riskData => {
    console.log(riskData);

    // parse data
    riskData.forEach(data => {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Add X axis
    var x = d3.scaleLinear()
      .domain([d3.min(riskData, d => d.poverty)* 0.8, d3.max(riskData, d => d.poverty)* 1.1])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(riskData, d => d.healthcare)* 1.1])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(riskData)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.poverty); } )
        .attr("cy", function (d) { return y(d.healthcare); } )
        .attr("r", 7)
        .attr("opacity", 0.5)
        .attr("stroke", "black")
        .style("fill", "#69b3a2")


    // Create group for x-axis label
    var labelsGroup = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .classed("active", true)
      .text("In Poverty (%)");

    // append y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Lacks Healthcare (%)");


}).catch(error => console.log(error));