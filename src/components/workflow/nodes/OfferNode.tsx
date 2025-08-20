import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Trash2,
  Check,
  X,
  DollarSign
} from 'lucide-react';

interface OfferNodeProps {
  data: {
    label: string;
    description: string;
    offerAmount?: string;
    offerTerms?: string;
    expanded: boolean;
    onDelete: () => void;
    onUpdate: (data: any) => void;
  };
  selected: boolean;
}

export const OfferNode: React.FC<OfferNodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [editDescription, setEditDescription] = useState(data.description);
  const [editAmount, setEditAmount] = useState(data.offerAmount || '');
  const [editTerms, setEditTerms] = useState(data.offerTerms || '');

  const handleSave = () => {
    data.onUpdate({
      label: editLabel,
      description: editDescription,
      offerAmount: editAmount,
      offerTerms: editTerms,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(data.label);
    setEditDescription(data.description);
    setEditAmount(data.offerAmount || '');
    setEditTerms(data.offerTerms || '');
    setIsEditing(false);
  };

  return (
    <div className="min-w-[280px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-workflow-success border-2 border-background"
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
              <Badge variant="secondary" className="text-xs bg-workflow-success-bg text-workflow-success">
                Offer
              </Badge>
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

          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="font-medium"
                placeholder="Offer name"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-sm resize-none"
                rows={2}
                placeholder="Offer description"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="Amount"
                    className="text-sm"
                  />
                </div>
                <div className="w-16 flex items-center justify-center text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <Textarea
                value={editTerms}
                onChange={(e) => setEditTerms(e.target.value)}
                className="text-sm resize-none"
                rows={2}
                placeholder="Terms and conditions"
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
                className="font-medium text-foreground cursor-pointer hover:text-workflow-success transition-colors"
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
              
              {data.offerAmount && (
                <div className="flex items-center gap-2 mt-2">
                  <DollarSign className="w-4 h-4 text-workflow-success" />
                  <span className="font-medium text-workflow-success">
                    {data.offerAmount}
                  </span>
                </div>
              )}

              {data.offerTerms && (
                <div className="mt-2 p-2 bg-workflow-success-bg rounded text-xs text-workflow-success">
                  {data.offerTerms}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="accept"
        style={{ left: '30%' }}
        className="w-3 h-3 bg-workflow-success border-2 border-background"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="decline"
        style={{ left: '70%' }}
        className="w-3 h-3 bg-workflow-danger border-2 border-background"
      />

      <div className="flex justify-between mt-2 px-2">
        <Badge variant="outline" className="text-xs bg-workflow-success-bg text-workflow-success border-workflow-success">
          Accept
        </Badge>
        <Badge variant="outline" className="text-xs bg-workflow-danger-bg text-workflow-danger border-workflow-danger">
          Decline
        </Badge>
      </div>
    </div>
  );
};