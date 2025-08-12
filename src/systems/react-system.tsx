import { ReactNode, useSyncExternalStore } from 'react'
import * as ReactDOM from 'react-dom/client'
import { BaseHTMLSystem, BaseHTMLComponent } from './base-html-system'
import { World, Query, ComponentCtor, Entity } from 'excalibur'

export class ReactSystem extends BaseHTMLSystem<ReactComponent> {
  children = new MapStore<number, ReactComponent>()

  constructor() {
    super({})
    const App = this.App.bind(this)
    const reactRoot = ReactDOM.createRoot(this.root)
    reactRoot.render(<App />)
  }

  createQuery(world: World): Query<ComponentCtor<ReactComponent>> {
    return world.query([ReactComponent])
  }

  render(entities: Set<Entity<ReactComponent>>) {
    for (const entity of entities) {
      const key = entity.id
      const component = entity.get<ReactComponent>(ReactComponent)
      this.children.set(key, component)
    }
  }

  cleanup(entities: Set<Entity<ReactComponent>>) {
    for (const entity of entities) {
      const key = entity.id
      const component = this.children.get(key)
      if (component) {
        this.children.delete(key)
      }
    }
  }

  App() {
    const children = useSyncExternalStore(
      this.children.subscribe,
      this.children.getSnapshot,
    )

    return Array.from(children).map(([key, cmp]) => {
      const Child = cmp.create.bind(cmp)
      return <Child key={key} />
    })
  }
}

export class ReactComponent extends BaseHTMLComponent {
  fn: () => ReactNode
  constructor(fn: () => ReactNode) {
    super({
      container: document.createElement('div'),
    })
    this.fn = fn
  }

  create() {
    return this.fn()
  }

  destroy() {
    // no-op, react root handles cleanup of this.fn()
  }
}

/**
 * wrapper around Map to implement methods needed for useSyncExternalStore
 */
class MapStore<Key, Value> extends Map<Key, Value> {
  private listeners: Array<(...args: any[]) => void> = []

  snapshot: Array<[Key, Value]> = Array.from(this.entries())

  set(key: Key, value: Value): this {
    const result = super.set(key, value)
    this.snapshot = Array.from(this.entries())
    this.listeners.forEach((listener) => listener())
    return result
  }

  delete(key: Key): boolean {
    const result = super.delete(key)
    this.snapshot = Array.from(this.entries())
    this.listeners.forEach((listener) => listener())
    return result
  }

  subscribe = (listener: (...args: any[]) => void) => {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getSnapshot = () => {
    return this.snapshot
  }
}
