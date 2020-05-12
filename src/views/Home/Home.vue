<template>
    <div class='home'>
        <div class="background">
            <img src="./img/bg.jpg"/>
        </div>

        <!-- 规则介绍面板 -->
        <div class="mail-cell-template">
            <img class="mail-cell" src="./img/mailCell.png"/>
            <div class="content">
                <div>1.程序可授权或不授权，授权后会采用你的微信名称和头像来进行展示。</div>
                <div>2.游戏将进行5个回合，比拼谁捡的气泡数量最多。</div>
                <div>3.游戏人数必须达到4人才能启动，需要房间号才能进入游戏。不进行自动匹配</div>
                <div>4.你可以分享房间，让你的朋友加入。</div>
            </div>

            <div class="btn-template">
                <img class="bg" src="./img/button.png"/>
                <p @click="iKnow = true">我知道了</p>
            </div>
        </div>

        <!-- 加入设置信息面板 -->
        <div class="set-game-template" v-show="iKnow">
            <div v-show="gameStatusAction.length === 0">
                <div class="button" @click="createRoom">创建游戏</div>
                <div class="button" @click="gameStatusAction.push(1)">加入房间</div>
                <!-- <div class="button" @click="gameStatusAction.push(2)">随机匹配</div> -->
            </div>

            <div class="players-template" v-show="inRoom">
                <p>房间号{{room}}</p>
                <div class="players" v-for="(li, index) in members" :key="index">
                    <img class="avatar" :src="li.avatar"/>
                    <p>{{li.name}}</p>
                    <p>{{li.role === 1 ? '房主' : '玩家' + (li.role)}}</p>
                </div>
                <div v-show="creator" class="button" @click="begin">开始 {{members.length}}/4</div>
                <div v-show="!creator">{{members.length === 4 ? '等待房主开始游戏' : '等待玩家' }} {{members.length}}/4</div>
            </div>

            <!-- 加入房间 -->
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: center" v-show="gameStatusAction[0] === 1 && !inRoom">
                <input :value="room"
                       @input="change2Intrage" class="input" placeholder="输入房间号"/>
                <div style="display: flex;width: 120px;align-items: center;justify-content: space-between">
                    <div class="button" @click="gameStatusAction.pop()">返回</div>
                    <div class="button" @click="joinRoom">确认</div>
                </div>
            </div>

            <div v-show="gameStatusAction.length > 0 && gameStatusAction[0] !== 1 && gameStatusAction[0] !== 0">
                <div class="button" @click="gameStatusAction.pop()">返回</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  // @ts-ignore
  import Share from '../../util/shareAndGetName.js'

  @Component({
    components: {},
  })
  export default class Home extends Vue {
    private gameStatusAction: number[] = []
    private room: number | '' = 10001 // 房间号
    private iKnow: boolean = false

    private share = new Share({ pic: 'https://res.psy-1.com/FskrtbwZ59DkAgSDSJPRUEuQXiqy',
      url: window.location.href.split('#')[0],
      title: '跳一跳👏', desc: '唔... 这是一个无聊的游戏，开发想不到有人会分享！！！' })

    private joinConfig = {}

    private members: any = [] // 房间

    private creator: boolean = false
    private inRoom: boolean = false

    // 信息接收
    private onMessage(evt: any) {
      console.log(evt.data)
      const data = JSON.parse(evt.data)
      if (data.status === 0) {
        console.log(data)
      }
      if (data.status === 8) {
        this.members = data.data.members
        this.room = data.data.room
        this.inRoom = true
        const title = data.data.members.length === 4 ?
          '跳一跳' : `跳一跳还差${4 - data.data.members.length}人，房间:${this.room}`
        const URL = changeUrlArg(window.location.href.split('#')[0], 'room', this.room)
        this.share = new Share({ pic: 'https://res.psy-1.com/FskrtbwZ59DkAgSDSJPRUEuQXiqy',
          url: URL,
          title, desc: '唔...  这是一个无聊的游戏，开发想不到会有人分享。' })

        if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
          this.share.rawWeiXinShare('https://api.psy-1.com')
        }
      }
      if (data.status === 6) {
        // @ts-ignore
        this.$parent.tips('房间不存在')
      }
      if (data.status === 4) {
        // @ts-ignore
        this.$parent.tips('游戏开始')
        this.$router.push('/game')
      }
      if (data.status === 7) {
        // @ts-ignore
        this.$parent.tips('房间已解散')
        this.members = []
        this.inRoom = false
      }
      if (data.status === 9) {
        // @ts-ignore
        this.$parent.tips('满人')
      }
    }

    // onOpne监听链接成功
    private onOpen() {
      return new Promise((resolve) => {
        window.$ws.onopen = () => {
          resolve()
        }
      })
    }

    // onClose监听
    private onClose(s: any) {
      console.log(s)
      // this.$router.push('/')
      // setTimeout(() => {
      //   window.location.reload()
      // }, 2000)
    }

    // 创建房间
    private async createRoom() {
      await this.webSocketInit()
      this.creator = true
      this.gameStatusAction.push(0)
      const data = {
        from: 'client',
        data: {
          avatar: localStorage.getItem('avatar'),
          name: localStorage.getItem('name'),
          status: 10000,
        },
      }
      window.$ws.send(JSON.stringify(data))
    }

    // 加入房间
    private async joinRoom() {
      await this.webSocketInit()
      this.creator = false
      const data = {
        from: 'client',
        data: {
          room: this.room,
          avatar: localStorage.getItem('avatar'),
          name: localStorage.getItem('name'),
          status: 10001,
        },
      }
      window.$ws.send(JSON.stringify(data))
    }

    // 开始游戏
    private begin() {
      if (this.members.length < 4) {
        // @ts-ignore
        this.$parent.tips('未满4人不能开始')
        return
      }
      const data = {
        from: 'client',
        data: {
          room: this.room,
          status: 10004,
        },
      }
      window.$ws.send(JSON.stringify(data))
      // this.$router.push('/game')
    }

    private change2Intrage(val: any) {
      val.target.value = val.target.value.replace(/[^\d]/g, '')
      this.room = val.target.value
    }

    private async webSocketInit() {
      if (!window.$ws || window.$ws.readyState !== 1) {
        console.log(process.env.NODE_ENV, '??')
        window.$ws = new WebSocket(process.env.NODE_ENV === 'production' ? '' : '')
        window.$ws.onmessage = this.onMessage
        window.$ws.onclose = this.onClose
        await this.onOpen()
      }
    }

    private mounted() {
      if (parseQuery(window.location.href).room) {
        this.room = parseQuery(window.location.href).room
        this.iKnow = true
        this.gameStatusAction.push(1)
      }
      if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
        this.share.rawWeiXinShare('')
        this.share.weiXinInit('')
      }
    }
  }

  function parseQuery(url: string) {
    const queryObj: any = {}
    const reg = /[?&]([^=&#]+)=([^&#]*)/g
    const querys: any = url.match(reg)
    if (querys) {
      for (const i in querys) {
        if (i) {
          const query = querys[i].split('=')
          const key = query[0].substr(1)
          const value = query[1]
          queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value
        }
      }
    }
    return queryObj
  }

  function changeUrlArg(url: string, arg: any, val: any): string {
    const pattern = arg + '=([^&]*)'
    const replaceText = arg + '=' + val
    return url.match(pattern) ?
      url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText)
      : (url.match('[\?]')
        ? url + '&' + replaceText
        : url + '?' + replaceText)
  }
</script>

<style scoped lang="scss">
@import "style.scss";
    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
