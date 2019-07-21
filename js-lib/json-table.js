function jsonTable(id, options) {
	var thead = $(id + ' thead');
	if (!options.trClass) {
		thead = thead.append("<tr></tr>\n");
	} else {
		thead = thead.append("<tr class='" + options.trClass + "'></tr>\n");
	}

	for (var i = 0; i < options.head.length; i++) {
		let thStr = "<th";
		if (options.sortTable) {
			thStr += " onclick='sortTable(\"" + id + "\"," + i + ")'";
		}
		if (options.thClass) {
			thStr += " class='" + options.thClass + "'";
		}
		thStr += ">" + options.head[i] + "</th>\n";
		$(id + ' tr').append(thStr);
	}

	$(id).find('tbody').empty();
}

function jsonTableCallbackFromWorker(id, options, data) {
	updateFromObj(data, options, id, options.trClass, options.tdClass, options.callback, options.preprocess);
}

function jsonTableUpdate(id, options) {
	$.ajaxSetup({
		beforeSend : function(xhr) {
			if (xhr.overrideMimeType) {
				xhr.overrideMimeType("application/json");
			}
		}
	});
	$.getJSON(options.source, function(data) {
		updateFromObj(data, options, id, options.trClass, options.tdClass, options.callback, options.preprocess);
	});
}

function makeRow(response, options, trclass, tdclass) {
	var row = "";
	let data = response.results;

	for (var i = 0; i < data.length; i++) {
		if (!trclass) {
			row += "<tr>";
		} else {
			row += "<tr class='" + trclass + "'>";
		}

		for (let j = 0; j < options.json.length; j++) {
			if (!tdclass) {
				row += "<td>" + data[i][options.json[j]] + "</td>";
			} else {
				row += "<td class='" + tdclass + "'>" + data[i][options.json[j]] + "</td>";
			}
		}
		row += "</tr>";
	}
	return row;
}

function updateFromObj(response, options, id, trclass, tdclass, callback, preprocess) {
	if (typeof preprocess == "function") {
		preprocess(response);
	}

	let row = makeRow(response, options, trclass, tdclass);

	$(id).find('tbody').append(row);

	if (typeof callback == "function") {
		callback(response);
	}
}

function sortTable(id, n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	var table = $(id).get(0);
	switching = true;
	// Set the sorting direction to ascending:
	dir = "asc";
	/*
	 * Make a loop that will continue until no switching has been done:
	 */
	while (switching) {
		// start by saying: no switching is done:
		switching = false;
		rows = table.getElementsByTagName("TR");
		/*
		 * Loop through all table rows (except the first, which contains table
		 * headers):
		 */
		for (i = 1; i < (rows.length - 1); i++) {
			// start by saying there should be no switching:
			shouldSwitch = false;
			/*
			 * Get the two elements you want to compare, one from current row
			 * and one from the next:
			 */
			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
			/*
			 * check if the two rows should switch place, based on the
			 * direction, asc or desc:
			 */
			if (dir == "asc") {
				if (compare(x, y)) {
					// if so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			} else if (dir == "desc") {
				if (compare(y, x)) {
					// if so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			/*
			 * If a switch has been marked, make the switch and mark that a
			 * switch has been done:
			 */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			// Each time a switch is done, increase this count by 1:
			switchcount++;
		} else {
			/*
			 * If no switching has been done AND the direction is "asc", set the
			 * direction to "desc" and run the while loop again.
			 */
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}

function compare(x, y) {
	let xNoComma = x.innerHTML.toString().replace(/,/g, "");
	let yNoComma = y.innerHTML.toString().replace(/,/g, "");

	if (isNaN(xNoComma) || isNaN(yNoComma)) {
		// console.log("sort as string " + xNoComma + " " + yNoComma);
		return x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase();
	}
	// console.log("sort as number " + xNoComma + " " + yNoComma);
	let xNum = +xNoComma;
	let yNum = +yNoComma;
	// console.log("sort as number " + xNum + ">" + yNum);
	return xNum > yNum;
}
