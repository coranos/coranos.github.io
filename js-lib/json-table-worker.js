let dataArray = [];
let gasArray = [];
let neoArray = [];
let jsonArrayDate = undefined;

function jsonTableCallbackToWorkerJsonObject (e) {
  // console.log("worker called : " + e.data.source);
  $.ajaxSetup({
    beforeSend : function (xhr) {
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType("application/json");
      }
    }
  });
  $.getJSON(e.data.source, function (response) {
    let data = response.results;

    // console.log("worker callback called : " + JSON.stringify(data));

    for (key in data) {
      let miniResponse = {};
      miniResponse.date = response.date;
      miniResponse.results = {};
      miniResponse.results[key] = data[key];
      // console.log("worker calling back to main page : " +
      // JSON.stringify(miniResponse));
      postMessage(miniResponse);
    }
  });
};

function jsonTableCallbackToWorkerJsonArray (e, preprocess) {
  // console.log("worker called : " + e.data.source);
  $.ajaxSetup({
    beforeSend : function (xhr) {
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType("application/json");
      }
    }
  });
  if (e.data.source !== undefined) {
    $.getJSON(e.data.source, function (response) {
      if (typeof preprocess == "function") {
        preprocess(response);
      }

      dataArray = response.results;
      gasArray = response.gasData;
      neoArray = response.neoData;
      claimArray = response.claimData;

      jsonArrayDate = response.date;

      if (e.data.startIx == undefined) {
        e.data.startIx = 0;
      }
      if (e.data.endIx == undefined) {
        e.data.endIx = dataArray.length;
      }

      sendResponses(e);
    });
  } else {
    sendResponses(e);
  }
};

function sendResponses (e) {

  // console.log("worker callback called sendResponses : " +
  // JSON.stringify(e.data));

  if (e.data.address != undefined) {
    for (var i = 0; i < dataArray.length; i++) {
      if (dataArray[i].account == e.data.address) {
        let miniResponse = {};
        miniResponse.date = jsonArrayDate;
        miniResponse.ix = i;
        miniResponse.results = [];
        miniResponse.results.push(dataArray[i]);
        // console.log("worker calling back to main page : " +
        // JSON.stringify(miniResponse));
        postMessage(miniResponse);
      }
    }
    return;
  }

  var data = dataArray;
  if (e.data.sort == undefined) {
  } else if (e.data.sort == "GAS") {
    data = gasArray;
  } else if (e.data.sort == "NEO") {
    data = neoArray;
  } else if (e.data.sort == "GAS_CLAIM") {
    data = claimArray;
  }

  var startIx = e.data.startIx;
  var endIx = e.data.endIx;

  for (var i = startIx; (i < data.length) && (i < endIx); i++) {
    let miniResponse = {};
    miniResponse.date = jsonArrayDate;
    miniResponse.results = [];
    miniResponse.results.push(data[i]);
    // console.log("worker calling back to main page : " +
    // JSON.stringify(miniResponse));
    postMessage(miniResponse);
  }
};
