import type {
  CurrencyQuote,
  ImportResponse,
  WalletAsset,
  WalletBasicInfo,
  WalletResponse,
} from '../types/portfolio';
import { AssetPriceSchedulerAction } from '../types/scheduler';

const API_BASE_URL = '/api';

export async function getCurrencyQuote(
  pair: string,
  signal?: AbortSignal,
): Promise<CurrencyQuote> {
  const response = await fetch(`${API_BASE_URL}/currencies/${pair}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar a cotação da moeda.');
  }

  return response.json() as Promise<CurrencyQuote>;
}

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

export async function refreshWalletBasicInfo(
  walletId: number,
): Promise<WalletBasicInfo> {
  const response = await fetch(
    `${API_BASE_URL}/wallet/infoBasica/${walletId}/atualizar`,
  );

  if (!response.ok) {
    throw new Error('Não foi possível atualizar as informações da carteira.');
  }

  return response.json() as Promise<WalletBasicInfo>;
}

export async function setAssetPriceScheduler(
  action: AssetPriceSchedulerAction,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/wallet/scheduler/asset-price/${action}`,
    { method: 'POST' },
  );

  if (!response.ok) {
    throw new Error('Não foi possível alterar a sincronização automática.');
  }
}

interface WalletDetailsResponse {
  assetPositions: Array<{
    assetType: string;
    ticker: string;
  }>;
}

export async function getWalletAssets(
  walletId: number,
  signal?: AbortSignal,
): Promise<WalletAsset[]> {
  const response = await fetch(`${API_BASE_URL}/wallet/${walletId}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar os ativos da carteira.');
  }

  const wallet = (await response.json()) as WalletDetailsResponse;

  return wallet.assetPositions.map(position => ({
    tipo: position.assetType,
    ticker: position.ticker,
  }));
}

export async function importWalletTransactions(
  walletId: number,
  file: File,
): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/wallet/${walletId}/import`, {
    body: formData,
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Não foi possível importar o arquivo.');
  }

  return response.json() as Promise<ImportResponse>;
}

export async function createWallet(name: string): Promise<WalletResponse> {
  const response = await fetch(`${API_BASE_URL}/wallet`, {
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Não foi possível criar a carteira.');
  }

  return response.json() as Promise<WalletResponse>;
}

export async function getWallets(): Promise<WalletResponse[]> {
  const response = await fetch(`${API_BASE_URL}/wallet/all`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar as carteiras.');
  }

  return response.json() as Promise<WalletResponse[]>;
}
