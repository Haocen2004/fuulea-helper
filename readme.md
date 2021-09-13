# fuulea helper
基于 Mirai HTTP API 的 辅立码课 第三方客户端 

## 使用
- 需要已经部署好的 mirai http 接口
- 需要 nodejs 12+
- 复制 config.json.example 为 config.json 并修改内容

开始运行
```bash
npm install / yarn
node index.js
```
## 指令 
常规
- #mt tasks [pages] [-fl] 获取第1/[pages]页任务列表 -f 已完成的 -l 收藏的
- #mt mark [pages] 遍历1/[pages]页任务 并将所有只需要标记未完成的自动标记
- #mt detail <taskId> 获取任务详情 有附件的会包括附件下载直连
- #mt calc <subjectId|list|all> [maxCount] [skipCount] 统计任务未完成人数 获取学科id列表 

管理员
- #mt set <config文件key> <value> 复写config.json文件内容
- #mt ref 刷新登陆状态

## 注意事项
- 私聊群聊均可用 
- 会自动接受好友申请
- 所有聊天内容将会输出到控制台 无日志文件系统

## 后记
辣鸡敏特 电子垃圾卖那么贵  
联发科可以spflash 强刷  
高通可以9008强刷  
听说最近换了华为平板麒麟核心不是很好搞  
Hao_cen 2021.9.13