const superagent = require('superagent');
const util = require('util');

const URL = 'https://api.fuulea.com/api/task/%s/';

module.exports = async (taskId) => {

  let res = await superagent.get(util.format(URL, taskId)).set(getHeader());
  console.log("Task Detail【%s】 %s", taskId, res.body.success);
  return res.body;

}