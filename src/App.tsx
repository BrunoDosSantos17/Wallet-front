import { useCallback, useEffect, useState } from 'react';
import {
  getWalletAssets,
  getWalletBasicInfo,
  refreshWalletBasicInfo,
  setAssetPriceScheduler,
} from './api/wallet';
import { DashboardSkeleton } from './components/DashboardSkeleton/DashboardSkeleton';
import { ImportTransactions } from './components/ImportTransactions/ImportTransactions';
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
  WalletAsset,
  WalletBasicInfo,
} from './types/portfolio';
import { AssetPriceSchedulerAction } from './types/scheduler';
import './App.css';

const allocationColors = ['#4b8f6a', '#cc942e', '#4e789e', '#b76d6d'];

function countDistinctAssetsByType(assets: WalletAsset[], assetType: string) {
  return new Set(
    assets
      .filter(asset => asset.tipo.toUpperCase() === assetType.toUpperCase())
      .map(asset => asset.ticker.toUpperCase()),
  ).size;
}

function toAllocation(
  distribution: WalletBasicInfo['distribuicao'][number],
  index: number,
  assets?: WalletAsset[],
): Allocation {
  return {
    id: distribution.nomeAtivo.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'),
    name: distribution.nomeAtivo,
    amount: Number(distribution.valor),
    percentage: Number(
      distribution.percentual.replace('%', '').replace(',', '.'),
    ),
    assetCount: assets
      ? countDistinctAssetsByType(assets, distribution.nomeAtivo)
      : null,
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
  const [walletId, setWalletId] = useState(1);
  const [walletName, setWalletName] = useState('Minha carteira');
  const [walletInfo, setWalletInfo] = useState<WalletBasicInfo | null>(null);
  const [walletAssets, setWalletAssets] = useState<WalletAsset[] | null>(null);
  const [walletInfoError, setWalletInfoError] = useState<string | null>(null);
  const [isWalletRefreshing, setIsWalletRefreshing] = useState(true);
  const [isSynchronizationEnabled, setIsSynchronizationEnabled] =
    useState(true);
  const [isSynchronizationUpdating, setIsSynchronizationUpdating] =
    useState(false);

  const refreshWalletInfo = useCallback(
    async (shouldUpdate = false) => {
      setIsWalletRefreshing(true);
      setWalletInfoError(null);

      try {
        const [basicInfo, assets] = await Promise.all([
          shouldUpdate
            ? refreshWalletBasicInfo(walletId)
            : getWalletBasicInfo(walletId),
          getWalletAssets(walletId),
        ]);

        setWalletInfo(basicInfo);
        setWalletAssets(assets);
      } catch {
        setWalletInfoError('Não foi possível carregar os dados da carteira.');
      } finally {
        setIsWalletRefreshing(false);
      }
    },
    [walletId],
  );

  useEffect(() => {
    const initialRefreshId = window.setTimeout(() => {
      void refreshWalletInfo();
    }, 0);
    const intervalId = window.setInterval(
      () => {
        void refreshWalletInfo();
      },
      5 * 60 * 1000,
    );

    return () => {
      window.clearTimeout(initialRefreshId);
      window.clearInterval(intervalId);
    };
  }, [refreshWalletInfo]);

  async function handleSynchronizationToggle() {
    const nextState = !isSynchronizationEnabled;
    const action = nextState
      ? AssetPriceSchedulerAction.Activate
      : AssetPriceSchedulerAction.Deactivate;

    setIsSynchronizationUpdating(true);

    try {
      await setAssetPriceScheduler(action);
      setIsSynchronizationEnabled(nextState);
    } catch {
      setWalletInfoError(
        'Não foi possível alterar a sincronização automática.',
      );
    } finally {
      setIsSynchronizationUpdating(false);
    }
  }

  function handleNavigate(item: string) {
    setActiveItem(item);
    if (item === 'Carteira') {
      setIsViewingEquities(false);
      setSelectedAssetName('Ações');
    }
  }

  const allocations =
    walletInfo?.distribuicao.map((distribution, index) =>
      toAllocation(distribution, index, walletAssets ?? undefined),
    ) ?? [];

  return (
    <div className={`app-shell ${isDarkTheme ? 'app-shell--dark' : ''}`}>
      <Sidebar
        activeItem={activeItem}
        isExpanded={isSidebarExpanded}
        onWalletCreated={wallet => {
          setWalletId(wallet.id);
          setWalletName(wallet.name);
          setActiveItem('Visão geral');
        }}
        onNavigate={handleNavigate}
        onToggle={() => setIsSidebarExpanded(expanded => !expanded)}
        walletId={walletId}
        walletName={walletName}
      />
      <main className="dashboard">
        {activeItem === 'Importação' ? (
          <ImportTransactions
            key={walletId}
            walletId={walletId}
            walletName={walletName}
            onComplete={() => void refreshWalletInfo()}
          />
        ) : activeItem === 'Carteira' ? (
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
              isRefreshing={isWalletRefreshing}
              isSynchronizationEnabled={isSynchronizationEnabled}
              isSynchronizationUpdating={isSynchronizationUpdating}
              onRefresh={() => void refreshWalletInfo(true)}
              onSynchronizationToggle={() => void handleSynchronizationToggle()}
              onThemeToggle={() => setIsDarkTheme(isDark => !isDark)}
            />
            {isWalletRefreshing ? (
              <DashboardSkeleton />
            ) : walletInfo ? (
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
