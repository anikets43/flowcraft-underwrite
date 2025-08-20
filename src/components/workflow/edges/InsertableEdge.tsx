import React, { useState, useRef, useEffect } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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
      description: 'Add rule based decision points',
      icon: Settings,
      color: 'text-primary',
    },
    {
      type: 'offer-filtering',
      label: 'Offer Filtering',
      description: 'Apply business rules to filter offers',
      icon: Gift,
      color: 'text-workflow-success',
    },
    {
      type: 'offer-optimization',
      label: 'Offer Optimization',
      description: 'Review offers against defined goals',
      icon: Zap,
      color: 'text-workflow-danger',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Plus clicked, current showDropdown:', showDropdown);
    setShowDropdown(!showDropdown);
  };

  const handleNodeTypeSelect = (nodeType: string) => {
    console.log('Node type selected:', nodeType);
    if (data?.onInsertNode) {
      data.onInsertNode(source, target, nodeType);
    }
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
          ref={dropdownRef}
          className="absolute z-[9999]"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <Button
            size="sm"
            variant="secondary"
            className={`w-8 h-8 p-0 bg-white border-2 shadow-lg rounded-full transition-all ${
              showDropdown 
                ? 'border-primary bg-primary text-white' 
                : 'border-gray-300 hover:border-primary hover:bg-primary hover:text-white'
            }`}
            onClick={handlePlusClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          {showDropdown && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[10000]">
              <Card className="w-80 bg-white border border-gray-200 shadow-xl">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Insert Block
                  </h3>
                  <div className="space-y-2">
                    {nodeTypes.map((nodeType) => {
                      const IconComponent = nodeType.icon;
                      return (
                        <button
                          key={nodeType.type}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          onClick={() => handleNodeTypeSelect(nodeType.type)}
                        >
                          <div className={`p-2 rounded-lg bg-gray-100 ${nodeType.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {nodeType.label}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {nodeType.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};