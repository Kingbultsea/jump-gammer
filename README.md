# jump-gammer
![npm](https://img.shields.io/badge/npm-v6.13.1-blue)
![typescript](https://img.shields.io/badge/typescript-v3.4.3-blue)
![vue-cli](https://img.shields.io/badge/vue--cli-v3.11.0-blue)
![node](https://img.shields.io/badge/node-v10.0.0-blue)
![PixiJS](https://img.shields.io/badge/PixiJS-v5.0.0-green)

这很简单，先这样再这样（= = 哈哈哈，做的时候就各种红了）。这个项目是我上一年参加虎牙小程序比赛，留下的（不知道现在虎牙小程序凉凉了没）。
那时候遇到了各种部署上去的问题，通宵了两晚修改pixi和pixi-spine的源码，遗憾的是错过了比赛提交的时间节点。所以这就是，
那个stone（人物踩在上方的，落脚物）为什么是HuyaLogo的原因。

所以把这个项目拉出来，修改成web页面，http升级成websocket，做个基本游戏的示范教程吧。

[项目示例](http://web.debug.psy-1.com/cosleep/dragonboat?from=singlemessage)，欢迎提issues。

## 预览图
![img](https://res.psy-1.com/FiAOzARZUwWuN7F2TAbO9_5S3K3V)
![img](https://res.psy-1.com/Ft76gwt3zotcYtC5Dfl3UmW3l7Fq)
![img](https://res.psy-1.com/FigPdtJYbtwOUDP4oe9JGyT--dB3)

## Demo Getting Started
```shell script
# npm i
# npm run serve
```
最后，简单粗暴的git clone 服务器
```shell script
# npm i
# tsnd --respawn ./src/serve-1.0.1.ts
```
完成，哪里报错改哪里。

## 工具
* mvc或者mvvm框架，自己喜欢就行，用自己熟悉的。
* PixiJS，PixiJS是啥？
PixiJS是一个超快的2D渲染引擎。它自动侦测使用 WebGL 或者 Canvas。开发者无需专门学习 WebGL 就能感受到强大的硬件加速的力量。
emm，反正就是一个很厉害的东西（网易哒哒最喜欢PixiJS了，我一开始研究他们的H5，他们就是用PixiJS实现各种好玩的交互的）。
* pixi-spine，骨架。使制作好的动画可以加载于Pixi，可以调用方法来进行动画播放。
* TypeScript，静态类型检查工具，游戏状态类型多，一定一定要用，不然修改对象类型根本无从下手。
* git，版本管理工具，顺便要说的是，要遵循常用Gitflow工作流程，大型的游戏一个人根本开发不来（虽然这不是大型游戏，但是建议哦，从小做起）。
* docker/cdn，部署项目用的，这个项目是基于cdn的，喜欢折腾自己的可以像这个游戏的服务器一样使用docker+travis。
* night-watch，e2e测试，本游戏需要4个玩家，不想心累的可以写e2e测试。
* 微信分享，微信获取名称，自己手写吧。

## 教程
### 游戏需求
游戏需要四位玩家，每位玩家只能控制三个位置，所移动到的位置如果有且仅有一位玩家到达，那么获得该位置得得分，否制大家都获得不了分数。
游戏房主在创建房间的时候，如果退出房间，该房间解散，玩家们需要重新选择房间或创建房间。

![img](https://res.psy-1.com/FlkPBGh47Y3hW10bN1T3IHNLTbQk) （真简单）

### 工具配置

### Sprite
Sprite是啥？是一个模型，然后再贴上一点图（texture）。Pixi.Sprite自带很多方法，根据我们的游戏需求，
了解相关Api即可。

#### 人物sprite
创建人物Sprite，人物？人物起码会动吧？面部表情？身体动作？那我们是不是要建造一个容器，容器里面包括无数sprite或者无数子容器，比如人物的手、脸部、头部等。
emmm，这也太难了吧？光是把sprite组合起来就已经麻烦了，而且还要按照规律来移动手臂，身体，脸部表情。
怎么办？pixi-spine走起。
#### stone sprite
#### 跳跃sprite
#### 灰尘sprite
#### 气泡Sprite


### Action
#### 移动路线
#### 移动方向判断


### 碰撞
#### stone与人物保持x距离
#### 人物碰撞（性能优化，条件性判断碰撞）
#### 碰撞相关特效展示


### 游戏进入流程图
### 游戏规则
### 服务器逻辑状态处理
