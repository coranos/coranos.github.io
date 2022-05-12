const spriteSheets = [
  {name:'body'},
  {name:'eyes'},
  {name:'hand-item'},
  {name:'hat'},
  {name:'head'},
  {name:'tail'},
]

const SPRITE_SCALE = 10;

const BORDER = 'FFB6AAFF';
const TRANSPARENT = '00000000';
const BLACK = '000000FF';
const WHITE = 'FFFFFFFF';

const PIXEL_TYPES = [
  BORDER,
  TRANSPARENT,
  BLACK,
  WHITE,
]

const COLORS = [
  'aqua',  	   	 'lime', 	   	 'silver'  ,
  'black',  	   	 'maroon',  	   	 'teal'  ,
  'blue',  	   	 'navy',  	   	 'white'  ,
  'fuchsia',  	   	 'olive',  	   	 'yellow'  ,
  'gray',  	   	 'purple'  ,
  'green',  	   	 'red'  ,
];

window.onLoad = async () => {
  await loadSpriteSheets();
  show('generateMatch');
  show('spriteList');
};

window.generateNewMatches = async () => {
  const numberOfMonkeys =  parseInt(document
        .getElementById('numberOfMonkeys').value);
  for(let monkeyIx = 0; monkeyIx < numberOfMonkeys; monkeyIx++) {

  }
};

const getRandomArrayElt = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

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
  const data = new Uint8Array(buffer)
  // console.log('loadPngSync','data', data);
  const png = new window.PNG(data);
  png.pixels = png.decode();
  png.url = url;
  return png;
}

const getPixel = (png, x, y) => {
  if(x < 0) {
    return BORDER;
  }
  if(x >= png.width) {
    return BORDER;
  }
  if(y < 0) {
    return BORDER;
  }
  if(y >= png.height) {
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
}

const UPPER_LEFT_CORNER = [
  [[BORDER],[BORDER]],
  [[BORDER],[TRANSPARENT,BLACK,WHITE]],
]

const UPPER_RIGHT_CORNER = [
  [[BORDER],[BORDER]],
  [[TRANSPARENT,BLACK,WHITE],[BORDER]],
]

const LOWER_LEFT_CORNER = [
  [[BORDER],[TRANSPARENT,BLACK,WHITE]],
  [[BORDER],[BORDER]],
]

const LOWER_RIGHT_CORNER = [
  [[TRANSPARENT,BLACK,WHITE],[BORDER]],
  [[BORDER],[BORDER]],
]

const isPatternMatch = (png, x, y, pattern) => {
  let allPixelsMatch = true;
  for(let py = 0; py < pattern.length; py++) {
    const row = pattern[py];
    for(let px = 0; px < row.length; px++) {
      const pixelList = row[px];
      // take any pixel in the pixelList in the pattern, and compare it to the
      // pixel in the png.
      // if none of the pixels in the pixelList matches the pixel in the pattern
      // then the pattern does not match.
      let anyPixelMatches = false;
      for(let pixelIx = 0; pixelIx < pixelList.length; pixelIx++) {
        const patternPixel = pixelList[pixelIx];
        const pngPixel = getPixel(png,x+px,y+py);
        if(patternPixel == pngPixel) {
          anyPixelMatches = true;
        }
      }
      if(!anyPixelMatches) {
        allPixelsMatch = false;
      }
    }
  }
  return allPixelsMatch;
}

const isUpperLeftCorner = (png, x, y) => {
  return isPatternMatch(png,x,y,UPPER_LEFT_CORNER);
}

const isLowerLeftCorner = (png, x, y) => {
  return isPatternMatch(png,x,y,LOWER_LEFT_CORNER);
}

const isUpperRightCorner = (png, x, y) => {
  return isPatternMatch(png,x,y,UPPER_RIGHT_CORNER);
}

const isLowerRightCorner = (png, x, y) => {
  return isPatternMatch(png,x,y,LOWER_RIGHT_CORNER);
}

const getLowerRightCorner = (png, x0, y0) => {
  // console.log('getLowerRightCorner', 'png.url', png.url, 'x0', x0, 'y0', y0);
  let x1;
  let y1;
  for(let x = x0; ((x <= png.width) && (x1 === undefined)); x++) {
    if(isUpperRightCorner(png,x,y0)) {
      x1 = x;
    }
  }
  for(let y = y0; ((y <= png.height) && (y1 === undefined)); y++) {
    if(isLowerLeftCorner(png,x0,y)) {
      y1 = y;
    }
  }
  if(isLowerRightCorner(png,x1,y1)) {
    return {x:x1,y:y1};
  }
}

const getSpriteData = (png, x0,y0,x1,y1) => {
  const color = getRandomArrayElt(COLORS);
  const spriteData = {
    pixels:[],
    w:(x1-x0)+1,
    h:(y1-y0)+1,
  };
  for(let x = x0; x <= x1; x++) {
    for(let y = y0; y <= y1; y++) {
      const pixel = getPixel(png,x,y);
      const spriteDataElt = {
        x:x-x0,
        y:y-y0,
        w:1,
        h:1,
        fillStyle:`#${pixel}`,
      }
      if(pixel == WHITE) {
        spriteDataElt.fillStyle = color;
      }

      spriteData.pixels.push(spriteDataElt);
    }
  }
  return spriteData;
}

const parseSpriteSheetPng = (png) => {
  const spriteSheet = [];
  for(let x = -1; x <= png.width; x++) {
    for(let y = -1; y <= png.height; y++) {
      if(isUpperLeftCorner(png,x,y)) {
        const lrc = getLowerRightCorner(png,x,y);
        // console.log('parseSpriteSheetPng', 'png.url', png.url, 'x', x, 'y', y,
          // 'lowerRightCorner', lowerRightCorner);
        if(lrc !== undefined) {
          const spriteData = getSpriteData(png, x+1,y+1,lrc.x,lrc.y);
          spriteSheet.push(spriteData);
        }
      }

      // const pixelType = PIXEL_TYPES.find((element) => {return element === pixel});
      // if(pixelType == undefined) {
        // console.log('parseSpriteSheetPng', 'x', x, 'y', y, 'pixel', pixel);
      // }
    }
  }
  return spriteSheet;
}

const loadSpriteSheets = async () => {
  for(let spriteSheetIx = 0; spriteSheetIx < spriteSheets.length; spriteSheetIx++) {
    const spriteSheet = spriteSheets[spriteSheetIx];
    const spriteSheetUrl = `sprite-sheets/${spriteSheet.name}.png`;
    try {
      const spriteSheetPng = await loadPngSync(spriteSheetUrl);
      // console.log('spriteSheetPng', spriteSheetPng);
      spriteSheet.sprites = parseSpriteSheetPng(spriteSheetPng)
      // console.log('spriteSheet.sprites', spriteSheet.sprites);
    } catch(error) {
      console.log('spriteSheetPng', 'error', error);
    }
  }
  let innerHTML = '';
  for(let spriteSheetIx = 0; spriteSheetIx < spriteSheets.length; spriteSheetIx++) {
    const spriteSheet = spriteSheets[spriteSheetIx];
    innerHTML += `<h1>${spriteSheet.name}</h1>`;
    if(spriteSheet.sprites !== undefined) {
      for(let spriteIx = 0; spriteIx < spriteSheet.sprites.length; spriteIx++) {
        const sprite = spriteSheet.sprites[spriteIx];
        const spriteName = `${spriteSheet.name}_${spriteIx}`;
        sprite.name = spriteName;
        // console.log('spriteName', spriteName);
        innerHTML += `<canvas id="${spriteName}" width="${sprite.w*SPRITE_SCALE}" height="${sprite.h*SPRITE_SCALE}" style="border:1px solid"></canvas>`;
      }
    }
  }
  const spriteListElt = document.getElementById('spriteList');
  clear(spriteListElt);
  spriteListElt.innerHTML = innerHTML;
  for(let spriteSheetIx = 0; spriteSheetIx < spriteSheets.length; spriteSheetIx++) {
    const spriteSheet = spriteSheets[spriteSheetIx];
    innerHTML += `<h1>${spriteSheet.name}</h1>`;
    if(spriteSheet.sprites !== undefined) {
      for(let spriteIx = 0; spriteIx < spriteSheet.sprites.length; spriteIx++) {
        const sprite = spriteSheet.sprites[spriteIx];
        const spriteName = sprite.name;
        // console.log('spriteName', spriteName);
        const spriteElt = document.getElementById(spriteName);
        const ctx = spriteElt.getContext("2d");

        for(let pixelIx = 0; pixelIx < sprite.pixels.length; pixelIx++) {
          const pixel = sprite.pixels[pixelIx];
          // console.log('pixel', pixel);
          ctx.fillStyle = pixel.fillStyle;
          ctx.fillRect(pixel.x*SPRITE_SCALE, pixel.y*SPRITE_SCALE, pixel.w*SPRITE_SCALE, pixel.h*SPRITE_SCALE);
        }
      }
    }
  }
}
