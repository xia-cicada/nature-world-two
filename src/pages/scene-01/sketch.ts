import kaplay from 'kaplay'

export const sketch = (el: HTMLCanvasElement) => {
  const ka = kaplay({
    width: 640,
    height: 480,
    background: '#85d8ab',
    scale: 1,
    canvas: el,
    pixelDensity: devicePixelRatio || 1,
  })

  ka.loadSprite('dinosaur', '/sprites/dinosaur.png', { singular: true })
  ka.loadSprite('fireBall', '/sprites/fire ball.png', { singular: true })
  ka.loadSprite('tree0', '/public/sprites/tree.png', { singular: true })
  ka.loadSprite('tree1', '/sprites/tree (1).png', { singular: true })
  ka.loadSprite('tree2', '/sprites/tree (2).png', { singular: true })
  ka.loadSprite('tree3', '/sprites/tree (3).png', { singular: true })
  ka.loadSprite('tree4', '/sprites/tree (4).png', { singular: true })

  ka.loadShader(
    'shadow',
    `
    vec4 vert(vec2 pos, vec2 uv, vec4 color) {
        return def_vert();
    }
`,
    `
    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 original = texture2D(tex, uv);
        
        float shadowLength = 0.3;
        float shadowAngle = 60.0;
        float shadowSoftness = 0.005;
        
        float angleRad = radians(shadowAngle);
        vec2 shadowDir = vec2(sin(angleRad), -cos(angleRad));
        float bottomDistance = 1.0 - uv.y;
        vec2 shadowUV = uv + shadowDir * bottomDistance * shadowLength;
        
        if (shadowUV.x >= 0.0 && shadowUV.x <= 1.0 && 
            shadowUV.y >= 0.0 && shadowUV.y <= 1.0) {
            vec4 shadowSample = texture2D(tex, shadowUV);
            float shadowAlpha = shadowSample.a * smoothstep(0.0, shadowSoftness, bottomDistance);
            vec4 shadowColor = vec4(0.0, 0.0, 0.0, shadowAlpha * 0.5);
            return mix(shadowColor, original, original.a);
        }
        return original;
    }
`
  )

  ka.scene('one', () => {
    ka.setGravity(1000)
    // ka.debug.inspect = true
    const player = ka.add([
      ka.sprite('dinosaur', {
        width: 50,
      }),
      ka.pos(80, ka.height() / 2),
      ka.shader('shadow'),
      ka.area({ offset: ka.vec2(0, -7) }),
      ka.body({ jumpForce: 300 }),
      {
        speed: 240, // 移动速度
        canJump: false, // 跳跃状态
      },
      'dinosaur',
      'dangerous',
      'big',
      'player',
      ka.z(1000),
    ])

    player.onCollide('ground', () => {
      player.canJump = true // 允许跳跃
    })

    player.onCollideEnd('ground', () => {
      player.canJump = false
    })

    ka.onKeyDown('a', () => {
      player.flipX = true
      player.move(-player.speed, 0)
    })

    ka.onKeyDown('d', () => {
      player.flipX = false
      player.move(player.speed, 0)
    })

    ka.onKeyDown('space', () => {
      if (player.canJump) {
        player.jump(player.jumpForce) // 施加向上的冲量
        player.canJump = false // 禁止连续跳跃
      }
    })

    ka.onMousePress((key) => {
      if (key === 'left') attack(player.flipX)
    })

    const ground = ka.add([
      ka.rect(ka.width(), 20),
      ka.color('#303030'),
      ka.pos(0, ka.height() * 0.75),
      ka.area(),
      ka.body({ isStatic: true }),
      'ground',
      ka.z(900),
    ])

    const createTrees = () => {
      const treeCount = 5
      const treeInsCount = ka.randi(5, 15)
      for (let i = 0; i < treeInsCount; i++) {
        const distance = ka.randi(20, 60)
        const treeIndex = ka.randi(treeCount)
        const height = 120 - distance
        ground.add([
          ka.sprite(`tree${treeIndex}`, { height }),
          ka.pos(ka.randi(ka.width()), -height + 5),
          ka.z(90 - distance),
        ])
      }
    }

    createTrees()

    const attack = (isFlixX: boolean) => {
      let speed = 200
      const dir = isFlixX ? -1 : 1
      const fire = ka.add([
        ka.sprite('fireBall', { width: 30 }),
        ka.pos(player.worldPos()!.x + dir * 20 + 15, player.worldPos()!.y),
        ka.shader('shadow'),
      ])
      fire.flipX = isFlixX

      fire.on('update', () => {
        speed += 10
        fire.move(dir * speed, 0)
        if (
          fire.worldPos()!.x < -100 ||
          fire.worldPos()!.x > ka.width() + 100
        ) {
          fire.destroy()
        }
      })
    }

    ka.onUpdate(() => {
      if (player.vel.y > 1200) {
        player.vel.y = 1200 // 限制最大下落速度
      }
    })
  })

  ka.go('one')
}
