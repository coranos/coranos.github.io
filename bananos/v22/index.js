const loadJson = async (urls) => {
  const responses = [];
  for (let urlIx =0; urlIx < urls.length; urlIx++) {
    const url = urls[urlIx];
    const response = await fetch(url);
    const responseJson = await response.json();
    responses.push(responseJson);
  }
  callback(responses);
};

const chartConfig = {
  type: 'bubble',
  data: {},
  options: {
    // spanGaps: true,
    legend: {
      position: 'top',
      display: true,
    },
    responsive: true,
    title: {
      display: true,
      text: 'Chart',
    },
    tooltips: {
      mode: 'index',
    },
    hover: {
      mode: 'index',
    },
    scales: {
      xAxes: [{
        // stacked: false,
        id: 'block_count',
        scaleLabel: {
          display: true,
          labelString: 'block_count',
        },
      }],
      yAxes: [{
        // type: 'logarithmic',
        // stacked: false,
        id: 'open_link_height',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'open_link_height',
        },
      },
       {
        // type: 'logarithmic',
        // stacked: false,
        id: 'open_link_seconds',
        position: 'right',
        scaleLabel: {
          display: true,
          labelString: 'open_link_seconds',
        },
      }],
    },
  },
};

const callback = (responses) => {
  const data = {};
  data.labels = [];
  data.datasets = [];

  const countDs = {};
  countDs.label = 'count_open_vs_block_count';
  countDs.borderColor = '#00FF00';
  countDs.yAxisID = 'open_link_height';

  const secondsDs = {};
  secondsDs.label = 'seconds_open_vs_block_count';
  secondsDs.borderColor = '#0000FF';
  countDs.yAxisID = 'open_link_seconds';

  data.datasets.push(countDs);
  data.datasets.push(secondsDs);

  for (let ix = 0; ix < data.datasets.length; ix++) {
    data.datasets[ix].data = [];
    data.datasets[ix].backgroundColor = 'rgb(255,255,255)';
    data.datasets[ix].hidden = false;
    // data.datasets[ix].steppedLine = false;
    // data.datasets[ix].fill = false;
    // data.datasets[ix].type = 'line';
    // data.datasets[ix].yAxisID = 'open_link_height';
  }

  chartConfig.data = data;

  for (let ix = 0; ix < responses[0].length; ix++) {
    const elt = responses[0][ix];
    elt.r = elt.count;
    elt.r = Math.min(10,elt.r);

    // data.labels[ix] = elt.x;
    countDs.data[ix] = elt;
  }
  for (let ix = 0; ix < responses[1].length; ix++) {
    const elt = responses[1][ix];
    elt.r = elt.seconds;
    elt.r = Math.min(10,elt.r);

    // data.labels[ix] = elt.x;
    secondsDs.data[ix] = elt;
  }

  // console.log(chartConfig.data);

  const ctx = document.getElementById('count-canvas').getContext('2d');
  window.myLine = new Chart(ctx, chartConfig);
};

window.onload = () => {
  loadJson(['tallyheights-count.json', 'tallyheights-seconds.json'], callback);
};
