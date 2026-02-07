import { useCallback, useState, useMemo, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  SelectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './nodes';
import EditorToolbar from './EditorToolbar';
import NodeEditor from './NodeEditor';
import OptionsPanel from './OptionsPanel';

const initialNodes = [
  { id: '1', type: 'default', position: { x: 200, y: 50 }, data: { label: 'Start' } },
  { id: '2', type: 'default', position: { x: 200, y: 180 }, data: { label: 'End' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function getNodeId() {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function FlowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [sidebarTab, setSidebarTab] = useState('node'); // 'node' | 'options'

  // Derive live node/edge from the current arrays so edits aren't stale
  const selectedNode = useMemo(
    () => (selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null),
    [selectedNodeId, nodes]
  );
  const selectedEdge = useMemo(
    () => (selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) ?? null : null),
    [selectedEdgeId, edges]
  );

  // Flow-level metadata (rootId, options)
  const flowMetaRef = useRef({ rootId: null, options: {} });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }) => {
      setSelectedNodeId(selectedNodes.length === 1 ? selectedNodes[0].id : null);
      setSelectedEdgeId(selectedEdges.length === 1 ? selectedEdges[0].id : null);
    },
    []
  );

  const onAddNode = useCallback(
    (type) => {
      const id = getNodeId();
      let newNode;
      if (type === 'question') {
        const qId = `q_${Date.now().toString(36)}`;
        newNode = {
          id: `q_${id}`,
          type: 'question',
          position: { x: 250 + Math.random() * 100, y: 150 + Math.random() * 80 },
          data: { questionId: qId, label: 'New question', control: 'single', validation: {} },
        };
      } else if (type === 'branch') {
        newNode = {
          id,
          type: 'branch',
          position: { x: 250 + Math.random() * 100, y: 150 + Math.random() * 80 },
          data: { label: 'Condition', branches: ['yes', 'no'] },
        };
      } else {
        newNode = {
          id,
          type: 'default',
          position: { x: 250 + Math.random() * 100, y: 150 + Math.random() * 80 },
          data: { label: 'New step' },
        };
      }
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onImport = useCallback(
    (flow) => {
      flowMetaRef.current = {
        rootId: flow.rootId ?? null,
        options: flow.options ?? {},
      };
      // For question nodes, inject option count into node data for display
      if (flow.options) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.type === 'question' && n.data?.questionId) {
              const opts = flow.options[n.data.questionId];
              return opts
                ? { ...n, data: { ...n.data, _optionCount: opts.length } }
                : n;
            }
            return n;
          })
        );
      }
    },
    [setNodes]
  );

  const updateEdgeData = useCallback(
    (edgeId, updater) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? { ...e, data: { ...(e.data ?? {}), ...updater(e.data ?? {}) } }
            : e
        )
      );
    },
    [setEdges]
  );

  return (
    <div className="flow-layout">
      <div className="flow-canvas-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={['Backspace', 'Delete']}
          nodesDraggable
          nodesConnectable
          elementsSelectable
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
          panOnDrag={[1, 2]}
          panOnScroll
        >
          <Background variant="dots" gap={16} size={1} />
          <Controls showInteractive={false} />
          <EditorToolbar
            onAddNode={onAddNode}
            onImport={onImport}
            flowMetaRef={flowMetaRef}
          />
        </ReactFlow>
      </div>
      <aside className="flow-sidebar">
        <div className="flow-sidebar-tabs">
          <button
            type="button"
            className={`flow-sidebar-tab ${sidebarTab === 'node' ? 'active' : ''}`}
            onClick={() => setSidebarTab('node')}
          >
            Node / Edge
          </button>
          <button
            type="button"
            className={`flow-sidebar-tab ${sidebarTab === 'options' ? 'active' : ''}`}
            onClick={() => setSidebarTab('options')}
          >
            Options
          </button>
        </div>
        {sidebarTab === 'node' && (
          <NodeEditor
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            updateEdgeData={updateEdgeData}
          />
        )}
        {sidebarTab === 'options' && (
          <OptionsPanel flowMetaRef={flowMetaRef} />
        )}
      </aside>
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
