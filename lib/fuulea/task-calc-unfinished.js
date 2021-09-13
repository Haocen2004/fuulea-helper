const getTask = require('./task-get-list');
const getDetail = require('./task-get-detail');
// const moment = require(moment);
const { randomSleepAsync } = require('../utils');
const moment = require('moment');

module.exports = async (subjectId,taskCount,skipCount) => {
    var dataMap = new Map();
    // console.log('try get tasks');
    let data = await getTask(false, 1, false, subjectId);
    await randomSleepAsync();
    // console.log('get tasks')
    data.forEach(element => {
    // console.log(element);
        if (element.title.indexOf("错题重练") < 0 && element.title.indexOf("安排表") <0) {
            dataMap.set(element.published_at,element.id);
        }
    });
    let data2 = await getTask(true, 1, false, subjectId);

    await randomSleepAsync();
    data2.forEach(element => {
        // console.log(element);
        if (element.title.indexOf("错题重练") < 0 && element.title.indexOf("安排表") <0) {
            dataMap.set(element.published_at,element.id);
        }
    });
    var arrayObj=Array.from(dataMap);
    arrayObj.sort(function(a,b){return a[0].localeCompare(b[0])});
    arrayObj.reverse();
    dataMap = new Map(arrayObj.map(i => [i[0], i[1]]));
    var unfinishedMap = new Map();
    var i = 1;
    var taskNames = new Array();
    var subjectName;
    for (let value of dataMap.values()) {
        if (skipCount != undefined && skipCount >0) {
            skipCount = skipCount -1;
            continue;
        }
        // console.log(key + " = " + value);
        var detail = await getDetail(value);
        taskNames.push(detail.title);
        detail.unfinished_students.forEach(name => {
            var currCount = unfinishedMap.get(name);
            if (currCount == undefined) {
                currCount = 0;
            }
            currCount++;
            unfinishedMap.set(name,currCount);
        });
        i++;
        if (i > taskCount) {
            subjectName = detail.subject_name;
            break;
        }
        await randomSleepAsync();
    }
    var result = subjectName+' 科\n姓名 - 未完成次数\n';
    var unfinishedArray=Array.from(unfinishedMap);
    unfinishedArray.sort(function(a,b){return a[0].localeCompare(b[0])});
    // arrayObj.reverse();
    unfinishedMap = new Map(unfinishedArray.map(i => [i[0], i[1]]));
    for (let [name, count] of unfinishedMap) {
        result = result + name + ' - ' + count + '\n' 
    }
    moment.locale('zh');
    result = result + '共 '+unfinishedMap.size +' 人\n统计任务列表： ' +taskNames.toString() +'\n统计时间：'+ moment().zone('+08:00').format();
    return result;
}
