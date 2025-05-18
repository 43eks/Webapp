import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App';
import { Handle, Position } from 'reactflow';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

function ModelingEditorERD() {
  const [tables, setTables] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dwh/modeling`)
      .then(res => res.json())
      .then(data => {
        setTables(data || []);
        generateERDiagram(data || []);
      })
      .catch(err => console.error('取得エラー:', err));
  }, []);

  const generateERDiagram = (tableData) => {
    const baseX = 50;
    const baseY = 50;
    const offsetX = 250;
    const offsetY = 300;

    const newNodes = tableData.map((table, i) => ({
      id: table.name,
      position: { x: baseX + (i % 3) * offsetX, y: baseY + Math.floor(i / 3) * offsetY },
      data: {
        label: (
          <div style={{ padding: 10, background: '#fff', border: '1px solid #999', borderRadius: 5 }}>
            <strong>{table.name}</strong>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 5 }}>
              {table.fields.map((f, idx) => (
                <li key={idx}>{f.name} : {f.type}</li>
              ))}
            </ul>
          </div>
        )
      },
      style: { width: 200 },
      type: 'default',
    }));

    const newEdges = [];
    tableData.forEach((table) => {
      table.fields.forEach((field) => {
        if (field.relation) {
          const [targetTable, targetField] = field.relation.split('.');
          newEdges.push({
            id: `${table.name}-${field.name}-to-${targetTable}.${targetField}`,
            source: table.name,
            target: targetTable,
            animated: true,
            label: `${field.name} → ${targetField}`,
            style: { stroke: '#888' },
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <h2 style={{ padding: '10px 20px' }}>🧩 DWH データモデリング（ER図）</h2>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default ModelingEditorERD;
