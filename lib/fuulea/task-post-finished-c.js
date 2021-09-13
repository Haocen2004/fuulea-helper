const superagent = require('superagent');
const util = require('util');

const URL = "https://api.fuulea.com/api/chapters/%s/mark/?task_id=%s";

module.exports = async (taskId,chapterId) => {
  let res = await superagent
    .post(util.format(URL,chapterId,taskId))
    .set(getHeader());
  console.log("Mark Finish【%s-%s】%s", taskId, chapterId, res.body.status);
}