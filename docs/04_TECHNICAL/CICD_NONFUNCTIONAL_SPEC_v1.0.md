# CI/CD & 非功能性需求规范 v1.0

**文档.0  
**版本**: v1状态**: Draft  
**生效日期**: 2026-02-14  
**适用范围**: HJ_SCM 全系统  

---

## 1. CI/CD 流程设计

### 1.1 流水线架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD Pipeline Architecture                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        GitHub Repository                              │  │
│  │                    (main / feature branches)                          │  │
│  └───────────────────────────────┬──────────────────────────────────────┘  │
│                                  │                                           │
│                                  ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    GitHub Actions Workflow                            │  │
│  │                                                                      │  │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐        │  │
│  │  │  Trigger│───▶│  Build  │───▶│  Test   │───▶│ Deploy  │        │  │
│  │  │ (push/PR)│    │ (Maven) │    │(JUnit)  │    │(K8s)    │        │  │
│  │  └─────────┘    └─────────┘    └─────────┘    └─────────┘        │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                  │                                           │
│              ┌───────────────────┼───────────────────┐                      │
│              ▼                   ▼                   ▼                      │
│      ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│      │   DEV       │     │   TEST      │     │   PROD      │              │
│      │  Namespace  │     │  Namespace  │     │  Namespace  │              │
│      └─────────────┘     └─────────────┘     └─────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Build Frontend
        working-directory: ./frontend
        run: |
          npm ci
          npm run build
          
      - name: Build Backend
        working-directory: ./backend
        run: |
          mvn clean package -DskipTests
          
      - name: Run Tests
        working-directory: ./backend
        run: |
          mvn test
          
      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

### 1.3 Jenkinsfile（如使用 Jenkins）

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'ghcr.io'
        IMAGE_NAME = 'hj-scm'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Unit Tests') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push()
                }
            }
        }
        
        stage('Deploy to DEV') {
            steps {
                sh "kubectl set image deployment/hj-scm backend=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} -n dev"
            }
            when {
                branch 'develop'
            }
        }
        
        stage('Deploy to PROD') {
            steps {
                sh "kubectl set image deployment/hj-scm backend=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} -n prod"
            }
            when {
                branch 'main'
            }
        }
    }
    
    post {
        always {
            junit '**/target/surefire-reports/*.xml'
        }
        failure {
            notifySlack('#scm-alerts', "Build failed: ${env.BUILD_URL}")
        }
        success {
            notifySlack('#scm-notifications', "Build succeeded: ${env.BUILD_URL}")
        }
    }
}
```

---

## 2. K8s 部署配置

### 2.1 Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hj-scm-backend
  namespace: prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hj-scm-backend
  template:
    metadata:
      labels:
        app: hj-scm-backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/hj-scm/hj-scm:${{ .Values.imageTag }}
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: JAVA_OPTS
          value: "-Xms512m -Xmx1536m"
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
---
apiVersion: v1
kind: Service
metadata:
  name: hj-scm-backend
  namespace: prod
spec:
  selector:
    app: hj-scm-backend
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

### 2.2 HPA（自动扩缩容）

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: hj-scm-backend
  namespace: prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hj-scm-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 3. 非功能性需求

### 3.1 性能需求

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 页面加载时间 | < 2s | Lighthouse |
| API 响应时间 (P95) | < 500ms | APM 监控 |
| API 响应时间 (P99) | < 1s | APM 监控 |
| MRP 全量运算 | < 30s | 后端计时 |
| 齐套检查 | < 2s | API 计时 |
| 并发用户数 | 100 QPS | 压力测试 |
| 数据同步延迟 | < 5s | 消息队列监控 |
| What-if 分析 | < 30s | 内存计算 |

### 3.2 可用性需求

| 指标 | 目标值 | 备注 |
|------|--------|------|
| 系统可用性 | 99.9% | 年度停机 < 8.76h |
| 计划内维护窗口 | 每月第1周日 02:00-06:00 | 提前通知 |
| 故障恢复时间 (RTO) | < 1h | 灾难恢复 |
| 数据恢复点 (RPO) | < 5min | 数据备份 |

### 3.3 安全性需求

| 需求 | 说明 |
|------|------|
| 认证 | OAuth2 + JWT |
| 授权 | RBAC + ABAC |
| 加密 | TLS 1.3 + AES-256 |
| 审计 | 全链路日志记录 |
| 敏感数据脱敏 | 手机/身份证/银行卡 |
| 密码策略 | 复杂度 + 有效期 90 天 |
| 会话超时 | 30 分钟无操作 |

### 3.4 合规性需求

| 需求 | 说明 |
|------|------|
| 医养追溯 | 批次记录保留 5 年 |
| GDPR | 用户数据可删除 |
| 审计日志 | 不可篡改 |

---

## 4. 监控告警

### 4.1 关键指标

| 指标 | 阈值 | 告警级别 | 通知方式 |
|------|------|----------|----------|
| API 响应时间 P95 | > 500ms | WARNING | Slack |
| API 错误率 | > 1% | WARNING | Slack |
| CPU 使用率 | > 80% | WARNING | Slack |
| 内存使用率 | > 85% | WARNING | Slack |
| 磁盘使用率 | > 80% | WARNING | Slack |
| Pod 重启 | > 3/小时 | CRITICAL | SMS |
| 数据库连接池 | > 80% | WARNING | Slack |
| MQ 积压 | > 10000 | WARNING | Slack |

### 4.2 Prometheus 告警规则

```yaml
# prometheus/alert-rules.yml
groups:
- name: hj-scm-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
      
  - alert: HighAPILatency
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "API P95 latency > 500ms"
      
  - alert: HighCPUUsage
    expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]) * 100)) > 80
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "CPU usage > 80%"
```

---

## 5. 验收标准

### 5.1 CI/CD 验收

| 场景 | 验收条件 |
|------|----------|
| 自动构建 | 代码提交自动触发构建 |
| 自动测试 | 构建通过运行单元测试 |
| 自动部署 | 测试通过自动部署到 DEV |
| 手动审批 | PROD 部署需人工审批 |
| 回滚能力 | 一键回滚到上一版本 |

### 5.2 性能验收

| 场景 | 验收条件 |
|------|----------|
| 页面加载 | Lighthouse Score > 90 |
| API 响应 | P95 < 500ms |
| 并发测试 | 100 QPS 稳定运行 30min |
| 压力测试 | 200 QPS 无系统崩溃 |

### 5.3 安全验收

| 场景 | 验收条件 |
|------|----------|
| 漏洞扫描 | 无高危/严重漏洞 |
| 渗透测试 | 无高危漏洞 |
| 依赖检查 | 无高危依赖漏洞 |
| 访问控制 | 越权访问被阻止 |

---

## 6. 风险与应对

### 6.1 CI/CD 风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 构建失败率高 | 中 | 中 | 每日构建 + 代码评审 |
| 部署失败 | 中 | 高 | 蓝绿部署 + 回滚机制 |
| 环境差异 | 高 | 高 | Docker 统一环境 |

### 6.2 性能风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 性能瓶颈 | 中 | 高 | 定期压测 + 性能监控 |
| 内存溢出 | 低 | 高 | JVM 监控 + 自动重启 |
| 数据库慢查询 | 中 | 中 | 索引优化 + 查询审计 |

### 6.3 安全风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 数据泄露 | 低 | 高 | 加密 + 脱敏 |
| DDoS 攻击 | 低 | 高 | CDN + WAF |
| 注入攻击 | 中 | 高 | 输入校验 + 参数化查询 |

---

## 附录

### A. 相关文档

| 文档 | 路径 |
|------|------|
| Jenkinsfile | `Jenkinsfile` |
| K8s 配置 | `deployments/k8s/` |
| 监控配置 | `prometheus/` |

---

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14  
> **状态**: 待评审
