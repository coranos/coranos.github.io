
const covid19ConfirmedDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

const covid19DeadDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv';

const covid19RecoveredDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv';

const getChartConfig = (chartData) => {
  const chartConfig = {
    type: 'bar',
    data: chartData,
    options: {
      chartArea: {
        backgroundColor: '#FFF',
      },
      spanGaps: true,
      legend: {
        position: 'top',
        display: false,
      },
      responsive: false,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
      title: {
        display: true,
        text: chartData.datasets[0].label,
      },
      tooltips: {
        mode: 'index',
        filter: function(tooltipItem) {
          return tooltipItem.datasetIndex === 0 || true;
        },
      },
      hover: {
        mode: 'index',
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
        }],
        yAxes: [{
          stacked: false,
          id: 'cases',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'More Cases Per Day',
          },
        }],
      },
    },
  };
  return chartConfig;
};

const csvToArray = (text) => {
  let p = '';
  let row = [''];
  const ret = [row];
  let i = 0;
  let r = 0;
  let s = !0;
  let l;
  for (l of text) {
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if (',' === l && s) l = row[++i] = '';
    else if ('\n' === l && s) {
      if ('\r' === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [l = ''];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
};

const onLoad = async () => {
  loadIllinois();

  const confirmedData = await (await fetch(covid19ConfirmedDataUrl)).text();
  const deadData = await (await fetch(covid19DeadDataUrl)).text();
  const recoveredData = await (await fetch(covid19RecoveredDataUrl)).text();

  // console.log(data)
  const chartDatas = [];
  const confirmedRows = csvToArray(confirmedData);
  const deadRows = csvToArray(deadData);
  const recoveredRows = csvToArray(recoveredData);

  const getLabel = (cols) => {
    const state = cols[0];
    const country = cols[1];
    if (state.length == 0) {
      return country;
    } else {
      return state + ':' + country;
    }
  };
  const deadColsByLabel = {};
  deadRows.forEach((cols) => {
    const label = getLabel(cols);
    const state = cols.shift();
    const country = cols.shift();
    const latitude = cols.shift();
    const longitude = cols.shift();
    deadColsByLabel[label] = cols;
  });
  const recoveredColsByLabel = {};
  recoveredRows.forEach((cols) => {
    const label = getLabel(cols);
    const state = cols.shift();
    const country = cols.shift();
    const latitude = cols.shift();
    const longitude = cols.shift();
    recoveredColsByLabel[label] = cols;
  });

  const countryChartDataMap = {};

  // console.log(rows.length)
  const labels = [];
  confirmedRows.forEach((cols, rowIx) => {
    if (cols.length > 0) {
      const label = getLabel(cols);
      const state = cols.shift();
      const country = cols.shift();
      const latitude = cols.shift();
      const longitude = cols.shift();
      const recoveredCols = recoveredColsByLabel[label];
      const deadCols = deadColsByLabel[label];
      // console.log(cols.length, recoveredCols.length, deadCols.length);

      if (rowIx == 0) {
        cols.forEach((col) => {
          const date = new Date(col);
          const dateStr = date.toISOString().substring(0, 10);
          labels.push(dateStr);
        });
      }

      const newChartData = (_label) => {
        const chartData = [];
        chartData.labels = [];
        chartData.datasets = [];

        const dataSet = {};
        dataSet.label = _label;
        dataSet.data = [];
        dataSet.borderColor = '#777';
        dataSet.backgroundColor = '#FFF';
        dataSet.steppedLine = false;
        dataSet.fill = false;
        dataSet.type = 'line';
        dataSet.yAxisID = 'cases';
        chartData.datasets.push(dataSet);

        return chartData;
      };
      const chartData = newChartData(label);
      chartData.cols = cols;

      let countryChartData;

      if ((state.length > 0) && (country != 'Country/Region')) {
        if (!countryChartDataMap[country]) {
          // console.log('adding country', country);
          countryChartData = newChartData(country);
          countryChartData.cols = [];
          countryChartDataMap[country] = countryChartData;
          chartDatas.push(countryChartData);
        }
        countryChartData = countryChartDataMap[country];
      }

      let prev = 0;
      let started = false;
      cols.forEach((col, colIx) => {
        if (col.length > 0) {
          if (rowIx !== 0) {
            const confirmed = parseInt(col);
            const recovered = parseInt(recoveredCols[colIx]);
            const dead = parseInt(deadCols[colIx]);
            // const curr = confirmed;// confirmed - (recovered + dead);
            const curr = confirmed - (recovered + dead);
            if (curr !== 0) {
              if (!started) {
                if (colIx > 0) {
                  chartData.labels.push(labels[colIx-1]);
                  chartData.datasets[0].data.push(0);
                }
              }
              started = true;
            }
            const diff = (curr - prev);

            if (countryChartData) {
              while (countryChartData.labels.length < colIx) {
                countryChartData.labels.push(labels[colIx]);
              }
              while (countryChartData.datasets[0].data.length <= colIx) {
                countryChartData.datasets[0].data.push(0);
              }
              countryChartData.datasets[0].data[colIx] += diff;
              while (countryChartData.cols.length <= colIx) {
                countryChartData.cols.push('0');
              }
              countryChartData.cols[colIx] = (parseInt(countryChartData.cols[colIx]) + confirmed).toFixed(0);
            }

            if (started) {
              // console.log(label, rowIx, colIx, 'col:', col, 'c:', confirmed, 'r:', recovered, 'd:', dead, 'diff:', diff);
              // if (diff !== 0) {
              chartData.labels.push(labels[colIx]);
              chartData.datasets[0].data.push(diff);
              // }
              prev = curr;
            }
          }
        }
      });
      if (chartData.datasets[0].data.length > 0) {
        chartDatas.push(chartData);
      }
    }
  });

  Object.keys(countryChartDataMap).forEach((country) => {
    const chartData = countryChartDataMap[country];
    const newLabels = [];
    const newData = [];
    const newCols = [];
    let started = false;
    for (let ix = 0; ix < chartData.labels.length; ix++) {
      if (chartData.datasets[0].data[ix] !== 0) {
        started = true;
      }
      if (started) {
        newLabels.push(chartData.labels[ix]);
        newData.push(chartData.datasets[0].data[ix]);
        newCols.push(chartData.cols[ix]);
      }
    }
    chartData.cols = newCols;
    chartData.labels = newLabels;
    chartData.datasets[0].data = newData;
  });

  const virusChartElt = document.querySelector('#virusChart');
  let virusChartHTML = '';
  const getValue = (chartData) => {
    return chartData.datasets[0].data[chartData.datasets[0].data.length-1];
  };

  const benfordsLawPct = [
    [
      '',
      '0.301',
      '0.176',
      '0.125',
      '0.097',
      '0.079',
      '0.067',
      '0.058',
      '0.051',
      '0.046',
    ],
    [
      '0.120',
      '0.114',
      '0.109',
      '0.104',
      '0.100',
      '0.097',
      '0.093',
      '0.090',
      '0.088',
      '0.085',
    ],
    [
      '0.102',
      '0.101',
      '0.101',
      '0.101',
      '0.100',
      '0.100',
      '0.099',
      '0.099',
      '0.099',
      '0.098',
    ],
  ];

  const getBenfordsLawTable = (data) => {
    if (!data) {
      return '';
    }
    let maxLen = 0;
    const table = {};
    const totalTable = {};
    data.forEach((value) => {
      if (parseInt(value) !== 0) {
        const digits = parseInt(value).toFixed(0).split('');
        maxLen = Math.max(maxLen, digits.length);
        digits.forEach((digit, digitIx) => {
          if (table[digitIx] == undefined) {
            table[digitIx] = {};
          }
          if (totalTable[digitIx] == undefined) {
            totalTable[digitIx] = 0;
          }
          if (table[digitIx][digit] == undefined) {
            table[digitIx][digit] = 0;
          }
          totalTable[digitIx]++;
          table[digitIx][digit]++;
        });
      }
      // console.log('value', value, 'digits', digits);
    });
    let html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td>';
    html += 'Digit';
    html += '</td>';
    for (let digitIx = 0; digitIx < maxLen; digitIx++) {
      html += '<td>';
      if (digitIx == 0) {
        html += '1st';
      } else if (digitIx == 1) {
        html += '2nd';
      } else if (digitIx == 2) {
        html += '3rd';
      } else {
        html += digitIx+1;
        html += 'th';
      }
      html += '</td>';
    }
    // for (let i = 0; i < 10; i++) {
    //   html += '<td>';
    //   html += i;
    //   html += '</td>';
    // }
    html += '</tr>';
    for (let digit = 0; digit < 10; digit++) {
      html += '<tr>';
      html += '<td>';
      html += digit;
      html += '</td>';
      for (let digitIx = 0; digitIx < maxLen; digitIx++) {
        html += '<td>';
        const value = table[digitIx][digit];
        if (value !== undefined) {
          const valuePct = (value/totalTable[digitIx]).toFixed(1);
          let expectedValuePct;
          if (digitIx >= benfordsLawPct.length) {
            expectedValuePct = '0.1';
          } else {
            expectedValuePct = parseFloat(benfordsLawPct[digitIx][digit]).toFixed(1);
          }
          html += value;
          html += '&nbsp;';

          if (Math.abs(valuePct - expectedValuePct) <= 0.2) {
            html += '<span>';
            html += `${valuePct}~=${expectedValuePct}`;
            html += '</span>';
          } else {
            html += '<span style="background:pink;">';
            html += `${valuePct}!=${expectedValuePct}`;
            html += '</span>';
          }
        }
        html += '</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  };

  chartDatas.sort((chartData0, chartData1) => {
    const value0 = getValue(chartData0);
    const value1 = getValue(chartData1);
    return value1-value0;
  });
  virusChartHTML += '<table class="w100pct">';
  virusChartHTML += '<tr class="w100pct">';
  chartDatas.forEach((chartData, ix) => {
    virusChartHTML += '<td class="w20pct">';
    virusChartHTML += '<strong>';
    virusChartHTML += chartData.datasets[0].label + ':' + getValue(chartData);
    virusChartHTML += '</strong>';
    // virusChartHTML += getBenfordsLawTable(chartData.cols);
    // virusChartHTML += getBenfordsLawTable(chartData.datasets[0].data);
    // virusChartHTML += '<div style="position: relative; height:16vh; width:16vw;">';
    virusChartHTML += '<div style="position: relative; height:30vh; width:30vw;">';
    virusChartHTML += `<canvas id="virusCanvas${ix}" class="w100pct"></canvas>`;
    virusChartHTML += '</div>';
    virusChartHTML += '</td>';
    if (ix % 3 == 2) {
      virusChartHTML += '</tr>';
      virusChartHTML += '<tr class="w100pct">';
    }
  });
  virusChartHTML += '</tr>';
  virusChartHTML += '</table>';
  virusChartElt.innerHTML = virusChartHTML;

  Chart.pluginService.register({
    beforeDraw: function(chart, easing) {
      if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
        const ctx = chart.chart.ctx;
        const chartArea = chart.chartArea;

        ctx.save();
        ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
        // ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        ctx.fillRect(0, 0, chartArea.right, chartArea.bottom);
        ctx.restore();
      }
    },
  });

  chartDatas.forEach((chartData, ix) => {
    const virusCanvasElt = document.querySelector(`#virusCanvas${ix}`);
    addDefaultBollingerBands(chartData, chartData.datasets[0].label);
    // chartData.datasets[0].yAxisID = 'cases';
    const ctx = virusCanvasElt.getContext('2d');
    const chart = new Chart(ctx, getChartConfig(chartData));
  });
};
