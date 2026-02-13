import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { ToastProvider } from './hooks/useToast';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/p1_Dashboard';
import DemandForecast from './pages/p2_DemandForecast';
import SupplyBalance from './pages/p3_SupplyBalance';
import SupplierRisk from './pages/p4_SupplierRisk';
import ProcurementAI from './pages/p5_ProcurementAI';
import SOP from './pages/p6_SOP';
import MPS from './pages/p7_MPS';
import OTCFlow from './pages/p8_OTCFlow';
import KPIDashboard from './pages/p9_KPI';
import AlertRules from './pages/p10_AlertRules';
import ATPCheck from './pages/p11_ATPCheck';

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

const Header = () => (
  <header className="h-14 flex items-center justify-between px-6" 
    style={{ background: '#0B0F17', borderBottom: '1px solid #1E2D45' }}>
    <div className="flex items-center gap-4">
      <h2 className="text-sm" style={{ color: '#7A8BA8' }}>2026年10月8日 · 周三</h2>
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
              <Route path="/supplier" element={<SupplierRisk />} />
              <Route path="/inventory" element={<PlaceholderPage title="库存管理" desc="安全库存 · ABC分析 · 呆滞处置" />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  </ToastProvider>
);

export default App;
