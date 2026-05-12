import { throwError } from '~~/server/helpers/throwError'

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const allowEmailHosts = process.env.ALLOW_EMAIL_HOSTS?.split(',') || []
    const emailHost = user?.email?.split('@').at(1)
    const isEmailHostAllowed = allowEmailHosts.some((host) => host === emailHost)
    const isHostedDomainAllowed = allowEmailHosts.some((host) => host === user?.hd)

    if (isHostedDomainAllowed && isEmailHostAllowed) {
      try {
        const userData = {
          avatar: user.picture,
          email: user.email,
          name: user.name,
          id: `google-${user.sub}`
        }
        await setUserSession(event, { user: userData })
        return sendRedirect(event, '/')
      } catch (error) {
        return throwError(error, 'Google OAuth')
      }
    } else {
      return throwError('Forbidden', 'Google OAuth:', 403)
    }
  },

  onError(event, error) {
    throwError(error, 'Google OAuth')
    return sendRedirect(event, '/')
  }
})
