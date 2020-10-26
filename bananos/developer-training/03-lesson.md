# Lesson Three, simple index.html

## 3.1 - in your github pages site, add an index.html with the following code:
```html
    <!DOCTYPE html>
    <html>
    <meta charset="utf-8" />
    <head>
    <title>Banano</title>
    </head>
    <body onload="onLoad();">
      <div id="banano"></div>
      <script>
          function onLoad () {
            document.getElementById('banano').innerHTML = 'Coranos Bananos';
          }
        </script>
    </body>
    </html>
```

## 3.2 - update this page with a link to your Github Pages

If you are not in your gh-pages repository, go into the repository folder:
```
cd git;
cd <username>.github.io;
```

(If you used atom to add the file, instead of the website, add the new file to git):
```
git add index.html
```

then commit the changes.
```
git pull;git commit -a -m "updated index.html";git push;
```

