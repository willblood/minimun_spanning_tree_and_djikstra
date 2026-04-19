# Algorithm Deep Dive — Step-by-Step Traces

This document walks through both algorithms on the actual 8-node graph used in the app,
showing every decision the algorithm makes, including the internal priority queue state.

---

## The Graph (Quick Reference)

```
        4         5         8
   A ——————— B ——————— D ——————— F
   |         |         |         |
 2 |       1 |       2 |       1 |
   |         |         |         |
   C         *         E ——————— G ——————— H
   |              3         6
   |                         9
   +————————————————————————— A  (A–H direct edge, weight 9)

Also:  F–H = 2,  C–E = 10
```

| Edge | Weight |   | Edge | Weight |
|------|--------|---|------|--------|
| A–B  | 4      |   | D–E  | 2      |
| A–C  | 2      |   | D–F  | 8      |
| A–H  | 9      |   | E–G  | 3      |
| B–C  | 1      |   | F–G  | 1      |
| B–D  | 5      |   | F–H  | 2      |
| C–E  | 10     |   | G–H  | 6      |

---

## Part 1 — MinHeap (Priority Queue)

Both algorithms rely on a **min-heap** to always get the cheapest option next.

### What it stores
- A list of `{ item, priority }` pairs stored in a **binary tree flattened into an array**
- The item with the **lowest priority** is always at index 0 (the root)

### Array-as-tree layout
```
Index:     0    1    2    3    4    5
Parent of index i  → Math.floor((i-1)/2)
Children of index i → left: 2i+1,  right: 2i+2
```

### Two operations

**push(item, priority)** — O(log n)
1. Append `{ item, priority }` to the end of the array.
2. "Bubble up": compare with parent; if smaller, swap. Repeat until heap property restored.

**pop()** — O(log n)
1. Save the root (the minimum).
2. Move the last element to the root.
3. "Sink down": compare with both children; swap with the smaller child if it's smaller. Repeat.

### Example: push priorities 5, 2, 8, 1
```
After push 5:  [5]
After push 2:  [2, 5]          ← 2 bubbled up past 5
After push 8:  [2, 5, 8]
After push 1:  [2, 5, 8, 1]   → bubble: 1<5, swap → [2, 1, 8, 5]
                               → bubble: 1<2, swap → [1, 2, 8, 5]
pop() returns 1. Move 5 to root: [5, 2, 8]
               → sink: 5>2, swap → [2, 5, 8]   ✓
```

---

## Part 2 — Prim's MST Full Trace (Source = A)

### Goal
Find the minimum spanning tree — connect all 8 nodes using 7 edges with the lowest possible total weight.

### State legend
- **Visited** = node is in the growing MST
- **Heap** = `[(edge, weight), ...]` sorted by weight ascending
- **MST** = edges accepted so far

---

### Iteration 0 — Initialise
```
Visited:  {A}
MST:      []
Push A's edges onto heap:  A–B(4),  A–C(2),  A–H(9)

Heap after sort: [(A–C, 2), (A–B, 4), (A–H, 9)]
```

---

### Iteration 1 — Pop cheapest: A–C (weight 2)
```
C not visited → ACCEPT A–C(2)

Visited:  {A, C}
MST:      [A–C(2)]   total=2

Push C's unvisited neighbours:
  C–B(1),  C–E(10)     [C–A skipped, A already visited]

Heap: [(C–B, 1), (A–B, 4), (A–H, 9), (C–E, 10)]
```

---

### Iteration 2 — Pop cheapest: C–B (weight 1)
```
B not visited → ACCEPT C–B(1)

Visited:  {A, C, B}
MST:      [A–C(2), C–B(1)]   total=3

Push B's unvisited neighbours:
  B–D(5)     [B–A and B–C already visited]

Heap: [(A–B, 4), (B–D, 5), (A–H, 9), (C–E, 10)]
```

---

### Iteration 3 — Pop cheapest: A–B (weight 4)
```
B ALREADY VISITED → REJECT (would create a cycle A–B–C–A)

Heap: [(B–D, 5), (A–H, 9), (C–E, 10)]
```

---

### Iteration 4 — Pop cheapest: B–D (weight 5)
```
D not visited → ACCEPT B–D(5)

Visited:  {A, C, B, D}
MST:      [A–C(2), C–B(1), B–D(5)]   total=8

Push D's unvisited neighbours:
  D–E(2),  D–F(8)     [D–B already visited]

Heap: [(D–E, 2), (D–F, 8), (A–H, 9), (C–E, 10)]
```

---

### Iteration 5 — Pop cheapest: D–E (weight 2)
```
E not visited → ACCEPT D–E(2)

Visited:  {A, C, B, D, E}
MST:      [A–C(2), C–B(1), B–D(5), D–E(2)]   total=10

Push E's unvisited neighbours:
  E–G(3)     [E–C and E–D already visited]

Heap: [(E–G, 3), (D–F, 8), (A–H, 9), (C–E, 10)]
```

---

### Iteration 6 — Pop cheapest: E–G (weight 3)
```
G not visited → ACCEPT E–G(3)

Visited:  {A, C, B, D, E, G}
MST:      [A–C(2), C–B(1), B–D(5), D–E(2), E–G(3)]   total=13

Push G's unvisited neighbours:
  G–F(1),  G–H(6)     [G–E already visited]

Heap: [(G–F, 1), (G–H, 6), (D–F, 8), (A–H, 9), (C–E, 10)]
```

---

### Iteration 7 — Pop cheapest: G–F (weight 1)
```
F not visited → ACCEPT G–F(1)

Visited:  {A, C, B, D, E, G, F}
MST:      [A–C(2), C–B(1), B–D(5), D–E(2), E–G(3), G–F(1)]   total=14

Push F's unvisited neighbours:
  F–H(2)     [F–D and F–G already visited]

Heap: [(F–H, 2), (G–H, 6), (D–F, 8), (A–H, 9), (C–E, 10)]
```

---

### Iteration 8 — Pop cheapest: F–H (weight 2)
```
H not visited → ACCEPT F–H(2)

Visited:  {A, C, B, D, E, G, F, H}  ← all 8 nodes!
MST:      [A–C(2), C–B(1), B–D(5), D–E(2), E–G(3), G–F(1), F–H(2)]
Total MST weight = 2+1+5+2+3+1+2 = 16
```

Remaining heap entries [(G–H,6), (D–F,8), (A–H,9), (C–E,10)] are discarded — all their targets are already visited.

---

### Final MST
```
    A
    |
    C (2)
    |
    B (1)
    |
    D (5)
    |
    E (2)
    |
    G (3)
    |
    F (1)
    |
    H (2)
```

**Total weight: 16** using 7 edges (= n−1 = 8−1 ✓)

### Why is this the minimum?
Every time we picked an edge, it was the **globally cheapest edge** that added a new node.
Because the graph is connected and we never created a cycle, the result is guaranteed optimal.
This is the **greedy correctness** property of Prim's algorithm.

---

## Part 3 — Dijkstra's Shortest Path Full Trace (Source=A, Target=H)

### Goal
Find the path from A to H with the smallest total edge weight.

### State we track
- `dist[]` — best known distance from A to each node (starts at ∞, except dist[A]=0)
- `prev[]` — which node we came from to achieve that best distance
- **Heap** — `[(node, dist)]` sorted by dist ascending

---

### Initial State
```
dist:  { A:0,  B:∞,  C:∞,  D:∞,  E:∞,  F:∞,  G:∞,  H:∞ }
prev:  { all: null }
Heap:  [(A, 0)]
```

---

### Step 1 — Pop A (dist=0)
```
Process A's neighbours:
  → B:  alt = dist[A]+w(A,B) = 0+4 = 4  < ∞  → dist[B]=4, prev[B]=A, push (B,4)
  → C:  alt = 0+2 = 2  < ∞               → dist[C]=2, prev[C]=A, push (C,2)
  → H:  alt = 0+9 = 9  < ∞               → dist[H]=9, prev[H]=A, push (H,9)

dist:  { A:0, B:4, C:2, H:9,  D:∞, E:∞, F:∞, G:∞ }
Heap:  [(C,2), (B,4), (H,9)]
```

---

### Step 2 — Pop C (dist=2)
```
Process C's neighbours:
  → A:  alt = 2+2 = 4  > dist[A]=0     → no update
  → B:  alt = 2+1 = 3  < dist[B]=4     → dist[B]=3, prev[B]=C, push (B,3)  ← IMPROVEMENT
  → E:  alt = 2+10 = 12 < ∞            → dist[E]=12, prev[E]=C, push (E,12)

dist:  { A:0, B:3, C:2, E:12, H:9,  D:∞, F:∞, G:∞ }
Heap:  [(B,3), (B,4)*, (H,9), (E,12)]   * = stale entry
```

> **Key insight:** When dist[B] was improved from 4→3, the old entry (B,4) stays in the heap.
> We call this a *stale* entry — it will be ignored when popped because dist[B] is now 3, not 4.

---

### Step 3 — Pop B (dist=3, current dist[B]=3 ✓ valid)
```
Process B's neighbours:
  → A:  alt = 3+4 = 7  > dist[A]=0     → no update
  → C:  alt = 3+1 = 4  > dist[C]=2     → no update
  → D:  alt = 3+5 = 8  < ∞             → dist[D]=8, prev[D]=B, push (D,8)

dist:  { A:0, B:3, C:2, D:8, E:12, H:9,  F:∞, G:∞ }
Heap:  [(B,4)*, (D,8), (H,9), (E,12)]
```

---

### Step 4 — Pop (B, 4) — STALE, skip
```
dist[B] = 3 ≠ 4  → this is an outdated entry → discard

Heap:  [(D,8), (H,9), (E,12)]
```

---

### Step 5 — Pop D (dist=8, current dist[D]=8 ✓ valid)
```
Process D's neighbours:
  → B:  alt = 8+5 = 13 > dist[B]=3     → no update
  → E:  alt = 8+2 = 10 < dist[E]=12   → dist[E]=10, prev[E]=D, push (E,10)  ← IMPROVEMENT
  → F:  alt = 8+8 = 16 < ∞             → dist[F]=16, prev[F]=D, push (F,16)

dist:  { A:0, B:3, C:2, D:8, E:10, F:16, H:9,  G:∞ }
Heap:  [(H,9), (E,10), (E,12)*, (F,16)]
```

---

### Step 6 — Pop H (dist=9, current dist[H]=9 ✓ valid)
```
H is the TARGET → STOP immediately!

Path reconstruction (follow prev[] backwards from H):
  H → prev[H] = A  → A is the source → done

Path:     A → H
Distance: 9
```

---

### Distance Table at Termination

| Node | Final dist | Via (prev) |
|------|-----------|-----------|
| A    | 0         | — (source) |
| B    | 3         | C          |
| C    | 2         | A          |
| D    | 8         | B          |
| E    | 10        | D          |
| F    | 16        | D          |
| G    | ∞         | (not reached yet) |
| **H** | **9**   | **A** (direct!) |

The direct edge A–H (weight 9) is cheaper than any multi-hop path, so Dijkstra takes it.

---

### Why wasn't the long path A→C→B→D→E→G→F→H chosen?
That path costs 2+1+5+2+3+1+2 = **16**, which is nearly double the direct edge.
Dijkstra's relaxation ensures it would never choose 16 when 9 is available.

---

## Part 4 — Stretch Factor Calculation (A → H)

```
MST path (A to H through MST edges):
  A → C → B → D → E → G → F → H
  = 2 + 1 + 5 + 2 + 3 + 1 + 2 = 16

Dijkstra shortest path:
  A → H (direct)
  = 9

Stretch Factor = 16 / 9 ≈ 1.78×
```

**Meaning:** Using the MST to route from A to H costs 78% more than the optimal route.

### Why does this happen?
The MST **excluded** the A–H direct edge (weight 9) because the MST had already connected H
via the cheaper path F–H(2)–G–F(1)–E–G(3)–D–E(2)–B–D(5)–C–B(1)–A–C(2) = 16 total, but these
7 edges together served all 8 nodes at cost 16.
Removing A–H(9) saved 9 units of total network cost — which is great for spanning the whole network,
but terrible if you specifically need to go from A to H.

### Contrast: A → F (stretch factor = 1.0)
```
MST path A→F:   A→C→B→D→E→G→F = 2+1+5+2+3+1 = 14
Dijkstra A→F:   A→C→B→D→E→G→F = 14   (same path!)
Stretch Factor = 14/14 = 1.0×
```

For A→F, Dijkstra and the MST agree — the optimal path happens to use only MST edges.

---

## Part 5 — Complexity Comparison

| Property | Prim's MST | Dijkstra |
|----------|-----------|---------|
| What it finds | Cheapest way to connect ALL nodes | Cheapest path between TWO nodes |
| Time complexity | O(E log V) | O((V+E) log V) |
| Space complexity | O(V+E) | O(V+E) |
| Heap operations | One push per edge candidate | One push per distance improvement |
| Termination | When all nodes visited | When target is popped |
| Greedy property | Pick cheapest edge to new node | Pick closest unfinished node |
| Can it find shortest pair path? | No (optimises globally) | Yes |
| Can it span the whole graph? | Yes (by definition) | Not its purpose |

---

## Part 6 — Why Greedy Works Here

Both algorithms make locally optimal choices (pick the cheapest thing available right now) and
achieve a globally optimal result. This works because of a property called the **cut property**:

> For any partition of nodes into two groups (S and V–S), the minimum weight edge
> crossing the cut is always safe to include in the MST.

Dijkstra's correctness relies on **non-negative edge weights**: once a node is popped from the heap,
its distance is final — no future path can improve it (because all edges going forward add weight,
never subtract).

> This is why Dijkstra fails on negative weights — use Bellman-Ford instead.
