FROM eclipse-temurin:17-jdk-alpine
LABEL maintainer="Elarbi Allam"

WORKDIR /app
COPY target/*.jar app.jar

EXPOSE 8080

# 6. Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]