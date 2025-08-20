import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { WorkflowSidebar } from './WorkflowSidebar';
import { StrategyNode } from './nodes/StrategyNode';
import { OfferNode } from './nodes/OfferNode';
import { DecisionNode } from './nodes/DecisionNode';
import { initialNodes, initialEdges } from './initialElements';

const nodeTypes = {
  strategy: StrategyNode,
  offer: OfferNode,
  decision: DecisionNode,
};

export const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
  }, [selectedNodeId]);

  const addNode = useCallback((type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: 'Enter description...',
        rules: [],
        expanded: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, [setNodes]);

  const runWorkflow = () => {
    console.log('Running workflow with nodes:', nodes);
    // TODO: Implement workflow execution logic
  };

  return (
    <div className="h-screen w-full flex bg-workflow-canvas">
      <WorkflowSidebar onAddNode={addNode} />
      
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 z-10">
          <Button onClick={runWorkflow} className="bg-gradient-primary shadow-elegant">
            <Play className="w-4 h-4 mr-2" />
            Run Workflow
          </Button>
        </div>

        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              expanded: node.id === selectedNodeId,
              onDelete: () => deleteNode(node.id),
              onUpdate: (data: any) => updateNodeData(node.id, data),
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="workflow-canvas"
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            className="bg-workflow-canvas"
          />
          <Controls className="bg-workflow-node-bg border-workflow-node-border" />
          <MiniMap 
            className="bg-workflow-node-bg border-workflow-node-border"
            nodeColor={(node) => {
              switch (node.type) {
                case 'strategy': return 'hsl(var(--primary))';
                case 'offer': return 'hsl(var(--workflow-success))';
                case 'decision': return 'hsl(var(--workflow-danger))';
                default: return 'hsl(var(--muted))';
              }
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};