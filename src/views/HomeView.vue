<script setup lang="ts">
import GraphCanvas from '../components/GraphCanvas.vue'
import ControlPanel from '../components/ControlPanel.vue'
import StepPlayer from '../components/StepPlayer.vue'
import ResultPanel from '../components/ResultPanel.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <header class="bg-slate-800 text-white py-4 px-6 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold tracking-tight">Graph Algorithm Visualizer</h1>
          <p class="text-slate-400 text-sm">Prim's MST · Dijkstra's Shortest Path · Stretch Factor</p>
        </div>
        <div class="text-right text-xs text-slate-400">
          <p>O(E log V) · O((V+E) log V)</p>
          <p class="font-mono">8 nodes · 12 edges</p>
        </div>
      </div>
    </header>
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
