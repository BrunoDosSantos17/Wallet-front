import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getWalletAssets,
  getWalletBasicInfo,
  getWallets,
  refreshWalletBasicInfo,
} from './wallet';

afterEach(() => vi.unstubAllGlobals());

describe('API — leituras canceláveis', () => {
  it('encaminha AbortSignal na lista, resumo, ativos e atualização', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValue({
        ok: true,
        json: async () => ({ assetPositions: [] }),
      });
    vi.stubGlobal('fetch', fetchMock);
    const { signal } = new AbortController();
    await getWallets(signal);
    await getWalletBasicInfo(7, signal);
    await getWalletAssets(7, signal);
    await refreshWalletBasicInfo(7, signal);
    expect(fetchMock.mock.calls).toEqual([
      ['/api/wallet', { signal }],
      ['/api/wallet/infoBasica/7', { signal }],
      ['/api/wallet/7', { signal }],
      ['/api/wallet/infoBasica/7/atualizar', { signal }],
    ]);
  });

  it('carrega IDs reais em /wallet em vez da lista de nomes de /wallet/all', async () => {
    const wallets = [
      { id: 7, name: 'Wallet', assetPositions: [] },
      { id: 12, name: 'Wallet1', assetPositions: [] },
    ];
    const fetchMock = vi.fn().mockImplementation(async (url: string) => ({
      ok: true,
      json: async () =>
        url === '/api/wallet/all' ? ['Wallet', 'Wallet1'] : wallets,
    }));
    vi.stubGlobal('fetch', fetchMock);

    expect(await getWallets()).toEqual(wallets);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/wallet', {
      signal: undefined,
    });
  });

  it('normaliza tipo nulo para a classe OUTROS usada pelo resumo backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          assetPositions: [{ assetType: null, ticker: 'ATIVO' }],
        }),
      }),
    );
    expect(await getWalletAssets(7)).toEqual([
      { tipo: 'OUTROS', ticker: 'ATIVO' },
    ]);
  });
});
