import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  Settings, 
  Gift, 
  Zap,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react';

interface Rule {
  condition: string;
  action: string;
}

interface RulesSidebarProps {
  selectedNode: any;
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
}

const outcomeOptions = [
  { value: 'proceed', label: 'PROCEED TO NEXT STRATEGY' },
  { value: 'auto-denial', label: 'STOP WITH AUTO DENIAL' },
  { value: 'manual-review', label: 'STOP WITH MANUAL REVIEW' },
  { value: 'auto-approval', label: 'STOP WITH AUTO APPROVAL' },
];

export const RulesSidebar: React.FC<RulesSidebarProps> = ({
  selectedNode,
  onUpdateNode,
  onClose
}) => {
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [editingRule, setEditingRule] = useState<Rule>({ condition: '', action: '' });

  if (!selectedNode) return null;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'application-decision': return Settings;
      case 'offer-filtering': return Gift;
      case 'offer-optimization': return Zap;
      default: return Settings;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'application-decision': return 'text-primary';
      case 'offer-filtering': return 'text-workflow-success';
      case 'offer-optimization': return 'text-workflow-danger';
      default: return 'text-primary';
    }
  };

  const getNodeLabel = (type: string) => {
    switch (type) {
      case 'application-decision': return 'Application Decision';
      case 'offer-filtering': return 'Offer Filtering';
      case 'offer-optimization': return 'Offer Optimization';
      default: return 'Node';
    }
  };

  const handleExecutionFlowToggle = (enabled: boolean) => {
    onUpdateNode(selectedNode.id, { 
      executionFlowEnabled: enabled,
      passOutcome: enabled ? (selectedNode.data.passOutcome || 'proceed') : '',
      failOutcome: enabled ? (selectedNode.data.failOutcome || 'auto-denial') : ''
    });
  };

  const handleOutcomeChange = (type: 'pass' | 'fail', value: string) => {
    onUpdateNode(selectedNode.id, {
      [`${type}Outcome`]: value
    });
  };

  const addRule = () => {
    const newRules = [...(selectedNode.data.rules || []), { condition: 'New condition', action: 'New action' }];
    onUpdateNode(selectedNode.id, { rules: newRules });
  };

  const startEditingRule = (index: number) => {
    const rule = selectedNode.data.rules[index];
    setEditingRule({ ...rule });
    setEditingRuleIndex(index);
  };

  const saveRule = () => {
    if (editingRuleIndex === null) return;
    
    const updatedRules = [...selectedNode.data.rules];
    updatedRules[editingRuleIndex] = editingRule;
    onUpdateNode(selectedNode.id, { rules: updatedRules });
    setEditingRuleIndex(null);
    setEditingRule({ condition: '', action: '' });
  };

  const deleteRule = (index: number) => {
    const updatedRules = selectedNode.data.rules.filter((_: any, i: number) => i !== index);
    onUpdateNode(selectedNode.id, { rules: updatedRules });
  };

  const cancelEditing = () => {
    setEditingRuleIndex(null);
    setEditingRule({ condition: '', action: '' });
  };

  const IconComponent = getNodeIcon(selectedNode.type);

  return (
    <Sidebar 
      className="w-96"
      side="right"
    >
      <SidebarTrigger className="m-2 self-start" onClick={onClose} />
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${getNodeColor(selectedNode.type)}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span>Rules Configuration</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </SidebarGroupLabel>

          <SidebarGroupContent className="space-y-6">
            {/* Node Info */}
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xs">
                {getNodeLabel(selectedNode.type)}
              </Badge>
              <h3 className="font-medium text-foreground">{selectedNode.data.label}</h3>
              <p className="text-sm text-muted-foreground">{selectedNode.data.description}</p>
            </div>

            {/* Execution Flow - Only for Application Decision and Offer Filtering */}
            {selectedNode.type !== 'offer-optimization' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Execution Flow</label>
                  <Switch
                    checked={selectedNode.data.executionFlowEnabled}
                    onCheckedChange={handleExecutionFlowToggle}
                  />
                </div>

                {selectedNode.data.executionFlowEnabled ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">If PASS:</label>
                      <Select
                        value={selectedNode.data.passOutcome || 'proceed'}
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
                        value={selectedNode.data.failOutcome || 'auto-denial'}
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
            )}

            {/* Offer Optimization Goal */}
            {selectedNode.type === 'offer-optimization' && (
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Optimization Goal</h4>
                  <div className="p-2 bg-workflow-canvas rounded border">
                    <div className="text-xs text-muted-foreground">
                      {selectedNode.data.goal || 'Maximize return'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-workflow-success"></div>
                    <span className="text-xs text-muted-foreground">If PASS: AUTO APPROVAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-workflow-danger"></div>
                    <span className="text-xs text-muted-foreground">If FAIL: AUTO DENIAL</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rules Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  {selectedNode.type === 'offer-filtering' ? 'Filtering Rules' : 'Rules'}
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addRule}
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedNode.data.rules?.length > 0 ? (
                  selectedNode.data.rules.map((rule: Rule, index: number) => (
                    <div key={index} className="p-3 bg-workflow-canvas rounded border border-workflow-node-border">
                      {editingRuleIndex === index ? (
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Condition:</label>
                            <Input
                              value={editingRule.condition}
                              onChange={(e) => setEditingRule(prev => ({ ...prev, condition: e.target.value }))}
                              className="h-7 text-xs mt-1"
                              placeholder="Enter condition"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Action:</label>
                            <Textarea
                              value={editingRule.action}
                              onChange={(e) => setEditingRule(prev => ({ ...prev, action: e.target.value }))}
                              className="text-xs resize-none mt-1"
                              rows={2}
                              placeholder="Enter action"
                            />
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" onClick={saveRule} className="h-6 px-2 text-xs">
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditing} className="h-6 px-2 text-xs">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground mb-1">IF:</div>
                              <div className="text-xs font-medium">{rule.condition}</div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingRule(index)}
                                className="p-1 h-5 w-5 text-muted-foreground hover:text-foreground"
                              >
                                <Settings className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteRule(index)}
                                className="p-1 h-5 w-5 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">THEN:</div>
                            <div className="text-xs">{rule.action}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-4 border-2 border-dashed border-workflow-node-border rounded">
                    No rules defined. Click "Add Rule" to get started.
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};