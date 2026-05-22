import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

export const useNavigationStore = defineStore('navigation', () => {
  const { t } = useI18n()
  const { ui } = useAppConfig()
  const localePath = useLocalePath()
  const { user, logout } = useCurrentUser()
  const { projectsList } = storeToRefs(useConfigStore())
  const colorMode = useColorMode()
  const { currentRoute } = useRouter()

  const colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose'
  ]
  const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

  const userNavigation = computed<DropdownMenuItem[][]>(() => [
    [
      {
        type: 'label',
        label: user.value?.name,
        avatar: {
          src: user.value?.avatar,
          alt: user.value?.name || ''
        }
      }
    ],
    [
      {
        label: t('menu.theme'),
        icon: ui.icons.palette,
        children: [
          {
            label: t('menu.primary'),
            slot: 'chip',
            chip: ui.colors.primary,
            content: {
              align: 'center',
              collisionPadding: 16
            },
            children: colors.map((color) => ({
              label: color,
              chip: color,
              slot: 'chip',
              checked: ui.colors.primary === color,
              type: 'checkbox',
              onSelect: (e) => {
                e.preventDefault()

                ui.colors.primary = color
                window.localStorage.setItem('nuxt-ui-primary', color)
              }
            }))
          },
          {
            label: t('menu.secondary'),
            slot: 'chip',
            chip: ui.colors.secondary,
            content: {
              align: 'center',
              collisionPadding: 16
            },
            children: colors.map((color) => ({
              label: color,
              chip: color,
              slot: 'chip',
              checked: ui.colors.secondary === color,
              type: 'checkbox',
              onSelect: (e) => {
                e.preventDefault()

                ui.colors.secondary = color
                window.localStorage.setItem('nuxt-ui-secondary', color)
              }
            }))
          },
          {
            label: t('menu.neutral'),
            slot: 'chip',
            chip: ui.colors.neutral === 'neutral' ? 'old-neutral' : ui.colors.neutral,
            content: {
              align: 'end',
              collisionPadding: 16
            },
            children: neutrals.map((color) => ({
              label: color,
              chip: color === 'neutral' ? 'old-neutral' : color,
              slot: 'chip',
              type: 'checkbox',
              checked: ui.colors.neutral === color,
              onSelect: (e) => {
                e.preventDefault()

                ui.colors.neutral = color
                window.localStorage.setItem('nuxt-ui-neutral', color)
              }
            }))
          }
        ]
      },
      {
        label: t('menu.appearance'),
        icon: ui.icons.sunMoon,
        children: [
          {
            label: t('mode.light'),
            icon: ui.icons.light,
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
              e.preventDefault()

              colorMode.preference = 'light'
            }
          },
          {
            label: t('mode.dark'),
            icon: ui.icons.dark,
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onUpdateChecked(checked: boolean) {
              if (checked) {
                colorMode.preference = 'dark'
              }
            },
            onSelect(e: Event) {
              e.preventDefault()
            }
          }
        ]
      }
    ],
    [
      {
        label: t('menu.github'),
        icon: ui.icons.github,
        to: 'https://github.com/upstars-global/toledo-dashboard',
        target: '_blank'
      },
      {
        label: t('user.logout'),
        icon: ui.icons.logout,
        onSelect: logout
      }
    ]
  ])

  const getProjectNavigation = (projectId: string): NavigationMenuItem[] => [
    {
      label: t('navigation.panel'),
      icon: ui.icons.controlPanel,
      to: localePath(`/${projectId}`),
      exact: true
    },
    {
      label: t('navigation.scenarios'),
      icon: ui.icons.listTree,
      to: localePath(`/${projectId}/scenarios`)
    },
    {
      label: t('navigation.envs'),
      icon: ui.icons.appWindow,
      to: localePath(`/${projectId}/envs`)
    },
    {
      label: t('navigation.references'),
      icon: ui.icons.images,
      to: localePath(`/${projectId}/references`)
    },
    {
      label: t('navigation.reports'),
      icon: ui.icons.folderOpen,
      to: localePath(`/${projectId}/reports`)
    },
    {
      label: t('navigation.backups'),
      icon: ui.icons.folderArchive,
      to: localePath(`/${projectId}/backups`)
    }
  ]

  const taxonomy = computed<NavigationMenuItem[] | null>(() => {
    return projectsList.value.map((project) => ({
      ...project,
      defaultOpen: true,
      active: project.id === currentRoute.value.params.project,
      children: getProjectNavigation(project.id)
    }))
  })

  return {
    taxonomy,
    userNavigation,
    getProjectNavigation
  }
})
