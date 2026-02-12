// App.tsx - 主应用
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/p1_Dashboard';
import DemandForecast from './pages/p2_DemandForecast';
import SupplyBalance from './pages/p3_SupplyBalance';
import SupplierRisk from './pages/p4_SupplierRisk';
import ProcurementAI from './pages/p5_ProcurementAI';

const Header: React.FC = () => (
  <header className="h-14 bg-base border-b border-border flex items-center justify-between px-6">
    <div className="flex items-center gap-4">
      <h2 className="text-sm text-secondary">2026年10月8日 · 周三</h2>
    </div>
    <div className="flex items-center gap-4">
      <button className="relative p-2 text-secondary hover:text-primary">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">3</span>
      </button>
      <div className="flex items-center gap-2 pl-4 border-l border-border">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm">王</div>
        <div className="text-sm">
          <p className="text-primary">王志远</p>
          <p className="text-xs text-muted">供应链总监</p>
        </div>
      </div>
    </div>
  </header>
);

const App: React.FC = () => (
  <BrowserRouter>
    <div className="h-screen bg-base flex">
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
          </Routes>
        </div>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
