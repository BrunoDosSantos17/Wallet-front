import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OperationDetails } from '../../types/transactions';
import { loadOperationDetails } from './loadOperationDetails';
import { Transactions } from './Transactions';

vi.mock('./loadOperationDetails', () => ({ loadOperationDetails: vi.fn() }));

const purchase: OperationDetails = {
  id: 'demo-petr4',
  type: 'BUY',
  ticker: 'PETR4',
  date: '2024-05-18',
  quantity: 100,
  amount: 3875,
  institution: 'XP Investimentos',
};

function openOperation(ticker = 'PETR4') {
  fireEvent.click(
    screen.getByRole('button', { name: `Ações da operação ${ticker}` }),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Visualizar operação' }));
}

describe('Movimentações — prévia do design', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(loadOperationDetails).mockResolvedValue(purchase);
  });

  it('identifica demonstração e não monta nem carrega detalhes ao abrir a tela ou o menu', () => {
    render(<Transactions onBack={vi.fn()} />);
    expect(screen.getByText('Prévia de demonstração.')).toBeTruthy();
    expect(screen.getByRole('table').querySelectorAll('tbody tr')).toHaveLength(
      6,
    );
    expect(
      screen.queryByRole('region', { name: 'Visualizar operação' }),
    ).toBeNull();
    expect(screen.queryByText('XP Investimentos')).toBeNull();
    expect(loadOperationDetails).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole('button', { name: 'Ações da operação PETR4' }),
    );
    expect(
      screen.getByRole('button', { name: 'Visualizar operação' }),
    ).toBeTruthy();
    expect(loadOperationDetails).not.toHaveBeenCalled();
    expect(screen.queryByText('Instituição de compra')).toBeNull();
  });

  it('carrega apenas após Visualizar operação e remove os detalhes ao fechar', async () => {
    render(<Transactions onBack={vi.fn()} />);
    openOperation();
    expect(await screen.findByText('XP Investimentos')).toBeTruthy();
    expect(loadOperationDetails).toHaveBeenCalledExactlyOnceWith('demo-petr4');
    const details = screen.getByRole('region', { name: 'Visualizar operação' });
    expect(within(details).getByText('18 de maio de 2024')).toBeTruthy();
    fireEvent.click(within(details).getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('XP Investimentos')).toBeNull();
    expect(
      screen.queryByRole('region', { name: 'Visualizar operação' }),
    ).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Ações da operação PETR4' }),
    );
  });

  it('seleciona outra operação sem reutilizar os detalhes da anterior', async () => {
    render(<Transactions onBack={vi.fn()} />);
    openOperation();
    await screen.findByText('XP Investimentos');
    vi.mocked(loadOperationDetails).mockResolvedValue({
      ...purchase,
      id: 'demo-vale3',
      ticker: 'VALE3',
      type: 'SELL',
      institution: null,
    });
    openOperation('VALE3');
    expect(screen.queryByText('XP Investimentos')).toBeNull();
    expect(await screen.findByText('Instituição de venda')).toBeTruthy();
    expect(screen.getByText('Não informada')).toBeTruthy();
    expect(loadOperationDetails).toHaveBeenLastCalledWith('demo-vale3');
  });

  it('fechar durante carregamento ignora o resultado tardio', async () => {
    let resolve!: (result: OperationDetails) => void;
    vi.mocked(loadOperationDetails).mockReturnValue(
      new Promise(yes => {
        resolve = yes;
      }),
    );
    render(<Transactions onBack={vi.fn()} />);
    openOperation();
    await screen.findByText('Carregando detalhes da operação...');
    fireEvent.click(
      screen.getByRole('button', { name: 'Fechar detalhes da operação' }),
    );
    await act(async () => resolve(purchase));
    expect(screen.queryByText('XP Investimentos')).toBeNull();
    expect(
      screen.queryByRole('region', { name: 'Visualizar operação' }),
    ).toBeNull();
  });

  it('mostra erro e permite tentar novamente sem carregamento infinito', async () => {
    vi.mocked(loadOperationDetails).mockRejectedValueOnce(new Error('falha'));
    render(<Transactions onBack={vi.fn()} />);
    openOperation();
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.queryByText('Carregando detalhes da operação...')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByText('XP Investimentos')).toBeTruthy();
    expect(loadOperationDetails).toHaveBeenCalledTimes(2);
  });

  it('Escape fecha menu e painel e restaura foco no botão da linha', async () => {
    render(<Transactions onBack={vi.fn()} />);
    const actions = screen.getByRole('button', {
      name: 'Ações da operação PETR4',
    });
    fireEvent.click(actions);
    fireEvent.keyDown(
      screen.getByRole('button', { name: 'Visualizar operação' }),
      { key: 'Escape' },
    );
    expect(
      screen.queryByRole('button', { name: 'Visualizar operação' }),
    ).toBeNull();
    expect(document.activeElement).toBe(actions);
    openOperation();
    await screen.findByText('XP Investimentos');
    fireEvent.keyDown(
      screen.getByRole('heading', { name: 'Visualizar operação' }),
      { key: 'Escape' },
    );
    expect(screen.queryByText('XP Investimentos')).toBeNull();
    expect(document.activeElement).toBe(actions);
  });

  it('volta para carteira e não oferece escrita financeira fictícia', async () => {
    const onBack = vi.fn();
    render(<Transactions onBack={onBack} />);
    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para carteira/ }),
    );
    expect(onBack).toHaveBeenCalledOnce();
    expect(
      (
        screen.getByRole('button', {
          name: /Adicionar movimentação/,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    openOperation();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Excluir operação' }),
      ).toBeTruthy(),
    );
    expect(
      (
        screen.getByRole('button', {
          name: 'Excluir operação',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
