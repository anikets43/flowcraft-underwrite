import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Trash2, 
  Copy,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface ApplicationDecisionNodeProps {
  data: {
    label: string;
    description: string;
    rules: Array<{ condition: string; action: string }>;
    onDelete: () => void;
    onUpdate: (data: any) => void;
    onDuplicate: () => void;
    onHandleContextMenu?: (handleType: 'left' | 'bottom', position: { x: number; y: number }) => void;
  };
  selected: boolean;
}

export const ApplicationDecisionNode: React.FC<ApplicationDecisionNodeProps> = ({ data, selected }) => {
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const [tempDescription, setTempDescription] = useState(data.description);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  useEffect(() => {
    if (editingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
      descriptionRef.current.select();
    }
  }, [editingDescription]);

  const handleSaveName = () => {
    data.onUpdate({ ...data, label: tempLabel });
    setEditingName(false);
  };

  const handleCancelName = () => {
    setTempLabel(data.label);
    setEditingName(false);
  };

  const handleSaveDescription = () => {
    data.onUpdate({ ...data, description: tempDescription });
    setEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setTempDescription(data.description);
    setEditingDescription(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelName();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSaveDescription();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelDescription();
    }
  };

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

  return (
    <div className="min-w-[320px] relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 bg-primary border-2 border-background rounded-full -top-2"
      />
      
      <Card className={`bg-blue-50 dark:bg-blue-950/20 border-2 shadow-node transition-all ${
        selected ? 'border-primary shadow-elegant' : 'border-workflow-node-border'
      }`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 group">
                  {editingName ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        ref={nameInputRef}
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        onKeyDown={handleNameKeyDown}
                        className="h-6 text-sm font-medium nodrag"
                        onBlur={handleSaveName}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6 text-muted-foreground hover:text-primary"
                        onClick={handleSaveName}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={handleCancelName}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-sm text-foreground">{data.label}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-4 w-4 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setEditingName(true)}
                      >
                        <Edit3 className="w-2 h-2" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-start gap-2 group mt-1">
                  {editingDescription ? (
                    <div className="flex flex-col gap-1 flex-1">
                      <Textarea
                        ref={descriptionRef}
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        onKeyDown={handleDescriptionKeyDown}
                        className="min-h-[60px] text-xs resize-none nodrag"
                        onBlur={handleSaveDescription}
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 text-muted-foreground hover:text-primary"
                          onClick={handleSaveDescription}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={handleCancelDescription}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground flex-1">{data.description}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-4 w-4 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                        onClick={() => setEditingDescription(true)}
                      >
                        <Edit3 className="w-2 h-2" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{data.rules?.length || 0} rules</span>
              <Badge variant="secondary" className="text-xs">
                Decision Node
              </Badge>
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