import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AlertCard, AlertProvider, AlertRegion } from './AlertCards';

afterEach(() => vi.useRealTimers());

describe('Alertas em cards', () => {
  it('permanece por 5 segundos e sai para a direita antes de ser removido', () => {
    vi.useFakeTimers();
    render(
      <AlertProvider>
        <AlertRegion />
        <AlertCard title="Aviso">Falha de rede</AlertCard>
      </AlertProvider>,
    );
    act(() => vi.advanceTimersByTime(4_999));
    expect(
      screen.getByRole('alert').classList.contains('alert-card--leaving'),
    ).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(
      screen.getByRole('alert').classList.contains('alert-card--leaving'),
    ).toBe(true);
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByLabelText('Alertas').childElementCount).toBe(0);
  });

  it('renderizações da página não reiniciam o prazo nem reexibem o mesmo alerta', () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <AlertCard title="Aviso">Falha de rede</AlertCard>,
    );
    act(() => vi.advanceTimersByTime(4_000));
    rerender(<AlertCard title="Aviso">Falha de rede</AlertCard>);
    act(() => vi.advanceTimersByTime(1_300));
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(<AlertCard title="Aviso">Falha de rede</AlertCard>);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('limpa os temporizadores ao desmontar', () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <AlertCard title="Aviso">Falha de rede</AlertCard>,
    );
    expect(vi.getTimerCount()).toBe(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('centraliza mensagens na região direita sem inseri-las no cabeçalho', () => {
    const { container } = render(
      <AlertProvider>
        <header>
          <button type="button">Sincronização</button>
        </header>
        <AlertRegion />
        <section aria-label="Conteúdo">
          <AlertCard title="Falha">Não foi possível atualizar.</AlertCard>
        </section>
      </AlertProvider>,
    );
    const region = screen.getByLabelText('Alertas');
    expect(within(region).getByRole('alert').textContent).toContain(
      'Não foi possível atualizar.',
    );
    expect(
      within(screen.getByRole('region', { name: 'Conteúdo' })).queryByRole(
        'alert',
      ),
    ).toBeNull();
    expect(container.querySelector('header')?.contains(region)).toBe(false);
    expect(
      container.querySelector('header')!.compareDocumentPosition(region) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sincronização' })).toBeTruthy();
  });

  it('empilha cards, preserva ações e remove alerta ao desmontar sua origem', () => {
    const retry = vi.fn();
    function Content({ showError }: { showError: boolean }) {
      return (
        <AlertProvider>
          <AlertRegion />
          {showError && (
            <AlertCard title="Erro">
              Falha de rede
              <button type="button" onClick={retry}>
                Tentar novamente
              </button>
            </AlertCard>
          )}
          <AlertCard title="Aviso" tone="warning">
            Conversão indisponível
          </AlertCard>
        </AlertProvider>
      );
    }
    const { rerender } = render(<Content showError />);
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(retry).toHaveBeenCalledOnce();
    rerender(<Content showError={false} />);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.queryByText('Falha de rede')).toBeNull();
  });

  it('continua acessível quando usado isoladamente sem provider', () => {
    render(
      <AlertCard title="Aviso" tone="warning">
        Cotação indisponível
      </AlertCard>,
    );
    expect(screen.getByRole('alert').textContent).toContain(
      'Cotação indisponível',
    );
  });
});
