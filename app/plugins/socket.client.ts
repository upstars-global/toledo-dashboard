import type { Emitter } from 'mitt'
import type { ApplicationEvents, JobStatusMessage } from '~~/shared/types'

export default defineNuxtPlugin((nuxtApp) => {
  const socketHost = nuxtApp.$config.public.socketHost

  const { userId } = useCurrentUser()
  const $bus = nuxtApp.$bus as Emitter<ApplicationEvents>
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const socket = new WebSocket(`${protocol}//${socketHost}/ws/jobs`)

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'subscribe', userId: userId.value }))

    console.log('WebSocket connected')
  })

  socket.addEventListener('message', async (event) => {
    const message: JobStatusMessage = JSON.parse(event.data)

    if (message.type === 'job-status') {
      if (message.command === 'reference') {
        $bus.emit('job:reference', message)
      }

      if (message.command === 'test') {
        $bus.emit('job:test', message)
      }
    }
  })

  socket.addEventListener('close', () => {
    console.log('WebSocket closed')
  })
})
