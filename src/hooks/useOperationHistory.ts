import { useState, useCallback } from 'react';
import { OperationRecord } from '../types';

export function useOperationHistory() {
  const [history, setHistory] = useState<OperationRecord[]>([]);

  const logOperation = useCallback((record: Omit<OperationRecord, 'id' | 'timestamp'>) => {
    const newRecord: OperationRecord = {
      ...record,
      id: `op_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    setHistory(prev => [newRecord, ...prev].slice(0, 100)); // Keep last 100 non-sensitive records
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const exportHistoryJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cipherlab-audit-log-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [history]);

  const exportHistoryCSV = useCallback(() => {
    const headers = ['ID', 'Timestamp', 'Type', 'Algorithm/Format', 'Status', 'Details', 'Input Size', 'Output Size', 'Duration (ms)'];
    const rows = history.map(item => [
      `"${item.id}"`,
      `"${item.timestamp}"`,
      `"${item.type}"`,
      `"${item.algorithmOrFormat}"`,
      `"${item.status}"`,
      `"${item.details.replace(/"/g, '""')}"`,
      `"${item.inputSizeLabel || ''}"`,
      `"${item.outputSizeLabel || ''}"`,
      item.durationMs ?? '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map(e => e.join(','))].join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `cipherlab-audit-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [history]);

  // Real operational summaries derived strictly from actual session history
  const sessionStats = {
    totalOperations: history.length,
    hashCount: history.filter(h => h.type === 'hash').length,
    encodeCount: history.filter(h => h.type === 'encode').length,
    randomCount: history.filter(h => h.type === 'random').length,
    fileCount: history.filter(h => h.type === 'integrity').length,
    lastHashOp: history.find(h => h.type === 'hash'),
    lastEncodeOp: history.find(h => h.type === 'encode'),
    lastRandomOp: history.find(h => h.type === 'random'),
    lastIntegrityOp: history.find(h => h.type === 'integrity'),
  };

  return {
    history,
    logOperation,
    clearHistory,
    exportHistoryJSON,
    exportHistoryCSV,
    sessionStats,
  };
}
