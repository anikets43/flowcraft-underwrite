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
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Plus,
  Check,
  X,
  Copy
} from 'lucide-react';

interface ApplicationDecisionNodeProps {
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

export const ApplicationDecisionNode: React.FC<ApplicationDecisionNodeProps> = ({ data, selected }) => {
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
    <div className="min-w-[320px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <Card className={`bg-workflow-node-bg border-2 shadow-node transition-all ${
        selected ? 'border-primary shadow-elegant' : 'border-workflow-node-border'
      }`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Application Decision
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 text-muted-foreground hover:text-primary"
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

          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="font-medium"
                placeholder="Decision name"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-sm resize-none"
                rows={3}
                placeholder="Decision description"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} className="h-7 px-3">
                  <Check className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 px-3">
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 
                className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {data.label}
              </h3>
              <p 
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {data.description}
              </p>
            </div>
          )}

          {/* Execution Flow Toggle */}
          <div className="mt-4 pt-4 border-t border-workflow-node-border">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Execution Flow</label>
              <Switch
                checked={data.executionFlowEnabled}
                onCheckedChange={handleExecutionFlowToggle}
              />
            </div>

            {data.executionFlowEnabled ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">If PASS:</label>
                  <Select
                    value={data.passOutcome || 'proceed'}
                    onValueChange={(value) => handleOutcomeChange('pass', value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {outcomeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-xs">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">If FAIL:</label>
                  <Select
                    value={data.failOutcome || 'auto-denial'}
                    onValueChange={(value) => handleOutcomeChange('fail', value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {outcomeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-xs">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground p-2 bg-workflow-canvas rounded border">
                All Requests Will PROCEED TO NEXT STRATEGY
              </div>
            )}
          </div>

          {data.expanded && (
            <div className="mt-4 pt-4 border-t border-workflow-node-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">Rules</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addRule}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rule
                </Button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {data.rules?.length > 0 ? (
                  data.rules.map((rule, index) => (
                    <div key={index} className="p-2 bg-workflow-canvas rounded border border-workflow-node-border">
                      <div className="text-xs text-muted-foreground">IF: {rule.condition}</div>
                      <div className="text-xs text-muted-foreground">THEN: {rule.action}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    No rules defined
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-workflow-node-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {data.expanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              Click to {data.expanded ? 'collapse' : 'expand'}
            </div>
            <div className="text-xs text-muted-foreground">
              {data.rules?.length || 0} rules
            </div>
          </div>
        </div>
      </Card>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
};