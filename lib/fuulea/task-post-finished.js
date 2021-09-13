const superagent = require('superagent');
const util = require('util');

const URL = "https://api.fuulea.com/v2/tasks/%s/detail/%s/mark-finish/";

module.exports = async (taskId,detailId) => {
  let res = await superagent
    .post(util.format(URL,taskId,detailId))
    .set(getHeader());
  console.log("Mark Finish【%s-%s】%s", taskId, detailId, res.body.status);
}