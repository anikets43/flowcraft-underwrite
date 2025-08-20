import React, { useRef, useEffect, useState, useCallback } from 'react';
import Drawflow from 'drawflow';
import 'drawflow/dist/drawflow.min.css';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Play, Settings, Gift, Zap, XCircle, UserCheck, CheckCircle } from 'lucide-react';
import { RulesSidebar } from './RulesSidebar';
import { WorkflowValidation } from './WorkflowValidation';
import { HandleContextMenu } from './HandleContextMenu';

interface NodeData extends Record<string, unknown> {
  label: string;
  description: string;
  rules?: any[];
  expanded?: boolean;
  executionFlowEnabled?: boolean;
  passOutcome?: string;
  failOutcome?: string;
  goal?: string;
  terminalType?: string;
  isLeftTerminal?: boolean;
}

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export const DrawflowEditor = () => {
  const drawflowRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Drawflow | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeForRules, setSelectedNodeForRules] = useState<WorkflowNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    handleType: 'left' | 'bottom';
    sourceNodeId: string;
  } | null>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

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
      description: 'Review the full set of generated offers against a defined goal — such as maximizing return, minimizing risk and more.',
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

  const createNodeHtml = (nodeData: WorkflowNode) => {
    const { type, data } = nodeData;
    const { label, description, rules = [], terminalType } = data;
    
    const getNodeConfig = () => {
      switch (type) {
        case 'application-decision':
          return {
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary',
            textColor: 'text-primary',
            icon: '⚙️'
          };
        case 'offer-filtering':
          return {
            bgColor: 'bg-workflow-success/10',
            borderColor: 'border-workflow-success',
            textColor: 'text-workflow-success',
            icon: '🎁'
          };
        case 'offer-optimization':
          return {
            bgColor: 'bg-workflow-danger/10',
            borderColor: 'border-workflow-danger',
            textColor: 'text-workflow-danger',
            icon: '⚡'
          };
        case 'terminal':
          const configs = {
            'auto-denial': {
              bgColor: 'bg-workflow-danger/10',
              borderColor: 'border-workflow-danger',
              textColor: 'text-workflow-danger',
              icon: '❌'
            },
            'manual-review': {
              bgColor: 'bg-workflow-warning/10',
              borderColor: 'border-workflow-warning',
              textColor: 'text-workflow-warning',
              icon: '👤'
            },
            'auto-approval': {
              bgColor: 'bg-workflow-success/10',
              borderColor: 'border-workflow-success',
              textColor: 'text-workflow-success',
              icon: '✅'
            }
          };
          return configs[terminalType as keyof typeof configs] || configs['auto-denial'];
        default:
          return {
            bgColor: 'bg-muted/10',
            borderColor: 'border-muted',
            textColor: 'text-muted-foreground',
            icon: '⚪'
          };
      }
    };

    const config = getNodeConfig();
    
    return `
      <div class="drawflow-node-content ${config.bgColor} ${config.borderColor} ${config.textColor}" data-node-id="${nodeData.id}">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">${config.icon}</span>
            <h3 class="font-semibold text-sm">${label}</h3>
          </div>
          <div class="flex gap-1">
            ${type !== 'terminal' ? `<button class="duplicate-btn text-xs p-1 hover:bg-black/10 rounded" data-node-id="${nodeData.id}">📋</button>` : ''}
            <button class="delete-btn text-xs p-1 hover:bg-black/10 rounded" data-node-id="${nodeData.id}">🗑️</button>
          </div>
        </div>
        <p class="text-xs text-muted-foreground mb-2">${description}</p>
        ${rules.length > 0 ? `<div class="text-xs"><span class="font-medium">${rules.length}</span> rules configured</div>` : ''}
        ${type === 'terminal' && terminalType !== 'auto-approval' ? '' : ''}
      </div>
    `;
  };

  const getNodeData = (nodeType: string, nodeSubtype?: string): WorkflowNode => {
    const baseData: NodeData = {
      expanded: false,
      executionFlowEnabled: true,
      passOutcome: 'proceed',
      failOutcome: 'auto-denial',
      rules: [],
      label: '',
      description: '',
    };

    let data: NodeData;
    switch (nodeType) {
      case 'application-decision':
        data = {
          ...baseData,
          label: 'New Application Decision',
          description: 'Add rule based decision points to approve or deny applications based on chosen criteria',
        };
        break;
      case 'offer-filtering':
        data = {
          ...baseData,
          label: 'New Offer Filtering',
          description: 'Apply business, partner, or product‑specific rules to remove offers that cannot be extended',
        };
        break;
      case 'offer-optimization':
        data = {
          ...baseData,
          label: 'New Offer Optimization',
          description: 'Review the full set of generated offers against a defined goal to maximize return or minimize risk',
          goal: 'Maximize return',
          executionFlowEnabled: false,
        };
        break;
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
        data = {
          ...baseData,
          label: terminalLabels[nodeSubtype as keyof typeof terminalLabels] || 'Terminal Event',
          description: terminalDescriptions[nodeSubtype as keyof typeof terminalDescriptions] || 'Terminal event',
          terminalType: nodeSubtype,
        };
        break;
      default:
        data = baseData;
    }

    return {
      id: `${nodeType}-${nodeSubtype || ''}-${Date.now()}`,
      type: nodeType,
      position: { x: 0, y: 0 },
      data,
    };
  };

  const addNode = useCallback((type: string, subtype?: string, position?: { x: number; y: number }) => {
    if (!editorRef.current) return;

    const workflowNode = getNodeData(type, subtype);
    const html = createNodeHtml(workflowNode);
    
    const inputs = type === 'terminal' && workflowNode.data.isLeftTerminal ? 1 : 1;
    const outputs = type === 'terminal' ? 0 : 2;
    
    const pos = position || { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 };
    workflowNode.position = pos;
    
    editorRef.current.addNode(type, inputs, outputs, pos.x, pos.y, type, workflowNode.data, html);
    
    setNodes(prev => [...prev, workflowNode]);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    if (!editorRef.current) return;
    
    editorRef.current.removeNodeId(`node_${nodeId}`);
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setSelectedNodeForRules(null);
    }
  }, [selectedNodeId]);

  const duplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (!nodeToDuplicate || !['application-decision', 'offer-filtering'].includes(nodeToDuplicate.type)) return;

    const newNodeData = {
      ...nodeToDuplicate,
      id: `${nodeToDuplicate.type}-${Date.now()}`,
      data: {
        ...nodeToDuplicate.data,
        label: `${nodeToDuplicate.data.label} (Copy)`,
      }
    };

    addNode(newNodeData.type, newNodeData.data.terminalType, { x: 100, y: 100 });
  }, [nodes, addNode]);

  const updateNodeData = useCallback((nodeId: string, newData: Partial<NodeData>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
    ));
    
    if (selectedNodeForRules?.id === nodeId) {
      setSelectedNodeForRules(prev => prev ? { ...prev, data: { ...prev.data, ...newData } } : null);
    }
  }, [selectedNodeForRules]);

  const handleContextMenuAddNode = useCallback((nodeType: string, subtype?: string) => {
    if (!contextMenu) return;

    const sourceNode = nodes.find(n => n.id === contextMenu.sourceNodeId);
    if (!sourceNode) return;

    const position = {
      x: contextMenu.handleType === 'left' ? 50 : 300,
      y: contextMenu.handleType === 'bottom' ? 200 : 100,
    };

    addNode(nodeType, subtype, position);
    setContextMenu(null);
  }, [contextMenu, nodes, addNode]);

  useEffect(() => {
    if (!drawflowRef.current) return;

    const editor = new Drawflow(drawflowRef.current);
    editor.reroute = true;
    editor.reroute_fix_curvature = true;  
    editor.force_first_input = false;
    editor.start();

    // Add initial nodes
    const initialNodeData: WorkflowNode[] = [
      {
        id: 'application-decision-1',
        type: 'application-decision',
        position: { x: 100, y: 100 },
        data: {
          label: 'Credit Eligibility Check',
          description: 'Evaluate whether the application meets minimum credit criteria before proceeding to deeper underwriting.',
          rules: [
            { condition: 'credit_score >= 650', action: 'Approve for further review' },
            { condition: 'credit_score < 650', action: 'Decline application' }
          ],
          expanded: false,
          executionFlowEnabled: true,
          passOutcome: 'proceed',
          failOutcome: 'auto-denial',
        }
      },
      {
        id: 'offer-filtering-1', 
        type: 'offer-filtering',
        position: { x: 100, y: 300 },
        data: {
          label: 'Offer Filtering',
          description: 'Apply business rules to filter valid offers for the customer.',
          rules: [],
          expanded: false,
          executionFlowEnabled: true,
          passOutcome: 'proceed',
          failOutcome: 'auto-denial',
        }
      },
      {
        id: 'optimization-1',
        type: 'offer-optimization',
        position: { x: 100, y: 500 },
        data: {
          label: 'Offer Optimization',
          description: 'Select the best offer based on optimization criteria.',
          goal: 'Maximize return',
          expanded: false,
          rules: [],
        }
      }
    ];

    initialNodeData.forEach((workflowNode, index) => {
      const html = createNodeHtml(workflowNode);
      const inputs = 1;
      const outputs = workflowNode.type === 'terminal' ? 0 : 2;
      const x = workflowNode.position.x;
      const y = workflowNode.position.y;
      
      editor.addNode(workflowNode.type, inputs, outputs, x, y, workflowNode.type, workflowNode.data, html);
    });

    // Connect initial nodes
    if (editor.drawflow.drawflow.Home.data['1'] && editor.drawflow.drawflow.Home.data['2']) {
      editor.addConnection(1, 2, 'output_1', 'input_1');
    }
    if (editor.drawflow.drawflow.Home.data['2'] && editor.drawflow.drawflow.Home.data['3']) {
      editor.addConnection(2, 3, 'output_1', 'input_1');
    }

    setNodes(initialNodeData);
    editorRef.current = editor;

    // Event listeners
    const handleNodeClick = (e: any) => {
      const nodeElement = e.target.closest('.drawflow-node');
      if (nodeElement) {
        const nodeId = nodeElement.querySelector('[data-node-id]')?.getAttribute('data-node-id');
        if (nodeId) {
          setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
          const workflowNode = nodes.find(n => n.id === nodeId);
          if (workflowNode) {
            setSelectedNodeForRules(workflowNode);
          }
        }
      }
    };

    const handleDeleteClick = (e: any) => {
      if (e.target.classList.contains('delete-btn')) {
        e.stopPropagation();
        const nodeId = e.target.getAttribute('data-node-id');
        if (nodeId) deleteNode(nodeId);
      }
    };

    const handleDuplicateClick = (e: any) => {
      if (e.target.classList.contains('duplicate-btn')) {
        e.stopPropagation();
        const nodeId = e.target.getAttribute('data-node-id');
        if (nodeId) duplicateNode(nodeId);
      }
    };

    drawflowRef.current.addEventListener('click', handleNodeClick);
    drawflowRef.current.addEventListener('click', handleDeleteClick);
    drawflowRef.current.addEventListener('click', handleDuplicateClick);

    return () => {
      if (drawflowRef.current) {
        drawflowRef.current.removeEventListener('click', handleNodeClick);
        drawflowRef.current.removeEventListener('click', handleDeleteClick);
        drawflowRef.current.removeEventListener('click', handleDuplicateClick);
      }
      editor.clear();
    };
  }, []);

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

          {/* Add Node Buttons */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {availableBlocks.map((block) => (
              <Button
                key={block.type}
                variant="outline"
                size="sm"
                onClick={() => addNode(block.type)}
                className="bg-workflow-node-bg border-workflow-node-border"
              >
                <block.icon className={`w-4 h-4 mr-2 ${block.color}`} />
                {block.label}
              </Button>
            ))}
          </div>

          {/* Terminal Blocks */}
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            {terminalBlocks.map((block) => (
              <Button
                key={`${block.type}-${block.subtype}`}
                variant="outline"
                size="sm"
                onClick={() => addNode(block.type, block.subtype)}
                className="bg-workflow-node-bg border-workflow-node-border"
              >
                <block.icon className={`w-4 h-4 mr-2 ${block.color}`} />
                {block.label}
              </Button>
            ))}
          </div>

          {/* Drawflow Canvas */}
          <div ref={drawflowRef} className="drawflow-container h-full w-full" />
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