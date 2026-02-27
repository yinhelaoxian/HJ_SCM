// 集成供应链（ISC）计划管理控制塔
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import { useControlTower } from '../../hooks/useControlTower';

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)'
};

export default function ControlTower() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { data, loading } = useControlTower();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  // 点击事件处理函数
  const handlePyramidLayerClick = (path: string) => {
    navigate(path);
  };

  const handleSopClick = () => {
    navigate('/sop');
  };

  const handleMpsClick = () => {
    navigate('/mps');
  };

  const handleDefenseWallClick = (id: number) => {
    const paths = ['/risk/forecast', '/risk/inventory', '/risk/execution'];
    if (id > 0 && id <= paths.length) {
      navigate(paths[id - 1]);
    }
  };

  const handleDeliveryModeClick = () => {
    navigate('/otc-flow');
  };

  const handleScorClick = () => {
    navigate('/kpi/pyramid');
  };

  const handleFourPillarClick = (path: string) => {
    navigate(path);
  };

  const getRadarOption = () => ({
    radar: {
      indicator: data?.scorData.map(s => ({ name: s.name, max: 100 })),
      radius: '60%',
      center: ['50%', '55%'],
      axisName: { color: '#b0bec5', fontSize: 9 },
      splitArea: {
        areaStyle: {
          color: ['rgba(0,180,216,0.02)', 'rgba(0,180,216,0.04)', 'rgba(0,180,216,0.06)']
        }
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.07)' } }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data?.scorData.map(s => s.value),
            name: '实际',
            areaStyle: { color: 'rgba(0,180,216,0.15)' },
            lineStyle: { color: 'rgba(0,180,216,0.8)', width: 2 },
            itemStyle: { color: '#00b4d8' }
          },
          {
            value: data?.scorData.map(s => s.benchmark),
            name: '基准',
            lineStyle: { color: 'rgba(255,200,0,0.5)', width: 1, type: 'dashed' as const },
            itemStyle: { color: 'rgba(255,200,0,0.8)' }
          }
        ]
      }
    ],
    legend: { show: false }
  });

  if (!mounted || loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.navy }}>
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: colors.navy,
        backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}
    >
      {/* Header */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))',
          border: '1px solid ' + colors.border
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'linear-gradient(90deg, #00b4d8, #fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              集成供应链（ISC）计划管理控制塔
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">
              Integrated Supply Chain Planning Control Tower · 从战略到执行
            </p>
          </div>
          <div className="flex gap-4">
            <div
              className="text-center px-4 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}
            >
              <div
                className="text-xl font-bold text-cyan-400"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {data.headerStats.planAchieve}
              </div>
              <div className="text-xs text-gray-400">计划达成率</div>
            </div>
            <div
              className="text-center px-4 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}
            >
              <div
                className="text-xl font-bold"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f57c00' }}
              >
                {data.headerStats.avgDelivery}
              </div>
              <div className="text-xs text-gray-400">平均交付周期</div>
            </div>
            <div
              className="text-center px-4 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}
            >
              <div
                className="text-xl font-bold text-green-400"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {data.headerStats.riskLevel}
              </div>
              <div className="text-xs text-gray-400">风险等级</div>
            </div>
            <div
              className="text-center px-4 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}
            >
              <div className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                <span className="text-sm">2026</span>/02
              </div>
              <div className="text-xs text-gray-400">当前周期</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {data.kpiData.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-lg p-3 text-center"
            style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
          >
            <div
              className="text-2xl font-bold"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background:
                  kpi.status === 'ok'
                    ? 'linear-gradient(135deg, #66bb6a, #26a69a)'
                    : kpi.status === 'warn'
                    ? 'linear-gradient(135deg, #f57c00, #ffc107)'
                    : 'linear-gradient(135deg, #00b4d8, #1976d2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {kpi.value}
            </div>
            <div className="text-xs text-gray-400 mt-1">{kpi.label}</div>
            <div
              className={
                'text-xs mt-2 inline-block px-2 py-0.5 rounded ' +
                (kpi.trend === 'up'
                  ? 'bg-green-500/20 text-green-400'
                  : kpi.trend === 'down'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/10 text-gray-400')
              }
            >
              {kpi.trend === 'up' ? '▲ ' : kpi.trend === 'down' ? '▼ ' : '→ '}
              {kpi.trendText}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Card 1: 三层计划体系 */}
        <div
          className="row-span-2 rounded-xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
          style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
        >
          <div
            className="text-xs text-orange-400 mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            三层计划体系
          </div>
          <div
            className="flex items-center gap-2 mb-4 text-cyan-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
              🔺
            </span>
            <span className="font-semibold tracking-wide">从愿景到动作</span>
          </div>
          <div className="space-y-3">
            {data.pyramidLayers.map((layer, idx) => (
              <div
                key={idx}
                className="flex gap-3 cursor-pointer hover:translate-x-1 transition-transform"
                onClick={() => handlePyramidLayerClick(layer.path)}
              >
                <div
                  className="w-1.5 rounded-full flex-shrink-0"
                  style={{
                    background:
                      layer.color === 'orange'
                        ? 'linear-gradient(180deg, #f57c00, #ff9800)'
                        : layer.color === 'blue'
                        ? 'linear-gradient(180deg, #1565c0, #42a5f5)'
                        : 'linear-gradient(180deg, #00897b, #26a69a)'
                  }}
                />
                <div
                  className="flex-1 rounded-lg p-3"
                  style={{
                    background:
                      layer.color === 'orange'
                        ? 'rgba(245,124,0,0.08)'
                        : layer.color === 'blue'
                        ? 'rgba(21,101,192,0.1)'
                        : 'rgba(0,137,123,0.08)'
                  }}
                >
                  <div
                    className="text-xs inline-block px-2 py-0.5 rounded-full mb-1"
                    style={{
                      background:
                        layer.color === 'orange'
                          ? 'rgba(245,124,0,0.2)'
                          : layer.color === 'blue'
                          ? 'rgba(21,101,192,0.2)'
                          : 'rgba(0,137,123,0.2)',
                      color: layer.color === 'orange' ? '#ff9800' : layer.color === 'blue' ? '#42a5f5' : '#26a69a',
                      border:
                        '1px solid ' +
                        (layer.color === 'orange'
                          ? 'rgba(245,124,0,0.3)'
                          : layer.color === 'blue'
                          ? 'rgba(21,101,192,0.3)'
                          : 'rgba(0,137,123,0.3)')
                    }}
                  >
                    {layer.level}
                  </div>
                  <div className="font-bold text-sm text-white mb-1">{layer.name}</div>
                  <div className="text-xs text-gray-400">{layer.desc}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {layer.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: S&OP */}
        <div
          className="rounded-xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
          style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
          onClick={handleSopClick}
        >
          <div
            className="text-xs text-orange-400 mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            产销协同
          </div>
          <div
            className="flex items-center gap-2 mb-4 text-cyan-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
              ⚙️
            </span>
            <span className="font-semibold tracking-wide">S&OP 节拍器</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-4">
            {data.sopSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 text-center rounded-lg py-2 bg-white/5 border border-white/10">
                  <div className="text-lg mb-1">{step.icon}</div>
                  <div className="text-xs font-bold text-cyan-400">{step.title}</div>
                  <div className="text-[9px] text-gray-400">{step.desc}</div>
                </div>
                {idx < data.sopSteps.length - 1 && <span className="text-orange-400 text-lg">→</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            {['数据层', '需求评审', '供应评审', '财务整合'].map((step, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{
                  background:
                    idx === 0
                      ? 'rgba(0,180,216,0.15)'
                      : idx === 1
                      ? 'rgba(245,124,0,0.15)'
                      : idx === 2
                      ? 'rgba(76,175,80,0.15)'
                      : 'rgba(156,39,176,0.15)',
                  border:
                    '1px solid ' +
                    (idx === 0
                      ? 'rgba(0,180,216,0.3)'
                      : idx === 1
                      ? 'rgba(245,124,0.3)'
                      : idx === 2
                      ? 'rgba(76,175,80,0.3)'
                      : 'rgba(156,39,176,0.3)'),
                  color:
                    idx === 0
                      ? '#00b4d8'
                      : idx === 1
                      ? '#f57c00'
                      : idx === 2
                      ? '#81c784'
                      : '#ce93d8'
                }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Card 3: MPS */}
        <div
          className="rounded-xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
          style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
          onClick={handleMpsClick}
        >
          <div
            className="text-xs text-orange-400 mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            主计划
          </div>
          <div
            className="flex items-center gap-2 mb-4 text-cyan-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
              🔐
            </span>
            <span className="font-semibold tracking-wide">MPS 枢纽作用</span>
          </div>
          <div className="flex gap-2 mb-3">
            {data.mpsZones.map((zone, idx) => (
              <div
                key={idx}
                className="flex-1 text-center rounded-lg py-2"
                style={{
                  border:
                    '1px solid ' +
                    (zone.status === 'frozen'
                      ? 'rgba(0,180,216,0.4)'
                      : zone.status === 'slushy'
                      ? 'rgba(245,124,0.4)'
                      : 'rgba(76,175,80,0.4)'),
                  background:
                    zone.status === 'frozen'
                      ? 'rgba(0,180,216,0.08)'
                      : zone.status === 'slushy'
                      ? 'rgba(245,124,0.08)'
                      : 'rgba(76,175,80,0.08)'
                }}
              >
                <div className="text-xl mb-1">{zone.icon}</div>
                <div
                  className="text-xs font-bold"
                  style={{
                    color:
                      zone.status === 'frozen'
                        ? '#00b4d8'
                        : zone.status === 'slushy'
                        ? '#f57c00'
                        : '#81c784'
                  }}
                >
                  {zone.name}
                </div>
                <div className="text-[9px] text-gray-400">{zone.desc}</div>
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full flex overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: '25%' }} />
            <div className="h-full bg-orange-400" style={{ width: '35%' }} />
            <div className="h-full bg-green-400" style={{ width: '40%' }} />
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-gray-400">
            <span>T+0</span>
            <span>▶ 隔离市场波动</span>
            <span>T+18M</span>
          </div>
        </div>

        {/* Card 4: 风险管理 */}
        <div
          className="row-span-2 rounded-xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
          style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
        >
          <div
            className="text-xs text-orange-400 mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            风险管理
          </div>
          <div
            className="flex items-center gap-2 mb-4 text-cyan-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
              🛡️
            </span>
            <span className="font-semibold tracking-wide">三道防线体系</span>
          </div>
          <div className="space-y-2">
            {data.defenseWalls.map((wall) => (
              <div
                key={wall.id}
                className="rounded-lg overflow-hidden border cursor-pointer hover:translate-x-1 transition-transform"
                style={{
                  borderColor:
                    wall.layer === 'prevent'
                      ? 'rgba(0,180,216,0.4)'
                      : wall.layer === 'buffer'
                      ? 'rgba(245,124,0.4)'
                      : 'rgba(76,175,80,0.4)'
                }}
                onClick={() => handleDefenseWallClick(wall.id)}
              >
                <div
                  className="h-8 flex items-center px-3 gap-2"
                  style={{
                    background:
                      wall.layer === 'prevent'
                        ? 'repeating-linear-gradient(90deg, rgba(0,180,216,0.18) 0px, rgba(0,180,216,0.18) 34px, rgba(0,180,216,0.06) 34px, rgba(0,180,216,0.06) 36px)'
                        : wall.layer === 'buffer'
                        ? 'repeating-linear-gradient(90deg, rgba(245,124,0.18) 0px, rgba(245,124,0.18) 34px, rgba(245,124,0.06) 34px, rgba(245,124,0.06) 36px)'
                        : 'repeating-linear-gradient(90deg, rgba(76,175,80,0.18) 0px, rgba(76,175,80,0.18) 34px, rgba(76,175,80,0.06) 34px, rgba(76,175,80,0.06) 36px)'
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-lg font-bold"
                    style={{
                      background:
                        wall.layer === 'prevent'
                          ? 'rgba(0,180,216,0.25)'
                          : wall.layer === 'buffer'
                          ? 'rgba(245,124,0.25)'
                          : 'rgba(76,175,80,0.25)',
                      color:
                        wall.layer === 'prevent'
                          ? '#00b4d8'
                          : wall.layer === 'buffer'
                          ? '#f57c00'
                          : '#81c784',
                      border:
                        '1px solid ' +
                        (wall.layer === 'prevent'
                          ? 'rgba(0,180,216,0.5)'
                          : wall.layer === 'buffer'
                          ? 'rgba(245,124,0.5)'
                          : 'rgba(76,175,80,0.5)')
                    }}
                  >
                    {wall.id}
                  </div>
                  <div
                    className="text-sm font-bold flex-1"
                    style={{
                      color:
                        wall.layer === 'prevent'
                          ? '#00b4d8'
                          : wall.layer === 'buffer'
                          ? '#f57c00'
                          : '#81c784',
                      fontFamily: 'Rajdhani, sans-serif'
                    }}
                  >
                    {wall.title}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        wall.layer === 'prevent'
                          ? 'rgba(0,180,216,0.15)'
                          : wall.layer === 'buffer'
                          ? 'rgba(245,124,0.15)'
                          : 'rgba(76,175,80,0.15)',
                      border:
                        '1px solid ' +
                        (wall.layer === 'prevent'
                          ? 'rgba(0,180,216,0.3)'
                          : wall.layer === 'buffer'
                          ? 'rgba(245,124,0.3)'
                          : 'rgba(76,175,80,0.3)'),
                      color:
                        wall.layer === 'prevent'
                          ? '#00b4d8'
                          : wall.layer === 'buffer'
                          ? '#f57c00'
                          : '#81c784'
                    }}
                  >
                    {wall.layer === 'prevent' ? '预防层' : wall.layer === 'buffer' ? '缓冲层' : '响应层'}
                  </span>
                </div>
                <div className="p-3 bg-black/20">
                  <div className="text-xs text-gray-400 mb-2">{wall.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {wall.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {data.defenseWalls.map((wall) => (
              <div
                key={wall.id}
                className="text-center p-2 rounded-lg bg-white/5 border border-white/10"
              >
                <div
                  className="text-lg font-bold"
                  style={{
                    color:
                      wall.metrics.color === 'cyan'
                        ? '#00b4d8'
                        : wall.metrics.color === 'green'
                        ? '#81c784'
                        : '#f57c00',
                    fontFamily: 'Rajdhani, sans-serif'
                  }}
                >
                  {wall.metrics.value}
                </div>
                <div className="text-[9px] text-gray-400">{wall.metrics.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 5: 交付模式 */}
        <div
          className="rounded-xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
          style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
          onClick={handleDeliveryModeClick}
        >
          <div
            className="text-xs text-orange-400 mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            差异化交付
          </div>
          <div
            className="flex items-center gap-2 mb-4 text-cyan-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
              🚚
            </span>
            <span className="font-semibold tracking-wide">MTS → ETO 模式谱系</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            {data.deliveryModes.map((mode, idx) => (
              <React.Fragment key={mode.code}>
                <div
                  className="flex-1 text-center rounded-lg py-2"
                  style={{
                    border:
                      '1px solid ' +
                      (mode.type === 'mts'
                        ? 'rgba(0,180,216,0.3)'
                        : mode.type === 'dp'
                        ? 'rgba(245,124,0.5)'
                        : 'rgba(76,175,80,0.3)'),
                    background:
                      mode.type === 'mts'
                        ? 'rgba(0,180,216,0.07)'
                        : mode.type === 'dp'
                        ? 'rgba(245,124,0.1)'
                        : 'rgba(76,175,80,0.07)'
                  }}
                >
                  <div className="text-lg mb-1">{mode.icon}</div>
                  <div
                    className="text-xs font-bold"
                    style={{
                      color:
                        mode.type === 'mts'
                          ? '#00b4d8'
                          : mode.type === 'dp'
                          ? '#f57c00'
                          : '#81c784',
                      fontFamily: 'Rajdhani, sans-serif'
                    }}
                  >
                    {mode.code}
                  </div>
                  <div className="text-[9px] text-gray-400">{mode.name}</div>
                </div>
                {idx < data.deliveryModes.length - 1 && <span className="text-orange-400 text-sm">→</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-2">
            <div
              className="flex-1 rounded-lg p-2"
              style={{
                background: 'rgba(0,180,216,0.06)',
                border: '1px solid rgba(0,180,216,0.2)'
              }}
            >
              <div className="text-xs font-bold text-cyan-400 mb-1">推式 PUSH</div>
              <div className="text-xs text-gray-400">基于预测驱动，低交期</div>
            </div>
            <div
              className="flex-1 rounded-lg p-2"
              style={{
                background: 'rgba(76,175,80,0.06)',
                border: '1px solid rgba(76,175,80,0.2)'
              }}
            >
              <div className="text-xs font-bold text-green-400 mb-1">拉式 PULL</div>
              <div className="text-xs text-gray-400">基于订单驱动，高灵活</div>
            </div>
          </div>
        </div>

        {/* Card 6: SCOR雷达图 */}
        <div
          className="rounded-xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
          style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
          onClick={handleScorClick}
        >
          <div
            className="text-xs text-orange-400 mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            绩效度量
          </div>
          <div
            className="flex items-center gap-2 mb-2 text-cyan-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
              📡
            </span>
            <span className="font-semibold tracking-wide">SCOR 五大指标雷达</span>
          </div>
          <ReactECharts
            option={getRadarOption()}
            style={{ height: '160px', width: '100%' }}
          />
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {data.scorData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.name.split(' ')[0]} · {s.value}%
              </div>
            ))}
          </div>
        </div>

        {/* Card 7: 四大支柱 */}
        <div
          className="col-span-2 rounded-xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
          style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}
        >
          <div
            className="text-xs text-orange-400 mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            底层逻辑
          </div>
          <div
            className="flex items-center gap-2 mb-4 text-cyan-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
              🏛️
            </span>
            <span className="font-semibold tracking-wide">四大支撑支柱</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {data.fourPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-lg p-3 bg-white/5 border border-white/10 hover:-translate-y-1 transition-all cursor-pointer"
                style={{ borderTop: '2px solid ' + pillar.color }}
                onClick={() => handleFourPillarClick(pillar.path)}
              >
                <div className="text-xl mb-2">{pillar.icon}</div>
                <div className="text-sm font-bold mb-1" style={{ color: pillar.color }}>
                  {pillar.title}
                </div>
                <div className="text-xs text-gray-400 mb-2">{pillar.sub}</div>
                <div className="text-xs text-gray-500 leading-tight">{pillar.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
