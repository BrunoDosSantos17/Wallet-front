import type { WalletBasicInfo } from '../../types/portfolio';
import { formatCurrency } from '../../utils/formatters';
import './SummaryStrip.css';
import { AlertCard } from '../AlertCards/AlertCards';

interface SummaryStripProps {
  walletInfo: WalletBasicInfo;
}

export function SummaryStrip({ walletInfo }: SummaryStripProps) {
  const hasPatrimony =
    typeof walletInfo.patrimonioTotal === 'number' &&
    Number.isFinite(walletInfo.patrimonioTotal);
  const hasIncome =
    typeof walletInfo.rendaMensalEst === 'number' &&
    Number.isFinite(walletInfo.rendaMensalEst);
  const conversionUnavailable = walletInfo.avisos?.includes(
    'ConversaoMoedaIndisponivel',
  );
  const metrics = [
    {
      label: 'Patrimônio total',
      value: hasPatrimony
        ? formatCurrency(walletInfo.patrimonioTotal!)
        : 'Indisponível',
      detail: hasPatrimony ? null : 'Sem valor de mercado informado',
      tone: 'info',
    },
    {
      label: 'Proventos estimados do mês',
      value: hasIncome
        ? formatCurrency(walletInfo.rendaMensalEst!)
        : 'Indisponível',
      detail: !hasIncome
        ? 'Sem estimativa informada'
        : conversionUnavailable
          ? 'Valor parcial; conversão de USD indisponível'
          : null,
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
          {metric.detail && (
            <small
              className={`summary-strip__detail summary-strip__detail--${metric.tone}`}
            >
              {metric.detail}
            </small>
          )}
        </article>
      ))}
      {conversionUnavailable && (
        <AlertCard title="Conversão de moeda indisponível" tone="warning">
          Conversão de USD para BRL indisponível. A parcela em dólar não foi
          incluída no valor exibido; isso não significa ausência de proventos em
          USD.
        </AlertCard>
      )}
      {walletInfo.ativosCarteira === 0 && (
        <div className="summary-strip__notices">
          {walletInfo.ativosCarteira === 0 && (
            <p role="status">
              Nenhuma posição positiva na carteira. Isso não informa se há
              histórico de operações ou proventos.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
