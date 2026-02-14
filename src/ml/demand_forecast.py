"""
需求预测 ML 模型
支持：季节性分解/趋势分析/异常检测

功能：
- 历史数据分析
- 季节性分解
- 趋势预测
- 异常检测
- 置信区间计算
"""

import json
import math
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass


@dataclass
class ForecastResult:
    """预测结果"""
    material_id: str
    forecasts: List[Dict]  # 未来13周预测
    confidence_intervals: List[Tuple[float, float]]  # 置信区间
    seasonal_factors: Dict[str, float]  # 季节性因子
    trend_factor: float  # 趋势因子
    accuracy: float  # 历史准确率
    anomalies: List[Dict]  # 异常检测结果


class DemandForecastModel:
    """
    需求预测模型
    
    支持多种预测方法：
    - 移动平均 (MA)
    - 指数平滑 (ETS)
    - 季节性分解 (Seasonal Decomposition)
    """
    
    def __init__(self):
        self.history_data: Dict[str, List[Dict]] = {}  # 历史数据缓存
        self.models = {
            'ma': self._ma_forecast,
            'ets': self._ets_forecast,
            'seasonal': self._seasonal_forecast
        }
    
    def load_history(self, material_id: str, weeks: int = 52) -> List[Dict]:
        """
        加载历史需求数据
        
        Args:
            material_id: 物料编码
            weeks: 加载周数
            
        Returns:
            历史需求数据列表
        """
        # 模拟历史数据（实际应从数据库加载）
        if material_id not in self.history_data:
            self.history_data[material_id] = self._generate_mock_history(material_id, weeks)
        
        return self.history_data[material_id]
    
    def forecast(
        self, 
        material_id: str, 
        weeks: int = 13,
        method: str = 'seasonal'
    ) -> ForecastResult:
        """
        执行需求预测
        
        Args:
            material_id: 物料编码
            weeks: 预测周数
            method: 预测方法 (ma/ets/seasonal)
            
        Returns:
            预测结果
        """
        # 1. 加载历史数据
        history = self.load_history(material_id, weeks * 4)  # 4倍历史
        
        # 2. 季节性分解
        seasonal = self._decompose_seasonal(history)
        
        # 3. 趋势分析
        trend = self._analyze_trend(history)
        
        # 4. 异常检测
        anomalies = self._detect_anomalies(history)
        
        # 5. 执行预测
        forecasts = self.models[method](history, seasonal, weeks)
        
        # 6. 计算置信区间
        confidence = self._calculate_confidence_intervals(history, forecasts, weeks)
        
        # 7. 计算准确率
        accuracy = self._evaluate_accuracy(history, forecasts[-weeks:])
        
        return ForecastResult(
            material_id=material_id,
            forecasts=forecasts,
            confidence_intervals=confidence,
            seasonal_factors=seasonal,
            trend_factor=trend,
            accuracy=accuracy,
            anomalies=anomalies
        )
    
    def _generate_mock_history(self, material_id: str, weeks: int) -> List[Dict]:
        """生成模拟历史数据"""
        data = []
        base_date = datetime.now() - timedelta(weeks=weeks)
        
        # 根据物料类型生成不同的模式
        if 'MED' in material_id:
            base_value = 500
            seasonal_pattern = [1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.0]
        elif 'IMP' in material_id:
            base_value = 300
            seasonal_pattern = [1.0, 0.9, 0.8, 0.9, 1.0, 1.1, 1.1, 1.0, 0.9, 0.8, 0.8, 0.9, 1.0]
        else:
            base_value = 800
            seasonal_pattern = [1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 0.9, 0.9, 1.0, 1.0]
        
        for week in range(weeks):
            date = base_date + timedelta(weeks=week)
            seasonal_idx = week % 13
            seasonal_factor = seasonal_pattern[seasonal_idx]
            
            # 添加趋势
            trend_adjustment = 1 + (week * 0.005)  # 每周0.5%增长
            
            # 添加随机波动
            noise = (hash(f"{material_id}{week}") % 20 - 10) / 100
            
            quantity = base_value * seasonal_factor * trend_adjustment * (1 + noise)
            
            data.append({
                'date': date.strftime('%Y-%m-%d'),
                'week': week + 1,
                'quantity': max(0, round(quantity, 0)),
                'seasonal_factor': seasonal_factor,
                'type': 'ACTUAL'
            })
        
        return data
    
    def _decompose_seasonal(self, history: List[Dict]) -> Dict[str, float]:
        """
        季节性分解
        
        Returns:
            各周季节性因子
        """
        seasonal_factors = {}
        weeks_13 = {}
        
        for record in history:
            week = record['week'] % 13
            quantity = record['quantity']
            
            if week not in weeks_13:
                weeks_13[week] = []
            weeks_13[week].append(quantity)
        
        # 计算每周平均
        for week, quantities in weeks_13.items():
            seasonal_factors[f'W{week + 1}'] = sum(quantities) / len(quantities)
        
        # 归一化
        total = sum(seasonal_factors.values())
        for week in seasonal_factors:
            seasonal_factors[week] = seasonal_factors[week] / (total / 13)
        
        return seasonal_factors
    
    def _analyze_trend(self, history: List[Dict]) -> float:
        """趋势分析"""
        if len(history) < 2:
            return 1.0
        
        # 简单线性回归
        n = len(history)
        sum_x = sum(range(n))
        sum_y = sum(r['quantity'] for r in history)
        sum_xy = sum(i * r['quantity'] for i, r in enumerate(history))
        sum_xx = sum(i * i for i in range(n))
        
        slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x)
        
        # 趋势因子（相对于平均值的比例）
        avg = sum_y / n
        trend_factor = 1 + (slope / avg) if avg > 0 else 1.0
        
        return max(0.5, min(1.5, trend_factor))
    
    def _detect_anomalies(self, history: List[Dict]) -> List[Dict]:
        """异常检测（基于IQR方法）"""
        quantities = [r['quantity'] for r in history]
        sorted_q = sorted(quantities)
        q1 = sorted_q[len(sorted_q) // 4]
        q3 = sorted_q[len(sorted_q) * 3 // 4]
        iqr = q3 - q1
        
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        
        anomalies = []
        for record in history:
            if record['quantity'] < lower or record['quantity'] > upper:
                anomalies.append({
                    'date': record['date'],
                    'quantity': record['quantity'],
                    'type': 'LOW' if record['quantity'] < lower else 'HIGH',
                    'severity': abs(record['quantity'] - (q1 + q3) / 2) / iqr
                })
        
        return anomalies
    
    def _ma_forecast(
        self, 
        history: List[Dict], 
        seasonal: Dict,
        weeks: int
    ) -> List[Dict]:
        """移动平均预测"""
        # 计算移动平均
        window = 4
        ma_values = []
        for i in range(len(history)):
            start = max(0, i - window + 1)
            window_data = history[start:i + 1]
            ma_values.append(sum(r['quantity'] for r in window_data) / len(window_data))
        
        last_ma = ma_values[-1]
        
        forecasts = []
        base_date = datetime.now()
        seasonal_idx = len(history) % 13
        
        for week in range(weeks):
            date = base_date + timedelta(weeks=week + 1)
            seasonal_factor = list(seasonal.values())[seasonal_idx % 13]
            
            forecast = last_ma * seasonal_factor
            forecasts.append({
                'date': date.strftime('%Y-%m-%d'),
                'week': week + 1,
                'quantity': round(forecast, 0),
                'method': 'MA'
            })
            
            # 更新移动平均
            last_ma = (last_ma * window + forecast) / (window + 1)
        
        return forecasts
    
    def _ets_forecast(
        self, 
        history: List[Dict], 
        seasonal: Dict,
        weeks: int
    ) -> List[Dict]:
        """指数平滑预测"""
        # ETS (Error, Trend, Seasonal) 模型
        alpha = 0.3  # 水平平滑系数
        beta = 0.1  # 趋势平滑系数
        gamma = 0.2  # 季节性平滑系数
        
        quantities = [r['quantity'] for r in history]
        level = sum(quantities) / len(quantities)
        trend = 0
        
        forecasts = []
        base_date = datetime.now()
        seasonal_idx = len(history) % 13
        
        for week in range(weeks):
            date = base_date + timedelta(weeks=week + 1)
            seasonal_factor = list(seasonal.values())[seasonal_idx % 13]
            
            # 预测
            forecast = (level + trend) * seasonal_factor
            
            forecasts.append({
                'date': date.strftime('%Y-%m-%d'),
                'week': week + 1,
                'quantity': round(forecast, 0),
                'method': 'ETS'
            })
            
            # 更新状态
            actual = forecast  # 简化
            level = alpha * (actual / seasonal_factor) + (1 - alpha) * (level + trend)
            trend = beta * (level - (level - trend)) + (1 - beta) * trend
        
        return forecasts
    
    def _seasonal_forecast(
        self, 
        history: List[Dict], 
        seasonal: Dict,
        weeks: int
    ) -> List[Dict]:
        """季节性预测（综合方法）"""
        # 使用Holt-Winters简化版
        level = sum(r['quantity'] for r in history) / len(history)
        trend = self._analyze_trend(history)
        
        forecasts = []
        base_date = datetime.now()
        seasonal_idx = len(history) % 13
        
        for week in range(weeks):
            date = base_date + timedelta(weeks=week + 1)
            seasonal_factor = list(seasonal.values())[seasonal_idx % 13]
            
            # 季节性调整后的趋势预测
            forecast = level * trend * seasonal_factor
            
            forecasts.append({
                'date': date.strftime('%Y-%m-%d'),
                'week': week + 1,
                'quantity': round(forecast, 0),
                'method': 'SEASONAL'
            })
            
            # 更新水平值
            level = 0.3 * (forecast / seasonal_factor) + 0.7 * level
        
        return forecasts
    
    def _calculate_confidence_intervals(
        self, 
        history: List[Dict], 
        forecasts: List[Dict],
        weeks: int
    ) -> List[Tuple[float, float]]:
        """计算置信区间"""
        quantities = [r['quantity'] for r in history]
        std = statistics.stdev(quantities) if len(quantities) > 1 else quantities[0] * 0.1
        
        intervals = []
        for i, forecast in enumerate(forecasts):
            # 置信度随时间递减
            confidence = 0.95 * (0.95 ** i)
            margin = std * 1.96 * confidence
            
            lower = max(0, forecast['quantity'] - margin)
            upper = forecast['quantity'] + margin
            
            intervals.append((round(lower, 0), round(upper, 0)))
        
        return intervals
    
    def _evaluate_accuracy(
        self, 
        history: List[Dict], 
        forecasts: List[Dict]
    ) -> float:
        """评估预测准确率（MAPE）"""
        if len(forecasts) > len(history):
            forecasts = forecasts[-len(history):]
        
        mape = 0
        count = 0
        for i, (actual, forecast) in enumerate(zip(history[-len(forecasts):], forecasts)):
            if actual['quantity'] > 0:
                mape += abs((actual['quantity'] - forecast['quantity']) / actual['quantity'])
                count += 1
        
        accuracy = (1 - mape / count * 100) if count > 0 else 0.85
        return round(max(0, min(1, accuracy)), 0.85


# ==================== API 接口 ====================

def create_forecast_api(request: Dict) -> Dict:
    """
    创建预测请求
    
    Request:
    {
        "material_id": "MED-MOTOR-001",
        "weeks": 13,
        "method": "seasonal"
    }
    """
    model = DemandForecastModel()
    result = model.forecast(
        request['material_id'],
        request.get('weeks', 13),
        request.get('method', 'seasonal')
    )
    
    return {
        'success': True,
        'material_id': result.material_id,
        'forecasts': result.forecasts,
        'confidence_intervals': [
            {'lower': lower, 'upper': upper}
            for lower, upper in result.confidence_intervals
        ],
        'seasonal_factors': result.seasonal_factors,
        'trend_factor': result.trend_factor,
        'accuracy': result.accuracy,
        'anomalies': result.anomalies
    }


if __name__ == '__main__':
    # 测试预测
    model = DemandForecastModel()
    result = model.forecast('MED-MOTOR-001')
    
    print(f"预测准确率: {result.accuracy:.1%}")
    print(f"趋势因子: {result.trend_factor:.2f}")
    print(f"异常检测: {len(result.anomalies)}个")
    print(f"\n未来13周预测:")
    for f in result.forecasts[:4]:
        print(f"  W{f['week']}: {f['quantity']:.0f}")
