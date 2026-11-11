import type { OperationSummary } from '../types/transactions';

// Layout fixtures from ProjetoCarteira.pen, never wallet history from the API.
export const demonstrationOperations: OperationSummary[] = [
  {
    id: 'demo-petr4',
    type: 'BUY',
    ticker: 'PETR4',
    date: '2024-05-18',
    quantity: 100,
    amount: 3875,
  },
  {
    id: 'demo-vale3',
    type: 'SELL',
    ticker: 'VALE3',
    date: '2024-05-14',
    quantity: 40,
    amount: 2472,
  },
  {
    id: 'demo-itub4',
    type: 'BUY',
    ticker: 'ITUB4',
    date: '2024-05-09',
    quantity: 150,
    amount: 4713,
  },
  {
    id: 'demo-wege3',
    type: 'BUY',
    ticker: 'WEGE3',
    date: '2024-05-02',
    quantity: 80,
    amount: 2804,
  },
  {
    id: 'demo-bbas3',
    type: 'SELL',
    ticker: 'BBAS3',
    date: '2024-04-26',
    quantity: 50,
    amount: 1368,
  },
  {
    id: 'demo-b3sa3',
    type: 'BUY',
    ticker: 'B3SA3',
    date: '2024-04-18',
    quantity: 200,
    amount: 2428,
  },
];
