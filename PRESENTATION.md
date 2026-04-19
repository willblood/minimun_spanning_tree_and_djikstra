# Graph Algorithm Visualizer — Presentation Guide

## What This Project Does

This is an **interactive web application** that lets you visually step through two fundamental graph algorithms — **Prim's Minimum Spanning Tree** and **Dijkstra's Shortest Path** — on a weighted undirected graph. It also computes the **stretch factor**, which answers the question: *"How much longer is the MST path compared to the true shortest path?"*

---

## The Graph

The app uses a fixed graph with **8 nodes (A–H)** and **12 weighted edges**:

```
A --4-- B --5-- D --8-- F
|       |       |       |
2       1       2       1
|       |       |       |
C      (BC)     E --3-- G --6-- H
|                               |
+-------------- 9 ------------ A
                                |
                        F --2-- H
```

| Edge | Weight | Edge | Weight |
|------|--------|------|--------|
| A–B  | 4      | D–E  | 2      |
| A–C  | 2      | D–F  | 8      |
| A–H  | 9      | E–G  | 3      |
| B–C  | 1      | F–G  | 1      |
| B–D  | 5      | F–H  | 2      |
| C–E  | 10     | G–H  | 6      |

---

## Algorithm 1 — Prim's MST

### What is a Minimum Spanning Tree?

A **spanning tree** connects all nodes with no cycles using exactly `n−1` edges (where `n` = number of nodes). A **minimum** spanning tree is the one where the total edge weight is as small as possible.

**Real-world analogy:** Laying the least amount of cable to connect all offices in a building.

### How Prim's Algorithm Works

Prim's is a **greedy algorithm** — it always picks the cheapest available edge that expands the tree.

**Steps:**
1. Start from any node (we use the selected **Source** node).
2. Mark it as visited. Add all its edges to a **min-heap** (priority queue).
3. Pop the cheapest edge from the heap.
4. If the destination is already visited → **skip** (would create a cycle).
5. Otherwise → **accept** the edge into the MST, mark the new node visited, push its edges.
6. Repeat until all nodes are visited.

**Time complexity: O(E log V)**
- Every edge is pushed/popped from the heap once → O(E log E) ≈ O(E log V)

**Result for A→H (source=A):**
- MST edges: A–C(2), B–C(1), A–B→via C–B, B–D(5), D–E(2), E–G(3), F–G(1), F–H(2)
- Total MST weight: **16**

### What You See in the Visualizer

| Color | Meaning |
|-------|---------|
| Orange node | Currently being visited |
| Yellow dashed edge | Edge being considered (in heap) |
| Green edge | Accepted into MST |
| Red dotted edge | Rejected (would create cycle) |

---

## Algorithm 2 — Dijkstra's Shortest Path

### What is the Shortest Path?

Given a **source** and **target** node, find the path between them with the **minimum total weight**.

**Real-world analogy:** GPS navigation — find the fastest route from A to B.

### How Dijkstra's Algorithm Works

Also a **greedy algorithm**, but instead of building a tree, it finds optimal distances from the source to every node.

**Steps:**
1. Set `distance[source] = 0`, all others = `∞`.
2. Push source into a **min-heap** keyed by distance.
3. Pop the node `u` with the smallest known distance.
4. For each neighbor `v`: compute `alt = dist[u] + weight(u,v)`.
5. If `alt < dist[v]` → **update** `dist[v]`, record that `u` is `v`'s predecessor, push `v` to heap.
6. Stop when the target is popped.
7. **Reconstruct path** by following predecessors backwards from target.

**Time complexity: O((V + E) log V)**
- Each node is processed once; each edge relaxation costs O(log V) heap operations.

**Result for A→H:**
- Shortest path: **A → C → B → D → E → G → F → H**
- Total distance: **14**

### What You See in the Visualizer

| Color | Meaning |
|-------|---------|
| Orange node | Node being processed |
| Yellow dashed edge | Edge being relaxed/checked |
| Green/updated edge | Distance improved |
| Blue dashed edge | Final shortest path |
| Blue node | Node on final path |

---

## The Stretch Factor

### Definition

```
Stretch Factor = (MST path distance) / (Shortest path distance)
```

The **MST path** is the unique path between source and target *within the MST* (not the direct graph). Since the MST connects all nodes, there is always exactly one such path.

### Why They Differ

| Goal | Algorithm | Optimizes For |
|------|-----------|---------------|
| Connect everyone cheaply | Prim's MST | **Total network cost** |
| Get from A to B fast | Dijkstra | **Single-pair distance** |

These are different objectives. The MST doesn't care about any specific pair — it minimizes the sum across all edges. Dijkstra doesn't care about the rest of the network.

### Example (A → H)

| Metric | Value |
|--------|-------|
| Dijkstra path | A→C→B→D→E→G→F→H = **14** |
| MST path to H | Follows MST tree edges = **varies** |
| Stretch Factor | `MST_path_distance / 14` |

A stretch factor of **1.0** means the MST happened to contain the shortest path. Greater than 1.0 means the MST route is suboptimal for that pair.

---

## Project Architecture

```
src/
├── algorithms/
│   ├── types.ts        # Shared interfaces (Graph, Edge, AlgoStep, etc.)
│   ├── minHeap.ts      # Generic min-heap (priority queue) — used by both algorithms
│   ├── prim.ts         # Prim's MST implementation
│   └── dijkstra.ts     # Dijkstra's implementation
├── data/
│   └── sampleGraph.ts  # The 8-node, 12-edge graph definition
├── stores/
│   └── graphStore.ts   # Pinia store — runs algorithms, manages animation state
├── components/
│   ├── GraphCanvas.vue # Cytoscape.js canvas — renders graph, applies step styles
│   ├── ControlPanel.vue# Source/target selectors + run buttons
│   ├── StepPlayer.vue  # Play/pause/scrub animation controls
│   └── ResultPanel.vue # MST weight, Dijkstra path, stretch factor display
└── views/
    └── HomeView.vue    # Main layout — stitches all components together
```

### Key Design Decisions

**MinHeap over `Array.sort()`**
Both algorithms need to repeatedly extract the minimum-cost item. A min-heap does this in O(log n) vs O(n log n) for re-sorting an array each time.

**Step recording**
Rather than animating in real-time, each algorithm records every decision as an `AlgoStep` object while running. The visualizer then replays these steps on demand — this lets you pause, rewind, and scrub freely.

**Pinia store as the single source of truth**
The graph canvas watches store state reactively. When `currentStepIndex` changes, `GraphCanvas.vue` applies the corresponding CSS class to the matching Cytoscape element — no direct coupling between components.

---

## How to Run

```bash
npm install
npm run dev      # development server → http://localhost:5173
npm run build    # production build (passes type-check)
```

---

## Live Demo Walkthrough

1. **Open the app** — graph renders with 8 nodes.
2. **Set Source = A, Target = H** (default).
3. Click **Run Prim's MST** → press **Play** → watch the algorithm grow the tree edge by edge.
4. Click **Run Dijkstra's Path** → press **Play** → watch it relax distances until it reaches H.
5. Click **Run Both & Compare** → the ResultPanel shows the stretch factor instantly.
6. Try **Source = A, Target = F** — the stretch factor changes; sometimes MST path = shortest path (factor = 1.0).
