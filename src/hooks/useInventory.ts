// 前端 React Hooks - 库存相关

import { useState, useEffect, useCallback } from 'react';
import { api, ATPResult, InventoryBalance, MaterialClassification, StagnationResult } from '../services';

// ATP 计算 Hook
export function useATP() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATPResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateATP = useCallback(async (params: {
    materialCode: string;
    requestedQty: number;
    requestedDate: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.inventory.calculateATP(params);
      if (response.code === 200) {
        setResult(response.data);
      } else {
        setError(response.message || 'ATP 计算失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ATP 计算异常');
    } finally {
      setLoading(false);
    }
  }, []);

  return { calculateATP, loading, result, error };
}

// 库存余额 Hook
export function useInventoryBalances(plantCode: string, materialCode?: string) {
  const [balances, setBalances] = useState<InventoryBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.inventory.getBalances({ plantCode, materialCode });
      if (response.code === 200) {
        setBalances(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取库存失败');
    } finally {
      setLoading(false);
    }
  }, [plantCode, materialCode]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { balances, loading, error, refetch: fetchBalances };
}

// ABC-XYZ 分类 Hook
export function useABCXYZClassification(materialCodes: string[]) {
  const [classifications, setClassifications] = useState<MaterialClassification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classify = useCallback(async () => {
    if (materialCodes.length === 0) return;
    
    setLoading(true);
    try {
      const response = await api.inventory.classifyABCXYZ(materialCodes);
      if (response.code === 200) {
        setClassifications(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分类失败');
    } finally {
      setLoading(false);
    }
  }, [materialCodes]);

  useEffect(() => {
    classify();
  }, [classify]);

  return { classifications, loading, error, refetch: classify };
}

// 呆滞检测 Hook
export function useStagnation(plantCode: string) {
  const [results, setResults] = useState<StagnationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.inventory.detectStagnation(plantCode);
      if (response.code === 200) {
        setResults(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '检测失败');
    } finally {
      setLoading(false);
    }
  }, [plantCode]);

  useEffect(() => {
    detect();
  }, [detect]);

  return { results, loading, error, refetch: detect };
}
