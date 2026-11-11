import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrencyQuote } from '../../api/wallet';
import { Portfolio } from './Portfolio';

vi.mock('../../api/wallet', () => ({ getCurrencyQuote: vi.fn() }));
const props = { onBack: vi.fn(), onOpenAsset: vi.fn() };

describe('C8 — carteira demonstrativa', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getCurrencyQuote).mockResolvedValue({
      bid: 5.1,
      code: 'USD',
      codein: 'BRL',
      name: 'Dólar',
    });
  });

  it('identifica mocks e não apresenta rentabilidade fictícia como resultado', async () => {
    render(<Portfolio {...props} />);
    expect(screen.getByRole('note').textContent).toContain(
      'posições fictícios, sem vínculo',
    );
    expect(screen.getByText('Rentabilidade indisponível')).toBeTruthy();
    expect(screen.queryByText(/12,6%/)).toBeNull();
    expect(await screen.findByText(/R\$\s*5,10/)).toBeTruthy();
    expect(
      screen.getByText(
        /Cotação consultada na API; não compõe os valores fictícios/,
      ),
    ).toBeTruthy();
  });

  it('falha de cotação não deixa carregamento infinito nem usa preço mockado', async () => {
    vi.mocked(getCurrencyQuote).mockRejectedValue(new Error('rede'));
    render(<Portfolio {...props} />);
    expect(await screen.findByText('Indisponível')).toBeTruthy();
    expect(screen.queryByText('Carregando...')).toBeNull();
    expect(screen.queryByText(/R\$\s*5,42/)).toBeNull();
  });

  it('cotação inválida não é apresentada como preço confiável', async () => {
    vi.mocked(getCurrencyQuote).mockResolvedValue({
      bid: NaN,
      code: 'USD',
      codein: 'BRL',
      name: 'Dólar',
    });
    render(<Portfolio {...props} />);
    await waitFor(() => expect(screen.getByText('Indisponível')).toBeTruthy());
  });
});
