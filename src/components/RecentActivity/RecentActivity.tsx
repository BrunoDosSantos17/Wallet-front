import { recentTransactions } from '../../data/dashboard';
import { formatCurrency } from '../../utils/formatters';
import './RecentActivity.css';

export function RecentActivity() {
  return (
    <section className="recent-activity card">
      <h2>Movimentações recentes</h2>
      <div className="recent-activity__list">
        {recentTransactions.map(transaction => (
          <article className="transaction" key={transaction.id}>
            <div>
              <time>{transaction.date}</time>
              <span>{transaction.description}</span>
            </div>
            <strong
              className={transaction.amount > 0 ? 'transaction--positive' : ''}
            >
              {transaction.amount > 0 ? '+ ' : '− '}
              {formatCurrency(Math.abs(transaction.amount))}
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}
