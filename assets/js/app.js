var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// Helper maps to return the correct tool tip lables and axis labels
var toolTipMap = new Map();

toolTipMap.set("age", "Median Age")
    .set("income", "Median Household Income")
    .set("poverty", "Poverty")
    .set("healthcare", "Lacks Healthcare")
    .set("smokes", "Smokes")
    .set("obesity", "Obesity");

var toolTipSuffixMap = new Map ();

toolTipSuffixMap.set("age", "Years")
  .set("income", "")
  .set("poverty", "%")
  .set("healthcare", "%") 
  .set("smokes", "%")
  .set("obesity", "%");

var axisLabelMap = new Map();

axisLabelMap.set("age", "Age (Median)")
    .set("income", "Household Income (Median)")
    .set("poverty", "Poverty (%)")
    .set("healthcare", "Lacks Healthcare (%)")
    .set("smokes", "Smokes (%)")
    .set("obesity", "Obesity (%)");


// function used for computing correlation coefficient using Jstat
function getSpearman(stateData, chosenXaxis, chosenYaxis) {
  
  // x data
  let x = stateData.map(d => d[chosenXaxis]);
  let y = stateData.map(d => d[chosenYaxis]);

  let rho = jStat.spearmancoeff(x, y);

  return rho;
}

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXaxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXaxis]) * 0.9,
      d3.max(stateData, d => d[chosenXaxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYaxis) {
  // create scales
  /* console.log("In yScale");
  console.log("chosenYaxis: " + chosenYaxis);
  console.log(d3.min(stateData, d => d[chosenYaxis]));
  console.log(d3.max(stateData, d => d[chosenYaxis]));
  console.log("height: " + height); */

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYaxis]) * 0.9,
      d3.max(stateData, d => d[chosenYaxis]) * 1.1])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, labelsGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]))
    .attr("cy", d => newYScale(d[chosenYaxis]));

  labelsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXaxis]))
    .attr("y", d => newYScale(d[chosenYaxis]));

  return [circlesGroup, labelsGroup];
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup) {

  let xlabel = toolTipMap.get(chosenXaxis);
  let ylabel = toolTipMap.get(chosenYaxis);
  let xsuffix = toolTipSuffixMap.get(chosenXaxis);
  let ysuffix = toolTipSuffixMap.get(chosenYaxis);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXaxis]} ${xsuffix} <br>${ylabel} ${d[chosenYaxis]} ${ysuffix}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, stateData) {

  console.log("In csv reader");

  if (err) throw err;

  console.log("Passed error block");
  
  console.log(stateData);

  // parse data
  stateData.forEach(function(data) {
    data.poverty = Number(data.poverty);
    data.age = Number(data.age);
    data.income = Number(data.income);
    data.healthcare = Number(data.healthcare);
    data.obesity = Number(data.obesity);
    data.smokes = Number(data.smokes);
  });

  // precompute all spearmen correlation coefficients - 
  // do not compute each time axes switch
  let xvars = ["poverty", "age", "income"];
  let yvars = ["obesity", "smokes", "healthcare"];

  let spearmanMap = new Map();

  for (let x of xvars) {
    for (let y of yvars) {
      spearmanMap.set(x+y, getSpearman(stateData, x, y).toFixed(2));
    }
  }

  console.log(spearmanMap);
  
  // console.log(getSpearman(stateData, "poverty", "obesity"));


  // first stop
  console.log(stateData);

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // yLinearScale function above csv import
  // note we are relying on the global state of chosenYaxis
  var yLinearScale = yScale(stateData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 8)
    .attr("fill", "steelblue")
    .attr("opacity", ".5");

  var labelsGroup = chartGroup.selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    .classed("chartText", true)
    .attr("font-size", 8)
    .text((d) => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dx", -5)
    .attr("dy", +3);
  
  var titleGroup = chartGroup.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Spearman's Rho: " + spearmanMap.get(chosenXAxis+chosenYAxis));
  
    // Create group for  3 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text(axisLabelMap.get("poverty"));

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text(axisLabelMap.get("age"));

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text(axisLabelMap.get("income"));

  // Create group for  3 y- axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height/2))
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text(axisLabelMap.get("obesity"));

  var smokesLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height/2))
    .attr("y", 0 - margin.left + 20)
    .attr("dy", "1em")
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text(axisLabelMap.get("smokes"));

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height/2))
    .attr("y", 0 - margin.left + 40)
    .attr("dy", "1em")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text(axisLabelMap.get("healthcare"));
  
  // append y axis
  /* chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Number of Billboard 500 Hits"); */

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        // still send y values
        [circlesGroup, labelsGroup] = renderCircles(circlesGroup, labelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // update title:
        titleGroup.text("Spearman's Rho: " + spearmanMap.get(chosenXAxis+chosenYAxis));

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text x axis
        switch(chosenXAxis) {
          case "poverty":
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          case "age":
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          case "income":
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
             ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            break;
        } // end switch
        
      }
    }); // end x axis labels event listener

  ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYaxis with value
      // this is a global var
      chosenYAxis = value;

      console.log(chosenYAxis)

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(stateData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      // still send x values
      [circlesGroup, labelsGroup] = renderCircles(circlesGroup, labelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // update title:
      titleGroup.text("Spearman's Rho: " + spearmanMap.get(chosenXAxis+chosenYAxis));

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text x axis
      switch(chosenYAxis) {
        case "obesity":
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          break;
        case "smokes":
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          break;
        case "healthcare":
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          break;
      } // end switch
      
    }
  }); // end y axis labels event listener

});
