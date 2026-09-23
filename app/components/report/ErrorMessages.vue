<script setup lang="ts">
import type { BackstopTestPair } from '~~/shared/types'

interface ReportErrorMessagesProps {
  pair?: BackstopTestPair
}
const props = defineProps<ReportErrorMessagesProps>()

const { ui } = useAppConfig()
const messages = computed(() =>
  [
    { title: 'ENGINE ERROR', description: props.pair?.engineErrorMsg },
    { title: 'BACKSTOP ERROR', description: props.pair?.error }
  ].filter((message) => Boolean(message.description))
)
</script>

<template>
  <div v-if="messages.length" class="flex flex-col gap-2 py-2.5">
    <UAlert
      v-for="message in messages"
      :key="message.title"
      color="error"
      variant="subtle"
      :icon="ui.icons.warning"
      :title="message.title"
      :description="message.description"
      :ui="{ description: 'font-mono break-words whitespace-pre-wrap' }"
    />
  </div>
</template>
