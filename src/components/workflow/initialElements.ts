import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'strategy-1',
    type: 'strategy',
    position: { x: 250, y: 50 },
    data: {
      label: 'Credit Score Check',
      description: 'Evaluate customer creditworthiness',
      rules: [
        { 
          condition: 'credit_score >= 750', 
          action: 'Approve for premium rates' 
        },
        { 
          condition: 'credit_score >= 650', 
          action: 'Approve for standard rates' 
        },
        { 
          condition: 'credit_score < 650', 
          action: 'Decline application' 
        }
      ],
      expanded: false,
    },
  },
  {
    id: 'decision-1',
    type: 'decision',
    position: { x: 100, y: 250 },
    data: {
      label: 'Income Verification',
      description: 'Check if income meets minimum requirements',
      condition: 'annual_income >= 50000 AND employment_duration >= 12',
      expanded: false,
    },
  },
  {
    id: 'offer-1',
    type: 'offer',
    position: { x: 400, y: 250 },
    data: {
      label: 'Premium Offer',
      description: 'Best rates for qualified customers',
      offerAmount: '$250,000',
      offerTerms: '30-year fixed at 3.5% APR',
      expanded: false,
    },
  },
  {
    id: 'strategy-2',
    type: 'strategy',
    position: { x: 250, y: 450 },
    data: {
      label: 'Final Review',
      description: 'Manual underwriter review for edge cases',
      rules: [
        { 
          condition: 'debt_to_income < 0.43', 
          action: 'Proceed with standard terms' 
        },
        { 
          condition: 'assets >= 2 * loan_amount', 
          action: 'Override income requirements' 
        }
      ],
      expanded: false,
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'strategy-1',
    target: 'decision-1',
    sourceHandle: 'fail',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--workflow-danger))', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: 'strategy-1',
    target: 'offer-1',
    sourceHandle: 'pass',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--workflow-success))', strokeWidth: 2 },
  },
  {
    id: 'e2-4',
    source: 'decision-1',
    target: 'strategy-2',
    sourceHandle: 'true',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--workflow-success))', strokeWidth: 2 },
  },
];