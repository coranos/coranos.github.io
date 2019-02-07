# Lesson Eight, making games

Read up about json in the javascript reference on the main developer training page.

## 8.1 On your gh-pages site add a new file called game.html, copy the content from this url:
[https://github.com/coranos/coranos.github.io/blob/master/game.html]

## 8.2 On your gh-pages site add a new file called game.js, copy the content from this url:
[https://github.com/coranos/coranos.github.io/blob/master/game.js]

## 8.3 On your gh-pages site add a new file called index.css, copy the content from this url:
[https://github.com/coranos/coranos.github.io/blob/master/index.css]

open game.html in a browser, confirm the game is working.

change the colors and styles to make the game look nice.

if the page does not load as expected, check the browser's javascript console with `Ctrl + Shift + J`

## 8.4 things to look and learn

the algorithm is described here: https://bananobet.com/provability

1. press play. look at the hash for bet number 2. it should be 41d53.  
2. change nonce to 2, press play, and look at the hash for bet number 2. is it the same?  
3. if you change the nonce, does it change the hashes, or just remove some from the top of the list?  
4. if you change the client seed or server seed, does it change the hashes?  
5. pick a change of winning. does the same hash show up regardless of the chance of winning?  
what does this tell you about about the bets? Are they left to chance, or always the same?  

6. look at 100 bets and all 5 chances to win. look at the profit. what is the most profitable chance to win?  
Should anything be changed because of this?

7. look at 10,000 bets and all 5 chances to win. look at the profit. what is the most profitable chance to win?  
Should anything be changed because of this?
