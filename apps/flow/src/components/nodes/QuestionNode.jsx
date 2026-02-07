import { memo } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';

function QuestionNode({ data, selected }) {
  const control = data?.control ?? 'single';
  const questionId = data?.questionId ?? '';
  const label = data?.label ?? 'Question';
  const optionCount = data?._optionCount ?? 0;

  return (
    <>
      <NodeToolbar position={Position.Top} offset={8} visible={selected}>
        <span className="flow-node-toolbar-label">Question</span>
      </NodeToolbar>
      <div className={`flow-node flow-node-question ${selected ? 'selected' : ''}`}>
        <Handle type="target" position={Position.Top} className="flow-handle" />
        <div className="flow-node-label">{label}</div>
        <div className="flow-node-question-meta">
          <span className="flow-node-question-id">{questionId}</span>
          <span className={`flow-node-control-badge flow-node-control-badge--${control}`}>
            {control}
          </span>
        </div>
        {optionCount > 0 && (
          <div className="flow-node-option-count">{optionCount} options</div>
        )}
        <Handle type="source" position={Position.Bottom} className="flow-handle" />
      </div>
    </>
  );
}

export default memo(QuestionNode);
