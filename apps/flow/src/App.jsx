import FlowCanvas from './components/FlowCanvas';
import './index.css';

export default function App() {
  return (
    <div className="flow-app">
      <header className="flow-header">
        <h1>Flow Editor</h1>
        <p>Design your flow, add nodes and edges, set metadata and branch conditionals, then export or import JSON.</p>
      </header>
      <FlowCanvas />
    </div>
  );
}
