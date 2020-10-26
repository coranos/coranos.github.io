const defaultMovingAveragePeriod = 20;

function addDefaultBollingerBands (response, label) {
  // console.log('addDefaultBollingerBands started ' + label, defaultMovingAveragePeriod);
  addBollingerBands(response, label, '', defaultMovingAveragePeriod, 'rgba(220, 220, 255, 1)');
}

function addBollingerBands (response, label, labelSuffix, movingAveragePeriod, backgroundColor) {
  const data = response.datasets;
  const oldDataLength = data.length;
  // console.log('addBollingerBands started ' + label, movingAveragePeriod);
  for (let dataIx = 0; dataIx < oldDataLength; dataIx++) {
    const elt = data[dataIx];
    if (elt.label == label) {
      // console.log('found label \'' + label + '\' in data.');
      const eltData = elt.data;

      const movingAverageData = getMovingAverage(eltData, movingAveragePeriod);
      // console.log('addBollingerBands movingAverageData ' + label, movingAverageData);

      const maElt = cloneElt(elt, movingAverageData, label + ' Moving Average', 'rgb(171,171,255)', undefined, false);
      data.push(maElt);

      const standardDeviationData = getStandardDeviation(eltData, movingAverageData, movingAveragePeriod);

      // console.log('addBollingerBands standardDeviationData ' + label, standardDeviationData);

      const topBollingerData = getBollinger(movingAverageData, standardDeviationData, +2);
      const bollingerTopElt = cloneElt(elt, topBollingerData, label + ' Bollinger Top', 'rgb(171,255,171)', undefined, false);
      data.push(bollingerTopElt);

      const botBollingerData = getBollinger(movingAverageData, standardDeviationData, -2);
      const bollingerBotElt = cloneElt(elt, botBollingerData, label + ' Bollinger Bot', 'rgb(255,171,171)', backgroundColor, '-1');
      data.push(bollingerBotElt);
    }
  }
  // console.log('addBollingerBands complete ' + label);
}

function cloneElt (elt, data, label, borderColor, backgroundColor, fill) {
  const newElt = {};
  newElt.borderColor = borderColor;
  newElt.backgroundColor = backgroundColor;
  newElt.fill = fill;
  newElt.data = data;
  newElt.label = label;
  newElt.type = elt.type;
  newElt.yAxisID = elt.yAxisID;
  return newElt;
}

function getBollinger (movingAverageData, standardDeviationData, stdevScale) {
  const bollingers = [];
  for (let dataIx = 0; dataIx < movingAverageData.length; dataIx++) {
    bollingers.push(0);
  }
  for (let dataIx = 0; dataIx < movingAverageData.length; dataIx++) {
    bollingers[dataIx] = (movingAverageData[dataIx] + (standardDeviationData[dataIx] * stdevScale)).toFixed(3);
  }
  return bollingers;
}

function getStandardDeviation (data, movingAverageData, period) {
  const variances = [];
  const counts = [];
  const stddevs = [];
  for (let dataIx = 0; dataIx < data.length; dataIx++) {
    variances.push(0);
    counts.push(0);
    stddevs.push(0);
  }
  for (let dataIx = 0; dataIx < data.length; dataIx++) {
    const value = data[dataIx];
    const ma = movingAverageData[dataIx];
    const variance = (ma - value) * (ma - value);
    for (let periodIx = 0; periodIx < period; periodIx++) {
      const eltIx = dataIx + periodIx;
      if (eltIx < data.length) {
        variances[eltIx] += variance;
        counts[eltIx] += 1.0;
      }
    }
  }
  for (let dataIx = 0; dataIx < data.length; dataIx++) {
    stddevs[dataIx] = Math.sqrt(variances[dataIx] / counts[dataIx]);
  }
  return stddevs;
}

function getMovingAverage (data, period) {
  const sum = [];
  const count = [];
  const average = [];

 // console.log('getMovingAverage ', period, data);

  for (let dataIx = 0; dataIx < data.length; dataIx++) {
    sum.push(0);
    count.push(0);
    average.push(0);
  }
  for (let dataIx = 0; dataIx < data.length; dataIx++) {
    const value = data[dataIx];
    for (let periodIx = 0; periodIx < period; periodIx++) {
      const eltIx = dataIx + periodIx;
      if (eltIx < data.length) {
        sum[eltIx] += value;
        count[eltIx] += 1.0;
      }
    }
  }
  for (let dataIx = 0; dataIx < data.length; dataIx++) {
    average[dataIx] = sum[dataIx] / count[dataIx];
  }
  return average;
}
