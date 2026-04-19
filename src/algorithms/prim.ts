// Prim's Minimum Spanning Tree — Time complexity: O(E log V)
import { MinHeap } from './minHeap'
import type { Graph, GraphEdge, PrimResult, AlgoStep } from './types'

function edgeId(a: string, b: string): string {
  return [a, b].sort().join('-')
}

export function prim(graph: Graph, startNode: string): PrimResult {
  const adj = new Map<string, { neighbor: string; weight: number }[]>()
  for (const node of graph.nodes) adj.set(node.id, [])
  for (const e of graph.edges) {
    adj.get(e.source)!.push({ neighbor: e.target, weight: e.weight })
    adj.get(e.target)!.push({ neighbor: e.source, weight: e.weight })
  }

  const visited = new Set<string>()
  const mstEdges: GraphEdge[] = []
  const steps: AlgoStep[] = []
  let totalWeight = 0

  const heap = new MinHeap<{ from: string; to: string; weight: number }>()

  const visit = (node: string) => {
    visited.add(node)
    steps.push({ type: 'visit', nodeId: node, message: `Visiting node ${node}` })
    for (const { neighbor, weight } of adj.get(node)!) {
      if (!visited.has(neighbor)) {
        heap.push({ from: node, to: neighbor, weight }, weight)
        steps.push({
          type: 'edge-candidate',
          edgeId: edgeId(node, neighbor),
          message: `Considering edge ${node}–${neighbor} (w=${weight})`,
        })
      }
    }
  }

  visit(startNode)

  while (heap.size > 0) {
    const edge = heap.pop()!
    if (visited.has(edge.to)) {
      steps.push({
        type: 'edge-rejected',
        edgeId: edgeId(edge.from, edge.to),
        message: `Skipping ${edge.from}–${edge.to}: already in MST`,
      })
      continue
    }
    mstEdges.push({ source: edge.from, target: edge.to, weight: edge.weight })
    totalWeight += edge.weight
    steps.push({
      type: 'edge-accepted',
      edgeId: edgeId(edge.from, edge.to),
      message: `Added ${edge.from}–${edge.to} (w=${edge.weight}) to MST`,
    })
    visit(edge.to)
  }

  return { mstEdges, steps, totalWeight }
}
