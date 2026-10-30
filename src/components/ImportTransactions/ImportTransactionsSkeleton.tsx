import './ImportTransactions.css';

function SkeletonLine({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`import-skeleton__line ${className}`} />
  );
}

export function ImportTransactionsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Importando movimentações"
      className="import-skeleton"
      role="status"
    >
      <div className="import-skeleton__heading">
        <SkeletonLine className="import-skeleton__line--eyebrow" />
        <SkeletonLine className="import-skeleton__line--title" />
        <SkeletonLine className="import-skeleton__line--subtitle" />
      </div>
      <div className="import-skeleton__dropzone">
        <span className="import-skeleton__circle" />
        <SkeletonLine className="import-skeleton__line--drop-title" />
        <SkeletonLine className="import-skeleton__line--drop-subtitle" />
        <SkeletonLine className="import-skeleton__line--button" />
      </div>
      <div className="import-skeleton__guidance">
        <span className="import-skeleton__small-circle" />
        <div>
          <SkeletonLine className="import-skeleton__line--guidance-title" />
          <SkeletonLine className="import-skeleton__line--guidance-copy" />
        </div>
      </div>
    </section>
  );
}
