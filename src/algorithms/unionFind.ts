export class UnionFind {
  private parent: Map<string, string>
  private rank: Map<string, number>

  constructor(nodes: string[]) {
    this.parent = new Map(nodes.map((n) => [n, n]))
    this.rank = new Map(nodes.map((n) => [n, 0]))
  }

  // Path compression: flattens the tree on the way up
  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!))
    }
    return this.parent.get(x)!
  }

  // Union by rank: attach smaller tree under larger tree root
  // Returns false if x and y are already in the same set (would form a cycle)
  union(x: string, y: string): boolean {
    const rx = this.find(x)
    const ry = this.find(y)
    if (rx === ry) return false

    const rankX = this.rank.get(rx)!
    const rankY = this.rank.get(ry)!

    if (rankX < rankY) {
      this.parent.set(rx, ry)
    } else if (rankX > rankY) {
      this.parent.set(ry, rx)
    } else {
      this.parent.set(ry, rx)
      this.rank.set(rx, rankX + 1)
    }
    return true
  }
}
