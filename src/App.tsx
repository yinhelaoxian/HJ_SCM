import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { ToastProvider } from './hooks/useToast';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './features/dashboard';
import DemandForecast from './features/demand-forecast';
import SOP from './features/sop';
import MPS from './features/mps';
import RCCP from './features/p15_RCCP';
import KPIDashboard from './features/kpi';
import AlertRules from './features/p10_AlertRules';
import ATPCheck from './features/p11_ATPCheck';
import InventoryWorkbench from './features/p05_Inventory';
import Variance from './features/p13_Variance';
import Meeting from './features/p14_Meeting';
import SupplierScore from './features/p16_SupplierScore';
import Decision from './features/p17_Decision';
import SupplierPortal from './features/supplier-portal';
import ScenarioSim from './features/p12_ScenarioSim';
import DemandSensePage from './features/demand-sense';
import PromotionsPage from './features/promotions';
import MRPPage from './features/mrp';
import KittingPage from './features/kitting';
import SafetyStockPage from './features/safety-stock';
import ABCXYZPage from './features/abc-xyz';
import StagnationPage from './features/stagnation';
import ProductionPage from './features/production';
import LogisticsPage from './features/logistics';
import ShipmentPage from './features/shipment';
import FreightPage from './features/freight';
import StrategyPage from './features/strategy';
import RiskDashboardPage from './features/risk-dashboard';
import SCORDashboardPage from './features/kpi-scor';
// MDM 模块
import MaterialManagementPage from './features/mdm-material';
import BOMManagementPage from './features/mdm-bom';
import SupplierManagementPage from './features/mdm-supplier';

/**
 * 占位符页面组件
 */
const PlaceholderPage = ({ title, desc, emoji = '🔧' }: { title: string; desc: string; emoji?: string }) => (
  <div className="flex flex-col items-center justify-center h-full" style={{ color: '#445568' }}>
    <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" 
      style={{ background: 'rgba(45,125,210,0.08)', border: '1px solid #1E2D45' }}>
      <span className="text-2xl">{emoji}</span>
    </div>
    <h2 className="text-xl font-display mb-2" style={{ color: '#7A8BA8' }}>{title}</h2>
    <p className="text-sm mb-6" style={{ color: '#445568' }}>{desc}</p>
    <p className="text-xs px-4 py-2 rounded" 
      style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid rgba(45,125,210,0.2', color: '#2D7DD2' }}>
      此模块在演示版中标记为规划中，完整功能见详细演示
    </p>
  </div>
);

/**
 * 头部组件
 */
const Header = () => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  
  return (
    <header className="h-14 flex items-center justify-between px-6" 
      style={{ background: '#0B0F17', borderBottom: '1px solid #1E2D45' }}>
      <div className="flex items-center gap-4">
        <h2 className="text-sm" style={{ color: '#7A8BA8' }}>{dateStr}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2" style={{ color: '#7A8BA8' }}>
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l" style={{ borderColor: '#1E2D45' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" 
            style={{ background: '#2D7DD2' }}>王</div>
          <div className="text-sm">
            <p className="font-medium" style={{ color: '#E8EDF4' }}>王志远</p>
            <p className="text-xs" style={{ color: '#445568' }}>供应链总监</p>
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * App 根组件 v3.0
 * 
 * 路由结构：
 * - MDM 主数据管理（新增）
 * - 需求管理 → S&OP → MPS → MRP → 采购 → 库存 → 生产 → 物流 → 绩效 → 异常
 */
const App: React.FC = () => (
  <ToastProvider>
    <BrowserRouter>
      <div className="h-screen flex" style={{ background: '#0B0F17' }}>
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto p-6">
            <Routes>
              {/* === 指挥中心 === */}
              <Route path="/" element={<Dashboard />} />
              
              {/* === MDM 主数据管理（新增）=== */}
              <Route path="/mdm/material" element={<MaterialManagementPage />} />
              <Route path="/mdm/bom" element={<BOMManagementPage />} />
              <Route path="/mdm/supplier" element={<SupplierManagementPage />} />
              
              {/* === 需求管理 === */}
              <Route path="/demand" element={<DemandForecast />} />
              <Route path="/demand-sense" element={<DemandSensePage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              
              {/* === S&OP 产销协同 === */}
              <Route path="/sop" element={<SOP />} />
              <Route path="/sop/balance" element={<SOP />} />
              <Route path="/sop/whatif" element={<ScenarioSim />} />
              <Route path="/sop/review" element={<Meeting />} />
              <Route path="/sop/rccp" element={<RCCP />} />
              <Route path="/variance" element={<Variance />} />
              <Route path="/sop-meeting" element={<Meeting />} />
              
              {/* === MPS 主生产计划 === */}
              <Route path="/mps" element={<MPS />} />
              <Route path="/mps/gantt" element={<MPS />} />
              <Route path="/mps/atp" element={<ATPCheck />} />
              
              {/* === MRP 物料计划 === */}
              <Route path="/mrp" element={<MRPPage />} />
              <Route path="/mrp/suggestions" element={
                <PlaceholderPage title="采购建议" desc="智能建议、历史对比" emoji="📝" />
              } />
              <Route path="/mrp/production" element={
                <PlaceholderPage title="工单建议" desc="生产工单建议生成" emoji="🏭" />
              } />
              <Route path="/kitting" element={<KittingPage />} />
              
              {/* === 采购与供应 === */}
              <Route path="/procurement" element={
                <PlaceholderPage title="AI 采购建议" desc="智能建议、历史对比" emoji="🤖" />
              } />
              <Route path="/supplier" element={<SupplierScore />} />
              <Route path="/supplier/risk" element={
                <PlaceholderPage title="供应商风险" desc="风险雷达、传播链分析" emoji="⚠️" />
              } />
              <Route path="/supplier/score" element={<SupplierScore />} />
              <Route path="/supplier/portal" element={<SupplierPortal />} />
              <Route path="/supplier/contracts" element={
                <PlaceholderPage title="合同管理" desc="供应商合同管理" emoji="📄" />
              } />
              
              {/* === 库存管理 === */}
              <Route path="/inventory" element={<InventoryWorkbench />} />
              <Route path="/inventory/safety" element={<SafetyStockPage />} />
              <Route path="/inventory/abc" element={<ABCXYZPage />} />
              <Route path="/inventory/stagnation" element={<StagnationPage />} />
              
              {/* === 生产执行 === */}
              <Route path="/production" element={<ProductionPage />} />
              <Route path="/production/schedule" element={<ProductionPage />} />
              <Route path="/production/issue" element={
                <PlaceholderPage title="投料管理" desc="领料、批次绑定" emoji="📥" />
              } />
              <Route path="/production/completion" element={
                <PlaceholderPage title="完工汇报" desc="质检结果、入库确认" emoji="✅" />
              } />
              <Route path="/otc-flow" element={
                <PlaceholderPage title="订单追踪" desc="全链路进度可视化" emoji="🔗" />
              } />
              
              {/* === 物流交付 === */}
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/logistics/shipment" element={<ShipmentPage />} />
              <Route path="/logistics/freight" element={<FreightPage />} />
              
              {/* === 战略层 === */}
              <Route path="/strategy" element={<StrategyPage />} />
              
              {/* === 风险监控 === */}
              <Route path="/risk/dashboard" element={<RiskDashboardPage />} />
              <Route path="/risk/forecast" element={
                <PlaceholderPage title="预测风险" desc="第一道防线" emoji="📈" />
              } />
              <Route path="/risk/inventory" element={
                <PlaceholderPage title="库存风险" desc="第二道防线" emoji="📦" />
              } />
              <Route path="/risk/execution" element={
                <PlaceholderPage title="执行风险" desc="第三道防线" emoji="🏭" />
              } />
              
              {/* === 绩效分析 === */}
              <Route path="/kpi" element={<KPIDashboard />} />
              <Route path="/kpi/trend" element={<KPIDashboard />} />
              <Route path="/kpi/benchmark" element={
                <PlaceholderPage title="对标分析" desc="行业对标、趋势对比" emoji="🎯" />
              } />
              <Route path="/kpi/pyramid" element={<SCORDashboardPage />} />
              <Route path="/reports" element={
                <PlaceholderPage title="自助报表" desc="多维分析、数据导出" emoji="📈" />
              } />
              <Route path="/decision" element={<Decision />} />
              
              {/* === 异常工作台 === */}
              <Route path="/exceptions" element={
                <PlaceholderPage title="智能异常" desc="跨模块异常聚合" emoji="🚨" />
              } />
              <Route path="/alert-rules" element={<AlertRules />} />
              
              {/* 404 重定向 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  </ToastProvider>
);

export default App;
