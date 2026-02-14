# Beta 部署检查清单

## 1. 环境检查
- [ ] Node.js版本 >=18
- [ ] PostgreSQL连接
- [ ] Redis连接
- [ ] Kafka连接

## 2. 构建检查
- [ ] npm install
- [ ] npm run build

## 3. 部署执行
```bash
docker build -t hjscm:beta .
docker run -d -p 80:3000 --env-file .env.production hjscm:beta
```

## 4. 健康检查
- [ ] GET /health
- [ ] GET /api/v1/dashboard
- [ ] GET /api/v1/forecast
