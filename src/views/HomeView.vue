<script setup lang="ts">
import GraphCanvas from '../components/GraphCanvas.vue'
import ControlPanel from '../components/ControlPanel.vue'
import StepPlayer from '../components/StepPlayer.vue'
import ResultPanel from '../components/ResultPanel.vue'
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <main class="flex-1 max-w-7xl mx-auto w-full p-4 flex gap-4" style="min-height: 0;">
      <div class="flex-1 min-h-[540px]"><GraphCanvas /></div>
      <div class="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto">
        <ControlPanel />
        <StepPlayer />
        <ResultPanel />
      </div>
    </main>
  </div>
</template>
