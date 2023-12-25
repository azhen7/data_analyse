import * as single_var from "./data_calcs.js";
import * as graph_generator from "./graph.js";

function round(k) {
  return Math.round(k * Math.pow(10, 5)) / Math.pow(10, 5);
}

document.getElementById("choose_num_vars").addEventListener("change", () => {
  const single = document.getElementById("single_var");
  const single_res = document.getElementById("single_var_results");
  
  const two = document.getElementById("two_var");
  const two_res = document.getElementById("two_var_results");
  
  const multi = document.getElementById("multi_var");
  const multi_res = document.getElementById("multi_var_results");
  
  single.style.display = "none";
  single_res.style.display = "none";
  
  two.style.display = "none";
  two_res.style.display = "none";
  
  multi.style.display = "none";
  multi_res.style.display = "none";
  
  switch (document.getElementById("choose_num_vars").value) {
    case "single_var": {
      single.style.display = "block";
      single_res.style.display = "block";
      break;
    }
    case "two_var": {
      two.style.display = "block";
      two_res.style.display = "block";
      break;
    }
    case "multi_var": {
      multi.style.display = "block";
      multi_res.style.display = "block";
      break;
    }
  }
});

function singleVarData(s) {
  const values = s.trim().replace(/ +/g, " ").split(" ");
  if (s.length === 0) {
    alert("ERROR: No values were entered");
    return;
  }
  
  //get parsed values
  let parsed = [];
  for (const v of values) {
    const value = v;
    if ((+value).toString() !== value) {
      alert("ERROR: Only numeric values allowed");
      return;
      
    }
    parsed.push(+value)
  }
  parsed.sort((a, b) => a - b)
  
  //calculate measures of central tendency
  const arith_mean = single_var.arithmetic_mean(parsed);
  const geo_mean = single_var.geometric_mean(parsed);
  const harmonic_mean = single_var.harmonic_mean(parsed);
  
  const median = single_var.median(parsed);
  const mode = single_var.mode(parsed);
  
  document.getElementById("left").innerHTML = 
  `
    <h3>Measures of Central Tendency</h3>
    Arithmetic Mean = ${arith_mean}
    <br />
    Geometric Mean = ${geo_mean}
    <br />
    Harmonic Mean = ${harmonic_mean}
    <br />
    Median = ${median}
    <br />
    Mode(s): ${mode}
    <br />
  `;
  
  //calculate measures of spread
  const first_quart = single_var.first_quartile(parsed);
  const third_quart = single_var.third_quartile(parsed);
  const outliers = single_var.outliers(parsed, first_quart, third_quart);
  const samp_variance = single_var.sample_variance(parsed);
  const pop_variance = single_var.pop_variance(parsed);
  const samp_std_dev = single_var.sample_standard_deviation(parsed);
  const pop_std_dev = single_var.pop_standard_deviation(parsed);
  
  document.getElementById("right").innerHTML = 
  `
    <h3>Measures of spread</h3>
    Minimum = ${parsed.at(-1)}
    <br />
    Maximum = ${parsed[0]}
    <br />
    Range = ${round(parsed.at(-1) - parsed[0])}
    <br />
    First quartile = ${first_quart} <span class="triggerModal" onclick="document.getElementById('quartile_calc_modal').style.display = 'block';">(*)</span>
    <br />
    Third quartile = ${third_quart} <span class="triggerModal" onclick="document.getElementById('quartile_calc_modal').style.display = 'block';">(*)</span>
    <br />
    Interquartile range = ${round(third_quart - first_quart)}
    <br />
    <br />
    Sample Standard Deviation = ${samp_std_dev}
    <br />
    Population Standard Deviation = ${pop_std_dev}
    <br />
    Sample Variance = ${samp_variance}
    <br />
    Population Variance = ${pop_variance}
    <br />
    <br />
    Outliers: ${outliers}
  `;
  
  document.getElementById("graph_select").selectedIndex = 0;
  document.getElementById("graph_chooser").style.display = "block";
  document.getElementById("graph").innerText = "";
  document.getElementById("graph").style.display = "none";
  document.getElementById("additionalInfo").innerText = "";
  
  //single variable graph
  //using onchange instead of addEventListener because setting
  //onchange explicitly overrides all previously set listeners, which is
  //what I want
  document.getElementById("graph_select").onchange = function generateSingleVarDataGraph() {
    document.getElementById("additionalInfo").innerText = "";
    document.getElementById("graph").style.display = "block";
    
    switch (document.getElementById("graph_select").value) {
      case "none": {
        document.getElementById("graph").style.display = "none";
        document.getElementById("graph").innerText = "";
        break;
      }
      case "box_outlier": {
        graph_generator.box_plot("graph", parsed.slice(), "outliers");
        break;
      }
      case "box_no_outlier": {
        graph_generator.box_plot("graph", parsed.slice(), false);
        break;
      }
      case "histogram": {
        graph_generator.histogram("graph", parsed.slice());
        document.getElementById("additionalInfo").innerHTML = `
         <span class="triggerModal" onclick="document.getElementById('histogram_grouping_modal').style.display = 'block';">
           (Click to see more information)
         </span>
        `;
        break;
      }
    }
  };
}

document.getElementById("submit_values").addEventListener("click", () => {
  singleVarData(document.getElementById("values").value);
});

const one_var_form = document.getElementById("file");
one_var_form.addEventListener("change", e => {
  const file = one_var_form.files[0];
  const reader = new FileReader();
  
  reader.onloadend = () => {
    const contents = document.getElementById("upload_csv_file_contents");
    const data = reader.result.split(",");
    
    //check if only columns provided
    if (data.length > 0) {
      alert("ERROR: Invalid .csv format. There must only be 1 row of inputs in the sheet.");
      return;
    }
    const nums = data.columns;
    if (!nums.every(elem => (+elem.trim()).toString() === elem)) {
      alert("ERROR: Inputs in .csv file must all be numeric values");
      return;
    }
    
    contents.innerText = `Parsed from uploaded .csv file: ${nums.join(" ")}`;
    singleVarData(nums.join(" "));
    
  };
  reader.readAsDataURL(file);
  
  e.preventDefault();
});

const modals = [
  ["quartile_calc_modal", "quartile_calc_close"],
  ["histogram_grouping_modal", "histogram_grouping_close"],
  ["line_best_fit_modal", "line_best_fit_close"],
  ["two_var_csv_format_modal", "two_var_csv_format_close"]
];
for (const elem of modals) {
  const modal = document.getElementById(elem[0]);
  const span = document.getElementById(elem[1]);

  // When the user clicks on <span> (x), close the modal
  span.addEventListener("click", () => {
    modal.style.display = "none";
  })

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("click", event => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}
document.getElementById("csv_format_view").onclick = e => {
  document.getElementById("two_var_csv_format_modal").style.display = "block";
}

//Two variable submit
document.getElementById("two_var_submit").addEventListener("click", () => {
  const xLabel = document.getElementById("label1").value;
  const yLabel = document.getElementById("label2").value;
  let textAreaX = document.getElementById("two_var_x").value;
  let textAreaY = document.getElementById("two_var_y").value;
  
  if (textAreaX.trim().length === 0) {
    alert("ERROR: No X values entered");
    return;
  }
  if (textAreaY.trim().length === 0) {
    alert("ERROR: No Y values entered");
    return;
  }
  
  textAreaX = textAreaX.trim().replace(/\n/g, " ").replace(/ +/g, " "); //replace multiple consecutive spaces to 1
  textAreaY = textAreaY.trim().replace(/\n/g, " ").replace(/ +/g, " "); //replace multiple consecutive spaces to 1
  
  //preprocess inputs
  const x = textAreaX.split(" ").map(e => +e.trim());
  const y = textAreaY.split(" ").map(e => +e.trim());
  
  if (x.length !== y.length) {
    alert("ERROR: There must be one y value for every x value");
    return;
  }
  
  document.getElementById("two_var_upload_csv_file_contents").innerHTML = "";
  
  twoVarData(x, y, xLabel, yLabel);
});

function parseTwoVarCSV(data) {
  const unparsed = data.split("\n");
  if (unparsed.length !== 2) {
    alert("ERROR: Invalid .csv format. There must 2 rows of data in the sheet");
    return;
  }
  return [
    unparsed[0].split(","),
    unparsed[1].split(",")
  ];
}

function buildTable(x, y, xLabel, yLabel) {
  //construct table to display parsed results to user
  let table = `<table><tbody><tr><th>${xLabel}</th>`;
  //insert x values into table
  for (let i = 0; i < x.length; i++) {
    table += `<td>${x[i]}</td>`;
  }
  table += "</tr>";

  //insert y values into table
  table += `<tr><th>${yLabel}</th>`;
  for (let i = 0; i < y.length; i++) {
    table += `<td>${y[i]}</td>`;
  }
  table += "</tr></tbody></table>";
  
  return table;
}

const two_var_form = document.getElementById("two_var_file");
two_var_form.addEventListener("change", e => {
  const file = two_var_form.files[0];
  const reader = new FileReader();
  
  reader.onloadend = () => {
    //parse csv
    const data = parseTwoVarCSV(reader.result);
    if (typeof data === "undefined") {
      return;
    }
    
    const x = data[0];
    const y = data[1];
    
    if (x.length !== y.length) {
      alert("ERROR: There must be one y value for every x value");
      return;
    }
    
    //labels
    const xLabel = x.shift().trim();
    if ((+xLabel).toString() === xLabel) {
      alert("ERROR: X Label cannot be numeric.");
      return;
    }
    const yLabel = y.shift().trim();
    
    //parse and validate inputs
    for (let i = 0; i < x.length; i++) {
      const currX = x[i].trim();
      const currY = y[i].trim();
      //if cell is blank
      if (currX.length === 0 && currY.length === 0) {
        x.splice(i, 1);
        y.splice(i, 1);
        i--;
        continue;
      }
      //check elements are numeric
      if ((+currX).toString() !== currX || (+currY).toString() !== currY) {
        alert("ERROR: Inputs in .csv file must all be numeric values");
        return;
      }
      x[i] = +currX;
      y[i] = +currY;
    }
    
    document.getElementById("two_var_upload_csv_file_contents").innerHTML = `<br /> Parsed from uploaded .csv file: <br /><br /> ${buildTable(x, y, xLabel, yLabel)}`;
    
    twoVarData(x, y, xLabel, yLabel);
  };
  reader.readAsText(file);
  
  e.preventDefault();
});

function twoVarData(x, y, xLabel, yLabel) {
  if (x.length === 0) {
    alert("ERROR: No input entered");
    return;
  }
  
  //correlation coef
  const correl_coef = single_var.pearson_correl(x,y);
  const correl_info = single_var.determine_correlation_info(correl_coef);
  
  document.getElementById("two_var_data_info").innerHTML = 
  `
    Correlation Coefficient = ${correl_coef}
    <br />
    ${correl_info}
  `;
  
  document.getElementById("two_var_graph_select").selectedIndex = 0;
  document.getElementById("two_var_graph_chooser").style.display = "block";
  document.getElementById("two_var_graph").innerText = "";
  document.getElementById("two_var_graph").style.display = "none";
  document.getElementById("two_var_additionalInfo").innerHTML = "";
  document.getElementById("two_var_predicter").style.display = "none";
  
  //specifically using onchange instead of addEventListener because it overrides
  //previously defined listeners, which is desired behavior
  document.getElementById("two_var_graph_select").onchange = e => {
    document.getElementById("two_var_predicter").style.display = "none";
    document.getElementById("two_var_graph").style.display = "block";
    document.getElementById("two_var_additionalInfo").innerHTML = "";
    
    //two var graphs
    switch (document.getElementById("two_var_graph_select").value) {
      case "scatter": {
        const lineData = graph_generator.scatter_plot("two_var_graph", x.slice(), y.slice(), xLabel, yLabel);
        
        if (typeof lineData === "object") {
          //line of best fit is not vertical
          if (!lineData.isVertical) {
            document.getElementById("two_var_predicter").style.display = "block";
            //without this, we would be having things like "+ -5" instead of "- 5"
            let operand = "+";
            if (lineData.yIntercept < 0) {
              operand = "-";
            }

            let equation = "";
            //determine special cases (e.g. we omit 1 as coefficient)
            switch (round(lineData.slope)) {
              case 1: {
                equation = `y = x ${operand} ${round(Math.abs(lineData.yIntercept))}`;
                break;
              }
              case -1: {
                equation = `y = -x ${operand} ${round(Math.abs(lineData.yIntercept))}`;
                break;
              }
              case 0: {
                equation = `y = ${round(lineData.yIntercept)}`;
                break;
              }
              default: {
                equation = `y = ${round(lineData.slope)}x ${operand} ${round(Math.abs(lineData.yIntercept))}`;
                break;
              }
            }

            document.getElementById("two_var_additionalInfo").innerHTML +=
            `
              <span>Line of best fit: ${equation}</span>
              <br />
            `;

            //Predictions based on line of best fit
            document.getElementById("two_var_predict_input").oninput = e => {
              const val = document.getElementById("two_var_predict_input").value;
              const num = +val;
              if (num !== num) {
                return;
              }
              document.getElementById("two_var_predict_res").innerText = 
              `
                Predicted output = ${round(lineData.slope)}(${num}) ${operand} ${round(Math.abs(lineData.yIntercept))} = ${round(lineData.slope * num + lineData.yIntercept)}
              `
            };
          }
          //if line of best fit is vertical, we take the x coord of all the points
          //(which will be the same)
          else {
            document.getElementById("two_var_predicter").style.display = "none";
            document.getElementById("two_var_additionalInfo").innerHTML +=
            `
              <span>Line of best fit: x = ${round(lineData.xIntercept)}</span>
              <br />
            `;
          }
        }
        //no line of best fit
        else {
          document.getElementById("two_var_predicter").style.display = "none";
          document.getElementById("two_var_additionalInfo").innerHTML +=
          `
            <span>No line of best fit (only 1 data point)</span>
            <br />
          `;
        }
        
        document.getElementById("two_var_additionalInfo").innerHTML += 
        `
          <span class="triggerModal" onclick="document.getElementById('line_best_fit_modal').style.display = 'block';">(Click to see line of best fit calculation)</span>
        `;
        
        break;
      }
      case "bar": {
        graph_generator.bar("two_var_graph", x.slice(), y.slice(), xLabel, yLabel);
        break;
      }
      case "line": {
        graph_generator.line("two_var_graph", x.slice(), y.slice(), xLabel, yLabel);
        break;
      }
      default: {
        document.getElementById("two_var_graph").style.display = "none";
        break;
      }
    }
  };
}

//Multi variable data points inputter
const outer = document.getElementById("input_data_pts");
document.getElementById("multi_var_num_data_pts").addEventListener("input", () => {
  const val = document.getElementById("multi_var_num_data_pts").value;
  const num = +val;
  if (num !== num) {
    return;
  }
  if (num > 100) {
    if (!confirm(`Are you sure you want to enter ${num} data points? (It may lag out your device.)`)) {
      document.getElementById("multi_var_num_data_pts").value = val.substring(0, val.length - 1);
      return;
    }
  }
  while (outer.childNodes.length > 0) {
    outer.removeChild(outer.lastChild);
  }
  for (let i = 1; i <= num; i++) {
    const span = document.createElement("span");
    span.innerHTML = `Data Point ${i}: (<input class=\"multi_var_input\" size=\"10\">, <input class=\"multi_var_input\" size=\"5\">)<br /><br />`;
    outer.appendChild(span);
  }
});
document.getElementById("multi_var_submit").addEventListener("click", () => {
  if (document.getElementById("multi_var_num_data_pts").value.trim() === "") {
    alert("ERROR: No input entered");
    return;
  }
  
  const dataPts = document.getElementsByClassName("multi_var_input");
  //Getting and preprocessing data points
  let x = [], y = [];
  for (let i = 0; i < dataPts.length; i += 2) {
    if (dataPts[i].value.trim() === "" || dataPts[i].value.trim() === "") {
      alert("ERROR: All inputs must be filled in");
      return;
    }
    
    const currentX = dataPts[i].value.trim();
    if ((+currentX).toString() === currentX) {
      alert("ERROR: First row must only be labels");
      return;
    }
    const currentY = dataPts[i + 1].value.trim();
    if ((+currentY).toString() !== currentY) {
      alert("ERROR: Only numeric values allowed for second row");
      return;
    }
    
    x.push(currentX);
    y.push(+currentY);
  }
  
  document.getElementById("multi_var_graph_chooser").style.display = "block";
  document.getElementById("multi_var_graph").style.display = "none";
  document.getElementById("bar_graph_labels").style.display = "none";
  
  //multivariate graphs
  document.getElementById("multi_var_graph_select").onchange = () => {
    document.getElementById("multi_var_additionalInfo").innerHTML = "";
    document.getElementById("multi_var_graph").style.display = "block";
    document.getElementById("bar_graph_labels").style.display = "none";
    
    switch (document.getElementById("multi_var_graph_select").value) {
      case "pie": {
        graph_generator.pie("multi_var_graph", x.slice(), y.slice());
        break;
      }
      case "bar": {
        document.getElementById("bar_graph_labels").style.display = "block";
        document.getElementById("multi_var_graph").style.display = "none";
        
        document.getElementById("multi_var_submit_labels").onclick = () => {
          document.getElementById("multi_var_graph").style.display = "block";
          graph_generator.bar("multi_var_graph", x.slice(), y.slice(), document.getElementById("multi_var_label1").value, document.getElementById("multi_var_label2").value); //TODO: Add option to add labels
        };
        break;
      }
      default: {
        document.getElementById("multi_var_graph").style.display = "none";
        break;
      }
    }
  };
});