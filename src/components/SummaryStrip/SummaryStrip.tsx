import { summaryMetrics } from '../../data/dashboard';
import './SummaryStrip.css';

export function SummaryStrip() {
  return (
    <section className="summary-strip" aria-label="Resumo da carteira">
      {summaryMetrics.map(metric => (
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
