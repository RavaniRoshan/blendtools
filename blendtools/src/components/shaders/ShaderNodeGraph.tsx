import React from 'react';
import ReactFlow, { type Node, type Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import type { NodeData, EdgeData } from '../../types';

interface ShaderNodeGraphProps {
  nodeData: (NodeData | EdgeData)[];
}

const ShaderNodeGraph: React.FC<ShaderNodeGraphProps> = ({ nodeData }) => {
  const nodes: Node[] = nodeData.filter(item => 'position' in item) as Node[];
  const edges: Edge[] = nodeData.filter(item => 'source' in item) as Edge[];

  return (
    <div style={{ height: '300px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
};

export default ShaderNodeGraph;
