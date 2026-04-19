# Speaker Notes — Graph Algorithm Visualizer Presentation

These are your talking points for each section. Speak naturally — don't read these verbatim.
Aim for ~15–20 minutes total with the live demo.

---

## Opening (Slide 1 — Title)

> "Today I'm presenting a project that brings two classic graph algorithms to life
> with interactive step-by-step visualization. The project is built in Vue 3 with TypeScript,
> and it lets you see exactly what Prim's MST and Dijkstra's algorithm are doing at every step —
> and then compares them using a metric called the stretch factor."

**Tip:** Open the app on your screen before you start speaking so it's ready for the demo.

---

## Problem Statement (Slide 2)

> "Before we get into the algorithms, let's think about the problem space.
> Graphs show up everywhere — road networks, internet routing, electrical grids, social networks.
> Two fundamental questions come up constantly:
> First, how do you connect all the nodes as cheaply as possible?
> Second, how do you get from point A to point B as efficiently as possible?
> These sound similar, but they're actually asking different things — and that difference is the
> core of what this project explores."

---

## The Graph (Slide 3)

> "The graph I'm working with has 8 nodes and 12 weighted edges. The nodes are labelled A through H,
> and the weights represent the cost of traversing that connection — think of it like distance,
> latency, or cable length depending on your use case."

> "I want to draw your attention to one edge specifically: A–H, which has weight 9.
> There's a direct connection. This becomes important when we compare the two algorithms."

**Point to the edge table** and briefly describe a few edges to help the audience get oriented.

---

## Minimum Spanning Tree — Concept (Slide 4)

> "A spanning tree connects every node in the graph with no cycles, using exactly n−1 edges.
> In our case, 7 edges for 8 nodes. A *minimum* spanning tree does this with the smallest
> possible total edge weight."

> "Real-world example: imagine you're an ISP laying fibre cable. You need to reach every building
> in a city. You don't want loops — that's wasted cable. You want to find the cheapest set of
> connections that still reaches everyone."

> "That's exactly the MST problem."

---

## Prim's Algorithm (Slide 5)

> "Prim's is a greedy algorithm, which means it always makes the locally optimal choice:
> pick the cheapest edge that connects a new node to the growing tree."

> "Here's the key data structure: a min-heap, or priority queue. Every time we visit a node,
> we push all its edges onto the heap, sorted by weight. Then we always pop the cheapest one.
> If the destination is already in the tree, we skip it to avoid a cycle.
> If it's new, we add it — and the tree grows by one node."

> "We keep doing this until all 8 nodes are in the tree. At that point, we've built the MST."

**Pause here and switch to the visualizer.**

> "Let me show you this live. I'll set source to A and click Run Prim's MST.
> Watch the green edges appear — those are accepted edges. The yellow dashed ones are candidates
> sitting in the heap. Red dotted ones were rejected because the destination was already visited."

**Play the animation slowly.** Narrate a few steps:
> "There — it just accepted A–C with weight 2, because that was the cheapest option.
> Now it visits C, pushes C–B onto the heap with weight 1, which is even cheaper.
> So it takes C–B next, not A–B."

---

## Dijkstra's Algorithm (Slide 6)

> "Dijkstra solves a different problem: given a source and a target, find the path between them
> with the smallest total weight."

> "The mechanism looks similar to Prim's — we use a min-heap again — but what we're tracking
> is different. Instead of tracking cheapest edge to a new tree node, we track the
> *best known total distance* from the source to each node."

> "We start with distance zero for the source, infinity for everyone else.
> Each time we pop a node, we check if going through it improves the known distance to any neighbour —
> this is called *relaxation*. If it does, we update and push the neighbour back onto the heap."

> "When we pop the target node, we stop. Then we reconstruct the path by following
> a chain of predecessor pointers back to the source."

**Switch to visualizer.**

> "Watch what happens when I run Dijkstra from A to H.
> It finds the direct edge A–H with weight 9 almost immediately.
> No long detour needed — the direct path is simply cheaper."

---

## Stretch Factor (Slide 7)

> "Now here's the interesting question: if both algorithms use greedy selection with a min-heap,
> why do they give different routes?"

> "The answer is their objective. Prim's minimises *total network cost* — it cares about connecting
> everyone. Dijkstra minimises *one specific path* — it doesn't care about the rest of the graph."

> "The stretch factor measures this gap. It's defined as:
> MST path distance divided by shortest path distance."

> "For A to H:
> Dijkstra found the direct edge, distance 9.
> But the MST *excluded* that direct edge because including it would have cost 9 units
> and H was already reachable through F for just 2. So the MST path A to H goes
> A→C→B→D→E→G→F→H, a total of 16."

> "Stretch factor = 16 divided by 9 = about 1.78. The MST route is 78% longer than optimal
> for this specific pair."

**Click Run Both & Compare and show the ResultPanel.**

> "And here's an interesting contrast — if I change the target to F instead of H and click
> Run Both & Compare again, the stretch factor drops to 1.0. That means the MST path and the
> shortest path are identical for A to F. The MST happened to include the optimal route."

> "This shows that the MST is not always bad for routing — it just can't *guarantee* optimality
> for every pair."

---

## Implementation (Slide 8)

> "A quick word on the technical implementation, since this is a DAA project."

> "Both algorithms share a generic MinHeap class I wrote from scratch — it uses a binary heap
> stored as an array, with O(log n) push and pop. No library, pure TypeScript."

> "Rather than animating in real-time, each algorithm runs in full first and records every decision
> as an 'AlgoStep' object — the node visited, the edge considered, the message describing what happened.
> The visualizer then replays this step list on demand, which is why you can pause, rewind, and scrub."

> "The frontend is Vue 3 with Pinia for state management, Cytoscape.js for the graph canvas,
> and Tailwind CSS for styling."

---

## Live Demo Recap (Slide 9)

Suggested demo order:
1. Source=A, Target=H → **Run Prim's MST** → Play animation → note total weight 16
2. Source=A, Target=H → **Run Dijkstra** → Play animation → note path A→H=9
3. Source=A, Target=H → **Run Both & Compare** → show stretch factor ≈ 1.78
4. Change Target to F → **Run Both & Compare** → show stretch factor = 1.0
5. Change Speed slider to show control

---

## Closing (Slide 10)

> "To summarise: Prim's and Dijkstra's are both greedy algorithms that use a min-heap,
> but they optimise for fundamentally different objectives. The stretch factor gives us a
> quantitative way to measure how much the MST sacrifices for individual paths."

> "The project makes this concrete and interactive — you can watch every decision the algorithm
> makes, step by step, and see the tradeoff in real numbers."

---

## Anticipated Questions & Answers

**Q: Why does Prim's not guarantee the shortest path between two nodes?**
> Because it was never trying to. Prim's picks edges to minimise the *sum across the whole tree*,
> not any single route. The direct edge A–H costs 9 — Prim's skipped it because H was reachable
> more cheaply via F–H(2) as part of a globally cheaper set of edges.

**Q: What happens with negative edge weights?**
> Dijkstra breaks. Once a node is popped, it assumes that distance is final — negative edges
> could later provide a shorter path, violating this assumption. You'd need Bellman-Ford instead.
> Prim's does not require non-negative weights; it still finds an MST with negative edges.

**Q: What if the graph has multiple MSTs with the same total weight?**
> Any of them are valid — they all satisfy the minimum total weight condition. The specific MST
> you get depends on the start node and the order ties are broken in the heap.

**Q: Why use a min-heap instead of sorting?**
> Sorting the whole edge list each time would cost O(E log E) per iteration.
> A heap lets us insert in O(log n) and extract-min in O(log n), so the total is O(E log V)
> instead of O(E²) for a naive approach. On large graphs this is a massive difference.

**Q: Is the stretch factor always greater than or equal to 1?**
> Yes, by definition — the MST path can never be shorter than the shortest path.
> The shortest path is optimal, so any other path (including the MST path) must be ≥ optimal.
> It equals 1.0 when the MST happens to contain the optimal route for that pair.

**Q: What is the time complexity of building the stretch factor?**
> After running both algorithms (O(E log V) each), computing the MST path between two nodes
> is a simple BFS on the 7 MST edges — O(V). So stretch factor adds negligible cost.
