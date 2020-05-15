<template>
    <div class="game" id="game">
        <ScoreBar :cd.sync="rolesData" ref="sb" /> <!-- :s.sync="scroeTemplateShow"/> -->

        <!-- 加载游戏面板 -->
        <div class="loading-template" v-if="progress > 100">
            <div class="bar" style="display: flex;justify-content: center;align-items: center;">
                Loading{{dot}}
                <!-- <img class="bar-img" src="./scence_assest/bar.png"/>
                <div class="inner-bar-template">
                    <div class="inner-bar" :style="{ width: progress + '%' }">
                        <img class="inner-bar-img" src="./scence_assest/bar-inner.png"/>
                    </div>
                </div> -->
            </div>
        </div>

        <div class="getter-score-template" v-show="showScoreTips">
            <img src="./scence_assest/buttonBuyStone6.png"/>
            + {{scoreGetter - preScore}}
        </div>

        <div style="position: fixed;right: 9999px;top: 9999px;opacity: 0;">
            <img id="201201" crossorigin="anonymous" src="./role_assest/201201/201201.png"/>
            <img id="204301" crossorigin="anonymous" src="./role_assest/204301/204301.png"/>
            <img id="206301" crossorigin="anonymous" src="./role_assest/206301/206301.png"/>
            <img id="211201" crossorigin="anonymous" src="./role_assest/211201/211201.png"/>
        </div>

        <!-- 操作 -->
        <div class="action-template">
            <p @click="interactAction('left')">←</p>
            <p @click="interactAction('right')">→</p>
            <p @click="interactAction('up')">↑</p>
            <p @click="interactAction('down')">↓</p>
        </div>

        <ChartBar :cd.sync="chartData"/>

        <ActionBar/>
    </div>
</template>

<script lang="ts">
  import { Component, Watch, Emit } from 'vue-property-decorator'
  import ATLAS from './role_assest/atlas' // 所有.atlas文件的集合，处理为js
  import ActionBar from '@/components/ActionBar.vue'
  import ScoreBar from '@/components/ScoreBar.vue'
  import ChartBar from '@/components/ChartBar.vue'

  // 普通pixi方法
  import Action from '@/views/Game/action'
  const PIXI = window.PIXI

  @Component({
    components: {
      ActionBar,
      ScoreBar,
      ChartBar,
    },
  })
  export default class Game extends Action {
    private needLoad: boolean = false // 是否需要加载面板
    private progress: number = 10 // 当前加载进度条
    private dot: string = '.'
    private dotAnimation: any = undefined
    private rolesData: membersData[] = []
    private chartData: chartMsgType[] = []
    private scroeTemplateShow: boolean = false
    private roleStopFlow: boolean = false // 人物暂时不跟随云变动
    private gameStatus: number = 0 // 0 进行中 1游戏完成
    private regainSaver: any = undefined

    // 初始配置
    private PIXIInit() {
      // 加载角色资源
      this.app.loader.add(this.role.concat(this.scence), { crossOrigin: 'anonymous' }).load(this.parsePIXI2D)
    }


    // 2d场景配置
    private async parsePIXI2D() {
      // 添加背景
      // const background = PIXI.Sprite.from('background')
      // this.app.stage.addChild(background)

      // this.container的配置
      this.container2d()

      // 人物底部的浮空“石头”
      const stone = this.positionDecorate()
      for (const i of stone) {
        // this.app.stage.addChild(i)
        this.container.addChild(i)
      }

      // 居中
      this.container.position.set(this.app.screen.width / 2, this.app.screen.height / 2.3)
      this.container.pivot.x = this.container.width / 2
      this.container.pivot.y = this.container.height / 2

      // 气泡组 内部加入this.container
      const BLUR = await this.blurGroups(stone)
      this.BLUR = BLUR

      // 角色
      const role1 = this.spineSklecton(201201, this.container.width / 2 + stone[1].x,
        this.container.height / 2 + stone[1].y, 'right') // 角色1
      this.rolesSprite.push(role1)
      const role2 = this.spineSklecton(204301, this.container.width / 2 + stone[3].x,
        this.container.height / 2 + stone[3].y, 'right') // 角色2
      this.rolesSprite.push(role2)
      const role3 = this.spineSklecton(206301, this.container.width / 2 + stone[5].x,
        this.container.height / 2 + stone[5].y, 'left') // 角色3
      this.rolesSprite.push(role3)
      const role4 = this.spineSklecton(211201, this.container.width / 2 + stone[7].x,
        this.container.height / 2 + stone[7].y, 'right') // 角色4
      this.rolesSprite.push(role4)
      const roles = [role1, role2, role3, role4]
      roles.forEach((v) => {
        this.container.addChild(v.sprite)
      })

      // 角色动作
      setTimeout(() => {
        const actions = ['joy', 'stand']
        roles.forEach((v) => {
          v.selfSprite.state.setAnimation(0, actions[Math.random() >= 0.5 ? 1 : 0], true)
        })
      }, 1000)

      const Charm = (window as any).Charm
      const DUST = (window as any).DUST

      // const testBlur = await this.addTp('tp') as PIXI.AnimatedSprite
      // this.container.addChild(testBlur)

      setTimeout(() => {
        // this.roleStopFlow = true
        // Charm.slide(role1.sprite, 0, 180, 120)
        // this.moveAnimation(role1, 'right', true, 2)
        // this.moveAnimation(role2, 'right', false, 3)
        // this.moveAnimation(role3, 'up', true, 2)
        // this.moveAnimation(role4, 'left', true, 4)
      }, 5000)

      const countStone: number[] = [] // 处理不同的stone的动态
      this.PIXITicker((delta) => {
        Charm.update()
        DUST.update()
        stone.forEach((value, index: number) => {
          // 云浮动动画
          countStone[index] ? countStone[index] += Math.random() * 0.1 : countStone[index] = 0.01
          if (countStone[index] >= 100000) {
            countStone[index] = 0.01
          }
          const ry = +(Math.sin(countStone[index]) * 0.1).toFixed(2)
          value.y += ry

          if (!this.roleStopFlow) {
            // 人物跟随云浮动动画
            for (const i of roles) {
              if (this.hitTestRectangle(i.hitArea, value)) {
                i.sprite.y += ry
                break
              }
            }
          }

          // 气泡球跟随云浮动动画 为了性能 直接和stone 贴在一起
          // for (const i of BLUR) {
          //   if (this.hitTestRectangle(i.sprite, value)) {
          //     i.sprite.y += ry
          //     break
          //   }
          // }
        })
      })

      // 发送加载完毕
      window.$ws.send(JSON.stringify({
        from: 'client',
        data: {
          status: 10003,
        },
      }))
    }

    // 恢复游戏数据
    private regainData(blurScore: number[]) {
      // 角色位置恢复
      this.rolesSprite.forEach((v: Role) => {
        v.sprite.x = v.initialX
        v.sprite.y = v.initialY
        const actions = ['joy', 'stand']
        v.selfSprite.state.setAnimation(0, actions[Math.random() >= 0.5 ? 1 : 0], true)
      })

      // BLUR恢复
      let i = 0
      this.BLUR.forEach((v) => {
        v.regianInnerTextureGroup()
        v.regain(blurScore[i])
        i++
      })
    }

    // 设置2d的Container视觉 相当于this.container的初始化
    private container2d() {
      this.app.stage.addChild(this.container)

      const bigWhiteTexture = new PIXI.Texture(PIXI.Texture.WHITE.baseTexture)
      bigWhiteTexture.orig.width = 100
      bigWhiteTexture.orig.height = 100

      const factor = 1
      const squareFar = new PIXI.Sprite(bigWhiteTexture)
      squareFar.tint = 0xff0000
      squareFar.anchor.set(0.5)
      squareFar.position.set(this.app.screen.width / 2, -this.app.screen.height * 3) // this.app.screen.height * 1.8
      this.app.stage.addChild(squareFar)

      // 调整2d视野
      setTimeout(() => {
        const pos = this.container.toLocal(squareFar.position, undefined,
          undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ)
        pos.y = -pos.y
        pos.x = -pos.x
        this.container.proj.setAxisY(pos, -factor)
      }, 1000)
    }

    // 添加粒子动画效果
    private addDust(textureName: string, initX: number, initY: number,
                    count: number, size: number, minSpeed: number, maxSpeed: number) {
      const DUST = (window as any).DUST
      const starContainer = new PIXI.ParticleContainer(
        count,
        { tint: true, rotation: true, uvs: true },
      )
      const particleStream = DUST.emitter(
        1000,
        () => DUST.create(
          0, 0,
          () => {
            const bunny = this.PIXI2D(textureName)
            bunny.proj.affine = PIXI.projection.AFFINE.AXIS_X
            return bunny
          },
          starContainer,
          count, // Number of particles
          0, // Gravity
          true, // Random spacing
          0, 6.28, // Min/max angle
          size, size, // Min/max size
          minSpeed, maxSpeed, // Min/max speed
        ),
      )
      starContainer.x = initX
      starContainer.y = initY
      starContainer.pivot.x = 0
      starContainer.pivot.y = 0
      // particleStream.play()
      return {
        container: starContainer,
        sprite: particleStream,
      }
    }

    // spine骨架添加 处理
    private spineSklecton(name: 201201 | 204301 | 206301 | 211201, x: number = 0, y: number = 0, frontSize: Front): Role {
      const container = new PIXI.projection.Container2d()

      const json = require(`./role_assest/${name}/${name}.json`) // 一定要url
      const atlas = ATLAS[name]

      // 通过外部方式引入
      const spineAtlas = new PIXI.spine.core.TextureAtlas(atlas, (line, callback) => {
        callback(PIXI.BaseTexture.from(
          document.getElementById(name.toString()) as HTMLImageElement,
        ))
      })

      const spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas)
      const spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader)

      spineJsonParser.scale = 1.0

      const spineData = spineJsonParser.readSkeletonData(json)

      // 强行转换
      const sprite = new PIXI.projection.Spine2d(spineData) as selfSpriteType
      sprite.reverse = function() {
        this.scale.x *= -1
      }
      sprite.state.timeScale = 0.7

      const scaleNum = 70 / sprite.width

      sprite.width *= scaleNum
      sprite.height *= scaleNum

      sprite.x = x - (sprite.width / 0.75)
      sprite.y = y - (sprite.height / 1.2)
      sprite.proj.affine = PIXI.projection.AFFINE.AXIS_X

      // 正方形 代替碰撞问题
      const squareX = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE)
      squareX.tint = 0xfff
      squareX.width = sprite.width / 1.3
      squareX.height = sprite.height / 2.3
      squareX.x = x - (sprite.width / 0.58)
      squareX.y = y - (sprite.height / 0.9)
      squareX.visible = false // 调试可以选择显示
      squareX.proj.affine = PIXI.projection.AFFINE.AXIS_X

      // 地板灰尘
      const dust = this.addDust('cloud', x  - (sprite.width / 0.9),
        y - (sprite.height / 1.3), 3, 20, 1, 1)
      const hitStar = this.addDust('star', x  - (sprite.width / 0.9),
        y - (sprite.height / 0.6), 3, 30, 1, 1)

      // 添加进container
      container.addChild(dust.container)
      container.addChild(squareX)
      container.addChild(sprite)
      container.addChild(hitStar.container) // 放在最后 index最大

      // dust.sprite.play()
      // hitStar.sprite.play()
      // setTimeout(() => {
      //   dust.sprite.play()
      // }, 5000)

      console.log(dust.container.width, dust.container.height , '查看height width')

      const originX = container.x
      const originY = container.y

      if (frontSize === 'left') {
        sprite.reverse()
      }

      return {
        hitStar,
        dust,
        hitArea: squareX,
        selfSprite: sprite,
        frontSize,
        sprite: container,
        initialX: originX,
        initialY: originY,
        busy: false, // 是否已经在和另外一个 自身动画碰撞了
      } as Role
    }

    private async blurGroups(stone: PIXI.projection.Sprite2d[]): Promise<BLUR[]> {
      const blurTexture = await this.addTp('tp')
      const blurReverseTexture = await this.addTp('Rtp')
      const arr: BLUR[] = []

      for (let i = 0; i < 5; i++) {
        const blurGroups = this._blurGroups(blurTexture, blurReverseTexture, 1, 0, 0)
        stone[i * 2].addChild(blurGroups.sprite)
        arr.push(blurGroups)
      }
      return arr
    }

    // 气泡球组
    private _blurGroups(blurTexture: any, blurReverseTexture: any, count: number = 1, x: number, y: number): BLUR {
      const container = new PIXI.projection.Container2d()
      const hitMth: Array<() => void> = []
      const regainMth: Array<() => void> = []
      // 气泡显示位置
      const Count: any = {
        1: [[1, 1]],
        2: [[0, 1], [2, 1]],
        3: [[0, 1], [1, 0], [2, 1]],
        4: [[1, 0], [0, 1], [1, 1], [2, 1]],
        5: [[0, 1], [2, 1], [1, 1], [0, 2], [2, 2]],
        6: [[0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
      }

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // if (_count.hasOwnProperty(count)) { 注释 全部添加进去 9个
            const animationSprite = this.parseBlurTexture(blurTexture, blurReverseTexture, (20 * i), (20 * j))
            container.addChild(animationSprite.sprite)
            hitMth.push(animationSprite.hit)
            regainMth.push(animationSprite.regain)
            animationSprite.sprite.visible = false
            Count[count].forEach((v: any) => {
              if (v[0] === i && v[1] === j) {
                animationSprite.sprite.visible = true
              }
            })
          // }
        }
      }

      container.x = x
      container.y = y - 10

      // 恢复
      function regain(countA: number) {
        const count2: any = {
          1: [4],
          2: [1, 7],
          3: [2, 4, 8],
          4: [2, 5, 8, 4],
          5: [1, 2, 5, 8, 7],
          6: [1, 4, 7, 2, 5, 8],
        }
        container.children.forEach((v1, index: number) => {
          if (count2[countA].includes(index)) {
            v1.visible = true
          } else {
            v1.visible = false
          }
        })
      }

      // 执行碰撞动画
      function hit() {
        hitMth.forEach((v) => {
          v()
        })
      }

      // 恢复
      function regianInnerTextureGroup() {
        regainMth.forEach((v) => {
          v()
        })
      }

      return {
        regain,
        sprite: container,
        hit,
        regianInnerTextureGroup,
      }
    }

    // 位置装饰品 stone的初始化配置
    private positionDecorate(): PIXI.projection.Sprite2d[] {
      const clouds: PIXI.projection.Sprite2d[] = []

      for (let i = 0; i < 9; i++) {
        const cloud = this.PIXI2D('huyaLogo')
        // console.log(cloud.width, cloud.height)
        const scaleNum = 80 / cloud.width
        cloud.width *= scaleNum
        cloud.height *= scaleNum
        cloud.x = (i % 3) * cloud.width * 1.2
        // cloud.initialX = (i % 3) * cloud.width * 1.2
        cloud.y = Math.floor(i / 3) * cloud.height * 1.2
        // cloud.anchor.set(0, 0.0)
        // cloud.initialY = Math.floor(i / 3) * cloud.height * 1.2
        cloud.proj.affine = PIXI.projection.AFFINE.AXIS_X
        clouds.push(cloud)
      }
      return clouds
    }

    @Watch('animationDoneCount')
    private animationDoneCountWatch(val: number) {
      if (val === 4) {
        this.inAction = false
        this.scoreTips()
        setTimeout(() => {
          if (this.gameIsOver) {
            this.scroeTemplateShow = true
            this._ref('sb').showTemplate = true
            // @ts-ignore
            this.$parent.tips('游戏结束', true, this.userPosition)
            return
          }

          if (this.regainSaver) {
            this.regainSaver()
            this.regainSaver = undefined
            this.animationDoneCount = 0
          }

        }, 3000)
      }
    }

    private onMessage(evt: any) {
      const data = JSON.parse(evt.data)

      if (data.status === 1) {
        // @ts-ignore
        this.$parent.tips('有玩家离开房间，游戏结束', true, this.userPosition)
        setTimeout(() => {
          this.$router.replace('/')
          // window.location.reload()
          setTimeout(() => {
            window.location.reload()
          }, 300)
        }, 2000)
        return
      }

      // 获取个人信息
      if (data.status === 2) {
        console.log('个人信息：' + data.data)
        this.userPosition = data.data.role // 不需要jian yi
      }

      // 游戏交互操作
      if (data.status === 5) {
        const serverAction = data.data.serverAction as serverAction
        console.log(serverAction, '查看serverAction')

        if (serverAction.membersData) {
          for (const i of serverAction.membersData) {
           if (i.role === this.userPosition) {
             this.preScore = this.scoreGetter
             this.scoreGetter = i.score
             break
           }
          }
          this.rolesData = serverAction.membersData
        } else {
          this.progress = 100
          if (this.dotAnimation) {
            clearInterval(this.dotAnimation)
          }
        }

        if (serverAction.done) {
          this.gameStatus = 1
          this.gameIsOver = true
          // window.$ws.close()
        }

        if (serverAction.membersData) {
          serverAction.membersData.forEach((v) => {
            this.moveAnimation(this.rolesSprite[v.role - 1], v.front, v.fail, v.toPosition) // v.front
          })

          this.regainSaver = this.regainData.bind(undefined, serverAction.blurScore as number[])
        } else {
          // 初始数据
          this.regainData(serverAction.blurScore as number[])
        }
      }

      // 新的消息
      if (data.status === 3) {
        console.log('??', data.data.chartMsg)
        this.chartData.push(...data.data.chartMsg)
      }
    }

    private onClose() {
      console.log('do nothing')
    }

    private mounted() {
      try {
        window.$ws.onmessage = this.onMessage
        window.$ws.onclose = this.onClose
      } catch {
        this.$router.replace('/')
        setTimeout(() => {
          window.location.reload()
          return
        }, 300)
      }

      this.dotAnimation = setInterval(() => {
        if (this.dot.length >= 5) {
          this.dot = '.'
        } else {
          this.dot += '.'
        }
      }, 500)

      document.querySelector('#game')?.appendChild(this.app.view)
      this.PIXISetFullSize()
      this.PIXIInit()

    }
  }

  // 碰撞方法
</script>

<style scoped lang="scss">
    @import "game";
    .game {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
