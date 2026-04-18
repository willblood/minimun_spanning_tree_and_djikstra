<script setup lang="ts">
import { useGraphStore } from '../stores/graphStore'
const store = useGraphStore()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-700">Controls</h2>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1">Source Node</label>
        <select v-model="store.source" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option v-for="n in store.graph.nodes" :key="n.id" :value="n.id">{{ n.label }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1">Target Node</label>
        <select v-model="store.target" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option v-for="n in store.graph.nodes" :key="n.id" :value="n.id">{{ n.label }}</option>
        </select>
      </div>
    </div>
    <div class="space-y-2">
      <button @click="store.runPrim()" class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">🌿 Run Prim's MST</button>
      <button @click="store.runDijkstra()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">🔵 Run Dijkstra's Path</button>
      <button @click="store.runBoth()" class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">⚡ Run Both & Compare</button>
      <button @click="store.reset()" class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">↺ Reset</button>
    </div>
    <div class="space-y-1 pt-2 border-t border-slate-100">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Legend</p>
      <div class="flex items-center gap-2 text-xs text-slate-600"><span class="w-4 h-4 rounded-full bg-yellow-400 shrink-0" /> Source node</div>
      <div class="flex items-center gap-2 text-xs text-slate-600"><span class="w-4 h-4 rounded-full bg-red-500 shrink-0" /> Target node</div>
      <div class="flex items-center gap-2 text-xs text-slate-600"><span class="w-4 h-1 bg-green-500 shrink-0 rounded" /> MST edge</div>
      <div class="flex items-center gap-2 text-xs text-slate-600"><span class="w-4 h-1 bg-blue-500 shrink-0 rounded" /> Shortest path</div>
      <div class="flex items-center gap-2 text-xs text-slate-600"><span class="w-4 h-1 bg-yellow-400 shrink-0 rounded" /> Candidate edge</div>
    </div>
  </div>
</template>
