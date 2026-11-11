import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Equities } from './Equities';

describe('C8 — posições demonstrativas', () => {
  it('identifica a origem fictícia independentemente da classe escolhida', () => {
    render(<Equities title="FII" onBack={vi.fn()} />);
    expect(screen.getByRole('note').textContent).toContain('Demonstração');
    expect(
      screen.getByText(/VALOR TOTAL EM AÇÕES · DEMONSTRAÇÃO/),
    ).toBeTruthy();
    expect(
      (
        screen.getByRole('button', {
          name: /Mostrar mais ações/,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
