export function useCurrentUser() {
  const { user, clear } = useUserSession()
  const localePath = useLocalePath()

  async function logout() {
    await clear()
    navigateTo(localePath('/login'))
  }

  const userId = computed(() => user.value?.id)
  const userName = computed(() => user.value?.name)

  return { user, userId, userName, logout }
}
