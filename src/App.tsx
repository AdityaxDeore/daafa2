import Header from './components/Header';
import ProjectOverview from './components/ProjectOverview';
import HowItWorks from './components/HowItWorks';
import NetworkConfiguration from './components/NetworkConfiguration';
import NetworkGraph from './components/NetworkGraph';
import AlgorithmVisualization from './components/AlgorithmVisualization';
import AlgorithmControls from './components/AlgorithmControls';
import ExecutionLog from './components/ExecutionLog';
import SearchTree from './components/SearchTree';
import Statistics from './components/Statistics';
import FinalAllocation from './components/FinalAllocation';
import BeforeAfter from './components/BeforeAfter';
import EducationalExplanation from './components/EducationalExplanation';
import Complexity from './components/Complexity';

export default function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {/* Intro sections */}
        <div className="intro-row">
          <ProjectOverview />
          <HowItWorks />
        </div>

        {/* Main visualization area */}
        <div className="viz-layout">
          {/* Left sidebar — Configuration */}
          <aside className="viz-sidebar">
            <NetworkConfiguration />
          </aside>

          {/* Center — Graph + Controls */}
          <div className="viz-center">
            <NetworkGraph />
            <AlgorithmControls />
          </div>

          {/* Right sidebar — Algorithm state */}
          <aside className="viz-sidebar-right">
            <AlgorithmVisualization />
            <ExecutionLog />
          </aside>
        </div>

        {/* Second row — Search tree + Stats + Final */}
        <div className="bottom-row">
          <SearchTree />
          <div className="bottom-right-col">
            <Statistics />
            <FinalAllocation />
            <BeforeAfter />
          </div>
        </div>

        {/* Educational + Complexity */}
        <EducationalExplanation />
        <Complexity />

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Virtual Wi-Fi Channel Allocation Model — Graph Coloring with Backtracking
          </p>
          <p className="text-muted">
            Design and Analysis of Algorithms (DAA) Project
          </p>
        </footer>
      </main>
    </div>
  );
}
