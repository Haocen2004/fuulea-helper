// https://api.fuulea.com/api/login/check/
const superagent = require('superagent');
const fs = require('fs');

const URL = 'https://api.fuulea.com/api/login/check/';

module.exports = async () => {

  let res = await superagent.get(URL).set(getHeaderNoAuth());
  console.log("Refresh userdata【%s】%s", res.body.userName, res.body.authenticated);
  if (!res.body.authenticated) {
      return "刷新失败";
  }
  var config = require('./../../config.json');
  config['authKey'] = 'jwt '+res.body.token;
//   console.log(config);
  var jsonstr = JSON.stringify(config);
  fs.writeFile('./../../config.json', jsonstr, function(err) {
    if (err) {
        console.log(err);
        return "文件写入失败";
    //   botLog(qq,err,type,msgId);
    } else {
        return "修改成功";
    //   botLog(qq,'修改成功',type,msgId);
    }    
  });

}