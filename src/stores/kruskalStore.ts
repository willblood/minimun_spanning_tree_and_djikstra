import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sampleGraph } from '../data/sampleGraph'
import { kruskal } from '../algorithms/kruskal'
import type { Graph, GraphEdge, AlgoStep } from '../algorithms/types'

export const useKruskalStore = defineStore('kruskal', () => {
  const graph = ref<Graph>(sampleGraph)

  const mstEdges = ref<GraphEdge[]>([])
  const mstTotalWeight = ref<number>(0)

  const steps = ref<AlgoStep[]>([])
  const currentStepIndex = ref<number>(-1)
  const isPlaying = ref<boolean>(false)
  const animationSpeed = ref<number>(600)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const currentStep = computed<AlgoStep | null>(() =>
    currentStepIndex.value >= 0 ? (steps.value[currentStepIndex.value] ?? null) : null,
  )
  const totalSteps = computed(() => steps.value.length)

  function runKruskal() {
    resetAnimation()
    const result = kruskal(graph.value)
    mstEdges.value = result.mstEdges
    mstTotalWeight.value = result.totalWeight
    steps.value = result.steps
    currentStepIndex.value = -1
  }

  function nextStep() {
    if (currentStepIndex.value < steps.value.length - 1) {
      currentStepIndex.value++
    } else {
      pause()
    }
  }

  function prevStep() {
    if (currentStepIndex.value > 0) currentStepIndex.value--
  }

  function play() {
    if (isPlaying.value) return
    isPlaying.value = true
    intervalId = setInterval(nextStep, animationSpeed.value)
  }

  function pause() {
    isPlaying.value = false
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function resetAnimation() {
    pause()
    currentStepIndex.value = -1
  }

  function reset() {
    pause()
    mstEdges.value = []
    mstTotalWeight.value = 0
    steps.value = []
    currentStepIndex.value = -1
  }

  function setSpeed(ms: number) {
    animationSpeed.value = ms
    if (isPlaying.value) {
      pause()
      play()
    }
  }

  return {
    graph,
    mstEdges,
    mstTotalWeight,
    steps,
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    animationSpeed,
    runKruskal,
    nextStep,
    prevStep,
    play,
    pause,
    reset,
    setSpeed,
  }
})
