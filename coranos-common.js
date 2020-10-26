const hide = (id) => {
  document.getElementById(id).style = 'display:none;';
}

const show = (id) => {
  document.getElementById(id).style = 'display:block;';
}

const html = (id, html) => {
  const elt = document.getElementById(id);
  if (html !== undefined) {
    elt.innerHTML = html;
  }
  return elt.innerHTML;
}

const class_attr = (id, cl) => {
  const elt = document.getElementById(id);
  if (cl !== undefined) {
    elt.className = cl;
  }
  return elt.className;
}

const value = (id, value) => {
  const elt = document.getElementById(id);
  if (value !== undefined) {
    elt.value = value;
  }
  return elt.value;
}

const xlink_href = (id, value) => {
  const elt = document.getElementById(id);
  if (elt == null) {
    return null;
  }
  // console.log('xlink_href',id,value,elt);
  if (value !== null) {
    elt.setAttribute('xlink:href', value);
  }
  return elt.getAttribute('xlink:href');
}

// fill in the URL parameters into the form.
const fillInUrlParameters = () => {
  const url = new URL(window.location.href);
  url.searchParams.forEach((value, name) => {
    // console.log('nv',name,value);
    const fields = document.getElementsByName(name);
    fields.forEach((field) => {
      // console.log('set',field.name,field.id,value);
      field.value = value;
    });
  });
}


const addChildElement = (parent, childType, childText, styleCallback) => {
  const child = document.createElement(childType);
  
  parent.appendChild(child);
  if (childText !== undefined) {
    if (childText instanceof HTMLImageElement) {
      child.appendChild(childText);
    } else if (childText instanceof Object) {
      createTableInElt(child, childText, styleCallback);
    } else {
      child.appendChild(document.createTextNode(childText));
    }
  }

  if(styleCallback != undefined) {
    styleCallback(child);
  }

  return child;
}

const createTable = (id, json, styleCallback) => {
  const elt = document.getElementById(id);
  createTableInElt(elt, json, styleCallback);
}

const createTableInElt = (elt, json, styleCallback) => {
  if (json.length == 0) {
    return;
  }

  while (!(json[0] instanceof Object)) {
    const child = json.shift();
    elt.appendChild(document.createTextNode(child));
  }

  const table = addChildElement(elt, 'table', undefined, styleCallback);

  table.className = 'cb w100pct';

  const tableHeaderRow = addChildElement(table, 'tr', undefined, styleCallback);
  tableHeaderRow.className = 'cb';

  const keys = [];
  
  for (const [key, value] of Object.entries(json[0])) {
    const tableDataHeader = addChildElement(tableHeaderRow, 'th', key, styleCallback);
    tableDataHeader.className = 'cb';
    keys.push(key);
  }

  json.forEach((jsonElt, jsonEltIx) => {
    const tableDataRow = addChildElement(table, 'tr');
    tableDataRow.className = 'cb';
    keys.forEach((key) => {
      const value = jsonElt[key];
      const tableDataCell = addChildElement(tableDataRow, 'td', value, styleCallback);
      tableDataCell.className = 'cb';
    });
  });
}

const loadJson = (url, callback) => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.response));
    }
  }
  xhttp.responseType = 'text';
  xhttp.open('GET', url, true);
  xhttp.send();
}
