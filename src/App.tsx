import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { ToastProvider } from './hooks/useToast';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './features/dashboard';
import DemandForecast from './features/demand-forecast';
import SupplyBalance from './features/supply-balance';
import SupplierRisk from './features/supplier-risk';
import ProcurementAI from './features/procurement-ai';
import SOP from './features/sop';
import MPS from './features/mps';
import OTCFlow from './features/otc-flow';
import KPIDashboard from './features/kpi';
import AlertRules from './features/p10_AlertRules';
import ATPCheck from './features/p11_ATPCheck';
import InventoryWorkbench from './features/p05_Inventory';
import ScenarioSim from './features/p12_ScenarioSim';
import Variance from './features/p13_Variance';
import Meeting from './features/p14_Meeting';
import RCCP from './features/p15_RCCP';
import SupplierScore from './features/p16_SupplierScore';
import Decision from './features/p17_Decision';
import SupplierPortal from './features/supplier-portal';

const PlaceholderPage = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex flex-col items-center justify-center h-full" style={{ color: '#445568' }}>
    <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" 
      style={{ background: 'rgba(45,125,210,0.08)', border: '1px solid #1E2D45' }}>
      <span className="text-2xl">🔧</span>
    </div>
    <h2 className="text-xl font-display mb-2" style={{ color: '#7A8BA8' }}>{title}</h2>
    <p className="text-sm mb-6" style={{ color: '#445568' }}>{desc}</p>
    <p className="text-xs px-4 py-2 rounded" 
      style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid rgba(45,125,210,0.2)', color: '#2D7DD2' }}>
      此模块在演示版中标记为规划中，完整功能见详细演示
    </p>
  </div>
);

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

const App: React.FC = () => (
  <ToastProvider>
    <BrowserRouter>
      <div className="h-screen flex" style={{ background: '#0B0F17' }}>
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/demand" element={<DemandForecast />} />
              <Route path="/supply" element={<SupplyBalance />} />
              <Route path="/procurement" element={<ProcurementAI />} />
              <Route path="/risk" element={<SupplierRisk />} />
              <Route path="/sop" element={<SOP />} />
              <Route path="/mps" element={<MPS />} />
              <Route path="/otc-flow" element={<OTCFlow />} />
              <Route path="/alert-rules" element={<AlertRules />} />
              <Route path="/atp-check" element={<ATPCheck />} />
              <Route path="/kpi" element={<KPIDashboard />} />
              <Route path="/inventory" element={<InventoryWorkbench />} />
              <Route path="/scenario" element={<ScenarioSim />} />
              <Route path="/variance" element={<Variance />} />
              <Route path="/sop-meeting" element={<Meeting />} />
              <Route path="/rccp" element={<RCCP />} />
              <Route path="/supplier-score" element={<SupplierScore />} />
              <Route path="/decision" element={<Decision />} />
              <Route path="/supplier" element={<SupplierRisk />} />
              <Route path="/supplier-portal" element={<SupplierPortal />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  </ToastProvider>
);

export default App;
