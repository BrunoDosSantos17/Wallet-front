import { demonstrationOperations } from './transactions';
import type { OperationDetails } from '../types/transactions';

export function getDemonstrationOperation(id: string): OperationDetails {
  const operation = demonstrationOperations.find(item => item.id === id);
  if (!operation) throw new Error('Operação não encontrada.');
  return {
    ...operation,
    // Only PETR4 has an institution specified by the design.
    institution: id === 'demo-petr4' ? 'XP Investimentos' : null,
  };
}
