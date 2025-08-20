import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  ChevronDown, 
  ChevronRight, 
  Trash2,
  Check,
  X
} from 'lucide-react';

interface OfferOptimizationNodeProps {
  data: {
    label: string;
    description: string;
    goal: string;
    expanded: boolean;
    leftCondition?: 'PASS' | 'FAIL';
    rightCondition?: 'PASS' | 'FAIL';
    onDelete: () => void;
    onUpdate: (data: any) => void;
    onHandleContextMenu?: (handleType: 'left' | 'bottom', position: { x: number; y: number }) => void;
  };
  selected: boolean;
}

export const OfferOptimizationNode: React.FC<OfferOptimizationNodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [editDescription, setEditDescription] = useState(data.description);
  const [editGoal, setEditGoal] = useState(data.goal || 'Maximize return');
  
  const leftCondition = data.leftCondition || 'FAIL';
  const rightCondition = data.rightCondition || 'PASS';

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

  const handleToggleLeftCondition = () => {
    const newCondition = leftCondition === 'FAIL' ? 'PASS' : 'FAIL';
    const newRightCondition = newCondition === 'FAIL' ? 'PASS' : 'FAIL';
    data.onUpdate({ 
      leftCondition: newCondition, 
      rightCondition: newRightCondition 
    });
  };

  const handleToggleRightCondition = () => {
    const newCondition = rightCondition === 'PASS' ? 'FAIL' : 'PASS';
    const newLeftCondition = newCondition === 'PASS' ? 'FAIL' : 'PASS';
    data.onUpdate({ 
      rightCondition: newCondition, 
      leftCondition: newLeftCondition 
    });
  };

  const handleSave = () => {
    data.onUpdate({
      label: editLabel,
      description: editDescription,
      goal: editGoal,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(data.label);
    setEditDescription(data.description);
    setEditGoal(data.goal || 'Maximize return');
    setIsEditing(false);
  };

  return (
    <div className="min-w-[320px] relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 bg-workflow-danger border-2 border-background rounded-full -top-2"
      />
      
      <Card className={`bg-workflow-node-bg border-2 shadow-node transition-all ${
        selected ? 'border-workflow-danger shadow-elegant' : 'border-workflow-node-border'
      }`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-workflow-danger/10">
                <Zap className="w-4 h-4 text-workflow-danger" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-foreground">{data.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={data.onDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Goal: {data.goal || 'Maximize return'}</span>
              <Badge variant="secondary" className="text-xs bg-workflow-danger-bg text-workflow-danger">
                Offer Optimization
              </Badge>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-workflow-node-border">
              <button
                onClick={handleToggleLeftCondition}
                className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors hover:bg-muted/50 ${
                  leftCondition === 'FAIL' 
                    ? 'text-workflow-danger' 
                    : 'text-workflow-success'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  leftCondition === 'FAIL' 
                    ? 'bg-workflow-danger' 
                    : 'bg-workflow-success'
                }`}></div>
                <span className="text-xs font-medium cursor-pointer">{leftCondition}</span>
              </button>
              <button
                onClick={handleToggleRightCondition}
                className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors hover:bg-muted/50 ${
                  rightCondition === 'PASS' 
                    ? 'text-workflow-success' 
                    : 'text-workflow-danger'
                }`}
              >
                <span className="text-xs font-medium cursor-pointer">{rightCondition}</span>
                <div className={`w-3 h-3 rounded-full ${
                  rightCondition === 'PASS' 
                    ? 'bg-workflow-success' 
                    : 'bg-workflow-danger'
                }`}></div>
              </button>
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