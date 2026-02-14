# HJ SCM 项目中间件清单 v1.0

**版本**: v1.0  
**日期**: 2026-02-14  
**适用范围**: HJ SCM 演示系统  

---

## 1. 概述

本文档列出 HJ SCM 项目所依赖的所有中间件、运行时环境及其配置要求。

---

## 2. 运行时环境

### 2.1 必需组件

| 组件 | 版本 | 用途 | 安装位置 | 必需性 |
|------|------|------|----------|--------|
| **Node.js** | 20+ | 前端运行时 | 系统/Docker | ✅ 必需 |
| **npm/yarn** | 10+ | 包管理器 | Node.js 捆绑 | ✅ 必需 |
| **Java** | 17+ | 后端运行时 | Docker | ⚠️ 可选 |
| **Maven** | 3.8+ | 后端构建 | Docker | ⚠️ 可选 |
| **Docker** | 24+ | 容器化 | 系统 | ✅ 推荐 |

### 2.2 可选组件

| 组件 | 版本 | 用途 | 安装位置 | 必需性 |
|------|------|------|----------|--------|
| **PostgreSQL** | 14+ | 主数据库 | Docker | ⚠️ 可选（演示用内存） |
| **Redis** | 7+ | 缓存/会话 | Docker | ⚠️ 可选（演示用内存） |
| **Elasticsearch** | 8+ | 日志/搜索 | Docker | ❌ 可选 |
| **Kafka** | 3+ | 消息队列 | Docker | ❌ 可选 |

---

## 3. 前端依赖

### 3.1 运行时依赖

```json
{
  "dependencies": {
    // === 核心框架 ===
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    
    // === 状态管理 ===
    "zustand": "^4.4.0",
    "react-query": "^3.39.0",
    
    // === UI 组件 ===
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0",
    
    // === 工具库 ===
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "uuid": "^9.0.0"
  }
}
```

### 3.2 开发依赖

```json
{
  "devDependencies": {
    // === 构建工具 ===
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    
    // === CSS ===
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    
    // === 测试 ===
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    
    // === 代码质量 ===
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0"
  }
}
```

---

## 4. 后端依赖（参考实现）

### 4.1 Maven 依赖

```xml
<dependencies>
  <!-- Spring Boot -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
    <version>3.2.0</version>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- 数据库 -->
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.6.0</version>
  </dependency>
  <dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
  </dependency>
  
  <!-- 缓存 -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- 消息队列 -->
  <dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
    <version>3.0.0</version>
  </dependency>
  
  <!-- 开发工具 -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
</dependencies>
```

### 4.2 Python 依赖（ML 服务）

```txt
# requirements-ml.txt
numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
scipy>=1.11.0
statsmodels>=0.14.0
joblib>=1.3.0
xgboost>=1.7.0
lightgbm>=4.0.0
prophet>=1.1.0
```

---

## 5. Docker 环境配置

### 5.1 开发环境

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: hjscm
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: hjscm
      DB_USER: postgres
      DB_PASSWORD: postgres
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "8080:8080"
    volumes:
      - ./src:/app/src
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

volumes:
  postgres_data:
  redis_data:
```

### 5.2 生产环境

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_prod_data:/data

  backend:
    image: ${REGISTRY}/hjscm-backend:${TAG}
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${POSTGRES_DB}
      DB_USER: ${POSTGRES_USER}
      DB_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      depends_on:
        postgres:
          condition: service_healthy
      deploy:
        resources:
          limits:
            cpus: '2'
            memory: 2G

volumes:
  postgres_prod_data:
  redis_prod_data:
```

---

## 6. 中间件配置

### 6.1 PostgreSQL 配置

```sql
-- 数据库初始化脚本
CREATE DATABASE hjscm;

-- 关键扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 性能优化
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '64MB';
```

### 6.2 Redis 配置

```bash
# redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
```

### 6.3 Kafka 配置

```properties
# Kafka 配置
bootstrap.servers=localhost:9092
auto.create.topics.enable=true
default.replication.factor=1
offsets.topic.replication.factor=1
```

---

## 7. 环境变量

### 7.1 前端环境变量

```bash
# .env.production
VITE_API_BASE_URL=https://api.hjscm.com
VITE_WS_URL=wss://ws.hjscm.com
```

### 7.2 后端环境变量

```bash
# application-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
  data:
    redis:
      host: ${REDIS_HOST}
      password: ${REDIS_PASSWORD}
  kafka:
    bootstrap-servers: ${KAFKA_HOST}:${KAFKA_PORT}
```

---

## 8. 基础设施要求

### 8.1 开发环境

| 资源 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 2 核 | 4 核 |
| 内存 | 4 GB | 8 GB |
| 存储 | 10 GB | 20 GB |
| 网络 | 100 Mbps | 1 Gbps |

### 8.2 生产环境

| 资源 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 4 核 | 8 核 |
| 内存 | 8 GB | 16 GB |
| 存储 | 50 GB SSD | 100 GB SSD |
| 网络 | 1 Gbps | 10 Gbps |

### 8.3 Kubernetes 生产部署

```yaml
# k8s/deployment.yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "2000m"

livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 60
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 5
```

---

## 9. 依赖版本兼容性

### 9.1 前端兼容性

| 组件 | 最低版本 | 最高测试版本 | 备注 |
|------|-----------|----------------|------|
| Node.js | 18.0.0 | 20.x | 当前使用 20.x |
| npm | 9.0.0 | 10.x | 当前使用 10.x |
| Chrome | 90 | 120 | 主要测试浏览器 |
| Firefox | 90 | 120 | 次要测试浏览器 |
| Safari | 15 | 17 | macOS 测试 |
| Edge | 90 | 120 | Windows 测试 |

### 9.2 后端兼容性

| 组件 | 最低版本 | 最高测试版本 | 备注 |
|------|-----------|----------------|------|
| Java | 17 | 21 | 当前使用 17 |
| Spring Boot | 3.0.0 | 3.2.x | 当前使用 3.2.x |
| PostgreSQL | 13 | 16 | 当前使用 14 |
| Redis | 6.0 | 7.x | 当前使用 7.x |
| Kafka | 3.0 | 3.6 | 当前使用 3.0 |

---

## 10. 安装脚本

### 10.1 一键安装脚本

```bash
#!/bin/bash
# install-dependencies.sh

set -e

echo "🚀 安装 HJ SCM 开发环境..."

# 1. 安装 Docker
if ! command -v docker &> /dev/null; then
    echo "📦 安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# 2. 安装 Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo "📦 安装 Docker Compose..."
    mkdir -p ~/.docker/cli-plugins
    curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
    chmod +x ~/.docker/cli-plugins/docker-compose
fi

# 3. 启动服务
echo "🚀 启动中间件服务..."
docker compose -f docker-compose.dev.yml up -d

# 4. 安装 Node.js（如果未安装）
if ! command -v node &> /dev/null; then
    echo "📦 安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 5. 安装前端依赖
echo "📦 安装前端依赖..."
npm ci

echo "✅ 环境安装完成！"
echo ""
echo "服务地址："
echo "  - 前端: http://localhost:3000"
echo "  - 后端: http://localhost:8080"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
```

---

## 11. 故障排除

### 11.1 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Docker 权限拒绝 | 用户不在 docker 组 | `sudo usermod -aG docker $USER` |
| 端口冲突 | 端口已被占用 | 修改端口映射或停止冲突进程 |
| 内存不足 | Docker 容器内存限制 | 增加 Docker 内存限制 |
| 网络连接失败 | 中间件未启动 | `docker compose ps` 检查状态 |

### 11.2 日志查看

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f backend

# 查看前20行日志
docker compose logs --tail 20
```

---

## 12. 相关文档

| 文档 | 路径 |
|------|------|
| 部署指南 | `BACKEND_DEPLOYMENT_GUIDE.md` |
| K8s 配置 | `deployments/k8s/` |
| CI/CD 配置 | `Jenkinsfile` |
| 测试计划 | `docs/04_TECHNICAL/TEST_PLAN_SPRINT9_v1.0.md` |

---

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14  
> **状态**: 已完成
