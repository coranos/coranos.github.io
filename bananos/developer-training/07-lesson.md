# Lesson Seven, making charts from JSON data

Read up about json in the javascript reference on the main developer training page.

## 7.1 - On your gh-pages site add a new file called trades.json

## 7.2 download the Banano trade history JSON from the below URL and put it in trades.json.
```
http://bbdevelopment.website:8000/trade?start=2018-01-01T00:00:00&end=2018-09-08T00:00:00
```

## 7.3 On your gh-pages site add a new file called trades.js with the following content, which will help load the data as a graph:
```
const loadJson = (url,callback) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.response);
      }
    }
    xhttp.responseType = 'json';
    xhttp.open('GET', url, true);
    xhttp.send();
  }

var priceChartConfig = {
  type : 'bar',
  data : {},
  options : {
    spanGaps : true,
    legend : {
      position : 'top',
      display : true
    },
    responsive : true,
    title : {
      display : true,
      text : 'Chart'
    },
    tooltips : {
      mode : 'index',
    },
    hover : {
      mode : 'index'
    },
    scales : {
      xAxes : [ {
        scaleLabel : {
          display : true,
          labelString : 'date'
        }
      } ],
      yAxes : [ {
        stacked : false,
        id : 'nano',
        position : 'left',
        scaleLabel : {
          display : true,
          labelString : 'nano'
        }
      }, {
        stacked : false,
        id : 'banano',
        position : 'left',
        scaleLabel : {
          display : true,
          labelString : 'banano'
        }
      }, {
        stacked : true,
        id : 'transactions',
        position : 'right',
        scaleLabel : {
          display : true,
          labelString : 'transactions'
        }
      }, {
        stacked : false,
        id : 'ratio',
        position : 'right',
        scaleLabel : {
          display : true,
          labelString : 'ratio'
        }
      } ]
    }
  }
};

function callback (response) {
  const data = {};
  data.labels = [];
  data.datasets = [];
  const txDs = {};
  const nanosDs = {};
  const bananosDs = {};

  txDs.label = 'transactions';
  nanosDs.label = 'nano';
  bananosDs.label = 'banano';

  txDs.hidden = false;
  nanosDs.hidden = true;
  bananosDs.hidden = false;

  txDs.borderColor = '#000000';
  nanosDs.borderColor = '#7777AA';
  bananosDs.borderColor = '#AAAA00';

  data.datasets.push(txDs);
  data.datasets.push(nanosDs);
  data.datasets.push(bananosDs);

  for (let ix = 0; ix < data.datasets.length; ix++) {
    data.datasets[ix].data = [];
    data.datasets[ix].backgroundColor = 'rgb(255,255,255)';
    data.datasets[ix].steppedLine = false;
    data.datasets[ix].fill = false;
    data.datasets[ix].type = 'line';
    data.datasets[ix].yAxisID = data.datasets[ix].label;
  }

  priceChartConfig.data = data;

  const eltByDate = {};

  let lastIx = 0;

  response.data = response.data.reverse();

  for (let ix = 0; ix < response.data.length; ix++) {
    const elt = response.data[ix];
    const date = elt.date.substring(0, 10);

    if (eltByDate[date] == undefined) {
      // console.log('new date', ix, date);
      eltByDate[date] = lastIx;
      lastIx++;
    } else {
      // console.log('old date', ix, date, eltByDate[date]);
    }

    const dataIx = eltByDate[date];

    // console.log('date ix', date, dataIx);

    if (data.labels[dataIx] == undefined) {
      // console.log('new label', dataIx, date);
      data.labels[dataIx] = date;
    }

    if (txDs.data[dataIx] == undefined) {
      txDs.data[dataIx] = 0;
    }

    if (nanosDs.data[dataIx] == undefined) {
      nanosDs.data[dataIx] = 0;
    }

    if (bananosDs.data[dataIx] == undefined) {
      bananosDs.data[dataIx] = 0;
    }

    txDs.data[dataIx]++;
    nanosDs.data[dataIx] += elt.nano;
    bananosDs.data[dataIx] += elt.banano;
  }

  for (let ix = 0; ix < data.labels.length; ix++) {
    nanosDs.data[ix] /= 1000000;
  }

  // console.log(priceChartConfig.data);

  var ctx = document.getElementById('price-canvas').getContext('2d');
  window.myLine = new Chart(ctx, priceChartConfig);
}

window.onload = function () {
  loadJson('trades.json', callback);
};
```

## 7.4 On your gh-pages site add a new file called trades.html with the following content, which will load the data as a graph:
```
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Banano Trades</title>
<style>
canvas {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
</head>
<body>
  <div style="width: 100%;">
    <canvas id="price-canvas"></canvas>
  </div>
  <script src="https://coranos.github.io/js-lib/chart-2.6.0.js"></script>
  <script src="trades.js"></script>
</body>
</html>

```


if the page does not load as expected, check the browser's javascript console with `Ctrl + Shift + J`
