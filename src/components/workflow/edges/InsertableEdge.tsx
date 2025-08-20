import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Settings, Gift, Zap } from 'lucide-react';

interface InsertableEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  style?: React.CSSProperties;
  markerEnd?: string;
  source: string;
  target: string;
  data?: {
    onInsertNode?: (sourceId: string, targetId: string, nodeType: string) => void;
  };
}

export const InsertableEdge: React.FC<InsertableEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
  data,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const nodeTypes = [
    {
      type: 'application-decision',
      label: 'Application Decision',
      description: 'Add rule based decision points to approve or deny applications',
      icon: Settings,
      color: 'text-primary',
    },
    {
      type: 'offer-filtering',
      label: 'Offer Filtering',
      description: 'Apply business, partner, or product‑specific rules to remove offers',
      icon: Gift,
      color: 'text-workflow-success',
    },
    {
      type: 'offer-optimization',
      label: 'Offer Optimization',
      description: 'Review the full set of generated offers against a defined goal',
      icon: Zap,
      color: 'text-workflow-danger',
    },
  ];

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleNodeTypeSelect = (nodeType: string) => {
    if (data?.onInsertNode) {
      data.onInsertNode(source, target, nodeType);
    }
    setShowDropdown(false);
  };

  const handleClickOutside = () => {
    setShowDropdown(false);
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={style}
        className="stroke-workflow-node-border hover:stroke-primary transition-colors"
      />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-all z-50"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <Button
            size="sm"
            variant="secondary"
            className={`w-8 h-8 p-0 bg-workflow-node-bg border-2 border-workflow-node-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-node rounded-full ${
              showDropdown ? 'border-primary bg-primary text-primary-foreground' : ''
            }`}
            onClick={handlePlusClick}
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={handleClickOutside}
              />
              <Card className="absolute top-10 left-1/2 transform -translate-x-1/2 w-80 bg-workflow-node-bg border-workflow-node-border shadow-elegant z-50">
                <div className="p-3">
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Select Block to Insert
                  </h3>
                  <div className="space-y-2">
                    {nodeTypes.map((nodeType) => {
                      const IconComponent = nodeType.icon;
                      return (
                        <div
                          key={nodeType.type}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-workflow-canvas cursor-pointer transition-colors"
                          onClick={() => handleNodeTypeSelect(nodeType.type)}
                        >
                          <div className={`p-2 rounded-lg bg-workflow-canvas ${nodeType.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-foreground">
                              {nodeType.label}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {nodeType.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};