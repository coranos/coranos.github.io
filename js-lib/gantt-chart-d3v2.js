/**
 * @author Dimitry Kudrayvtsev
 * @version 2.0
 * 
 * Ported to d3 v4 by Keyvan Fatehi on October 16th, 2016
 */

d3.gantt = function(width, height, margin, rx, rx) {
	var FIT_TIME_DOMAIN_MODE = "fit";
	var FIXED_TIME_DOMAIN_MODE = "fixed";

	var timeDomainStart = d3.timeDay.offset(new Date(), -3);
	var timeDomainEnd = d3.timeHour.offset(new Date(), +3);
	var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
	var taskTypes = [];
	var taskStatus = [];

	var tickFormat = "%H:%M";

	var keyFunction = function(d) {
		return d.startDate + d.taskName + d.endDate;
	};

	var rectTransform = function(d) {
		return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
	};

	var rx = rx, ry = ry;

	var x, y, xAxis, yAxis;

	initAxis();

	var initTimeDomain = function() {
		if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
			if (tasks === undefined || tasks.length < 1) {
				timeDomainStart = d3.time.day.offset(new Date(), -3);
				timeDomainEnd = d3.time.hour.offset(new Date(), +3);
				return;
			}
			tasks.sort(function(a, b) {
				return a.endDate - b.endDate;
			});
			timeDomainEnd = tasks[tasks.length - 1].endDate;
			tasks.sort(function(a, b) {
				return a.startDate - b.startDate;
			});
			timeDomainStart = tasks[0].startDate;
		}
	};

	function initAxis(taskHeight) {
		x = d3.scaleTime().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

		y = d3.scaleBand().domain(taskTypes).rangeRound([ 0, taskHeight ], .1);

		xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat(tickFormat)).tickSize(8).tickPadding(8);

		yAxis = d3.axisLeft().scale(y).tickSize(0);
	}

	function gantt(id, tasks) {

		var chartHeight = (height - (margin.top + margin.bottom));
		var taskHeight = (chartHeight / tasks.length) - 1;

		initTimeDomain();
		initAxis(chartHeight);

		var svg = d3.select(id).append("svg").attr("class", "chart").attr("width", width + margin.left + margin.right).attr("height",
				height + margin.top + margin.bottom).append("g").attr("class", "gantt-chart").attr("width", width + margin.left + margin.right).attr("height",
				height + margin.top + margin.bottom).attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

		svg.selectAll(".chart").data(tasks, keyFunction).enter().append("rect").attr("rx", rx).attr("ry", ry).attr("class", function(d) {
			if (taskStatus[d.status] == null) {
				return "bar";
			}
			return taskStatus[d.status];
		}).attr("y", 0).attr("transform", rectTransform).attr("height", function(d) {
			return taskHeight;
		}).attr("width", function(d) {
			return (x(d.endDate) - x(d.startDate));
		});

		svg.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")").transition().call(xAxis);

		svg.append("g").attr("class", "y axis").transition().call(yAxis);

		return gantt;

	}
	;

	gantt.redraw = function(tasks) {

		initTimeDomain();
		initAxis();

		var svg = d3.select("svg");

		var ganttChartGroup = svg.select(".gantt-chart");
		var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

		rect.enter().insert("rect", ":first-child").attr("rx", 5).attr("ry", 5).attr("class", function(d) {
			if (taskStatus[d.status] == null) {
				return "bar";
			}
			return taskStatus[d.status];
		}).transition().attr("y", 0).attr("transform", rectTransform).attr("height", function(d) {
			return y.range()[1];
		}).attr("width", function(d) {
			return (x(d.endDate) - x(d.startDate));
		});

		rect.transition().attr("transform", rectTransform).attr("height", function(d) {
			return y.range()[1];
		}).attr("width", function(d) {
			return (x(d.endDate) - x(d.startDate));
		});

		rect.exit().remove();

		svg.select(".x").transition().call(xAxis);
		svg.select(".y").transition().call(yAxis);

		return gantt;
	};

	gantt.margin = function(value) {
		if (!arguments.length)
			return margin;
		margin = value;
		return gantt;
	};

	gantt.timeDomain = function(value) {
		if (!arguments.length)
			return [ timeDomainStart, timeDomainEnd ];
		timeDomainStart = +value[0], timeDomainEnd = +value[1];
		return gantt;
	};

	/**
	 * @param {string}
	 *            vale The value can be "fit" - the domain fits the data or
	 *            "fixed" - fixed domain.
	 */
	gantt.timeDomainMode = function(value) {
		if (!arguments.length)
			return timeDomainMode;
		timeDomainMode = value;
		return gantt;

	};

	gantt.taskTypes = function(value) {
		if (!arguments.length)
			return taskTypes;
		taskTypes = value;
		return gantt;
	};

	gantt.taskStatus = function(value) {
		if (!arguments.length)
			return taskStatus;
		taskStatus = value;
		return gantt;
	};

	gantt.width = function(value) {
		if (!arguments.length)
			return width;
		width = +value;
		return gantt;
	};

	gantt.height = function(value) {
		if (!arguments.length)
			return height;
		height = +value;
		return gantt;
	};

	gantt.tickFormat = function(value) {
		if (!arguments.length)
			return tickFormat;
		tickFormat = value;
		return gantt;
	};

	return gantt;
};
