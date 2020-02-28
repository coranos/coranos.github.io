const styleCallback = (elt) => {
  if(elt.innerText == 'SUCCEEDED') {
    elt.parentElement.style.backgroundColor = '#7F7';
  } else if(elt.innerText == 'NOT STARTED') {
    elt.parentElement.style.backgroundColor = '#AAA';
  } else if(elt.innerText == 'RUNNING') {
    elt.parentElement.style.backgroundColor = '#77F';
  }
}

const callback = (response) => {
  createTable('roadmap', response, styleCallback);
}

const onLoad = () => {
  loadJson('roadmap.json', callback);
}
