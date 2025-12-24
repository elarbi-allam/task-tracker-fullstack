# Build stage: compile using official Maven image
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml mvnw ./
COPY .mvn .mvn
# Download dependencies
RUN mvn -B -DskipTests dependency:go-offline
COPY src ./src
# Package the application (skip tests for faster image builds)
RUN mvn -B -DskipTests package

# Runtime stage: smaller JRE image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]