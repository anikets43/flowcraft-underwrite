import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';

interface ConditionalEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  style?: React.CSSProperties;
  markerEnd?: any;
  data?: {
    condition: 'PASS' | 'FAIL';
    onToggleCondition?: (edgeId: string) => void;
  };
}

export const ConditionalEdge: React.FC<ConditionalEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const condition = data?.condition || 'FAIL';
  const isPass = condition === 'PASS';

  const handleToggle = () => {
    console.log('Toggle clicked for edge:', id, 'current condition:', condition);
    if (data?.onToggleCondition) {
      data.onToggleCondition(id);
    } else {
      console.log('No onToggleCondition function found');
    }
  };

  // Determine edge color based on condition
  const edgeColor = isPass ? 'hsl(var(--workflow-success))' : 'hsl(var(--workflow-danger))';
  const edgeStyle = {
    ...style,
    stroke: edgeColor,
    strokeWidth: 2,
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-all transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: labelX,
            top: labelY,
          }}
        >
          <Button
            size="sm"
            variant="outline"
            className={`h-6 px-2 text-xs font-medium border-2 bg-workflow-node-bg hover:bg-muted/50 transition-colors cursor-pointer ${
              isPass 
                ? 'border-workflow-success text-workflow-success hover:bg-workflow-success/10' 
                : 'border-workflow-danger text-workflow-danger hover:bg-workflow-danger/10'
            }`}
            onClick={handleToggle}
            title="Click to toggle condition"
          >
            {condition}
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};