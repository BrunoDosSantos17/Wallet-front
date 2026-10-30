import './DashboardSkeleton.css';

function SkeletonLine({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`skeleton-line ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Carregando informações da carteira"
      className="dashboard-skeleton"
      role="status"
    >
      <div className="dashboard-skeleton__summary">
        {[0, 1, 2].map(item => (
          <div key={item}>
            <SkeletonLine className="skeleton-line--label" />
            <SkeletonLine className="skeleton-line--value" />
            <SkeletonLine className="skeleton-line--detail" />
          </div>
        ))}
      </div>

      <div className="dashboard-skeleton__top">
        <section className="dashboard-skeleton__card dashboard-skeleton__allocation">
          <SkeletonLine className="skeleton-line--title" />
          <SkeletonLine className="skeleton-line--subtitle" />
          <div className="dashboard-skeleton__allocation-content">
            <span className="dashboard-skeleton__chart" />
            <div className="dashboard-skeleton__legend">
              {[0, 1, 2].map(item => (
                <SkeletonLine className="skeleton-line--row" key={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-skeleton__card dashboard-skeleton__activity">
          <SkeletonLine className="skeleton-line--title" />
          <div className="dashboard-skeleton__activity-list">
            {[0, 1, 2, 3].map(item => (
              <SkeletonLine className="skeleton-line--activity" key={item} />
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-skeleton__card dashboard-skeleton__holdings">
        <SkeletonLine className="skeleton-line--title" />
        {[0, 1, 2].map(item => (
          <SkeletonLine className="skeleton-line--holding" key={item} />
        ))}
      </section>
    </section>
  );
}
