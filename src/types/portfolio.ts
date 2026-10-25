export type AssetClass = 'acoes' | 'fii' | 'renda-fixa' | 'reserva';

export interface Allocation {
  id: AssetClass;
  name: string;
  amount: number;
  percentage: number;
  assetCount: number;
  color: string;
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
