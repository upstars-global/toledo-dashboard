<script setup lang="ts">
import type { BackstopReport } from '~~/shared/types'

interface ReportProps {
  report: BackstopReport
}

defineProps<ReportProps>()
</script>

<template>
  <div class="flex-1 flex flex-col">
    <ReportHeader :report="report" />
    <ReportToolbar :tests="report.tests" />

    <section class="p-4 sm:px-6 bg-elevated flex-1">
      <ReportTestList :tests="report.tests" />
    </section>

    <ReportScrubberModal :branch-name="report.branchName" />
  </div>
</template>
