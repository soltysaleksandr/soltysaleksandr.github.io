var Task = (function () {
    var id = 0;
    return function (params) {
        var defaultStartDate = new Date(),
            defaultEndtDate = new Date();
        defaultEndtDate.setSeconds(defaultStartDate.getSeconds() + 10);
        this.id = String(id++);
        this.title = params.title;
        this.description = params.description;
        this.start = params.start || defaultStartDate;
        this.end = params.end || defaultEndtDate;
    }
}())


Task.prototype.check = function () {
    var currentDate = Math.round(new Date().getTime() / 1000),
        startDate = Math.round(this.start.getTime() / 1000),
        endDate = Math.round(this.end.getTime() / 1000);
    var li = document.getElementById(this.id),
        listPending = document.getElementById('listPending'),
        listPerform = document.getElementById('listPerform'),
        listFinished = document.getElementById('listFinished');

    if (startDate > currentDate && !(listPending.contains(li))) {
        this.renderLi(listPending);
    };
    if (startDate === currentDate) {
        this.renderLi(listPerform);
        this.removeFrom(listPending);
    };
    if (endDate === currentDate) {
        this.renderLi(listFinished);
        this.removeFrom(listPerform);
    };
}


Task.prototype.renderLi = function (elem) {
    var li = document.createElement('li');
    li.id = this.id;
    li.className = 'task-list__item';
    li.innerText = this.title;
    elem.appendChild(li);

    var span = document.createElement('span');
    span.classList.add('delete-btn', 'fas', 'fa-times');
    
    if (elem.id === 'listFinished') span.classList.remove('fas', 'fa-times');

    li.appendChild(span);
}


Task.prototype.removeFrom = function (elem) {
    li = document.getElementById(this.id);
    elem.removeChild(li);
}


function checkTask(array) {
    array.forEach(function (item) {
        item.check()
    });
    var listPending = document.getElementById('listPending');
    var listPerform = document.getElementById('listPerform');
    removeTask(listPending, array);
    removeTask(listPerform, array);
}


function removeTask(elem, array) {
    elem.addEventListener('click', function (event) {
        var target = event.target;
        array.forEach(function (item, index) {
            if (item.id === target.parentElement.id && target.tagName === 'SPAN') {
                array.splice(index, 1);
                elem.removeChild(target.parentElement);
            }
        })
    })
}


function clock(params) {
    setInterval(function () {
        var time = new Date(),
            hours = params.addZero(time.getHours()),
            minutes = params.addZero(time.getMinutes()),
            seconds = params.addZero(time.getSeconds());
        var div = document.getElementById('clock');
        div.innerText = hours + ' : ' + minutes + ' : ' + seconds;
        params.checkTask(params.array);
    }, 1000)
}


function taskGen(count, task) {
    var array = [];
    for (var i = 0; i < count; i++) {
        var start = new Date(),
            end = new Date();
        end.setSeconds(start.getSeconds() + 7 * i + 8);
        start.setSeconds(start.getSeconds() + 5 * i + 5);
        array.push(
            new task({
                title: 'title-' + i,
                description: 'description-' + i,
                start: start,
                end: end
            })
        )
    }
    return array;
}

function addZeroToClock(num) {
    num = num < 10 ? '0' + num : num;
    return num;
}


var arr = taskGen(5, Task);
console.log(arr);


clock({
    addZero: addZeroToClock,
    checkTask: checkTask,
    array: arr
});
