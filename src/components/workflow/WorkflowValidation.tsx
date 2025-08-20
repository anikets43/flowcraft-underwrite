import React, { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface WorkflowValidationProps {
  nodes: Node[];
  edges: Edge[];
  trigger: React.ReactNode;
}

interface ValidationInput {
  credit_score: number;
  annual_income: number;
  debt_to_income: number;
  employment_years: number;
}

interface ExecutionStep {
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  outcome: 'pass' | 'fail' | 'terminal';
  reason: string;
}

export const WorkflowValidation: React.FC<WorkflowValidationProps> = ({
  nodes,
  edges,
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState<ValidationInput>({
    credit_score: 650,
    annual_income: 50000,
    debt_to_income: 0.35,
    employment_years: 2,
  });
  const [executionResult, setExecutionResult] = useState<{
    steps: ExecutionStep[];
    finalOutcome: string;
    executionPath: string[];
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const evaluateCondition = (condition: string, inputs: ValidationInput): boolean => {
    // Simple condition evaluator - in a real implementation, this would be more robust
    try {
      // Replace variable names with actual values
      let evaluatedCondition = condition
        .replace(/credit_score/g, inputs.credit_score.toString())
        .replace(/annual_income/g, inputs.annual_income.toString())
        .replace(/debt_to_income/g, inputs.debt_to_income.toString())
        .replace(/employment_years/g, inputs.employment_years.toString());

      // Basic safety check - only allow simple comparisons
      if (!/^[\d\s<>=!.()&|]+$/.test(evaluatedCondition)) {
        return false;
      }

      return eval(evaluatedCondition);
    } catch {
      return false;
    }
  };

  const executeWorkflow = async () => {
    setIsRunning(true);
    const steps: ExecutionStep[] = [];
    const executionPath: string[] = [];

    // Find the starting node (first node in the workflow)
    let currentNodeId = nodes.find(node => 
      !edges.some(edge => edge.target === node.id)
    )?.id;

    if (!currentNodeId) {
      setIsRunning(false);
      return;
    }

    while (currentNodeId) {
      const currentNode = nodes.find(n => n.id === currentNodeId);
      if (!currentNode) break;

      executionPath.push(currentNodeId);

      // Handle terminal nodes
      if (currentNode.type === 'terminal') {
        steps.push({
          nodeId: currentNodeId,
          nodeLabel: String(currentNode.data.label || 'Terminal Node'),
          nodeType: currentNode.type,
          outcome: 'terminal',
          reason: String(currentNode.data.description || 'Terminal event'),
        });
        break;
      }

      // Evaluate rules for decision nodes
      const nodeRules = Array.isArray(currentNode.data.rules) ? currentNode.data.rules : [];
      if (nodeRules.length > 0) {
        let nodeOutcome: 'pass' | 'fail' = 'fail';
        let reason = 'No rules matched';

        for (const rule of nodeRules) {
          if (rule && typeof rule === 'object' && 'condition' in rule && 'action' in rule) {
            if (evaluateCondition(String(rule.condition), inputs)) {
              const action = String(rule.action);
              nodeOutcome = action.toLowerCase().includes('approve') || 
                           action.toLowerCase().includes('proceed') ? 'pass' : 'fail';
              reason = `Rule matched: ${rule.condition} → ${rule.action}`;
              break;
            }
          }
        }

        steps.push({
          nodeId: currentNodeId,
          nodeLabel: String(currentNode.data.label || 'Decision Node'),
          nodeType: currentNode.type,
          outcome: nodeOutcome,
          reason,
        });

        // Find next node based on outcome
        const nextEdge = edges.find(edge => 
          edge.source === currentNodeId && 
          edge.sourceHandle === nodeOutcome
        );
        currentNodeId = nextEdge?.target || null;
      } else {
        // No rules defined, assume pass
        steps.push({
          nodeId: currentNodeId,
          nodeLabel: String(currentNode.data.label || 'Node'),
          nodeType: currentNode.type,
          outcome: 'pass',
          reason: 'No rules defined - defaulting to pass',
        });

        // Find next node
        const nextEdge = edges.find(edge => edge.source === currentNodeId);
        currentNodeId = nextEdge?.target || null;
      }
    }

    const finalStep = steps[steps.length - 1];
    const finalOutcome = finalStep?.outcome === 'terminal' ? 
      finalStep.nodeLabel : 
      finalStep?.outcome === 'pass' ? 'Approved' : 'Denied';

    setExecutionResult({
      steps,
      finalOutcome,
      executionPath,
    });
    setIsRunning(false);
  };

  const getStepIcon = (outcome: string) => {
    switch (outcome) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-workflow-success" />;
      case 'fail': return <XCircle className="w-4 h-4 text-workflow-danger" />;
      case 'terminal': return <AlertCircle className="w-4 h-4 text-workflow-warning" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'pass': return 'bg-workflow-success/10 text-workflow-success border-workflow-success/20';
      case 'fail': return 'bg-workflow-danger/10 text-workflow-danger border-workflow-danger/20';
      case 'terminal': return 'bg-workflow-warning/10 text-workflow-warning border-workflow-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validate Workflow</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Inputs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="credit_score">Credit Score</Label>
                <Input
                  id="credit_score"
                  type="number"
                  value={inputs.credit_score}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    credit_score: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="annual_income">Annual Income ($)</Label>
                <Input
                  id="annual_income"
                  type="number"
                  value={inputs.annual_income}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    annual_income: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="debt_to_income">Debt-to-Income Ratio</Label>
                <Input
                  id="debt_to_income"
                  type="number"
                  step="0.01"
                  value={inputs.debt_to_income}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    debt_to_income: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="employment_years">Employment Years</Label>
                <Input
                  id="employment_years"
                  type="number"
                  value={inputs.employment_years}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    employment_years: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
            </div>
            
            <Button 
              onClick={executeWorkflow} 
              disabled={isRunning}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Validation'}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Execution Results</h3>
            
            {executionResult && (
              <div className="space-y-4">
                {/* Final Outcome */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getOutcomeColor(
                      executionResult.finalOutcome.toLowerCase().includes('denied') ? 'fail' : 'pass'
                    )}>
                      Final Outcome: {executionResult.finalOutcome}
                    </Badge>
                  </div>
                </Card>

                {/* Execution Steps */}
                <div className="space-y-2">
                  <h4 className="font-medium">Execution Path</h4>
                  {executionResult.steps.map((step, index) => (
                    <Card key={step.nodeId} className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          {getStepIcon(step.outcome)}
                          {index < executionResult.steps.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-muted-foreground mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{step.nodeLabel}</span>
                            <Badge variant="outline" className="text-xs">
                              {step.nodeType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{step.reason}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!executionResult && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Run validation to see results</p>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};