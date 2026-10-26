import type { WalletBasicInfo } from '../types/portfolio';

const API_BASE_URL = '/api';

export async function getWalletBasicInfo(
  walletId: number,
  signal?: AbortSignal,
): Promise<WalletBasicInfo> {
  const response = await fetch(
    `${API_BASE_URL}/wallet/infoBasica/${walletId}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error('Não foi possível carregar as informações da carteira.');
  }

  return response.json() as Promise<WalletBasicInfo>;
}
