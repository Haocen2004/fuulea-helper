const _ = require('lodash');
const utils = require('./utils');
const config = require('./../config');

// const APP_VERSION = "2.2.0";
// const DEVICE_ID = utils.randomString(32).toUpperCase();
// const DEVICE_NAME = utils.randomString(_.random(1, 10));

const init = () => {
  // if (_.isEmpty(process.env.COOKIE_STRING)) {
  //   console.error("环境变量 COOKIE_STRING 未配置，退出...");
  //   process.exit();
  // };

  // console.log(`DEVICE_ID: ${DEVICE_ID}, DEVICE_NAME: ${DEVICE_NAME}`);

  global.getHeader = () => {

    let cookie = 'sessionid='+config.sid;
    return {
      'Cookie': cookie,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.1; Lenovo TB-X504F Build/NMF26F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Crosswalk/23.53.589.4 Safari/537.36',
      'Authorization': config.authKey,
      'serial': 'e1e9d3c4',
      'version': '1.7.0',
      'UUID': '3f0a96c7c34af990',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  global.getHeaderNoAuth = () => {

    let cookie = 'sessionid='+config.sid;
    return {
      'Cookie': cookie,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.1; Lenovo TB-X504F Build/NMF26F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Crosswalk/23.53.589.4 Safari/537.36',
      'serial': 'e1e9d3c4',
      'version': '1.7.0',
      'UUID': '3f0a96c7c34af990',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
}

module.exports = {
  init
}