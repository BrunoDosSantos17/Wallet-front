import './PageHeader.css';

interface PageHeaderProps {
  isDarkTheme: boolean;
  isRefreshing: boolean;
  isSynchronizationEnabled: boolean;
  isSynchronizationUpdating: boolean;
  onRefresh: () => void;
  onSynchronizationToggle: () => void;
  onThemeToggle: () => void;
}

export function PageHeader({
  isDarkTheme,
  isRefreshing,
  isSynchronizationEnabled,
  isSynchronizationUpdating,
  onRefresh,
  onSynchronizationToggle,
  onThemeToggle,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <span>QUARTA-FEIRA, 12 JUN 2024</span>
        <h1>Visão geral</h1>
        <p>Uma leitura simples de onde seu dinheiro está trabalhando.</p>
      </div>
      <div className="page-header__actions">
        <div className="synchronization-toggle">
          <button
            aria-label="Sincronizar dados da carteira"
            className="synchronization-toggle__icon"
            disabled={isRefreshing}
            onClick={onRefresh}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M20 11a8 8 0 1 0 2 5.5" />
              <path d="M20 4v7h-7" />
            </svg>
          </button>
          <span>Sincronização</span>
          <b>{isSynchronizationEnabled ? 'AUTO' : 'MANUAL'}</b>
          <button
            aria-checked={isSynchronizationEnabled}
            aria-label="Alternar sincronização automática de ações"
            className={`synchronization-toggle__switch ${
              isSynchronizationEnabled
                ? 'synchronization-toggle__switch--on'
                : ''
            }`}
            disabled={isSynchronizationUpdating}
            onClick={onSynchronizationToggle}
            role="switch"
            type="button"
          >
            <i aria-hidden="true" />
          </button>
        </div>
        <button
          aria-label={isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'}
          className="theme-toggle"
          onClick={onThemeToggle}
          type="button"
        >
          {isDarkTheme ? (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M20.4 14.5A8.5 8.5 0 1 1 9.5 3.6a6.7 6.7 0 0 0 10.9 10.9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
