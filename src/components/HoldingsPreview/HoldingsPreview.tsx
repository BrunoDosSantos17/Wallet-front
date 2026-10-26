import { useState } from 'react';
import type { Allocation, AssetClass } from '../../types/portfolio';
import { formatCurrency } from '../../utils/formatters';
import './HoldingsPreview.css';

interface HoldingsPreviewProps {
  allocations: Allocation[];
  selectedClass: AssetClass | null;
  onSelect: (assetClass: AssetClass) => void;
}

export function HoldingsPreview({
  allocations,
  selectedClass,
  onSelect,
}: HoldingsPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedAllocations = isExpanded
    ? allocations
    : allocations.slice(0, 2);

  return (
    <section className="holdings-preview card">
      <header>
        <h2>Por classe de ativo</h2>
        <button type="button">
          Ver análise completa <span aria-hidden="true">→</span>
        </button>
      </header>
      <div className="holdings-preview__table">
        {displayedAllocations.map(item => (
          <button
            className={
              selectedClass === item.id ? 'holdings-preview__row--selected' : ''
            }
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <i style={{ background: item.color }} />
            <strong>{item.name}</strong>
            <span>{item.assetCount} ativos</span>
            <span>{formatCurrency(item.amount)}</span>
            <b>{item.percentage}%</b>
          </button>
        ))}
      </div>
      <button
        aria-expanded={isExpanded}
        className="holdings-preview__toggle"
        onClick={() => setIsExpanded(expanded => !expanded)}
        type="button"
      >
        {isExpanded ? 'Mostrar menos ativos' : 'Mostrar todos os ativos'}
        <span aria-hidden="true">{isExpanded ? '⌃' : '⌄'}</span>
      </button>
    </section>
  );
}
