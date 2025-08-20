import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Trash2, 
  Copy
} from 'lucide-react';

interface OfferFilteringNodeProps {
  data: {
    label: string;
    description: string;
    rules: Array<{ condition: string; action: string }>;
    onDelete: () => void;
    onUpdate: (data: any) => void;
    onDuplicate: () => void;
    onHandleContextMenu?: (handleType: 'left' | 'bottom', position: { x: number; y: number }) => void;
  };
  selected: boolean;
}

export const OfferFilteringNode: React.FC<OfferFilteringNodeProps> = ({ data, selected }) => {
  const handleLeftHandleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (data.onHandleContextMenu) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      data.onHandleContextMenu('left', { x: rect.left, y: rect.top });
    }
  };

  const handleBottomHandleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (data.onHandleContextMenu) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      data.onHandleContextMenu('bottom', { x: rect.left, y: rect.top });
    }
  };

  return (
    <div className="min-w-[320px] relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 bg-workflow-success border-2 border-background rounded-full -top-2"
      />
      
      <Card className={`bg-workflow-node-bg border-2 shadow-node transition-all ${
        selected ? 'border-workflow-success shadow-elegant' : 'border-workflow-node-border'
      }`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-workflow-success/10">
                <Gift className="w-4 h-4 text-workflow-success" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-foreground">{data.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 text-muted-foreground hover:text-workflow-success"
                onClick={data.onDuplicate}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={data.onDelete}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{data.rules?.length || 0} rules</span>
              <Badge variant="secondary" className="text-xs bg-workflow-success-bg text-workflow-success">
                Offer Filtering
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Left handle for terminal nodes */}
      <Handle
        type="source"
        position={Position.Left}
        id="terminal"
        className="w-4 h-4 bg-workflow-danger border-2 border-background rounded-full -left-2 cursor-pointer"
        onContextMenu={handleLeftHandleContextMenu}
      />
      
      {/* Bottom handle for continuation */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="continue"
        className="w-4 h-4 bg-workflow-success border-2 border-background rounded-full -bottom-2 cursor-pointer"
        onContextMenu={handleBottomHandleContextMenu}
      />
    </div>
  );
};