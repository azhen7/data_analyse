function round(k) {
  return Math.round(k * Math.pow(10, 5)) / Math.pow(10, 5);
}

//arithmetic mean
export function arithmetic_mean(arr) {
  return round(arr.reduce((a, b) => a + b, 0) / arr.length);
}
//geometric mean
export function geometric_mean(arr) {
  if (arr.some(a => a < 0)) {
    return "Undefined: Negative values detected";
  }
  const array_len = arr.length;
  return round(
    arr.reduce((a, b) => a * Math.pow(b, 1 / array_len), 1)
  );
}
//harmonic mean
export function harmonic_mean(arr) {
  if (arr.some(a => a === 0)) {
    return "Undefined: 0 not allowed for any input"
  }
  return round(
    arr.length / arr.reduce((a, b) => a + 1 / b, 0)
  );
}

//median
export function median(arr) {
  //odd number of elements
  if (arr.length & 1) {
    return arr[Math.floor(arr.length / 2)];
  }
  return round((arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2);
}

//mode
//assume arr is sorted
export function mode(a) {
  let occurrences = {};
  for (let i = 0; i < a.length; i++) {
    const elem = a[i];
    if (typeof occurrences[elem] === "undefined") {
      occurrences[elem] = 0;
    }
    occurrences[elem]++;
  }
  let maxStreak = Math.max(...Object.values(occurrences));
  let modes = [];
  for (const prop in occurrences) {
    if (occurrences[prop] === maxStreak) {
      modes.push(+prop);
    }
  }
  if (modes.length === a.length) {
    return "No mode - All numbers appear the same number of times";
  }
  return modes.join(", ");
}

export function quantile(arr, percentage) {
  if (arr.length === 1) {
    return arr[0];
  }
  
  const index = arr.length * percentage + 0.5;
  if (Number.isInteger(index)) {
    return arr[index - 1];
  }
  const before = arr[Math.floor(index) - 1];
  const after = arr[Math.floor(index)];
  const decimal_part = index - Math.floor(index);
  return round((decimal_part * after + (1 - decimal_part) * before));
}

//first quartile
export function first_quartile(arr) {
  return quantile(arr, 0.25);
}

//third quartile
export function third_quartile(arr) {
  return quantile(arr, 0.75);
}

//compute outliers
export function outliers(arr, first_quart, third_quart) {
  const interquartile_range = third_quart - first_quart;
  const upper_fence = third_quart + 1.5 * interquartile_range;
  const lower_fence = first_quart - 1.5 * interquartile_range;
  
  let outliers = [];
  //check for outliers greater than third quartile by more than 1.5x interquartile range
  for (let i = arr.length - 1; i >= 0 && arr[i] > upper_fence; i--) {
    outliers.push(arr[i]);
  }
  //check for outliers less than first quartile by more than 1.5x interquartile range
  for (let i = 0; i < arr.length && arr[i] < lower_fence; i++) {
    outliers.push(arr[i]);
  }
  if (outliers.length === 0) {
    return "No outliers";
  }
  return outliers.join(", ");
}

//variance
function _variance_root_calc(arr) {
  const mean = arithmetic_mean(arr);
  let n = 0;
  for (const elem of arr) {
    n += (elem - mean) * (elem - mean);
  }
  return n;
}
export function sample_variance(arr) {
  return round(_variance_root_calc(arr) / (arr.length - 1));
}
export function pop_variance(arr) {
  return round(_variance_root_calc(arr) / arr.length);
}
//standard deviation
export function sample_standard_deviation(arr) {
  return round(Math.sqrt(_variance_root_calc(arr) / (arr.length - 1)));
}
export function pop_standard_deviation(arr) {
  return round(Math.sqrt(_variance_root_calc(arr) / arr.length));
}

//Pearson correlation coefficient
export function pearson_correl(x, y) {
  console.assert(x.length === y.length, "x and y must have same lengths");
  
  let n = 0;
  const xMean = arithmetic_mean(x);
  const yMean = arithmetic_mean(y);
  
  for (let i = 0; i < x.length; i++) {
    n += (x[i] - xMean) * (y[i] - yMean);
  }
  n /= x.length;
  
  return round(n / Math.sqrt(pop_variance(x) * pop_variance(y)));
}
export function determine_correlation_info(correl) {
  function determinePositiveNegative(a) {
    if (a > 0) {
      return "Positive";
    }
    return "Negative";
  }
  
  if (Math.abs(correl) < 0.25) {
    return "No correlation";
  }
  if (Math.abs(correl) < 0.5) {
    return `${determinePositiveNegative(correl)} weak correlation`;
  }
  if (Math.abs(correl) < 0.75) {
    return `${determinePositiveNegative(correl)} moderate correlation`;
  }
  if (Math.abs(correl) < 1) {
    return `${determinePositiveNegative(correl)} strong correlation`;
  }
  return `${determinePositiveNegative(correl)} perfect correlation`;
}

// export function pearson_correlation(x, y) {
//   let sumX = 0,
//     sumY = 0,
//     sumXY = 0,
//     sumX2 = 0,
//     sumY2 = 0;
//   const minLength = x.length = y.length = Math.min(x.length, y.length),
//     reduce = (xi, idx) => {
//       const yi = y[idx];
//       sumX += xi;
//       sumY += yi;
//       sumXY += xi * yi;
//       sumX2 += xi * xi;
//       sumY2 += yi * yi;
//     }
//   x.forEach(reduce);
//   return (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY));
// };