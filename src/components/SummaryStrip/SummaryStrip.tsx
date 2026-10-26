import type { WalletBasicInfo } from '../../types/portfolio';
import { formatCurrency } from '../../utils/formatters';
import './SummaryStrip.css';

interface SummaryStripProps {
  walletInfo: WalletBasicInfo;
}

export function SummaryStrip({ walletInfo }: SummaryStripProps) {
  const metrics = [
    {
      label: 'Patrimônio total',
      value: formatCurrency(walletInfo.patrimonioTotal),
      detail: 'Saldo consolidado',
      tone: 'positive',
    },
    {
      label: 'Renda mensal estimada',
      value: formatCurrency(walletInfo.rendaMensalEst),
      detail: 'Estimativa mensal',
      tone: 'warning',
    },
    {
      label: 'Ativos na carteira',
      value: String(walletInfo.ativosCarteira),
      detail: `${walletInfo.distribuicao.length} classes de ativos`,
      tone: 'info',
    },
  ];

  return (
    <section className="summary-strip" aria-label="Resumo da carteira">
      {metrics.map(metric => (
        <article className="summary-strip__metric" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small
            className={`summary-strip__detail summary-strip__detail--${metric.tone}`}
          >
            {metric.detail}
          </small>
        </article>
      ))}
    </section>
  );
}
