import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Gift, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Plus,
  Check,
  X,
  Copy
} from 'lucide-react';

interface OfferFilteringNodeProps {
  data: {
    label: string;
    description: string;
    rules: Array<{ condition: string; action: string }>;
    expanded: boolean;
    executionFlowEnabled: boolean;
    passOutcome: string;
    failOutcome: string;
    onDelete: () => void;
    onUpdate: (data: any) => void;
    onDuplicate: () => void;
  };
  selected: boolean;
}

const outcomeOptions = [
  { value: 'proceed', label: 'PROCEED TO NEXT STRATEGY' },
  { value: 'auto-denial', label: 'STOP WITH AUTO DENIAL' },
  { value: 'manual-review', label: 'STOP WITH MANUAL REVIEW' },
  { value: 'auto-approval', label: 'STOP WITH AUTO APPROVAL' },
];

export const OfferFilteringNode: React.FC<OfferFilteringNodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [editDescription, setEditDescription] = useState(data.description);

  const handleSave = () => {
    data.onUpdate({
      label: editLabel,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(data.label);
    setEditDescription(data.description);
    setIsEditing(false);
  };

  const addRule = () => {
    const newRules = [...(data.rules || []), { condition: 'New condition', action: 'New action' }];
    data.onUpdate({ rules: newRules });
  };

  const handleExecutionFlowToggle = (enabled: boolean) => {
    data.onUpdate({ 
      executionFlowEnabled: enabled,
      passOutcome: enabled ? (data.passOutcome || 'proceed') : '',
      failOutcome: enabled ? (data.failOutcome || 'auto-denial') : ''
    });
  };

  const handleOutcomeChange = (type: 'pass' | 'fail', value: string) => {
    data.onUpdate({
      [`${type}Outcome`]: value
    });
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
            
            {data.executionFlowEnabled && (
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
            )}
          </div>
        </div>
      </Card>

      {data.executionFlowEnabled && (
        <>
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
        </>
      )}
      
      {!data.executionFlowEnabled && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-4 h-4 bg-workflow-success border-2 border-background rounded-full -bottom-2"
        />
      )}
    </div>
  );
};