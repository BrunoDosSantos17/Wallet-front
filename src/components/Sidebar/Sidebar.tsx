import { useEffect, useState } from 'react';
import { createWallet, getWallets } from '../../api/wallet';
import type { WalletResponse } from '../../types/portfolio';
import './Sidebar.css';

interface SidebarProps {
  activeItem: string;
  isExpanded: boolean;
  onWalletCreated: (wallet: WalletResponse) => void;
  onNavigate: (item: string) => void;
  onToggle: () => void;
  walletId: number;
  walletName: string;
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
  onWalletCreated,
  onNavigate,
  onToggle,
  walletId,
  walletName,
}: SidebarProps) {
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isSubmittingWallet, setIsSubmittingWallet] = useState(false);
  const [wallets, setWallets] = useState<WalletResponse[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);

  useEffect(() => {
    getWallets()
      .then(setWallets)
      .catch(() => setWalletError('Não foi possível carregar as carteiras.'))
      .finally(() => setIsLoadingWallets(false));
  }, []);

  const activeWalletName =
    wallets.find(wallet => wallet.id === walletId)?.name ?? walletName;

  async function handleCreateWallet() {
    const name = newWalletName.trim();

    if (!name) {
      setWalletError('Informe o nome da carteira.');
      return;
    }

    setIsSubmittingWallet(true);
    setWalletError(null);

    try {
      const wallet = await createWallet(name);
      onWalletCreated(wallet);
      setWallets(currentWallets => [...currentWallets, wallet]);
      setNewWalletName('');
      setIsCreatingWallet(false);
    } catch {
      setWalletError('Não foi possível criar a carteira.');
    } finally {
      setIsSubmittingWallet(false);
    }
  }

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
      <button
        aria-expanded={isWalletMenuOpen}
        className="portfolio-switcher"
        onClick={() => {
          setWalletError(null);
          setIsWalletMenuOpen(open => !open);
          setIsCreatingWallet(false);
        }}
        type="button"
      >
        <span>⇄</span>
        <span>{activeWalletName}</span>
        <span aria-hidden="true">⌄</span>
      </button>
      {isWalletMenuOpen && (
        <div className="sidebar__wallet-creation">
          <button
            className="sidebar__new-wallet"
            onClick={() => {
              setIsCreatingWallet(visible => !visible);
              setWalletError(null);
            }}
            type="button"
          >
            <span aria-hidden="true">+</span> Nova carteira
          </button>
          {isCreatingWallet && (
            <form
              className="sidebar__wallet-form"
              onSubmit={event => {
                event.preventDefault();
                void handleCreateWallet();
              }}
            >
              <label htmlFor="wallet-name">NOME DA CARTEIRA</label>
              <div>
                <input
                  autoFocus
                  disabled={isSubmittingWallet}
                  id="wallet-name"
                  onChange={event => setNewWalletName(event.target.value)}
                  placeholder="Ex.: Reserva de viagem"
                  value={newWalletName}
                />
                <button
                  aria-label="Criar carteira"
                  disabled={isSubmittingWallet}
                  type="submit"
                >
                  →
                </button>
              </div>
              {walletError && <small role="alert">{walletError}</small>}
            </form>
          )}
          {isLoadingWallets ? (
            <small className="sidebar__wallet-status">
              Carregando carteiras...
            </small>
          ) : (
            <div className="sidebar__wallet-list">
              {wallets.map(wallet => (
                <button
                  className={
                    wallet.id === walletId ? 'sidebar__wallet--active' : ''
                  }
                  key={wallet.id}
                  onClick={() => onWalletCreated(wallet)}
                  type="button"
                >
                  <i aria-hidden="true" />
                  {wallet.name}
                </button>
              ))}
            </div>
          )}
          {walletError && !isCreatingWallet && (
            <small className="sidebar__wallet-status" role="alert">
              {walletError}
            </small>
          )}
        </div>
      )}
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
      <button
        aria-label="Importação: importar movimentações"
        className={`sidebar__import ${activeItem === 'Importação' ? 'sidebar__import--active' : ''}`}
        onClick={() => onNavigate('Importação')}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 16V3M7 8l5-5 5 5M5 21h14" />
        </svg>
        <span className="sidebar__import-copy">
          <strong>Importação</strong>
          <small>Importar movimentações</small>
        </span>
      </button>
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
