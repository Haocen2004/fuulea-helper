const superagent = require('superagent');
const util = require('util');
const utils = require('../utils');

const URL = 'https://api.fuulea.com/api/task/?finished=%s&page=%s&favorite=%s&subjectId=%s';

module.exports = async (finished,page,favorite,subjectId) => {

  if (subjectId == undefined) {
    subjectId = -1;
  }
  if (page > 1) {
    var ret = new Array();
    for (let index = 1; index <= page; index++) {
      let res = await superagent.get(util.format(URL,finished,index,favorite,subjectId)).set(getHeader());
      res.body.data.forEach(element => {
        // console.log(element);
        ret.push(element);
      });
      console.log("Get Tasks [%s]: %s",index,res.body.success);
      await utils.randomSleepAsync();
    }
    return ret;
  } else {
    let res = await superagent.get(util.format(URL,finished,page,favorite,subjectId)).set(getHeader());
    console.log("Get Tasks: %s",res.body.success);
    return res.body.data;
  }
}