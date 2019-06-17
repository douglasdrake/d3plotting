/* This finally loaded the data by going back on the versioning of D3 to 4.13.0 in the script loading */
/* Also had to backtrack on the d3-tip function */
/* Not sure how to get around this ... */

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv", function(error, stateData) {

  // console.log("In csv reader");

  console.log(stateData);

  if (error) { 
    throw error;
  }

  // console.log("Passed error block");
  
  // console.log(stateData);

  // parse data
  stateData.forEach(function(data) {
    data.poverty = Number(data.poverty);
    data.age = Number(data.age);
    data.income = Number(data.income);
    data.healthcare = Number(data.healthcare);
    data.obesity = Number(data.obesity);
    data.smokes = Number(data.smokes);
  });

  var ul = d3.select("#mydata").append("ul");
  // YOUR CODE HERE//
  var selection = ul.selectAll("li") // creates virtual selection - there are not currently any there but we will add them - why called vitural selection
    .data(stateData) // binds data
    .enter() // allows us to start adding items
    .append("li") // appends li element for each item in array (since there are currently none)
    .text(function(d) {
      return `${d.state}: ${d.poverty}`;
    }); // sets the text of each element to match the items in array

  // first stop
  // console.log(stateData);
});

