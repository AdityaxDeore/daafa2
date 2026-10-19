// ============================================================
// Predefined Network Configurations
// ============================================================

import type { NetworkPreset } from '../types';

export const PREDEFINED_NETWORKS: NetworkPreset[] = [
  {
    name: 'Small Office',
    description: '5 Access Points — simple office layout',
    apCount: 5,
    graph: {
      nodes: [
        { id: 'AP1', label: 'AP1' },
        { id: 'AP2', label: 'AP2' },
        { id: 'AP3', label: 'AP3' },
        { id: 'AP4', label: 'AP4' },
        { id: 'AP5', label: 'AP5' },
      ],
      edges: [
        { source: 'AP1', target: 'AP2' },
        { source: 'AP1', target: 'AP3' },
        { source: 'AP2', target: 'AP3' },
        { source: 'AP2', target: 'AP4' },
        { source: 'AP3', target: 'AP5' },
        { source: 'AP4', target: 'AP5' },
      ],
    },
  },
  {
    name: 'College Floor',
    description: '8 Access Points — university building floor',
    apCount: 8,
    graph: {
      nodes: [
        { id: 'AP1', label: 'AP1' },
        { id: 'AP2', label: 'AP2' },
        { id: 'AP3', label: 'AP3' },
        { id: 'AP4', label: 'AP4' },
        { id: 'AP5', label: 'AP5' },
        { id: 'AP6', label: 'AP6' },
        { id: 'AP7', label: 'AP7' },
        { id: 'AP8', label: 'AP8' },
      ],
      edges: [
        { source: 'AP1', target: 'AP2' },
        { source: 'AP1', target: 'AP3' },
        { source: 'AP2', target: 'AP3' },
        { source: 'AP2', target: 'AP4' },
        { source: 'AP3', target: 'AP5' },
        { source: 'AP4', target: 'AP5' },
        { source: 'AP4', target: 'AP6' },
        { source: 'AP5', target: 'AP6' },
        { source: 'AP5', target: 'AP7' },
        { source: 'AP6', target: 'AP8' },
        { source: 'AP7', target: 'AP8' },
      ],
    },
  },
  {
    name: 'Dense Network',
    description: '10 Access Points — high-density deployment',
    apCount: 10,
    graph: {
      nodes: [
        { id: 'AP1', label: 'AP1' },
        { id: 'AP2', label: 'AP2' },
        { id: 'AP3', label: 'AP3' },
        { id: 'AP4', label: 'AP4' },
        { id: 'AP5', label: 'AP5' },
        { id: 'AP6', label: 'AP6' },
        { id: 'AP7', label: 'AP7' },
        { id: 'AP8', label: 'AP8' },
        { id: 'AP9', label: 'AP9' },
        { id: 'AP10', label: 'AP10' },
      ],
      edges: [
        { source: 'AP1', target: 'AP2' },
        { source: 'AP1', target: 'AP3' },
        { source: 'AP1', target: 'AP4' },
        { source: 'AP2', target: 'AP3' },
        { source: 'AP2', target: 'AP5' },
        { source: 'AP3', target: 'AP4' },
        { source: 'AP3', target: 'AP6' },
        { source: 'AP4', target: 'AP7' },
        { source: 'AP5', target: 'AP6' },
        { source: 'AP5', target: 'AP8' },
        { source: 'AP6', target: 'AP7' },
        { source: 'AP6', target: 'AP9' },
        { source: 'AP7', target: 'AP10' },
        { source: 'AP8', target: 'AP9' },
        { source: 'AP9', target: 'AP10' },
      ],
    },
  },
];
