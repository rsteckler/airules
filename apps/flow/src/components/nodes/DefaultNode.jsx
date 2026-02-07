import { memo } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';

function DefaultNode({ data, selected }) {
  return (
    <>
      <NodeToolbar position={Position.Top} offset={8} visible={selected}>
        <span className="flow-node-toolbar-label">Step</span>
      </NodeToolbar>
      <div className={`flow-node flow-node-default ${selected ? 'selected' : ''}`}>
        <Handle type="target" position={Position.Top} className="flow-handle" />
        <div className="flow-node-label">{data?.label ?? 'Node'}</div>
        {data?.metadata && Object.keys(data.metadata).length > 0 && (
          <div className="flow-node-meta-badge">+meta</div>
        )}
        <Handle type="source" position={Position.Bottom} className="flow-handle" />
      </div>
    </>
  );
}

export default memo(DefaultNode);
