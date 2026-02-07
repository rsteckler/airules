import { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';

export default function NodeEditor({ selectedNode, selectedEdge, updateEdgeData }) {
  const { setNodes } = useReactFlow();
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');

  const updateNodeData = useCallback(
    (nodeId, updater) => {
      setNodes((nodes) =>
        nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updater(n.data) } } : n))
      );
    },
    [setNodes]
  );

  // ── Edge editor ──────────────────────────────────────────────────
  if (selectedEdge) {
    const { id: edgeId, source, target, data: edgeData } = selectedEdge;
    const order = edgeData?.order ?? 0;
    const when = edgeData?.when ?? null;
    const whenJson = when ? JSON.stringify(when, null, 2) : '';

    return (
      <div className="flow-node-editor">
        <h3 className="flow-node-editor-title">Edge: {edgeId}</h3>
        <div className="flow-field">
          <label>Source → Target</label>
          <span className="flow-edge-endpoints">{source} → {target}</span>
        </div>
        <div className="flow-field">
          <label>Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => updateEdgeData(edgeId, () => ({ order: Number(e.target.value) }))}
            placeholder="0"
          />
        </div>
        <div className="flow-field">
          <label>When condition (JSON)</label>
          <textarea
            className="flow-textarea"
            rows={6}
            value={whenJson}
            onChange={(e) => {
              const val = e.target.value.trim();
              if (!val) {
                updateEdgeData(edgeId, (d) => {
                  const { when: _w, ...rest } = d;
                  return rest;
                });
                return;
              }
              try {
                const parsed = JSON.parse(val);
                updateEdgeData(edgeId, () => ({ when: parsed }));
              } catch {
                // Don't update on invalid JSON — user is still typing
              }
            }}
            placeholder='{"questionId":"stacks","op":"contains","value":"web"}'
          />
          <span className="flow-hint">
            Operators: contains, notContains, equals, notEquals, and, or, not
          </span>
        </div>
      </div>
    );
  }

  // ── No selection ─────────────────────────────────────────────────
  if (!selectedNode) {
    return (
      <div className="flow-node-editor flow-node-editor-empty">
        <p>Select a node or edge to edit its properties.</p>
      </div>
    );
  }

  // ── Node editor ──────────────────────────────────────────────────
  const { id, type, data } = selectedNode;
  const isQuestion = type === 'question';
  const isBranch = type === 'branch';
  const metadata = data?.metadata ?? {};
  const branches = data?.branches ?? ['true', 'false'];

  const setLabel = (value) => updateNodeData(id, () => ({ label: value }));

  // Question-specific setters
  const setQuestionId = (value) => updateNodeData(id, () => ({ questionId: value }));
  const setControl = (value) => updateNodeData(id, () => ({ control: value }));
  const setDefaultValue = (value) => {
    try {
      const parsed = JSON.parse(value);
      updateNodeData(id, () => ({ defaultValue: parsed }));
    } catch {
      updateNodeData(id, () => ({ defaultValue: value }));
    }
  };
  const setValidationRequired = (checked) => {
    updateNodeData(id, (d) => ({ validation: { ...(d.validation ?? {}), required: checked } }));
  };
  const setValidationMinItems = (value) => {
    const num = Number(value);
    updateNodeData(id, (d) => ({
      validation: { ...(d.validation ?? {}), minItems: num > 0 ? num : undefined },
    }));
  };

  // Metadata handlers
  const addMetadata = () => {
    if (!metaKey.trim()) return;
    updateNodeData(id, (d) => ({
      metadata: { ...(d.metadata ?? {}), [metaKey.trim()]: metaValue.trim() },
    }));
    setMetaKey('');
    setMetaValue('');
  };
  const removeMetadata = (key) => {
    updateNodeData(id, (d) => {
      const next = { ...(d.metadata ?? {}) };
      delete next[key];
      return { metadata: next };
    });
  };

  // Branch handlers
  const setBranchLabel = (index, value) => {
    updateNodeData(id, (d) => {
      const next = [...(d.branches ?? ['true', 'false'])];
      next[index] = value;
      return { branches: next };
    });
  };
  const addBranch = () => {
    updateNodeData(id, (d) => ({ branches: [...(d.branches ?? ['true', 'false']), 'new'] }));
  };
  const removeBranch = (index) => {
    updateNodeData(id, (d) => {
      const next = (d.branches ?? ['true', 'false']).filter((_, i) => i !== index);
      return { branches: next.length ? next : ['true'] };
    });
  };

  return (
    <div className="flow-node-editor">
      <h3 className="flow-node-editor-title">
        {isQuestion ? 'Question' : isBranch ? 'Branch' : 'Node'}: {id}
      </h3>

      <div className="flow-field">
        <label>Label</label>
        <input
          type="text"
          value={data?.label ?? ''}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Node label"
        />
      </div>

      {/* ── Question-specific fields ──────────────────────────── */}
      {isQuestion && (
        <>
          <div className="flow-field">
            <label>Question ID</label>
            <input
              type="text"
              value={data?.questionId ?? ''}
              onChange={(e) => setQuestionId(e.target.value)}
              placeholder="e.g. web_language"
            />
          </div>
          <div className="flow-field">
            <label>Control type</label>
            <select
              value={data?.control ?? 'single'}
              onChange={(e) => setControl(e.target.value)}
              className="flow-select"
            >
              <option value="single">Single (radio)</option>
              <option value="multi">Multi (checkbox)</option>
            </select>
          </div>
          <div className="flow-field">
            <label>Default value (JSON or string)</label>
            <input
              type="text"
              value={
                typeof data?.defaultValue === 'object'
                  ? JSON.stringify(data.defaultValue)
                  : data?.defaultValue ?? ''
              }
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder='["web", "server"] or "pnpm"'
            />
          </div>
          <div className="flow-field">
            <label>Validation</label>
            <label className="flow-checkbox-label">
              <input
                type="checkbox"
                checked={data?.validation?.required ?? false}
                onChange={(e) => setValidationRequired(e.target.checked)}
              />
              Required
            </label>
            {data?.control === 'multi' && (
              <div className="flow-field-inline">
                <label>Min items</label>
                <input
                  type="number"
                  min="0"
                  value={data?.validation?.minItems ?? ''}
                  onChange={(e) => setValidationMinItems(e.target.value)}
                  placeholder="0"
                  style={{ width: '60px' }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Generic metadata ──────────────────────────────────── */}
      {!isQuestion && (
        <div className="flow-field">
          <label>Metadata</label>
          <div className="flow-meta-list">
            {Object.entries(metadata).map(([k, v]) => (
              <div key={k} className="flow-meta-item">
                <span className="flow-meta-kv">
                  <strong>{k}</strong>: {String(v)}
                </span>
                <button type="button" className="flow-btn flow-btn-sm" onClick={() => removeMetadata(k)}>
                  x
                </button>
              </div>
            ))}
          </div>
          <div className="flow-meta-add">
            <input type="text" placeholder="Key" value={metaKey} onChange={(e) => setMetaKey(e.target.value)} />
            <input type="text" placeholder="Value" value={metaValue} onChange={(e) => setMetaValue(e.target.value)} />
            <button type="button" className="flow-btn flow-btn-sm" onClick={addMetadata}>Add</button>
          </div>
        </div>
      )}

      {/* ── Branch conditionals ───────────────────────────────── */}
      {isBranch && (
        <div className="flow-field">
          <label>Branch conditionals</label>
          <p className="flow-hint">Each output handle can have a label.</p>
          <div className="flow-branches-list">
            {branches.map((label, i) => (
              <div key={i} className="flow-branch-row">
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setBranchLabel(i, e.target.value)}
                  placeholder={`Branch ${i + 1}`}
                />
                <button
                  type="button"
                  className="flow-btn flow-btn-sm"
                  onClick={() => removeBranch(i)}
                  disabled={branches.length <= 1}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="flow-btn flow-btn-sm" onClick={addBranch}>
            + Add branch
          </button>
        </div>
      )}
    </div>
  );
}
