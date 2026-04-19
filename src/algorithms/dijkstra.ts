// Dijkstra's Shortest Path — Time complexity: O((V + E) log V)
import { MinHeap } from './minHeap'
import type { Graph, DijkstraResult, AlgoStep } from './types'

function edgeId(a: string, b: string): string {
  return [a, b].sort().join('-')
}

export function dijkstra(graph: Graph, source: string, target: string): DijkstraResult {
  const adj = new Map<string, { neighbor: string; weight: number }[]>()
  for (const node of graph.nodes) adj.set(node.id, [])
  for (const e of graph.edges) {
    adj.get(e.source)?.push({ neighbor: e.target, weight: e.weight })
    adj.get(e.target)?.push({ neighbor: e.source, weight: e.weight })
  }

  const distances: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  const steps: AlgoStep[] = []

  for (const node of graph.nodes) {
    distances[node.id] = Infinity
    prev[node.id] = null
  }
  distances[source] = 0

  const heap = new MinHeap<string>()
  heap.push(source, 0)

  while (heap.size > 0) {
    const u = heap.pop()
    if (u === undefined) break

    const distU = distances[u] ?? Infinity
    steps.push({ type: 'visit', nodeId: u, message: `Processing node ${u} (dist=${distU})` })

    if (u === target) break

    for (const { neighbor, weight } of adj.get(u) ?? []) {
      const alt = distU + weight
      const distNeighbor = distances[neighbor] ?? Infinity
      steps.push({
        type: 'edge-candidate',
        edgeId: edgeId(u, neighbor),
        message: `Checking ${u}–${neighbor}: current=${distNeighbor}, via ${u}=${alt}`,
      })
      if (alt < distNeighbor) {
        distances[neighbor] = alt
        prev[neighbor] = u
        heap.push(neighbor, alt)
        steps.push({
          type: 'edge-accepted',
          edgeId: edgeId(u, neighbor),
          message: `Updated ${neighbor}: new dist=${alt} via ${u}`,
        })
      }
    }
  }

  const path: string[] = []
  let cur: string | null = target
  while (cur !== null && cur !== undefined) {
    path.unshift(cur)
    const p: string | null | undefined = prev[cur]
    cur = p !== undefined ? p : null
  }
  if (path[0] !== source) path.length = 0

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]
    const b = path[i + 1]
    if (a !== undefined && b !== undefined) {
      steps.push({ type: 'path', edgeId: edgeId(a, b), message: `Path edge: ${a}–${b}` })
    }
  }

  return { distances, path, steps, pathWeight: distances[target] ?? Infinity }
}
