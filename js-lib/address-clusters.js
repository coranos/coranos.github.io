function loadAddressClustersCallback(response) {
	var data = response;

	var divList = document.getElementsByClassName("address-cluster");
	for (let divIx = 0; divIx < divList.length; divIx++) {
		let div = divList[divIx];

		let cy = cytoscape({
			container : div,
			boxSelectionEnabled : false,
			autounselectify : true,
			layout : {
				// name : "circle"
				name : "cose"
			},
			style : [ {
				selector : "node",
				style : {
					"height" : 20,
					"width" : 20,
					"background-color" : "#18e018"
				},
			}, {
				selector : "edge",
				style : {
					"curve-style" : "haystack",
					"haystack-radius" : 0,
					"width" : 5,
					"opacity" : 1.0,
					"line-color" : "#000000"
				}
			} ],
			elements : data[div.id]
		});

		cy.$(".cy-neo-node").qtip({
			content : function() {
				let scratch = this._private.scratch;
				let label = scratch.label;
				return label;
			},
			position : {
				my : 'top center',
				at : 'bottom center'
			},
			style : {
				classes : 'qtip-bootstrap',
				tip : {
					width : 16,
					height : 8
				}
			}
		});
	}
};