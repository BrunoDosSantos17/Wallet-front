import { useState } from 'react';
import { HoldingsPreview } from './components/HoldingsPreview/HoldingsPreview';
import { PageHeader } from './components/PageHeader/PageHeader';
import { PortfolioAllocation } from './components/PortfolioAllocation/PortfolioAllocation';
import { RecentActivity } from './components/RecentActivity/RecentActivity';
import { Sidebar } from './components/Sidebar/Sidebar';
import { SummaryStrip } from './components/SummaryStrip/SummaryStrip';
import type { AssetClass } from './types/portfolio';
import './App.css';

function App() {
  const [activeItem, setActiveItem] = useState('Visão geral');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedClass, setSelectedClass] = useState<AssetClass | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <div className={`app-shell ${isDarkTheme ? 'app-shell--dark' : ''}`}>
      <Sidebar
        activeItem={activeItem}
        isExpanded={isSidebarExpanded}
        onNavigate={setActiveItem}
        onToggle={() => setIsSidebarExpanded(expanded => !expanded)}
      />
      <main className="dashboard">
        <PageHeader
          isDarkTheme={isDarkTheme}
          onThemeToggle={() => setIsDarkTheme(isDark => !isDark)}
        />
        <SummaryStrip />
        <div className="dashboard__top">
          <PortfolioAllocation
            selectedClass={selectedClass}
            onSelect={setSelectedClass}
          />
          <RecentActivity />
        </div>
        <HoldingsPreview
          selectedClass={selectedClass}
          onSelect={setSelectedClass}
        />
      </main>
    </div>
  );
}

export default App;
