var toolTipMap = new Map();

toolTipMap.set("age", "Median Age")
    .set("income", "Median Household Income")
    .set("poverty", "Poverty")
    .set("healthcare", "Lacks Healthcare")
    .set("smokes", "Smokes")
    .set("obesity", "Obesity");

var axisLabelMap = new Map();

axisLabelMap.set("age", "Age (Median)")
    .set("income", "Household Income (Median)")
    .set("poverty", "Poverty (%)")
    .set("healthcare", "Lacks Healthcare (%)")
    .set("smokes", "Smokes (%)")
    .set("obesity", "Obesity (%)");

console.log(toolTipMap);

console.log(toolTipMap.get("age"));
console.log(toolTipMap.get("income"));

console.log(axisLabelMap);
console.log(axisLabelMap.get("age"));
console.log(axisLabelMap.get("obesity"));

function getToolTipLabel (varName) {
    // get the label for the tool tip based on the chosen variable

    let label = "";

    switch(varName) {
        case "age":
            label = "Median Age";
            break;
        case "income":
            label = "Median Household Income";
            break;
        case "poverty":
            label = "Poverty";
            break;
        case "healthcare":
            label = "Lacks Healthcare";
            break;
        case "smokes":
            label = "Smokes";
            break;
        case "obesity":
            label = "Obesity";
            break;
    }
    // no default case is given 
    // if an unknown varName, return empty string for now

    return label;
}

console.log(getToolTipLabel("obesity"));
console.log(getToolTipLabel("smokes"));
