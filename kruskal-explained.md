# Kruskal's Algorithm — Deep Dive

## What is a Minimum Spanning Tree (MST)?

Imagine you have a set of cities connected by roads, and each road has a cost to build.
A **Spanning Tree** connects **all cities** using exactly **N-1 roads** (no loops).
A **Minimum Spanning Tree** does this at the **lowest total cost possible**.

Key facts:
- A graph with **N nodes** has exactly **N-1 edges** in its MST.
- There are no cycles in a spanning tree.
- The MST is not necessarily unique (there can be ties).

---

## What Does Kruskal's Algorithm Do?

Kruskal builds the MST by **greedily picking the cheapest edge that doesn't create a cycle**,
repeating until all nodes are connected.

Simple rule: *"Always pick the next cheapest safe edge."*

---

## Step-by-Step Walkthrough

### Step 1 — Sort all edges by weight (ascending)

Before anything else, Kruskal sorts the entire edge list from cheapest to most expensive.
This sorting is what dominates the time complexity.

```
Sorted edges example:
B-C (1), F-G (1), A-C (2), D-E (2), F-H (2), E-G (3), A-B (4), B-D (5), G-H (6), D-F (8), A-H (9), C-E (10)
```

### Step 2 — Pick edges one by one

Go through the sorted list. For each edge, ask:
> "If I add this edge, will it create a cycle?"

- **No cycle** → Add it to the MST.
- **Cycle** → Skip it.

### Step 3 — Stop when you have N-1 edges

Once you've selected N-1 edges, the MST is complete.
(N-1 edges is always the minimum needed to connect N nodes with no cycles.)

---

## How Cycles Are Detected: Union-Find (Disjoint Set)

This is the clever part. Kruskal uses a data structure called **Union-Find** to track
which nodes are already connected.

Think of it as **painting nodes with group colors**:
- Initially every node is its own group (its own color).
- When you add an edge A-B, you merge their groups (paint them the same color).
- An edge creates a **cycle** if both its endpoints **already have the same color** (same group).

### `find(x)` — Which group does x belong to?

Uses **path compression**: on the way back up the tree, it directly connects every
node to the root. This keeps future lookups nearly O(1).

```
find(x):
  if parent[x] != x:
    parent[x] = find(parent[x])   ← path compression
  return parent[x]
```

### `union(x, y)` — Merge the groups of x and y

Uses **union by rank**: always attach the smaller tree under the larger tree's root.
This keeps trees shallow, preventing worst-case O(N) lookups.

```
union(x, y):
  rx = find(x), ry = find(y)
  if rx == ry: return false   ← same group → would form a cycle
  attach smaller-rank tree under larger-rank root
  return true                 ← successfully merged
```

---

## Visual Intuition: "Forest Merging"

At the start, every node is its own tiny tree (a "forest" of single nodes).

```
A   B   C   D   E   F   G   H
```

Each time Kruskal accepts an edge, it **merges two trees** into one bigger tree.

```
After B-C (w=1):   A   [B-C]   D   E   F   G   H
After F-G (w=1):   A   [B-C]   D   E   [F-G]   H
After A-C (w=2):   [A-B-C]   D   E   [F-G]   H
...
```

The algorithm finishes when there is only **one tree** — the MST.

---

## Worked Example (Our 8-Node Graph)

**Graph edges sorted by weight:**
| Edge  | Weight |
|-------|--------|
| B–C   | 1      |
| F–G   | 1      |
| A–C   | 2      |
| D–E   | 2      |
| F–H   | 2      |
| E–G   | 3      |
| A–B   | 4      |
| B–D   | 5      |
| G–H   | 6      |
| D–F   | 8      |
| A–H   | 9      |
| C–E   | 10     |

**Kruskal builds the MST:**

1. **B–C (w=1)** → B and C are in different groups → **ACCEPT** ✓
2. **F–G (w=1)** → F and G are in different groups → **ACCEPT** ✓
3. **A–C (w=2)** → A is separate, C is in {B,C} → **ACCEPT** ✓ (now {A,B,C})
4. **D–E (w=2)** → D and E are separate → **ACCEPT** ✓ (now {D,E})
5. **F–H (w=2)** → H is separate, F is in {F,G} → **ACCEPT** ✓ (now {F,G,H})
6. **E–G (w=3)** → E is in {D,E}, G is in {F,G,H} → **ACCEPT** ✓ (merges to {D,E,F,G,H})
7. **A–B (w=4)** → A and B are both in {A,B,C} → **REJECT** ✗ (cycle!)
8. **B–D (w=5)** → B is in {A,B,C}, D is in {D,E,F,G,H} → **ACCEPT** ✓ (now all 8 nodes connected!)

MST is complete after 7 edges (N-1 = 8-1 = 7).

**MST Total Weight: 1+1+2+2+2+3+5 = 16**

---

## Time Complexity

### Why O(E log E)?

The bottleneck is **sorting the edges**:
- Sorting E edges costs **O(E log E)** — this is the dominant step.

The Union-Find operations (find + union) are nearly **O(α(V))** per call, where α is the
inverse Ackermann function — essentially a constant for all practical purposes.
So the total cost for all Union-Find calls across all edges is roughly **O(E · α(V)) ≈ O(E)**.

**Total: O(E log E) + O(E) = O(E log E)**

Since E ≤ V², we also write this as O(E log V) — they are equivalent asymptotically.

### Comparison with Prim's

| Algorithm | Best for         | Complexity   |
|-----------|-----------------|--------------|
| Kruskal   | Sparse graphs    | O(E log E)   |
| Prim      | Dense graphs     | O(E log V)   |

Both produce the same MST (or an equivalent one if edge weights have ties).

---

## Key Takeaways

- Kruskal = **sort edges + greedy pick + cycle detection**
- Union-Find makes cycle detection near O(1) per edge
- The sorting step dominates the complexity
- Kruskal naturally processes **disconnected components** (great for forests)
