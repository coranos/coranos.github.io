# Lesson Six, loading data from JSON

Read up about json in the javascript reference on the main developer training page.

## 6.1 - On your gh-pages site add a new file called index.json with the following contents.
```json
[
	{
		"id": 1,
		"name": "Alpha"
	},
	{
		"id": 2,
		"name": "Beta"
	}
]
```

## 6.2 - On your gh-pages site in index.html, replace the contents of the <script> </script> with the contents below, this will load the json as a table.
```html
<!DOCTYPE html>
<body onload="onLoad();">
  <div id="banano"></div>
    <script>
      const addChildText = (parent,childText) => {
        const node = document.createTextNode(childText);
        parent.appendChild(node);
        return node;
      }
  
      const addChildElement = (parent,childType,childText) => {
        const child = document.createElement(childType);
        parent.appendChild(child);
        if(childText !== undefined) {
          child.appendChild(document.createTextNode(childText));
        }
        return child;
      }
  
      const loadJson = () => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            loadJsonCallback(this.response);
          }
        }
        xhttp.responseType = 'json';
        xhttp.open('GET', 'index.json', true);
        xhttp.send();
      }

      const loadJsonCallback = (json) => {
        const banano = document.getElementById('banano');
        
        addChildText(banano, 'Coranos Bananos');

        const table = addChildElement(banano,'table');
        
        const tableHeaderRow = addChildElement(table,'tr');

        if(json.length == 0) {
          return;
        }
        
        for (const [key, value] of Object.entries(json[0])) {
          addChildElement(tableHeaderRow,'th',key);
        }
        
        json.forEach((jsonElt,jsonEltIx) => {
          const tableDataRow = addChildElement(table,'tr');
          for (const [key, value] of Object.entries(jsonElt)) {
            addChildElement(tableDataRow,'td',value);
          }
        });
      }

      const onLoad = () => {
        loadJson();
      }
    </script>
</body>
</html>
```

if the page does not load as expected, check the browser's javascript console with `Ctrl + Shift + J`
