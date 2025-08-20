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
    onDelete: () => void;
    onUpdate: (data: any) => void;
  };
  selected: boolean;
}

export const OfferOptimizationNode: React.FC<OfferOptimizationNodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [editDescription, setEditDescription] = useState(data.description);
  const [editGoal, setEditGoal] = useState(data.goal || 'Maximize return');

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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-workflow-success rounded-full"></div>
                <span className="text-xs text-workflow-success font-medium">Pass</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-workflow-danger font-medium">Fail</span>
                <div className="w-3 h-3 bg-workflow-danger rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        id="pass"
        className="w-4 h-4 bg-workflow-success border-2 border-background rounded-full -bottom-2"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="fail"
        className="w-4 h-4 bg-workflow-danger border-2 border-background rounded-full -bottom-2"
        style={{ left: '75%' }}
      />
    </div>
  );
};