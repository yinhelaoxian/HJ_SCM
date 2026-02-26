// 前端 React Hooks - MRP 相关

import { useState, useEffect, useCallback } from 'react';
import { api, MrpRunResponse, MrpRequirement, KitCheckResult, ProcurementSuggestion } from '../services';

// MRP 运行 Hook
export function useMrpRun() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MrpRunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runMrp = useCallback(async (params: {
    runMode: 'FORECAST' | 'ORDER' | 'FULL';
    planFromDate: string;
    planToDate: string;
    plantCode: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.mrp.runMrp(params);
      if (response.code === 200) {
        setResult(response.data);
      } else {
        setError(response.message || 'MRP 运行失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MRP 运行异常');
    } finally {
      setLoading(false);
    }
  }, []);

  return { runMrp, loading, result, error };
}

// 物料需求 Hook
export function useMrpRequirements(materialCode?: string) {
  const [requirements, setRequirements] = useState<MrpRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequirements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.mrp.getRequirements({ materialCode });
      if (response.code === 200) {
        setRequirements(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取需求失败');
    } finally {
      setLoading(false);
    }
  }, [materialCode]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  return { requirements, loading, error, refetch: fetchRequirements };
}

// 齐套检查 Hook
export function useKitCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KitCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkKit = useCallback(async (requirementIds: string[]) => {
    setLoading(true);
    try {
      const response = await api.mrp.checkKit({ requirementIds });
      if (response.code === 200) {
        setResult(response.data);
      } else {
        setError(response.message || '齐套检查失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '齐套检查异常');
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkKit, loading, result, error };
}

// 采购建议 Hook
export function useProcurementSuggestions() {
  const [suggestions, setSuggestions] = useState<ProcurementSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.mrp.getSuggestions();
      if (response.code === 200) {
        setSuggestions(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取建议失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return { suggestions, loading, error, refetch: fetchSuggestions };
}
