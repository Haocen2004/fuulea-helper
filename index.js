const _ = require('lodash');
const async = require('async');
const utils = require('./lib/utils');
const getTask = require('./lib/fuulea/task-get-list');
const taskGetDetail = require('./lib/fuulea/task-get-detail');
const taskPostFinished = require('./lib/fuulea/task-post-finished');
const { Bot, Message, Middleware } = require('mirai-js');
const { reduce } = require('lodash');
const taskGetPaper = require('./lib/fuulea/task-get-paper');
const taskPostFinishedC = require('./lib/fuulea/task-post-finished-c');
const sessionRefresh = require('./lib/fuulea/session-refresh');
const taskCalcUnfinished = require('./lib/fuulea/task-calc-unfinished');
const config = require('./config.json');
// Init
require('./lib/global').init();

console.log('init fuulea helper.');

const bot = new Bot();
const botLog = async function (qq, msg, type, msgId) {
  var message;
  if (!(msg instanceof Message)) {
    message = new Message().addText(msg);
  } else {
    message = msg;
  }
  console.log('S: qq:%s type:%s msgId:%s\ntext:%s', qq, type, msgId, msg);
  if (type == 0) {
    return await bot.sendMessage({
      // 好友 qq 号
      friend: qq,
      // Message 实例，表示一条消息
      message: message
    });
  }
  if (type == 1) {
    return await bot.sendMessage({
      temp: true,
      // 好友 qq 号
      friend: qq,
      // Message 实例，表示一条消息
      message: message
    });
  }
  if (type == 2) {
    if (msgId == 0) {
      return await bot.sendMessage({
        // 好友 qq 号
        group: qq,
        message: message
      });
    } else {
      return await bot.sendMessage({
        // 好友 qq 号
        group: qq,
        quote: msgId,
        // Message 实例，表示一条消息
        message: message
      });
    }
  }
}


const init = async function () {
  console.log('connect to mirai...');
  try {
    await bot.open({
      baseUrl: config.miraiUrl,
      authKey: config.miraiKey,
      // 要绑定的 qq，须确保该用户已在 mirai-console 登录
      qq: 481265720
    });
  } catch (error) {
    console.log(error);
    return;
  }
  console.log('conneted, add message handle...')
  bot.on(['FriendMessage', 'GroupMessage', 'TempMessage', 'StrangerMessage'], new Middleware()
    .textProcessor()
    .done(async data => {
      var qq, type, msgId, sName;
      if (data.type == 'FriendMessage') {
        qq = data.sender.id;
        type = 0;
        msgId = 0;
        sName = data.sender.nickname;
      }
      if (data.type == 'TempMessage') {
        qq = data.sender.id;
        type = 1;
        msgId = 0;
        sName = data.sender.nickname;
      }
      if (data.type == 'StrangerMessage') {
        qq = data.sender.id;
        type = 1;
        msgId = 0;
        sName = data.sender.nickname;
      }
      if (data.type == 'GroupMessage') {
        qq = data.sender.group.id;
        type = 2;
        msgId = data.messageChain[0].id;
        sName = data.sender.group.name + '-' + data.sender.memberName;
      }
      console.log('R: qq:%s-%s type:%s msgId:%s\ntext:%s', qq, sName, type, data.messageChain[0].id, data.text);
      var msg = data.text.split(' ');
      try {

        if (msg[0].indexOf("#") == 0) {
          if (msg[0].indexOf('mt') == 1) {
            if (msg[1].indexOf('calc') == 0) {
              var acceptSubject = [1,2,3,6,7,9];
              if (msg.length >= 2 && msg[2].indexOf('list') == 0 ) {
                botLog(qq,'1-数学\n2-化学\n3-物理\n6-英语\n7-语文\n9-地理',type,msgId);
                return;
              }
              if (msg.length < 3) {
                // botLog(qq,/)
                botLog(qq,'Not enough args!\nUsage:\n#mt calc <subjectId> <taskCount(1-20)> [skipCount(1-20)]');
                return;
              }
              var maxCount = parseInt(msg[3]);
              if (maxCount >= 1 && maxCount <= 20) {
                if (msg[2].indexOf('all') == 0) {
                  var skipCount = 0;
                  if (msg.length >= 5) {
                    skipCount = parseInt(msg[4]);
                  }
                  var leftTime = maxCount + 6;
                  botLog(qq,'请稍候，遍历数据需要一定时间\n预计每学科需要 '+leftTime+' 秒',type,msgId);
                  var start_ts = (new Date()).valueOf();
                  await botLog(qq,''+await taskCalcUnfinished(7,maxCount,skipCount),type,msgId);
                  await botLog(qq,''+await taskCalcUnfinished(1,maxCount,skipCount),type,msgId);
                  await botLog(qq,''+await taskCalcUnfinished(6,maxCount,skipCount),type,msgId);
                  await botLog(qq,''+await taskCalcUnfinished(3,maxCount,skipCount),type,msgId);
                  await botLog(qq,''+await taskCalcUnfinished(2,maxCount,skipCount),type,msgId);
                  await botLog(qq,''+await taskCalcUnfinished(9,maxCount,skipCount),type,msgId);
                  var end_ts = (new Date()).valueOf();
                  var total_ts = end_ts - start_ts;
                  await botLog(qq,"统计完成 共耗时 "+total_ts+"ms",type,msgId);
                  return;
                }
                var subjectId = parseInt(msg[2]);
                var skipCount = 0;
                if (msg.length >= 5) {
                  skipCount = parseInt(msg[4]);
                }
                if (!acceptSubject.includes(subjectId)) {
                  botLog(qq,'subjectID错误！可选id:\n1-数学\n2-化学\n3-物理\n6-英语\n7-语文\n9-地理',type,msgId);
                  return;
                }
                var leftTime = maxCount + 5;
                botLog(qq,'请稍候，遍历数据需要一定时间\n预计需要 '+leftTime+' 秒',type,msgId);
                botLog(qq,''+await taskCalcUnfinished(subjectId,maxCount,skipCount),type,msgId);
                return;
              } else {
                botLog(qq,'统计任务数过多！可选范围1-20',type,msgId);
              }
            }
            if (msg[1].indexOf('ref') == 0) {
              botLog(qq, await sessionRefresh()+"", type, msgId);
              return;
            }
            if (msg[1].indexOf('set') == 0) {
              if (msg.length < 3) {
                botLog(qq, 'Wrong args\nauthKey sid', type, msgId);
                return;
              }
              if (data.sender.id != config.adminQQ) {
                botLog(qq, 'You can\'t do this', type, msgId);
                return;
              }
              var fs = require('fs');
              var config = require('./config');
              var newStr = '';
              for (let index = 3; index < msg.length; index++) {
                newStr = newStr + msg[index] + ' ';
              }
              config[msg[2]] = newStr.substr(0, newStr.length - 1);
              console.log(config);
              var jsonstr = JSON.stringify(config);
              fs.writeFile('./config.json', jsonstr, function (err) {
                if (err) {
                  botLog(qq, err, type, msgId);
                } else {
                  botLog(qq, '修改成功', type, msgId);
                }
              });
            }
            if (msg[1].indexOf('mark') == 0) {
              let data2 = await getTask(false, 1, false);
              var tasks = new Array();
              var tasksDetail = new Array();
              var retmsg = '';
              data2.forEach(element => {
                // console.log(element);
                if (element.title.indexOf("错题重练") < 0) {
                  tasks.push(element.id);
                  retmsg = retmsg + element.title + '-' + element.subject_name + '\n';
                }
              });
              botLog(qq, retmsg + "Tasks Count: " + tasks.length, type, msgId);
              await utils.randomSleepAsync();

              await async.eachSeries(tasks, async (element) => {
                let detail = await taskGetDetail(element);
                tasksDetail.push(detail);
                await utils.randomSleepAsync();

              });
              var totalMark = 0;
              await async.eachSeries(tasksDetail, async (element) => {
                await async.eachSeries(element.detail, async (element2) => {
                  if (element2.type == 4 && !element2.is_finished) {
                    await taskPostFinished(element.id, element2.id);
                    totalMark = totalMark + 1;
                    botLog(qq, "Marked Task: " + element.title + "-" + element2.title, type, msgId);
                    await utils.randomSleepAsync();
                  }
                  if (element2.type == 1 && !element2.is_finished) {
                    await taskPostFinishedC(element.id, element2.chapter_id);
                    totalMark = totalMark + 1;
                    botLog(qq, "Marked Task: " + element.title + "-" + element2.title, type, msgId);
                    await utils.randomSleepAsync();
                  }
                });
              });

              botLog(qq, "Marked Count:" + totalMark, type, msgId);
              return;
            }
            if (msg[1].indexOf('tasks') == 0) {
              var finished = false;
              var favorite = false;
              var page = 1;
              msg.forEach(e => {
                if (e.indexOf('-f') == 0) {
                  finished = true;
                }
                if (e.indexOf('-l') == 0) {
                  favorite = true;
                }
              })
              if (msg[2] != undefined) {
                if (parseInt(msg[2]) >= 2) page = parseInt(msg[2]);
              }
              console.log(finished);
              console.log(page);
              console.log(favorite);
              let data2 = await getTask(finished, page, favorite);
              var retmsg = '';
              data2.forEach(element => {
                // console.log(element);
                if (element.title.indexOf("错题重练") < 0) {
                  retmsg = retmsg + element.id + '-' + element.title + '-' + element.subject_name + '\n';
                }
              });
              botLog(qq, retmsg, type, msgId);
              return;
            }
            if (msg[1].indexOf("detail") == 0) {
              if (msg.length < 3) {
                botLog(qq, "Need More Args!", type, msgId);
                return;
              }
              let ret = await taskGetDetail(msg[2]);
              console.log(ret);
              botLog(qq,
                ret.id + '-' + ret.title + '-' + ret.subject_name + '\n' +
                '发布老师: ' + ret.first_name + '\n' +
                '发布时间: ' + ret.published_at + '\n' +
                '截止时间: ' + ret.end_at + '\n' +
                '未完成列表：' + ret.unfinished_students + '\n' +
                '总计 ' + ret.unfinished_students.length + ' 人'
                , type, msgId
              );

              await async.eachSeries(ret.detail, async (detail) => {
                if (detail.paper_id != undefined) {
                  var paperDetail = await taskGetPaper(detail.paper_id);
                  // console.log(paperDetail);
                  if (paperDetail.attachments != undefined) {
                    paperDetail.attachments.forEach(att => {
                      botLog(qq, '附件名称: ' + att.name + '\n下载链接: ' + att.source_file, type, msgId);
                    })
                  }
                }
                if (detail.attachments != undefined) {
                  detail.attachments.forEach(att => {
                    botLog(qq, '附件名称: ' + att.name + '\n下载链接: ' + att.source_file, type, msgId);
                  })
                }

              });
            }
          }

        }

      } catch (error) {
        botLog(config.adminQQ, "Bot Error\n" + error, 0, 0);
      }
    }))

  bot.on('BotOfflineEventForce',
    new Middleware()
      .autoReLogin({
        baseUrl: config.miraiUrl,
        authKey: config.miraiKey,
        password: '' // If you need auto relogin, fill it.
      })
      .done(async data => {
        console.log('Bot Relogin.');
        botLog(config.adminQQ, 'Bot Relogin.', 0, 0);
        console.log(data);
      })
  );

  bot.on('NewFriendRequestEvent', new Middleware()
    .friendRequestProcessor()
    .done(async data => {
      data.agree();
    }));

  await bot.sendMessage({
    // 好友 qq 号
    friend: config.adminQQ,
    // Message 实例，表示一条消息
    message: new Message().addText('Bot Started.')//.addImageUrl('https://chinosk.top/img/cu')
  });
  console.log('bot started.');
  return;

};

init();
