import {
  Component,
  ComponentCtor,
  Engine,
  Entity,
  Query,
  Scene,
  System,
  SystemType,
  Vector,
  World,
} from 'excalibur'

/////////////// System ////////////////

export interface BaseHTMLSystemArgs {
  onSetup?: (root: HTMLDivElement) => void
}

export abstract class BaseHTMLSystem<
  T extends BaseHTMLComponent,
> extends System {
  systemType = SystemType.Draw
  root = document.createElement('div')

  query!: Query<ComponentCtor<T>>
  engine!: Engine

  private needsResize = true
  protected entitiesToRender = new Set<Entity<T>>()
  protected entitiesToCleanup = new Set<Entity<T>>()

  abstract createQuery(world: World): Query<ComponentCtor<T>>

  constructor(args: BaseHTMLSystemArgs = {}) {
    super()

    if (args?.onSetup) {
      args.onSetup(this.root)
    }
  }

  initialize(world: World, scene: Scene<unknown>): void {
    this.query = this.createQuery(world)

    this.engine = scene.engine
    this.resizeToCanvas()

    window.addEventListener('resize', () => {
      this.needsResize = true
    })

    scene.on('deactivate', () => {
      if (this.root.isConnected) {
        this.root.remove()
        this.onUnmount()
      }
    })

    scene.on('activate', () => {
      if (!this.root.isConnected) {
        document.body.appendChild(this.root)
        this.onMount()
      }
    })

    this.query.entityAdded$.subscribe((entity) => {
      this.entitiesToRender.add(entity)
    })
    this.query.entityRemoved$.subscribe((entity) => {
      this.entitiesToRender.add(entity)
    })
  }

  onMount() {}
  onUnmount() {}

  update() {
    if (this.needsResize) {
      this.resizeToCanvas()
    }

    this.render(this.entitiesToRender)
    this.cleanup(this.entitiesToCleanup)
    this.entitiesToRender.clear()
    this.entitiesToCleanup.clear()
  }

  abstract render(entities: Set<Entity<T>>): void
  abstract cleanup(entities: Set<Entity<T>>): void

  protected getPixelConversion(engine: Engine) {
    const origin = engine.screen.worldToPageCoordinates(Vector.Zero)
    const singlePixel = engine.screen
      .worldToPageCoordinates(new Vector(1, 0))
      .sub(origin)
    return singlePixel.x
  }

  protected resizeToCanvas() {
    const canvas = this.engine.canvas
    const rect = canvas.getBoundingClientRect()
    this.root.style.position = 'absolute'
    this.root.style.top = rect.top + 'px'
    this.root.style.left = rect.left + 'px'
    this.root.style.width = `${rect.width}px`
    this.root.style.height = `${rect.height}px`
    this.root.style.overflow = 'hidden'
    this.root.style.pointerEvents = 'none'

    this.root.style.setProperty(
      '--ex-pixel',
      this.getPixelConversion(this.engine).toString(),
    )
  }
}

/////////////// Component ////////////////

export abstract class BaseHTMLComponent extends Component {
  type = 'HTMLComponent'
  container: HTMLElement

  constructor(args: { container: HTMLElement }) {
    super()
    this.container = args.container
  }

  abstract create(): void
  abstract destroy(): void
}
