<script setup lang="ts">
import KruskalGraphCanvas from '../components/KruskalGraphCanvas.vue'
import KruskalControlPanel from '../components/KruskalControlPanel.vue'
import KruskalStepPlayer from '../components/KruskalStepPlayer.vue'
import KruskalResultPanel from '../components/KruskalResultPanel.vue'
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <main class="flex-1 max-w-7xl mx-auto w-full p-4 flex gap-4" style="min-height: 0;">
      <div class="flex-1 min-h-[540px]"><KruskalGraphCanvas /></div>
      <div class="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto">
        <KruskalControlPanel />
        <KruskalStepPlayer />
        <KruskalResultPanel />
      </div>
    </main>
  </div>
</template>
