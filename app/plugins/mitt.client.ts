import type { ApplicationEvents } from '~~/shared/types'
import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>()

  return {
    provide: {
      bus: {
        on: emitter.on,
        off: emitter.off,
        emit: emitter.emit
      }
    }
  }
})
