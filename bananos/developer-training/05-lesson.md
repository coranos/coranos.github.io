# Lesson Five, tables in index.html, borders in index.css

Read up about tables in the html reference on the main developer training page.

Read up about borders in the css reference on the main developer training page.

## 5.1 - On your gh-pages site in index.html, under your list of links, add a html table.
```html
<!DOCTYPE html>
<html>
<meta charset="utf-8" />
<head>
<title>Banano</title>
<link rel="stylesheet" type="text/css" href="index.css">
</head>
<body onload="onLoad();">
  <div id="banano"></div>
  <ol>
    <li><img class="small_image" src="https://i.imgur.com/Remo7td.png" /></li>
  </ol>
  <table>
    <tr>
      <th>Id</th>
      <th>Name</th>
    </tr>
    <tr>
      <td>1</td>
      <td>Alpha</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Beta</td>
    </tr>
  </table>
  <script>
      function onLoad () {
        document.getElementById('banano').innerHTML = 'Coranos Bananos';
      }
    </script>
</body>
</html>
```

Commit the changes, using the commands you learned in lesson 3.2.

## 5.2 - On your gh-pages site in index.css, add border styling for your table, rows, header cells, and data cells.
```css
table, tr, td, th {
  border: solid;
  border-width: 0.5px;
  font-family: monospace;
}
```

Commit the changes, using the commands you learned in lesson 3.2.
