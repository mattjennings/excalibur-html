import * as ex from 'excalibur'
import { ReactComponent, ReactSystem } from '..//systems/react-system'
import { useEffect, useState } from 'react'

export class ReactScene extends ex.Scene {
  constructor() {
    super()
    this.world.systemManager.addSystem(new ReactSystem())
  }

  onInitialize() {
    this.add(new ReactEntity())
  }
}

class ReactEntity extends ex.Actor {
  ui = new ReactComponent(() => {
    const [text, setText] = useState('click me')
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

  constructor() {
    super()
    this.addComponent(this.ui)
  }
}
