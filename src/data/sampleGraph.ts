import type { Graph } from '../algorithms/types'

export const sampleGraph: Graph = {
  nodes: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
    { id: 'E', label: 'E' },
    { id: 'F', label: 'F' },
    { id: 'G', label: 'G' },
    { id: 'H', label: 'H' },
  ],
  edges: [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'C', weight: 2 },
    { source: 'A', target: 'H', weight: 9 },
    { source: 'B', target: 'C', weight: 1 },
    { source: 'B', target: 'D', weight: 5 },
    { source: 'C', target: 'E', weight: 10 },
    { source: 'D', target: 'E', weight: 2 },
    { source: 'D', target: 'F', weight: 8 },
    { source: 'E', target: 'G', weight: 3 },
    { source: 'F', target: 'G', weight: 1 },
    { source: 'F', target: 'H', weight: 2 },
    { source: 'G', target: 'H', weight: 6 },
  ],
}
