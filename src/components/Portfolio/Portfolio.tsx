import { portfolioOverview } from '../../data/dashboard';
import type { PortfolioAsset } from '../../types/portfolio';
import { formatCurrency } from '../../utils/formatters';
import './Portfolio.css';

interface PortfolioProps {
  onBack: () => void;
  onOpenAsset: (name: string) => void;
}

interface AssetRowProps {
  asset: PortfolioAsset;
  largestPercentage: number;
  onOpenAsset: (name: string) => void;
}

function AssetRow({ asset, largestPercentage, onOpenAsset }: AssetRowProps) {
  const content = (
    <>
      <span aria-label={asset.ticker} className="portfolio__badge">
        {asset.badgeLabel}
      </span>
      <div className="portfolio__asset-meta">
        <strong>{asset.name}</strong>
        <small>{asset.category}</small>
      </div>
      <div
        aria-label={`${asset.percentage}% de participação`}
        className="portfolio__progress"
        role="progressbar"
        aria-valuemax={largestPercentage}
        aria-valuemin={0}
        aria-valuenow={asset.percentage}
      >
        <i
          style={{
            backgroundColor: asset.color,
            width: `${(asset.percentage / largestPercentage) * 100}%`,
          }}
        />
      </div>
      <strong className="portfolio__amount">
        {formatCurrency(asset.amount)}
      </strong>
      <span className="portfolio__percentage">
        {asset.percentage.toLocaleString('pt-BR', {
          minimumFractionDigits: 1,
        })}
        %
      </span>
    </>
  );

  return (
    <button
      aria-label={`Abrir detalhes de ${asset.name}`}
      className="portfolio__asset portfolio__asset--interactive"
      onClick={() => onOpenAsset(asset.name)}
      type="button"
    >
      {content}
    </button>
  );
}

export function Portfolio({ onBack, onOpenAsset }: PortfolioProps) {
  const largestPercentage = Math.max(
    ...portfolioOverview.assets.map(asset => asset.percentage),
  );

  return (
    <section className="portfolio" aria-labelledby="portfolio-title">
      <button className="portfolio__back" onClick={onBack} type="button">
        <span aria-hidden="true">←</span> Voltar para visão geral
      </button>

      <header className="portfolio__heading">
        <h1 id="portfolio-title">Carteira</h1>
        <p>
          {portfolioOverview.assetClassCount} classes de ativos ·{' '}
          {formatCurrency(portfolioOverview.totalAmount)} investidos
        </p>
      </header>

      <section className="portfolio__summary" aria-label="Resumo da carteira">
        <article>
          <span>VALOR TOTAL DA CARTEIRA</span>
          <strong>{formatCurrency(portfolioOverview.totalAmount)}</strong>
          <small className="portfolio__positive">
            {portfolioOverview.annualChange}
          </small>
        </article>
        <article>
          <span>CLASSES DE ATIVOS</span>
          <strong>{portfolioOverview.assetClassCount}</strong>
          <small>{portfolioOverview.assetClassHint}</small>
        </article>
        <article>
          <span>DÓLAR</span>
          <strong>{formatCurrency(portfolioOverview.dollarQuote)}</strong>
          <small>Cotação comercial</small>
        </article>
      </section>

      <section
        className="portfolio__assets card"
        aria-labelledby="assets-title"
      >
        <header>
          <h2 id="assets-title">Ativos da carteira</h2>
          <span>
            Ordenar: participação <i aria-hidden="true">⌄</i>
          </span>
        </header>
        <p>Classificação dos ativos por categoria</p>
        <div className="portfolio__asset-list">
          {portfolioOverview.assets.map(asset => (
            <AssetRow
              asset={asset}
              key={asset.id}
              largestPercentage={largestPercentage}
              onOpenAsset={onOpenAsset}
            />
          ))}
          <article className="portfolio__asset portfolio__asset--total">
            <span className="portfolio__badge">TOTAL</span>
            <div className="portfolio__asset-meta">
              <strong>Valor total da carteira</strong>
              <small>Consolidação de todas as classes</small>
            </div>
            <div
              aria-label="100% de participação"
              className="portfolio__progress"
              role="progressbar"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={100}
            >
              <i />
            </div>
            <strong className="portfolio__amount">
              {formatCurrency(portfolioOverview.totalAmount)}
            </strong>
            <span className="portfolio__percentage">100,0%</span>
          </article>
        </div>
      </section>
    </section>
  );
}
