export interface GraphNode {
  id: string
  label: string
}

export interface GraphEdge {
  source: string
  target: string
  weight: number
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface AlgoStep {
  type: 'visit' | 'edge-candidate' | 'edge-accepted' | 'edge-rejected' | 'path'
  nodeId?: string
  edgeId?: string
  message: string
}

export interface PrimResult {
  mstEdges: GraphEdge[]
  steps: AlgoStep[]
  totalWeight: number
}

export interface DijkstraResult {
  distances: Record<string, number>
  path: string[]
  steps: AlgoStep[]
  pathWeight: number
}
