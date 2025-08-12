import { ComponentCtor, Entity, Query, SystemType, World } from 'excalibur'
import { BaseHTMLComponent, BaseHTMLSystem } from '../base-html-system'

export class HTMLSystem extends BaseHTMLSystem<HTMLComponent> {
  systemType = SystemType.Draw

  createQuery(world: World): Query<ComponentCtor<HTMLComponent>> {
    return world.query([HTMLComponent])
  }

  render(entities: Set<Entity<any>>) {
    for (const entity of entities) {
      const cmp = entity.get(HTMLComponent)
      if (cmp) {
        if (!cmp.container.isConnected) {
          this.root.appendChild(cmp.container)
          cmp.create()
        }
      }
    }
  }

  cleanup(entities: Set<Entity<any>>) {
    for (const entity of entities) {
      const cmp = entity.get(HTMLComponent)
      if (cmp) {
        cmp.destroy()
      }
    }
  }
}

export type CleanupFn = (() => void) | void
export type RenderFn = (container: HTMLElement) => CleanupFn

export class HTMLComponent extends BaseHTMLComponent {
  type = 'HTMLComponent'

  private renderFn: RenderFn
  private cleanupFn: CleanupFn = undefined

  constructor(fn: RenderFn) {
    super({
      container: document.createElement('div'),
    })
    this.renderFn = fn
  }

  create() {
    if (!this.container) return
    this.cleanupFn = this.renderFn(this.container)
  }

  destroy() {
    this.cleanupFn?.()
    this.cleanupFn = undefined
    this.container?.remove()
  }
}
