FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Install necessary packages
RUN apk add --no-cache curl

# Copy the Maven wrapper files
COPY mvnw .
COPY .mvn .mvn

# Make the mvnw script executable
RUN chmod +x mvnw

# Copy the project files
COPY pom.xml .
COPY src src

# Build the application
RUN ./mvnw package -DskipTests

# Expose the application port
EXPOSE 8080

# Run the application
CMD ["./mvnw", "spring-boot:run"] 