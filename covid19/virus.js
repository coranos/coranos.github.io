
const covid19DataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

const getChartConfig = (chartData) => {
  const chartConfig = {
    type: 'bar',
    data: chartData,
    options: {
      spanGaps: true,
      legend: {
        position: 'top',
        display: true,
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
            labelString: 'Cases',
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
  const data = await (await fetch(covid19DataUrl)).text();
  // console.log(data)
  const chartDatas = [];
  const rows = csvToArray(data);

  // console.log(rows.length)
  const labels = [];
  rows.forEach((cols, rowIx) => {
    if (cols.length > 0) {
      const state = cols.shift();
      const country = cols.shift();
      const latitude = cols.shift();
      const longitude = cols.shift();

      if (rowIx == 0) {
        cols.forEach((col) => {
          const date = new Date(col);
          const dateStr = date.toISOString().substring(0, 10);
          labels.push(dateStr);
        });
      }

      const chartData = [];
      chartData.labels = labels;
      chartData.datasets = [];
      const dataSet = {};
      dataSet.label = state + ':' + country;
      dataSet.data = [];
      dataSet.borderColor = '#777';
      dataSet.backgroundColor = '#FFF';
      dataSet.steppedLine = false;
      dataSet.fill = false;
      dataSet.type = 'line';
      dataSet.yAxisID = 'cases';

      cols.forEach((col) => {
        if (rowIx !== 0) {
          dataSet.data.push(parseInt(col));
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
  chartDatas.forEach((chartData, ix) => {
    // virusChartHTML += '<div style="position: relative; height:64vh; width:64vw">';
    virusChartHTML += '<h1>';
    virusChartHTML += chartData.datasets[0].label;
    virusChartHTML += '</h1>';
    virusChartHTML += `<canvas id="virusCanvas${ix}" class="w100pct"></canvas>`;
    // virusChartHTML += '</div>';
  });
  virusChartElt.innerHTML = virusChartHTML;
  chartDatas.forEach((chartData, ix) => {
    const virusCanvasElt = document.querySelector(`#virusCanvas${ix}`);
    const ctx = virusCanvasElt.getContext('2d');
    addDefaultBollingerBands(chartData, chartData.datasets[0].label);
    const chart = new Chart(ctx, getChartConfig(chartData));
  });
};
