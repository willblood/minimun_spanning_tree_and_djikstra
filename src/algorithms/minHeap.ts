interface HeapNode<T> {
  item: T
  priority: number
}

export class MinHeap<T> {
  private heap: HeapNode<T>[] = []

  get size(): number {
    return this.heap.length
  }

  push(item: T, priority: number): void {
    this.heap.push({ item, priority })
    this.bubbleUp(this.heap.length - 1)
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined
    const top = this.heap[0] as HeapNode<T>
    const last = this.heap.pop()
    if (this.heap.length > 0 && last !== undefined) {
      this.heap[0] = last
      this.sinkDown(0)
    }
    return top.item
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      const p = this.heap[parent]
      const c = this.heap[i]
      if (p === undefined || c === undefined || p.priority <= c.priority) break
      this.heap[parent] = c
      this.heap[i] = p
      i = parent
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length
    while (true) {
      let smallest = i
      const l = 2 * i + 1
      const r = 2 * i + 2
      const hl = this.heap[l]
      const hr = this.heap[r]
      const hs = this.heap[smallest]
      if (l < n && hl !== undefined && hs !== undefined && hl.priority < hs.priority) smallest = l
      const hm = this.heap[smallest]
      if (r < n && hr !== undefined && hm !== undefined && hr.priority < hm.priority) smallest = r
      if (smallest === i) break
      const a = this.heap[smallest] as HeapNode<T>
      const b = this.heap[i] as HeapNode<T>
      this.heap[smallest] = b
      this.heap[i] = a
      i = smallest
    }
  }
}
