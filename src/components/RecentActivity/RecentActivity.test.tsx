import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecentActivity } from './RecentActivity';

describe('C8 — atividade recente', () => {
  it('mostra indisponibilidade em vez de dividendos e aportes fictícios', () => {
    render(<RecentActivity />);
    expect(screen.getByRole('status').textContent).toContain(
      'Histórico indisponível',
    );
    expect(screen.queryByText(/Dividendo|Aporte|HGLG11|IVVB11|R\$/)).toBeNull();
  });
});
