import * as ex from 'excalibur'
import { HTMLComponent, HTMLSystem, RenderFn } from '../systems/html-system'

export class HTMLScene extends ex.Scene {
  constructor() {
    super()
    this.world.systemManager.addSystem(new HTMLSystem())
  }

  onInitialize() {
    this.add(new HTMLEntity())
  }
}

export class HTMLEntity extends ex.Actor {
  constructor() {
    super()
    this.addComponent(new HTMLComponent(this.ui))
  }

  ui: RenderFn = (el) => {
    el.innerHTML =
      '<button style="pointer-events: auto; cursor: pointer;">click me</button>'
    const btn = el.querySelector('button')

    let timer: number | undefined
    if (btn) {
      btn.onclick = () => {
        btn.innerText = 'waiting 1s'
        this.pos.x = Math.round(Math.random() * 100)
        this.pos.y = Math.round(Math.random() * 100)
        timer = setTimeout(() => {
          btn.innerText = 'my position is ' + this.pos
        }, 1000)
      }
    }

    return () => {
      // cleanup any side effects here
      clearTimeout(timer)
    }
  }
}
