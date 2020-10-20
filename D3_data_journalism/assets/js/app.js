// Set up our chart
// Reference: https://www.d3-graph-gallery.com/graph/scatter_basic.html
//= ================================
// set the dimensions and margins of the graph
var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 50, left: 70},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
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
    const bubble = svg.append('g')
      .selectAll("dot")
      .data(riskData)
      .enter()
      .append("circle")
        .attr("cx", d => x(d.poverty))
        .attr("cy", d => y(d.healthcare))
        .attr("r", 15)
        .attr("opacity", 0.5)
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

    // home postions for dots
    riskData.forEach(data => {
      data.x0 = x(data.poverty)  //home x-position
      data.y0 = y(data.healthcare)  //home y-position
    });

    // Adding labels to dots
    // resource: https://observablehq.com/@abebrath/scatterplot-of-text-labels
    //Create the state  text elements
    const label = svg.append("g")
        .attr("font-family", "Yanone Kaffeesatz")
        .attr("font-weight", 600)
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(riskData)
      .join("text")
        .attr("id", "abbr")
        .attr("opacity", .75)
        .attr("dy", "0.10em")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .text(d => d.abbr);

    // simulate 'collision' of state text labels and dots
    const simulation = d3.forceSimulation(riskData)
                         .force("collide", d3.forceCollide(d => d.radius * 0.5))
                         .force("x", d3.forceX(d => d.x0))
                         .force("y", d3.forceY(d => d.y0));
  
    simulation.on("tick", () => {
      label.attr("x", d => d.x)
           .attr("y", d => d.y);
    });

    // invalidation.then(() => simulation.stop());
    // End of text labels for dots

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

