import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { WalletBasicInfo } from '../../types/portfolio';
import { SummaryStrip } from './SummaryStrip';

const empty: WalletBasicInfo = {
  patrimonioTotal: 0,
  rendaMensalEst: 0,
  ativosCarteira: 0,
  distribuicao: [],
  avisos: [],
};
function metric(label: string) {
  return within(screen.getByText(label).closest('article')!);
}

describe('C8 — resumo financeiro', () => {
  it('preserva zero legítimo em carteira vazia sem inventar posições ou renda', () => {
    render(<SummaryStrip walletInfo={empty} />);
    expect(metric('Patrimônio total').getByText(/R\$\s*0,00/)).toBeTruthy();
    expect(
      metric('Proventos estimados do mês').getByText(/R\$\s*0,00/),
    ).toBeTruthy();
    expect(screen.getByText(/Nenhuma posição positiva/)).toBeTruthy();
    expect(screen.getByText(/0 classes de ativos/)).toBeTruthy();
  });

  it('renda e patrimônio desconhecidos não viram zero monetário', () => {
    render(
      <SummaryStrip
        walletInfo={{ ...empty, patrimonioTotal: null, rendaMensalEst: null }}
      />,
    );
    expect(metric('Patrimônio total').getByText('Indisponível')).toBeTruthy();
    expect(
      metric('Proventos estimados do mês').getByText('Indisponível'),
    ).toBeTruthy();
    expect(screen.queryByText(/R\$/)).toBeNull();
  });

  it('não apresenta valores inválidos como dinheiro', () => {
    render(
      <SummaryStrip
        walletInfo={{
          ...empty,
          patrimonioTotal: NaN,
          rendaMensalEst: Infinity,
        }}
      />,
    );
    expect(screen.getAllByText('Indisponível')).toHaveLength(2);
    expect(screen.queryByText(/NaN|Infinity/)).toBeNull();
  });

  it('preserva o valor da API sem adicionar mensagens informativas removidas', () => {
    render(<SummaryStrip walletInfo={{ ...empty, ativosCarteira: 2 }} />);
    expect(metric('Patrimônio total').getByText(/R\$\s*0,00/)).toBeTruthy();
    expect(screen.queryByText(/Cotações ausentes/)).toBeNull();
    expect(screen.queryByText('Saldo consolidado')).toBeNull();
    expect(screen.queryByText(/Nenhuma posição positiva/)).toBeNull();
  });

  it('trata falha de conversão como valor parcial, não ausência de proventos em USD', () => {
    render(
      <SummaryStrip
        walletInfo={{
          ...empty,
          rendaMensalEst: 150,
          avisos: ['ConversaoMoedaIndisponivel'],
        }}
      />,
    );
    expect(
      metric('Proventos estimados do mês').getByText(/R\$\s*150,00/),
    ).toBeTruthy();
    expect(
      screen.getByText('Valor parcial; conversão de USD indisponível'),
    ).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain(
      'não significa ausência de proventos em USD',
    );
  });

  it('não renderiza os textos removidos nem uma área vazia de avisos', () => {
    const { container } = render(
      <SummaryStrip
        walletInfo={{ ...empty, ativosCarteira: 1, rendaMensalEst: 250 }}
      />,
    );
    expect(
      screen.queryByText('Estimativa bruta; não comprova crédito'),
    ).toBeNull();
    expect(
      screen.queryByText('Valor de mercado informado pela API'),
    ).toBeNull();
    expect(
      screen.queryByText(/Proventos calculados para o mês corrente/),
    ).toBeNull();
    expect(screen.queryByText(/Cobertura atual:/)).toBeNull();
    expect(screen.queryByText(/Cotações ausentes/)).toBeNull();
    expect(container.querySelector('.summary-strip__notices')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
