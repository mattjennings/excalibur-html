import * as ex from 'excalibur'
import './style.css'
import { ReactScene } from './scenes/react'
import { HTMLScene } from './scenes/html'

const game = new ex.Engine({
  width: 600,
  height: 400,
  displayMode: ex.DisplayMode.FitScreen,
  scenes: {
    html: {
      scene: new HTMLScene(),
    },
    react: {
      scene: new ReactScene(),
    },
  },
})

game.goToScene('react')
game.start()
