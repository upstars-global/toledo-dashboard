/* eslint sort-keys: "error" */
export default {
  actions: {
    backup: 'Backup',
    backupSelected: 'Backup reports',
    cancel: 'Cancel',
    createReference: 'Create reference | Create references',
    createSelectedReference: 'Create selected reference | Create selected references',
    delete: 'Delete',
    deleteSelected: 'Delete reports',
    open: 'Open',
    refreshApps: 'Refresh Apps',
    refreshJobs: 'Refresh Jobs',
    showReport: 'Show report',
    startSelectedTest: 'Start selected test | Start selected tests',
    startTest: 'Start test'
  },
  breadcrumbs: {
    home: 'Home'
  },
  controlPanel: {
    actions: {
      title: 'Actions'
    },
    diskUsage: {
      backups: 'Backups: {text}',
      references: 'References: {text}',
      reports: 'Tests: {text}',
      scenarios: 'Scenarios: {text}',
      title: 'File storage',
      used: '{used} used out of {capacity}'
    },
    jobs: {
      status: {
        'active': 'Active',
        'completed': 'Completed',
        'delayed': 'Delayed',
        'failed': 'Failed',
        'prioritized': 'Prioritized',
        'waiting': 'Waiting',
        'waiting-children': 'Waiting children'
      },
      title: 'Jobs status'
    }
  },
  envs: {
    columns: {
      name: 'Environment name',
      version: 'Version'
    }
  },
  global: {
    appName: 'ToledoDashboard',
    filter: 'Filter by name',
    title: 'Toledo Dashboard'
  },
  home: {
    card: {
      title: 'Frontera'
    }
  },
  login: {
    providers: {
      dev: 'Developer mode',
      github: 'Continue with GitHub',
      google: 'Continue with Google'
    },
    title: 'Sign in'
  },
  menu: {
    appearance: 'Appearance',
    github: 'GitHub repository',
    neutral: 'Neutral',
    primary: 'Primary',
    secondary: 'Secondary',
    theme: 'Theme'
  },
  modal: {
    backup: {
      description:
        'Are you sure you want to backup the report? | Are you sure you want to backup the selected reports?',
      title: 'Backup report | Backup reports'
    },
    createReference: {
      common: 'Are you sure you want to create new references for all scenarios?',
      description:
        'Are you sure you want to create new reference for selected scenario? | Are you sure you want to create new references for selected scenarios?',
      title: 'Create reference | Create references'
    },
    delete: {
      description:
        'Are you sure you want to delete the report? | Are you sure you want to delete the selected reports?',
      title: 'Delete report | Delete reports'
    },
    startSelectedTest: {
      apps: {
        dynamic: {
          label: 'Dynamic apps',
          matching: 'Persistent apps matching "${query}"...'
        },
        persistent: {
          label: 'Persistent apps',
          matching: 'Dynamic apps matching "${query}"...'
        }
      },
      description: 'Config parameters for test',
      headline: 'Choose application',
      misMatchThreshold: 'Mismatch threshold',
      misMatchThresholdPlaceholder: 'Set mismatch threshold',
      refresh: 'Refresh application list',
      searchPlaceholder: 'Search applications...',
      title: 'Start selected test | Start selected tests'
    },
    startTest: {
      description: 'Launch test for: {name} environment',
      misMatchThreshold: 'Mismatch threshold',
      misMatchThresholdPlaceholder: 'Set mismatch threshold',
      title: 'Start test'
    }
  },
  mode: {
    dark: 'Dark',
    light: 'Light',
    system: 'System'
  },
  navigation: {
    backups: 'Backups',
    envs: 'Environments',
    panel: 'Control panel',
    references: 'References',
    reports: 'Reports',
    scenarios: 'Scenarios'
  },
  notifications: {
    references: {
      added: 'Creation of references has been added to queue',
      failed: 'Reference creation failed',
      finish: 'Creation of references has finished',
      start: 'Creation of references has started'
    },
    report: {
      backup: 'Report has been backed up | Reports have been backed up',
      delete: 'Report has been deleted | Reports have been deleted',
      error: {
        backup: 'Report backup failed | Reports backup failed',
        delete: 'Report deletion failed | Reports deletion failed'
      }
    },
    tests: {
      added: 'Test has been added to queue',
      failed: 'Test failed',
      finish: 'Testing has finished',
      start: 'Testing started'
    }
  },
  reports: {
    columns: {
      branchName: 'Branch name',
      createDate: 'Created',
      environment: 'Environment',
      id: 'ID',
      isDynamic: 'Dynamic env',
      pipeline: 'Pipeline ID',
      result: 'Result',
      size: 'Size',
      status: 'Status'
    },
    result: {
      broken: 'Broken',
      count: 'Total',
      failed: 'Failed',
      passed: 'Passed'
    },
    status: {
      crashed: 'Crashed',
      error: 'Error',
      failed: 'Failed',
      passed: 'Passed',
      pending: 'Pending',
      unknown: 'Unknown'
    }
  },
  scenarios: {
    columns: {
      name: 'Test name'
    },
    filtered: 'Scenarios filtered: {count}',
    selected: 'Scenarios selected: {count}',
    total: 'Scenarios total: {count}'
  },
  user: {
    logout: 'Logout'
  }
}
