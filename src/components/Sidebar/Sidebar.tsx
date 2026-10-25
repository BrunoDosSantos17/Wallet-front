import './Sidebar.css';

interface SidebarProps {
  activeItem: string;
  isExpanded: boolean;
  onNavigate: (item: string) => void;
  onToggle: () => void;
}

const navigation = [
  { label: 'Visão geral', icon: '▦' },
  { label: 'Carteira', icon: '◒' },
  { label: 'Movimentações', icon: '↕' },
  { label: 'Metas', icon: '◎' },
];

export function Sidebar({
  activeItem,
  isExpanded,
  onNavigate,
  onToggle,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isExpanded ? '' : 'sidebar--collapsed'}`}>
      <button
        aria-expanded={isExpanded}
        className="sidebar__brand"
        onClick={onToggle}
        type="button"
      >
        <span className="sidebar__brand-name">NOVA / CAPITAL</span>
        <span className="sidebar__brand-toggle" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
      <p className="sidebar__portfolio-label">
        MINHA CARTEIRA
        <br />
        Patrimônio em foco
      </p>
      <button className="portfolio-switcher" type="button">
        <span>⇄</span>
        <span>Minha carteira</span>
        <span aria-hidden="true">⌄</span>
      </button>
      <nav className="sidebar__nav" aria-label="Navegação principal">
        {navigation.map(item => (
          <button
            className={`sidebar__nav-item ${activeItem === item.label ? 'sidebar__nav-item--active' : ''}`}
            key={item.label}
            onClick={() => onNavigate(item.label)}
            type="button"
          >
            <span aria-hidden="true">{item.icon}</span>
            <span className="sidebar__nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar__spacer" />
      <section className="sidebar__help">
        <strong>Próximo passo</strong>
        <p>Defina uma meta para acompanhar sua evolução.</p>
        <button type="button" onClick={() => onNavigate('Metas')}>
          Criar meta <span aria-hidden="true">→</span>
        </button>
      </section>
    </aside>
  );
}
