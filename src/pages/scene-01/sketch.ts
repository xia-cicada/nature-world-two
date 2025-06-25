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
    const dinosaur = ka.add([
      ka.sprite('dinosaur', {
        width: 50,
      }),
      ka.pos(80, 80),
      ka.shader('shadow'),
      'dinosaur',
      'dangerous',
      'big',
    ])

    const attack = (isFlixX: boolean) => {
      let speed = 200
      const dir = isFlixX ? -1 : 1
      const fire = dinosaur.add([
        ka.sprite('fireBall', { width: 30 }),
        ka.pos(dir * 20 + 15, 0),
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

    ka.onKeyDown((key) => {
      const speed = 100
      const x = key === 'a' ? -speed : key === 'd' ? speed : 0
      const y = key === 'w' ? -speed : key === 's' ? speed : 0
      dinosaur.move(x, y)
      if (x < 0) dinosaur.flipX = true
      else if (x > 0) dinosaur.flipX = false
    })

    ka.onMousePress((m) => {
      if (m === 'left') {
        attack(dinosaur.flipX)
      }
    })
  })

  ka.go('one')
}
