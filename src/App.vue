<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <header class="bg-slate-800 text-white py-4 px-6 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold tracking-tight">Graph Algorithm Visualizer</h1>
          <p class="text-slate-400 text-sm">Interactive step-by-step algorithm demos</p>
        </div>
        <div class="text-right text-xs text-slate-400">
          <p>8 nodes · 12 edges</p>
        </div>
      </div>

      <!-- Tab navigation -->
      <div class="max-w-7xl mx-auto mt-3 flex gap-1">
        <router-link
          to="/"
          class="px-4 py-1.5 rounded-t-lg text-sm font-semibold transition-colors"
          :class="route.path === '/' ? 'bg-slate-100 text-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-700'"
        >
          Prim's MST · Dijkstra
        </router-link>
        <router-link
          to="/kruskal"
          class="px-4 py-1.5 rounded-t-lg text-sm font-semibold transition-colors"
          :class="route.path === '/kruskal' ? 'bg-slate-100 text-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-700'"
        >
          Kruskal's MST
        </router-link>
      </div>
    </header>

    <router-view class="flex-1 flex flex-col min-h-0" />
  </div>
</template>
