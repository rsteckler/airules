import { useCallback, useRef, useState } from 'react';
import { Panel, useReactFlow } from '@xyflow/react';
import { normalizeFlowFromRF, flowFromJSON } from '../data/flowSchema';

export default function EditorToolbar({ onAddNode, onImport, flowMetaRef }) {
  const { getNodes, getEdges, getViewport, setNodes, setEdges, setViewport, deleteElements } =
    useReactFlow();
  const fileInputRef = useRef(null);
  const [copyLabel, setCopyLabel] = useState('Copy JSON');

  const buildFlowJSON = useCallback(() => {
    const viewport = getViewport();
    const nodes = getNodes();
    const edges = getEdges();
    const flow = normalizeFlowFromRF({ nodes, edges, viewport }, {
      rootId: flowMetaRef?.current?.rootId ?? null,
      options: flowMetaRef?.current?.options ?? {},
    });
    return JSON.stringify(flow, null, 2);
  }, [getNodes, getEdges, getViewport, flowMetaRef]);

  const handleExport = useCallback(() => {
    const json = buildFlowJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [buildFlowJSON]);

  const handleCopyJSON = useCallback(() => {
    const json = buildFlowJSON();
    navigator.clipboard.writeText(json).then(() => {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy JSON'), 1500);
    });
  }, [buildFlowJSON]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const applyImport = useCallback(
    (flow) => {
      setNodes(flow.nodes ?? []);
      setEdges(flow.edges ?? []);
      if (flow.viewport) setViewport(flow.viewport);
      onImport?.(flow);
    },
    [setNodes, setEdges, setViewport, onImport]
  );

  const handleImportFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const flow = flowFromJSON(reader.result);
          applyImport(flow);
        } catch (err) {
          alert(err.message || 'Failed to import');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [applyImport]
  );

  const handlePasteJSON = useCallback(() => {
    const raw = window.prompt('Paste flow JSON:');
    if (raw == null || raw.trim() === '') return;
    try {
      const flow = flowFromJSON(raw);
      applyImport(flow);
    } catch (err) {
      alert(err.message || 'Invalid JSON');
    }
  }, [applyImport]);

  const handleDeleteSelection = useCallback(() => {
    deleteElements({
      nodes: getNodes().filter((n) => n.selected),
      edges: getEdges().filter((e) => e.selected),
    });
  }, [deleteElements, getNodes, getEdges]);

  return (
    <>
      <Panel position="top-left" className="flow-toolbar">
        <div className="flow-toolbar-group">
          <button type="button" className="flow-btn" onClick={() => onAddNode('default')}>
            + Step
          </button>
          <button type="button" className="flow-btn flow-btn-question" onClick={() => onAddNode('question')}>
            + Question
          </button>
          <button type="button" className="flow-btn" onClick={() => onAddNode('branch')}>
            + Branch
          </button>
        </div>
        <div className="flow-toolbar-group">
          <button type="button" className="flow-btn flow-btn-primary" onClick={handleExport}>
            Export JSON
          </button>
          <button type="button" className="flow-btn flow-btn-primary" onClick={handleCopyJSON}>
            {copyLabel}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="flow-file-input"
            onChange={handleImportFile}
            aria-hidden
          />
          <button type="button" className="flow-btn" onClick={handleImportClick}>
            Import JSON
          </button>
          <button type="button" className="flow-btn" onClick={handlePasteJSON}>
            Paste JSON
          </button>
        </div>
        <div className="flow-toolbar-group">
          <button type="button" className="flow-btn flow-btn-danger" onClick={handleDeleteSelection}>
            Delete selected
          </button>
        </div>
      </Panel>
    </>
  );
}
