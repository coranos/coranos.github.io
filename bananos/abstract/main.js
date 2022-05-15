const spriteSheets = [
  {name: 'eyes', dx: 0.5, dy: 0.4, align: 'center'},
  {name: 'hat', dx: 0.5, dy: 0.0, align: 'bottom'},
  {name: 'head', dx: 0.5, dy: 0.4, align: 'center'},
  {name: 'hand-item', dx: 0.2, dy: 0.85, align: 'center'},
  {name: 'body', dx: 0.5, dy: 0.9, align: 'top'},
  {name: 'tail', dx: 0.8, dy: 0.8, align: 'center'},
];

const PICTURE_SIZE = 128;

const BORDER = 'FFB6AAFF';
const TRANSPARENT = '00000000';
const BLACK = '000000FF';
const WHITE = 'FFFFFFFF';

// const PIXEL_TYPES = [
//   BORDER,
//   TRANSPARENT,
//   BLACK,
//   WHITE,
// ];

const COLORS = [
  'aqua', 'lime', 'silver',
  // 'black',
  'maroon', 'teal',
  'blue', 'navy',
  // 'white',
  'fuchsia', 'olive', 'yellow',
  'gray', 'purple',
  'green', 'red',
];

window.onLoad = async () => {
  await loadSpriteSheets();
  await generateNewMonkeys();
  show('generateMonkeys');
  show('toggleSpriteList');
};

window.guessWrong = async () => {
  alert('wrong!');
  const numberOfMonkeysElt = document.getElementById('numberOfMonkeys');
  const difficultyElt = document.getElementById('difficulty');
  numberOfMonkeysElt.value = 3;
  difficultyElt.value = 1;
  await generateNewMonkeys();
};

window.guessRight = async () => {
  alert('right!');
  const numberOfMonkeysElt = document.getElementById('numberOfMonkeys');
  const difficultyElt = document.getElementById('difficulty');
  const numberOfMonkeys = parseInt(numberOfMonkeysElt.value, 10);
  const difficulty = parseInt(difficultyElt.value, 10);
  if (difficulty < ((numberOfMonkeys-1)/2)) {
    difficultyElt.value = difficulty + 1;
  } else {
    difficultyElt.value = 1;
    numberOfMonkeysElt.value = numberOfMonkeys + 2;
  }
  await generateNewMonkeys();
};

window.toggleHideShowSpriteList = async () => {
  toggleHideShow('spriteList');
};

window.generateNewMonkeys = async () => {
  const numberOfMonkeys = getValueAndNormalize('numberOfMonkeys', true);
  const difficulty = getValueAndNormalize('difficulty', false,
      Math.floor((numberOfMonkeys-1)/2));

  // first, determine which sprite sheet will be the key sprite sheet.
  const keySpriteSheetName = getRandomArrayElt(spriteSheets).name;

  let innerHTML = `<h2>${numberOfMonkeys} Monkeys, the difference is ${keySpriteSheetName}</h2>`;
  // innerHTML += '<table>';
  // innerHTML += '<tr>';
  for (let monkeyIx = 0; monkeyIx < numberOfMonkeys; monkeyIx++) {
    innerHTML += '<div style="float:left;">';
    innerHTML += `<h3 id="monkey_${monkeyIx}_h3">${monkeyIx}</h3>`;
    innerHTML += `<canvas id="monkey_${monkeyIx}_canvas" width="${PICTURE_SIZE*2}" height="${PICTURE_SIZE*2}" style="border:1px solid"></canvas>`;
    innerHTML += '<br>';
    innerHTML += `<button id="monkey_${monkeyIx}_button" onclick="guessWrong();return false;">Guess ${monkeyIx}</button>`;
    innerHTML += '</div>';
  }
  // innerHTML += '</tr>';
  // innerHTML += '</table>';

  const generatedMonkeysElt = document.getElementById('generatedMonkeys');
  clear(generatedMonkeysElt);
  generatedMonkeysElt.innerHTML = innerHTML;

  // for a single monkey, for the key sprite sheet, the monkey will
  // have a unique sprite.
  // for all other monkeys, for the key sprite sheet, the monkey will
  // share a sprite with at least one other monkey.
  // for all other sprite sheets, each monkey will share a sprite with
  // at least one other monkey.

  // for the key sprite sheet, select (('numberOfMonkeys'+1)/2) random sprites.
  // so the key sprite sheet will have a different sprite for each monkey.
  const keySpriteCount = Math.floor((numberOfMonkeys+1)/2);
  // console.log('keySpriteCount',keySpriteCount);

  // for the non key sprite sheets, select 'difficulty' random sprites.
  // difficulty is at most (numberOfMonkeys-1)/2), so there will always be at least two monkeys with the same sprite, for the non key sprite sheets.
  const nonKeySpriteCount = difficulty;
  // console.log('nonKeySpriteCount',nonKeySpriteCount);

  const spriteSheetsSubset = [];
  for (let spriteSheetIx = 0; spriteSheetIx < spriteSheets.length; spriteSheetIx++) {
    const spriteSheet = spriteSheets[spriteSheetIx];
    const spriteSheetSubset = {};
    const keys = [...Object.keys(spriteSheet)];
    for (let keyIx = 0; keyIx < keys.length; keyIx++) {
      const key = keys[keyIx];
      spriteSheetSubset[key] = spriteSheet[key];
    }
    spriteSheetSubset.sprites = shuffle([...spriteSheet.sprites]);
    if (spriteSheetSubset.name == keySpriteSheetName) {
      spriteSheetSubset.sprites = spriteSheetSubset.sprites.slice(-keySpriteCount);
    } else {
      spriteSheetSubset.sprites = spriteSheetSubset.sprites.slice(-nonKeySpriteCount);
    }
    spriteSheetsSubset.push(spriteSheetSubset);
  }

  for (let monkeyIx = 0; monkeyIx < numberOfMonkeys; monkeyIx++) {
    const spriteTitleElt = document.getElementById(`monkey_${monkeyIx}_h3`);
    const spriteElt = document.getElementById(`monkey_${monkeyIx}_canvas`);
    const guessElt = document.getElementById(`monkey_${monkeyIx}_button`);
    let titleInnerHTML = '';
    const sprites = [];
    let maxW = 0;
    let maxH = 0;
    if (monkeyIx == ((numberOfMonkeys-1)/2)) {
      // guessElt.innerText = 'Guess Right';
      guessElt.onclick=() => {
        guessRight(); return false;
      };
    }
    for (let spriteSheetIx = 0; spriteSheetIx < spriteSheetsSubset.length; spriteSheetIx++) {
      const spriteSheet = spriteSheetsSubset[spriteSheetIx];
      const spriteIx = (monkeyIx + spriteSheetIx) % spriteSheet.sprites.length;
      const sprite = spriteSheet.sprites[spriteIx];

      titleInnerHTML += `${spriteSheet.name}:${spriteIx}(In All:${sprite.ix})<br>`;

      maxW = Math.max(maxW, sprite.w);
      maxH = Math.max(maxH, sprite.h);
      sprites.push(sprite);
    }
    sprites.reverse();
    const ctx = spriteElt.getContext('2d');
    const scale = Math.max(maxW, maxH);
    ctx.scale(PICTURE_SIZE/scale, PICTURE_SIZE/scale);

    for (let spriteIx = 0; spriteIx < sprites.length; spriteIx++) {
      const sprite = sprites[spriteIx];
      const dx = ((sprite.w - scale) / 2) - (scale * sprite.dx);
      const dy = ((sprite.h - scale) / 2) - (scale * sprite.dy);
      // console.log('sprite', sprite, dx, dy);
      ctx.translate(-dx, -dy);
      addSprite(ctx, sprite);
      ctx.translate(+dx, +dy);
    }
    spriteTitleElt.innerHTML = titleInnerHTML;
  }
  show('generatedMonkeys');
};

const getValueAndNormalize = (id, makeOdd, max) => {
  const elt = document.getElementById(id);
  let value = parseInt(elt.value, 10);
  const min = parseInt(elt.min, 10);
  if (max === undefined) {
    max = parseInt(elt.max, 10);
  }
  // console.log('getValueAndNormalize>',id,makeOdd,value,min,max);

  if (makeOdd) {
    const isEven = (value % 2) == 0;
    if (isEven) {
      value--;
    }
  }
  if (value < min) {
    value = min;
  }
  if (value > max) {
    value = max;
  }
  elt.value = value;
  // console.log('getValueAndNormalize<',id,value);
  return value;
};

const shuffle = (array) => {
  let currentIndex = array.length; let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

const getRandomArrayElt = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const hide = (id) => {
  document
      .getElementById(id)
      .setAttribute('class', 'border_black display_none');
};

const show = (id) => {
  document.
      getElementById(id).
      setAttribute('class', 'border_black');
};

const toggleHideShow = (id) => {
  const value =
    document
        .getElementById(id)
        .getAttribute('class');
  if (value == 'border_black') {
    hide(id);
  } else {
    show(id);
  }
};

const clear = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const loadPngSync = async (url) => {
  // console.log('loadPngSync', 'url', url);
  const response = await fetch(url);
  // console.log('loadPngSync','response', response);
  const buffer = await response.arrayBuffer();
  // console.log('loadPngSync','buffer', buffer);
  const data = new Uint8Array(buffer);
  // console.log('loadPngSync','data', data);
  const png = new window.PNG(data);
  png.pixels = png.decode();
  png.url = url;
  return png;
};

const getPixel = (png, x, y) => {
  if (x < 0) {
    return BORDER;
  }
  if (x >= png.width) {
    return BORDER;
  }
  if (y < 0) {
    return BORDER;
  }
  if (y >= png.height) {
    return BORDER;
  }
  const pixels = png.pixels;
  const ix = ((y * png.width)+x)*4;
  // console.log('getPixel', 'x', x, 'y', y, 'ix', ix, 'pixels.length', pixels.length);
  let r = pixels[ix + 0].toString(16);
  if (r.length == 1) {
    r = '0' + r;
  }
  let g = pixels[ix + 1].toString(16);
  if (g.length == 1) {
    g = '0' + g;
  }
  let b = pixels[ix + 2].toString(16);
  if (b.length == 1) {
    b = '0' + b;
  }
  let a = pixels[ix + 3].toString(16);
  if (a.length == 1) {
    a = '0' + a;
  }
  const pixel = r + g + b + a;
  return pixel.toUpperCase();
};

const UPPER_LEFT_CORNER = [
  [[BORDER], [BORDER]],
  [[BORDER], [TRANSPARENT, BLACK, WHITE]],
];

const UPPER_RIGHT_CORNER = [
  [[BORDER], [BORDER]],
  [[TRANSPARENT, BLACK, WHITE], [BORDER]],
];

const LOWER_LEFT_CORNER = [
  [[BORDER], [TRANSPARENT, BLACK, WHITE]],
  [[BORDER], [BORDER]],
];

const LOWER_RIGHT_CORNER = [
  [[TRANSPARENT, BLACK, WHITE], [BORDER]],
  [[BORDER], [BORDER]],
];

const isPatternMatch = (png, x, y, pattern) => {
  let allPixelsMatch = true;
  for (let py = 0; py < pattern.length; py++) {
    const row = pattern[py];
    for (let px = 0; px < row.length; px++) {
      const pixelList = row[px];
      // take any pixel in the pixelList in the pattern, and compare it to the
      // pixel in the png.
      // if none of the pixels in the pixelList matches the pixel in the pattern
      // then the pattern does not match.
      let anyPixelMatches = false;
      for (let pixelIx = 0; pixelIx < pixelList.length; pixelIx++) {
        const patternPixel = pixelList[pixelIx];
        const pngPixel = getPixel(png, x+px, y+py);
        if (patternPixel == pngPixel) {
          anyPixelMatches = true;
        }
      }
      if (!anyPixelMatches) {
        allPixelsMatch = false;
      }
    }
  }
  return allPixelsMatch;
};

const isUpperLeftCorner = (png, x, y) => {
  return isPatternMatch(png, x, y, UPPER_LEFT_CORNER);
};

const isLowerLeftCorner = (png, x, y) => {
  return isPatternMatch(png, x, y, LOWER_LEFT_CORNER);
};

const isUpperRightCorner = (png, x, y) => {
  return isPatternMatch(png, x, y, UPPER_RIGHT_CORNER);
};

const isLowerRightCorner = (png, x, y) => {
  return isPatternMatch(png, x, y, LOWER_RIGHT_CORNER);
};

const getLowerRightCorner = (png, x0, y0) => {
  // console.log('getLowerRightCorner', 'png.url', png.url, 'x0', x0, 'y0', y0);
  let x1;
  let y1;
  for (let x = x0; ((x <= png.width) && (x1 === undefined)); x++) {
    if (isUpperRightCorner(png, x, y0)) {
      x1 = x;
    }
  }
  for (let y = y0; ((y <= png.height) && (y1 === undefined)); y++) {
    if (isLowerLeftCorner(png, x0, y)) {
      y1 = y;
    }
  }
  if (isLowerRightCorner(png, x1, y1)) {
    return {x: x1, y: y1};
  }
};

const getSpriteData = (png, border, color) => {
  const x0 = border.x0;
  const y0 = border.y0;
  const x1 = border.x1;
  const y1 = border.y1;
  const spriteData = {
    hasFillStyle: false,
    pixels: [],
    w: (x1-x0)+1,
    h: (y1-y0)+1,
  };
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      const pixel = getPixel(png, x, y);
      const spriteDataElt = {
        x: x-x0,
        y: y-y0,
        w: 1,
        h: 1,
        fillStyle: `#${pixel}`,
      };
      if (pixel == WHITE) {
        spriteData.hasFillStyle = true;
        spriteDataElt.fillStyle = color;
      }

      spriteData.pixels.push(spriteDataElt);
    }
  }
  return spriteData;
};

const parseSpriteSheetPng = (png) => {
  const spriteSheet = [];
  for (let x = -1; x <= png.width; x++) {
    for (let y = -1; y <= png.height; y++) {
      if (isUpperLeftCorner(png, x, y)) {
        const lrc = getLowerRightCorner(png, x, y);
        // console.log('parseSpriteSheetPng', 'png.url', png.url, 'x', x, 'y', y,
        // 'lowerRightCorner', lowerRightCorner);
        if (lrc !== undefined) {
          const border = {
            x0: x+1, y0: y+1, x1: lrc.x, y1: lrc.y,
          };
          const blackSpriteData = getSpriteData(png, border, 'black');
          if (blackSpriteData.hasFillStyle) {
            for (let colorIx = 0; colorIx < COLORS.length; colorIx++) {
              const color = COLORS[colorIx];
              const spriteData = getSpriteData(png, border, color);
              spriteSheet.push(spriteData);
            }
          } else {
            spriteSheet.push(blackSpriteData);
          }
        }
      }

      // const pixelType = PIXEL_TYPES.find((element) => {return element === pixel});
      // if(pixelType == undefined) {
      // console.log('parseSpriteSheetPng', 'x', x, 'y', y, 'pixel', pixel);
      // }
    }
  }
  for (let spriteSheetIx = 0; spriteSheetIx < spriteSheet.length; spriteSheetIx++) {
    const spriteData = spriteSheet[spriteSheetIx];
    spriteData.ix = spriteSheetIx;
  }
  return spriteSheet;
};

const loadSpriteSheets = async () => {
  for (let spriteSheetIx = 0; spriteSheetIx < spriteSheets.length; spriteSheetIx++) {
    const spriteSheet = spriteSheets[spriteSheetIx];
    const spriteSheetUrl = `sprite-sheets/${spriteSheet.name}.png`;
    spriteSheet.url = spriteSheetUrl;
    spriteSheet.sprites = [];
    try {
      const spriteSheetPng = await loadPngSync(spriteSheetUrl);
      // console.log('spriteSheetPng', spriteSheetPng);
      spriteSheet.sprites = parseSpriteSheetPng(spriteSheetPng);
      // console.log('spriteSheet.sprites', spriteSheet.sprites);
    } catch (error) {
      console.log('spriteSheetPng', 'error', error);
    }
  }
  let innerHTML = '';
  let maxMonkeyCount;
  for (let spriteSheetIx = 0; spriteSheetIx < spriteSheets.length; spriteSheetIx++) {
    const spriteSheet = spriteSheets[spriteSheetIx];

    if (maxMonkeyCount === undefined) {
      maxMonkeyCount = spriteSheet.sprites.length;
    } else {
      maxMonkeyCount = Math.min(maxMonkeyCount, spriteSheet.sprites.length);
    }

    innerHTML += `<h1>${spriteSheet.name}, count:${spriteSheet.sprites.length}</h1>`;
    innerHTML += `<a target="_blank" href="${spriteSheet.url}">${spriteSheet.name} Sprite Sheet</a><br>`;
    for (let spriteIx = 0; spriteIx < spriteSheet.sprites.length; spriteIx++) {
      const sprite = spriteSheet.sprites[spriteIx];
      const spriteName = `${spriteSheet.name}_${spriteIx}`;
      sprite.name = spriteName;
      sprite.dx = spriteSheet.dx;
      sprite.dy = spriteSheet.dy;
      sprite.align = spriteSheet.align;
      // console.log('spriteName', spriteName);
      innerHTML += `<canvas id="${spriteName}" width="${PICTURE_SIZE}" height="${PICTURE_SIZE}" style="border:1px solid"></canvas>`;
    }
  }

  // must have an odd number of monkeys,
  // so the max monkey count must be odd.
  if (maxMonkeyCount % 2 == 0) {
    maxMonkeyCount--;
  }

  const maxMonkeyCountElt = document.getElementById('maxMonkeyCount');
  maxMonkeyCountElt.innerText = maxMonkeyCount;

  const numberOfMonkeysElt = document.getElementById('numberOfMonkeys');
  numberOfMonkeysElt.max = maxMonkeyCount;

  const maxDifficulty = Math.floor(maxMonkeyCount / 2);

  const difficultyElt = document.getElementById('difficulty');
  difficultyElt.max = maxDifficulty;

  const maxDifficultyElt = document.getElementById('maxDifficulty');
  maxDifficultyElt.innerText = maxDifficulty;

  const spriteListElt = document.getElementById('spriteList');
  clear(spriteListElt);
  spriteListElt.innerHTML = innerHTML;
  for (let spriteSheetIx = 0; spriteSheetIx < spriteSheets.length; spriteSheetIx++) {
    const spriteSheet = spriteSheets[spriteSheetIx];
    innerHTML += `<h1>${spriteSheet.name}</h1>`;
    for (let spriteIx = 0; spriteIx < spriteSheet.sprites.length; spriteIx++) {
      const sprite = spriteSheet.sprites[spriteIx];
      const spriteName = sprite.name;
      // console.log('spriteName', spriteName);
      const spriteElt = document.getElementById(spriteName);
      const ctx = spriteElt.getContext('2d');
      const scale = Math.max(sprite.w, sprite.h);
      const dx = (sprite.w - scale) / 2;
      const dy = alignSprite(sprite, scale);
      ctx.scale(PICTURE_SIZE/scale, PICTURE_SIZE/scale);
      ctx.translate(-dx, -dy);
      addSprite(ctx, sprite);
    }
  }
};

const alignSprite = (sprite, scale) => {
  switch (sprite.align) {
    case 'top':
      return 0;
    case 'center':
      return (sprite.h - scale) / 2;
    case 'bottom':
      return sprite.h - scale;
  }
  return 0;
};

const addSprite = (ctx, sprite) => {
  for (let pixelIx = 0; pixelIx < sprite.pixels.length; pixelIx++) {
    const pixel = sprite.pixels[pixelIx];
    // console.log('pixel', pixel);
    ctx.fillStyle = pixel.fillStyle;
    ctx.fillRect(pixel.x+0.1, pixel.y+0.1, pixel.w+0.1, pixel.h+0.1);
  }
};
