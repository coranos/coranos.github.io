const clientVersion = '1.0.23';
const demo = true;
const w = window.innerWidth;
const h = window.innerHeight;
function getExpectedValueImageSize() {
  if(w < h) {
    return w - 30;
  } else {
    if(w > 600) {
      return 600;
    } else {
      return h - 30;
    }
  }
}
function getHorizontalFlag() {
  if(w > 1000) {
    return true;
  } else {
    return false;
  }
}

const expectedValueImageSize = getExpectedValueImageSize();
const horizontalFlag = getHorizontalFlag();

 console.log('w',w);
 console.log('h',h);
 console.log('expectedValueImageSize',expectedValueImageSize);
 console.log('horizontalFlag',horizontalFlag);

var choiceValueImageSize = expectedValueImageSize / 4;

// https://css-tricks.com/snippets/css/media-queries-for-standard-devices/
// @media

var maxTime = 2000;
var time = maxTime;
var timeIntervalId = undefined;

let clickedIx = undefined;
let options = undefined;

function updateScore(goodScore,badScore) {
    const totalScore = goodScore - badScore;
    d3.select(options.goodScoreSelector).html(goodScore);
    d3.select(options.badScoreSelector).html(badScore);
    d3.select(options.totalScoreSelector).html(totalScore);
    
    if(totalScore < 0) {
      d3.select(options.totalScoreSelector).style('background','pink') 
    } else {
      d3.select(options.totalScoreSelector).style('background','lightgreen') 
    }
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function submitCapchaForm(token) {
  return submitForm(token);
}

function submitForm(token) {
    synchAccountDisplay();
    const discordInput = document.getElementById('old-discord');
    if (discordInput.value.length == 0) {
        document.getElementById('new-discord').style['background-color'] = 'red';
        return false;
    }
    const accountInput = document.getElementById('old-account');
    if (accountInput.value.length == 0) {
        document.getElementById('new-account').style['background-color'] = 'red';
        return false;
    }
    const botInput = document.getElementById('old-bot');
    if (botInput.value.length == 0) {
      d3.selectAll('input[name="bot"]').each(function(d, i) {
        d3.select(this).style('background-color','red');
      });
    }
    if (time > 0) {
        var timeDiv = document.getElementById('timer');
        timeDiv.style['background-color'] = 'red';
        return false;
    }
    newGame(token);
    return false;
}

function updateTime() {
    // console.log('updateTime', time);
    var timeDiv = document.getElementById('timer');
    if ((time % 1000) == 0) {
        timeDiv.innerHTML = Math.round(time / 1000);
    }
    time -= 100;

    var choices = document.getElementsByClassName('choiceLabel');
    var timeDiff = maxTime / choices.length;
    for (var ix = 0; ix < choices.length; ix++) {
        if (ix * timeDiff >= time) {
            choices[ix].style.display = 'inline-block';
        }
    }

    if (time < 0) {
        timeDiv.style['background-color'] = 'white';
        var expectations = document.getElementsByClassName('expected');
        for (var ix = 0; ix < expectations.length; ix++) {
            expectations[ix].style.display = 'block';
        }
        time = 0;
    }
}

function makeMonkeySvg(gameSelector, images, svgSize, choiceIx) {
    if((images.left === undefined) && (images.L !== undefined)) {
      images.left = parseInt(images.L, 16) - (images.left || 1);
      images.left = images.left.toString().substring(1);
    }
    if((images.right === undefined) && (images.R !== undefined)) {
      images.right = parseInt(images.R, 16) - (images.right || 1);
      images.right = images.right.toString().substring(1);
    }
    let svgParent = d3.select(gameSelector);
    if (choiceIx !== undefined) {
        const label = d3.select(gameSelector).append('label').attr('class', 'choiceLabel')
          .attr('width',choiceValueImageSize + 'px').attr('height',choiceValueImageSize + 'px');
        
        label.append('input')
            .attr('class', 'image g-recaptcha')
            .attr('data-sitekey', '6LdHNV0UAAAAAB2syUYlN022EIk3-ZhcUfwois-4')
            .attr('data-callback', 'submitCapchaForm')
            .attr('data-size', 'invisible')
            .attr('type', 'submit')
            .attr('name', 'choice')
            .attr('value', choiceIx);
        svgParent = label;
    }

    const svg = svgParent.append('svg').attr('width', svgSize).attr('height', svgSize);

    if (choiceIx === undefined) {
        svg.attr('class', 'expected');
    } else {
        svg.attr('class', 'choice');
    }

    svg.append('image').attr('xlink:href', images.prefix + images.left + '.png')
      .attr('x', 0).attr('y', 0).attr('height', svgSize / 2).attr('width', svgSize / 2);
    
    svg.append('image').attr('xlink:href', images.prefix + images.right + '.png')
      .attr('x', svgSize / 2).attr('y', svgSize / 2).attr('height', svgSize / 2).attr('width', svgSize / 2);

    svg.append('rect').attr('x', 1).attr('y', 1).attr('height', svgSize - 2).attr('width', svgSize - 2).attr('pointer-events', 'visible')
        .attr('onclick', 'return clickedRect('+choiceIx+')')
        .style('stroke', images.color)
        .style('fill', 'none').style('stroke-width', 1);

}

function clickedRect(choiceIx) {
  clickedIx= + choiceIx;
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.execute();
  }
}

function makeGame(gameOptions) {
  options = gameOptions;
  newGame();
}

function newGame(token) {
    const oldClickedIx = clickedIx;
    clickedIx = undefined;

    d3.select('.choiceLabel').style('display', 'none');

    d3.select(options.gameSelector).html('');

    const numberOfGames = options.numberOfGames;
    d3.select(options.gameSelector).style('width', expectedValueImageSize);

    $.ajaxSetup({
        beforeSend: function(xhr) {
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('application/json');
            }
        }
    });
    
    const urlPrefix = options.urlPrefix;
    var url = urlPrefix;
    const accountInput = document.getElementById('old-account');
    if (accountInput.value.length > 0) {
      url += '?account=' + accountInput.value;
      if(oldClickedIx !== undefined) {
        url += '&choice=' + oldClickedIx;
      }
      const discordInput = document.getElementById('old-discord');
      if (discordInput.value.length > 0) {
        url += '&discord=' + encodeURIComponent(discordInput.value);
      }
      const botInput = document.getElementById('old-bot');
      if (botInput.value.length > 0) {
        url += '&bot=' + encodeURIComponent(botInput.value);
      }
      if(token !== undefined) {
        url += '&captcha=' + token;
      }
    }
    
    $.getJSON(url, function(gameJson) {
        d3.select('#serverVersion').html(gameJson.serverVersion);
        d3.select('#bytesUsed').html(gameJson.bytes_used);
        if (gameJson.slowDownFlag === false) {
          d3.select('#slowDownFlag').style('display', 'none');
        }
        if (gameJson.accountIsInvalidFlag === false) {
          d3.select('#accountIsInvalidFlag').style('display', 'none');
        } else {
          if(document.getElementById('new-account').value === '') {
            d3.select('#accountIsInvalidFlag').style('display', 'none');
          } else {
            d3.select('#accountIsInvalidFlag').style('display', 'block');
            document.getElementById('new-account').value = '';
            document.getElementById('old-account').value = '';
            synchAccountDisplay();
          }
        }
        
        updateScore(gameJson.wins,gameJson.losses);
        d3.select('#winnerStats')
          .html('number of winners over ' + gameJson.winnerThreshold + ' is ' + gameJson.totalWinners + ' of ' + gameJson.maxWinners
              + ' with a total payout of ' + gameJson.totalPayout + ' of ' + gameJson.maxPayout + '.');


        gameJson.expected.prefix = gameJson.prefix;
        gameJson.expected.color = '0xFF0000FF';
        makeMonkeySvg(options.gameSelector, gameJson.expected, expectedValueImageSize, undefined);
        
        // shuffle(gameJson.choices);
        for (let choiceIx = 0; choiceIx < gameJson.choices.length; choiceIx++) {
            const actual = gameJson.choices[choiceIx];
            actual.prefix = gameJson.prefix;
            
            if((actual.L == gameJson.expected.L) && (actual.R == gameJson.expected.R)) {
              actual.color = '#00FF00';
            } else {
              actual.color = '#FF0000';
            }
            
            makeMonkeySvg(options.gameSelector, actual, choiceValueImageSize, choiceIx);
        }
        
        if(gameJson.time !== undefined) {
          maxTime = gameJson.time;
        }

        time = maxTime;
        if(timeIntervalId !== undefined) {
          clearInterval(timeIntervalId);
          timeIntervalId = undefined;
        }
        timeIntervalId= setInterval(updateTime, 100);
        updateTime();
        
        
        if (typeof grecaptcha !== 'undefined') {
          d3.selectAll(".g-recaptcha").each(function(d, i) {
            const node = d3.select(this).node();
            grecaptcha.render(node);
          });
          
          grecaptcha.reset();
        }
    });
}

function synchAccountDisplay() {
  synchDiscordDisplay();
  synchBananoAccountDisplay();
  synchBotDisplay();
}

function synchBananoAccountDisplay() {
    var account = d3.select('#new-account').node().value;
    if (account.length == 0) {
      d3.select('#hasAccountFlagYes').style('display', 'none');
      d3.select('#hasAccountFlagNo').style('display', 'block');
    } else {
      d3.select('#old-account').node().value = account;
      d3.select('#account-text').html(account);
      d3.select('#hasAccountFlagYes').style('display', 'block');
      d3.select('#hasAccountFlagNo').style('display', 'none');
    }
}

function isValidDiscord(discord) {
  if (discord.length == 0) {
    return false;
  }
  if (!discord.startsWith('@')) {
    return false;
  }
  const re = new RegExp("^.*#[0-9]{4}$");
  if (!re.test(discord)) {
    return false;
  }
  return true;
}

function synchDiscordDisplay() {
    var discord = d3.select('#new-discord').node().value;
    if (!isValidDiscord(discord)) {
      d3.select('#old-discord').node().value = '';
      d3.select('#hasDiscordFlagYes').style('display', 'none');
      d3.select('#hasDiscordFlagNo').style('display', 'block');
    } else {
      d3.select('#old-discord').node().value = discord;
      d3.select('#discord-text').html(discord);
      d3.select('#hasDiscordFlagYes').style('display', 'block');
      d3.select('#hasDiscordFlagNo').style('display', 'none');
    }
}

function synchBotDisplay() {
    const account = d3.select('#old-account').node().value;
    const discord = d3.select('#old-discord').node().value;
    const bot = d3.select('#new-bot').node().value;
    if ((account.length == 0) || (discord.length == 0) || (bot.length == 0)) {
      d3.select('#hasBotFlagYes').style('display', 'none');
      d3.select('#hasBotFlagNo').style('display', 'block');
    } else {
      d3.select('#old-bot').node().value = bot;
      d3.select('#bot-text').html(bot);
      d3.select('#hasBotFlagYes').style('display', 'block');
      d3.select('#hasBotFlagNo').style('display', 'none');
    }
}

function setupHtml () {
  const body = d3.select('#body');
  
  body.attr('class','monospace');
  
  const form = body.append('form');
  form.attr('action','.').attr('method','get').attr('onsubmit','return submitForm();');

  var statsBlock;
  var gameBlock;
  if(horizontalFlag) {
    const table = form.append('table');
    table.attr('class','align_center');
    
    const tr1 = table.append('tr');
    gameBlock = tr1.append('td');
    statsBlock = tr1.append('td');
  } else {
    const table = form.append('table');
    table.attr('class','align_center');
    
    const tr1 = table.append('tr');
    statsBlock = tr1.append('td');
    const tr2 = table.append('tr');
    gameBlock = tr2.append('td');
  }
  statsBlock.attr('class','align_top');
  gameBlock.attr('class','align_top');
  
  const table = statsBlock.append('table');
  table.attr('class','solid_border centered_text');
  
  const tr1 = table.append('tr');
  tr1.append('th').attr('class','solid_border centered_text').text('Client Version')
  tr1.append('th').attr('class','solid_border centered_text').text('Server Version')
  tr1.append('th').attr('class','solid_border centered_text').text('Bytes Used')
  tr1.append('th').attr('class','solid_border centered_text').text('Reload Images')
  
  const tr2 = table.append('tr');
  tr2.append('td').attr('class','solid_border centered_text').attr('id','clientVersion').text(clientVersion);
  tr2.append('td').attr('class','solid_border centered_text').attr('id','serverVersion').text('??');
  tr2.append('td').attr('class','solid_border centered_text').attr('id','bytesUsed').text('0');
  tr2.append('td').attr('class','solid_border centered_text')
  .append('button').attr('type','button').attr('onclick','javascript:reloadImages()').text('Reload Images')
  
  const tr3 = table.append('tr');
  tr3.append('th').attr('class','solid_border centered_text').text('Bananos Found');
  tr3.append('th').attr('class','solid_border centered_text').text('Bananos Lost');
  tr3.append('th').attr('class','solid_border centered_text').text('Bananos Won');
  tr3.append('th').attr('class','solid_border centered_text').text('Tutorial')
  
  const tr4 = table.append('tr');
  tr4.append('td').attr('class','solid_border centered_text').attr('id','goodScore').text('0');
  tr4.append('td').attr('class','solid_border centered_text').attr('id','badScore').text('0');
  tr4.append('td').attr('class','solid_border centered_text').style('background','lightgray').attr('id','totalScore').text('0');

  tr4.append('td').attr('class','solid_border centered_text')
    .append('a').attr('target','_blank').attr('href','https://coranos.github.io/bananos/monkey/tutorial.html').text('Tutorial')

  /*
   * tr4.append('td').attr('class','solid_border centered_text') .append('a').attr('target','_blank').attr('href','https://www.youtube.com/embed/E23TD-Zwaek')
   * .append('img').attr('src','https://img.youtube.com/vi/E23TD-Zwaek/default.jpg') .style('height','25px') .style('max-width','100%')
   */

  const tr5 = table.append('tr');
  tr5.append('td').attr('colspan','8').attr('class','solid_border centered_text').attr('id','winnerStats').text('??');

  if(demo) {
    statsBlock.append('p').append('b').style('background','lightgreen').html('Game is in demo mode. No Bananos will be distributed.');
  } else {
    statsBlock.append('p').append('b').style('background','lightgreen').html('Game is live. Bananos will be distributed to all verified accounts<br>'
      + 'after a verification period has passed.<br>'
      + '(This message will disappear at 5AM Chicago Time on Saturday July 7th).');
  }
  
  statsBlock.append('p').append('b').style('background','lightblue').html('According to dolartoday.com, on July 4th 2018, 1 USD = 3,500,265.82 BsF<br>'
    + 'According to creeper.banano.cc, 1 BAN = 0.000892 USD (1 USD = 1121 BAN), 1 NANO = 3,034 BAN<br>'
    + 'So if you are being paid to play this game, a fair price is 3122 BsF per BAN.<br>');
  
  statsBlock.append('p').text('Game Starts In (Seconds) ').append('span').attr('id','timer').text('??');
  
  statsBlock.append('div').attr('id','slowDownFlag').append('p').append('b')
  .text('Slow down, you submitted to quickly and your entry was not counted.');

  statsBlock.append('div').attr('id','accountIsInvalidFlag').append('p').append('b')
  .text('The account you entered was invalid, make sure it starts with ban_ and is 64 characters long.');

  const accountDiv = statsBlock.append('div');
  accountDiv.attr('style','width: ' + expectedValueImageSize + 'px');
  
  addDiscordDivs(accountDiv);
  addAccountDivs(accountDiv);
  addBotDivs(accountDiv);

  const gameDiv = gameBlock.append('div');
  gameDiv.style('width',expectedValueImageSize + 'px').style('height',expectedValueImageSize + 'px').attr('id','game');
}

function addAccountDivs(accountDiv) {
  const yesAccountDiv = accountDiv.append('div');
  yesAccountDiv.attr('id','hasAccountFlagYes').append('p').append('b')
    .text('Account: ').append('span').attr('id','account-text').text('??');
  yesAccountDiv.append('input').attr('id','old-account').attr('type','hidden').attr('name','account').attr('value','');
  
  const noAccountDiv = accountDiv.append('div');
  noAccountDiv.attr('id','hasAccountFlagNo').append('p').append('b')
    .text('Please enter a bananos account, then select the square that contains a smaller version of the 4 background monkeys, where the two smaller monkeys have the same orientation.');
  noAccountDiv
    .append('input').attr('id','new-account').attr('type','text').attr('name','account').attr('value','').attr('size','64');
}

function addDiscordDivs(accountDiv) {
  const yesDiscordDiv = accountDiv.append('div');
  yesDiscordDiv.attr('id','hasDiscordFlagYes').append('p').append('b')
    .text('discord: ').append('span').attr('id','discord-text').text('??');
  yesDiscordDiv.append('input').attr('id','old-discord').attr('type','hidden').attr('name','discord').attr('value','');
  
  const noDiscordDiv = accountDiv.append('div');
  noDiscordDiv.attr('id','hasDiscordFlagNo').append('p').append('b')
    .text('Please enter a discord id (like @Coranos#4281).');
  noDiscordDiv
    .append('input').attr('id','new-discord').attr('type','text').attr('name','discord').attr('value','').attr('size','64');
}

function addBotDivs(accountDiv) {
  const yesBotDiv = accountDiv.append('div');
  yesBotDiv.attr('id','hasBotFlagYes').append('p').append('b')
    .text('bot: ').append('span').attr('id','bot-text').text('??');
  yesBotDiv.append('input').attr('id','old-bot').attr('type','hidden').attr('name','bot').attr('value','');
  
  const botDiv = accountDiv.append('div');
  botDiv.attr('id','hasBotFlagNo').append('p').append('b').text('Please say if you are a bot.');
  
  const botSelect = botDiv.append('select');
  botSelect.attr('id','new-bot').attr('name','bot').attr('class','solid_border centered_text');
  botSelect.append('option').attr('id','new-bot-maybe').attr('value','maybe').text('i am not sure if i am a bot');
  botSelect.append('option').attr('id','new-bot-yes').attr('value','yes').text('i am a bot');
  botSelect.append('option').attr('id','new-bot-no').attr('value','no').text('i am not a bot');
}

function reloadImages() {
  alert('reloading images');
  d3.selectAll('image').each(function(d, i) {
    const href = d3.select(this).attr('xlink:href');
    d3.select(this).attr('xlink:href',null);
    d3.select(this).attr('xlink:href',href);
  });
  alert('reloaded images');
}

function onLoad (urlPrefix) {
  setupHtml();
  synchAccountDisplay();
  const options = {
    'gameSelector' : '#game',
    'goodScoreSelector' : '#goodScore',
    'badScoreSelector' : '#badScore',
    'totalScoreSelector' : '#totalScore',
    'urlPrefix' : urlPrefix
  };
  makeGame(options);
}