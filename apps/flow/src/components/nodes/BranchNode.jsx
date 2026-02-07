import { memo } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';

function BranchNode({ data, selected }) {
  const branches = data?.branches ?? ['true', 'false'];
  return (
    <>
      <NodeToolbar position={Position.Top} offset={8} visible={selected}>
        <span className="flow-node-toolbar-label">Branch</span>
      </NodeToolbar>
      <div className={`flow-node flow-node-branch ${selected ? 'selected' : ''}`}>
        <Handle type="target" position={Position.Top} className="flow-handle" />
        <div className="flow-node-label">{data?.label ?? 'Condition'}</div>
        <div className="flow-node-branch-handles">
          {branches.map((label, i) => (
            <div
              key={i}
              className="flow-handle-wrap"
              style={{ left: `${((i + 1) / (branches.length + 1)) * 100}%` }}
            >
              <Handle
                type="source"
                position={Position.Bottom}
                id={String(i)}
                className="flow-handle flow-handle-branch"
              />
            </div>
          ))}
        </div>
        <div className="flow-node-branch-labels">
          {branches.map((label, i) => (
            <span key={i} className="flow-branch-label">
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default memo(BranchNode);
