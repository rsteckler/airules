import { useState, useCallback } from 'react';

/**
 * Panel for editing the flow's options map (answer choices per questionId).
 * Options are stored in flowMetaRef.current.options.
 */
export default function OptionsPanel({ flowMetaRef }) {
  const [selectedQId, setSelectedQId] = useState('');
  const [newQId, setNewQId] = useState('');
  const [, forceUpdate] = useState(0);

  const options = flowMetaRef.current.options ?? {};
  const questionIds = Object.keys(options);
  const currentOptions = selectedQId ? (options[selectedQId] ?? []) : [];

  const refresh = () => forceUpdate((n) => n + 1);

  const selectQuestion = (qId) => {
    setSelectedQId(qId);
  };

  const addQuestionId = () => {
    const qId = newQId.trim();
    if (!qId || options[qId]) return;
    flowMetaRef.current.options[qId] = [];
    setNewQId('');
    setSelectedQId(qId);
    refresh();
  };

  const removeQuestionId = (qId) => {
    delete flowMetaRef.current.options[qId];
    if (selectedQId === qId) setSelectedQId('');
    refresh();
  };

  const addOption = () => {
    if (!selectedQId) return;
    flowMetaRef.current.options[selectedQId] = [
      ...currentOptions,
      { value: '', label: '', type: undefined },
    ];
    refresh();
  };

  const updateOption = useCallback(
    (index, field, value) => {
      if (!selectedQId) return;
      const opts = [...(flowMetaRef.current.options[selectedQId] ?? [])];
      opts[index] = { ...opts[index], [field]: value || undefined };
      // Clean up undefined type
      if (field === 'type' && !value) delete opts[index].type;
      flowMetaRef.current.options[selectedQId] = opts;
      refresh();
    },
    [selectedQId, flowMetaRef]
  );

  const removeOption = (index) => {
    if (!selectedQId) return;
    const opts = [...(flowMetaRef.current.options[selectedQId] ?? [])];
    opts.splice(index, 1);
    flowMetaRef.current.options[selectedQId] = opts;
    refresh();
  };

  return (
    <div className="flow-options-panel">
      <h3 className="flow-node-editor-title">Options Map</h3>

      <div className="flow-field">
        <label>Question IDs</label>
        <div className="flow-options-qid-list">
          {questionIds.map((qId) => (
            <div
              key={qId}
              className={`flow-options-qid-item ${qId === selectedQId ? 'active' : ''}`}
              onClick={() => selectQuestion(qId)}
            >
              <span>{qId}</span>
              <span className="flow-options-qid-count">({(options[qId] ?? []).length})</span>
              <button
                type="button"
                className="flow-btn flow-btn-sm"
                onClick={(e) => { e.stopPropagation(); removeQuestionId(qId); }}
              >
                x
              </button>
            </div>
          ))}
        </div>
        <div className="flow-meta-add">
          <input
            type="text"
            placeholder="New questionId"
            value={newQId}
            onChange={(e) => setNewQId(e.target.value)}
          />
          <button type="button" className="flow-btn flow-btn-sm" onClick={addQuestionId}>
            Add
          </button>
        </div>
      </div>

      {selectedQId && (
        <div className="flow-field">
          <label>Options for: {selectedQId}</label>
          <div className="flow-options-list">
            {currentOptions.map((opt, i) => (
              <div key={i} className="flow-option-row">
                <input
                  type="text"
                  placeholder="value"
                  value={opt.value ?? ''}
                  onChange={(e) => updateOption(i, 'value', e.target.value)}
                  className="flow-option-input"
                />
                <input
                  type="text"
                  placeholder="label"
                  value={opt.label ?? ''}
                  onChange={(e) => updateOption(i, 'label', e.target.value)}
                  className="flow-option-input"
                />
                <select
                  value={opt.type ?? ''}
                  onChange={(e) => updateOption(i, 'type', e.target.value)}
                  className="flow-select flow-select-sm"
                >
                  <option value="">normal</option>
                  <option value="none">none</option>
                  <option value="other">other</option>
                </select>
                <button type="button" className="flow-btn flow-btn-sm" onClick={() => removeOption(i)}>
                  x
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="flow-btn flow-btn-sm" onClick={addOption}>
            + Add option
          </button>
        </div>
      )}
    </div>
  );
}
