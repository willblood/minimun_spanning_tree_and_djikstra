<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import cytoscape from 'cytoscape'
import { useGraphStore } from '../stores/graphStore'

const store = useGraphStore()
const containerRef = ref<HTMLElement | null>(null)
let cy: cytoscape.Core | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseStyles: any[] = [
  { selector: 'node', style: { 'background-color': '#64748b', label: 'data(label)', color: '#fff', 'text-valign': 'center', 'text-halign': 'center', 'font-size': '14px', 'font-weight': 'bold', width: 44, height: 44 } },
  { selector: 'edge', style: { 'line-color': '#94a3b8', width: 2, label: 'data(weight)', 'font-size': '11px', color: '#334155', 'text-background-color': '#f8fafc', 'text-background-opacity': 1, 'text-background-padding': '2px', 'curve-style': 'bezier' } },
  { selector: '.source-node', style: { 'background-color': '#eab308', 'border-width': 3, 'border-color': '#ca8a04' } },
  { selector: '.target-node', style: { 'background-color': '#ef4444', 'border-width': 3, 'border-color': '#b91c1c' } },
  { selector: '.visited', style: { 'background-color': '#f97316' } },
  { selector: '.mst-edge', style: { 'line-color': '#22c55e', width: 5 } },
  { selector: '.candidate', style: { 'line-color': '#facc15', width: 3, 'line-style': 'dashed' } },
  { selector: '.rejected', style: { 'line-color': '#f87171', width: 2, 'line-style': 'dotted' } },
  { selector: '.path-edge', style: { 'line-color': '#3b82f6', width: 5, 'line-style': 'dashed' } },
  { selector: '.path-node', style: { 'background-color': '#3b82f6', 'border-color': '#1d4ed8', 'border-width': 3 } },
]

function edgeSelector(edgeId: string): string {
  const [a, b] = edgeId.split('-')
  return `edge[source="${a}"][target="${b}"], edge[source="${b}"][target="${a}"]`
}

function applyStepStyle(index: number) {
  if (!cy) return
  const step = store.currentSteps[index]
  if (!step) return
  if (step.type === 'visit' && step.nodeId) cy.$(`#${step.nodeId}`).addClass('visited')
  else if (step.type === 'edge-candidate' && step.edgeId) cy.$(edgeSelector(step.edgeId)).addClass('candidate')
  else if (step.type === 'edge-accepted' && step.edgeId) cy.$(edgeSelector(step.edgeId)).removeClass('candidate').addClass('mst-edge')
  else if (step.type === 'edge-rejected' && step.edgeId) cy.$(edgeSelector(step.edgeId)).removeClass('candidate').addClass('rejected')
  else if (step.type === 'path' && step.edgeId) {
    cy.$(edgeSelector(step.edgeId)).addClass('path-edge')
    const [a, b] = step.edgeId.split('-')
    cy.$(`#${a}, #${b}`).addClass('path-node')
  }
}

function clearAlgoStyles() {
  cy?.elements().removeClass('visited mst-edge candidate rejected path-edge path-node')
}

function applySourceTarget() {
  if (!cy) return
  cy.nodes().removeClass('source-node target-node')
  cy.$(`#${store.source}`).addClass('source-node')
  cy.$(`#${store.target}`).addClass('target-node')
}

watch(() => [store.source, store.target], applySourceTarget)

watch(() => store.currentStepIndex, (idx) => {
  if (idx === -1) { clearAlgoStyles(); applySourceTarget(); return }
  applyStepStyle(idx)
})

watch(() => store.stretchFactor, (sf) => {
  if (sf > 0) {
    clearAlgoStyles()
    for (const e of store.mstEdges) {
      cy?.$(edgeSelector([e.source, e.target].sort().join('-')))?.addClass('mst-edge')
    }
    for (let i = 0; i < store.dijkstraPath.length - 1; i++) {
      const id = [store.dijkstraPath[i], store.dijkstraPath[i + 1]].sort().join('-')
      cy?.$(edgeSelector(id))?.addClass('path-edge')
      cy?.$(`#${store.dijkstraPath[i]}, #${store.dijkstraPath[i + 1]}`)?.addClass('path-node')
    }
    applySourceTarget()
  }
})

onMounted(() => {
  if (!containerRef.value) return
  cy = cytoscape({
    container: containerRef.value,
    elements: [
      ...store.graph.nodes.map(n => ({ data: { id: n.id, label: n.label } })),
      ...store.graph.edges.map(e => ({ data: { id: `${e.source}-${e.target}`, source: e.source, target: e.target, weight: e.weight } })),
    ],
    style: baseStyles,
    layout: { name: 'cose', animate: false, padding: 40, nodeRepulsion: () => 8000 },
    userZoomingEnabled: true,
    userPanningEnabled: true,
  })
  applySourceTarget()
})

onBeforeUnmount(() => cy?.destroy())
</script>

<template>
  <div ref="containerRef" class="w-full h-full rounded-xl bg-slate-900 shadow-inner" />
</template>
