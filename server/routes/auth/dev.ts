import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const userData = {
      avatar: '',
      email: 'developer@local.host',
      name: 'Local Developer',
      id: 'dev-local-user'
    }
    await setUserSession(event, { user: userData })
    return sendRedirect(event, '/')
  } catch (error) {
    return throwError(error, 'Dev OAuth')
  }
})
