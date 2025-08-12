import * as ex from 'excalibur'
import './style.css'
import { ReactScene } from './react/scene'
import { HTMLScene } from './html/scene'

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

game.goToScene('html')
game.start()
