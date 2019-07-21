importScripts('../../js-lib/json-table-worker.js');
importScripts('../../js-lib/json-table.js');
importScripts('../../js-lib/workerFakeDOM.js');
importScripts('../../js-lib/jquery-3.2.1.js');

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function padToTwo (number) {
  if (number <= 99) {
    number = ("0" + number).slice(-2);
  }
  return number;
}
function formatDate (date) {
  var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return year + "_" + monthNames[monthIndex] + "_" + padToTwo(day);
}

function preprocess (response) {
  let data = response.results;
  let neo_running_total = 0;
  let neo_total = 0;
  let gas_running_total = 0;
  let gas_total = 0;

  var gasData = data.slice();
  var neoData = data.slice();
  var claimData = data.slice();

  response.gasData = gasData;
  response.neoData = neoData;
  response.claimData = claimData;

  gasData.sort(function (a, b) {
    return b.gas - a.gas;
  });

  neoData.sort(function (a, b) {
    return b.neo - a.neo;
  });

  claimData.sort(function (a, b) {
    return b.claim_tx - a.claim_tx;
  });

  for (let i = 0; i < data.length; i++) {
    neo_total += data[i].neo;
    gas_total += data[i].gas;
  }

  for (let i = 0; i < claimData.length; i++) {
    let claim_tx = claimData[i].claim_tx;
    claimData[i].claim_tx_rank = i + 1;
  }

  for (let i = 0; i < gasData.length; i++) {
    let gas = gasData[i].gas;
    gasData[i].gasRank = i + 1;
    gas_running_total += gas;
    let gas_percent_of_total = ((gas_running_total * 100) / gas_total);
    gasData[i].gas = gas;
    gasData[i].gas_running_total = gas_running_total.toFixed(2);
    gasData[i].gas_percent_of_total = gas_percent_of_total.toFixed(2) + "%";
  }

  for (let i = 0; i < neoData.length; i++) {
    neoData[i].neoRank = i + 1;
    let neo = neoData[i].neo;
    neo_running_total += neo;
    let neo_percent_of_total = ((neo_running_total * 100) / neo_total);
    neoData[i].neo = numberWithCommas(neo);
    neoData[i].neo_running_total = neo_running_total.toFixed(2);
    neoData[i].neo_percent_of_total = neo_percent_of_total.toFixed(2) + "%";
  }

  for (let i = 0; i < data.length; i++) {
    data[i].neo_tx = numberWithCommas(data[i].neo_tx);
    data[i].gas_tx = numberWithCommas(data[i].gas_tx);
    data[i].neo_in = data[i].neo_in.toFixed(2);
    data[i].neo_out = data[i].neo_out.toFixed(2);
    data[i].gas_in = data[i].gas_in.toFixed(2);
    data[i].gas_out = data[i].gas_out.toFixed(2);

    data[i].gas_dx = (data[i].gas_in - data[i].gas_out).toFixed(2);
    data[i].neo_dx = (data[i].neo_in - data[i].neo_out).toFixed(2);
    if (data[i].first_ts == 0) {
      data[i].first_ts = "Low Value";
    } else {
      data[i].first_ts = formatDate(new Date(data[i].first_ts * 1000));
    }
    if (data[i].last_ts == 0) {
      data[i].last_ts = "Low Value";
    } else {
      data[i].last_ts = formatDate(new Date(data[i].last_ts * 1000));
    }
  }
}
onmessage = function (e) {
  return jsonTableCallbackToWorkerJsonArray(e, preprocess);
}
