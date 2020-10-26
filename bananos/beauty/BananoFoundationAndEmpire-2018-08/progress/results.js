const addChildText = (parent, childText) => {
    const node = document.createTextNode(childText);
    parent.appendChild(node);
    return node;
}

const addChildElement = (parent, childType, childText, dataTypeVisiter) => {
    const child = document.createElement(childType);
    parent.appendChild(child);
    if (childText !== undefined) {
      if(dataTypeVisiter === undefined) {
        child.appendChild(document.createTextNode(childText));
      } else {
        child.appendChild(dataTypeVisiter(childText));
      }
    }
    return child;
}


const loadJsonTable = (parentEltId, url, dataTypeVisiters) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadJsonTableCallback(parentEltId, this.response, dataTypeVisiters);
        }
    }
    xhttp.responseType = 'json';
    xhttp.open('GET', url, true);
    xhttp.send();
}

const loadJsonTableCallback = (parentEltId, json, dataTypeVisiters) => {
    const banano = document.getElementById(parentEltId);

    const table = addChildElement(banano, 'table');

    const tableHeaderRow = addChildElement(table, 'tr');

    if (json.length == 0) {
        return;
    }

    for (const [key, value] of Object.entries(json[0])) {
        addChildElement(tableHeaderRow, 'th', key);
    }

    json.forEach((jsonElt, jsonEltIx) => {
        const tableDataRow = addChildElement(table, 'tr');
        for (const [key, value] of Object.entries(jsonElt)) {
            addChildElement(tableDataRow, 'td', value, dataTypeVisiters[key]);
        }
    });
}