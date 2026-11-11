export interface OperationSummary {
  id: string;
  type: 'BUY' | 'SELL';
  ticker: string;
  date: string;
  quantity: number;
  amount: number;
}

export interface OperationDetails extends OperationSummary {
  institution: string | null;
}
