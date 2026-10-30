import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { importWalletTransactions } from '../../api/wallet';
import { ImportTransactions } from './ImportTransactions';

vi.mock('../../api/wallet', () => ({
  importWalletTransactions: vi.fn(),
}));

const result = { totalRows: 1, successCount: 1, errorCount: 0, errors: [] };

function selectFile(container: HTMLElement) {
  const file = new File(['planilha'], 'operacoes.xlsx');
  fireEvent.change(container.querySelector('input[type="file"]')!, {
    target: { files: [file] },
  });
  return file;
}

describe('ImportTransactions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(importWalletTransactions).mockResolvedValue(result);
  });

  it('mostra o destino e envia para uma carteira diferente de 1', async () => {
    const onComplete = vi.fn();
    const { container } = render(
      <ImportTransactions walletId={7} walletName="Reserva" onComplete={onComplete} />,
    );

    expect(screen.getByText('Reserva')).toBeTruthy();
    expect(screen.getByText(/ID 7/)).toBeTruthy();
    const file = selectFile(container);
    fireEvent.click(screen.getByRole('button', { name: 'Importar movimentações' }));

    await waitFor(() => expect(importWalletTransactions).toHaveBeenCalledWith(7, file));
    expect(await screen.findByText('Importação concluída')).toBeTruthy();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('reinicia o formulário ao mudar a chave da carteira e usa o novo destino', async () => {
    const onComplete = vi.fn();
    const { container, rerender } = render(
      <ImportTransactions key={7} walletId={7} walletName="Reserva" onComplete={onComplete} />,
    );
    selectFile(container);

    // Mesmo ciclo de montagem usado pelo App ao trocar a carteira selecionada.
    rerender(
      <ImportTransactions key={12} walletId={12} walletName="Viagem" onComplete={onComplete} />,
    );
    expect(screen.queryByText('operacoes.xlsx')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Importar movimentações' })).toBeNull();
    expect(screen.getByText('Viagem')).toBeTruthy();

    const file = selectFile(container);
    fireEvent.click(screen.getByRole('button', { name: 'Importar movimentações' }));
    await waitFor(() => expect(importWalletTransactions).toHaveBeenCalledWith(12, file));
  });

  it('exibe falha sem anunciar conclusão', async () => {
    vi.mocked(importWalletTransactions).mockRejectedValue(new Error('Falha'));
    const onComplete = vi.fn();
    const { container } = render(
      <ImportTransactions walletId={7} walletName="Reserva" onComplete={onComplete} />,
    );
    selectFile(container);
    fireEvent.click(screen.getByRole('button', { name: 'Importar movimentações' }));

    expect(await screen.findByText(/Não foi possível importar o arquivo/)).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('não oferece envio nem chama a API sem arquivo', () => {
    render(<ImportTransactions walletId={7} walletName="Reserva" onComplete={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Importar movimentações' })).toBeNull();
    expect(importWalletTransactions).not.toHaveBeenCalled();
  });
});
