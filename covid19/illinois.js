const illinoisData = [
  {
    'date': '2020-03-18',
    'tested': 1500,
    'positive': 273,
    'illinois_dead': 1,
    'italy_dead': 3,
  },
  {
    'date': '2020-03-19',
    'tested': 2052,
    'positive': 418,
    'illinois_dead': 4,
    'italy_dead': 7,
  },
  {
    'date': '2020-03-20',
    'tested': 4286,
    'positive': 585,
    'illinois_dead': 5,
    'italy_dead': 10,
  },
  {
    'date': '2020-03-21',
    'tested': 6247,
    'positive': 753,
    'illinois_dead': 6,
    'italy_dead': 12,
    'hubei_dead': 17,
  },
  {
    'date': '2020-03-22',
    'tested': 8374,
    'positive': 1049,
    'illinois_dead': 9,
    'italy_dead': 17,
    'hubei_dead': 24,
  },
  {
    'date': '2020-03-23',
    'tested': 9868,
    'positive': 1285,
    'illinois_dead': 12,
    'italy_dead': 21,
    'hubei_dead': 40,
  },
  {
    'date': '2020-03-24',
    'tested': 11485,
    'positive': 1535,
    'illinois_dead': 16,
    'italy_dead': 29,
    'hubei_dead': 52,
  },
  {
    'date': '2020-03-25',
    'tested': 14209,
    'positive': 1865,
    'illinois_dead': 19,
    'italy_dead': 34, // 2020-03-01
    'hubei_dead': 76,
  },
  {
    'date': '2020-03-26',
    'tested': 16631,
    'positive': 2538,
    'illinois_dead': 26,
    'italy_dead': 52,
    'hubei_dead': 125,
  },
  {
    'date': '2020-03-27',
    'tested': 21542,
    'positive': 3026,
    'illinois_dead': 34,
    'italy_dead': 79,
    'hubei_dead': 125,
  },
  {
    'date': '2020-03-28',
    'tested': 25429,
    'positive': 3491,
    'illinois_dead': 47,
    'italy_dead': 107,
    'hubei_dead': 162,
  },
  {
    'date': '2020-03-29',
    'tested': 27762,
    'positive': 4596,
    'illinois_dead': 65,
    'italy_dead': 148,
    'hubei_dead': 204,
  },
  {
    'date': '2020-03-30',
    'tested': 30446,
    'positive': 5057,
    'illinois_dead': 73,
    'italy_dead': 197,
    'hubei_dead': 249,
  },
  {
    'date': '2020-03-31',
    'tested': 35225,
    'positive': 5994,
    'illinois_dead': 99,
    'italy_dead': 233,
    'hubei_dead': 350,
  },
  {
    'date': '2020-04-01',
    'tested': 40384,
    'positive': 6980,
    'illinois_dead': 141,
    'italy_dead': 366,
    'hubei_dead': 414,
  },
  {
    'date': '2020-04-02',
    'tested': 43656,
    'positive': 7695,
    'illinois_dead': 157,
    'italy_dead': 463,
    'hubei_dead': 479,
  },
  {
    'date': '2020-04-03',
    'tested': 48048,
    'positive': 8904,
    'illinois_dead': 210,
    'italy_dead': 631,
    'hubei_dead': 549,
  },
  {
    'date': '2020-04-04',
    'tested': 53581,
    'positive': 10357,
    'illinois_dead': 243,
    'italy_dead': 827,
    'hubei_dead': 618,
  },
  {
    'date': '2020-04-05',
    'tested': 58983,
    'positive': 11256,
    'illinois_dead': 274,
    'italy_dead': 1000,
    'hubei_dead': 699,
  },
  {
    'date': '2020-04-06',
    'tested': 62942,
    'positive': 12262,
    'illinois_dead': 307,
    'italy_dead': 1266,
    'hubei_dead': 780,
  },
  {
    'date': '2020-04-07',
    'tested': 68732,
    'positive': 13549,
    'illinois_dead': 380,
    'italy_dead': 1441,
    'hubei_dead': 871,
  },
  {
    'date': '2020-04-08',
    'tested': 75066,
    'positive': 15078,
    'illinois_dead': 462,
    'italy_dead': 1809,
    'hubei_dead': 974,
  },
  {
    'date': '2020-04-09',
    'tested': 80857,
    'positive': 16422,
    'illinois_dead': 528,
    'italy_dead': 2158,
    'hubei_dead': 1068,
  },
  {
    'date': '2020-04-10',
    'tested': 87527,
    'positive': 17887,
    'illinois_dead': 596,
    'italy_dead': 2503,
    'hubei_dead': 1310,
  },
  {
    'date': '2020-04-11',
    'tested': 92779,
    'positive': 19180,
    'illinois_dead': 677,
    'italy_dead': 2978,
    'hubei_dead': 1457,
  },
  {
    'date': '2020-04-12',
    'tested': 100735,
    'positive': 20852,
    'illinois_dead': 720,
    'italy_dead': 3405,
    'hubei_dead': 1596,
  },
  {
    'date': '2020-04-13',
    'tested': 105768,
    'positive': 22025,
    'illinois_dead': 794,
    'italy_dead': 4032,
    'hubei_dead': 1696,
  },
  {
    'date': '2020-04-14',
    'tested': 110616,
    'positive': 23247,
    'illinois_dead': 868,
    'italy_dead': 4825,
    'hubei_dead': 1789,
  },
  {
    'date': '2020-04-15',
    'tested': 116929,
    'positive': 24593,
    'illinois_dead': 948,
    'italy_dead': 5476,
    'hubei_dead': 1921,
  },
  {
    'date': '2020-04-16',
    'tested': 122589,
    'positive': 25733,
    'illinois_dead': 1072,
    'italy_dead': 6077,
    'hubei_dead': 2029,
  },
  {
    'date': '2020-04-17',
    'tested': 130163,
    'positive': 27575,
    'illinois_dead': 1134,
    'italy_dead': 6820,
    'hubei_dead': 2144,
  },
];

const NUMBER_PATTERN = new RegExp('^\\d+$');

const getIllinoisChartConfig = (chartData) => {
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
        text: 'IL Persons Under Investigation (PUI) for COVID-19',
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
            labelString: 'Date',
          },
        }],
        yAxes: [{
          stacked: false,
          id: 'deaths',
          position: 'right',
          // type: 'logarithmic',
          // ticks: {
          //      min: 0.1, //minimum tick
          //      // max: 100000, //maximum tick
          //      max: 1000, //maximum tick
          //      callback: function (value, index, values) {
          //          return Number(value.toString());
          //          //pass tick values as a string into Number function
          //      }
          // },
          // afterBuildTicks: function (chartObj) {
          //   //Build ticks labelling as per your need
          //     chartObj.ticks = [];
          //     chartObj.ticks.push(0.1);
          //     chartObj.ticks.push(1);
          //     chartObj.ticks.push(10);
          //     chartObj.ticks.push(100);
          //     chartObj.ticks.push(1000);
          //     // chartObj.ticks.push(10000);
          //     // chartObj.ticks.push(100000);
          // },
          scaleLabel: {
            display: true,
            labelString: 'New Deaths Per Day per person per 100 square miles',
          },
        }, {
          stacked: false,
          id: 'cases',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'New Cases Per Day',
          },
        }],
      },
    },
  };
  return chartConfig;
};

const loadIllinois = async () => {
  // const hubeiPop =  58.5 million;
  // const italyPop = 60.48 million;
  // const illinoisPop = 12.74 million;
  const hubeiDensity = 820 / 100; //people per mi2;
  const italyDensity = 532 / 100; //people per mi2;
  const illinoisDensity = 230 / 100; //people per mi2;

  const chartData = {};
  chartData.labels = [];
  chartData.datasets = [];
  const newDataSet = (_yaxis, _label, _borderColor) => {
    const dataSet = {};
    dataSet.label = _label;
    dataSet.data = [];
    dataSet.borderColor = _borderColor;
    dataSet.backgroundColor = '#FFF';
    dataSet.steppedLine = false;
    dataSet.fill = false;
    dataSet.type = 'line';
    dataSet.yAxisID = _yaxis;
    chartData.datasets.push(dataSet);
    return dataSet;
  };

  // console.log(data)
  const datasetByName = {};
  datasetByName.tested = newDataSet('cases', 'IL Tested', '#00F');
  datasetByName.positive = newDataSet('cases', 'IL Positive', '#F70');
  datasetByName.illinois_dead = newDataSet('deaths', 'Illinois Dead', '#777');
  datasetByName.italy_dead = newDataSet('deaths', 'Italy Dead', '#D77');
  datasetByName.hubei_dead = newDataSet('deaths', 'Hubei Dead', '#7D7');

  const convertToDelta = (array) => {
    let prev;
    for (let ix = 0; ix < array.length; ix++) {
      if (ix == 0) {
        prev = array[ix];
        array[ix] = array[ix].toFixed(2);
      } else {
        const delta = array[ix] - prev;
        prev = array[ix];
        if(delta == 0) {
          array[ix] = undefined;
        } else {
          array[ix] = delta.toFixed(2);
        }
      }
    }
  };

  illinoisData.forEach((dataElt) => {
    chartData.labels.push(dataElt.date);
    if (NUMBER_PATTERN.test(dataElt.tested)) {
      datasetByName.tested.data.push(dataElt.tested);
    }
    if (NUMBER_PATTERN.test(dataElt.positive)) {
      datasetByName.positive.data.push(dataElt.positive);
    }
    if (NUMBER_PATTERN.test(dataElt.illinois_dead)) {
      datasetByName.illinois_dead.data.push(dataElt.illinois_dead / illinoisDensity);
    }
    datasetByName.italy_dead.data.push(dataElt.italy_dead / italyDensity);
    datasetByName.hubei_dead.data.push(dataElt.hubei_dead / hubeiDensity);
  });

  chartData.datasets.forEach((dataSet) => {
    convertToDelta(dataSet.data);
  });

  const illinoisChartElt = document.querySelector('#illinoisChart');
  let illinoisChartHTML = '';
  const getValue = (chartData) => {
    return chartData.datasets[0].data[chartData.datasets[0].data.length-1];
  };
  illinoisChartHTML += '<div style="position: relative; height:60vh; width:60vw;">';
  illinoisChartHTML += `<canvas id="illinoisCanvas" class="w100pct"></canvas>`;
  illinoisChartHTML += '</div>';
  illinoisChartElt.innerHTML = illinoisChartHTML;

  const illinoisCanvasElt = document.querySelector(`#illinoisCanvas`);
  const ctx = illinoisCanvasElt.getContext('2d');
  const chart = new Chart(ctx, getIllinoisChartConfig(chartData));
};
