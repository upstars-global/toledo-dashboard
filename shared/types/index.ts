import type { H3Error } from 'h3'

export enum EnvironmentType {
  STAGING = 'staging',
  DEVELOPMENT = 'development'
}

export type ServerCommonResponse = Partial<H3Error>

export type Locale = 'en'

type ReportStatus = 'passed' | 'failed' | 'pending' | 'crashed' | 'error' | 'unknown'

export type BackstopCommand = 'reference' | 'test'

export type Observer<T> = {
  [key: number | string]: T
}

export type FormatedBytes = {
  bytes: number
  text: string
}

export interface ReferenceRequestBody {
  scenarios?: string[]
  userName?: string
  userId?: string
}

export interface Application {
  id?: string
  environment?: EnvironmentType
  name?: string
  url?: string
  isDynamic?: boolean
  version?: {
    tag?: string
    pipeline?: string
  }
}

export type SelectedApp = {
  label: string
  description: string
  app: Application
}

export interface StartTestRequestBody {
  application?: Application
  misMatchThreshold?: number
  scenarios?: string[]
  userName?: string
  userId?: string
}

export interface DiskSpace<T> {
  capacity: T
  folders: {
    backups?: T
    references?: T
    reports?: T
    scenarios?: T
  }
  used?: T
}

export interface ObservableObj {
  listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
  mqList: MediaQueryList
  clients?: number
}

export interface ProjectConfig {
  id: string
  apiUrl: string
  label: string
  icon?: string
  mockUrl?: string
}

export interface Report<T = FormatedBytes> {
  id: string
  environment: string
  pipeline?: string
  branchName: string
  createDate: string
  isDynamic?: boolean
  size?: T
  result: {
    status: ReportStatus
    count?: number
    passed?: number
    failed?: number
    broken?: number
  }
}

export interface Scenario {
  label: string
  url: string
}

export interface Settings {
  misMatchThreshold: number
  repoUrl: string
}

export interface JobStatus {
  id: string
  name: BackstopCommand
  state: 'completed' | 'failed' | 'active' | 'delayed' | 'prioritized' | 'waiting' | 'waiting-children'
  progress: string | boolean | number | object
  attemptsMade?: number
  failedReason?: string
  timestamp: number
  processedOn?: number
  finishedOn?: number
}

export interface JobStatusMessage {
  type: 'job-status'
  status: string
  command?: BackstopCommand
  jobId?: string
  appName?: string
  userId?: string
  error?: string
  timestamp: number
}

export type ApplicationEvents = {
  'job:reference': JobStatusMessage
  'job:test': JobStatusMessage
}
