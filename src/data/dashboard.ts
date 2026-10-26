import type {
  Allocation,
  EquitiesOverview,
  PortfolioOverview,
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

export const portfolioOverview: PortfolioOverview = {
  totalAmount: 248639.42,
  annualChange: '▲ 12,6% no ano',
  assetClassCount: 4,
  assetClassHint: 'Ação, FII, exterior e renda fixa',
  dollarQuote: 5.42,
  assets: [
    {
      id: 'ivvb11',
      ticker: 'IVVB11',
      badgeLabel: 'A',
      name: 'Ação',
      category: 'Ativo de renda variável',
      amount: 28744.8,
      percentage: 34,
      color: '#2d8a5b',
    },
    {
      id: 'wege3',
      ticker: 'WEGE3',
      badgeLabel: 'F',
      name: 'FII',
      category: 'Fundo imobiliário',
      amount: 17920.5,
      percentage: 21.2,
      color: '#a9d7be',
    },
    {
      id: 'itub4',
      ticker: 'ITUB4',
      badgeLabel: 'Ae',
      name: 'Ação exterior',
      category: 'Investimentos internacionais',
      amount: 13642.1,
      percentage: 16.1,
      color: '#e8a83e',
    },
    {
      id: 'bbas3',
      ticker: 'BBAS3',
      badgeLabel: 'R',
      name: 'Renda fixa',
      category: 'Títulos e renda fixa',
      amount: 11204.44,
      percentage: 13.3,
      color: '#5b89d6',
    },
  ],
};

export const equitiesOverview: EquitiesOverview = {
  totalAmount: 112940.34,
  positions: [
    {
      ticker: 'PETR4',
      name: 'Petrobras PN',
      unitPrice: 38.75,
      totalAmount: 18600,
    },
    { ticker: 'VALE3', name: 'Vale ON', unitPrice: 61.8, totalAmount: 22248 },
    {
      ticker: 'ITUB4',
      name: 'Itaú Unibanco PN',
      unitPrice: 31.42,
      totalAmount: 16661,
    },
    {
      ticker: 'WEGE3',
      name: 'WEG ON',
      unitPrice: 35.05,
      totalAmount: 27025.34,
    },
    {
      ticker: 'BBAS3',
      name: 'Banco do Brasil ON',
      unitPrice: 27.36,
      totalAmount: 10944,
    },
    { ticker: 'B3SA3', name: 'B3 ON', unitPrice: 12.14, totalAmount: 8498 },
    { ticker: 'ABEV3', name: 'Ambev ON', unitPrice: 12.38, totalAmount: 8964 },
  ],
};

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
