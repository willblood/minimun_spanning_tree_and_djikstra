# PowerPoint Outline — Graph Algorithm Visualizer

**Suggested total slides: 10**
**Suggested duration: 15–20 minutes**
**Font suggestion:** Use a monospace font (e.g., JetBrains Mono or Courier) for code/pseudocode,
and a clean sans-serif (e.g., Inter or Calibri) for body text.

---

## Slide 1 — Title Slide

**Title:** Graph Algorithm Visualizer
**Subtitle:** Prim's MST · Dijkstra's Shortest Path · Stretch Factor

**Bottom line:** Your name · Course name · Date

**Visual:** Screenshot of the running app showing the graph with green MST edges highlighted.

**Design tip:** Dark background (match the app's slate-800 header). White title text.

---

## Slide 2 — Problem Statement

**Title:** Two Questions, One Graph

**Content (two columns):**

| Question 1 | Question 2 |
|-----------|-----------|
| How do you connect ALL nodes cheaply? | How do you get from A to B efficiently? |
| → Minimum Spanning Tree | → Shortest Path |
| Use case: ISP laying cables | Use case: GPS navigation |

**Bottom callout box:**
> "These look similar — but they optimise for different things. This project visualises both and measures the gap."

**Visual:** Simple diagram showing a graph with two different highlighted subgraphs — one showing a spanning tree, one showing a single path.

---

## Slide 3 — The Graph

**Title:** The Graph: 8 Nodes, 12 Weighted Edges

**Content (two columns):**

Left — Edge table:
| Edge | Weight | Edge | Weight |
|------|--------|------|--------|
| A–B | 4 | D–E | 2 |
| A–C | 2 | D–F | 8 |
| **A–H** | **9** | E–G | 3 |
| B–C | 1 | F–G | 1 |
| B–D | 5 | **F–H** | **2** |
| C–E | 10 | G–H | 6 |

Right — Screenshot of the Cytoscape graph from the app.

**Speaker cue:** Point out the A–H direct edge (weight 9) — it becomes important later.

---

## Slide 4 — MinHeap: The Shared Data Structure

**Title:** Min-Heap — The Engine Behind Both Algorithms

**Content:**

```
Purpose: Always give us the cheapest option next.

Operations:
  push(item, priority)  →  O(log n)
  pop()                 →  O(log n)   ← returns minimum

Array layout (binary tree stored flat):
  Index:  0    1    2    3    4
  Value: [1,   2,   8,   5,   4]
  
  Parent of i  =  floor((i-1)/2)
  Children of i = 2i+1  and  2i+2
```

**Visual:** Draw a small binary tree diagram with the same values (1 at root, 2 and 8 as children, etc.)

**Key point box:**
> Both Prim's and Dijkstra use a min-heap. The difference is *what they push onto it*.

---

## Slide 5 — Prim's MST

**Title:** Prim's Algorithm — Growing the Tree Greedily

**Content:**

**Pseudocode (left half):**
```
mark startNode as visited
push all its edges → heap

while heap not empty:
  edge = heap.pop()          // cheapest edge
  if edge.to already visited:
      REJECT  (cycle!)
  else:
      ACCEPT → add to MST
      mark edge.to as visited
      push edge.to's edges → heap
```

**Results table (right half):**
| Step | Edge Added | Total Weight |
|------|-----------|-------------|
| 1    | A–C (2)   | 2           |
| 2    | C–B (1)   | 3           |
| 3    | A–B (4)   | ~~REJECTED~~ |
| 4    | B–D (5)   | 8           |
| 5    | D–E (2)   | 10          |
| 6    | E–G (3)   | 13          |
| 7    | G–F (1)   | 14          |
| 8    | F–H (2)   | **16**      |

**Bottom bar:**
`Time: O(E log V)` · `Result: 7 edges, total weight = 16`

---

## Slide 6 — Dijkstra's Shortest Path

**Title:** Dijkstra's Algorithm — Relaxing Distances

**Content:**

**Pseudocode (left half):**
```
dist[source] = 0,  dist[all others] = ∞
heap.push(source, 0)

while heap not empty:
  u = heap.pop()         // closest unfinished node
  if u == target: STOP

  for each neighbour v of u:
    alt = dist[u] + weight(u, v)
    if alt < dist[v]:
        dist[v] = alt      // RELAXATION
        prev[v] = u
        heap.push(v, alt)

Reconstruct: follow prev[] from target back to source
```

**Distance table snapshot (right half):**
| Node | dist after A | after C | after B | after D | **Final** |
|------|-------------|--------|--------|--------|---------|
| A    | 0           | 0      | 0      | 0      | **0**   |
| B    | 4           | 3 ↓    | 3      | 3      | **3**   |
| C    | 2           | 2      | 2      | 2      | **2**   |
| D    | ∞           | ∞      | 8      | 8      | **8**   |
| H    | 9           | 9      | 9      | 9      | **9** ← target |

**Bottom bar:**
`Time: O((V+E) log V)` · `Result: A → H (direct), distance = 9`

---

## Slide 7 — Stretch Factor

**Title:** Stretch Factor — Measuring the Gap

**Content:**

**Large formula in centre:**
```
              MST path distance (A→H via tree)
Stretch  =   ─────────────────────────────────
              Dijkstra distance (A→H optimal)

         =   16 / 9  ≈  1.78×
```

**Two-column comparison:**

| | Prim's MST route A→H | Dijkstra route A→H |
|-|---------------------|-------------------|
| Path | A→C→B→D→E→G→F→H | A→H (direct) |
| Distance | 16 | 9 |
| Why? | A–H edge was excluded from MST | Direct edge is cheapest |

**Insight box:**
> The MST excluded A–H (weight 9) because H was already reachable via F–H(2).
> Globally optimal, locally suboptimal for this pair.

**Contrast line:**
> For A→F: stretch factor = **1.0** — MST path and shortest path are identical.

---

## Slide 8 — Architecture

**Title:** How the Project is Built

**Content (two columns):**

Left — File tree:
```
src/
├── algorithms/
│   ├── minHeap.ts      ← custom, O(log n)
│   ├── prim.ts
│   └── dijkstra.ts
├── stores/
│   └── graphStore.ts   ← Pinia
├── components/
│   ├── GraphCanvas.vue ← Cytoscape.js
│   ├── ControlPanel.vue
│   ├── StepPlayer.vue
│   └── ResultPanel.vue
```

Right — Three design choices:
1. **MinHeap from scratch** — O(log n) extract-min, no external library
2. **Step recording pattern** — algorithm runs first, records all decisions, visualizer replays. Enables pause/rewind.
3. **Reactive store** — `GraphCanvas` watches `currentStepIndex` in Pinia; applies CSS classes to Cytoscape elements. No direct component coupling.

**Stack badges at bottom:** Vue 3 · TypeScript · Pinia · Cytoscape.js · Tailwind CSS v3 · Vite

---

## Slide 9 — Live Demo

**Title:** Live Demo

**Content:**

Demo flow (print this and keep beside you):
```
1. Source=A, Target=H
   → Run Prim's MST → Play
     Narrate: green=accepted, yellow=candidate, red=rejected
     Result: total weight 16, note A–H edge was skipped

2. Source=A, Target=H
   → Run Dijkstra → Play
     Narrate: orange=processing, blue=final path
     Result: A→H direct, distance 9

3. Source=A, Target=H
   → Run Both & Compare
     Show: stretch factor ≈ 1.78×

4. Change Target=F
   → Run Both & Compare
     Show: stretch factor = 1.0×  (same path!)

5. Adjust Speed slider — show real-time control
```

**Slide visual:** Large screenshot of the app's ResultPanel showing stretch factor 1.78×.

---

## Slide 10 — Summary & Takeaways

**Title:** Key Takeaways

**Content (three big points, each with an icon):**

🌿 **Prim's MST**
Greedy. Connects all nodes. Minimises total network cost. O(E log V).
Does NOT guarantee shortest pair-to-pair paths.

🔵 **Dijkstra's Shortest Path**
Greedy. Finds optimal route between two nodes. O((V+E) log V).
Requires non-negative edge weights.

⚡ **Stretch Factor**
Quantifies the cost of using MST for routing.
= 1.0 when MST contains optimal path.
> 1.0 when MST forces a detour.

**Closing line:**
> "Same greedy strategy. Same data structure. Different objectives — and a measurable difference in results."

**GitHub / QR code at the bottom (optional)**

---

## Slide Design Recommendations

| Element | Recommendation |
|---------|---------------|
| Background | White or light slate (#f8fafc) for content slides; dark (slate-800) for title |
| Primary accent | Green (#22c55e) for MST-related content |
| Secondary accent | Blue (#3b82f6) for Dijkstra-related content |
| Stretch factor | Purple (#a855f7) to match the app's UI |
| Code blocks | Dark background (#1e293b), monospace font, slightly smaller font size |
| Tables | Alternate row shading, bold the key values |
| Max text per slide | 6–8 lines of body text; use visuals/screenshots generously |
| Slide numbers | Bottom right, small |
| Transitions | None or simple fade — avoid distracting animations |
