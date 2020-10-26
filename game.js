const buttonIds = [ 
  {'id':'vl','chance':0.01,'payout':98},
  {'id':'l','chance':0.23,'payout':5},
  {'id':'a','chance':0.48,'payout':1},
  {'id':'h','chance':0.73,'payout':0.25},
  {'id':'vh','chance':0.98,'payout':0.01}
];

const onLoad = () => {
  html('win_chance', '-');
  html('roll_under', '-');
  html('payout', '-');
  setOdds();
};

const playClick = (elt) => {
  const json = [];
  
  const numberOfBets = value('number_of_bets');
  const serverSeed = value('server_seed');
  const clientSeed = value('client_seed');
  const nonce = value('nonce');
  
  const target = parseFloat(html('roll_under'));
  const payout = parseFloat(html('payout'));
  
  let totalProfit = 0;
  
  for(let ix = 0; ix < numberOfBets; ix++) {
    const number = (parseInt(ix) + parseInt(nonce));
    
    const jsonElt = {};

    const message = clientSeed + ':' + number;
    
    const hash = CryptoJS.HmacSHA512(message, serverSeed).toString().substring(1,6);

    const result = ((parseInt(hash,16) % 10000) / 100).toFixed(2);
    
    const wonFlag = result < target;

    const won = wonFlag ? 'won' : 'lost';
    
    const profit = wonFlag ? payout : -1;
    
    totalProfit += profit;
    
    jsonElt['Bet Number'] = number;
    jsonElt['Hash'] = hash;
    jsonElt['Result'] = result;
    jsonElt['Target'] = target;
    jsonElt['Win/Lose'] = won;
    jsonElt['Profit'] = profit;
    jsonElt['Total Profit'] = totalProfit.toFixed(2);
    
    json.push(jsonElt);
  }
  
  const id = elt.getAttribute('id');
  html('bets','');
  createTable('bets',json);
};

const chanceSelectionClick = (elt) => {
  buttonIds.forEach((button) => {
    class_attr(button.id, 'button');
  });
  const id = elt.getAttribute('id');
  if (class_attr(id) == 'button selected_button') {
    class_attr(id, 'button');
  } else {
    class_attr(id, 'button selected_button');
  }
  setOdds();
}

const setOdds = () => {
  buttonIds.forEach((button) => {
    if (class_attr(button.id) == 'button selected_button') {
      html('win_chance', button.chance);
      html('roll_under', button.chance * 100);
      html('payout', button.payout);
    }
  });
}