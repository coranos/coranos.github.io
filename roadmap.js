const tasks = [];


const taskStatus = {
    "SUCCEEDED": "bar-succeeded",
    "FAILED": "bar-failed",
    "RUNNING": "bar-running",
    "NOT STARTED": "bar-not-started",
    "KILLED": "bar-killed"
};

const margin = {
    top: 5,
    right: 5,
    bottom: 20,
    left: 300
};

const format = "%Y-%m-%d";

const callback = (response) => {
    response.forEach((elt) => {
        elt.startDate = new Date(elt.startDate);
        elt.endDate = new Date(elt.endDate);
        tasks.push(elt);
    });

    const taskNames = [];

    tasks.forEach((task) => {
      taskNames.push(task.taskName);
    });

    tasks.sort((a, b) => {
        return a.endDate - b.endDate;
    });
    
    const maxDate = tasks[tasks.length - 1].endDate;
    
    tasks.sort((a, b) => {
        return a.startDate - b.startDate;
    });
    
    const minDate = tasks[0].startDate;

    const chartHeight = tasks.length * 25;

    const gantt = d3.gantt(1024, chartHeight, margin, 5, 5).taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);

    gantt("#hardware-wallet-gantt", tasks);
}

const onLoad = () => {
    loadJson('roadmap.json', callback);
}