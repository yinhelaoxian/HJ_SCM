# 性能测试配置
# K6 测试脚本

// 登录压测
export const options = {
  stages: [
    { duration: '30s', vus: 10 },
    { duration: '1m', vus: 50 },
    { duration: '30s', vus: 10 }
  ]
};

export default function () {
  // API压测
  http.batch([
    ['GET', '/api/v1/dashboard'],
    ['GET', '/api/v1/inventory'],
    ['GET', '/api/v1/forecast']
  ]);
  
  sleep(1);
}

// 场景: 并发查询
export const scenarios = {
  'API查询': {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { target: 100, duration: '2m' }
    ]
  }
};

// 阈值
export const thresholds = {
  http_req_duration: ['p(95)<500'],
  http_req_duration: ['p(99)<1000' ],
  http_req_failed: ['rate<0.01']
};
