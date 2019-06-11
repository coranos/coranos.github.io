var svg;

var opacityDefault = 0.8;


function onLoad() {

    var margin = {
            left: 90,
            top: 90,
            right: 90,
            bottom: 90
        },
        width = 1000 - margin.left - margin.right, // more flexibility: Math.min(window.innerWidth, 1000)
        height = 1000 - margin.top - margin.bottom, // same: Math.min(window.innerWidth, 1000)
        innerRadius = Math.min(width, height) * .35,
        outerRadius = innerRadius * 1.1;

    d3.json('account-history.json', function(response) {
        var nodeList = getNodeList(response);
        
        var indexByName = {},
            nameByIndex = {},
            matrix = [],
            n = 0;

        var names = [];
        var shortnames = [];

        // Compute a unique index for each package name.
        nodeList.forEach(function(d) {
            {
              const nameOfD = name(d.account);
              if (!(nameOfD in indexByName)) {
                  nameByIndex[n] = nameOfD;
                  indexByName[nameOfD] = n++;
                  const longNameOfD = nameOfD + ' ' + formatBytes3(d.balance);
                  names.push(longNameOfD);
                  shortnames.push(nameOfD);
                  console.log(longNameOfD);
              }
            }
        });

        // Construct a square matrix counting package imports.
        nodeList.forEach(function(d) {
            const accountName = name(d.account);
            var source = indexByName[accountName],
                row = matrix[source];
            if (!row) {
                row = matrix[source] = [];
                for (var i = -1; ++i < n;) row[i] = 0;
            }
            // row[source] = d.balance;
            for (const [key, value] of Object.entries(d.history)) {
              const nameOfD = name(key);
              const balance = parseInt(value);
              const longNameOfD = name(d.account) + '->' + nameOfD + ' ' + formatBytes3(balance);
              console.log(longNameOfD);
                // row[indexByName[name(key)]]+= value;
                row[indexByName[name(key)]] += balance;
            }
        });

        //console.log(matrix);

        var colors = ['#301E1E', '#083E77', '#342350', '#567235', '#8B161C', '#DF7C00'];

        // //////////////////////////////////////////////////////////
        // ///////// Create scale and layout functions //////////////
        // //////////////////////////////////////////////////////////

        var colors = d3.scaleOrdinal()
            .domain(d3.range(names.length))
            .range(colors);

        var chord = d3.chord()
            .sortChords(d3.descending)

        var arc = d3.arc()
            .innerRadius(innerRadius * 1.01)
            .outerRadius(outerRadius);

        var path = d3.ribbon()
            .radius(innerRadius);

        // //////////////////////////////////////////////////////////
        // //////////////////// Create SVG //////////////////////////
        // //////////////////////////////////////////////////////////

        svg = d3.select('#chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')')
            .datum(chord(matrix));

        // //////////////////////////////////////////////////////////
        // //////////////// Draw outer Arcs /////////////////////////
        // //////////////////////////////////////////////////////////

        var outerArcs = svg.selectAll('g.group')
            .data(function(chords) {
                return chords.groups;
            })
            .enter().append('g')
            .attr('class', 'group')
            .on('mouseover', fade(.1))
            .on('mouseout', fade(opacityDefault))

            // text popups
            .on('click', mouseoverChord)
            .on('mouseout', mouseoutChord);

        outerArcs.append('path')
            .style('fill', function(d) {
                return colors(d.index);
            })
            .attr('id', function(d, i) {
                return 'group' + d.index;
            })
            .attr('d', arc);



        outerArcs.append('text')
            .attr('x', 6)
            .attr('dy', 15)
            .append('textPath')
            .attr('xlink:href', function(d) {
                return '#group' + d.index;
            })
            .text(function(chords, i) {
                return shortnames[i];
            })
            .style('fill', 'white');


        // //////////////////////////////////////////////////////////
        // //////////////////// Append names ////////////////////////
        // //////////////////////////////////////////////////////////

        // Append the label names on the outside
        outerArcs.append('text')
            .each(function(d) {
                d.angle = (d.startAngle + d.endAngle) / 2;
            })
            .attr('dy', '.35em')
            .attr('class', 'titles')
            .attr('text-anchor', function(d) {
                return d.angle > Math.PI ? 'end' : null;
            })
            .attr('transform', function(d) {
                return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' +
                    'translate(' + (outerRadius + 10) + ')' +
                    (d.angle > Math.PI ? 'rotate(180)' : '');
            })
            .text(function(d, i) {
                return names[i];
            });

        // //////////////////////////////////////////////////////////
        // //////////////// Draw inner chords ///////////////////////
        // //////////////////////////////////////////////////////////

        svg.selectAll('path.chord')
            .data(function(chords) {
                return chords;
            })
            .enter().append('path')
            .attr('class', 'chord')
            .style('fill', function(d) {
                return colors(d.source.index);
            })
            .style('opacity', opacityDefault)
            .attr('d', path);
    });

    // //////////////////////////////////////////////////////////
    // //////////////// Extra Functions /////////////////////////
    // //////////////////////////////////////////////////////////

    function popup() {
        return function(d, i) {
            console.log('love');
        };
    } // popup

    // Returns an event handler for fading a given chord group.
    function fade(opacity) {
        return function(d, i) {
            svg.selectAll('path.chord')
                .filter(function(d) {
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style('opacity', opacity);
        };
    } // fade

    // Highlight hovered over chord
    function mouseoverChord(d, i) {

        // Decrease opacity to all
        svg.selectAll('path.chord')
            .transition()
            .style('opacity', 0.1);
        // Show hovered over chord with full opacity
        d3.select(this)
            .transition()
            .style('opacity', 1);
    }
    // Bring all chords back to default opacity
    function mouseoutChord(d) {
        // Set opacity back to default for all
        svg.selectAll('path.chord')
            .transition()
            .style('opacity', opacityDefault);
    } // function mouseoutChord

}