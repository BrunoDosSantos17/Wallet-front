import { StrictMode } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from './api/wallet';
import type { WalletBasicInfo } from './types/portfolio';
import App from './App';

vi.mock('./api/wallet', () => ({
  getWallets: vi.fn(),
  getWalletBasicInfo: vi.fn(),
  getWalletAssets: vi.fn(),
  refreshWalletBasicInfo: vi.fn(),
  setAssetPriceScheduler: vi.fn(),
  createWallet: vi.fn(),
  importWalletTransactions: vi.fn(),
}));

const wallets = [
  { id: 7, name: 'Reserva' },
  { id: 12, name: 'Viagem' },
];
function summary(value = 700): WalletBasicInfo {
  return {
    patrimonioTotal: value,
    rendaMensalEst: 0,
    ativosCarteira: 0,
    distribuicao: [],
  };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function switchToTravel() {
  fireEvent.click(screen.getByRole('button', { name: /⇄\s*Reserva/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Viagem' }));
}
function displayedTotal() {
  return within(
    screen.getByRole('region', { name: 'Resumo da carteira' }),
  ).getAllByText(/R\$/)[0].textContent;
}

describe('I4 — seleção e carregamento', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(api.getWallets).mockResolvedValue(wallets);
    vi.mocked(api.getWalletBasicInfo).mockResolvedValue(summary());
    vi.mocked(api.getWalletAssets).mockResolvedValue([]);
    vi.mocked(api.refreshWalletBasicInfo).mockResolvedValue(summary(900));
  });
  afterEach(() => vi.useRealTimers());

  it('aguarda a lista e seleciona uma carteira disponível sem exigir ID 1', async () => {
    const list = deferred<typeof wallets>();
    vi.mocked(api.getWallets).mockReturnValue(list.promise);
    render(<App />);
    expect(screen.getByText('Carregando carteiras...')).toBeTruthy();
    expect(api.getWalletBasicInfo).not.toHaveBeenCalled();
    await act(async () => list.resolve(wallets));
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    expect(api.getWalletBasicInfo).toHaveBeenCalledWith(
      7,
      expect.any(AbortSignal),
    );
    expect(displayedTotal()).toContain('700,00');
  });

  it('lista vazia é válida, impede importação sem destino e permite criar a primeira carteira', async () => {
    vi.mocked(api.getWallets).mockResolvedValue([]);
    vi.mocked(api.createWallet).mockResolvedValue(wallets[0]);
    render(<App />);
    await screen.findByText(/Nenhuma carteira cadastrada. Crie/);
    fireEvent.click(
      screen.getByRole('button', { name: /Importação: importar/ }),
    );
    expect(screen.queryByText('Destino da importação')).toBeNull();
    expect(api.getWalletBasicInfo).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole('button', { name: /⇄\s*Nenhuma carteira/ }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Nova carteira/ }));
    fireEvent.change(screen.getByLabelText('NOME DA CARTEIRA'), {
      target: { value: 'Reserva' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Criar carteira' }));
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    expect(api.createWallet).toHaveBeenCalledWith('Reserva');
    expect(api.getWalletBasicInfo).toHaveBeenCalledWith(
      7,
      expect.any(AbortSignal),
    );
  });

  it('mostra falha da lista mesmo com menu fechado e permite tentar novamente', async () => {
    vi.mocked(api.getWallets).mockRejectedValueOnce(new Error('rede'));
    render(<App />);
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(api.getWalletBasicInfo).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    expect(api.getWallets).toHaveBeenCalledTimes(2);
  });

  it('ignora resposta e erro antigos após troca rápida, mesmo se a API ignorar abort', async () => {
    const oldSummary = deferred<WalletBasicInfo>();
    const oldAssets = deferred<[]>();
    vi.mocked(api.getWalletBasicInfo).mockImplementation(id =>
      id === 7 ? oldSummary.promise : Promise.resolve(summary(1200)),
    );
    vi.mocked(api.getWalletAssets).mockImplementation(id =>
      id === 7 ? oldAssets.promise : Promise.resolve([]),
    );
    render(<App />);
    await waitFor(() => expect(api.getWalletBasicInfo).toHaveBeenCalledOnce());
    const oldSignal = vi.mocked(api.getWalletBasicInfo).mock.calls[0][1];
    switchToTravel();
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    expect(oldSignal?.aborted).toBe(true);
    await act(async () => {
      oldSummary.resolve(summary(700));
      oldAssets.reject(new Error('falha antiga'));
    });
    expect(displayedTotal()).toContain('1.200,00');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('não exibe dados da carteira anterior enquanto a nova carrega', async () => {
    const travel = deferred<WalletBasicInfo>();
    vi.mocked(api.getWalletBasicInfo).mockImplementation(id =>
      id === 7 ? Promise.resolve(summary()) : travel.promise,
    );
    render(<App />);
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    switchToTravel();
    expect(
      screen.queryByRole('region', { name: 'Resumo da carteira' }),
    ).toBeNull();
    await act(async () => travel.resolve(summary(1200)));
    await screen.findByRole('region', { name: 'Resumo da carteira' });
  });

  it('falha auxiliar não descarta o resumo e sua recuperação remove o alerta', async () => {
    vi.mocked(api.getWalletAssets).mockRejectedValueOnce(new Error('ativos'));
    render(<App />);
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    expect(displayedTotal()).toContain('700,00');
    expect(screen.getByRole('alert').textContent).toContain(
      'contagem por classe',
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Sincronizar dados da carteira' }),
    );
    await waitFor(() => expect(displayedTotal()).toContain('900,00'));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('mantém dados anteriores da mesma carteira e mostra erro de atualização', async () => {
    vi.mocked(api.refreshWalletBasicInfo).mockRejectedValue(new Error('rede'));
    render(<App />);
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    fireEvent.click(
      screen.getByRole('button', { name: 'Sincronizar dados da carteira' }),
    );
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(displayedTotal()).toContain('700,00');
    expect(
      (
        screen.getByRole('button', {
          name: 'Sincronizar dados da carteira',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
  });

  it('mostra erro inicial sem ficar carregando indefinidamente', async () => {
    vi.mocked(api.getWalletBasicInfo).mockRejectedValue(new Error('rede'));
    render(<App />);
    expect((await screen.findByRole('alert')).textContent).toContain(
      'dados da carteira',
    );
    expect(
      screen.queryByRole('region', { name: 'Resumo da carteira' }),
    ).toBeNull();
    expect(
      (
        screen.getByRole('button', {
          name: 'Sincronizar dados da carteira',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
  });

  it('polling sobreposto não substitui uma resposta mais recente', async () => {
    vi.useFakeTimers();
    const slow = deferred<WalletBasicInfo>();
    vi.mocked(api.getWalletBasicInfo)
      .mockResolvedValueOnce(summary())
      .mockReturnValueOnce(slow.promise)
      .mockResolvedValueOnce(summary(1200));
    render(<App />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300_000);
    });
    expect(displayedTotal()).toContain('700,00');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300_000);
    });
    expect(displayedTotal()).toContain('1.200,00');
    await act(async () => slow.resolve(summary(300)));
    expect(displayedTotal()).toContain('1.200,00');
  });

  it('preserva C1: trocar carteira reinicia importação e envia ao novo destino', async () => {
    vi.mocked(api.importWalletTransactions).mockResolvedValue({
      totalRows: 1,
      successCount: 1,
      errorCount: 0,
      errors: [],
    });
    const { container } = render(<App />);
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    fireEvent.click(
      screen.getByRole('button', { name: /Importação: importar/ }),
    );
    const file = new File(['planilha'], 'operacoes.xlsx');
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    });
    switchToTravel();
    fireEvent.click(
      screen.getByRole('button', { name: /Importação: importar/ }),
    );
    expect(screen.queryByText('operacoes.xlsx')).toBeNull();
    expect(screen.getByText(/ID 12/)).toBeTruthy();
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Importar movimentações' }),
    );
    await waitFor(() =>
      expect(api.importWalletTransactions).toHaveBeenCalledWith(12, file),
    );
  });

  it('conclusão tardia da importação anterior não inicia carga para o destino antigo', async () => {
    const importing = deferred<{
      totalRows: number;
      successCount: number;
      errorCount: number;
      errors: [];
    }>();
    vi.mocked(api.importWalletTransactions).mockReturnValue(importing.promise);
    const { container } = render(<App />);
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    fireEvent.click(
      screen.getByRole('button', { name: /Importação: importar/ }),
    );
    const file = new File(['planilha'], 'operacoes.xlsx');
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Importar movimentações' }),
    );
    await waitFor(() =>
      expect(api.importWalletTransactions).toHaveBeenCalledWith(7, file),
    );
    switchToTravel();
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    const callsBeforeCompletion = vi.mocked(api.getWalletBasicInfo).mock.calls
      .length;
    await act(async () =>
      importing.resolve({
        totalRows: 1,
        successCount: 1,
        errorCount: 0,
        errors: [],
      }),
    );
    expect(api.getWalletBasicInfo).toHaveBeenCalledTimes(callsBeforeCompletion);
    expect(vi.mocked(api.getWalletBasicInfo).mock.calls.at(-1)?.[0]).toBe(12);
  });

  it('limpa requisições ao desmontar e funciona em StrictMode', async () => {
    const { unmount } = render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    await screen.findByRole('region', { name: 'Resumo da carteira' });
    const calls = vi.mocked(api.getWalletBasicInfo).mock.calls;
    unmount();
    expect(calls[calls.length - 1][1]?.aborted).toBe(true);
  });
});
