import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Gift, 
  Trash2, 
  Copy,
  Edit2,
  Check,
  X
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
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const [tempDescription, setTempDescription] = useState(data.description);

  const handleSaveLabel = () => {
    data.onUpdate?.({ label: tempLabel });
    setIsEditingLabel(false);
  };

  const handleCancelLabel = () => {
    setTempLabel(data.label);
    setIsEditingLabel(false);
  };

  const handleSaveDescription = () => {
    data.onUpdate?.({ description: tempDescription });
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setTempDescription(data.description);
    setIsEditingDescription(false);
  };
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
      
      <Card className={`bg-blue-50 dark:bg-blue-950/20 border-2 shadow-node transition-all ${
        selected ? 'border-workflow-success shadow-elegant' : 'border-workflow-node-border'
      }`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-workflow-success/10">
                <Gift className="w-4 h-4 text-workflow-success" />
              </div>
              <div className="flex-1">
                {isEditingLabel ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={tempLabel}
                      onChange={(e) => setTempLabel(e.target.value)}
                      className="h-6 text-sm font-medium"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveLabel();
                        if (e.key === 'Escape') handleCancelLabel();
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" className="p-1 h-6 w-6" onClick={handleSaveLabel}>
                      <Check className="w-3 h-3 text-green-600" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1 h-6 w-6" onClick={handleCancelLabel}>
                      <X className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-1">
                    <h3 className="font-medium text-sm text-foreground">{data.label}</h3>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setIsEditingLabel(true)}
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                )}
                
                {isEditingDescription ? (
                  <div className="flex items-start gap-1 mt-1">
                    <Textarea
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="text-xs resize-none min-h-[40px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) handleSaveDescription();
                        if (e.key === 'Escape') handleCancelDescription();
                      }}
                      autoFocus
                    />
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="ghost" className="p-1 h-4 w-4" onClick={handleSaveDescription}>
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-4 w-4" onClick={handleCancelDescription}>
                        <X className="w-2.5 h-2.5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group flex items-start gap-1 mt-1">
                    <p className="text-xs text-muted-foreground">{data.description}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      <Edit2 className="w-2 h-2" />
                    </Button>
                  </div>
                )}
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