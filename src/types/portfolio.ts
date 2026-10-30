export type AssetClass = string;

export interface Allocation {
  id: AssetClass;
  name: string;
  amount: number;
  percentage: number;
  assetCount: number | null;
  color: string;
}

export interface WalletDistribution {
  nomeAtivo: string;
  percentual: string;
  valor: string;
  quantidade: number;
}

export interface WalletAsset {
  tipo: string;
  ticker: string;
}

export interface WalletBasicInfo {
  patrimonioTotal: number;
  rendaMensalEst: number;
  ativosCarteira: number;
  distribuicao: WalletDistribution[];
  ativos?: WalletAsset[];
}

export interface ImportErrorDetail {
  rowNumber: number;
  message: string;
}

export interface ImportResponse {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportErrorDetail[];
}

export interface WalletResponse {
  id: number;
  name: string;
}

export interface CurrencyQuote {
  bid: number;
  code: string;
  codein: string;
  name: string;
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
