import { onMount } from 'solid-js'
import { sketch } from './sketch'

export const title = 'scene01'

export default function Scene01() {
  let refCanvas!: HTMLCanvasElement
  onMount(() => {
    sketch(refCanvas)
  })
  return (
    <div class="sketch1">
      <canvas ref={refCanvas}></canvas>
    </div>
  )
}
