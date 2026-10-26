export type AssetClass = string;

export interface Allocation {
  id: AssetClass;
  name: string;
  amount: number;
  percentage: number;
  assetCount: number;
  color: string;
}

export interface WalletDistribution {
  nomeAtivo: string;
  percentual: string;
  valor: string;
  quantidade: number;
}

export interface WalletBasicInfo {
  patrimonioTotal: number;
  rendaMensalEst: number;
  ativosCarteira: number;
  distribuicao: WalletDistribution[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface SummaryMetric {
  label: string;
  value: string;
  detail: string;
  tone: 'positive' | 'warning' | 'info';
}

export interface PortfolioAsset {
  id: string;
  ticker: string;
  badgeLabel: string;
  name: string;
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface PortfolioOverview {
  totalAmount: number;
  annualChange: string;
  assetClassCount: number;
  assetClassHint: string;
  dollarQuote: number;
  assets: PortfolioAsset[];
}

export interface EquityPosition {
  ticker: string;
  name: string;
  unitPrice: number;
  totalAmount: number;
}

export interface EquitiesOverview {
  totalAmount: number;
  positions: EquityPosition[];
}
