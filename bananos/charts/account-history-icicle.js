// Variables
var width = 2000;
var height = 2000;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 150, h: 30, s: 3, t: 10
};

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([0, height]);

var color = d3.scaleOrdinal(d3.schemeCategory20c);

function onLoad() {
    d3.json('account-history.json', function(response) {
      loadDataMap(response);      
      showIcicles();
    });
}

function showIcicles() {
  // console.log('rootAccount',rootAccount);
  const rootData = nodeDataMap[rootAccount];
  
  const nodeData = copyNode(rootData,nodeDataMap.length);
//  const nodeData = copyNode(rootData,3);
  
  // console.log(rootData);
  d3.select('#icicle').selectAll("*").remove();
  d3.select('#rootName').html(rootAccount + " " + rootData.name);
  d3.select('#mouseover').html(rootData.name);
    
  var x = d3.scaleLinear()
    .range([0, width]);
  
  var y = d3.scaleLinear()
    .range([0, height]);
  
  var color = d3.scaleOrdinal(d3.schemeCategory20c);
  
  var vis = d3.select('#icicle').append("svg")
    .attr("width", width)
    .attr("height", height)
  
  var partition = d3.partition()
    .size([width, height])
    .padding(0)
    .round(true);
  
  var rect = vis.selectAll("rect");
  var fo = vis.selectAll("foreignObject");
  var totalSize=0;

  var root = d3.hierarchy(nodeData)
      .sum(function(d) {
          return d.size;
      })
      .sort(function(a, b) { return b.size - a.size; });
  
  partition(root);
  
  rect = rect
      .data(root.descendants())
    .enter().append("rect")
      .attr("y", function(d) { return d.x0; })
      .attr("x", function(d) { return d.y0; })
      .attr("height", function(d) { return d.x1 - d.x0; })
      .attr("width", function(d) { return d.y1 - d.y0; })
      .style('fill', function(d) {
          var colorKey = (d.data.children ? d : d.parent).data.name;
          // console.log(colorKey);
          return color(colorKey);
      })
      .on("mouseover", mouseover)
      .on("click", click);
    
  fo = fo
    .data(root.descendants())
    .enter().append("text")
      .attr('class', 'titles')
      .attr("y", function(d) { return d.x0; })
      .attr("x", function(d) { return d.y0; })
      .attr("height", function(d) { return d.x1 - d.x0; })
      .attr("width", function(d) { return d.y1 - d.y0; })
      .attr('transform', function(d) {
        return 'translate(0,' + ((d.x1 - d.x0)/2) + ')';
    })
     .style("cursor", "pointer")
     .text(function(d) { return d.data.name})
     .on("mouseover", mouseover)
     .on("click", click);
}

function mouseover(d) {
  // console.log("mouseover",d.data.name);
  d3.select('#mouseover').html(d.data.name);
}

function click(d) {
  // console.log("click",d.data.account);
  if(rootAccount == d.data.account) {
    rootAccount = genesisAccount;      
  } else {
    rootAccount = d.data.account;
  }
  showIcicles();
}

