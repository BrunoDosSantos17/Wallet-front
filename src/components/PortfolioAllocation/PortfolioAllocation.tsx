import type { Allocation, AssetClass } from '../../types/portfolio';
import { formatCurrency } from '../../utils/formatters';
import './PortfolioAllocation.css';

interface PortfolioAllocationProps {
  allocations: Allocation[];
  selectedClass: AssetClass | null;
  onSelect: (assetClass: AssetClass) => void;
  totalAmount: number;
}

export function PortfolioAllocation({
  allocations,
  selectedClass,
  onSelect,
  totalAmount,
}: PortfolioAllocationProps) {
  const gradient = `conic-gradient(${allocations
    .map((item, index) => {
      const before = allocations
        .slice(0, index)
        .reduce((sum, allocation) => sum + allocation.percentage, 0);
      return `${item.color} ${before}% ${before + item.percentage}%`;
    })
    .join(', ')})`;
  return (
    <section className="allocation card">
      <div>
        <h2>Distribuição da carteira</h2>
        <p>Clique em uma classe para ver os ativos que a compõem</p>
      </div>
      <div className="allocation__content">
        <div className="allocation__chart" style={{ background: gradient }}>
          <div>
            <strong>{formatCurrency(totalAmount)}</strong>
            <span>investidos</span>
          </div>
        </div>
        <div className="allocation__legend">
          {allocations.map(item => (
            <button
              className={`allocation__item ${selectedClass === item.id ? 'allocation__item--selected' : ''}`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <i style={{ background: item.color }} />
              <span>
                <strong>{item.name}</strong>
                <small>{formatCurrency(item.amount)}</small>
              </span>
              <b>{item.percentage}%</b>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
