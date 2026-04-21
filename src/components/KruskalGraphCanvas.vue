<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { ref } from 'vue'
import cytoscape from 'cytoscape'
import { useKruskalStore } from '../stores/kruskalStore'

const store = useKruskalStore()
const containerRef = ref<HTMLElement | null>(null)
let cy: cytoscape.Core | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseStyles: any[] = [
  {
    selector: 'node',
    style: {
      'background-color': '#64748b',
      label: 'data(label)',
      color: '#fff',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '14px',
      'font-weight': 'bold',
      width: 44,
      height: 44,
    },
  },
  {
    selector: 'edge',
    style: {
      'line-color': '#94a3b8',
      width: 2,
      label: 'data(weight)',
      'font-size': '11px',
      color: '#334155',
      'text-background-color': '#f8fafc',
      'text-background-opacity': 1,
      'text-background-padding': '2px',
      'curve-style': 'bezier',
    },
  },
  { selector: '.mst-edge', style: { 'line-color': '#22c55e', width: 5 } },
  { selector: '.candidate', style: { 'line-color': '#facc15', width: 3, 'line-style': 'dashed' } },
  {
    selector: '.rejected',
    style: { 'line-color': '#f87171', width: 2, 'line-style': 'dotted' },
  },
  { selector: '.mst-node', style: { 'background-color': '#22c55e', 'border-color': '#15803d', 'border-width': 3 } },
]

function edgeSelector(edgeId: string): string {
  const [a, b] = edgeId.split('-')
  return `edge[source="${a}"][target="${b}"], edge[source="${b}"][target="${a}"]`
}

function applyStepStyle(index: number) {
  if (!cy) return
  const step = store.steps[index]
  if (!step) return

  if (step.type === 'edge-candidate' && step.edgeId) {
    cy.$(edgeSelector(step.edgeId)).addClass('candidate')
  } else if (step.type === 'edge-accepted' && step.edgeId) {
    cy.$(edgeSelector(step.edgeId)).removeClass('candidate').addClass('mst-edge')
    const [a, b] = step.edgeId.split('-')
    cy.$(`#${a}, #${b}`).addClass('mst-node')
  } else if (step.type === 'edge-rejected' && step.edgeId) {
    cy.$(edgeSelector(step.edgeId)).removeClass('candidate').addClass('rejected')
  }
}

function clearAlgoStyles() {
  cy?.elements().removeClass('mst-edge candidate rejected mst-node')
}

watch(() => store.currentStepIndex, (idx) => {
  if (idx === -1) {
    clearAlgoStyles()
    return
  }
  applyStepStyle(idx)
})

onMounted(() => {
  if (!containerRef.value) return
  cy = cytoscape({
    container: containerRef.value,
    elements: [
      ...store.graph.nodes.map((n) => ({ data: { id: n.id, label: n.label } })),
      ...store.graph.edges.map((e) => ({
        data: { id: `${e.source}-${e.target}`, source: e.source, target: e.target, weight: e.weight },
      })),
    ],
    style: baseStyles,
    layout: { name: 'cose', animate: false, padding: 40, nodeRepulsion: () => 8000 },
    userZoomingEnabled: true,
    userPanningEnabled: true,
  })
})

onBeforeUnmount(() => cy?.destroy())
</script>

<template>
  <div ref="containerRef" class="w-full h-full rounded-xl bg-slate-900 shadow-inner" />
</template>
