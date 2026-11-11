import type { OperationDetails } from '../../types/transactions';

export async function loadOperationDetails(
  id: string,
): Promise<OperationDetails> {
  // No history/detail GET exists yet. Load only this explicitly labelled demo.
  const { getDemonstrationOperation } =
    await import('../../data/operationDetails');
  return getDemonstrationOperation(id);
}
