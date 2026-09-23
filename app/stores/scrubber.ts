import type { BackstopImageId, ScrubberMode, BackstopTestPair } from '~~/shared/types'

function positionFor(imgId?: BackstopImageId | ''): number {
  switch (imgId) {
    case 'refImage':
      return 100
    case 'testImage':
      return 0
    case 'diffImage':
      return 50
    default:
      return 50
  }
}

function modeFor(imgId?: BackstopImageId | ''): ScrubberMode {
  switch (imgId) {
    case 'refImage':
      return 'SHOW_SCRUBBER_REF_IMAGE'
    case 'testImage':
      return 'SHOW_SCRUBBER_TEST_IMAGE'
    case 'diffImage':
      return 'SHOW_SCRUBBER_DIFF_IMAGE'
    default:
      return 'SCRUB'
  }
}

export const useScrubberStore = defineStore('scrubber', () => {
  const visible = ref(false)
  const pair = ref<BackstopTestPair | null | undefined>(null)
  const position = ref(50)
  const mode = ref<ScrubberMode>('SCRUB')
  const testImageType = ref<BackstopImageId>('testImage')

  function scrubberOpen(target?: BackstopTestPair, imgId?: BackstopImageId) {
    pair.value = target
    position.value = positionFor(imgId)
    mode.value = modeFor(imgId)
    testImageType.value = imgId === 'diffImage' ? 'diffImage' : 'testImage'
    visible.value = true
  }

  function scrubberClose() {
    visible.value = false
    pair.value = null
  }

  function scrubberShowReference() {
    position.value = positionFor('refImage')
    mode.value = 'SHOW_SCRUBBER_REF_IMAGE'
  }

  function scrubberShowTest() {
    position.value = positionFor('testImage')
    mode.value = 'SHOW_SCRUBBER_TEST_IMAGE'
    testImageType.value = 'testImage'
  }

  function scrubberShowDiff() {
    position.value = positionFor('diffImage')
    mode.value = 'SHOW_SCRUBBER_DIFF_IMAGE'
    testImageType.value = 'diffImage'
  }

  function scrubberShowScrub() {
    position.value = positionFor()
    mode.value = 'SCRUB'
    testImageType.value = 'testImage'
  }

  return {
    visible,
    pair,
    position,
    mode,
    testImageType,
    scrubberOpen,
    scrubberClose,
    scrubberShowReference,
    scrubberShowTest,
    scrubberShowDiff,
    scrubberShowScrub
  }
})
