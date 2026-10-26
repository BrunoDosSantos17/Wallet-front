import { useEffect, useState } from 'react';
import { getWalletBasicInfo } from './api/wallet';
import { HoldingsPreview } from './components/HoldingsPreview/HoldingsPreview';
import { Equities } from './components/Equities/Equities';
import { PageHeader } from './components/PageHeader/PageHeader';
import { Portfolio } from './components/Portfolio/Portfolio';
import { PortfolioAllocation } from './components/PortfolioAllocation/PortfolioAllocation';
import { RecentActivity } from './components/RecentActivity/RecentActivity';
import { Sidebar } from './components/Sidebar/Sidebar';
import { SummaryStrip } from './components/SummaryStrip/SummaryStrip';
import type {
  Allocation,
  AssetClass,
  WalletBasicInfo,
} from './types/portfolio';
import './App.css';

const allocationColors = ['#4b8f6a', '#cc942e', '#4e789e', '#b76d6d'];

function toAllocation(
  distribution: WalletBasicInfo['distribuicao'][number],
  index: number,
): Allocation {
  return {
    id: distribution.nomeAtivo.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'),
    name: distribution.nomeAtivo,
    amount: Number(distribution.valor),
    percentage: Number(
      distribution.percentual.replace('%', '').replace(',', '.'),
    ),
    assetCount: distribution.quantidade,
    color: allocationColors[index % allocationColors.length],
  };
}

function App() {
  const [activeItem, setActiveItem] = useState('Visão geral');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedClass, setSelectedClass] = useState<AssetClass | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isViewingEquities, setIsViewingEquities] = useState(false);
  const [selectedAssetName, setSelectedAssetName] = useState('Ações');
  const [walletInfo, setWalletInfo] = useState<WalletBasicInfo | null>(null);
  const [walletInfoError, setWalletInfoError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getWalletBasicInfo(1, controller.signal)
      .then(setWalletInfo)
      .catch(error => {
        if (error.name !== 'AbortError') {
          setWalletInfoError('Não foi possível carregar os dados da carteira.');
        }
      });

    return () => controller.abort();
  }, []);

  function handleNavigate(item: string) {
    setActiveItem(item);
    if (item === 'Carteira') {
      setIsViewingEquities(false);
      setSelectedAssetName('Ações');
    }
  }

  const allocations = walletInfo?.distribuicao.map(toAllocation) ?? [];

  return (
    <div className={`app-shell ${isDarkTheme ? 'app-shell--dark' : ''}`}>
      <Sidebar
        activeItem={activeItem}
        isExpanded={isSidebarExpanded}
        onNavigate={handleNavigate}
        onToggle={() => setIsSidebarExpanded(expanded => !expanded)}
      />
      <main className="dashboard">
        {activeItem === 'Carteira' ? (
          isViewingEquities ? (
            <Equities
              onBack={() => setIsViewingEquities(false)}
              title={selectedAssetName}
            />
          ) : (
            <Portfolio
              onBack={() => setActiveItem('Visão geral')}
              onOpenAsset={name => {
                setSelectedAssetName(name);
                setIsViewingEquities(true);
              }}
            />
          )
        ) : (
          <>
            <PageHeader
              isDarkTheme={isDarkTheme}
              onThemeToggle={() => setIsDarkTheme(isDark => !isDark)}
            />
            {walletInfo ? (
              <>
                <SummaryStrip walletInfo={walletInfo} />
                <div className="dashboard__top">
                  <PortfolioAllocation
                    allocations={allocations}
                    selectedClass={selectedClass}
                    onSelect={setSelectedClass}
                    totalAmount={walletInfo.patrimonioTotal}
                  />
                  <RecentActivity />
                </div>
                <HoldingsPreview
                  allocations={allocations}
                  selectedClass={selectedClass}
                  onSelect={setSelectedClass}
                />
              </>
            ) : (
              <p className="dashboard__status" role="status">
                {walletInfoError ?? 'Carregando informações da carteira...'}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
