<script setup lang="ts">
import type { BackstopImageId } from '~~/shared/types'

interface SettingOption {
  id: BackstopImageId
  label: string
}

const { t } = useI18n()
const { ui } = useAppConfig()

const { settings, settingsAllImagesHidden } = storeToRefs(useReportStore())
const { setSettingsAllImages } = useReportStore()

const open = ref(false)

const hideAllImages = computed({
  get: () => settingsAllImagesHidden.value,
  set: (hidden: boolean) => setSettingsAllImages(!hidden)
})

const options: SettingOption[] = [
  { id: 'refImage', label: t('report.settings.options.ref') },
  { id: 'testImage', label: t('report.settings.options.test') },
  { id: 'diffImage', label: t('report.settings.options.diff') }
] as const
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'end' }">
    <UButton :icon="ui.icons.settings" color="neutral" variant="subtle" />

    <template #content>
      <div class="w-56 divide-y divide-default px-5 py-2">
        <USwitch
          v-model="settings.textInfo"
          :label="t('report.settings.options.text')"
          class="justify-between py-2.5"
          :ui="{ wrapper: 'order-first me-auto' }"
        />
        <USwitch
          v-model="hideAllImages"
          :label="t('report.settings.options.hide')"
          class="justify-between py-2.5"
          :ui="{ wrapper: 'order-first me-auto' }"
        />
        <USwitch
          v-for="option in options"
          :key="option.id"
          v-model="settings[option.id]"
          :label="option.label"
          class="justify-between py-2.5"
          :ui="{ wrapper: 'order-first me-auto' }"
        />
      </div>
    </template>
  </UPopover>
</template>
