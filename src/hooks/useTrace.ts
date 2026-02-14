// 前端 React Hooks - Trace 追溯

import { useState, useCallback } from 'react';
import { api, TraceNode, ChangeImpactAnalysis } from '../services';

// 追溯 Hook
export function useTrace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const traceForward = useCallback(async (traceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.trace.traceForward(traceId);
      if (response.code === 200) {
        return response.data;
      } else {
        setError(response.message || '追溯失败');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '追溯异常');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const traceBackward = useCallback(async (traceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.trace.traceBackward(traceId);
      if (response.code === 200) {
        return response.data;
      } else {
        setError(response.message || '追溯失败');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '追溯异常');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const traceFull = useCallback(async (traceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.trace.traceFull(traceId);
      if (response.code === 200) {
        return response.data;
      } else {
        setError(response.message || '追溯失败');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '追溯异常');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    traceForward, 
    traceBackward, 
    traceFull, 
    loading, 
    error 
  };
}

// 批次追溯 Hook
export function useBatchTrace() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TraceNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  const traceByBatch = useCallback(async (batchNo: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.trace.traceByBatch(batchNo);
      if (response.code === 200) {
        setResult(response.data);
      } else {
        setError(response.message || '批次追溯失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '追溯异常');
    } finally {
      setLoading(false);
    }
  }, []);

  return { traceByBatch, result, loading, error };
}

// 变更影响分析 Hook
export function useChangeImpact() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChangeImpactAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (params: {
    documentType: string;
    documentId: string;
    newValue: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.trace.analyzeChangeImpact(params);
      if (response.code === 200) {
        setResult(response.data);
      } else {
        setError(response.message || '分析失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析异常');
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, result, loading, error };
}
