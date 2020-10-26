const backendUrl = 'https://waves-testing.coranos.cc';
// const backendUrl = 'http://localhost:9567';

const onLoad = () => {
  getNewSeed();
};

const toHexString = (byteArray) => {
  return Array.prototype.map.call(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
};

const getHelp = () => {
  const url = backendUrl + '/help';
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', url, true);
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        const json = JSON.parse(this.responseText);
        // console.log('getHelp','response',json);
        let html = '';
        Object.keys(json).forEach((key) => {
          html += `<h1>${key}</h1>`;
          html += json[key].description;
          // console.log('json[key]',key,json[key]);
          if(json[key].parameters !== undefined) {
            html += `<h2>Parameters</h2>`;
            Object.keys(json[key].parameters).forEach((parameter) => {
              html += `<h3>${parameter}</h3>`;
              html += json[key].parameters[parameter];
            });
          }
          html += `<hr>`;
        })
        const helpElt = document.querySelector('#help');
        helpElt.innerHTML = html;
      } else {
        console.log('getHelp','error',this.responseText);
      }
    }
  };
  xmlhttp.send();
  return false;
}

const get = (url, elt, parms) => {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', url, true);
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        const json = JSON.parse(this.responseText);
        const addressElt = document.querySelector('#address');
        let html = '';
        if(json.address !== undefined) {
          html += `Address:${json.address}<br>`;
        }
        if(json.message !== undefined) {
          html += `Message:${json.message}<br>`;
        }
        if(json.messages !== undefined) {
          json.messages.forEach((message) => {
            html += `Message:${message.message}<br>`;
          })
        }
        if(json['token-id'] !== undefined) {
          html += `Token ID:${json['token-id']}<br>`;
        }
        if(json['token-name'] !== undefined) {
          html += `Token Name:${json['token-name']}<br>`;
        }
        elt.innerHTML = html;
        console.log('get','url',url,'response',json);
      } else {
        console.log('get','url',url,'error',this.responseText);
      }
    }
  };
  if(parms == undefined) {
    parms = '';
  }
  const privateKeyElt = document.querySelector('#privateKey');
  const body = `{"unique-id":"${privateKeyElt.value}"${parms}}`;
  console.log('get','url',url,'body',body);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.send(body);
  return false;
}

const getAddress = () => {
  const url = backendUrl + '/address';
  const elt = document.querySelector('#address');
  get(url, elt);
  return false;
}

const getDepositInstructions = () => {
  const url = backendUrl + '/deposit';
  const elt = document.querySelector('#depositInstructions');
  get(url, elt);
  return false;
}

const setStakeEnabled = () => {
  const url = backendUrl + '/stake';
  const elt = document.querySelector('#stake');
  get(url, elt);
  return false;
}

const setStakeDisabled = () => {
  const url = backendUrl + '/remove-staking';
  const elt = document.querySelector('#remove-staking');
  get(url, elt);
  return false;
}

const getBalance = () => {
  const url = backendUrl + '/balance';
  const elt = document.querySelector('#balance');
  get(url, elt);
  return false;
}

const sendWaves = () => {
  const url = backendUrl + '/wsend';
  const elt = document.querySelector('#wsend');
  const addressElt = document.querySelector('#sendToAddress');
  const amountElt = document.querySelector('#sendToAmount');
  const parms = `,"amount":"${amountElt.value}","to-address":"${addressElt.value}"`;
  get(url, elt, parms);
  return false;
}

const withdraw = () => {
  const url = backendUrl + '/withdraw';
  const elt = document.querySelector('#withdraw');
  const addressElt = document.querySelector('#withdrawToAddress');
  const amountElt = document.querySelector('#withdrawToAmount');
  const tokenElt = document.querySelector('#withdrawToken');

  const parms = `,"amount":"${amountElt.value}","to-address":"${addressElt.value}","token-id":"${tokenElt.value}"`;
  get(url, elt, parms);
  get(url, elt);
  return false;
}

const getNewSeed = () => {
  const privateKeyElt = document.querySelector('#privateKey');
  const privateKeyArray = new Uint32Array(32);
  window.crypto.getRandomValues(privateKeyArray);
  const privateKeyValue = toHexString(privateKeyArray);
  privateKeyElt.value = privateKeyValue;
  return false;
};
