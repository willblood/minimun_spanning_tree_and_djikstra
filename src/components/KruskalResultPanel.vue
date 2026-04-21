<script setup lang="ts">
import { useKruskalStore } from '../stores/kruskalStore'
const store = useKruskalStore()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-700">Results</h2>

    <div class="rounded-lg bg-emerald-50 border border-emerald-200 p-3 space-y-2">
      <p class="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Kruskal's MST</p>
      <p class="text-sm text-slate-700">
        Total weight:
        <span class="font-bold text-emerald-700">
          {{ store.mstTotalWeight > 0 ? store.mstTotalWeight : '—' }}
        </span>
      </p>
      <p class="text-sm text-slate-700">
        Edges selected:
        <span class="font-bold text-emerald-700">
          {{ store.mstEdges.length > 0 ? store.mstEdges.length : '—' }}
          <template v-if="store.mstEdges.length > 0"> / {{ store.graph.nodes.length - 1 }} needed</template>
        </span>
      </p>
      <div v-if="store.mstEdges.length > 0" class="space-y-1 pt-1 border-t border-emerald-100">
        <p class="text-xs font-semibold text-emerald-600">MST Edges (sorted by selection order):</p>
        <div
          v-for="(edge, i) in store.mstEdges"
          :key="i"
          class="flex items-center justify-between text-xs text-slate-600 font-mono"
        >
          <span>{{ edge.source }} — {{ edge.target }}</span>
          <span class="font-bold text-emerald-700">w={{ edge.weight }}</span>
        </div>
      </div>
    </div>

    <div class="text-xs text-slate-500 space-y-1 border-t pt-3">
      <p class="font-semibold text-slate-600">Why Kruskal works?</p>
      <p>
        By always picking the <em>cheapest safe edge</em> (one that doesn't form a cycle),
        Kruskal greedily builds the minimum-cost spanning tree.
        Union-Find detects cycles in near O(1) time.
      </p>
    </div>
  </div>
</template>
