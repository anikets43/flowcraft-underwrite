import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Zap, 
  Gift, 
  GitBranch,
  Plus
} from 'lucide-react';

interface WorkflowSidebarProps {
  onAddNode: (type: string) => void;
}

const nodeTypes = [
  {
    type: 'application-decision',
    label: 'Application Decision',
    description: 'Add rule based decision points to approve or deny applications based on chosen criteria',
    icon: Settings,
    color: 'text-primary',
  },
  {
    type: 'offer-filtering',
    label: 'Offer Filtering',
    description: 'Apply business, partner, or product‑specific rules to remove offers that cannot be extended',
    icon: Gift,
    color: 'text-workflow-success',
  },
  {
    type: 'offer-optimization',
    label: 'Offer Optimization',
    description: 'Review the full set of generated offers against a defined goal to maximize return or minimize risk',
    icon: Zap,
    color: 'text-workflow-danger',
  },
];

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ onAddNode }) => {
  return (
    <div className="w-80 bg-workflow-sidebar border-r border-workflow-node-border p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-workflow-sidebar-foreground" />
        <h2 className="text-lg font-semibold text-workflow-sidebar-foreground">
          Workflow Editor
        </h2>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-workflow-sidebar-foreground/80 mb-3">
          Available Blocks
        </h3>
        
        {nodeTypes.map((nodeType) => {
          const IconComponent = nodeType.icon;
          return (
            <Card
              key={nodeType.type}
              className="p-4 bg-workflow-node-bg border-workflow-node-border hover:shadow-node transition-all duration-200 cursor-pointer group"
              onClick={() => onAddNode(nodeType.type)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-workflow-canvas ${nodeType.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-foreground">
                      {nodeType.label}
                    </h4>
                    <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nodeType.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-workflow-node-bg/50 rounded-lg border border-workflow-node-border">
        <h4 className="text-sm font-medium text-workflow-sidebar-foreground mb-2">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs"
            onClick={() => onAddNode('application-decision')}
          >
            <Settings className="w-3 h-3 mr-2" />
            Add Application Decision
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs"
            onClick={() => onAddNode('offer-filtering')}
          >
            <Gift className="w-3 h-3 mr-2" />
            Add Offer Filtering
          </Button>
        </div>
      </div>
    </div>
  );
};