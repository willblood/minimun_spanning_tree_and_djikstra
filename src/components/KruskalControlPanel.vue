<script setup lang="ts">
import { useKruskalStore } from '../stores/kruskalStore'
const store = useKruskalStore()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-700">Controls</h2>
    <div class="space-y-2">
      <button
        @click="store.runKruskal()"
        class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
      >
        🌲 Run Kruskal's MST
      </button>
      <button
        @click="store.reset()"
        class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
      >
        ↺ Reset
      </button>
    </div>

    <div class="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-slate-600 space-y-1">
      <p class="font-semibold text-emerald-700">How it works</p>
      <p>1. Sort all edges by weight</p>
      <p>2. Pick the cheapest edge that doesn't create a cycle</p>
      <p>3. Repeat until V-1 edges are selected</p>
    </div>

    <div class="space-y-1 pt-2 border-t border-slate-100">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Legend</p>
      <div class="flex items-center gap-2 text-xs text-slate-600">
        <span class="w-4 h-1 bg-emerald-500 shrink-0 rounded" /> MST edge (accepted)
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-600">
        <span class="w-4 h-1 bg-yellow-400 shrink-0 rounded" /> Checking edge
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-600">
        <span class="w-4 h-1 bg-red-400 shrink-0 rounded border border-dashed" /> Rejected (cycle)
      </div>
    </div>
  </div>
</template>
