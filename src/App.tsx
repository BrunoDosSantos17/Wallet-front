import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getWalletAssets,
  getWalletBasicInfo,
  getWallets,
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
  WalletResponse,
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
  const [selectedWallet, setSelectedWallet] = useState<WalletResponse | null>(
    null,
  );
  const walletId = selectedWallet?.id ?? null;
  const walletName = selectedWallet?.name ?? 'Nenhuma carteira selecionada';
  const [wallets, setWallets] = useState<WalletResponse[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  const [walletsError, setWalletsError] = useState<string | null>(null);
  const [walletListAttempt, setWalletListAttempt] = useState(0);
  const [walletInfo, setWalletInfo] = useState<WalletBasicInfo | null>(null);
  const [walletAssets, setWalletAssets] = useState<WalletAsset[] | null>(null);
  const [walletInfoError, setWalletInfoError] = useState<string | null>(null);
  const [walletAssetsError, setWalletAssetsError] = useState<string | null>(
    null,
  );
  const [synchronizationError, setSynchronizationError] = useState<
    string | null
  >(null);
  const request = useRef({
    version: 0,
    controller: null as AbortController | null,
  });
  const activeWalletId = useRef<number | null>(null);
  const [isWalletRefreshing, setIsWalletRefreshing] = useState(true);
  const [isSynchronizationEnabled, setIsSynchronizationEnabled] =
    useState(true);
  const [isSynchronizationUpdating, setIsSynchronizationUpdating] =
    useState(false);

  const selectWallet = useCallback((wallet: WalletResponse) => {
    activeWalletId.current = wallet.id;
    request.current.version += 1;
    request.current.controller?.abort();
    setSelectedWallet(wallet);
    setWalletInfo(null);
    setWalletAssets(null);
    setWalletInfoError(null);
    setWalletAssetsError(null);
    setSelectedClass(null);
    setIsWalletRefreshing(true);
    setActiveItem('Visão geral');
    setIsViewingEquities(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    getWallets(controller.signal)
      .then(available => {
        if (!active) return;
        setWallets(available);
        if (available.length > 0) selectWallet(available[0]);
      })
      .catch(() => {
        if (active) setWalletsError('Não foi possível carregar as carteiras.');
      })
      .finally(() => {
        if (active) setIsLoadingWallets(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [walletListAttempt, selectWallet]);

  const refreshWalletInfo = useCallback(
    async (shouldUpdate = false) => {
      if (walletId === null || walletId !== activeWalletId.current) return;
      request.current.controller?.abort();
      const controller = new AbortController();
      const version = ++request.current.version;
      request.current.controller = controller;
      setIsWalletRefreshing(true);

      const [basicInfo, assets] = await Promise.allSettled([
        shouldUpdate
          ? refreshWalletBasicInfo(walletId, controller.signal)
          : getWalletBasicInfo(walletId, controller.signal),
        getWalletAssets(walletId, controller.signal),
      ]);
      // Abort alone is not enough: a response may already have completed.
      if (version !== request.current.version || controller.signal.aborted)
        return;

      if (basicInfo.status === 'fulfilled') {
        setWalletInfo(basicInfo.value);
        setWalletInfoError(null);
      } else {
        setWalletInfoError('Não foi possível carregar os dados da carteira.');
      }
      if (assets.status === 'fulfilled') {
        setWalletAssets(assets.value);
        setWalletAssetsError(null);
      } else {
        setWalletAssetsError(
          'Não foi possível atualizar os ativos. A contagem por classe pode estar desatualizada ou indisponível.',
        );
      }
      setIsWalletRefreshing(false);
    },
    [walletId],
  );

  useEffect(() => {
    const currentRequest = request.current;
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
      currentRequest.version += 1;
      currentRequest.controller?.abort();
    };
  }, [refreshWalletInfo]);

  async function handleSynchronizationToggle() {
    const nextState = !isSynchronizationEnabled;
    const action = nextState
      ? AssetPriceSchedulerAction.Activate
      : AssetPriceSchedulerAction.Deactivate;

    setIsSynchronizationUpdating(true);
    setSynchronizationError(null);

    try {
      await setAssetPriceScheduler(action);
      setIsSynchronizationEnabled(nextState);
    } catch {
      setSynchronizationError(
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
          setWallets(current => [...current, wallet]);
          selectWallet(wallet);
        }}
        onWalletSelected={wallet => {
          if (wallet.id !== walletId) selectWallet(wallet);
        }}
        onRetryWallets={() => {
          setIsLoadingWallets(true);
          setWalletsError(null);
          setWalletListAttempt(attempt => attempt + 1);
        }}
        wallets={wallets}
        walletsError={walletsError}
        isLoadingWallets={isLoadingWallets}
        onNavigate={handleNavigate}
        onToggle={() => setIsSidebarExpanded(expanded => !expanded)}
        walletId={walletId}
        walletName={walletName}
      />
      <main className="dashboard">
        {walletInfoError && (
          <p className="dashboard__status" role="alert">
            {walletInfoError}
          </p>
        )}
        {walletAssetsError && (
          <p className="dashboard__status" role="alert">
            {walletAssetsError}
          </p>
        )}
        {synchronizationError && (
          <p className="dashboard__status" role="alert">
            {synchronizationError}
          </p>
        )}
        {walletId === null ? (
          <p className="dashboard__status" role="status">
            {isLoadingWallets
              ? 'Carregando carteiras...'
              : walletsError
                ? 'A lista de carteiras está indisponível. Tente novamente.'
                : 'Nenhuma carteira cadastrada. Crie uma carteira no menu lateral para começar.'}
          </p>
        ) : activeItem === 'Importação' ? (
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
            {isWalletRefreshing && !walletInfo ? (
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
            ) : !walletInfoError ? (
              <p className="dashboard__status" role="status">
                Carregando informações da carteira...
              </p>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
