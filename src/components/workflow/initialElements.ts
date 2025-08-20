import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'application-decision-1',
    type: 'application-decision',
    position: { x: 250, y: 50 },
    data: {
      label: 'Credit Eligibility Check',
      description: 'Evaluate whether the application meets minimum credit criteria before proceeding to deeper underwriting. This step applies rule for checking applicant\'s FICO against predefined thresholds. Applications fall below the FICO threshold are declined at this stage, while those passing move forward for further assessment.',
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
];

export const initialEdges: Edge[] = [];