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
  quantidade: string;
  quantidadeAtivos: number;
}

export interface WalletAsset {
  tipo: string;
  ticker: string;
}

export interface WalletBasicInfo {
  // The current backend may also return zero for missing data; zero is not proof
  // of completeness. Null/absent values must never be formatted as money.
  patrimonioTotal: number | null;
  rendaMensalEst: number | null;
  ativosCarteira: number;
  distribuicao: WalletDistribution[];
  avisos?: string[];
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
