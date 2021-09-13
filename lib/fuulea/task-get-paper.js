const superagent = require('superagent');
const util = require('util');

const URL = 'https://api.fuulea.com/api/paper/%s/';

module.exports = async (paperId) => {

  let res = await superagent.get(util.format(URL, paperId)).set(getHeader());
  console.log("Paper Detail【%s】 %s", paperId, res.body.success);
  return res.body;

}