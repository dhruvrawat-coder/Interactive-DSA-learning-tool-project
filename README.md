# DP Lab — Interactive Dynamic Programming Learning Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

An interactive, educational platform dedicated exclusively to mastering **Dynamic Programming (DP)**. Designed for computer science students, competitive programmers, and technical interview candidates.

---

## ✨ Features & Architecture

### 1. 🎓 Cartesian-Inspired Interactive Slide Lessons
- Bite-sized, structured learning journeys: **Intro → Intuition → Mathematical Derivation → Visual Execution → Code Walkthrough → Pitfalls → Quiz → Summary**.
- Rendered with **KaTeX** for mathematical equations.
- In-depth modules covering:
  - Introduction to Dynamic Programming & DAG formulation
  - Overlapping Subproblems ($2^n$ call explosion)
  - Optimal Substructure & Greedy failures
  - Memoization (Top-Down) & Tabulation (Bottom-Up)
  - Fibonacci Sequence, 0/1 Knapsack, and Longest Common Subsequence (LCS)
- One-click **"Launch Interactive Engine"** directly links lesson concepts to live execution steps.

### 2. ⚡ Deterministic DP Execution Engine
- Pure immutable event-driven state machine (`DPExecutionEvent`).
- Step-by-step playback: Play, Pause, Step Forward, Step Backward, and variable-speed scrubbing.
- Dual visual modes:
  - **Interactive DP Table**: Color-coded dependency cells, active state evaluations, and full solution reconstruction paths.
  - **Recursion Call Tree**: Live call-stack explorer comparing naive recursion against memoized branches.

### 3. 🔬 Socratic Derivation Wizard
- Guides students to discover state equations independently without formula memorization.

### 4. 🎯 "Predict the Next Cell" Challenge
- Real-time formative testing: students calculate the value of the next table cell before execution, reinforcing recurrence logic.

### 5. 🥊 Strategy Comparator & Empirical Benchmark Lab
- Side-by-side comparison between **Naive Recursion**, **Top-Down Memoization**, and **Bottom-Up Tabulation**.
- Live empirical profiler measuring actual wall-clock runtimes ($\mu s / ms$) and call-counts across scales ($n=5, 10, 15, 20, 25, 30$).

### 6. 🐛 DP Mistake Analyzer
- Visualizes 5 classic student bugs with counterexamples and side-by-side correct vs buggy runs:
  - 1D Knapsack Loop Direction Bug
  - LCS Diagonal Dependency Skipping
  - Memoization Unvisited Sentinel Flag Bug
  - Zero Initialization Poisoning in Minimization
  - Local vs Global Return Confusion

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/dp-lab.git

# Navigate to the project directory
cd dp-lab

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🎨 Theme & Aesthetic
- Built with a futuristic **Cyber Obsidian & Electric Neon Cyan** design system.
- High-contrast developer-first UI inspired by tools like Linear, Raycast, and Cartesian.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
