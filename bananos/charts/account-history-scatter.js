// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function onLoad() {
  d3.json('account-history.json', function(response) {
    showScatter(response);
  });
}

// Get the data
function showScatter(response) {
  // format the data
  const data = [];
  
  const whales = new Set();
  whales.add('ban_1fundm3d7zritekc8bdt4oto5ut8begz6jnnt7n3tdxzjq3t46aiuse1h7gj');
  whales.add('ban_3fundbxxzrzfy3k9jbnnq8d44uhu5sug9rkh135bzqncyy9dw91dcrjg67wf');
  whales.add('ban_3runnerrxm74165sfmystpktzsyp7eurixwpk59tejnn8xamn8zog18abrda');
  whales.add('ban_1bonusncatu5rsrctx1djmgrragfwpj4ujsk939utmtdwskhtiourh8997eh');
  whales.add('ban_1fund7g391gz9mjr9wuqjzcb68omnt5jjznw7at54sart79uadhe6ih81fuq');
  whales.add('ban_3redditpxsum1uizb8o8is9kau7uckzpts7oddoz6j4gzorxc8eaodkjzxqb');
  whales.add('ban_3disc5557sb9ri99h7czmn6ms5kcfsafnsxekarg1pp9f3a1ik4ndjcb9cod');
  whales.add('ban_1ce1ery6hqwyqqyh15m4atcoaywd8rycyapjjooqeg7gi149kmatjbb3wiwx');
  whales.add('ban_3twitegseiodhntduw76t3gsoqsn1ooo4dhpc5p6r5bqx8phbufdr876odh3');
  
  response.results.forEach(function(d) {
    const dataElt = {};
    dataElt.account = d.account;
    dataElt.tx = Object.entries(d.history).length;
    dataElt.balance = +d.balance;
    if(dataElt.balance > 0) {
      if(!whales.has(dataElt.account)) {
        data.push(dataElt);
      }
    }
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return (d.tx+1); }));
  y.domain([0, d3.max(data, function(d) { return (d.balance); })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);
      
  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return x((d.tx+1)); })
      .attr("cy", function(d) { return y((d.balance)); })
      .append("svg:title")
      .text(function(d) { return d.account; });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

}
