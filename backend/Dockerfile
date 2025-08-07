# 多阶段构建，优化镜像大小
FROM openjdk:17-jdk-slim as builder

WORKDIR /build

# 复制Maven相关文件
COPY pom.xml .
COPY src ./src

# 安装Maven
RUN apt-get update && apt-get install -y maven

# 构建应用
RUN mvn clean package -DskipTests

# 运行时镜像
FROM openjdk:17-jdk-slim

# 创建应用用户
RUN groupadd -r riverad && useradd -r -g riverad riverad

# 设置时区
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 安装必要的工具
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 从构建阶段复制jar文件
COPY --from=builder /build/target/*.jar app.jar

# 创建日志目录
RUN mkdir -p logs && chown -R riverad:riverad /app

# 切换到应用用户
USER riverad

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# JVM 参数优化
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseContainerSupport -Djava.security.egd=file:/dev/./urandom"

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]