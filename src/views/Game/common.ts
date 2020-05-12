// 常用方法工具类
import { Vue } from 'vue-property-decorator'
import Application = PIXI.Application
import * as PIXI from 'pixi.js'
window.PIXI = PIXI

// @ts-ignore
import CharmC from './pixiChram.js'
// @ts-ignore
const Charm = new CharmC(PIXI)
// @ts-ignore
window.Charm = Charm

// @ts-ignore
import _DUST from './dust.js'
// @ts-ignore
const DUST = new _DUST(PIXI)
// @ts-ignore
window.DUST = DUST

import spine from 'pixi-spine' // 骨架
// @ts-ignore
import projection from 'pixi-projection/dist/pixi-projection-spine' // 2d -> 3d工程

spine(PIXI)
projection(PIXI)

export default class Common extends Vue {
  public rolesSprite: Role[] = []
  public BLUR: BLUR[] = []

  public showScoreTips: boolean = false
  public scoreGetter: number = 0
  public preScore: number = 0

  // 判断游戏是否已经结束
  public gameIsOver: boolean = false

  // 监听完成动画的人数
  public animationDoneCount: number = 0

  protected app: Application = new Application({
    resolution: window.devicePixelRatio ? 1.3 : 1,
    backgroundColor: 0x000,
  })

  // 总2d视觉container
  protected container = new PIXI.projection.Container2d()

  // 场景文件(文件类不要重复名称)
  protected scence = [{
    name: 'background',
    url: require('./scence_assest/22_1.png'),
  }, {
    name: 'cloud',
    url: require('./dust_assest/cloud.png'),
  }, {
    name: 'star',
    url: require('./dust_assest/star.png'),
  }, {
    name: 'huyaLogo',
    url: require('./scence_assest/huyalogo.png'),
  }]

  // 角色骨架文件(文件类不要重复名称)
  protected role = [{
    name: '201201',
    url: require('./role_assest/201201/201201.json'),
  }, {
    name: '204301',
    url: require('./role_assest/204301/204301.json'),
  }, {
    name: '206301',
    url: require('./role_assest/206301/206301.json'),
  }]

  public _ref(s: string) {
    const ref: any = this.$refs[s]
    return ref
  }

  // 视窗配置
  public PIXISetFullSize() {
    this.app.renderer.view.style.position = 'absolute'
    this.app.renderer.view.style.display = 'block'
    this.app.renderer.autoDensity = true
    this.app.renderer.resize(document.getElementById('app')!.clientWidth
      , document.getElementById('app')!.clientHeight)
  }

  // 加载tp动画精灵
  public addTp(name: string) {
    const data = require(`./dust_assest/tp/${name}.json`)
    const baseTexture = new PIXI.BaseTexture(require(`./dust_assest/tp/${name}.png`), { anisotropicLevel: 1 })
    const spritesheet = new PIXI.Spritesheet(baseTexture, data)
    return new Promise((resolve) => {
      spritesheet.parse((textures) => {
        resolve(textures)
      })
    })
  }

  public parseBlurTexture(textures: any, reverseTextures: any, x: number = 0, y: number = 0) {
    const containerBlur = new PIXI.projection.Container2d()
    const arr = []
    for (const i in textures) {
      if (textures.hasOwnProperty(i)) {
        arr.push(textures[i])
      }
    }
    const animationSprite = new PIXI.AnimatedSprite(arr)
    animationSprite.animationSpeed = 0.2
    animationSprite.width = 50
    animationSprite.height = 50
    animationSprite.x = x
    animationSprite.y = y
    animationSprite.gotoAndPlay(Math.random() * 2)

    const arrR = []
    for (const i in reverseTextures) {
      if (reverseTextures.hasOwnProperty(i)) {
        arrR.push(reverseTextures[i])
      }
    }
    const animationSpriteR = new PIXI.AnimatedSprite(arrR)
    animationSpriteR.animationSpeed = 0.2
    animationSpriteR.width = 50
    animationSpriteR.height = 50
    animationSpriteR.x = x
    animationSpriteR.y = y
    animationSpriteR.visible = false
    function hit() {
      // 隐藏泡泡
      animationSpriteR.visible = true
      animationSprite.visible = false
      animationSpriteR.loop = false
      animationSpriteR.gotoAndPlay(0)
    }

    function regain() {
      // 展示泡泡
      animationSpriteR.visible = false
      animationSprite.visible = true
      animationSpriteR.loop = true
      animationSprite.gotoAndPlay(Math.random() * 2)
    }

    containerBlur.addChild(animationSprite)
    containerBlur.addChild(animationSpriteR)
    return {
      sprite: containerBlur,
      hit,
      regain,
    }
  }

  // 加工
  public async mixAnimationSprite(names: string[], reverseNames: string[]) {
    const animationSprites = await Promise.all(names.map((v: string) => this.addTp(v)))
    const reverseAnimationSprites = await Promise.all(reverseNames.map((v: string) => this.addTp(v)))
    return {
      animationSprites: [],
    }
  }

  // 转换2D -> 3D场景 且添加进stage
  public PIXI2D(pic: string): PIXI.projection.Sprite2d {
    return new PIXI.projection.Sprite2d(PIXI.utils.TextureCache[pic])
  }

  // 碰撞方法
  public hitTestRectangle(r1: any, r2: any): boolean {

    // Define the variables we'll need to calculate
    let hit = false
    let combinedHalfWidths = 0
    let combinedHalfHeights = 0
    let vx = 0
    let vy = 0

    // Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2
    r1.centerY = r1.y + r1.height / 2
    r2.centerX = r2.x + r2.width / 2
    r2.centerY = r2.y + r2.height / 2

    // Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2
    r1.halfHeight = r1.height / 2
    r2.halfWidth = r2.width / 2
    r2.halfHeight = r2.height / 2

    // Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX
    vy = r1.centerY - r2.centerY

    // Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth
    combinedHalfHeights = r1.halfHeight + r2.halfHeight

    // Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      // A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        // There's definitely a collision happening
        hit = true
      } else {
        // There's no collision on the y axis
        hit = false
      }
    } else {
      // There's no collision on the x axis
      hit = false
    }

    // `hit` will be either `true` or `false`
    return hit
  }

  public scoreTips() {
    this.showScoreTips = true
    setTimeout(() => {
      this.showScoreTips = false
    }, 2000)
  }

  // 持续渲染
  public PIXITicker(callBack: (p1: any) => void) {
    this.app.ticker.add((delta) => {
      callBack(delta)
    })
  }
}
