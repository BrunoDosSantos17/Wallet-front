import './PageHeader.css';

interface PageHeaderProps {
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

export function PageHeader({ isDarkTheme, onThemeToggle }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <span>QUARTA-FEIRA, 12 JUN 2024</span>
        <h1>Visão geral</h1>
        <p>Uma leitura simples de onde seu dinheiro está trabalhando.</p>
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
    </header>
  );
}
