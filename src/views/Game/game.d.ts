interface Role {
  hitStar: {
    container: PIXI.ParticleContainer,
    sprite: any, // DUST have no tyoe
  },
  dust: {
    container: PIXI.ParticleContainer,
    sprite: any, // DUST have no tyoe
  }, // 灰尘
  hitArea: PIXI.Sprite,
  selfSprite: selfSpriteType,
  frontSize: 'right' | 'left',
  sprite: PIXI.projection.Container2d,
  initialX: number,
  initialY: number,
  busy: false
}

interface selfSpriteType extends PIXI.projection.Spine2d {
  reverse: () => void
}

interface BLUR {
  sprite: PIXI.projection.Container2d,
  regain: (count: number) => void,
  hit: () => void,
  regianInnerTextureGroup: () => void,
}

// 服务端的数据操作交互
interface serverAction {
  round: number, // 当前进行的回合
  maxRound: number, // 总回合数
  membersData?: membersData[], // 获得的分数
  blurScore?: [number, number, number, number, number] // 下一轮的位置气泡数 最小为1 最大为6
  done: boolean // 是否结束
}

interface membersData {
  name: string,
  toPosition: number,  // 0 2 4 6 8 -> 0 1 2 3 4
  score: number,
  front: Front,
  role: role,
  fail: boolean
}

type role =  1 | 2 | 3 | 4  // 1为第一位 2为第二位 3为第三位 4为第四位
type Front = 'up' | 'down' | 'left' | 'right'
interface Window {
  [p: string]: any
}
interface chartMsgType {
  avatar: string,
  name: string,
  msg: string
}
