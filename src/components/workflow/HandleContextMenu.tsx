import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  XCircle, 
  CheckCircle, 
  UserCheck,
  Settings,
  Gift,
  Zap
} from 'lucide-react';

interface HandleContextMenuProps {
  position: { x: number; y: number };
  handleType: 'left' | 'bottom';
  onAddNode: (nodeType: string, subtype?: string) => void;
  onClose: () => void;
}

export const HandleContextMenu: React.FC<HandleContextMenuProps> = ({ 
  position, 
  handleType, 
  onAddNode, 
  onClose 
}) => {
  const leftHandleOptions = [
    {
      type: 'terminal',
      subtype: 'manual-review',
      label: 'Manual Review',
      icon: UserCheck,
      color: 'text-workflow-warning',
    },
    {
      type: 'terminal',
      subtype: 'auto-denial',
      label: 'Auto Denial',
      icon: XCircle,
      color: 'text-workflow-danger',
    },
  ];

  const bottomHandleOptions = [
    {
      type: 'application-decision',
      label: 'Application Decision',
      icon: Settings,
      color: 'text-primary',
    },
    {
      type: 'offer-filtering',
      label: 'Offer Filtering',
      icon: Gift,
      color: 'text-workflow-success',
    },
    {
      type: 'offer-optimization',
      label: 'Offer Optimization',
      icon: Zap,
      color: 'text-workflow-danger',
    },
    {
      type: 'terminal',
      subtype: 'auto-approval',
      label: 'Auto Approval',
      icon: CheckCircle,
      color: 'text-workflow-success',
    },
  ];

  const options = handleType === 'left' ? leftHandleOptions : bottomHandleOptions;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <Card 
        className="absolute z-[1000] w-72 bg-background border border-border shadow-lg"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%)',
        }}
      >
        <div className="p-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-3 px-1">
            Add {handleType === 'left' ? 'Terminal' : 'Next'} Node
          </h4>
          <div className="space-y-1">
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={`${option.type}-${option.subtype || ''}`}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50 min-h-[60px]"
                  onClick={() => {
                    onAddNode(option.type, option.subtype);
                    onClose();
                  }}
                >
                  <div className={`p-1.5 rounded-md bg-muted mr-3 flex-shrink-0 ${option.color}`}>
                    <IconComponent className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium mb-1">{option.label}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed break-words">
                      {option.type === 'application-decision' && 'Add rule based decision points to approve or deny applications based on chosen criteria'}
                      {option.type === 'offer-filtering' && 'Apply business, partner, or product‑specific rules to remove offers that cannot be extended'}
                      {option.type === 'offer-optimization' && 'Review the full set of generated offers against a defined goal to maximize return or minimize risk'}
                      {option.type === 'terminal' && option.subtype === 'manual-review' && 'Send application for manual review'}
                      {option.type === 'terminal' && option.subtype === 'auto-denial' && 'Automatically deny the application'}
                      {option.type === 'terminal' && option.subtype === 'auto-approval' && 'Automatically approve the application'}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
};