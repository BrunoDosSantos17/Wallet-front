import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

const defaults = {
  activeItem: 'Visão geral',
  isExpanded: true,
  walletId: null,
  walletName: 'Nenhuma carteira selecionada',
  wallets: [],
  isLoadingWallets: false,
  walletsError: null,
  onWalletCreated: vi.fn(),
  onWalletSelected: vi.fn(),
  onRetryWallets: vi.fn(),
  onNavigate: vi.fn(),
  onToggle: vi.fn(),
};

describe('Sidebar — carteiras controladas pelo App', () => {
  it('mostra lista vazia e mantém criação acessível', () => {
    render(<Sidebar {...defaults} />);
    fireEvent.click(screen.getByRole('button', { name: /⇄\s*Nenhuma/ }));
    expect(screen.getByText('Nenhuma carteira cadastrada.')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Nova carteira/ })).toBeTruthy();
  });

  it('seleciona carteira sem confundir seleção com criação', () => {
    const onWalletSelected = vi.fn();
    const onWalletCreated = vi.fn();
    const wallet = { id: 12, name: 'Viagem' };
    render(
      <Sidebar
        {...defaults}
        wallets={[wallet]}
        onWalletCreated={onWalletCreated}
        onWalletSelected={onWalletSelected}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /⇄\s*Nenhuma/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Viagem' }));
    expect(onWalletSelected).toHaveBeenCalledWith(wallet);
    expect(onWalletCreated).not.toHaveBeenCalled();
  });

  it('abrir ou fechar o menu não esconde falha de carregamento', () => {
    const onRetryWallets = vi.fn();
    render(
      <Sidebar
        {...defaults}
        walletsError="Não foi possível carregar as carteiras."
        onRetryWallets={onRetryWallets}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /⇄\s*Nenhuma/ }));
    fireEvent.click(screen.getByRole('button', { name: /⇄\s*Nenhuma/ }));
    expect(screen.getByRole('alert').textContent).toContain(
      'carregar as carteiras',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetryWallets).toHaveBeenCalledOnce();
  });
});
