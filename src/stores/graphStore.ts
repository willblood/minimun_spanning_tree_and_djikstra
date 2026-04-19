import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sampleGraph } from '../data/sampleGraph'
import { prim } from '../algorithms/prim'
import { dijkstra } from '../algorithms/dijkstra'
import type { Graph, GraphEdge, AlgoStep } from '../algorithms/types'

function mstPathWeight(
  mstEdges: GraphEdge[],
  source: string,
  target: string,
): { path: string[]; weight: number } {
  const adj = new Map<string, { neighbor: string; weight: number }[]>()
  for (const e of mstEdges) {
    if (!adj.has(e.source)) adj.set(e.source, [])
    if (!adj.has(e.target)) adj.set(e.target, [])
    adj.get(e.source)!.push({ neighbor: e.target, weight: e.weight })
    adj.get(e.target)!.push({ neighbor: e.source, weight: e.weight })
  }
  const visited = new Set<string>()
  const queue: { node: string; path: string[]; weight: number }[] = [
    { node: source, path: [source], weight: 0 },
  ]
  while (queue.length) {
    const { node, path, weight } = queue.shift()!
    if (node === target) return { path, weight }
    visited.add(node)
    for (const { neighbor, weight: w } of adj.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        queue.push({ node: neighbor, path: [...path, neighbor], weight: weight + w })
      }
    }
  }
  return { path: [], weight: Infinity }
}

export const useGraphStore = defineStore('graph', () => {
  const graph = ref<Graph>(sampleGraph)
  const source = ref<string>('A')
  const target = ref<string>('H')

  const mstEdges = ref<GraphEdge[]>([])
  const mstTotalWeight = ref<number>(0)
  const mstPathNodes = ref<string[]>([])
  const mstPathWeight_ = ref<number>(0)

  const dijkstraPath = ref<string[]>([])
  const dijkstraPathWeight = ref<number>(0)
  const stretchFactor = ref<number>(0)

  const primSteps = ref<AlgoStep[]>([])
  const dijkstraSteps = ref<AlgoStep[]>([])
  const activeAlgo = ref<'prim' | 'dijkstra' | 'none'>('none')
  const currentStepIndex = ref<number>(-1)
  const isPlaying = ref<boolean>(false)
  const animationSpeed = ref<number>(600)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const currentSteps = computed(() =>
    activeAlgo.value === 'prim' ? primSteps.value : dijkstraSteps.value,
  )
  const currentStep = computed<AlgoStep | null>(() =>
    currentStepIndex.value >= 0 ? (currentSteps.value[currentStepIndex.value] ?? null) : null,
  )
  const totalSteps = computed(() => currentSteps.value.length)

  function runPrim() {
    resetAnimation()
    const result = prim(graph.value, source.value)
    mstEdges.value = result.mstEdges
    mstTotalWeight.value = result.totalWeight
    primSteps.value = result.steps
    activeAlgo.value = 'prim'
    currentStepIndex.value = -1
  }

  function runDijkstra() {
    resetAnimation()
    const result = dijkstra(graph.value, source.value, target.value)
    dijkstraPath.value = result.path
    dijkstraPathWeight.value = result.pathWeight
    dijkstraSteps.value = result.steps
    activeAlgo.value = 'dijkstra'
    currentStepIndex.value = -1
  }

  function runBoth() {
    const primResult = prim(graph.value, source.value)
    mstEdges.value = primResult.mstEdges
    mstTotalWeight.value = primResult.totalWeight
    primSteps.value = primResult.steps

    const dijResult = dijkstra(graph.value, source.value, target.value)
    dijkstraPath.value = dijResult.path
    dijkstraPathWeight.value = dijResult.pathWeight
    dijkstraSteps.value = dijResult.steps

    const { path, weight } = mstPathWeight(mstEdges.value, source.value, target.value)
    mstPathNodes.value = path
    mstPathWeight_.value = weight

    if (dijkstraPathWeight.value > 0 && dijkstraPathWeight.value !== Infinity) {
      stretchFactor.value = Math.round((weight / dijkstraPathWeight.value) * 100) / 100
    }

    activeAlgo.value = 'prim'
    currentStepIndex.value = -1
  }

  function nextStep() {
    if (currentStepIndex.value < currentSteps.value.length - 1) {
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
    if (intervalId !== null) { clearInterval(intervalId); intervalId = null }
  }

  function resetAnimation() {
    pause()
    currentStepIndex.value = -1
  }

  function reset() {
    pause()
    mstEdges.value = []; mstTotalWeight.value = 0; mstPathNodes.value = []
    mstPathWeight_.value = 0; dijkstraPath.value = []; dijkstraPathWeight.value = 0
    stretchFactor.value = 0; primSteps.value = []; dijkstraSteps.value = []
    activeAlgo.value = 'none'; currentStepIndex.value = -1
  }

  function setSpeed(ms: number) {
    animationSpeed.value = ms
    if (isPlaying.value) { pause(); play() }
  }

  return {
    graph, source, target, mstEdges, mstTotalWeight, mstPathNodes,
    mstPathWeight: mstPathWeight_, dijkstraPath, dijkstraPathWeight,
    stretchFactor, primSteps, dijkstraSteps, activeAlgo, currentStepIndex,
    currentStep, currentSteps, totalSteps, isPlaying, animationSpeed,
    runPrim, runDijkstra, runBoth, nextStep, prevStep, play, pause, reset, setSpeed,
  }
})
