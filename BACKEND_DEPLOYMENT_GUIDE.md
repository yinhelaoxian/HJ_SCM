# HJ_SCM 后端构建与部署指南

## 环境要求

- JDK 17+
- Maven 3.8+
- PostgreSQL 14+
- Kafka 3.0+

## 构建步骤

### 1. 安装依赖（本地环境）

```bash
# macOS
brew install openjdk@17 maven postgresql kafka

# Ubuntu/Debian
sudo apt-get install openjdk-17-jdk maven postgresql kafka

# CentOS/RHEL
sudo yum install java-17-openjdk-devel maven postgresql kafka
```

### 2. 构建命令

```bash
cd /home/ubuntu/scm-hj

# 清理并编译
mvn clean compile

# 运行测试
mvn test

# 打包为JAR
mvn package -DskipTests

# 构建Docker镜像
docker build -t registry.cn-hangzhou.aliyuncs.com/hjscm:latest -f deployments/Dockerfile.backend .
```

### 3. 数据库初始化

```bash
# 创建数据库
psql -U postgres -c "CREATE DATABASE hjscm;"

# 执行DDL脚本
psql -U postgres -d hjscm -f sql/schema.sql
```

### 4. 启动服务

```bash
# 开发环境
java -jar target/hjscm-backend.jar --spring.profiles.active=dev

# 生产环境
java -jar target/hjscm-backend.jar --spring.profiles.active=prod
```

### 5. Kubernetes 部署

```bash
# 部署到开发环境
kubectl apply -f deployments/k8s/dev/

# 部署到生产环境
kubectl apply -f deployments/k8s/prod/
```

## 当前状态

| 组件 | 状态 | 说明 |
|------|------|------|
| 后端代码 | ✅ 完成 | StateMachineEngine + TraceIdService |
| API文档 | ✅ 完成 | RESTful API 已定义 |
| 数据库DDL | ⏳ 待执行 | 需要PostgreSQL环境 |
| Docker镜像 | ⏳ 待构建 | 需要Docker环境 |
| K8s部署 | ⏳ 待执行 | 需要K8s集群 |

## 下一步行动

1. ✅ 文档已提交
2. ✅ 前端已构建（dist/）
3. ⏳ 后端需在有Java环境时构建
4. ⏳ 部署需在有K8s环境时执行

---

**创建时间**: 2026-02-14
