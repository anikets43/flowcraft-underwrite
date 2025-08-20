import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
    onInsertNode?: (sourceId: string, targetId: string) => void;
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleInsertClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data?.onInsertNode) {
      data.onInsertNode(source, target);
    }
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
          className="absolute pointer-events-all z-10"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-workflow-node-bg border-2 border-workflow-node-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-node rounded-full"
            onClick={handleInsertClick}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};