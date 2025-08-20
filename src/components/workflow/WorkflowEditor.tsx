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
import { SidebarProvider } from '@/components/ui/sidebar';
import { Play } from 'lucide-react';
import { WorkflowSidebar } from './WorkflowSidebar';
import { RulesSidebar } from './RulesSidebar';
import { ApplicationDecisionNode } from './nodes/ApplicationDecisionNode';
import { OfferFilteringNode } from './nodes/OfferFilteringNode';
import { OfferOptimizationNode } from './nodes/OfferOptimizationNode';
import { InsertableEdge } from './edges/InsertableEdge';
import { initialNodes, initialEdges } from './initialElements';

const nodeTypes = {
  'application-decision': ApplicationDecisionNode,
  'offer-filtering': OfferFilteringNode,
  'offer-optimization': OfferOptimizationNode,
};

const edgeTypes = {
  insertable: InsertableEdge,
};

export const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeForRules, setSelectedNodeForRules] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'insertable' }, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
    setSelectedNodeForRules(node);
  }, [selectedNodeId]);

  const addNode = useCallback((type: string) => {
    const getNodeData = (nodeType: string) => {
      const baseData = {
        expanded: false,
        executionFlowEnabled: true,
        passOutcome: 'proceed',
        failOutcome: 'auto-denial',
        rules: [],
      };

      switch (nodeType) {
        case 'application-decision':
          return {
            ...baseData,
            label: 'New Application Decision',
            description: 'Add rule based decision points to approve or deny applications based on chosen criteria',
          };
        case 'offer-filtering':
          return {
            ...baseData,
            label: 'New Offer Filtering',
            description: 'Apply business, partner, or product‑specific rules to remove offers that cannot be extended',
          };
        case 'offer-optimization':
          return {
            ...baseData,
            label: 'New Offer Optimization',
            description: 'Review the full set of generated offers against a defined goal to maximize return or minimize risk',
            goal: 'Maximize return',
            executionFlowEnabled: false, // Always disabled for optimization
          };
        default:
          return baseData;
      }
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: getNodeData(type),
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

  const duplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (!nodeToDuplicate) return;

    // Only allow duplication for Application Decision and Offer Filtering
    if (!['application-decision', 'offer-filtering'].includes(nodeToDuplicate.type)) return;

    const newNode: Node = {
      ...nodeToDuplicate,
      id: `${nodeToDuplicate.type}-${Date.now()}`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
      data: {
        ...nodeToDuplicate.data,
        label: `${nodeToDuplicate.data.label} (Copy)`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  const insertNodeBetween = useCallback((sourceId: string, targetId: string) => {
    const sourceNode = nodes.find(n => n.id === sourceId);
    const targetNode = nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) return;

    // Create new node positioned between source and target
    const newNode: Node = {
      id: `application-decision-${Date.now()}`,
      type: 'application-decision',
      position: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      },
      data: {
        label: 'New Application Decision',
        description: 'Add rule based decision points to approve or deny applications',
        rules: [],
        expanded: false,
        executionFlowEnabled: true,
        passOutcome: 'proceed',
        failOutcome: 'auto-denial',
      },
    };

    // Update edges to connect through the new node
    setEdges((eds) => 
      eds.map((edge) => {
        if (edge.source === sourceId && edge.target === targetId) {
          // Replace the direct edge with two edges through the new node
          return [
            {
              ...edge,
              id: `${sourceId}-${newNode.id}`,
              target: newNode.id,
              type: 'insertable',
            },
            {
              id: `${newNode.id}-${targetId}`,
              source: newNode.id,
              target: targetId,
              type: 'insertable',
              sourceHandle: 'pass',
              targetHandle: edge.targetHandle,
              animated: true,
              style: { stroke: 'hsl(var(--workflow-success))' },
            },
          ];
        }
        return edge;
      }).flat()
    );

    // Add the new node
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes, setEdges]);

  const runWorkflow = () => {
    console.log('Running workflow with nodes:', nodes);
    // TODO: Implement workflow execution logic
  };

  return (
    <SidebarProvider>
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
                expanded: false, // Remove inline expansion since we use sidebar
                onDelete: () => deleteNode(node.id),
                onUpdate: (data: any) => updateNodeData(node.id, data),
                onDuplicate: () => duplicateNode(node.id),
              }
            }))}
            edges={edges.map(edge => ({
              ...edge,
              data: {
                ...edge.data,
                onInsertNode: insertNodeBetween,
              }
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
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
                  case 'application-decision': return 'hsl(var(--primary))';
                  case 'offer-filtering': return 'hsl(var(--workflow-success))';
                  case 'offer-optimization': return 'hsl(var(--workflow-danger))';
                  default: return 'hsl(var(--muted))';
                }
              }}
            />
          </ReactFlow>
        </div>

        {selectedNodeForRules && (
          <RulesSidebar
            selectedNode={selectedNodeForRules}
            onUpdateNode={updateNodeData}
            onClose={() => setSelectedNodeForRules(null)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};