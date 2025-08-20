import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  XCircle, 
  CheckCircle, 
  UserCheck,
  Trash2
} from 'lucide-react';

interface TerminalNodeProps {
  data: {
    label: string;
    description: string;
    terminalType: 'auto-denial' | 'manual-review' | 'auto-approval';
    onDelete: () => void;
  };
  selected: boolean;
}

const terminalConfig = {
  'auto-denial': {
    icon: XCircle,
    color: 'text-workflow-danger',
    bgColor: 'bg-workflow-danger/10',
    borderColor: 'border-workflow-danger',
  },
  'manual-review': {
    icon: UserCheck,
    color: 'text-workflow-warning',
    bgColor: 'bg-workflow-warning/10',
    borderColor: 'border-workflow-warning',
  },
  'auto-approval': {
    icon: CheckCircle,
    color: 'text-workflow-success',
    bgColor: 'bg-workflow-success/10',
    borderColor: 'border-workflow-success',
  },
};

export const TerminalNode: React.FC<TerminalNodeProps> = ({ data, selected }) => {
  const config = terminalConfig[data.terminalType];
  const IconComponent = config.icon;

  return (
    <div className="min-w-[240px] relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 bg-muted-foreground border-2 border-background rounded-full -top-2"
      />
      
      <Card className={`bg-workflow-node-bg border-2 shadow-node transition-all ${
        selected ? `${config.borderColor} shadow-elegant` : 'border-workflow-node-border'
      }`}>
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <IconComponent className={`w-4 h-4 ${config.color}`} />
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
          
          <div className="mt-3 pt-2 border-t border-workflow-node-border">
            <div className="flex items-center justify-center">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                Terminal Event
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};