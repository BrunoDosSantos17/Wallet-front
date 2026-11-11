import { demonstrationNotice, equitiesOverview } from '../../data/dashboard';
import { formatCurrency } from '../../utils/formatters';
import './Equities.css';

interface EquitiesProps {
  onBack: () => void;
  title: string;
}

export function Equities({ onBack, title }: EquitiesProps) {
  return (
    <section className="equities" aria-labelledby="equities-title">
      <button className="equities__back" onClick={onBack} type="button">
        <span aria-hidden="true">←</span> Voltar para carteira
      </button>

      <header className="equities__heading">
        <h1 id="equities-title">{title}</h1>
        <p>Exemplos ilustrativos de posições de renda variável.</p>
      </header>
      <p className="data-notice" role="note">
        {demonstrationNotice}
      </p>

      <section className="equities__summary" aria-label="Resumo das ações">
        <article>
          <span>VALOR TOTAL EM AÇÕES · DEMONSTRAÇÃO</span>
          <strong>{formatCurrency(equitiesOverview.totalAmount)}</strong>
        </article>
        <article>
          <span>ATIVOS</span>
          <strong>{equitiesOverview.positions.length} ações</strong>
        </article>
      </section>

      <section
        className="equities__table card"
        aria-labelledby="equities-table-title"
      >
        <h2 id="equities-table-title">Ativos da carteira</h2>
        <div className="equities__table-header" aria-hidden="true">
          <span>TICKER</span>
          <span>NOME DA AÇÃO</span>
          <span>VALOR UNITÁRIO</span>
          <span>VALOR TOTAL</span>
        </div>
        <div className="equities__rows">
          {equitiesOverview.positions.map(position => (
            <article className="equities__row" key={position.ticker}>
              <strong>{position.ticker}</strong>
              <span>{position.name}</span>
              <small>{formatCurrency(position.unitPrice)}</small>
              <b>{formatCurrency(position.totalAmount)}</b>
            </article>
          ))}
        </div>
        <button
          className="equities__more"
          type="button"
          disabled
          title="Lista de demonstração; posições reais dependem da integração"
        >
          Mostrar mais ações
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </section>
    </section>
  );
}
