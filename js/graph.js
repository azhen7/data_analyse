function isEqual(a, b) {
  return Math.abs(a - b) < 1e-8;
}

export function generateAxisLabel(label) {
  return {
    title: {
      text: label,
      font: {
        family: 'Arial',
        size: 18,
        color: '#7f7f7f'
      }
    }
  };
}

/*
  SINGLE VARIABLE GRAPHING FUNCTIONS
*/
//box plot
export function box_plot(graph, values, outliers) {
  const trace = {
    x: values,
    type: "box",
    name: "Plot",
    boxpoints: outliers
  };
  Plotly.newPlot(graph, [trace], { title: "Box plot of data" }, { displayModeBar: false });
}

//histogram
export function histogram(graph, values) {
  const trace = {
    x: values,
    type: "histogram",
    name: "Plot",
    xbins: {
      end: values.at(-1),
      size: 10
    },
    ybins: {
      size: 10
    },
    marker: {
      color: "rgba(100, 200, 102, 0.7)",
      line: {
        color:  "rgba(0, 0, 0, 1)", 
        width: 1
      } 
    }
  };
  
  const layout = {
    title: "Histogram of data",
    xaxis: generateAxisLabel("Values"),
    yaxis: generateAxisLabel("Frequency of Values")
  };
  Plotly.newPlot(graph, [trace], layout, { displayModeBar: false });
}

/*
  BIVARIATE GRAPHING FUNCTIONS
*/
//scatter plot
export function scatter_plot(graph, x, y, xLabel, yLabel) {
  let lineData = {};
  const layout = {
    title: `${xLabel} vs ${yLabel}`,
    xaxis: generateAxisLabel(xLabel),
    yaxis: generateAxisLabel(yLabel)
  };
  
  if (x.length > 1) {
    //determine line of best fit equation
    const xSum = x.reduce((a, b) => a + b, 0);
    const ySum = y.reduce((a, b) => a + b, 0);
    const xSquaredSum = x.reduce((a, b) => a + b * b, 0);
    const N = x.length;

    let pairwiseProduct = 0;
    for (let i = 0; i < x.length; i++) {
      pairwiseProduct += x[i] * y[i];
    }
    
    let line;
    
    //vertical line of best fit
    if (N * xSquaredSum - xSum * xSum === 0) {
      lineData.isVertical = true;
      lineData.xIntercept = x[0];
      line = {
        type: "line",
        x0: x[0],
        y0: Math.min(...y),
        x1: x[0],
        y1: Math.max(...y)
      };
    }
    //not vertical line of best fit
    else {
      const slope = (N * pairwiseProduct - xSum * ySum) / (N * xSquaredSum - xSum * xSum);
      const yIntercept = (ySum - slope * xSum) / N;

      lineData.slope = slope;
      lineData.yIntercept = yIntercept;
      
      line = {
        type: "line",
        x0: Math.min(...x),
        y0: slope * Math.min(...x) + yIntercept,
        x1: Math.max(...x),
        y1: slope * Math.max(...x) + yIntercept,
        line: {
          color: 'rgb(55, 128, 191)',
          width: 3
        }
      };
    }
    layout.shapes = [line];
  }
  else {
    lineData = 0;
  }
  
  //scatter plot
  const scatter = {
    x,
    y,
    mode: 'markers',
    type: 'scatter',
  };
  
  Plotly.newPlot(graph, [scatter], layout, { displayModeBar: false });
  
  return lineData;
}

//bar graph
export function bar(graph, x, y, xLabel, yLabel) {
  const layout = {
    title: `${xLabel} vs ${yLabel}`,
    xaxis: generateAxisLabel(xLabel),
    yaxis: generateAxisLabel(yLabel),
    barmode: "relative"
  }
  const bar = {
    x,
    y,
    type: 'bar',
    width: new Array(x.length).fill(0.2),
    text: y.map(String),
    textposition: 'auto',
  };
  Plotly.newPlot(graph, [bar], layout, { displayModeBar: false });
}
//line graph
export function line(graph, x, y, xLabel, yLabel) {
  const layout = {
    title: `${xLabel} vs ${yLabel}`,
    xaxis: generateAxisLabel(xLabel),
    yaxis: generateAxisLabel(yLabel)
  }
  const line = {
    x,
    y,
    mode: 'lines+markers',
    type: "scatter"
  };
  Plotly.newPlot(graph, [line], layout, { displayModeBar: false });
}

/*
  MULTIVARIATE FUNCTIONS
*/
//circle
export function pie(graph, x, y) {
  const data = [{
    values: y,
    labels: x,
    type: 'pie'
  }];

  const layout = {
    height: 400,
    width: 500
  };

  Plotly.newPlot(graph, data, layout);
}