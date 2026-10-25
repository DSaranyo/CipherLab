/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationModule } from './types';
import { useOperationHistory } from './hooks/useOperationHistory';
import { AppShell } from './components/AppShell';

// Modules
import { MissionOverview } from './modules/overview/MissionOverview';
import { HashStudio } from './modules/hash-studio/HashStudio';
import { EncodingLab } from './modules/encoding-lab/EncodingLab';
import { RandomnessLab } from './modules/randomness-lab/RandomnessLab';
import { IntegrityChecker } from './modules/integrity-checker/IntegrityChecker';
import { CryptoPlayground } from './modules/crypto-playground/CryptoPlayground';
import { CryptoConcepts } from './modules/concepts/CryptoConcepts';
import { OperationHistory } from './modules/operation-history/OperationHistory';

export default function App() {
  const [currentModule, setCurrentModule] = useState<NavigationModule>('overview');

  const {
    history,
    logOperation,
    clearHistory,
    exportHistoryJSON,
    exportHistoryCSV,
    sessionStats,
  } = useOperationHistory();

  const handleClearWorkspace = () => {
    clearHistory();
    setCurrentModule('overview');
  };

  const renderActiveModule = () => {
    switch (currentModule) {
      case 'overview':
        return (
          <MissionOverview
            onNavigate={setCurrentModule}
            sessionStats={sessionStats}
            recentHistory={history}
          />
        );
      case 'hash-studio':
        return <HashStudio onLogOperation={logOperation} />;
      case 'encoding-lab':
        return <EncodingLab onLogOperation={logOperation} />;
      case 'randomness-lab':
        return <RandomnessLab onLogOperation={logOperation} />;
      case 'integrity-checker':
        return <IntegrityChecker onLogOperation={logOperation} />;
      case 'crypto-playground':
        return <CryptoPlayground onLogOperation={logOperation} />;
      case 'concepts':
        return <CryptoConcepts />;
      case 'history':
        return (
          <OperationHistory
            history={history}
            onClearHistory={clearHistory}
            onExportJSON={exportHistoryJSON}
            onExportCSV={exportHistoryCSV}
          />
        );
      default:
        return (
          <MissionOverview
            onNavigate={setCurrentModule}
            sessionStats={sessionStats}
            recentHistory={history}
          />
        );
    }
  };

  return (
    <AppShell
      currentModule={currentModule}
      onSelectModule={setCurrentModule}
      operationCount={history.length}
      onClearWorkspace={handleClearWorkspace}
    >
      {renderActiveModule()}
    </AppShell>
  );
}
