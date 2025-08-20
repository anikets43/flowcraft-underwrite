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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Play, Plus, Settings, Gift, Zap, XCircle, UserCheck, CheckCircle } from 'lucide-react';
import { RulesSidebar } from './RulesSidebar';
import { WorkflowValidation } from './WorkflowValidation';
import { ApplicationDecisionNode } from './nodes/ApplicationDecisionNode';
import { OfferFilteringNode } from './nodes/OfferFilteringNode';
import { OfferOptimizationNode } from './nodes/OfferOptimizationNode';
import { TerminalNode } from './nodes/TerminalNode';
import { InsertableEdge } from './edges/InsertableEdge';
import { ConditionalEdge } from './edges/ConditionalEdge';
import { HandleContextMenu } from './HandleContextMenu';
import { initialNodes, initialEdges } from './initialElements';

const nodeTypes = {
  'application-decision': ApplicationDecisionNode,
  'offer-filtering': OfferFilteringNode,
  'offer-optimization': OfferOptimizationNode,
  'terminal': TerminalNode,
};

const edgeTypes = {
  insertable: InsertableEdge,
  conditional: ConditionalEdge,
};

export const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeForRules, setSelectedNodeForRules] = useState<Node | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    handleType: 'left' | 'bottom';
    sourceNodeId: string;
  } | null>(null);

  const availableBlocks = [
    {
      type: 'application-decision',
      label: 'Application Decision',
      description: 'Add rule based decision points to approve or deny applications based on chosen criteria. e.g., fico thresholds, bureau data such as debt‑to‑income (DTI), and more.',
      icon: Settings,
      color: 'text-primary',
    },
    {
      type: 'offer-filtering',
      label: 'Offer Filtering',
      description: 'Apply business, partner, or product‑specific rules to remove offers that cannot be extended to the customer (e.g., partner restrictions, maximum loan limits).',
      icon: Gift,
      color: 'text-workflow-success',
    },
    {
      type: 'offer-optimization',
      label: 'Offer Optimization',
      description: 'Review the full set of generated offers against a defined goal — such as maximizing return, minimizing risk and more. The system evaluates the offer grid using the chosen objective and selection logic, then identifies the offer that best meets the goal.',
      icon: Zap,
      color: 'text-workflow-danger',
    },
  ];

  const terminalBlocks = [
    {
      type: 'terminal',
      subtype: 'auto-denial',
      label: 'Auto Denial',
      description: 'Automatically deny the application',
      icon: XCircle,
      color: 'text-workflow-danger',
    },
    {
      type: 'terminal',
      subtype: 'manual-review',
      label: 'Manual Review',
      description: 'Send application for manual review',
      icon: UserCheck,
      color: 'text-workflow-warning',
    },
    {
      type: 'terminal',
      subtype: 'auto-approval',
      label: 'Auto Approval',
      description: 'Automatically approve the application',
      icon: CheckCircle,
      color: 'text-workflow-success',
    },
  ];

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceHandle = params.sourceHandle;
      const condition = sourceHandle === 'terminal' ? 'FAIL' : 'PASS';
      
      setEdges((eds) => addEdge({ 
        ...params, 
        type: 'conditional',
        data: { condition },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }, eds));
    },
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
    setSelectedNodeForRules(node);
  }, [selectedNodeId]);

  const handleContextMenuAddNode = useCallback((nodeType: string, subtype?: string) => {
    if (!contextMenu) return;

    const sourceNode = nodes.find(n => n.id === contextMenu.sourceNodeId);
    if (!sourceNode) return;

    // Create new node
    const newNode: Node = {
      id: `${nodeType}-${subtype || ''}-${Date.now()}`,
      type: nodeType,
      position: { 
        x: sourceNode.position.x + (contextMenu.handleType === 'left' ? -250 : 0),
        y: sourceNode.position.y + (contextMenu.handleType === 'bottom' ? 150 : 0),
      },
      data: {
        ...getNodeData(nodeType, subtype),
        isLeftTerminal: contextMenu.handleType === 'left' && nodeType === 'terminal',
      },
    };

    // Create edge from source to new node
    const sourceHandle = contextMenu.handleType === 'left' ? 'terminal' : 'continue';
    const condition = contextMenu.handleType === 'left' ? 'FAIL' : 'PASS';
    
    const newEdge: Edge = {
      id: `${contextMenu.sourceNodeId}-${newNode.id}`,
      source: contextMenu.sourceNodeId,
      target: newNode.id,
      sourceHandle,
      type: 'conditional',
      data: { condition },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setContextMenu(null);
  }, [contextMenu, nodes, setNodes, setEdges]);

  const getNodeData = (nodeType: string, nodeSubtype?: string) => {
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
      case 'terminal':
        const terminalLabels = {
          'auto-denial': 'STOP WITH AUTO DENIAL',
          'manual-review': 'STOP WITH MANUAL REVIEW',
          'auto-approval': 'STOP WITH AUTO APPROVAL',
        };
        const terminalDescriptions = {
          'auto-denial': 'Automatically deny the application',
          'manual-review': 'Send application for manual review',
          'auto-approval': 'Automatically approve the application',
        };
        return {
          label: terminalLabels[nodeSubtype as keyof typeof terminalLabels] || 'Terminal Event',
          description: terminalDescriptions[nodeSubtype as keyof typeof terminalDescriptions] || 'Terminal event',
          terminalType: nodeSubtype,
        };
      default:
        return baseData;
    }
  };

  const addNode = useCallback((type: string, subtype?: string) => {

    const newNode: Node = {
      id: `${type}-${subtype || ''}-${Date.now()}`,
      type,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: getNodeData(type, subtype),
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const toggleEdgeCondition = useCallback((edgeId: string) => {
    console.log('toggleEdgeCondition called for edge:', edgeId);
    setEdges((eds) => 
      eds.map((edge) => {
        if (edge.id === edgeId) {
          const currentCondition = edge.data?.condition || 'FAIL';
          const newCondition = currentCondition === 'PASS' ? 'FAIL' : 'PASS';
          console.log('Toggling condition from', currentCondition, 'to', newCondition);
          return {
            ...edge,
            data: {
              ...edge.data,
              condition: newCondition,
            },
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const handleNodeContextMenu = useCallback((nodeId: string, handleType: 'left' | 'bottom', position: { x: number; y: number }) => {
    setContextMenu({
      position,
      handleType,
      sourceNodeId: nodeId,
    });
  }, []);

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

  const insertNodeBetween = useCallback((sourceId: string, targetId: string, nodeType: string = 'application-decision') => {
    const sourceNode = nodes.find(n => n.id === sourceId);
    const targetNode = nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) return;

    const getNodeData = (type: string) => {
      const baseData = {
        expanded: false,
        executionFlowEnabled: true,
        passOutcome: 'proceed',
        failOutcome: 'auto-denial',
        rules: [],
      };

      switch (type) {
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

    // Create new node positioned between source and target
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      },
      data: getNodeData(nodeType),
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
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
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
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            },
          ];
        }
        return edge;
      }).flat()
    );

    // Add the new node
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes, setEdges]);

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex bg-workflow-canvas">
        <div className="flex-1 relative">
          {/* Top Toolbar */}
          <div className="absolute top-4 right-4 flex justify-end items-center z-10">
            <WorkflowValidation
              nodes={nodes}
              edges={edges}
              trigger={
                <Button className="bg-gradient-primary shadow-elegant">
                  <Play className="w-4 h-4 mr-2" />
                  Run Workflow
                </Button>
              }
            />
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
                onHandleContextMenu: (handleType: 'left' | 'bottom', position: { x: number; y: number }) => 
                  handleNodeContextMenu(node.id, handleType, position),
              }
            }))}
            edges={edges.map(edge => ({
              ...edge,
              data: {
                ...edge.data,
                onInsertNode: insertNodeBetween,
                onToggleCondition: toggleEdgeCondition,
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
                  case 'terminal': 
                    if (node.data?.terminalType === 'auto-denial') return 'hsl(var(--workflow-danger))';
                    if (node.data?.terminalType === 'manual-review') return 'hsl(var(--workflow-warning))';
                    if (node.data?.terminalType === 'auto-approval') return 'hsl(var(--workflow-success))';
                    return 'hsl(var(--muted))';
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

        {contextMenu && (
          <HandleContextMenu
            position={contextMenu.position}
            handleType={contextMenu.handleType}
            onAddNode={handleContextMenuAddNode}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};