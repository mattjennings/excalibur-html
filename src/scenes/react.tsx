import * as ex from 'excalibur'
import { ReactComponent, ReactSystem } from '../systems/react-system'
import { useEffect, useState } from 'react'

export class ReactScene extends ex.Scene {
  constructor() {
    super()
    this.world.systemManager.addSystem(new ReactSystem())
  }

  onInitialize() {
    const e = new ReactEntity('i will be destroyed and replaced in 1s')
    this.add(e)
    setTimeout(() => {
      this.add(new ReactEntity('click me'))
      e.kill()
    }, 1000)
  }
}

class ReactEntity extends ex.Actor {
  ui = new ReactComponent(() => {
    const [text, setText] = useState(this.text)
    const [timer, setTimer] = useState<number | undefined>()

    useEffect(() => {
      return () => {
        clearTimeout(timer)
      }
    }, [timer])

    return (
      <button
        style={{
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        onClick={() => {
          setText('waiting 1s')
          this.pos.x = Math.round(Math.random() * 100)
          this.pos.y = Math.round(Math.random() * 100)
          setTimer(
            setTimeout(() => {
              setText('my position is ' + this.pos)
            }, 1000),
          )
        }}
      >
        {text}
      </button>
    )
  })

  constructor(public text: string) {
    super()
    this.addComponent(this.ui)
  }
}
