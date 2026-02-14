# Jenkinsfile for HJ_SCM CI/CD
pipeline {
    agent any
    
    environment {
        APP_NAME = 'hjscm'
        DOCKER_REGISTRY = 'registry.cn-hangzhou.aliyuncs.com'
        SONAR_URL = 'http://sonarqube:9000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean compile -DskipTests'
            }
        }
        
        stage('Unit Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('SonarQube') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'trivy image ${APP_NAME}:${BUILD_NUMBER} || true'
            }
        }
        
        stage('Build Docker') {
            steps {
                sh "docker build -t ${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} -f deployments/Dockerfile.backend ."
            }
        }
        
        stage('Push Docker') {
            steps {
                sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}"
            }
        }
        
        stage('Deploy Dev') {
            steps {
                sh 'kubectl apply -f k8s/dev/ -n hjscm-dev'
                sh 'kubectl rollout status deployment/hjscm-backend -n hjscm-dev'
            }
        }
        
        stage('Deploy Prod') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    input message: '确认部署到生产环境?', ok: '确认'
                }
                sh 'kubectl apply -f k8s/prod/ -n hjscm-prod'
                sh 'kubectl rollout status deployment/hjscm-backend -n hjscm-prod'
            }
        }
    }
    
    post {
        success {
            dingtalk (
                robot: 'scm-robot',
                type: 'LINK',
                title: "✅ HJ_SCM 构建成功",
                text: "版本: ${BUILD_NUMBER}\n环境: 生产环境\n状态: 部署完成"
            )
        }
        failure {
            dingtalk (
                robot: 'scm-robot',
                type: 'LINK',
                title: "❌ HJ_SCM 构建失败",
                text: "版本: ${BUILD_NUMBER}\n状态: 请检查日志"
            )
        }
    }
}
