# Virtual Wi-Fi Channel Allocation Model

## Graph Coloring with Backtracking

This is an interactive algorithm visualization model created for a Design and Analysis of Algorithms (DAA) university project. The application visually demonstrates how Graph Coloring with Backtracking can assign Wi-Fi channels to Access Points while avoiding conflicts between interfering Access Points.

---

### Project Overview
Multiple Wi-Fi Access Points operating near each other may interfere when they use conflicting channels. This model represents the wireless network as a graph and uses graph coloring with backtracking to assign channels while avoiding conflicts between interfering Access Points. 

The conceptual mapping is:
- **Vertex** = Wi-Fi Access Point
- **Edge** = Interference relationship
- **Color** = Wi-Fi Channel
- **Graph Coloring** = Channel Assignment
- **Backtracking** = Conflict Resolution

### Technology Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS
- **Graph Visualization**: Cytoscape.js
- **Search/Decision Tree**: React Flow
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Installation
Make sure you have Node.js installed.
1. Extract or clone the repository.
2. Navigate to the project directory in your terminal.
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the application
Run the development server:
```bash
npm run dev
```
Open your browser to the local URL provided (usually `http://localhost:5173/`).

### Project Structure
```text
src/
├── algorithm/           # Core backtracking solver logic and event generator
├── components/          # React components for visualization and UI
├── graph/               # Graph generation and predefined networks
├── store/               # Zustand state management store
├── types/               # TypeScript interfaces and definitions
├── App.tsx              # Main application layout
├── main.tsx             # Entry point
└── index.css            # Styles, colors, and layout definition
```

### Algorithm Explanation
The application implements a genuine recursive Graph Coloring Backtracking algorithm. 
- It attempts to assign an available channel to the current Access Point.
- If the channel is safe (no connected Access Point uses it), it assigns the channel and moves to the next Access Point.
- If the channel causes a conflict, it tries the next available channel.
- If all available channels cause a conflict for a given Access Point, it backtracks to the previous Access Point and tries a different channel for it.

### Graph Coloring Explanation
Graph coloring assigns a color to each vertex so that connected vertices do not have the same color. In this model, vertices represent Access Points and colors represent Wi-Fi channels. The goal is to color the entire graph without any two adjacent vertices sharing the same color.

### Backtracking Explanation
Backtracking systematically tries possible channel assignments. When an assignment causes a conflict and no valid continuation is possible, the algorithm goes back to a previous decision and tries another channel. This ensures that all possibilities are explored before declaring that no solution exists.

### Complexity
- **Worst-Case Time Complexity**: O(C^V)
  - C = number of available channels
  - V = number of Access Points
- **Space Complexity**: O(V)
  - Represents the recursion stack depth and assignments mapping.
*Note: This is the worst-case algorithmic complexity. Practical execution may explore fewer states due to conflict pruning.*

### How to Demonstrate the Project
1. **Network Configuration**: Use the left sidebar to change the number of Access Points or Channels. Select predefined networks like "College Floor" or generate a random one.
2. **Algorithm Controls**: Use the controls below the graph.
   - Click **Step** to execute the algorithm one step at a time. This is the best way to explain the concept.
   - Click **Start** to run the algorithm automatically. You can **Pause** and **Resume** at any time.
3. **Observation Points**:
   - Watch the **Cytoscape Graph** nodes change color. Notice conflict highlights (red borders and edges).
   - Watch the **Algorithm Visualization** panel for the current vertex, channel tried, and the result.
   - See the **Search Tree** build dynamically showing successful assignments, conflicts, and backtracks.
   - Check the **Execution Log** for a complete history of the steps taken.
   - Look at the **Live Statistics** to see the number of conflicts, backtracks, and algorithm steps.
4. **Conclusion**: When the algorithm finishes, it will show a valid allocation mapped with colors, or a clear "No Solution" state if not enough channels were provided for the network density.
