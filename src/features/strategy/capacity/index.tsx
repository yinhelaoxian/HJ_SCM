import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Factory, TrendingUp, DollarSign, Search, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Select } from '@/ui/Select';
import { getCapacityData } from '@/services/api/strategy';
import { t, getLocale, Locale } from '../../../core/config/i18n';

interface CapacityData {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: string;
  utilization: number;
  cost: string;
  status: 'overloaded' | 'normal' | 'underloaded';
}

interface FilterOptions {
  type: 'all' | 'factory' | 'assembly';
  location: 'all' | 'qingdao' | 'su' | 'thailand' | 'north';
  sortUtilization: 'none' | 'high' | 'low';
  search: string;
}

const locationMap: Record<string, string> = {
  qingdao: 'Qingdao',
  su: 'Suzhou',
  thailand: 'Thailand',
  north: 'North China',
};

const typeMap: Record<string, string> = {
  factory: 'Factory',
  assembly: 'Assembly',
};

const CapacityPlanningPage: React.FC = () => {
  const [data, setData] = useState<CapacityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    location: 'all',
    sortUtilization: 'none',
    search: '',
  });
  const locale = getLocale();

  const filteredData = useMemo(() => {
    let result = [...data];
    if (filters.type !== 'all') {
      result = result.filter((item) => item.type === filters.type);
    }
    if (filters.location !== 'all') {
      const locationNames: Record<string, string[]> = {
        qingdao: ['Qingdao'],
        su: ['Suzhou'],
        thailand: ['Thailand'],
        north: ['North China'],
      };
      const targetLocations = locationNames[filters.location] || [];
      result = result.filter((item) =>
        targetLocations.some((loc) => item.location.includes(loc))
      );
    }
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchLower)
      );
    }
    if (filters.sortUtilization !== 'none') {
      result.sort((a, b) =>
        filters.sortUtilization === 'high'
          ? b.utilization - a.utilization
          : a.utilization - b.utilization
      );
    }
    return result;
  }, [data, filters]);

  const filteredStats = useMemo(() => {
    const totalCapacity = filteredData.length > 0
      ? `${(filteredData.reduce((sum, item) => sum + parseFloat(item.capacity.replace(/[^\d.]/g, ''))) / 10000).toFixed(1)}K units`
      : '0K units';
    const utilization = filteredData.length > 0
      ? `${Math.round(filteredData.reduce((sum, item) => sum + item.utilization) / filteredData.length)}%`
      : '0%';
    return {
      totalCapacity,
      utilization,
      investmentNeeded: '¥450M',
      roi: '16.8%',
      count: filteredData.length,
    };
  }, [filteredData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getCapacityData();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2D7DD2' }}></div>
        <span className="ml-3" style={{ color: '#7A8BA8' }}>{t('error.loading', locale)}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 rounded border" style={{ background: 'rgba(229,57,53,0.1)', borderColor: 'rgba(229,57,53,0.3)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">X</span>
          <span className="text-sm font-medium" style={{ color: '#E53935' }}>{t('error.loadFailed', locale)}</span>
        </div>
        <p className="text-xs mt-2" style={{ color: '#7A8BA8' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <span>{t('menu.strategic', locale)}</span>
        <span>/</span>
        <span className="text-white">{t('menu.capacity', locale)}</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
            {t('menu.capacity', locale)}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>{t('menu.capacity', locale)} & Optimization</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-1" />
          {t('btn.settings', locale)}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: '#7A8BA8' }} />
          <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{t('filter.all', locale)}</span>
        </div>
        <Select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
          style={{ minWidth: 100 }}
        >
          <option value="all">{t('filter.all', locale)}</option>
          <option value="factory">{typeMap.factory}</option>
          <option value="assembly">{typeMap.assembly}</option>
        </Select>
        <Select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value as FilterOptions['location'] })}
          style={{ minWidth: 100 }}
        >
          <option value="all">{t('filter.all', locale)}</option>
          <option value="qingdao">Qingdao</option>
          <option value="su">Suzhou</option>
          <option value="thailand">Thailand</option>
          <option value="north">North China</option>
        </Select>
        <Select
          value={filters.sortUtilization}
          onChange={(e) => setFilters({ ...filters, sortUtilization: e.target.value as FilterOptions['sortUtilization'] })}
          style={{ minWidth: 100 }}
        >
          <option value="none">{t('filter.sort', locale)}</option>
          <option value="high">{t('filter.highToLow', locale)}</option>
          <option value="low">{t('filter.lowToHigh', locale)}</option>
        </Select>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A8BA8' }} />
          <input
            type="text"
            placeholder={t('btn.search', locale)}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm rounded border bg-[#0D1421] placeholder-[#445568]"
            style={{ borderColor: '#1E2D45', color: '#E8EDF4', outline: 'none' }}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilters({ type: 'all', location: 'all', sortUtilization: 'none', search: '' })}
        >
          {t('btn.reset', locale)}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>{t('menu.capacity', locale)}</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
            {filteredStats.totalCapacity}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            {filteredStats.count} factories
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>Avg Utilization</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {filteredStats.utilization}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>Target 85%</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>Investment Needed</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {filteredStats.investmentNeeded}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>Annual Budget</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>ROI</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>
            {filteredStats.roi}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>Avg Return Rate</div>
        </Card>
      </div>

      {/* Capacity List */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>Capacity Projects</h3>
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
            Filtered {filteredStats.count} / {data.length} factories
          </span>
        </div>
        {filteredData.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#7A8BA8' }}>
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No matching factories</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded border"
                style={{ background: '#131926', borderColor: item.status === 'overloaded' ? 'rgba(229,57,53,0.4)' : item.status === 'underloaded' ? 'rgba(0,137,123,0.3)' : '#1E2D45' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                    style={{ background: item.status === 'overloaded' ? 'rgba(229,57,53,0.15)' : item.status === 'underloaded' ? 'rgba(0,137,123,0.15)' : 'rgba(45,125,210,0.1)' }}>
                    {item.status === 'overloaded' ? '!' : item.status === 'underloaded' ? 'O' : 'F'}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: '#E8EDF4' }}>{item.name}</div>
                    <div className="text-xs mt-1" style={{ color: '#445568' }}>
                      {item.location} - Type: {typeMap[item.type] || item.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: '#7A8BA8' }}>Utilization</span>
                      <span className="text-xs" style={{ color: item.utilization > 100 ? '#E53935' : item.utilization < 50 ? '#00897B' : '#E8EDF4' }}>
                        {item.utilization > 100 ? `${item.utilization}% (Overloaded)` : `${item.utilization}%`}
                      </span>
                    </div>
                    <div className="h-2 rounded bg-slate-800">
                      <div className="h-full rounded" style={{ width: `${Math.min(item.utilization, 100)}%`, background: item.utilization > 100 ? '#E53935' : item.utilization < 50 ? '#00897B' : item.utilization > 80 ? '#F57C00' : '#00897B' }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm" style={{ color: '#E8EDF4' }}>{item.cost}</div>
                    <div className="text-xs" style={{ color: '#445568' }}>Investment</div>
                  </div>
                  <Button variant="outline" size="sm">{t('btn.optimize', locale)}</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recommendations */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>Investment Recommendations</h3>
        <div className="space-y-3">
          {[
            { id: 1, title: 'Expand Qingdao HQ Factory', description: 'Add two automated production lines', cost: '¥150M', roi: '25.0%', priority: 'high' },
            { id: 2, title: 'Improve Thailand Factory Utilization', description: 'Optimize production schedule', cost: '¥50M', roi: '18.0%', priority: 'high' },
            { id: 3, title: 'Upgrade Suzhou Factory Equipment', description: 'Improve production efficiency by 12%', cost: '¥35M', roi: '16.5%', priority: 'medium' },
          ].map((inv) => (
            <div key={inv.id} className="flex items-start gap-3 p-3 rounded"
              style={{ background: inv.priority === 'high' ? 'rgba(229,57,53,0.08)' : inv.priority === 'medium' ? 'rgba(245,124,0,0.08)' : 'rgba(0,137,123,0.08)' }}>
              <TrendingUp className="w-4 h-4 mt-0.5"
                style={{ color: inv.priority === 'high' ? '#E53935' : inv.priority === 'medium' ? '#F57C00' : '#00897B' }} />
              <div className="flex-1">
                <div className="font-medium" style={{ color: inv.priority === 'high' ? '#E53935' : inv.priority === 'medium' ? '#F57C00' : '#00897B' }}>{inv.title}</div>
                <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>{inv.description}</div>
              </div>
              <div className="text-right">
                <div className="text-sm" style={{ color: '#E8EDF4' }}>{inv.cost}</div>
                <div className="text-xs" style={{ color: '#445568' }}>ROI: {inv.roi}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CapacityPlanningPage;
