function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatBytes(a, b) {
    if (0 == a) return '0';
    var c = 1024,
        d = b || 2,
        e = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

function formatBytes3(a) {
    return formatBytes(a, 3);
}

// Returns the Flare package name for the given class name.
function name(account) {
    return account.substring(0, 12);
}

function getNodeList(response) {
    var nodeList = [];
    response.results.forEach(function(d) {
        nodeList.push(d);
    });

    nodeList.sort(function(a, b) {
        return b.balance - a.balance;
    });

    response.results.forEach(function(d) {
        d.balance = 0;
        for (const [key, value] of Object.entries(d.history)) {
            d.balance += parseInt(value);
        }
    });
    // nodeList.splice(0,2);

    const historyNodes = {};
    const historyNodeList = [];
    nodeList.forEach(function(d) {
        console.log('true node', name(d.account), formatBytes3(d.balance), Object.keys(d.history).length);
        historyNodes[d.account] = d.balance;
    });
    nodeList.forEach(function(d) {
        for (const [key, value] of Object.entries(d.history)) {
            if (!(key in historyNodes)) {
                const elt = {};
                elt.balance = value;
                elt.account = key;
                elt.history = {};
                elt.history[d.account] = value;
                historyNodeList.push(elt);
                historyNodes[key] = value;
            }
        }
    });

    nodeList = nodeList.concat(historyNodeList);
    return nodeList;
}