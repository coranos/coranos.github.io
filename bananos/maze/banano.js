const width = 150;

const height = 150;

const max_scale = 1.5;

const max_interpolate_step = 4;

let goodScore = 0;
let badScore = 0;
let goodIx = undefined;

function updateScore(ix, options) {
  if(goodIx == undefined) {
    return;
  }
  if(ix == goodIx) {
    goodScore++;
  } else {
    badScore++;
  }
  const totalScore = goodScore-badScore;
  d3.select(options.goodScoreSelector).html(goodScore);
  d3.select(options.badScoreSelector).html(badScore);
  d3.select(options.totalScoreSelector).html(totalScore);
  makeGame(options);
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * 
 * Returns a random integer between 0 and max, including 0 and excluding max.
 */
function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function makeGameSvg(gameIx, options, rawBananoJson, rotation, breakHamiltonianCycle) {
  const rootSelector = options.gameSelector;

  
  const scale = (max_scale - 0.0) + (getRandomInt(2) / 10.0);
  const strokeWidth = scale / 2;
  // copy and jiggle the json
  const bananoJson = [];
  bananoJson.push({});
  
  const offsetX = getRandomInt(20) - 10;
  const offsetY = getRandomInt(20) - 10;
  
  for(let bananoJsonIx = 1; bananoJsonIx < rawBananoJson.length; bananoJsonIx++) {
    bananoJson.push({});
    bananoJson[bananoJsonIx].x = rawBananoJson[bananoJsonIx].x;
    bananoJson[bananoJsonIx].y = rawBananoJson[bananoJsonIx].y;
    bananoJson[bananoJsonIx].x += offsetX;
    bananoJson[bananoJsonIx].y += offsetY;
  }
  bananoJson[0].x = bananoJson[bananoJson.length-1].x;
  bananoJson[0].y = bananoJson[bananoJson.length-1].y;

  const label =  d3.select(rootSelector)
  .append('label')
  
  label
    .append('input')
    .attr('type', 'submit')
    .attr('value', gameIx);
  
  const svg = label
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    svg.append('rect')
    .attr('x', 1)
    .attr('y', 1)
    .attr('height', height-1)
    .attr('width', width-1)
    .style('stroke', 'black')
    .style('fill', 'none')
    .style('stroke-width', strokeWidth);
  
  const lineFunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
  
  const breakIx = 1+ getRandomInt(bananoJson.length-1);
    
  for(let bananoJsonIx = 1; bananoJsonIx < bananoJson.length; bananoJsonIx++) {
    const bananoJsonIx0 = bananoJsonIx-1;
    const bananoJsonIx1 = bananoJsonIx+1;
    const bananoSlice = bananoJson.slice(bananoJsonIx0,bananoJsonIx1);
    const bx0 = bananoSlice[0].x;
    const by0 = bananoSlice[0].y;
    const bx1 = bananoSlice[1].x;
    const by1 = bananoSlice[1].y;
    
    const dx = (bx1-bx0);
    const dy = (by1-by0);
    
    const x0 = bx0 * scale;
    const y0 = by0 * scale;
    

    const x1 = bx1 * scale;
    const y1 = by1 * scale;
    
    let dx1 = x0;
    let dy1 = y0;
    
    function check() {
      return ((dx1*dx < x1*dx) || dx == 0) && ((dy1*dy < y1*dy) || dy == 0);
    }
    
    while(check()){
      const slice = [];
      slice.push({'x':dx1,'y':dy1});
      
      const interpolate_step = max_interpolate_step-1+ getRandomInt(1);
      
      if(dx < 0) {
        dx1 -= interpolate_step;
      }
      if(dx > 0) {
        dx1 += interpolate_step;
      }
      
      if(dx1*dx > x1*dx) {
        dx1 = x1;
      }
      
      if(dy < 0) {
        dy1 -= interpolate_step;
      }
      if(dy > 0) {
        dy1 += interpolate_step;
      }

      if(dy1*dy > y1*dy) {
        dy1 = y1;
      }

      
      let append = true;
      if((!check()) && breakHamiltonianCycle) {
        if(bananoJsonIx == breakIx) {
          append = false;          
        }
      }
      
      if(append) {
        slice.push({'x':dx1,'y':dy1});
      } else {
        const start = (bananoJsonIx+1) % (bananoJson.length-1);
        // console.log('start',start,'bananoJsonIx',bananoJsonIx,'bananoJson.length',bananoJson.length);
        
        const p2 = bananoJson.slice(start,start+1)[0];

        const p2x = p2.x;
        const p2y = p2.y;
        // console.log('p2',JSON.stringify(p2));
        // console.log('p2x',p2x,'p2y',p2y,'scale',scale);
        slice.push({'x':p2x * scale,'y':p2y * scale});
        // console.log('slice',JSON.stringify(slice));
      }
      
        
      svg.append('path')
      .attr('d', lineFunction(slice))
      .attr('stroke', "brown")
      .attr('stroke-width', 2);
    }
  }
  
  // add clickable


  svg.append('rect')
  .attr('x', 1)
  .attr('y', 1)
  .attr('height', height-1)
  .attr('width', width-1)
  .attr('pointer-events', "visible")
  .style('stroke', 'red')
  .style('fill', 'none')
  .style('stroke-width', '1')
  .on("click", function(){
    updateScore(gameIx, options);
    d3.event.stopPropagation();
  });
}

function makeGame(options) {
  d3.select(options.gameSelector).html('');
  
  const numberOfGames = options.numberOfGames;
  d3.select(options.gameSelector).style('width',width*Math.sqrt(numberOfGames));

  $.ajaxSetup({
    beforeSend : function (xhr) {
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType('application/json');
      }
    }
  });

  $.getJSON('banano.json', function (bananoJson) {
    const realIx = getRandomInt(numberOfGames);
    goodIx = realIx;

    for (let gameIx = 0; gameIx < numberOfGames; gameIx++) {
      const breakHamiltonianCycle = !(gameIx == realIx);
      const rotation = (2.0 * Math.PI) / ((gameIx * 1.0) / numberOfGames);
      makeGameSvg(gameIx, options, bananoJson, rotation, breakHamiltonianCycle);
    }
  });
}