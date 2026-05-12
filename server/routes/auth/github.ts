import { throwError } from '~~/server/helpers/throwError'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user }) {
    const allowEmailHosts = process.env.ALLOW_EMAIL_HOSTS?.split(',') || []
    const allowCompanies = process.env.ALLOW_GITHUB_COMPANIES?.split(',') || []
    const emailHost = user?.email?.split('@').at(1)
    const isEmailHostAllowed = allowEmailHosts.some((host) => host === emailHost)
    const isCompanyAllowed = allowCompanies.some((company) => company === user?.company?.toLowerCase())

    if (isCompanyAllowed && isEmailHostAllowed) {
      try {
        const userData = {
          avatar: user.avatar_url,
          email: user.email ?? '',
          name: user.name,
          id: `github-${user.id}`
        }
        await setUserSession(event, { user: userData })
        return sendRedirect(event, '/')
      } catch (error) {
        return throwError(error, 'GitHub OAuth')
      }
    } else {
      return throwError('Forbidden', 'GitHub OAuth: ', 403)
    }
  },
  onError(event, error) {
    throwError(error, 'GitHub OAuth')
    return sendRedirect(event, '/')
  }
})
