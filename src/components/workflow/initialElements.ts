import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'application-decision-1',
    type: 'application-decision',
    position: { x: 100, y: 100 },
    data: {
      label: 'Credit Eligibility Check',
      description: 'Evaluate whether the application meets minimum credit criteria before proceeding to deeper underwriting.',
      rules: [
        { 
          condition: 'credit_score >= 650', 
          action: 'Approve for further review' 
        },
        { 
          condition: 'credit_score < 650', 
          action: 'Decline application' 
        }
      ],
      expanded: false,
      executionFlowEnabled: true,
      passOutcome: 'proceed',
      failOutcome: 'auto-denial',
    },
  },
  {
    id: 'offer-filtering-1',
    type: 'offer-filtering',
    position: { x: 100, y: 300 },
    data: {
      label: 'Offer Filtering',
      description: 'Apply business rules to filter valid offers for the customer.',
      rules: [],
      expanded: false,
      executionFlowEnabled: true,
      passOutcome: 'proceed',
      failOutcome: 'auto-denial',
    },
  },
  {
    id: 'optimization-1',
    type: 'offer-optimization',
    position: { x: 100, y: 500 },
    data: {
      label: 'Offer Optimization',
      description: 'Select the best offer based on optimization criteria.',
      goal: 'Maximize return',
      expanded: false,
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'application-decision-1',
    sourceHandle: 'pass',
    target: 'offer-filtering-1',
    type: 'insertable',
    animated: true,
    style: { stroke: 'hsl(var(--workflow-success))' },
  },
  {
    id: 'e2-3',
    source: 'offer-filtering-1',
    sourceHandle: 'pass',
    target: 'optimization-1',
    type: 'insertable',
    animated: true,
    style: { stroke: 'hsl(var(--workflow-success))' },
  },
];