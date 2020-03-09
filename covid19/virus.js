
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

      const chartData = [];
      chartData.labels = [];
      chartData.datasets = [];
      const dataSet = {};
      dataSet.label = label;
      dataSet.data = [];
      dataSet.borderColor = '#777';
      dataSet.backgroundColor = '#FFF';
      dataSet.steppedLine = false;
      dataSet.fill = false;
      dataSet.type = 'line';
      dataSet.yAxisID = 'cases';

      let prev = 0;
      let started = false;
      cols.forEach((col, colIx) => {
        if (rowIx !== 0) {
          const confirmed = parseInt(col);
          const recovered = parseInt(recoveredCols[colIx]);
          const dead = parseInt(deadCols[colIx]);
          // const curr = confirmed;// confirmed - (recovered + dead);
          const curr = confirmed - (recovered + dead);
          if (curr !== 0) {
            if (!started) {
              chartData.labels.push(labels[colIx-1]);
              dataSet.data.push(0);
            }
            started = true;
          }
          if (started) {
            const diff = (curr - prev);
            // console.log(label, rowIx, colIx, 'c:', confirmed, 'r:', recovered, 'd:', dead, 'diff:', diff);
            if (diff !== 0) {
              chartData.labels.push(labels[colIx]);
              dataSet.data.push(diff);
            }
            prev = curr;
          }
        }
      });
      if (dataSet.data.length > 0) {
        chartDatas.push(chartData);
        chartData.datasets.push(dataSet);
      }
    }
  });

  const virusChartElt = document.querySelector('#virusChart');
  let virusChartHTML = '';
  const getValue = (chartData) => {
    return chartData.datasets[0].data[chartData.datasets[0].data.length-1];
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
