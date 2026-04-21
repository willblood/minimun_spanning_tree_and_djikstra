<script setup lang="ts">
import { useKruskalStore } from '../stores/kruskalStore'
const store = useKruskalStore()

function onSpeedChange(e: Event) {
  store.setSpeed(parseInt((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-slate-700">Animation</h2>
      <span class="text-xs text-slate-500 font-mono">
        <template v-if="store.totalSteps > 0">
          Step {{ store.currentStepIndex + 1 }} / {{ store.totalSteps }}
        </template>
        <template v-else>No steps yet</template>
      </span>
    </div>

    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full bg-emerald-500 rounded-full transition-all"
        :style="{
          width:
            store.totalSteps > 0
              ? `${((store.currentStepIndex + 1) / store.totalSteps) * 100}%`
              : '0%',
        }"
      />
    </div>

    <p class="text-xs text-slate-500 min-h-[1.5rem] italic truncate">
      {{ store.currentStep?.message ?? 'Press play to animate Kruskal\'s algorithm' }}
    </p>

    <div class="flex items-center gap-2">
      <button
        @click="store.prevStep()"
        :disabled="store.currentStepIndex <= 0"
        class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 text-sm font-bold"
      >
        ◀
      </button>
      <button
        v-if="!store.isPlaying"
        @click="store.play()"
        :disabled="store.totalSteps === 0"
        class="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm disabled:opacity-40"
      >
        ▶ Play
      </button>
      <button
        v-else
        @click="store.pause()"
        class="flex-1 py-1.5 rounded-lg bg-orange-400 hover:bg-orange-500 text-white font-semibold text-sm"
      >
        ⏸ Pause
      </button>
      <button
        @click="store.nextStep()"
        :disabled="store.currentStepIndex >= store.totalSteps - 1"
        class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 text-sm font-bold"
      >
        ▶
      </button>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-500 mb-1">
        Speed: {{ store.animationSpeed }}ms / step
      </label>
      <input
        type="range"
        min="200"
        max="1200"
        step="100"
        :value="store.animationSpeed"
        @input="onSpeedChange"
        class="w-full accent-emerald-500"
      />
      <div class="flex justify-between text-xs text-slate-400 mt-0.5">
        <span>Fast</span><span>Slow</span>
      </div>
    </div>
  </div>
</template>
