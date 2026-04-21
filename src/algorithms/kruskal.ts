// Kruskal's Minimum Spanning Tree — Time complexity: O(E log E)
import { UnionFind } from './unionFind'
import type { Graph, GraphEdge, KruskalResult, AlgoStep } from './types'

function edgeId(a: string, b: string): string {
  return [a, b].sort().join('-')
}

export function kruskal(graph: Graph): KruskalResult {
  // Sort all edges by weight ascending — this dominates: O(E log E)
  const sorted = [...graph.edges].sort((a, b) => a.weight - b.weight)
  const uf = new UnionFind(graph.nodes.map((n) => n.id))

  const mstEdges: GraphEdge[] = []
  const steps: AlgoStep[] = []
  let totalWeight = 0

  for (const edge of sorted) {
    const id = edgeId(edge.source, edge.target)

    steps.push({
      type: 'edge-candidate',
      edgeId: id,
      message: `Checking edge ${edge.source}–${edge.target} (w=${edge.weight})`,
    })

    if (uf.union(edge.source, edge.target)) {
      // Connects two different components — safe to add
      mstEdges.push(edge)
      totalWeight += edge.weight
      steps.push({
        type: 'edge-accepted',
        edgeId: id,
        message: `Added ${edge.source}–${edge.target} (w=${edge.weight}) to MST`,
      })
    } else {
      // Both endpoints already in same component — would form a cycle
      steps.push({
        type: 'edge-rejected',
        edgeId: id,
        message: `Skipped ${edge.source}–${edge.target}: would form a cycle`,
      })
    }

    // MST is complete once we have V-1 edges
    if (mstEdges.length === graph.nodes.length - 1) break
  }

  return { mstEdges, steps, totalWeight }
}
