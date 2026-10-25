import type {
  Allocation,
  SummaryMetric,
  Transaction,
} from '../types/portfolio';

export const summaryMetrics: SummaryMetric[] = [
  {
    label: 'Patrimônio total',
    value: 'R$ 248.630,42',
    detail: '+8,4% no ano',
    tone: 'positive',
  },
  {
    label: 'Renda mensal estimada',
    value: 'R$ 1.842,10',
    detail: '+R$ 214 vs. mês anterior',
    tone: 'warning',
  },
  {
    label: 'Ativos na carteira',
    value: '18',
    detail: '4 classes de ativos',
    tone: 'info',
  },
];

export const allocations: Allocation[] = [
  {
    id: 'acoes',
    name: 'Ações',
    amount: 84534.34,
    percentage: 34,
    assetCount: 7,
    color: '#4b8f6a',
  },
  {
    id: 'fii',
    name: 'FII',
    amount: 44753.48,
    percentage: 18,
    assetCount: 4,
    color: '#cc942e',
  },
  {
    id: 'renda-fixa',
    name: 'Renda fixa',
    amount: 87020.65,
    percentage: 35,
    assetCount: 5,
    color: '#4e789e',
  },
  {
    id: 'reserva',
    name: 'Reserva',
    amount: 32321.95,
    percentage: 13,
    assetCount: 2,
    color: '#b76d6d',
  },
];

export const recentTransactions: Transaction[] = [
  {
    id: 'hglg11',
    date: '12 JUN',
    description: 'Dividendo · HGLG11',
    amount: 126.4,
  },
  {
    id: 'ivvb11',
    date: '10 JUN',
    description: 'Compra · IVVB11',
    amount: -842.1,
  },
  {
    id: 'ipca',
    date: '05 JUN',
    description: 'Juros · Tesouro IPCA+',
    amount: 214.72,
  },
  { id: 'aporte', date: '31 MAI', description: 'Aporte mensal', amount: 1000 },
];
