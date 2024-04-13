// 注意是先创建后调用！！！！
const canvas = document.querySelector('canvas')

// 2.获取2d的api
const c = canvas.getContext('2d')

// 1. 显示信息
//console.log(c)

//16.分数
const scoreEl = document.querySelector('#scoreEl')

// 3. 指定宽度 - 根据默认窗口调整 - 动态的
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//4.地图生成 - 这里是类
class Boundary {
  // 静态变量代替数值 - 之后好改 - 这里是间隔
  static width = 40
  static height = 40

  // 14.增加类函数，引用图片

  constructor({ position, image }) {
    this.position = position
    // 方块大小
    this.width = 40
    this.height = 40
    this.image = image
  }
  // 画地图
  draw() {
    // 边界设置为蓝色
    //c.fillStyle = 'blue'

    // 绘制矩阵的api - 传入坐标和正方体大小
    //c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(this.image, this.position.x, this.position.y)
  }

}

// 7.创建玩家的类
class Player {
  // 构造函数
  constructor({ position, velocity }) {
    this.position = position
    // 速度
    this.velocity = velocity
    // 玩家半径
    this.radius = 15;
    // 控制嘴巴
    this.radians = 0.75
    this.openRate = 0.12
    this.rotation = 0

  }

  draw() {
    c.save()
    c.translate(this.position.x,this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x,-this.position.y)
    c.beginPath()
    // 绘制圆弧路径的方法
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI*2 - this.radians)
    c.lineTo(this.position.x,this.position.y)
    // 填充内部颜色
    c.fillStyle = 'yellow'
    c.fill()
    // 绘制直线
    c.closePath()
    c.restore()
  }

  // 8.增加函数 - 移动
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    // 22.调整嘴巴
    if(this.radians<0 || this.radians>.75){
      this.openRate = -this.openRate
    }
    this.radians += this.openRate

  }
}

// 17.创建敌人类
class Ghost {
  static speed = 2
  // 构造函数
  constructor({ position, velocity, color = 'red' }) {
    this.position = position
    // 速度
    this.velocity = velocity
    // 玩家半径
    this.radius = 15
    this.color = color
    //
    this.prevCollisions = []
    this.speed = 2
    this.scared = false
  }

  draw() {
    c.beginPath()
    // 绘制圆弧路径的方法
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    // 填充内部颜色 - 这里要用this.color
    c.fillStyle = this.scared ? 'blue' : this.color
    c.fill()
    // 绘制直线
    c.closePath()

  }

  // 8.增加函数 - 移动
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2

    },
    velocity: {
      x: Ghost.speed,
      y: 0
    }
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2

    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: 'pink'
  })
]



// 15 创建吃的
class Pellet {
  // 渲染豆子 - constructor构造函数
  constructor({ position }) {
    this.position = position
    // 玩家半径
    this.radius = 3;
  }

  draw() {
    c.beginPath()
    // 绘制圆弧路径的方法
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    // 填充内部颜色
    c.fillStyle = 'white'
    c.fill()
    // 绘制直线
    c.closePath()

  }


}
// 这里是豆子数组
const pellets = []


// 19.创建电源
class PowerUp {
  // 渲染豆子 - constructor构造函数
  constructor({ position }) {
    this.position = position
    // 玩家半径
    this.radius = 10;
  }

  draw() {
    c.beginPath()
    // 绘制圆弧路径的方法
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    // 填充内部颜色
    c.fillStyle = 'white'
    c.fill()
    // 绘制直线
    c.closePath()

  }
}
const powerUps = []


// 5.绘制一个正方形 - 但是这种效率低下 - 换一种
// const boundary = new Boundary({
//     position:{
//         // 这里是起始位置
//         x: 0,
//         y: 0,        
//     }
// })
// boundary.draw();

// 这是数组 - 存储块的属性 - 这里演示创建
// const boundaries = [
//     // 根据这两个块 - 使用foreach循环
//     new Boundary({
//         position:{
//         // 这里是起始位置
//             x: 0,
//             y: 0,        
//         }
//     }),

//     new Boundary({
//         position:{
//             x: 41,
//             y: 0
//         }
//     })
// ]

// boundaries.forEach((boundary)=>{
//     boundary.draw()
// })

// 10 . 创建keys帮助我们确定按键
const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}
// 最后按键
let lastKey = ' '
let score = 0


// 这里是调用图片
function createImage(src) {
  //14.这里创建了imgae类存储我们的素材 - 方便使用 - 这里可能要用函数
  const image = new Image()
  // 图片路径 - 注意这里图片是作为属性变量的
  image.src = src
  return image
}



// 创建数组
const boundaries = []

const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

// 替换地图特殊资源为图片
// 这里遍历map中的所有值，并且替换
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeHorizontal.png')
          })
        )
        break
      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeVertical.png')
          })
        )
        break
      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner1.png')
          })
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner2.png')
          })
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner3.png')
          })
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner4.png')
          })
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/block.png')
          })
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/pipeConnectorLeft.png')
          })
        )
        break
      //金币
      case '.':
        pellets.push(
          new Pellet({
            // 对角线中间
            //x: j * Boundary.width, - 这里是左脚
            //y: i * Boundary.height
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
      case 'p':
        powerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
    }
  })
})



// 声明对象
const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
})
// 绘制角色
player.draw();

//12.物体碰撞 - 将长条件作为一个方法
function circleCollidesWithRectangle({ circle, rectangle }) {
  // 有速度变量会影响碰撞边界
  const padding = Boundary.width / 2 - circle.radius - 1
  return (
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
    && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
    && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
    && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
  )
}

// 19结束游戏
let animationId

//9.update - 循环更新
// 调用绘制
function animate() {

  // 这里类似unity的Update
  animationId = requestAnimationFrame(animate) // 这里获取帧id
  c.clearRect(0, 0, canvas.width, canvas.height)
  // 11.边界碰撞检测
  boundaries.forEach((boundary) => {
    boundary.draw()
    // 处理边界问题
    if (circleCollidesWithRectangle({
      circle: player,
      rectangle: boundary
    })) {
      console.log("we are 墙壁")
      player.velocity.x = 0
      player.velocity.y = 0
    }
  })

  //19.绘制power - 倒插 - 这里吃掉之后可以让敌人逃离
  //吃电源改变敌人颜色
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i]
    powerUp.draw()

    // 碰撞电源
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      // 删除
      powerUps.splice(i, 1)

      //类里面有个变量控制npc的恐惧
      ghosts.forEach((ghost) => {
        ghost.scared = true

        setTimeout(() => {
          ghost.scared = false
        }, 5000)
      })
    }
  }
  //20.接触 - 这里吃掉power就可以消灭敌人
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i]
    //检测碰撞
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      // 圆心之间的距离
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        // 这里需要删除数组中的元素 - 不要把变量搞混了
        // ghost是其中一个变量
        ghosts.splice(i, 1)
      } else {
        cancelAnimationFrame(animationId)
        console.log('you lose game')
      }
    }
  }

    // 21. 胜利
    if(pellets.length === 0){
      console.log('you win')
      cancelAnimationFrame(animationId)
    }





  //15.绘制豆 - 吃掉豆
  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i]
    pellet.draw()
    // 获取豆子的位置 - 正方形的中间
    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      // 删除数组中的值 - 如果只加这个会有闪光
      // 因为每次更新画布都要删除掉之前吃掉的豆子 - 所以说要从后往前渲染
      pellets.splice(i, 1)
      score += 10
      scoreEl.innerHTML = score

    }
  }

  player.update()



  // 13.制作预判 - 可以通过十字路口 - 最看不懂的一集
  if (keys.w.pressed && lastKey === 'w') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (circleCollidesWithRectangle({
        circle: {
          ...player,
          velocity: {
            x: 0,
            y: -5
          }
        },
        rectangle: boundary
      })) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = -5
      }
    }
  } else if (keys.s.pressed && lastKey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (circleCollidesWithRectangle({
        circle: {
          //
          ...player,
          velocity: {
            x: 0,
            y: 5
          }
        },
        rectangle: boundary
      })) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = 5
      }
    }
  } else if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (circleCollidesWithRectangle({
        circle: {
          ...player,
          velocity: {
            x: -5,
            y: 0
          }
        },
        rectangle: boundary
      })) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = -5
      }
    }
  } else if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (circleCollidesWithRectangle({
        circle: {
          ...player,
          velocity: {
            x: 5,
            y: 0
          }
        },
        rectangle: boundary
      })) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = 5
      }
    }
  }

  // 18.敌人移动 - 和ai
  ghosts.forEach(ghost => {
    ghost.update()

    const collisions = []
    boundaries.forEach(boundary => {
      if (
        !collisions.includes('right') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })) {
        collisions.push('right')
      }
      // 
      if (
        !collisions.includes('left') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })) {
        collisions.push('left')
      }
      //
      if (
        !collisions.includes('up') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed
            }
          },
          rectangle: boundary
        })) {
        collisions.push('up')
      }
      //
      if (
        !collisions.includes('down') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed
            }
          },
          rectangle: boundary
        })) {
        collisions.push('down')
      }
    })
    //检测敌人（Ghost）与边界的碰撞
    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions
    }

    // JSON是什么 - 这里我不太懂
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      console.log('gogo')

      console.log(collisions)
      console.log(ghost.prevCollisions)

      // 这里不懂 - 控制速度
      if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')
      // 过滤出之前的碰撞路径
      const pathways = ghost.prevCollisions.filter(collision => {
        return !collisions.includes(collision)
      })



      const direction = pathways[Math.floor(Math.random() * pathways.length)]

      console.log({ direction })
      //方向开关
      switch (direction) {
        case 'down':
          ghost.velocity.y = ghost.speed
          ghost.velocity.x = 0
          break
        case 'up':
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break
        case 'right':
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break
        case 'left':
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break
      }

      // 碰撞
      ghost.prevCollisions = []

    }
  })

  if(player.velocity.x > 0) player.rotation = 0
  else if(player.velocity.x < 0) player.rotation = Math.PI
  else if(player.velocity.y > 0) player.rotation = Math.PI / 2
  else if(player.velocity.y < 0) player.rotation = Math.PI * 1.5

} // 转化动画
animate()


//8.监听事件 - 按键输出 - 这里用的是属性
window.addEventListener('keydown', ({ key }) => {
  //console.log(key)
  // 控制
  switch (key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
  }
  // 这里输出坐标
  // console.log(keys.d.pressed)
  // console.log(keys.s.pressed)
})

//8.监听事件 - 按键输出 - 这里用的是属性
window.addEventListener('keyup', ({ key }) => {
  //console.log(key)
  // 控制
  switch (key) {
    case 'w':
      keys.w.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
})