import Common from '@/views/Game/common'

interface PS {
  x: number,
  y: number
}

// 操作
export default class Action extends Common {
  // 用户1 - 4
  public userPosition: number = 1

  // 是否在操控中（等待其他玩家）
  public inAction: boolean = false
  // interactAction 用户操控键盘
  public interactAction(actionName: 'left' | 'right' | 'down' | 'up') {
    if (this.gameIsOver) {
      // @ts-ignore
      this.$parent.tips('游戏结束', true, this.userPosition as role)
      return
    }

    if (this.inAction) {
      // @ts-ignore
      this.$parent.tips('方向已经选定，请等待其他玩家操作', true, this.userPosition as role)
      return
    }

    let trueAction = []
    // 自身角色是有一个位置不能按的
    this.userPosition === 1 ? trueAction = ['left', 'right', 'down'] // 0
      : this.userPosition === 2 ? trueAction = ['up', 'right', 'down'] // 1
        : this.userPosition === 3 ? trueAction = ['up', 'left', 'down'] // 2
          : trueAction = ['up', 'right', 'left'] // 3
    if (trueAction.includes(actionName)) {
      this.inAction = true
      const data = {
        from: 'client',
        data: {
          front: actionName,
          status: 11000,
        },
      }

      // @ts-ignore
      this.$parent.tips(`选定方向${actionName}，等待其他玩家操作`, true, this.userPosition as role)
      // ws发送请求
      window.$ws.send(JSON.stringify(data))
    } else {
      // @ts-ignore
      this.$parent.tips('选择正确的方向', true, this.userPosition as role)
    }
  }

  // 垂直移动 水平移动 to 为服务器计算出来的 人物所向的位置 因为BLUR需要消失
  public moveAnimation(role: Role, action: 'up' | 'down' | 'right' | 'left', fail: boolean = false, to: number) {
    // 紧张脸
    role.selfSprite.state.setAnimation(0, 'uneasy', true)
    // 灰尘
    role.dust.sprite.once()

    if (fail) {
      setTimeout(() => {
        role.hitStar.sprite.once()
      }, 900)
    }

    let curveArray: PS[] = []
    if (action === 'left' || action === 'right') {
      // 人物需要调换镜头
      if (action === 'left') {
        if (role.frontSize !== 'left') {
          role.selfSprite.reverse()
          role.frontSize = 'left'
        }
      } else {
        if (role.frontSize !== 'right') {
          role.selfSprite.reverse()
          role.frontSize = 'right'
        }
      }
      // 水平
      curveArray = [
        { x: action === 'right' ? fail ? 37 + 45 + 20 : 37 : fail ? -37 - 45 - 20 : -37,
          y: -15 },
        { x: action === 'right' ? fail ? 75 + 45 + 20 : 75 : fail ? -75 - 45 - 20 : -75,
          y: -25 },
        { x: action === 'right' ? fail ? 0 : 94 : fail ? 0 : -94, // origin 111
          y: 0 },
      ]
    } else {
      // 垂直
      curveArray = [
        { x: action === 'down' ? fail ? 0 : -25 : fail ? 0 : 25,
          y: action === 'down' ? fail ? 37 + 45 + 20 : 37 : fail ? -37 - 45 - 20 : -37 },
        { x: action === 'down' ? fail ? 0 : -25 : fail ? 0 : 25,
          y: action === 'down' ? fail ? 75 + 45 + 20 : 75 : fail ? -75 - 45 - 20 : -75 },
        { x: 0,
          y: action === 'down' ? fail ? 0 : 94 : fail ? 0 : -94 }, // origin 111
      ]
    }
    const animationTime = 100
    const callBack = () => {
      role.dust.sprite.once()
      if (fail) {
        role.selfSprite.state.setAnimation(0, 'sad', true)
      } else {
        // BLUR消失
        this.BLUR[to].hit()
        role.selfSprite.state.setAnimation(0, 'happy', true)
      }
      // watch 该数据满4触发regain
      this.animationDoneCount++
    }
    this.roleMove(role, curveArray, animationTime, callBack)
  }

  // 角色位移 animationTime动画时长
  public roleMove(role: Role, curveArray: PS[], animationTime: number, callBack: () => void) {
    const curve = [
      [role.sprite.x, role.sprite.y],
      [role.sprite.x + curveArray[0].x, role.sprite.y + curveArray[0].y],
      [role.sprite.x + curveArray[1].x, role.sprite.y + curveArray[1].y],
      [role.sprite.x + curveArray[2].x, role.sprite.y + curveArray[2].y],
    ]

    const Charm = (window as any).Charm
    Charm.followCurve(
      role.sprite,
      curve,
      animationTime,
      'smoothstepSquared',
      false, // yoyo ?
      1000, // delay yoyo
    ).onComplete = () => {
      callBack()
      // someting
    }
  }
}
