<script setup lang="ts">
import { useGraphStore } from '../stores/graphStore'
const store = useGraphStore()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-700">Results</h2>
    <div class="rounded-lg bg-green-50 border border-green-200 p-3 space-y-1">
      <p class="text-xs font-semibold text-green-700 uppercase tracking-wide">Prim's MST</p>
      <p class="text-sm text-slate-700">Total weight: <span class="font-bold text-green-700">{{ store.mstTotalWeight > 0 ? store.mstTotalWeight : '—' }}</span></p>
      <p class="text-sm text-slate-700">Path {{ store.source }}→{{ store.target }}:
        <span class="font-bold text-green-700">
          <template v-if="store.mstPathNodes.length">{{ store.mstPathNodes.join(' → ') }} ({{ store.mstPathWeight }})</template>
          <template v-else>—</template>
        </span>
      </p>
    </div>
    <div class="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-1">
      <p class="text-xs font-semibold text-blue-700 uppercase tracking-wide">Dijkstra's Shortest Path</p>
      <p class="text-sm text-slate-700">Path {{ store.source }}→{{ store.target }}:
        <span class="font-bold text-blue-700">
          <template v-if="store.dijkstraPath.length">{{ store.dijkstraPath.join(' → ') }}</template>
          <template v-else>—</template>
        </span>
      </p>
      <p class="text-sm text-slate-700">Distance: <span class="font-bold text-blue-700">{{ store.dijkstraPathWeight > 0 ? store.dijkstraPathWeight : '—' }}</span></p>
    </div>
    <div class="rounded-lg p-3 space-y-1 border-2" :class="store.stretchFactor > 0 ? 'bg-purple-50 border-purple-400' : 'bg-slate-50 border-slate-200'">
      <p class="text-xs font-semibold text-purple-700 uppercase tracking-wide">Stretch Factor</p>
      <p class="text-3xl font-black text-center py-1" :class="store.stretchFactor > 0 ? 'text-purple-700' : 'text-slate-300'">
        {{ store.stretchFactor > 0 ? store.stretchFactor.toFixed(2) + '×' : '—' }}
      </p>
      <p class="text-xs text-slate-600 text-center">MST path distance / Shortest path distance</p>
      <p v-if="store.stretchFactor > 0" class="text-xs text-center font-medium mt-1" :class="store.stretchFactor === 1 ? 'text-green-600' : 'text-orange-600'">
        <template v-if="store.stretchFactor === 1">MST path = shortest path ✓</template>
        <template v-else>MST path is {{ ((store.stretchFactor - 1) * 100).toFixed(0) }}% longer than optimal</template>
      </p>
    </div>
    <div class="text-xs text-slate-500 space-y-1 border-t pt-3">
      <p class="font-semibold text-slate-600">Why MST ≠ Shortest Path?</p>
      <p>MST minimizes <em>total network cost</em>. Dijkstra finds the <em>fastest route</em> between two nodes. Different objectives → different solutions.</p>
    </div>
  </div>
</template>
